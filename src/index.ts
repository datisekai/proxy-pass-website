import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { z } from "zod";
import { request } from "undici";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

const querySchema = z.object({
  url: z.string().url(),
});

app.get(
  "/api/proxy",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = querySchema.safeParse(req.query);
      if (!parseResult.success) {
        return res.status(400).json({
          error: "Tham số url không hợp lệ",
          issues: parseResult.error.issues,
        });
      }

      const targetUrl = parseResult.data.url;

      const { body, headers, statusCode } = await request(targetUrl, {
        method: "GET",
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (compatible; SimpleProxy/1.0; +https://example.local)",
        },
      });

      // Chỉ forward HTML/text. Nếu content-type không phải text/html thì vẫn trả về raw text/binary dưới dạng buffer.
      const contentType = headers["content-type"] || "text/html; charset=utf-8";

      res.status(statusCode);
      res.setHeader(
        "Content-Type",
        Array.isArray(contentType) ? contentType[0] : contentType
      );

      const chunks: Buffer[] = [];
      for await (const chunk of body as any) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const buffer = Buffer.concat(chunks);
      return res.send(buffer);
    } catch (err) {
      return next(err);
    }
  }
);

// Health check đơn giản
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const message = err?.message || "Internal Server Error";
  const status = err?.statusCode || 500;
  res.status(status).json({ error: message });
});

const PORT = Number(process.env.PORT || 5038);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
