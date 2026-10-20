# Thiệp 20/10

## Cách mở
- **Trên máy tính:** bấm đúp `index.html`.
- **Trên điện thoại / iPad:** nên đưa cả thư mục lên một nơi lưu web miễn phí rồi gửi link, vì điện thoại không mở trọn vẹn file trong zip.
  Cách nhanh nhất: vào https://app.netlify.com/drop , kéo thả cả thư mục `thiep-20-10` vào, nhận link và gửi qua Zalo/Messenger.
  (GitHub Pages hoặc Cloudflare Pages cũng được.)

## Chỉnh nội dung: CHỈ SỬA TRONG index.html
Mở `index.html` bằng Notepad/VS Code và tìm các chú thích `SỬA:`. File `js/script.js` không ghi đè chữ nào, nên bạn không cần mở nó.

- **Lời chúc (chữ chạy):** khối `message-source`, mỗi `<p>` là một đoạn, `<br>` là xuống dòng. Tốc độ gõ: `data-speed`.
- **Tiêu đề, tên người nhận, lời ký, dòng dưới ảnh, chữ phong thư, các dòng chữ khác:** sửa thẳng chữ trong HTML.
- **Ba ảnh (tự đổi mỗi 3 giây, không cần bấm):** chép ảnh vào `assets/images/`, rồi đổi `src` của ba thẻ `<img id="photo-1">`, `photo-2`, `photo-3` (ví dụ `src="assets/images/anh-cua-toi.jpg"`). Gõ sai tên thì thiệp tự dùng ảnh minh hoạ. `data-interval` ở `photo-frame` là thời gian tự đổi ảnh (0 = tắt).
  Ảnh nên là JPG hoặc PNG (ảnh HEIC của iPhone cần đổi sang JPG), dưới 500KB, tỉ lệ dọc khoảng 4:5.
- **Nhạc:** đổi `src` của thẻ `<audio>` (đặt file trong `assets/music/`), âm lượng ở `data-volume`.
- **Chữ trên nút nhạc:** `data-label-on` và `data-label-off` của nút `music-toggle`.
