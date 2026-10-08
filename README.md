# A Little Birthday Magic ♡

Website chúc mừng sinh nhật tối ưu điện thoại, dùng **HTML + CSS + JavaScript thuần**, không cần build và không cần tài khoản để người nhận xem.

## Tính năng

- 5 chặng: hộp quà → thổi nến → album ảnh → lá thư → lời kết.
- Hiệu ứng sao lấp lánh, hộp quà, bánh kem, confetti, thiệp Polaroid, phong bì.
- Nhạc mặc định được tổng hợp ngay trong trình duyệt; thay bằng tệp MP3 riêng nếu thích.
- Thổi nến bằng nút bấm, hoặc tự nguyện cấp quyền micro nếu trình duyệt hỗ trợ HTTPS.
- Trang `qr.html` để tạo QR theo URL thật của website khi đã đăng lên mạng.
- Tương thích màn hình di động và chế độ reduced-motion.

## 1. Chỉnh nội dung

Mở `config.js`, thay các giá trị:

- `recipient`: tên người nhận.
- `from`: tên/người gửi.
- `intro`, `cakeMessage`, `ending`: lời nhắn ngắn.
- `letterTitle`, `letter`: nội dung bức thư.
- `gallery`: danh sách ảnh & caption.
- `customMusic`: đường dẫn MP3 (để trống dùng nhạc mẫu).

## 2. Thêm ảnh và nhạc

- Chép ảnh JPG vào `assets/photos/photo1.jpg`, `photo2.jpg`, `photo3.jpg` hoặc sửa đường dẫn tương ứng trong `config.js`. Nếu ảnh chưa có, web sẽ hiện tranh minh họa dễ thương thay thế.
- Có thể thêm hoặc bớt ảnh bằng cách sửa mảng `gallery`.
- Chép nhạc hợp pháp vào `assets/music/favorite-song.mp3`, sau đó đổi `customMusic` thành `"assets/music/favorite-song.mp3"`.
- Không cần ảnh/MP3 vẫn chạy được bản mẫu.
- Nên nén ảnh khoảng 500 KB–1.5 MB/ảnh để tải trên điện thoại nhanh.

## 3. Chạy thử

Mở `index.html` trực tiếp trên máy tính. Tốt hơn là bật web server đơn giản:

```bash
python -m http.server 8000
```

Sau đó truy cập `http://localhost:8000`.

Chú ý: micro chỉ dùng được ở ngữ cảnh bảo mật như `https://` hoặc `localhost`; trang vẫn hoạt động khi không cấp quyền micro.

## 4. Đưa lên mạng và lấy QR

### Cách nhanh (Netlify Drop)

1. Truy cập https://app.netlify.com/drop và đăng nhập.
2. Giải nén ZIP, kéo cả thư mục `birthday-surprise` lên khu vực deploy.
3. Netlify cấp một URL dạng `https://ten-trang.netlify.app/`.
4. Mở `https://ten-trang.netlify.app/qr.html` để tạo và lưu QR cho URL thật.

### Hoặc GitHub Pages

1. Đưa các tệp trong thư mục lên một GitHub repository.
2. `Settings` → `Pages` → `Deploy from a branch` → `main` → `/ (root)` → `Save`.
3. Sau khi trang đã công khai, mở `https://<username>.github.io/<repo>/qr.html`.

**Lưu ý riêng tư:** nếu đăng ảnh cá nhân/lời chúc riêng lên một trang tĩnh công khai, người có link có thể xem. QR không bảo vệ nội dung; không nên đưa ảnh nhạy cảm lên GitHub repository công khai. Muốn riêng tư thực sự cần thêm giải pháp kiểm soát truy cập.

## 5. QR

`qr.html` dùng thư viện qrcode.js qua CDN để tạo mã, chỉ hoạt động khi có kết nối mạng. Khi đang mở trang này từ URL đã deploy, trang sẽ tự lấy URL tương ứng của `index.html`, vì vậy không phải điền link. Có nút `Tải QR PNG`.

## Nguồn tham khảo triển khai

- qrcode.js (MIT) https://github.com/davidshimjs/qrcodejs
- MDN Autoplay guide https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
- Netlify manual deployments https://docs.netlify.com/deploy/create-deploys/

Thiết kế, mã HTML/CSS/JS, SVG bánh và giai điệu tổng hợp do ChatGPT tạo mới cho bản mẫu này.

## Bản hoàn thiện

- Album ảnh có hiệu ứng chuyển Polaroid, các caption chỉnh trong `config.js`.
- Lá thư dùng Quicksand, không còn danh sách 3 lời chúc riêng.
- Chạm trái tim ở trang cuối để tạo thêm confetti.
- Ba ảnh đã được đặt sẵn trong `assets/photos/`.
