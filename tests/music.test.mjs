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
  assert.equal(trackFor('marcus-aurelius').key, 'la-ma');
});

test('ghi công được escape', () => {
  const h = musicCredit({ ...TRACKS['paris'], performer: 'A <b>', license: 'CC0', source: 'https://x' });
  assert.ok(h.includes('A &lt;b&gt;'));
  assert.ok(h.includes('href="https://x"'));
});
