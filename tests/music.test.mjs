import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPhilosophers } from '../src/lib/philosophers.mjs';
import { TRACKS, SCHOOL, HOME_TRACK, trackFor, musicCredit } from '../src/lib/music.mjs';

test('mọi triết gia đều có nhạc', () => {
  for (const p of loadPhilosophers()) assert.ok(trackFor(p.id).key in TRACKS, p.id);
});

test('không gán nhạc cho id không tồn tại', () => {
  const ids = new Set(loadPhilosophers().map((p) => p.id));
  for (const id of Object.keys(SCHOOL)) assert.ok(ids.has(id), id);
  assert.equal(Object.keys(SCHOOL).length, 50);
});

test('mọi key đều được dùng', () => {
  const used = new Set([...Object.values(SCHOOL), HOME_TRACK]);
  for (const k of Object.keys(TRACKS)) assert.ok(used.has(k), k);
});

test('trang chủ', () => {
  assert.equal(trackFor().key, 'ba-roc');
});

test('id lạ thì báo lỗi', () => {
  assert.throws(() => trackFor('khong-co'), /Chưa gán nhạc cho khong-co/);
});

test('vài cặp đúng trường phái', () => {
  assert.equal(trackFor('aquinas').key, 'binh-ca');
  assert.equal(trackFor('camus').key, 'paris');
  assert.equal(trackFor('hegel').key, 'lang-man-duc');
  assert.equal(trackFor('marcus-aurelius').key, 'hy-lap-co');
});

test('ghi công được escape', () => {
  const h = musicCredit({ ...TRACKS['paris'], performer: 'A <b>', license: 'CC0', source: 'https://x' });
  assert.ok(h.includes('A &lt;b&gt;'));
  assert.ok(h.includes('href="https://x"'));
});

test('file nhạc có thật và đủ nhỏ', () => {
  for (const [key, t] of Object.entries(TRACKS)) {
    assert.equal(t.file, `/audio/${key}.mp3`);
    const size = fs.statSync(path.join('public', t.file)).size;
    assert.ok(size > 100000 && size <= 5 * 1024 * 1024, `${key}: ${size}`);
  }
});

test('giấy phép hợp lệ', () => {
  for (const [key, t] of Object.entries(TRACKS)) {
    assert.match(t.license, /^(Public Domain|CC0|CC BY( \d\.\d)?|CC BY-SA( \d\.\d)?)$/, key);
    assert.notEqual(t.performer, '', key);
    assert.ok(t.source.startsWith('https://'), key);
  }
});
