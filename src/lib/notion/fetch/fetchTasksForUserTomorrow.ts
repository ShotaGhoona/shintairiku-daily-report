import { Client } from '@notionhq/client';
import { fetchTasksForUserOnDate, TaskInfo } from './fetchTasksForUserOnDate';
import { getTomorrowDate } from '../../utils/getTomorrowDate';

/**
 * タスクDBから「明日」の指定ユーザーのタスク一覧を取得
 * @param notion Notionクライアント
 * @param taskDbId タスクDBのID
 * @param todayDate 今日の日付（YYYY-MM-DD）
 * @param personId ユーザーID
 */
export async function fetchTasksForUserTomorrow(
  notion: Client,
  taskDbId: string,
  todayDate: string,
  personId: string
): Promise<TaskInfo[]> {
  const tomorrow = getTomorrowDate(todayDate);
  return fetchTasksForUserOnDate(notion, taskDbId, tomorrow, personId);
}
