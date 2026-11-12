import path from "node:path";

/** Where admin-uploaded images live (mounted as a Docker volume in production). */
export function uploadDir() {
  return path.resolve(process.env.UPLOAD_DIR ?? path.join(process.cwd(), "storage", "uploads"));
}
