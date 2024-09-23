import { Context, Telegraf } from 'telegraf';
import { BOT_TOKEN } from '../config';
import { helpCommandReply, startCommandReply, uploadImage } from '../commands';

const telegramBot = new Telegraf(BOT_TOKEN);

telegramBot.command('start', startCommandReply());
telegramBot.command('help', helpCommandReply());
telegramBot.command('upload', async (ctx: Context) => {
  const replyToMessage = (ctx as any).message.reply_to_message;
  if (!replyToMessage) {
    ctx.reply('Відсутній реплай на картинку!');
    return;
  }

  await uploadImage(ctx, replyToMessage);
});

telegramBot.on('message', async (ctx: Context) => {
  if (ctx?.chat?.type === 'private') {
    await uploadImage(ctx, ctx.message);
  }
});

export { telegramBot };
