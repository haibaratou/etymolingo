import unittest
from generated_image_resolver import resolve_bindings


def row(w, roots=(), **extra):
    return dict(w=w, p=list(roots), ja='語', en='word', **extra)


def inventory(*stems):
    return {stem: {'path':'assets/word/'+stem+'.png', 'sha256':'a'*64, 'git_blob_sha':'b'*40} for stem in stems}


class ResolverTests(unittest.TestCase):
    def test_shared_default_is_never_guessed(self):
        result=resolve_bindings([row('bank',['one']),row('bank',['two'])],inventory('bank'),{})
        self.assertEqual(result['safe_primary'],[])
        self.assertEqual(result['assets'][0]['bindingStatus'],'ownership_pending')
        self.assertIsNone(result['assets'][0]['canonicalOwner'])

    def test_ambiguous_dated_default_uses_separate_sense_files(self):
        result=resolve_bindings([row('bank',['one']),row('bank',['two'])],inventory('bank','bank@one','bank@two'),{},[['bank','one','bank.png','1900-01-01'],['bank','two','bank.png','1900-01-01']])
        self.assertEqual({r['art'] for r in result['safe_primary']},{'bank@one','bank@two'})
        self.assertEqual(next(a for a in result['assets'] if a['art']=='bank')['bindingStatus'],'ownership_pending')

    def test_protected_binding_survives_lower_priority_conflict(self):
        result=resolve_bindings([row('bank',['one']),row('bank',['two'])],inventory('bank','bank@two'),{'["bank","one"]':'bank'},[['bank','two','bank.png']])
        self.assertEqual({(r['p'][0],r['art']) for r in result['safe_primary']},{('one','bank'),('two','bank@two')})
        self.assertEqual(result['summary']['preservedProtectedBindings'],1)

    def test_mortar_binding_and_old_asset_are_distinct(self):
        result=resolve_bindings([row('mortar',['mer-2'])],inventory('mortar','mortar@construction'),{'["mortar","mer-2"]':'mortar@construction'},[['mortar','mer-2','mortar.png'],['mortar','mer-2','mortar@construction.png']])
        self.assertEqual(result['safe_primary'][0]['art'],'mortar@construction')
        self.assertEqual(next(a for a in result['assets'] if a['art']=='mortar')['assetRole'],'owned_alternate_or_superseded')

    def test_I_and_case_are_exact(self):
        result=resolve_bindings([row('I',['eg']),row('i',['letter'])],inventory('i','i@letter'),{'["I","eg"]':'i'})
        self.assertEqual({(r['w'],r['art']) for r in result['safe_primary']},{('I','i'),('i','i@letter')})

    def test_caption_date_pos_v_and_case_do_not_filter(self):
        words=[row('Aword',v=False,pos='助'),row('newword',v=False)]
        result=resolve_bindings(words,inventory('Aword','newword'),{})
        self.assertEqual(len(result['safe_primary']),2)
        self.assertEqual(len(resolve_bindings(words+[row('addedword')],inventory('Aword','newword','addedword'),{})['safe_primary']),3)

    def test_duplicate_rows_with_same_identity_deduplicate(self):
        result=resolve_bindings([row('constable',v=True),row('constable',v=False)],inventory('constable'),{})
        self.assertEqual(len(result['safe_primary']),1)
        self.assertEqual(result['safe_primary'][0]['canonicalRowIndices'],[0,1])

    def test_immutable_copy_requires_name_and_byte_identity(self):
        digest='a'*64
        inv=inventory('cat','cat@'+digest,'cat@'+'c'*64)
        result=resolve_bindings([row('cat')],inv,{})
        self.assertEqual(result['summary']['immutableAliases'],1)
        self.assertEqual(next(a for a in result['assets'] if a['art']=='cat@'+'c'*64)['bindingStatus'],'ownership_pending')

    def test_unknown_asset_has_no_fabricated_headword(self):
        result=resolve_bindings([],inventory('looks_like_a_word'),{})
        asset=result['assets'][0]
        self.assertEqual(asset['bindingStatus'],'ownership_pending')
        self.assertIsNone(asset['canonicalOwner'])
        self.assertNotIn('w',asset)

    def test_protected_conflicts_fail_closed(self):
        with self.assertRaises(ValueError):
            resolve_bindings([row('one'),row('two')],inventory('shared'),{'["one",""]':'shared','["two",""]':'shared'})

    def test_every_input_png_returned_once(self):
        result=resolve_bindings([row('cat')],inventory('cat','cat_alt1','_placeholder','unknown'),{})
        self.assertEqual(len(result['assets']),4)
        self.assertEqual(len({a['art'] for a in result['assets']}),4)

    def test_no_unvalidated_cross_word_hash_alias(self):
        result=resolve_bindings([row('catch')],inventory('catch','catch_ball'),{})
        self.assertEqual(next(a for a in result['assets'] if a['art']=='catch_ball')['bindingStatus'],'ownership_pending')

if __name__=='__main__': unittest.main()
