"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterQuantitativeObjectives = filterQuantitativeObjectives;
/**
 * 目標リストから「種類: 半期：行動計画」「定量/定性: 定量」のみを抽出
 * @param objectives Notionページ配列
 * @returns フィルタ済みページ配列
 */
function filterQuantitativeObjectives(objectives) {
    return objectives.filter(function (page) {
        var _a, _b;
        var properties = page.properties || {};
        var typeInfo = (_a = properties['種類']) === null || _a === void 0 ? void 0 : _a.select;
        var quantQualInfo = (_b = properties['定量/定性']) === null || _b === void 0 ? void 0 : _b.select;
        return (typeInfo && typeInfo.name === '半期：行動計画' &&
            quantQualInfo && quantQualInfo.name === '定量');
    });
}
