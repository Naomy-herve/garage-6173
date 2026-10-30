import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { publicUrl, s3 } from "../lib/s3";
import { adminOnly } from "./admin";

export const upload = {
  presign: adminOnly
    .input(z.object({ filename: z.string().max(200), contentType: z.string().regex(/^image\//) }))
    .handler(async ({ input }) => {
      const safe = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `products/${Date.now()}-${safe}`;
      const url = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
          ContentType: input.contentType,
          ACL: "public-read",
        }),
        { expiresIn: 600, signableHeaders: new Set(["x-amz-acl"]) },
      );
      return { url, key, publicUrl: publicUrl(key) };
    }),
};
