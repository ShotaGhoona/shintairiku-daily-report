import { Client } from '@notionhq/client';

/**
 * Notionクライアントを初期化して返す
 */
export function getNotionClient() {
  if (!process.env.NOTION_SECRET) {
    throw new Error('NOTION_SECRET is not set in environment variables');
  }
  return new Client({ auth: process.env.NOTION_SECRET });
}
