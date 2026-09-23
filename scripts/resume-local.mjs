/** Local bridge only: private content and build output stay in the private checkout. */
import {existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, writeFileSync} from 'node:fs';
import {dirname, isAbsolute, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = join(ROOT, '.resume-local/config.json');

export function assertSafePath(path) {
  for (let part = resolve(path); ; part = dirname(part)) {
    // lstat also detects dangling links.
    try { if (lstatSync(part).isSymbolicLink()) throw new Error(`Symlink path is not allowed: ${part}`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (part === dirname(part)) break;
  }
}

export function validateRepo(path, root = ROOT) {
  const repo = realpathSync(resolve(path));
  const rel = relative(realpathSync(root), repo);
  if (!rel || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + sep))) {
    throw new Error('Private resume source must live outside the public repository.');
  }
  for (const file of ['content/catalog.yaml', 'content/variants/public.yaml', 'scripts/resume_variant.py', 'scripts/build_public_resume.py', 'pyproject.toml', 'uv.lock']) {
    const target = join(repo, file);
    assertSafePath(target);
    if (!existsSync(target) || !lstatSync(target).isFile()) throw new Error(`Private source is missing ${file}. Use a current resume checkout.`);
  }
  assertSafePath(join(repo, 'content/variants/private'));
  return repo;
}

export function selection(repo, name) {
  if (name === 'public-en' || name === 'public-zh') {
    return {source: join(repo, 'content/variants/public.yaml'), script: 'scripts/build_public_resume.py', args: [],
      output: join(repo, `.public-build/bundle/public/downloads/resume-${name.slice(-2)}.pdf`), build: join(repo, '.public-build')};
  }
  if (!/^resume_[\p{L}\p{N}_-]+$/u.test(name || '')) throw new Error('Choose a version from npm run resume:list.');
  const source = join(repo, 'content/variants/private', name + '.yaml');
  assertSafePath(source);
  if (!existsSync(source) || !lstatSync(source).isFile()) throw new Error('Unknown private version. Run npm run resume:list.');
  return {source, script: 'scripts/resume_variant.py', args: [name],
    output: join(repo, '.private-build', name, name + '.pdf'), build: join(repo, '.private-build', name)};
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {cwd, stdio: 'inherit', shell: false});
  if (result.error) throw new Error(`Cannot run ${command}: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`${command} failed (${result.status ?? result.signal}).`);
}

function openFiles(files, edit = false) {
  if (edit && process.env.RESUME_EDITOR) return run(process.env.RESUME_EDITOR, files, ROOT);
  if (process.platform === 'darwin') return run('open', [...(edit ? ['-t'] : []), ...files], ROOT);
  if (process.platform === 'linux') { for (const file of files) run('xdg-open', [file], ROOT); return; }
  throw new Error(`Open these files in your editor/viewer:\n${files.join('\n')}\nFor editing, RESUME_EDITOR can name an editor executable.`);
}

export function main(args = process.argv.slice(2)) {
  const [command, name, ...extra] = args;
  if (!['setup', 'list', 'edit', 'pdf', 'preview', 'studio'].includes(command) || extra.length) {
    throw new Error('Usage: resume-local.mjs setup <private-repo> | list | edit [version] | pdf <version> | preview <version> | studio');
  }
  if (command === 'setup') {
    if (!name) throw new Error('Provide the private checkout path. This command does not clone or change it.');
    const repo = validateRepo(name);
    assertSafePath(CONFIG);
    mkdirSync(dirname(CONFIG), {recursive: true, mode: 0o700});
    writeFileSync(CONFIG, JSON.stringify({repo}, null, 2) + '\n', {mode: 0o600});
    console.log('Private resume checkout configured locally.');
    return;
  }
  assertSafePath(CONFIG);
  const configured = process.env.RESUME_REPO || (existsSync(CONFIG) && JSON.parse(readFileSync(CONFIG, 'utf8')).repo);
  if (!configured) throw new Error('First run npm run resume:setup -- /absolute/path/to/private/resume (or set RESUME_REPO).');
  const repo = validateRepo(configured);
  if (command === 'studio') {
    if (name) throw new Error('resume:studio takes no version.');
    run('uv', ['run', '--frozen', '--all-extras', '--group', 'publishing', 'python', join(ROOT, 'tools/resume-studio/server.py'), '--repo', repo], repo);
    return;
  }
  if (command === 'list') {
    if (name) throw new Error('resume:list takes no version.');
    console.log(['public-en', 'public-zh', ...readdirSync(join(repo, 'content/variants/private')).filter(n => n.endsWith('.yaml')).map(n => n.slice(0, -5)).sort()].join('\n'));
    return;
  }
  const target = name ? selection(repo, name) : null;
  if (command === 'edit') {
    const files = [join(repo, 'content/catalog.yaml'), ...(target ? [target.source] : [])];
    console.log(files.join('\n'));
    openFiles(files, true);
    return;
  }
  if (!target) throw new Error('Provide a version from npm run resume:list.');
  assertSafePath(target.build);
  assertSafePath(target.output);
  if (existsSync(target.build)) {
    for (const entry of readdirSync(target.build, {recursive: true, withFileTypes: true})) {
      if (entry.isSymbolicLink()) throw new Error('Symlink in build directory is not allowed.');
    }
  }
  // The private renderer owns intermediate/output paths; nothing is copied to public/.
  run('uv', ['run', '--frozen', '--all-extras', '--group', 'publishing', 'python', target.script, ...target.args], repo);
  assertSafePath(target.output);
  if (!readFileSync(target.output).subarray(0, 5).equals(Buffer.from('%PDF-'))) throw new Error('Renderer did not produce a PDF.');
  console.log(`PDF: ${target.output}`);
  if (command === 'preview') openFiles([target.output]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
