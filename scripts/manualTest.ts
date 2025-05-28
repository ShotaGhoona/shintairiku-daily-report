import 'dotenv/config';
import { getNotionClient } from '../src/lib/notion/notionClient';
import { fetchDairyLogPage } from '../src/lib/notion/fetch/fetchDairyLogPage';
import { fetchTasksForUserOnDate } from '../src/lib/notion/fetch/fetchTasksForUserOnDate';
import { fetchTasksForUserTomorrow } from '../src/lib/notion/fetch/fetchTasksForUserTomorrow';
import { getTomorrowDate } from '../src/lib/utils/getTomorrowDate';
import { generateFullDailyReportText } from '../src/lib/report/generateFullDailyReportText';
import { convertTextToNotionBlocks } from '../src/lib/report/convertTextToNotionBlocks';
import { appendBlocksToNotionPage } from '../src/lib/notion/appendBlocksToNotionPage';
import { fetchObjectivesForUserInDateRange } from '../src/lib/notion/fetch/fetchObjectivesForUserInDateRange';
import { filterObjectivesByTypeAndCategory } from '../src/lib/objective/filterObjectivesByTypeAndCategory';
import { extractObjectiveTitles } from '../src/lib/objective/extractObjectiveTitles';

const DAIRYLOG_DB_ID = process.env.NOTION_DAIRYLOG_DB_ID!;
const TASK_DB_ID = process.env.NOTION_TASK_DB_ID!;
const OBJECTIVE_DB_ID = process.env.NOTION_OBJECTIVE_DB_ID!;
const NOTION_SECRET = process.env.NOTION_SECRET!;

// ここでテストしたいIDを指定
const TEST_ID = 1747; // ←ここをテストしたいIDに書き換えてください

function mask(str: string | undefined) {
  if (!str) return '';
  return str.slice(0, 4) + '****' + str.slice(-4);
}

async function main() {
  try {
    console.log('=== デバッグログ開始 ===');
    console.log('NOTION_DAIRYLOG_DB_ID:', mask(DAIRYLOG_DB_ID));
    console.log('NOTION_TASK_DB_ID:', mask(TASK_DB_ID));
    console.log('NOTION_OBJECTIVE_DB_ID:', mask(OBJECTIVE_DB_ID));
    console.log('NOTION_SECRET:', mask(NOTION_SECRET));
    console.log('TEST_ID:', TEST_ID);

    const notion = getNotionClient();
    console.log('Notionクライアント初期化OK');

    // 日報DBから該当ページ取得
    console.log('日報DBから該当ページを検索...');
    const pageInfo = await fetchDairyLogPage(notion, DAIRYLOG_DB_ID, Number(TEST_ID));
    console.log('fetchDairyLogPage結果:', pageInfo);

    if (!pageInfo) {
      console.error('No page found for given ID');
      process.exit(1);
    }

    // 明日の日付を取得
    const tomorrow = getTomorrowDate(pageInfo.date);
    console.log('今日の日付:', pageInfo.date, '→ 明日の日付:', tomorrow);

    // 明日のタスク一覧を取得
    console.log('タスクDBから明日のタスク一覧を検索...');
    const tasksTomorrow = await fetchTasksForUserTomorrow(
      notion,
      TASK_DB_ID,
      pageInfo.date,
      pageInfo.personId
    );
    console.log('fetchTasksForUserTomorrow結果:', tasksTomorrow);

    // 目標DBから今日より前にstart、今日より後にendの目標を取得
    console.log('目標DBから日付範囲に合致する目標を取得...');
    const objectivesRaw = await fetchObjectivesForUserInDateRange(
      notion,
      OBJECTIVE_DB_ID,
      pageInfo.personId,
      pageInfo.date
    );
    console.log('fetchObjectivesForUserInDateRange結果:', objectivesRaw);

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

    for (let i = 0; i < patterns.length; i++) {
      const { quant, cat } = patterns[i];
      const titles = [
        quantitativeHalf, quantitativeQ, quantitativeMonth,
        qualitativeHalf, qualitativeQ, qualitativeMonth
      ][i];
      console.log(`[${quant} & ${cat}] タイトルリスト:`, titles);
    }

    // 既存の今日のタスク取得
    console.log('タスクDBから当日のタスク一覧を検索...');
    const tasks = await fetchTasksForUserOnDate(
      notion,
      TASK_DB_ID,
      pageInfo.date,
      pageInfo.personId
    );
    console.log('fetchTasksForUserOnDate結果:', tasks);

    // レポート文章生成（フルバージョン）
    const icon = '🍅';
    console.log('フル日報文章を生成...');
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
    console.log('生成されたフル日報テキスト:\n', fullReportText);

    // Notionブロック配列に変換
    console.log('Notionブロック配列に変換...');
    const blocks = convertTextToNotionBlocks(fullReportText);
    console.log('生成されたNotionブロック:', JSON.stringify(blocks, null, 2));

    // Notionページに追記
    console.log('Notionページに追記...');
    await appendBlocksToNotionPage(notion, pageInfo.pageId, blocks);

    console.log('Success! 日報を追記しました。');
    console.log('=== デバッグログ終了 ===');
  } catch (error: any) {
    console.error('Error:', error.message || error);
    console.error(error);
    process.exit(1);
  }
}

main();
