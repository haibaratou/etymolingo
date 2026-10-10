#!/usr/bin/env python3
"""One-use, same-repository release runner. No credentials or cross-repository access."""
import base64, glob, hashlib, io, json, os, pathlib, re, shutil, subprocess, sys, zipfile
ROOT = pathlib.Path.cwd().resolve()
TEMP = '.dot-refresh-20261010'
WORKFLOW = '.github/workflows/dot-refresh-20261010.yml'

def require(ok, message):
    if not ok: raise RuntimeError(message)

def run(*args, capture=False):
    result = subprocess.run(args, cwd=ROOT, check=True, text=True, stdout=subprocess.PIPE if capture else None)
    return result.stdout.strip() if capture else None

def safe_path(value):
    require(isinstance(value, str) and value and '\\' not in value and '\x00' not in value, 'unsafe path')
    path = pathlib.PurePosixPath(value)
    require(not path.is_absolute() and all(p not in ('', '.', '..') for p in value.split('/')), 'noncanonical path')
    require((ROOT / path).resolve().is_relative_to(ROOT), 'path escapes repository')
    require(not any(p.is_symlink() for p in [ROOT/path, *(ROOT/path).parents] if p != ROOT.parent), 'symlink path')
    return path

def digest(data): return hashlib.sha256(data).hexdigest()
def blob(data): return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
def check_bytes(data, record):
    require(len(data) == record['bytes'] and digest(data) == record['sha256'] and blob(data) == record['blob'], 'payload hash mismatch: '+record['path'])

def git_blob(ref, path):
    result = subprocess.run(['git', 'rev-parse', '--verify', f'{ref}:{path}'], cwd=ROOT, text=True, capture_output=True)
    return result.stdout.strip() if result.returncode == 0 else None

def origin_head(): return run('git','ls-remote','--exit-code','origin','refs/heads/main',capture=True).split()[0]

def validate_archive(plan, directory):
    parts=[]
    for record in plan['chunks']:
        require(re.fullmatch(r'payload-\d{3}\.b64',record['file']) is not None,'invalid chunk name')
        data=(directory/record['file']).read_bytes()
        require(len(data)==record['bytes'] and digest(data)==record['sha256'],'chunk hash mismatch')
        parts.append(base64.b64decode(data,validate=True))
    archive=b''.join(parts)
    require(len(archive)==plan['archive_bytes'] and digest(archive)==plan['archive_sha256'],'archive hash mismatch')
    payload={}
    with zipfile.ZipFile(io.BytesIO(archive)) as z:
        names=z.namelist()
        expected={r['path'] for r in plan['files']}
        require(len(names)==len(set(names)) and set(names)==expected,'archive member allowlist mismatch')
        for record in plan['files']:
            info=z.getinfo(record['path'])
            require(not info.is_dir() and info.file_size==record['bytes'],'invalid zip entry')
            data=z.read(info);check_bytes(data,record);payload[record['path']]=data
    return payload

def main():
    os.environ['PYTHONDONTWRITEBYTECODE']='1'
    plan=json.loads((ROOT/TEMP/'plan.json').read_text())
    repo=plan['repository']; public=repo=='haibaratou/etymolingo'
    require(repo in ('haibaratou/etymolingo','haibaratou/etymon-source'),'repository outside scope')
    require(os.environ.get('GITHUB_REPOSITORY')==repo and os.environ.get('GITHUB_REF')=='refs/heads/main','incorrect action target')
    require(os.environ.get('GITHUB_EVENT_NAME')=='push','incorrect action event')
    require(plan['temporary_directory']==TEMP and plan['workflow_path']==WORKFLOW,'unexpected staging paths')
    head=run('git','rev-parse','HEAD',capture=True)
    require(head==os.environ.get('GITHUB_SHA'),'checkout differs from initiating commit')
    require(run('git','rev-parse','HEAD^',capture=True)==plan['baseline_commit'],'baseline changed; review required')
    require(origin_head()==head,'main moved after staging; review required')
    require(not run('git','status','--porcelain','--untracked-files=normal',capture=True),'checkout is not clean')
    require(git_blob('HEAD^',TEMP) is None and git_blob('HEAD^',WORKFLOW) is None,'temporary paths already existed')
    all_records=plan['files']+plan['generated_assets']
    paths=[r['path'] for r in all_records]
    require(len(paths)==len(set(paths)),'duplicate target')
    for record in all_records:
        p=str(safe_path(record['path']))
        require(record.get('mode')=='100644','unexpected file mode')
        require(p.startswith(('app/','assets/word/')) if public else p.startswith(('app/data/pie/','tools/')),'path outside release scope')
        require(not public or ('/pie/' not in p and 'history-' not in p and '/work/' not in p),'private source in public release')
        require(git_blob('HEAD',p)==record.get('before_blob'),'target baseline mismatch: '+p)
    temporary_files=run('git','ls-tree','-r','--name-only','HEAD','--',TEMP,capture=True).splitlines()
    expected_temporary={TEMP+'/plan.json',TEMP+'/run_release.py',*(TEMP+'/'+r['file'] for r in plan['chunks'])}
    require(set(temporary_files)==expected_temporary,'unexpected staging content')
    staged_only=set(run('git','diff','--name-only','HEAD^','HEAD',capture=True).splitlines())
    require(staged_only==expected_temporary|{WORKFLOW},'initiating commit contains unrelated changes')
    payload=validate_archive(plan,ROOT/TEMP)
    for path,data in payload.items():
        dest=ROOT/path;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data);dest.chmod(0o644)
    del payload
    if public:
        from PIL import __version__, features
        require(__version__==plan['pillow_version'] and features.version('webp')==plan['webp_version'],'renderer version drift')
        require(shutil.disk_usage(ROOT).free>=3_500_000_000,'insufficient free space before generation')
        run(sys.executable,'app/games/picture-words/refresh_reviewed_catalog.py','--root','.')
        for test in ('app/data/test_generated_image_resolver.py','app/data/test_caption_first_sense_guard.py','app/data/test_published_image_ids.py','app/games/picture-words/test_refresh_reviewed_catalog.py','app/eigo-no-e/test_build.py'):
            run(sys.executable,test)
        for directory in ('app/games/picture-words','app/eigo-no-e'):
            tests=sorted(glob.glob(directory+'/*.test.cjs'));require(bool(tests),'test files missing');run('node','--test',*tests)
        run(sys.executable,'app/games/picture-words/refresh_reviewed_catalog.py','--root','.','--check')
    else:
        for test in ('test_ja_readings.py','test_export_public_game_data.py','test_preserved_illustration_index.py'):
            run(sys.executable,'-m','unittest','discover','-s','tools','-p',test)
        run(sys.executable,'tools/check_roots.py')
    for record in all_records: check_bytes((ROOT/record['path']).read_bytes(),record)
    # Stage only the reviewed allowlist. Preserve every other tracked file and immutable asset.
    pathspec=pathlib.Path(os.environ['RUNNER_TEMP'])/'refresh-paths.nul'
    pathspec.write_bytes(b''.join(p.encode()+b'\0' for p in paths))
    run('git','add','--sparse','--pathspec-from-file='+str(pathspec),'--pathspec-file-nul')
    run('git','rm','--sparse','-r','--',TEMP)
    expected=set(paths)|expected_temporary
    actual=set(run('git','diff','--cached','--name-only',capture=True).splitlines())
    require(actual==expected,'staged paths differ from reviewed allowlist')
    for record in all_records:
        line=run('git','ls-files','--stage','--',record['path'],capture=True).split()
        require(line[:2]==[record['mode'],record['blob']],'staged blob/mode mismatch: '+record['path'])
    require(origin_head()==head,'main moved during build; no push attempted')
    run('git','-c','user.name=github-actions[bot]','-c','user.email=41898282+github-actions[bot]@users.noreply.github.com','commit','-m','Refresh reviewed dictionary and image catalogs (2026-10-10)')
    result=run('git','rev-parse','HEAD',capture=True)
    run('git','push','origin','HEAD:refs/heads/main')
    require(origin_head()==result,'published head readback mismatch')
    summary=f'Refresh committed and read back: {result}\nVerified {len(plan["files"])} regular files and {len(plan["generated_assets"])} new generated assets.\nOwner cleanup of {WORKFLOW} is still required.\n'
    print(summary)
    with open(os.environ['GITHUB_STEP_SUMMARY'],'a') as f:f.write(summary)

if __name__=='__main__': main()
