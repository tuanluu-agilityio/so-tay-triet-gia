# Năm câu nói nổi tiếng cho mỗi triết gia: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mỗi triết gia trong 50 trang chi tiết có đúng 5 câu nói nổi tiếng, có nguồn rõ ràng, ở mục "Câu nói nổi tiếng".

**Architecture:** Không đổi code hiển thị: `renderDetail()` trong `src/lib/philosophers.mjs` đã lặp qua toàn bộ `p.quotes` và dựng `<blockquote>` cho từng câu. Việc chính là bổ sung trường `quotes` trong 8 file `src/data/*.js`, kèm một file test mới khóa số lượng và định dạng câu nói. Trang chủ (`index.astro`) không đọc `quotes` nên không phải sửa.

**Tech Stack:** Astro (trang tĩnh), dữ liệu dạng `PH.push({...})`, `node --test`.

**Spec:** Yêu cầu của chủ dự án: "thêm vào 5 câu nói nổi tiếng cho mỗi triết gia". Ràng buộc nội dung lấy từ `CLAUDE.md`.

## Global Constraints

- Mỗi triết gia có **đúng 5** phần tử trong `quotes`, mỗi phần tử là `[câu, nguồn]`, cả hai là chuỗi không rỗng.
- Giữ nguyên các câu đang có (đứng đầu, giữ thứ tự), câu mới thêm vào sau. Chỉ sửa câu cũ nếu nó vi phạm một quy tắc dưới đây, và ghi lý do vào commit message.
- Câu viết bằng tiếng Việt, giọng bình dân, dễ hiểu. Tự dịch, không chép bản dịch tiếng Việt đã xuất bản (trang có ghi "Nội dung được viết lại bằng lời văn dễ hiểu, không chép nguyên văn").
- Câu không được mở hoặc đóng bằng dấu ngoặc kép (`"`, `“`, `”`, `«`, `»`), vì CSS (`detail.css:99-100`) đã tự thêm “ ”.
- Câu dài tối đa 300 ký tự (chữ hiển thị cỡ 24–30px nghiêng; câu dài hơn sẽ chiếm cả màn hình điện thoại).
- Nguồn theo mẫu đang dùng: tên tác phẩm trong `*nghiêng*`, kèm quyển, số đoạn hoặc năm nếu có, ví dụ `"Epicurus, *Những châm ngôn chính*, số 27 (ý dịch)"`. Thêm `(ý dịch)` khi dịch thoát ý.
- Câu chỉ có qua lời người khác kể lại thì nguồn ghi rõ người kể: `"Theo Aristotle kể lại trong *Siêu hình học*"`, `"theo Diogenes Laërtius, *Cuộc đời các triết gia nổi tiếng*"`.
- Câu truyền miệng hoặc bị gán nhầm thì **hoặc bỏ đi, hoặc** giữ lại và nói rõ trong nguồn, theo mẫu của Socrates: `"Câu tóm tắt quen thuộc của đời sau, không có nguyên văn trong các bản ghi chép cổ"`. Không bịa nguồn, không ghi tác phẩm khi không chắc.
- Một câu chỉ xuất hiện ở một triết gia (ví dụ "Hãy tự biết mình" đã thuộc Thales, không đưa thêm vào Socrates).
- Chỉ dùng `*nghiêng*`, số dấu `*` trong mỗi chuỗi phải chẵn. Không dùng HTML (mọi thứ khác bị escape).
- Không thêm dependency. Comment và commit message viết tiếng Việt.
- Nội dung do AI viết phải được chủ dự án duyệt trước khi xuất bản: làm trên nhánh `feat/nam-cau-noi`, mở PR, không merge thẳng vào `main`.

**Người khó tìm đủ 5 câu** (Thales, Anaximander, Pythagoras, Zeno xứ Elea, Socrates, Diogenes): được dùng lời thuật lại của người đời sau (Aristotle, Simplicius, Hippolytus, Diogenes Laërtius, Plato, Xenophon…) với nguồn ghi "theo X kể lại", và được dùng câu tóm tắt học thuyết nếu nguồn nói rõ là tóm tắt. Ví dụ với Anaximander: "Khởi nguyên của mọi vật là cái vô hạn", nguồn "Theo Simplicius thuật lại từ Theophrastus (ý dịch)".

## Review Focus

1. **Câu nổi tiếng nhưng bị gán nhầm** được trình bày như lời thật (Voltaire "tôi không đồng ý với điều anh nói…" là của Evelyn Beatrice Hall; Aristotle "chúng ta là những gì ta lặp đi lặp lại" là của Will Durant; Plato "chỉ người chết mới thấy chiến tranh kết thúc" là của Santayana; Machiavelli "mục đích biện minh cho phương tiện" không có nguyên văn). Người đọc mong câu đó bị bỏ hoặc nguồn nói rõ là gán nhầm. Có test `định dạng: câu hay bị gán nhầm phải ghi rõ` ở Task 1.
2. **Câu trùng giữa hai triết gia** (thầy trò hay bị lẫn: Socrates/Plato, Seneca/Epictetus). Người đọc mong mỗi câu chỉ thuộc một người. Có test `định dạng: không có câu trùng` ở Task 1.
3. **Câu tự bọc trong ngoặc kép** khiến trang hiện hai lớp ngoặc “"…"”. Có test `định dạng: câu không tự bọc ngoặc kép` ở Task 1.
4. **Dấu `*` lẻ** (ví dụ tên sách mở `*` mà quên đóng) khiến dấu sao hiện ra trên trang. Có test `định dạng: dấu sao nghiêng đóng mở đủ cặp` ở Task 1.
5. **Câu quá dài** làm khối trích dẫn tràn màn hình điện thoại. Có test `định dạng: câu không quá 300 ký tự` ở Task 1, và kiểm tra bằng mắt ở Task 5.

---

### Task 1: Test câu nói và bổ sung thời kỳ Tiền Socrates

**Files:**
- Create: `tests/quotes.test.mjs`
- Modify: `src/data/1-tien-socrates.js` (7 người: thales, anaximander, pythagoras, heraclitus, parmenides, zeno-elea, democritus)

**Interfaces:**
- Consumes: `loadPhilosophers()` và `ERAS` từ `src/lib/philosophers.mjs`.
- Produces: các test tên `thời kỳ <ERAS[i]>: mỗi người đúng 5 câu` (một test cho mỗi thời kỳ, dùng `--test-name-pattern` để chạy riêng ở các task sau), cùng các test định dạng áp cho toàn bộ dữ liệu.

- [ ] **Step 1: Tạo nhánh**

Run: `git switch -c feat/nam-cau-noi`

- [ ] **Step 2: Viết `tests/quotes.test.mjs`**

```js
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
```

- [ ] **Step 3: Chạy test, xác nhận phần số lượng thất bại**

Run: `node --test tests/quotes.test.mjs`
Expected: 8 test `thời kỳ …: mỗi người đúng 5 câu` FAIL (ví dụ `thales` có 2, cần 5); 6 test định dạng còn lại PASS. Nếu test định dạng nào FAIL thì câu cũ đang vi phạm: sửa câu đó trước.

- [ ] **Step 4: Bổ sung câu cho 7 người trong `src/data/1-tien-socrates.js`** theo Global Constraints, đặc biệt mục "Người khó tìm đủ 5 câu".

- [ ] **Step 5: Chạy test của thời kỳ này và các test định dạng**

Run: `node --test --test-name-pattern="Tiền Socrates|định dạng" tests/quotes.test.mjs`
Expected: PASS hết. (7 test số lượng của các thời kỳ khác vẫn FAIL cho tới Task 5; đó là bình thường.)

- [ ] **Step 6: Commit**

```bash
git add tests/quotes.test.mjs src/data/1-tien-socrates.js
git commit -m "Thêm test câu nói nổi tiếng, bổ sung đủ 5 câu cho các triết gia Tiền Socrates"
```

### Task 2: Hy Lạp cổ điển và Hy Lạp hóa – La Mã

**Files:**
- Modify: `src/data/2-hy-lap-co-dien.js` (socrates, plato, diogenes, aristotle, epicurus)
- Modify: `src/data/3-hy-lap-hoa-la-ma.js` (zeno-citium, seneca, epictetus, marcus-aurelius, plotinus)

**Interfaces:**
- Consumes: test `thời kỳ <ERAS[i]>: mỗi người đúng 5 câu` và các test định dạng từ Task 1.

- [ ] **Step 1: Chạy test hai thời kỳ, xác nhận FAIL**

Run: `node --test --test-name-pattern="Hy Lạp" tests/quotes.test.mjs`
Expected: FAIL ở `thời kỳ Hy Lạp cổ điển` và `thời kỳ Hy Lạp hóa – La Mã`.

- [ ] **Step 2: Bổ sung câu cho 10 người.** Seneca, Epictetus, Marcus Aurelius trích từ thư, *Cẩm nang*, *Suy tưởng* kèm số thư/quyển/đoạn. Không đưa câu của Socrates vào Plato hay ngược lại.

- [ ] **Step 3: Chạy lại**

Run: `node --test --test-name-pattern="Hy Lạp|định dạng" tests/quotes.test.mjs`
Expected: PASS hết.

- [ ] **Step 4: Commit**

```bash
git add src/data/2-hy-lap-co-dien.js src/data/3-hy-lap-hoa-la-ma.js
git commit -m "Bổ sung đủ 5 câu nói cho triết gia Hy Lạp cổ điển và Hy Lạp hóa – La Mã"
```

### Task 3: Trung cổ và Phục hưng – Cận đại

**Files:**
- Modify: `src/data/4-trung-co.js` (augustine, anselm, aquinas, ockham)
- Modify: `src/data/5-phuc-hung-can-dai.js` (machiavelli, montaigne, bacon, hobbes, descartes, pascal, spinoza, locke, leibniz)

**Interfaces:**
- Consumes: như Task 2.

- [ ] **Step 1: Chạy test, xác nhận FAIL**

Run: `node --test --test-name-pattern="Trung cổ|Phục hưng" tests/quotes.test.mjs`
Expected: FAIL ở cả hai thời kỳ.

- [ ] **Step 2: Bổ sung câu cho 13 người.** "Dao cạo Ockham" ("không nên thêm thực thể khi không cần") không có nguyên văn trong sách Ockham: nếu dùng thì nguồn ghi rõ là cách phát biểu của đời sau. Machiavelli: không dùng "mục đích biện minh cho phương tiện" như lời thật (test chặn).

- [ ] **Step 3: Chạy lại**

Run: `node --test --test-name-pattern="Trung cổ|Phục hưng|định dạng" tests/quotes.test.mjs`
Expected: PASS hết.

- [ ] **Step 4: Commit**

```bash
git add src/data/4-trung-co.js src/data/5-phuc-hung-can-dai.js
git commit -m "Bổ sung đủ 5 câu nói cho triết gia Trung cổ và Phục hưng – Cận đại"
```

### Task 4: Khai sáng và Thế kỷ 19

**Files:**
- Modify: `src/data/6-khai-sang.js` (berkeley, voltaire, hume, rousseau, kant)
- Modify: `src/data/7-the-ky-19.js` (hegel, schopenhauer, mill, kierkegaard, marx, nietzsche)

**Interfaces:**
- Consumes: như Task 2.

- [ ] **Step 1: Chạy test, xác nhận FAIL**

Run: `node --test --test-name-pattern="Khai sáng|Thế kỷ 19" tests/quotes.test.mjs`
Expected: FAIL ở cả hai thời kỳ.

- [ ] **Step 2: Bổ sung câu cho 11 người.** Voltaire: câu "tôi không đồng ý…" là của Evelyn Beatrice Hall, nếu dùng phải ghi rõ (test chặn). Nietzsche hay bị gán câu không có trong sách: chỉ lấy câu tra được tác phẩm và số đoạn.

- [ ] **Step 3: Chạy lại**

Run: `node --test --test-name-pattern="Khai sáng|Thế kỷ 19|định dạng" tests/quotes.test.mjs`
Expected: PASS hết.

- [ ] **Step 4: Commit**

```bash
git add src/data/6-khai-sang.js src/data/7-the-ky-19.js
git commit -m "Bổ sung đủ 5 câu nói cho triết gia Khai sáng và thế kỷ 19"
```

### Task 5: Thế kỷ 20, cập nhật tài liệu, build và mở PR

**Files:**
- Modify: `src/data/8-the-ky-20.js` (russell, wittgenstein, heidegger, popper, sartre, arendt, beauvoir, camus, foucault)
- Modify: `CLAUDE.md` (dòng mô tả trường `quotes` ở mục "Dữ liệu triết gia")

**Interfaces:**
- Consumes: như Task 2.

- [ ] **Step 1: Chạy test, xác nhận FAIL**

Run: `node --test --test-name-pattern="Thế kỷ 20" tests/quotes.test.mjs`
Expected: FAIL ở `thời kỳ Thế kỷ 20`.

- [ ] **Step 2: Bổ sung câu cho 9 người.** Các tác giả này còn trong thời hạn bản quyền: chỉ trích câu ngắn, tự dịch, kèm tác phẩm và năm.

- [ ] **Step 3: Sửa `CLAUDE.md`:** trong danh sách trường của bản ghi, ngay sau `quotes[[câu, nguồn]]` thêm ghi chú `(đúng 5 câu; quy tắc định dạng nằm trong tests/quotes.test.mjs)`.

- [ ] **Step 4: Chạy toàn bộ test**

Run: `npm test`
Expected: PASS hết, kể cả `tests/music.test.mjs` và `tests/player-state.test.mjs`.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build thành công, 51 trang trong `dist/`.

- [ ] **Step 6: Kiểm tra bằng mắt**

Run: `npm run dev`, mở `http://localhost:4321/triet-gia/anaximander/` và `http://localhost:4321/triet-gia/marcus-aurelius/` ở bề ngang 375px và màn hình rộng.
Expected: mục "Câu nói nổi tiếng" có 5 khối trích dẫn, mỗi câu chỉ một lớp ngoặc “ ”, tên sách in nghiêng, không còn dấu `*` nào hiện ra, câu dài nhất không tràn khung.

- [ ] **Step 7: Commit**

```bash
git add src/data/8-the-ky-20.js CLAUDE.md
git commit -m "Bổ sung đủ 5 câu nói cho triết gia thế kỷ 20, ghi quy tắc câu nói vào CLAUDE.md"
```

- [ ] **Step 8: Push và mở PR để chủ dự án duyệt nội dung**

Run: `git push -u origin feat/nam-cau-noi`, rồi `gh pr create` với tiêu đề "Thêm đủ 5 câu nói nổi tiếng cho mỗi triết gia". Phần mô tả liệt kê những câu là lời thuật lại hoặc câu gán nhầm có ghi chú, để chủ dự án soát kỹ nhất phần này. Không merge: chờ chủ dự án duyệt.
