import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendResetPasswordEmail(email: string, token: string) {
    const resetUrl = `http://localhost:4200/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
              <p style="font-size: 16px; color: #555;">
                Hi there,
              </p>
              <p style="font-size: 16px; color: #555;">
                We received a request to reset your password. Click the button below to reset it:
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              <p style="font-size: 16px; color: #555;">
                If you did not request a password reset, please ignore this email.
              </p>
              <p style="font-size: 16px; color: #555;">
                Thanks,<br>
                The Flink Team
              </p>
            </div>
          `,
    });

    return { message: 'Reset password email sent' };
  }

  async sendRestoreAccountEmail(email: string, token: string) {
    const restoreUrl = `http://localhost:3000/auth/restore-account?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Account Restoration Request',
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="text-align: center; color: #333;">Account Restoration Request</h2>
              <p style="font-size: 16px; color: #555;">
                Hi there,
              </p>
              <p style="font-size: 16px; color: #555;">
                We received a request to restore your account. Click the button below to restore it:
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${restoreUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                  Restore Account
                </a>
              </div>
              <p style="font-size: 16px; color: #555;">
                If you did not request an account restoration, please ignore this email.
              </p>
              <p style="font-size: 16px; color: #555;">
                Thanks,<br>
                The Flink Team
              </p>
            </div>
          `,
    });

    return { message: 'Restore account email sent' };
  }
}