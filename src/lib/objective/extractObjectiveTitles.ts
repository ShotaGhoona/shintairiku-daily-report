/**
 * 目標Notionページ配列からタイトル（名前）リストを抽出
 * @param objectives Notionページ配列
 * @returns タイトル文字列配列
 */
export function extractObjectiveTitles(objectives: any[]): string[] {
  const titles: string[] = [];
  for (const page of objectives) {
    const titleList = page.properties?.['名前']?.title;
    if (!titleList || !titleList.length) continue;
    const title = titleList[0]?.plain_text ?? '';
    if (title) titles.push(title);
  }
  return titles;
}
