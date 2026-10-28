"""Install view fragments in the one character-manager document.
Only extracts existing UI. Never writes the two retired root HTML entrances.
"""
import argparse
import json
import re
from pathlib import Path
SUPPORT=Path(__file__).resolve().parent
ROOT=SUPPORT.parents[2]

def write(path,text):
    path.parent.mkdir(parents=True,exist_ok=True)
    temporary=path.with_name(path.name+'.manager-tmp')
    temporary.write_text(text,encoding='utf-8',newline='\n')
    temporary.replace(path)

def body_markup(text):
    text=re.sub(r'<script\b[^>]*>[\s\S]*?</script>|<style\b[^>]*>[\s\S]*?</style>|<title>[\s\S]*?</title>','',text)
    return re.sub(r'<!doctype[^>]*>|</?(?:html|head|body)\b[^>]*>|<(?:base|meta|link)\b[^>]*>','',text,flags=re.I).strip()

def markup(mode,text,root):
    write(root/'app/support/character-manager'/(mode+'-markup.js'),
          '// View fragment initialized inside character-manager.html.\nwindow.WILDWORDOPIA_'+mode.upper()+'_MARKUP='+json.dumps(text,ensure_ascii=False)+';\n')

def scoped_css(mode,text):
    text=re.sub(r'(^|[}])\s*(?:html|body)(?=\s*\{)',r'\1:scope',text)
    return '@scope (#view-'+mode+') {\n'+text+'\n}\n'

def install_comparison(html_text,root=ROOT):
    root=Path(root)
    if '<article ' not in html_text or 'comparisonDeletedKey' not in html_text:
        raise ValueError('Expected production comparison UI, not an entrance loader')
    styles=re.findall(r'<style\b[^>]*>([\s\S]*?)</style>',html_text)
    scripts=re.findall(r'<script\b[^>]*>([\s\S]*?)</script>',html_text)
    if len(scripts)!=3:
        raise ValueError('Unexpected comparison script structure; inspect before updating')
    marker="(()=>{\nconst host=document.querySelector('header');if(!host||document.querySelector('#show-all-version-history'))return;"
    scripts[-1]=scripts[-1].split(marker)[0]
    scripts[-1]=re.sub(r'window\.WILDWORDOPIA_HISTORY_FILE_URL=[^\n]*\n','',scripts[-1],count=1)
    code='\n;\n'.join(scripts).replace('=scrollX','=window.scrollX').replace('=scrollY','=window.scrollY')
    code=('window.startCharacterComparison=function(runtime){\n'
          'const {document,window,parent,opener,scrollTo,localStorage}=runtime;\n'+code+
          '\nglobalThis.attachCharacterComparison(runtime,{main,initialRoots,getRemoved:()=>[...removedComparisonImages],setRoot:root=>{filter=root;apply();}});\n};\n')
    support=root/'app/support/character-manager'
    write(support/'comparison.css',scoped_css('comparison','\n'.join(styles)))
    write(support/'comparison.js',code)
    markup('comparison',body_markup(html_text),root)

def install_history(html_text,root=ROOT):
    root=Path(root);support=root/'app/support/character-manager'
    styles=re.findall(r'<style\b[^>]*>([\s\S]*?)</style>',html_text)
    if styles:write(support/'history.css',scoped_css('history','\n'.join(styles)))
    fragment=body_markup(html_text)
    write(support/'history-template.html',fragment+'\n')
    markup('history',fragment,root)

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--comparison',type=Path,help='Existing production comparison HTML; no generation')
    parser.add_argument('--history',type=Path,default=SUPPORT/'history-template.html')
    args=parser.parse_args()
    if args.comparison:install_comparison(args.comparison.read_text(encoding='utf-8-sig'))
    install_history(args.history.read_text(encoding='utf-8-sig'))
