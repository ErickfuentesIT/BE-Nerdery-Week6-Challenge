import { Storage } from "@google-cloud/storage";
import { v4 as uuid } from "uuid";
import { formatError } from "../utils/errors";

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GCS_KEY_FILE,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export class UploadServices {
  static getPublicUrl(publicId: string): string {
    return `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${publicId}`;
  }

  static async generateSignedUrl(filename: string) {
    try {
      const publicId = `products/${uuid()}-${filename}`;

      const contentType = filename.endsWith(".png")
        ? "image/png"
        : filename.endsWith(".jpg") || filename.endsWith(".jpeg")
          ? "image/jpeg"
          : filename.endsWith(".webp")
            ? "image/webp"
            : "application/octet-stream";

      const [signedUrl] = await bucket.file(publicId).getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 5 * 60 * 1000, // 5 minutes
        contentType: contentType,
      });

      return { signedUrl, publicId };
    } catch (error) {
      throw new Error(formatError(`Failed to sign URL for file name: ${filename}`, error));
    }
  }

  static async delete(publicId: string) {
    try {
      return await bucket.file(publicId).delete();
    } catch (error) {
      throw new Error(formatError(`Failed to delete file ${publicId}`, error));
    }
  }
}
