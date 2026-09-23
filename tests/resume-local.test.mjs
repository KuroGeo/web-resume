import test from 'node:test';
import assert from 'node:assert/strict';
import {realpathSync,mkdtempSync,mkdirSync,writeFileSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {validateRepo,selection,assertSafePath} from '../scripts/resume-local.mjs';
function fixture(t){
 const base=realpathSync(mkdtempSync(join(tmpdir(),'resume-bridge-')));
 t.after(()=>rmSync(base,{recursive:true,force:true}));
 const web=join(base,'web'),repo=join(base,'private');
 for(const p of [web,join(repo,'content/variants/private'),join(repo,'scripts')])mkdirSync(p,{recursive:true});
 for(const p of ['content/catalog.yaml','content/variants/public.yaml','scripts/resume_variant.py','scripts/build_public_resume.py','pyproject.toml','uv.lock'])writeFileSync(join(repo,p),'');
 writeFileSync(join(repo,'content/variants/private/resume_example.yaml'),'');
 return {base,web,repo};
}
test('private source must live outside the public repository, including symlinks',t=>{
 const {web,repo}=fixture(t);assert.equal(validateRepo(repo,web),repo);
 assert.throws(()=>validateRepo(web,web),/outside/);
 symlinkSync(web,join(repo,'alias'),'dir');assert.throws(()=>validateRepo(join(repo,'alias'),web),/outside/);
});
test('reject incomplete source and traversal variants before invoking a process',t=>{
 const {repo,web}=fixture(t);
 for(const name of ['../resume_example','--all','resume_missing','resume_example;echo'])assert.throws(()=>selection(repo,name));
 assert.equal(selection(repo,'resume_example').output,join(repo,'.private-build/resume_example/resume_example.pdf'));
 assert.equal(selection(repo,'public-zh').output,join(repo,'.public-build/bundle/public/downloads/resume-zh.pdf'));
 rmSync(join(repo,'uv.lock'));assert.throws(()=>validateRepo(repo,web),/uv.lock/);
});
test('refuse symlink build destinations before the private renderer runs',t=>{
 const {repo,web}=fixture(t);symlinkSync(web,join(repo,'.private-build'),'dir');
 assert.throws(()=>assertSafePath(join(repo,'.private-build/resume_example/resume_example.pdf')),/Symlink/);
});
