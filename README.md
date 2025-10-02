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

Ví dụ gọi:

```bash
curl "http://localhost:3000/api/proxy?url=https%3A%2F%2Fexample.com"
```

## Ghi chú
- Proxy chỉ forward nội dung, không chỉnh sửa.
- Đã gửi kèm `Accept` và `User-Agent` phổ biến để nhận HTML.
- Có endpoint kiểm tra tình trạng: `GET /health`.
