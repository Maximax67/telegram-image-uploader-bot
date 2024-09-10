import axios from 'axios';
import createDebug from 'debug';
import FormData from 'form-data';
import type { Context } from 'telegraf';

import { formatBytes } from '../utils';
import { MAX_IMAGE_SIZE } from '../config';
import { FORMATTED_MAX_SIXE, UPLOAD_URL } from '../constants';
import type {
  ImgBBApiResponse,
  MessageDocument,
  MessagePhoto,
} from '../interfaces';

const debug = createDebug('bot:upload');

const findPhotoWithMaxSizeBelow = (
  photos: MessagePhoto[],
  size: number,
): MessagePhoto => {
  let maxFileSize: MessagePhoto | null = null;

  for (const photo of photos) {
    if (photo.file_size < size) {
      if (!maxFileSize || photo.file_size > maxFileSize.file_size) {
        maxFileSize = photo;
      }
    }
  }

  return maxFileSize ? maxFileSize : photos[0];
};

function checkFileSize(ctx: Context, fileSize: number): boolean {
  if (fileSize > MAX_IMAGE_SIZE) {
    debug('File size bigger than max allowed');
    ctx.reply(
      `Розмір файлу завеликий (${formatBytes(fileSize)} > ${FORMATTED_MAX_SIXE})`,
    );

    return false;
  }

  return true;
}

async function downloadFileAsBase64(fileUrl: string): Promise<string> {
  const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
  const base64Data = Buffer.from(response.data).toString('base64');

  return base64Data;
}

export const uploadImage = async (ctx: Context, message: any) => {
  debug('Triggered "upload" command');

  let fileId: string | null = null;
  let fileName: string | null = null;
  const messagePhoto: MessagePhoto[] | undefined = message.photo;
  if (messagePhoto && Array.isArray(messagePhoto) && messagePhoto.length) {
    const photo = findPhotoWithMaxSizeBelow(messagePhoto, MAX_IMAGE_SIZE);
    if (!checkFileSize(ctx, photo.file_size)) {
      return;
    }

    fileId = photo.file_id;
  } else {
    const messageDocument: MessageDocument | undefined = message.document;
    if (messageDocument) {
      const fileSize = messageDocument.file_size;
      if (!checkFileSize(ctx, fileSize)) {
        return;
      }

      if (!messageDocument.mime_type.startsWith('image/')) {
        debug('File is not an image');
        ctx.reply('Файл не є зображенням!');
        return;
      }

      fileId = messageDocument.file_id;
      fileName = messageDocument.file_name;
    }
  }

  if (!fileId) {
    debug('Invalid reply message');
    ctx.reply('Повідомлення не містить зображення!');
    return;
  }

  let base64Image;
  try {
    const fileUrl = (await ctx.telegram.getFileLink(fileId)).toString();
    base64Image = await downloadFileAsBase64(fileUrl);
  } catch (error: unknown) {
    debug('Error downloading or encoding file:', error);
    ctx.reply('Помилка скачування файлу:' + error);
    return;
  }

  const uploadUrl = fileName ? `${UPLOAD_URL}&name=${fileName}` : UPLOAD_URL;

  const formData = new FormData();
  formData.append('image', base64Image);

  let responseData;
  try {
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const status = response.status;
    if (status !== 200) {
      debug(`Response status code is ${status}:`, response.data);
      ctx.reply(`Помилка. Статус код ${status} від хостингу на загрузку файлу`);
      return;
    }

    responseData = response.data as ImgBBApiResponse;
  } catch (error: unknown) {
    debug('Error uploading image:', error);
    ctx.reply('Помилка загрузки файлу на хостинг:' + error);
    return;
  }

  if (!responseData.success) {
    debug(`Error uploading image. Response is not successful:`, responseData);
    ctx.reply('Не вдалося загрузити файл на хостинг...');
    return;
  }

  const uploadInfo = responseData.data;
  const imageUrl = uploadInfo.url;

  debug('Image successfully uploaded');
  ctx.reply(
    `Картинка ${fileName ? `<code>${fileName}</code> ` : ''}завантажена:\n` +
      `<a href="${imageUrl}">${imageUrl}</a>\n\n` +
      `<code>${uploadInfo.width}x${uploadInfo.height} px</code>\n` +
      `<code>${formatBytes(uploadInfo.size)}</code>\n` +
      `<code>${uploadInfo.image.mime}</code>`,
    { parse_mode: 'HTML' },
  );
};
