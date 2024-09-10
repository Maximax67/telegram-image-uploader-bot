import { startVercel } from '../src';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handle(req: VercelRequest, res: VercelResponse) {
  try {
    await startVercel(req, res);
  } catch (e: unknown) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
    console.error(e);
  }
}
