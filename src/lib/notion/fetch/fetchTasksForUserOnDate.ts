import { Client } from '@notionhq/client';

export interface TaskInfo {
  name: string;
  status: string;
}

/**
 * タスクDBから指定ユーザー・日付のタスク一覧を取得
 */
export async function fetchTasksForUserOnDate(
  notion: Client,
  taskDbId: string,
  date: string,
  personId: string
): Promise<TaskInfo[]> {
  const response = await notion.databases.query({
    database_id: taskDbId,
    filter: {
      and: [
        {
          property: '作業日予定日',
          date: { equals: date },
        },
        {
          property: '担当',
          people: { contains: personId },
        },
      ],
    },
  });

  const tasks: TaskInfo[] = [];
  for (const task of response.results as any[]) {
    const titleList = task.properties['タスク名']?.title;
    if (!titleList || !titleList.length) continue;
    const taskName = titleList[0]?.plain_text ?? '';
    const statusObj = task.properties['ステータス']?.status;
    const status = statusObj?.name ?? '';
    tasks.push({ name: taskName, status });
  }
  return tasks;
}
