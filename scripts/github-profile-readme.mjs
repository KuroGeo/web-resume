// GitHub profile adapter. Only the already public resume JSON is an input.
import {readFileSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {validatePublicResume} from './build-resume-site.mjs';

const PROFILE = 'KuroGeo/KuroGeo';
const SOURCE = 'KuroGeo/web-resume';
const markdown = value => String(value).replace(/\s+/g, ' ').trim().replace(/[\\`*_{}\[\]<>|]/g, '\\$&');
const section = (locale, id) => {
  const found = locale.sections.find(item => item.id === id);
  if (!found?.items.length) throw new Error(`Public resume is missing ${id}.`);
  return found.items;
};

export function renderGitHubProfile(data) {
  const {identity, copy} = validatePublicResume(data).locales.en;
  const locale = data.locales.en;
  const intro = copy.text['intro.copy'];
  if (!intro) throw new Error('Public resume is missing the English introduction.');
  const projects = section(locale, 'projects');
  const experience = section(locale, 'experience')[0];
  const education = section(locale, 'education')[0];
  const skills = section(locale, 'skills');
  if (!experience.title || !experience.role || !experience.date || !education.title || !education.role || !education.date) {
    throw new Error('Public resume is missing experience or education details.');
  }
  const projectLines = projects.map(project => {
    if (!project.title || !project.paragraphs.length) throw new Error('Public project is incomplete.');
    const title = project.url ? `[${markdown(project.title)}](${project.url})` : markdown(project.title);
    return `- **${title}** · ${project.paragraphs.map(markdown).join(' ')}`;
  });
  const skillLines = skills.map(item => {
    if (!item.label || !item.paragraphs.length) throw new Error('Public skill is incomplete.');
    return `- **${markdown(item.label.replace(/[:：]\s*$/, ''))}:** ${item.paragraphs.map(markdown).join(' ')}`;
  });
  const linkedIn = identity.connections.split('·').map(value => value.trim())
    .find(value => /^linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(value));
  const contacts = ['- [Portfolio and résumé (English / 中文)](https://kurogeo.github.io/web-resume/)'];
  if (linkedIn) contacts.push(`- [LinkedIn](https://${linkedIn})`);
  if (identity.email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email)) throw new Error('Invalid public email address.');
    contacts.push(`- [Email](mailto:${identity.email})`);
  }
  return [
    `# Hi, I'm ${markdown(identity.name)}`,
    '',
    markdown(intro),
    '',
    '## Selected work',
    '',
    ...projectLines,
    '',
    '## Experience',
    '',
    `- **${markdown(experience.title)}** — ${markdown(experience.role)} · ${markdown(experience.date)}`,
    `- **${markdown(education.title)}** — ${markdown(education.role)} · ${markdown(education.date)}`,
    '',
    '## Expertise',
    '',
    ...skillLines,
    '',
    '## Connect',
    '',
    ...contacts,
    ''
  ].join('\n');
}

function github(endpoint, fields) {
  const args = ['api', endpoint];
  if (fields) {
    args.push('--method', 'PUT');
    for (const [key, value] of Object.entries(fields)) args.push('-f', `${key}=${value}`);
  }
  const result = spawnSync('gh', args, {encoding: 'utf8', maxBuffer: 4 * 1024 * 1024});
  if (result.error) throw new Error(`Cannot run gh: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`GitHub request failed: ${result.stderr.trim() || result.stdout.trim()}`);
  return JSON.parse(result.stdout);
}

function remoteFile(repo, path, ref) {
  const response = github(`repos/${repo}/contents/${path}${ref ? `?ref=${ref}` : ''}`);
  if (response.encoding !== 'base64' || !response.sha || !response.content) throw new Error('Unexpected GitHub file response.');
  return {sha: response.sha, content: Buffer.from(response.content.replace(/\s/g, ''), 'base64').toString('utf8')};
}

export function main(args = process.argv.slice(2), root = process.cwd()) {
  if (args.length > 1 || (args[0] && !['--check', '--publish'].includes(args[0]))) {
    throw new Error('Usage: npm run resume:github [-- --check | --publish]');
  }
  const source = readFileSync(join(root, 'public/generated/resume.json'), 'utf8');
  const data = validatePublicResume(JSON.parse(source));
  const readme = renderGitHubProfile(data);
  if (!args.length) {
    process.stdout.write(readme);
    return;
  }
  const current = remoteFile(PROFILE, 'README.md');
  if (current.content === readme) {
    console.log('GitHub profile README is up to date.');
    return;
  }
  if (args[0] === '--check') {
    console.log('GitHub profile README differs from the public resume. Run npm run resume:github -- --publish to update it.');
    process.exitCode = 1;
    return;
  }
  // Publishing must use the same public data that the website has received.
  const published = JSON.parse(remoteFile(SOURCE, 'public/generated/resume.json', 'main').content);
  if (JSON.stringify(data) !== JSON.stringify(validatePublicResume(published))) {
    throw new Error('Local public resume differs from KuroGeo/web-resume main. Update the public resume checkout first.');
  }
  github(`repos/${PROFILE}/contents/README.md`, {
    message: 'Sync profile README with public resume',
    content: Buffer.from(readme).toString('base64'),
    sha: current.sha
  });
  if (remoteFile(PROFILE, 'README.md').content !== readme) throw new Error('GitHub did not return the published README.');
  console.log(`Updated https://github.com/${PROFILE}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
