import { IMGBB_API_KEY, MAX_IMAGE_SIZE } from './config';
import { formatBytes } from './utils';

export const TELEGRAM_USERNAME_REGEX = /^@\w+$/;
export const FORMATTED_MAX_SIXE = formatBytes(MAX_IMAGE_SIZE);
export const UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
