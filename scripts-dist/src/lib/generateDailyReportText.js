"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDailyReportText = generateDailyReportText;
/**
 * ステータス名を絵文字に変換
 */
function convertStatusToEmoji(status) {
    var mapping = {
        '未着手': '⬜️',
        '進行中': '🌀',
        '完了': '✅',
    };
    return mapping[status] || status;
}
/**
 * タスク一覧から日報用の文章を生成
 */
function generateDailyReportText(tasks) {
    var lines = [];
    lines.push('## 当日の報告');
    lines.push('---');
    lines.push('**タスク**');
    for (var _i = 0, tasks_1 = tasks; _i < tasks_1.length; _i++) {
        var task = tasks_1[_i];
        lines.push("".concat(convertStatusToEmoji(task.status), "\u3000").concat(task.name));
    }
    return lines.join('\n');
}
