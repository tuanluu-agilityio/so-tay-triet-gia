# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dự án

Sổ Tay Triết Gia: trang web tĩnh Astro bằng tiếng Việt. Trang chủ là "cây triết học" vẽ bằng SVG/canvas; 50 trang chi tiết, mỗi triết gia một trang (`/triet-gia/<id>/`). Không có server, không có framework UI, không thêm dependency ngoài `astro`.

Mọi thứ người đọc thấy (nội dung, comment trong code, commit message) viết bằng tiếng Việt, giọng văn bình dân, dễ hiểu. Nội dung do AI viết cần chủ dự án duyệt trước khi xuất bản.

## Lệnh

```
npm install
npm run dev        # http://localhost:4321
npm run build      # ra dist/ (51 trang)
npm run preview    # xem bản build
npm test           # node --test, không có thư viện test nào khác
node --test tests/music.test.mjs                                   # một file
node --test --test-name-pattern="mọi triết gia" tests/music.test.mjs  # một test
```

Test phải chạy từ thư mục gốc dự án: `loadPhilosophers()` và test kiểm tra file nhạc dùng đường dẫn tính từ `process.cwd()`. Không có linter.

Máy phát triển chạy Windows: PowerShell 5.1 không có `&&`, còn cmd không hiểu `;`. Push commit có file nhạc lớn có thể bị lỗi HTTP 408; khi đó chạy `git -c http.postBuffer=524288000 push ...`.

## Kiến trúc

**Dữ liệu triết gia** (`src/data/*.js`): mỗi file là một thời kỳ, viết dạng `PH.push({...}, {...})`, không phải ES module. `loadPhilosophers()` trong `src/lib/philosophers.mjs` đọc *mọi* file `.js` trong thư mục này theo tên đã sắp xếp và chạy bằng `new Function('PH', ...)`. Vì vậy **không đặt file `.js` nào khác vào `src/data/`**, và tiền tố số (`1-` … `8-`) quyết định thứ tự thời gian, cũng là thứ tự nút "Người trước/Người sau".

Mỗi bản ghi có: `id` (slug), `name`, `en`, `wiki` (tựa bài Wikipedia tiếng Anh, dùng để lấy ảnh), `sep` (slug Stanford Encyclopedia hoặc `null`), `era` (0–7, chỉ số vào `ERAS`/`WHERE`), `born`/`died` (năm âm là TCN), `approx`, `place`, `lede`, `life[]`, `facts[[k, v]]`, `ideas[[tiêu đề, nội dung, ví dụ đời thường]]`, `quotes[[câu, nguồn]]`, `influence[]`, `kin[[quan hệ, id, ghi chú]]`, `works[]`. Chuỗi được phép dùng `*nghiêng*`; mọi thứ khác bị escape.

**Trang chi tiết** (`src/pages/triet-gia/[slug].astro`): `getStaticPaths` dựng một trang cho mỗi bản ghi. Phần thân bài là chuỗi HTML do `renderDetail()` trong `philosophers.mjs` dựng rồi chèn bằng `set:html`. Muốn sửa các mục nội dung thì sửa ở đó, không phải trong file `.astro`.

**Trang chủ** (`src/pages/index.astro`) **không đọc `src/data/`**. Trang này có bản sao riêng trong một `<script is:inline>`: mảng `ERAS` (người, năm sinh/mất, tựa wiki, hình học nhánh cây) và mảng `SLUGS`. Liên kết tới trang chi tiết được gán **theo vị trí**: người thứ n duyệt qua `ERAS` nhận `SLUGS[n]`. Cách chia thời kỳ trên cây cũng hơi khác với trường `era` trong dữ liệu (ví dụ Epicurus nằm trên thân cây, Berkeley nằm ở nhánh Khai sáng).

**Thêm, bớt hoặc đổi thứ tự một triết gia** phải sửa đồng bộ:
1. bản ghi trong `src/data/`;
2. `ERAS` và `SLUGS` trong `index.astro`, giữ đúng cùng thứ tự;
3. `GROUPS` trong `src/lib/music.mjs` (thiếu thì build báo "Chưa gán nhạc cho …");
4. con số `50` trong `tests/music.test.mjs`.

**Ảnh chân dung** không lưu trong repo: script phía trình duyệt gọi Wikipedia API (`prop=pageimages`, `pilicense=free`) theo trường `wiki`, cache vào `localStorage` (`stgt-portraits-v1`). Không lấy được ảnh thì hiện chữ cái đầu (`initial()`).

**Nhạc nền:**
- `src/lib/music.mjs` gom 50 triết gia vào 10 bản nhạc theo thời đại và trường phái (`GROUPS` → `SCHOOL`); trang chủ dùng `HOME_TRACK`. `trackFor(id)` cấp bản nhạc cho trang; `musicCredit()` dựng dòng ghi công ở mục "Nguồn tham khảo".
- `src/components/MusicPlayer.astro` được `Base.astro` gắn vào mọi trang, nên mọi trang phải truyền prop `track` cho `Base`.
- Logic lưu trạng thái nằm trong `src/lib/player-state.mjs` (nhận storage làm tham số để test được) với các khóa `stgt-music-on` (localStorage) và `stgt-music-pos` (sessionStorage).
- Nhạc mặc định tắt và dùng `preload="none"`.
- File nằm ở `public/audio/<key>.mp3`: MP3 128 kbps, ≤ 5 MB (test kiểm tra). Chỉ dùng bản thu Public Domain, CC0, CC BY hoặc CC BY-SA (không dùng NC/ND), và phải kiểm tra giấy phép của chính *bản thu*, không chỉ của bản nhạc. Ghi người trình bày, giấy phép, nguồn vào `TRACKS` và bảng trong README.
- Thiết kế đầy đủ nằm trong `docs/superpowers/plans/2026-10-24-nhac-nen.md`.

**Script phía trình duyệt:** code cũ dùng `<script is:inline>` (không bundle, không `import` được). `MusicPlayer.astro` dùng `<script>` thường để Astro bundle và `import` từ `src/lib/`. Mọi truy cập `localStorage`/`sessionStorage` bọc try/catch.

**Style:** `src/styles/home.css` và `detail.css` mỗi file tự khai báo biến màu trên `:root` cho nền sáng, nền tối (`prefers-color-scheme` và `[data-theme]`). Hai bộ biến không hoàn toàn giống nhau (`home.css` không có `--rule`), nên component dùng chung cần giá trị dự phòng trong `var(--x, …)`. Font chữ là Cormorant Garamond (tiêu đề) và Be Vietnam Pro (thân bài), tải trong `Base.astro`.

## Quy ước

- Commit message tiếng Việt, câu ngắn mô tả thay đổi (ví dụ "Thêm nút nhạc nền nổi, …").
- Plan triển khai lưu ở `docs/superpowers/plans/YYYY-MM-DD-<tên>.md`.
- `astro.config.mjs` đặt `output: 'static'` và `trailingSlash: 'always'`: mọi liên kết nội bộ phải kết thúc bằng `/`.
