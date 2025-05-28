export const runtime = 'nodejs';
export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import { getNotionClient } from '@/lib/notion/notionClient';
import { fetchDairyLogPage } from '@/lib/notion/fetch/fetchDairyLogPage';
import { fetchTasksForUserOnDate } from '@/lib/notion/fetch/fetchTasksForUserOnDate';
import { fetchTasksForUserTomorrow } from '@/lib/notion/fetch/fetchTasksForUserTomorrow';
import { generateFullDailyReportText } from '@/lib/report/generateFullDailyReportText';
import { convertTextToNotionBlocks } from '@/lib/report/convertTextToNotionBlocks';
import { appendBlocksToNotionPage } from '@/lib/notion/appendBlocksToNotionPage';
import { fetchObjectivesForUserInDateRange } from '@/lib/notion/fetch/fetchObjectivesForUserInDateRange';
import { filterObjectivesByTypeAndCategory } from '@/lib/objective/filterObjectivesByTypeAndCategory';
import { extractObjectiveTitles } from '@/lib/objective/extractObjectiveTitles';

const DAIRYLOG_DB_ID = process.env.NOTION_DAIRYLOG_DB_ID!;
const TASK_DB_ID = process.env.NOTION_TASK_DB_ID!;
const OBJECTIVE_DB_ID = process.env.NOTION_OBJECTIVE_DB_ID!;

// Notion Webhookリクエストの検証・ID抽出
async function verifyWebhook(req: NextRequest) {
  const body = await req.json();
  console.log('Webhook受信body:', JSON.stringify(body));
  // 必要に応じてシークレット検証など追加可能
  const customId = body.ID || body.id || body['ID'] || body['id'];
  if (!customId) throw new Error('ID is required');
  return { customId };
}

export async function POST(req: NextRequest) {
  try {
    const { customId } = await verifyWebhook(req);

    const notion = getNotionClient();

    // 日報DBから該当ページ取得
    const pageInfo = await fetchDairyLogPage(notion, DAIRYLOG_DB_ID, Number(customId));
    if (!pageInfo) {
      return NextResponse.json({ error: 'No page found for given ID' }, { status: 404 });
    }

    // 明日のタスク一覧を取得
    const tasksTomorrow = await fetchTasksForUserTomorrow(
      notion,
      TASK_DB_ID,
      pageInfo.date,
      pageInfo.personId
    );

    // 目標DBから今日より前にstart、今日より後にendの目標を取得
    const objectivesRaw = await fetchObjectivesForUserInDateRange(
      notion,
      OBJECTIVE_DB_ID,
      pageInfo.personId,
      pageInfo.date
    );

    // 6パターンで抽出・タイトルリスト化
    const patterns = [
      { quant: "定量", cat: "半期：行動計画" },
      { quant: "定量", cat: "Q別：行動計画" },
      { quant: "定量", cat: "月別：行動計画" },
      { quant: "定性", cat: "半期：行動計画" },
      { quant: "定性", cat: "Q別：行動計画" },
      { quant: "定性", cat: "月別：行動計画" },
    ] as const;

    const [
      quantitativeHalf, quantitativeQ, quantitativeMonth,
      qualitativeHalf, qualitativeQ, qualitativeMonth
    ] = patterns.map(({ quant, cat }) =>
      extractObjectiveTitles(filterObjectivesByTypeAndCategory(objectivesRaw, quant, cat))
    );

    // 今日のタスク取得
    const tasks = await fetchTasksForUserOnDate(
      notion,
      TASK_DB_ID,
      pageInfo.date,
      pageInfo.personId
    );

    // レポート文章生成（フルバージョン）
    const icon = '🍅';
    const fullReportText = generateFullDailyReportText(
      tasks,
      tasksTomorrow,
      quantitativeHalf,
      quantitativeQ,
      quantitativeMonth,
      qualitativeHalf,
      qualitativeQ,
      qualitativeMonth,
      icon
    );

    // Notionブロック配列に変換
    const blocks = convertTextToNotionBlocks(fullReportText);

    // Notionページに追記
    await appendBlocksToNotionPage(notion, pageInfo.pageId, blocks);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('/api/webhook error', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
