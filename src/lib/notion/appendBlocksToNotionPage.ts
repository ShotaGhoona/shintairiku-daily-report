import { Client } from '@notionhq/client';

/**
 * 指定したNotionページにブロック配列を追記する
 */
export async function appendBlocksToNotionPage(
  notion: Client,
  pageId: string,
  blocks: any[]
) {
  // Notion API仕様上、childrenはobject: 'block'付きの配列で渡す必要がある
  await notion.blocks.children.append({
    block_id: pageId,
    children: blocks.map(b => ({ ...b })),
  });
}
