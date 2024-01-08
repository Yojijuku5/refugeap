import S3 from "aws-sdk/clients/s3";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { sendEmailContactSchema } from "../../../schemas/mediaSchema";
import { contactEmailHtml } from "../../../utils/email";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: env.AWS_BUCKET_ACCESS_KEY,
  secretAccessKey: env.AWS_BUCKET_SECRET_KEY,
  region: env.AWS_BUCKET_REGION,
  signatureVersion: "v4",
});

export const mediaRouter = createTRPCRouter({
  sendEmailContact: publicProcedure
    .input(sendEmailContactSchema)
    .mutation(async ({ input }) => {
      await nodemailer
        .createTransport({
          port: env.EMAIL_SERVER_PORT,
          host: env.EMAIL_SERVER_HOST,
          auth: {
            user: env.EMAIL_SERVER_USER,
            pass: env.EMAIL_SERVER_PASSWORD,
          },
        })
        .sendMail({
          from: env.EMAIL_FROM,
          to: env.EMAIL_SERVER_USER,
          subject: input.subject,
          html: contactEmailHtml({ ...input }),
        });
    }),

  uploadImageToS3: protectedProcedure
    .input(z.object({ imageExtension: z.string() }))
    .mutation(({ input }) => {
      const imageExtension = input.imageExtension.split("/")[1] ?? "";
      const fileName = `${randomUUID() ?? ""}.${imageExtension}`;

      const s3Params = {
        Bucket: env.AWS_BUCKET_NAME,
        Key: fileName,
        Expires: 60,
        ContentType: `image/${imageExtension}`,
      };

      const preSignedUrl = s3.getSignedUrl("putObject", s3Params);

      return {
        preSignedUrl,
        fileName,
        url: `${env.AWS_BUCKET_URL}${fileName}`,
      };
    }),
});
