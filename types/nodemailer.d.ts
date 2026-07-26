declare module "nodemailer" {
  export type Transporter = {
    sendMail(message: unknown): Promise<{
      messageId: string;
    }>;
  };

  export function createTransport(config: unknown): Transporter;
}
