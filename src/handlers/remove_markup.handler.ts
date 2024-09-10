import createDebug from 'debug';
import type { Context } from 'telegraf';

const debug = createDebug('bot:handle_remove_markup');

export const handleRemoveMarkup = () => (ctx: Context) => {
  debug('Triggered "handleRemoveMarkup" handler');
  ctx.editMessageReplyMarkup(undefined);
};
