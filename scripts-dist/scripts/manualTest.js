"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var notionClient_1 = require("../src/lib/notion/notionClient");
var fetchDairyLogPage_1 = require("../src/lib/notion/fetch/fetchDairyLogPage");
var fetchTasksForUserOnDate_1 = require("../src/lib/notion/fetch/fetchTasksForUserOnDate");
var fetchTasksForUserTomorrow_1 = require("../src/lib/notion/fetch/fetchTasksForUserTomorrow");
var getTomorrowDate_1 = require("../src/lib/utils/getTomorrowDate");
var generateFullDailyReportText_1 = require("../src/lib/report/generateFullDailyReportText");
var convertTextToNotionBlocks_1 = require("../src/lib/report/convertTextToNotionBlocks");
var appendBlocksToNotionPage_1 = require("../src/lib/notion/appendBlocksToNotionPage");
var fetchObjectivesForUserInDateRange_1 = require("../src/lib/notion/fetch/fetchObjectivesForUserInDateRange");
var filterObjectivesByTypeAndCategory_1 = require("../src/lib/objective/filterObjectivesByTypeAndCategory");
var extractObjectiveTitles_1 = require("../src/lib/objective/extractObjectiveTitles");
var DAIRYLOG_DB_ID = process.env.NOTION_DAIRYLOG_DB_ID;
var TASK_DB_ID = process.env.NOTION_TASK_DB_ID;
var OBJECTIVE_DB_ID = process.env.NOTION_OBJECTIVE_DB_ID;
var NOTION_SECRET = process.env.NOTION_SECRET;
// ここでテストしたいIDを指定
var TEST_ID = 1747; // ←ここをテストしたいIDに書き換えてください
function mask(str) {
    if (!str)
        return '';
    return str.slice(0, 4) + '****' + str.slice(-4);
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var notion, pageInfo, tomorrow, tasksTomorrow, objectivesRaw_1, patterns, _a, quantitativeHalf, quantitativeQ, quantitativeMonth, qualitativeHalf, qualitativeQ, qualitativeMonth, i, _b, quant, cat, titles, tasks, icon, fullReportText, blocks, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    console.log('=== デバッグログ開始 ===');
                    console.log('NOTION_DAIRYLOG_DB_ID:', mask(DAIRYLOG_DB_ID));
                    console.log('NOTION_TASK_DB_ID:', mask(TASK_DB_ID));
                    console.log('NOTION_OBJECTIVE_DB_ID:', mask(OBJECTIVE_DB_ID));
                    console.log('NOTION_SECRET:', mask(NOTION_SECRET));
                    console.log('TEST_ID:', TEST_ID);
                    notion = (0, notionClient_1.getNotionClient)();
                    console.log('Notionクライアント初期化OK');
                    // 日報DBから該当ページ取得
                    console.log('日報DBから該当ページを検索...');
                    return [4 /*yield*/, (0, fetchDairyLogPage_1.fetchDairyLogPage)(notion, DAIRYLOG_DB_ID, Number(TEST_ID))];
                case 1:
                    pageInfo = _c.sent();
                    console.log('fetchDairyLogPage結果:', pageInfo);
                    if (!pageInfo) {
                        console.error('No page found for given ID');
                        process.exit(1);
                    }
                    tomorrow = (0, getTomorrowDate_1.getTomorrowDate)(pageInfo.date);
                    console.log('今日の日付:', pageInfo.date, '→ 明日の日付:', tomorrow);
                    // 明日のタスク一覧を取得
                    console.log('タスクDBから明日のタスク一覧を検索...');
                    return [4 /*yield*/, (0, fetchTasksForUserTomorrow_1.fetchTasksForUserTomorrow)(notion, TASK_DB_ID, pageInfo.date, pageInfo.personId)];
                case 2:
                    tasksTomorrow = _c.sent();
                    console.log('fetchTasksForUserTomorrow結果:', tasksTomorrow);
                    // 目標DBから今日より前にstart、今日より後にendの目標を取得
                    console.log('目標DBから日付範囲に合致する目標を取得...');
                    return [4 /*yield*/, (0, fetchObjectivesForUserInDateRange_1.fetchObjectivesForUserInDateRange)(notion, OBJECTIVE_DB_ID, pageInfo.personId, pageInfo.date)];
                case 3:
                    objectivesRaw_1 = _c.sent();
                    console.log('fetchObjectivesForUserInDateRange結果:', objectivesRaw_1);
                    patterns = [
                        { quant: "定量", cat: "半期：行動計画" },
                        { quant: "定量", cat: "Q別：行動計画" },
                        { quant: "定量", cat: "月別：行動計画" },
                        { quant: "定性", cat: "半期：行動計画" },
                        { quant: "定性", cat: "Q別：行動計画" },
                        { quant: "定性", cat: "月別：行動計画" },
                    ];
                    _a = patterns.map(function (_a) {
                        var quant = _a.quant, cat = _a.cat;
                        return (0, extractObjectiveTitles_1.extractObjectiveTitles)((0, filterObjectivesByTypeAndCategory_1.filterObjectivesByTypeAndCategory)(objectivesRaw_1, quant, cat));
                    }), quantitativeHalf = _a[0], quantitativeQ = _a[1], quantitativeMonth = _a[2], qualitativeHalf = _a[3], qualitativeQ = _a[4], qualitativeMonth = _a[5];
                    for (i = 0; i < patterns.length; i++) {
                        _b = patterns[i], quant = _b.quant, cat = _b.cat;
                        titles = [
                            quantitativeHalf, quantitativeQ, quantitativeMonth,
                            qualitativeHalf, qualitativeQ, qualitativeMonth
                        ][i];
                        console.log("[".concat(quant, " & ").concat(cat, "] \u30BF\u30A4\u30C8\u30EB\u30EA\u30B9\u30C8:"), titles);
                    }
                    // 既存の今日のタスク取得
                    console.log('タスクDBから当日のタスク一覧を検索...');
                    return [4 /*yield*/, (0, fetchTasksForUserOnDate_1.fetchTasksForUserOnDate)(notion, TASK_DB_ID, pageInfo.date, pageInfo.personId)];
                case 4:
                    tasks = _c.sent();
                    console.log('fetchTasksForUserOnDate結果:', tasks);
                    icon = '🍅';
                    console.log('フル日報文章を生成...');
                    fullReportText = (0, generateFullDailyReportText_1.generateFullDailyReportText)(tasks, tasksTomorrow, quantitativeHalf, quantitativeQ, quantitativeMonth, qualitativeHalf, qualitativeQ, qualitativeMonth, icon);
                    console.log('生成されたフル日報テキスト:\n', fullReportText);
                    // Notionブロック配列に変換
                    console.log('Notionブロック配列に変換...');
                    blocks = (0, convertTextToNotionBlocks_1.convertTextToNotionBlocks)(fullReportText);
                    console.log('生成されたNotionブロック:', JSON.stringify(blocks, null, 2));
                    // Notionページに追記
                    console.log('Notionページに追記...');
                    return [4 /*yield*/, (0, appendBlocksToNotionPage_1.appendBlocksToNotionPage)(notion, pageInfo.pageId, blocks)];
                case 5:
                    _c.sent();
                    console.log('Success! 日報を追記しました。');
                    console.log('=== デバッグログ終了 ===');
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _c.sent();
                    console.error('Error:', error_1.message || error_1);
                    console.error(error_1);
                    process.exit(1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
main();
