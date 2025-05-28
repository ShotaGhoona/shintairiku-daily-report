import { Client } from '@notionhq/client';

export interface DairyLogPageInfo {
  date: string;
  personId: string;
  pageId: string;
}

/**
 * 日報DBからIDで該当ページを検索し、日付・ユーザーID・ページIDを返す
 */
export async function fetchDairyLogPage(
  notion: Client,
  dairyLogDbId: string,
  customId: number
): Promise<DairyLogPageInfo | null> {
  const response = await notion.databases.query({
    database_id: dairyLogDbId,
    filter: {
      property: 'ID',
      number: { equals: customId },
    },
    page_size: 1,
  });

  if (!response.results.length) return null;

  const page = response.results[0] as any;
  const date = page.properties['日付']?.date?.start ?? '';
  const personId = page.properties['ユーザー']?.people?.[0]?.id ?? '';
  const pageId = page.id;

  return { date, personId, pageId };
}
