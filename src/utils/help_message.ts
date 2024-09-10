import { BOT_OWNER } from '../config';
import { FORMATTED_MAX_SIXE } from '../constants';

export const helpMessage =
  'Вітаю, я Telegram бот для завантаження картинок гілки текстовиків відділу медіа ФІОТ. Завантажте картинку мені в приватні повідомлення або скористайтесь командою /upload із реплаєм на картинку.\n\n' +
  `<b>Максимальний розмір зображення: ${FORMATTED_MAX_SIXE}</b>\n\n` +
  (BOT_OWNER
    ? `<i>Знайшли баг, чогось не вистачає, або маєте ідеї та пропозиції — пишіть ${BOT_OWNER}.</i>`
    : '');
