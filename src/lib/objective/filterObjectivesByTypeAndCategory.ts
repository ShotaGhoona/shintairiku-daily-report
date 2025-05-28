/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 目標リストから「定量/定性」と「種類」の組み合わせで抽出
 * @param objectives Notionページ配列
 * @param quantOrQual "定量" or "定性"
 * @param category "半期：行動計画" | "Q別：行動計画" | "月別：行動計画"
 * @returns フィルタ済みページ配列
 */
export function filterObjectivesByTypeAndCategory(
  objectives: Record<string, any>[],
  quantOrQual: "定量" | "定性",
  category: "半期：行動計画" | "Q別：行動計画" | "月別：行動計画"
): Record<string, any>[] {
  return objectives.filter(page => {
    const properties = page.properties || {};
    const typeInfo = properties['種類']?.select;
    const quantQualInfo = properties['定量/定性']?.select;
    return (
      typeInfo && typeInfo.name === category &&
      quantQualInfo && quantQualInfo.name === quantOrQual
    );
  });
}
