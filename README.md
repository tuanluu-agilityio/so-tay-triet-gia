# Sổ Tay Triết Gia

Trang web Astro: cây triết học (trang chủ) và 50 trang chi tiết tĩnh, mỗi người một trang.

## Chạy và build
```
npm install
npm run dev       # xem thử tại http://localhost:4321
npm run build     # tạo thư mục dist/ (trang tĩnh)
npm test          # chạy test (node --test)
```

## Cấu trúc
- `src/pages/index.astro`: trang chủ cây đa
- `src/pages/triet-gia/[slug].astro`: khuôn trang chi tiết, tạo 50 trang khi build
- `src/data/*.js`: nội dung, mỗi file một thời kỳ (dùng `PH.push({...})`)
- `src/lib/philosophers.mjs`: đọc dữ liệu và dựng phần nội dung trang
- `src/lib/music.mjs`, `src/lib/player-state.mjs`, `src/components/MusicPlayer.astro`: nhạc nền
- `src/styles/`: CSS của trang chủ và trang chi tiết
- `tests/`: test cho bảng nhạc và trạng thái nút nhạc

Ảnh chân dung tải từ Wikimedia Commons (giấy phép tự do) khi trang mở; cần có mạng.
Nội dung do Claude viết, cần chủ dự án duyệt trước khi xuất bản.

## Nhạc nền
Mỗi triết gia được gán một bản nhạc cổ điển nhẹ nhàng theo thời đại và trường phái (xem `src/lib/music.mjs`); 50 triết gia gom vào 10 nhóm. File nhạc tự lưu ở `public/audio/<key>.mp3` (MP3 128 kbps, ≤ 5 MB, fade-out 3 giây cuối). Chỉ dùng bản thu Public Domain, CC0, CC BY hoặc CC BY-SA, giấy phép đã kiểm tra ở trang gốc của từng bản thu.

| key | Bản nhạc | Người trình bày | Giấy phép | Nguồn |
|---|---|---|---|---|
| `hy-lap-co` | Seikilos, *Epitaph of Seikilos* | Marcus Harvey (hát) | CC BY-SA 2.5 | [Commons](https://commons.wikimedia.org/wiki/File:Ο_Επιτάφιος_του_Σεῖκιλου_-_Epitaph_of_Seikilos.ogg) |
| `binh-ca` | Bình ca Gregorian, *Pange lingua gloriosi* | Gareth Hughes (hát bình ca) | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Pange_Lingua_Latin_in_Latin.ogg) |
| `phuc-hung` | Francesco da Milano, *Fantasia* | Pracchia-78 (bản dựng guitar dây nylon) | Public Domain | [Commons](https://commons.wikimedia.org/wiki/File:Francesco_Canova_da_Milano-Fantasia.ogg) |
| `ba-roc` | J. S. Bach, *Goldberg Variations*, Aria | Kimiko Ishizaka (piano) | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Kimiko_Ishizaka_-_J.S._Bach-_-Open-_Goldberg_Variations,_BWV_988_(Piano)_-_01_Aria.mp3) |
| `ba-roc-anh` | Handel, Suite HWV 437, Sarabande | Edward Cree (organ điện tử) | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Handel_-_Suite_Vol._2_No._4_in_D_minor_HWV_437_-_4._Sarabande.oga) |
| `co-dien` | Mozart, Sonata K. 545, chương II | Bernd Krueger (piano) | CC BY-SA 3.0 (bản Đức) | [Commons](https://commons.wikimedia.org/wiki/File:Mozart_-_Piano_Sonata_No._16_in_C_major_-_II._Andante.ogg) |
| `lang-man-duc` | Beethoven, Sonata “Ánh trăng”, chương I | Paul Pitman (piano, Musopen) | Public Domain | [Commons](https://commons.wikimedia.org/wiki/File:Ludwig_van_Beethoven_-_sonata_no._14_in_c_sharp_minor_'moonlight',_op._27_no._2_-_i._adagio_sostenuto.ogg) |
| `lang-man` | Chopin, Nocturne Op. 9 số 2 | Peter Johnston (piano, Musopen) | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Chopin_Nocturne_No._2_in_E_Flat_Major,_Op._9.ogg) |
| `the-ky-20` | Brahms, Intermezzo Op. 118 số 2 | Musopen (piano) | Public Domain | [Commons](https://commons.wikimedia.org/wiki/File:Johannes_Brahms_-_klavierstucke,_op._118_-_ii._intermezzo.ogg) |
| `paris` | Satie, *Gymnopédie* số 1 | Michael Laucke (guitar) | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Satie_Gymnopedie_No_1_performed_by_Michael_Laucke.flac) |

**Quy tắc thay thế:** nếu không tìm được bản thu giấy phép tự do cho một key thì dùng bản khác cùng nhà soạn nhạc hoặc cùng thời kỳ. Key `la-ma` (Mesomedes, *Hymn to the Sun*) không có bản thu tự do nên đã bị bỏ; các triết gia La Mã dùng `hy-lap-co`. Bản `hy-lap-co` (50 giây) và `phuc-hung` (76 giây) được lặp lại để đủ trên 2 phút.
