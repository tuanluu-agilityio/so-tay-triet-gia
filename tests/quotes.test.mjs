import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPhilosophers, ERAS } from '../src/lib/philosophers.mjs';

const PH = loadPhilosophers();
const all = () => PH.flatMap((p) => p.quotes.map(([q, src]) => ({ id: p.id, q, src })));
// Bỏ dấu câu, khoảng trắng thừa và chữ hoa để so câu trùng
const norm = (s) => s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();

ERAS.forEach((era, i) => {
  test(`thời kỳ ${era}: mỗi người đúng 5 câu`, () => {
    for (const p of PH.filter((p) => p.era === i)) assert.equal(p.quotes.length, 5, p.id);
  });
});

test('định dạng: mỗi câu là [câu, nguồn] không rỗng', () => {
  for (const p of PH) for (const x of p.quotes) {
    assert.equal(x.length, 2, p.id);
    for (const s of x) assert.ok(typeof s === 'string' && s.trim(), `${p.id}: ${x}`);
  }
});

test('định dạng: câu không tự bọc ngoặc kép', () => {
  for (const { id, q } of all()) assert.doesNotMatch(q, /^["“”«»]|["“”«»]$/, `${id}: ${q}`);
});

test('định dạng: dấu sao nghiêng đóng mở đủ cặp', () => {
  for (const { id, q, src } of all()) for (const s of [q, src]) assert.equal((s.match(/\*/g) || []).length % 2, 0, `${id}: ${s}`);
});

test('định dạng: câu không quá 300 ký tự', () => {
  for (const { id, q } of all()) assert.ok(q.length <= 300, `${id}: ${q.length} ký tự`);
});

test('định dạng: không có câu trùng', () => {
  const seen = new Map();
  for (const { id, q } of all()) {
    const k = norm(q);
    assert.ok(!seen.has(k), `${id} trùng với ${seen.get(k)}: ${q}`);
    seen.set(k, id);
  }
});

// Câu nổi tiếng nhưng không phải của người được gán: nếu có mặt thì nguồn phải nói rõ
const MISATTRIBUTED = [
  ['voltaire', /không đồng ý.*bảo vệ/i],
  ['aristotle', /lặp đi lặp lại/i],
  ['plato', /người chết.*chiến tranh/i],
  ['machiavelli', /mục đích biện minh/i],
];
test('định dạng: câu hay bị gán nhầm phải ghi rõ', () => {
  for (const [id, re] of MISATTRIBUTED) for (const [q, src] of PH.find((p) => p.id === id).quotes) {
    if (re.test(q)) assert.match(src, /gán|đời sau|không có nguyên văn/i, `${id}: ${q}`);
  }
});
