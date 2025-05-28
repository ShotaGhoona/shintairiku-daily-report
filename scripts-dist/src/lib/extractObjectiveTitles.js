"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractObjectiveTitles = extractObjectiveTitles;
/**
 * 目標Notionページ配列からタイトル（名前）リストを抽出
 * @param objectives Notionページ配列
 * @returns タイトル文字列配列
 */
function extractObjectiveTitles(objectives) {
    var _a, _b, _c, _d;
    var titles = [];
    for (var _i = 0, objectives_1 = objectives; _i < objectives_1.length; _i++) {
        var page = objectives_1[_i];
        var titleList = (_b = (_a = page.properties) === null || _a === void 0 ? void 0 : _a['名前']) === null || _b === void 0 ? void 0 : _b.title;
        if (!titleList || !titleList.length)
            continue;
        var title = (_d = (_c = titleList[0]) === null || _c === void 0 ? void 0 : _c.plain_text) !== null && _d !== void 0 ? _d : '';
        if (title)
            titles.push(title);
    }
    return titles;
}
