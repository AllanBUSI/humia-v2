import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: email,
            subject: "Votre code de connexion Humia",
            html: `
              <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
                <h2 style="color: #0f172a;">Connexion à Humia</h2>
                <p style="color: #64748b; line-height: 1.6;">
                  Voici votre code de connexion :
                </p>
                <div style="background: #f8fafc; border-radius: 12px; padding: 24px; text-align: center; margin: 16px 0;">
                  <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1b17ff;">${otp}</span>
                </div>
                <p style="color: #94a3b8; font-size: 14px;">
                  Ce code expire dans 5 minutes. Si vous n'avez pas demandé cette connexion, ignorez cet email.
                </p>
              </div>
            `,
          });
        }
      },
    }),
  ],
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        defaultValue: "",
        input: true,
      },
      lastName: {
        type: "string",
        defaultValue: "",
        input: true,
      },
      jobTitle: {
        type: "string",
        required: false,
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      onboardingCompleted: {
        type: "boolean",
        defaultValue: false,
        input: true,
      },
      role: {
        type: "string",
        defaultValue: "admin",
        input: true,
      },
      parentId: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
