import { TaskInfo } from '../notion/fetch/fetchTasksForUserOnDate';

function convertStatus(status: string): string {
  const mapping: Record<string, string> = {
    '未着手': '⬜️',
    '進行中': '🌀',
    '完了': '✅',
  };
  return mapping[status] || status;
}

/**
 * 日報用の文章を生成（目標・タスク・成果・翌日計画まで含むフルバージョン）
 */
export function generateFullDailyReportText(
  todayTasks: TaskInfo[],
  tomorrowTasks: TaskInfo[],
  quantitativeHalf: string[],
  quantitativeQ: string[],
  quantitativeMonth: string[],
  qualitativeHalf: string[],
  qualitativeQ: string[],
  qualitativeMonth: string[],
  icon: string
): string {
  const lines: string[] = [];
  lines.push(`## ${icon}｜行動計画（定量）`);
  lines.push('---');
  for (const title of quantitativeHalf) {
    lines.push(`**半期：** ${title}`);
  }
  for (const title of quantitativeQ) {
    lines.push(`**Q別：** ${title}`);
  }
  for (const title of quantitativeMonth) {
    lines.push(`**月別：** ${title}`);
  }
  lines.push('');
  lines.push(`## ${icon}｜行動計画（定性）`);
  lines.push('---');
  for (const title of qualitativeHalf) {
    lines.push(`**半期：** ${title}`);
  }
  for (const title of qualitativeQ) {
    lines.push(`**Q別：** ${title}`);
  }
  for (const title of qualitativeMonth) {
    lines.push(`**月別：** ${title}`);
  }
  lines.push('');
  lines.push(`## ${icon}｜当日の報告`);
  lines.push('---');
  lines.push(' **タスク**');
  for (const task of todayTasks) {
    lines.push(`${convertStatus(task.status)}　${task.name}`);
  }
  lines.push(' **本日の成果と気づき**');
  lines.push('');
  lines.push('');
  lines.push(`## ${icon}｜翌営業日の行動計画`);
  lines.push('---');
  lines.push(' **タスク**');
  for (const task of tomorrowTasks) {
    lines.push(`${convertStatus(task.status)}　${task.name}`);
  }
  lines.push(' **翌営業日のコミット**');
  lines.push('');
  lines.push('');
  return lines.join('\n');
}
