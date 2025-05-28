/**
 * 指定した日付（YYYY-MM-DD）を「翌日」の日付文字列（YYYY-MM-DD）に変換する
 * @param dateStr 例: "2025-05-27"
 * @returns 例: "2025-05-28"
 */
export function getTomorrowDate(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  // YYYY-MM-DD形式で返す
  return date.toISOString().slice(0, 10);
}
