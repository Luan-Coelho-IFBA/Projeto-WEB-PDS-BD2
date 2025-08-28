import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

const MailerConfig = (config: ConfigService): MailerOptions => ({
  defaults: {
    from: `Não responda <${config.getOrThrow('MAIL_FROM')}>`,
  },
  transport: {
    host: config.getOrThrow('MAIL_HOST'),
    port: config.get('MAIL_PORT'),
    secure: false,
    auth: {
      user: config.get('MAIL_USER'),
      pass: config.get('MAIL_PASSWORD'),
    },
  },
});

export default MailerConfig;
