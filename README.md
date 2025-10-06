# Proxy HTML đơn giản (Express + TypeScript)

## Yêu cầu

- Node.js 18+
- npm

## Cài đặt

```bash
npm install
```

## Chạy trong môi trường dev

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`.

## Build và chạy production

```bash
npm run build
npm start
```

## API

- GET `/api/proxy?url=<encodedUrl>`

  - Tham số: `url` (bắt buộc) — URL đầy đủ, ví dụ `https://example.com`
  - Trả về: nội dung (thường là HTML) từ website đích, giữ nguyên `Content-Type`

- GET `/api/iframe?url=<encodedUrl>`

  - Tham số: `url` (bắt buộc) — URL đầy đủ để nhúng vào iframe
  - Trả về: HTML page với iframe nhúng website đích, bypass X-Frame-Options
  - Dùng để load iframe từ những web chặn gắn iframe

- GET `/api/iframe-proxy?url=<encodedUrl>`
  - Tham số: `url` (bắt buộc) — URL đầy đủ để proxy nội dung
  - Trả về: Nội dung HTML đã được proxy và chỉnh sửa để bypass các chính sách chặn iframe
  - **Khuyến nghị**: Dùng endpoint này thay vì `/api/iframe` để bypass hiệu quả hơn

Ví dụ gọi:

```bash
# Proxy thông thường
curl "http://localhost:3000/api/proxy?url=https%3A%2F%2Fexample.com"

# Iframe proxy
curl "http://localhost:3000/api/iframe?url=https%3A%2F%2Fexample.com"

# Iframe content proxy (khuyến nghị)
curl "http://localhost:3000/api/iframe-proxy?url=https%3A%2F%2Fexample.com"
```

## Sử dụng Iframe Proxy

**Cách 1: Iframe wrapper (có thể vẫn bị chặn)**

```html
<iframe
  src="http://localhost:3000/api/iframe?url=https%3A%2F%2Fexample.com"
  width="100%"
  height="600px"
></iframe>
```

**Cách 2: Content proxy (khuyến nghị - bypass hiệu quả hơn)**

```html
<iframe
  src="http://localhost:3000/api/iframe-proxy?url=https%3A%2F%2Fexample.com"
  width="100%"
  height="600px"
></iframe>
```

**Cách 3: Mở trực tiếp trong tab mới**
Mở trực tiếp URL: `http://localhost:3000/api/iframe-proxy?url=https%3A%2F%2Fexample.com`

## Ghi chú

- Proxy chỉ forward nội dung, không chỉnh sửa.
- Đã gửi kèm `Accept` và `User-Agent` phổ biến để nhận HTML.
- Có endpoint kiểm tra tình trạng: `GET /health`.
