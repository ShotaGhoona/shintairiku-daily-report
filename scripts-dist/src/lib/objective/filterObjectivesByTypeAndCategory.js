"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterObjectivesByTypeAndCategory = filterObjectivesByTypeAndCategory;
/**
 * 目標リストから「定量/定性」と「種類」の組み合わせで抽出
 * @param objectives Notionページ配列
 * @param quantOrQual "定量" or "定性"
 * @param category "半期：行動計画" | "Q別：行動計画" | "月別：行動計画"
 * @returns フィルタ済みページ配列
 */
function filterObjectivesByTypeAndCategory(objectives, quantOrQual, category) {
    return objectives.filter(function (page) {
        var _a, _b;
        var properties = page.properties || {};
        var typeInfo = (_a = properties['種類']) === null || _a === void 0 ? void 0 : _a.select;
        var quantQualInfo = (_b = properties['定量/定性']) === null || _b === void 0 ? void 0 : _b.select;
        return (typeInfo && typeInfo.name === category &&
            quantQualInfo && quantQualInfo.name === quantOrQual);
    });
}
