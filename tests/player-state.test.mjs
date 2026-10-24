import test from 'node:test';
import assert from 'node:assert/strict';
import { PREF_KEY, POS_KEY, readPref, writePref, readPos, writePos } from '../src/lib/player-state.mjs';

class MapStorage {
  m = new Map();
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null; }
  setItem(k, v) { this.m.set(k, String(v)); }
}
const broken = {
  getItem() { throw new Error('bị chặn'); },
  setItem() { throw new Error('bị chặn'); },
};

test('mặc định tắt', () => {
  assert.equal(readPref(new MapStorage()), false);
});

test('nhớ bật/tắt', () => {
  const s = new MapStorage();
  writePref(s, true);
  assert.equal(readPref(s), true);
  writePref(s, false);
  assert.equal(readPref(s), false);
});

test('storage hỏng không làm sập', () => {
  assert.equal(readPref(broken), false);
  assert.equal(readPos(broken, 'ba-roc'), 0);
  assert.doesNotThrow(() => writePref(broken, true));
  assert.doesNotThrow(() => writePos(broken, 'ba-roc', 1));
  assert.equal(readPref(null), false);
  assert.equal(readPos(null, 'ba-roc'), 0);
  assert.doesNotThrow(() => writePref(null, true));
  assert.doesNotThrow(() => writePos(null, 'ba-roc', 1));
});

test('cùng bài thì nghe tiếp', () => {
  const s = new MapStorage();
  writePos(s, 'ba-roc', 42.5);
  assert.equal(readPos(s, 'ba-roc'), 42.5);
});

test('khác bài thì từ đầu', () => {
  const s = new MapStorage();
  writePos(s, 'ba-roc', 42.5);
  assert.equal(readPos(s, 'paris'), 0);
});

test('dữ liệu rác', () => {
  const s = new MapStorage();
  s.setItem(POS_KEY, '{oops');
  assert.equal(readPos(s, 'ba-roc'), 0);
  s.setItem(POS_KEY, '{"key":"ba-roc","t":-3}');
  assert.equal(readPos(s, 'ba-roc'), 0);
  s.setItem(POS_KEY, 'null');
  assert.equal(readPos(s, 'ba-roc'), 0);
  assert.equal(PREF_KEY, 'stgt-music-on');
});
