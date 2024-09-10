export const ENVIRONMENT = process.env.NODE_ENV || '';
export const BOT_TOKEN = process.env.BOT_TOKEN || '';
export const IMGBB_API_KEY = process.env.IMGBB_API_KEY || '';
export const BOT_OWNER = process.env.BOT_OWNER;
export const EXPIRE_TIME = parseInt(process.env.EXPIRE_TIME || '0', 10);
export const MAX_IMAGE_SIZE = Math.min(
  parseInt(process.env.MAX_IMAGE_SIZE || '20971520', 10),
  20971520,
);
