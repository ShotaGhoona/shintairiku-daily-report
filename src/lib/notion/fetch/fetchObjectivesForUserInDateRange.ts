import { Client } from '@notionhq/client';

/**
 * 目標DBから「担当者ID」で「start < filterDate <= end」の目標を取得
 * @param notion Notionクライアント
 * @param objectiveDbId 目標DBのID
 * @param personId 担当者ID
 * @param filterDate YYYY-MM-DD（今日の日付）
 */
export async function fetchObjectivesForUserInDateRange(
  notion: Client,
  objectiveDbId: string,
  personId: string,
  filterDate: string
) {
  // まず担当者IDで絞り込み
  const response = await notion.databases.query({
    database_id: objectiveDbId,
    filter: {
      and: [
        {
          property: '担当',
          people: { contains: personId }
        }
      ]
    }
  });

  // さらに日付範囲で絞り込み
  const filtered = [];
  for (const page of response.results as any[]) {
    const dateInfo = page.properties?.['日付']?.date;
    if (!dateInfo) continue;
    const start = dateInfo.start;
    const end = dateInfo.end;
    if (start && start < filterDate && end && end >= filterDate) {
      filtered.push(page);
    }
  }
  return filtered;
}
