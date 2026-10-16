# Sổ Tay Triết Gia

Trang web Astro: cây triết học (trang chủ) và 50 trang chi tiết tĩnh, mỗi người một trang.

## Chạy và build
```
npm install
npm run dev       # xem thử tại http://localhost:4321
npm run build     # tạo thư mục dist/ (trang tĩnh)
```

## Cấu trúc
- `src/pages/index.astro`: trang chủ cây đa
- `src/pages/triet-gia/[slug].astro`: khuôn trang chi tiết, tạo 50 trang khi build
- `src/data/*.js`: nội dung, mỗi file một thời kỳ (dùng `PH.push({...})`)
- `src/lib/philosophers.mjs`: đọc dữ liệu và dựng phần nội dung trang
- `src/styles/`: CSS của trang chủ và trang chi tiết

Ảnh chân dung tải từ Wikimedia Commons (giấy phép tự do) khi trang mở; cần có mạng.
Nội dung do Claude viết, cần chủ dự án duyệt trước khi xuất bản.
