/**
 * 文章（複数行）をNotion API用のブロック配列に変換（太字・見出し・区切り線・リスト対応）
 */
export function convertTextToNotionBlocks(text: string) {
  const boldPattern = /\*\*(.*?)\*\*/g;

  function parseRichText(line: string) {
    const richTexts: any[] = [];
    let cursor = 0;
    let match: RegExpExecArray | null;
    while ((match = boldPattern.exec(line)) !== null) {
      const [full, boldText] = match;
      const start = match.index;
      const end = start + full.length;
      if (cursor < start) {
        richTexts.push({
          type: 'text',
          text: { content: line.slice(cursor, start) },
        });
      }
      richTexts.push({
        type: 'text',
        text: { content: boldText },
        annotations: { bold: true },
      });
      cursor = end;
    }
    if (cursor < line.length) {
      richTexts.push({
        type: 'text',
        text: { content: line.slice(cursor) },
      });
    }
    return richTexts;
  }

  const blocks: any[] = [];
  const lines = text.split('\n');

  for (let line of lines) {
    line = line.replace(/\r$/, ''); // CRのみ除去
    if (line === '') {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [] },
      });
    } else if (line.trim() === '---') {
      blocks.push({
        object: 'block',
        type: 'divider',
        divider: {},
      });
    } else if (line.startsWith('# ')) {
      const content = line.slice(2).trim();
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: parseRichText(content) },
      });
    } else if (line.startsWith('## ')) {
      const content = line.slice(3).trim();
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: parseRichText(content) },
      });
    } else if (line.startsWith('### ')) {
      const content = line.slice(4).trim();
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: { rich_text: parseRichText(content) },
      });
    } else if (line.trim().startsWith('- ') && !/^- \d/.test(line.trim())) {
      // 箇条書き
      const content = line.trim().slice(2).trim();
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: parseRichText(content) },
      });
    } else if (/^- ?\d/.test(line.trim())) {
      // 番号付きリスト
      const content = line.trim().replace(/^- ?\d+\.?/, '').trim();
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: parseRichText(content) },
      });
    } else {
      // 通常パラグラフ
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: parseRichText(line.trim()) },
      });
    }
  }

  return blocks;
}
