import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

const MailerConfig = (config: ConfigService): MailerOptions => ({
  defaults: {
    from: `Não responda <${config.getOrThrow('MAIL_FROM')}>`,
  },
  transport: {
    host: config.getOrThrow('MAIL_HOST'),
    port: config.getOrThrow('MAIL_PORT'),
    secure: false,
    auth: {
      user: config.getOrThrow('MAIL_USER'),
      pass: config.getOrThrow('MAIL_PASSWORD'),
    },
  },
});

export default MailerConfig;
