import { Client } from '@notionhq/client';
import type { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints';

/**
 * 指定したNotionページにブロック配列を追記する
 */
export async function appendBlocksToNotionPage(
  notion: Client,
  pageId: string,
  blocks: BlockObjectRequest[]
) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: blocks,
  });
}
