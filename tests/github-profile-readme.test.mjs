import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderGitHubProfile} from '../scripts/github-profile-readme.mjs';

const source = JSON.parse(readFileSync(new URL('../public/generated/resume.json', import.meta.url), 'utf8'));

test('GitHub README follows the public identity and selected projects', () => {
  const data = structuredClone(source);
  data.locales.en.identity.name = 'Updated Name';
  data.locales.en.sections.find(section => section.id === 'projects').items[0].title = 'Updated Project';
  data.locales.en.sections.push({id: 'unpublished-note', title: 'Unpublished note', items: [{paragraphs: ['Private sentinel']}]});
  const result = renderGitHubProfile(data);
  assert.match(result, /^# Hi, I'm Updated Name/m);
  assert.match(result, /Updated Project/);
  assert.doesNotMatch(result, /Private sentinel/);
  assert.doesNotMatch(result, /GMV from RMB/);
  assert.equal(renderGitHubProfile(data), result);
});

test('GitHub README escapes Markdown and requires public source fields', () => {
  const data = structuredClone(source);
  data.locales.en.identity.name = 'Name *with* [markup]';
  assert.ok(renderGitHubProfile(data).includes('Name \\*with\\* \\[markup\\]'));
  delete data.locales.en.copy.text['intro.copy'];
  assert.throws(() => renderGitHubProfile(data), /introduction/);
});
