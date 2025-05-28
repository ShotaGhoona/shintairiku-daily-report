"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFullDailyReportText = generateFullDailyReportText;
function convertStatus(status) {
    var mapping = {
        '未着手': '⬜️',
        '進行中': '🌀',
        '完了': '✅',
    };
    return mapping[status] || status;
}
/**
 * 日報用の文章を生成（目標・タスク・成果・翌日計画まで含むフルバージョン）
 */
function generateFullDailyReportText(todayTasks, tomorrowTasks, quantitativeHalf, quantitativeQ, quantitativeMonth, qualitativeHalf, qualitativeQ, qualitativeMonth, icon) {
    var lines = [];
    lines.push("## ".concat(icon, "\uFF5C\u884C\u52D5\u8A08\u753B\uFF08\u5B9A\u91CF\uFF09"));
    lines.push('---');
    for (var _i = 0, quantitativeHalf_1 = quantitativeHalf; _i < quantitativeHalf_1.length; _i++) {
        var title = quantitativeHalf_1[_i];
        lines.push("**\u534A\u671F\uFF1A** ".concat(title));
    }
    for (var _a = 0, quantitativeQ_1 = quantitativeQ; _a < quantitativeQ_1.length; _a++) {
        var title = quantitativeQ_1[_a];
        lines.push("**Q\u5225\uFF1A** ".concat(title));
    }
    for (var _b = 0, quantitativeMonth_1 = quantitativeMonth; _b < quantitativeMonth_1.length; _b++) {
        var title = quantitativeMonth_1[_b];
        lines.push("**\u6708\u5225\uFF1A** ".concat(title));
    }
    lines.push('');
    lines.push("## ".concat(icon, "\uFF5C\u884C\u52D5\u8A08\u753B\uFF08\u5B9A\u6027\uFF09"));
    lines.push('---');
    for (var _c = 0, qualitativeHalf_1 = qualitativeHalf; _c < qualitativeHalf_1.length; _c++) {
        var title = qualitativeHalf_1[_c];
        lines.push("**\u534A\u671F\uFF1A** ".concat(title));
    }
    for (var _d = 0, qualitativeQ_1 = qualitativeQ; _d < qualitativeQ_1.length; _d++) {
        var title = qualitativeQ_1[_d];
        lines.push("**Q\u5225\uFF1A** ".concat(title));
    }
    for (var _e = 0, qualitativeMonth_1 = qualitativeMonth; _e < qualitativeMonth_1.length; _e++) {
        var title = qualitativeMonth_1[_e];
        lines.push("**\u6708\u5225\uFF1A** ".concat(title));
    }
    lines.push('');
    lines.push("## ".concat(icon, "\uFF5C\u5F53\u65E5\u306E\u5831\u544A"));
    lines.push('---');
    lines.push(' **タスク**');
    for (var _f = 0, todayTasks_1 = todayTasks; _f < todayTasks_1.length; _f++) {
        var task = todayTasks_1[_f];
        lines.push("".concat(convertStatus(task.status), "\u3000").concat(task.name));
    }
    lines.push(' **本日の成果と気づき**');
    lines.push('');
    lines.push('');
    lines.push("## ".concat(icon, "\uFF5C\u7FCC\u55B6\u696D\u65E5\u306E\u884C\u52D5\u8A08\u753B"));
    lines.push('---');
    lines.push(' **タスク**');
    for (var _g = 0, tomorrowTasks_1 = tomorrowTasks; _g < tomorrowTasks_1.length; _g++) {
        var task = tomorrowTasks_1[_g];
        lines.push("".concat(convertStatus(task.status), "\u3000").concat(task.name));
    }
    lines.push(' **翌営業日のコミット**');
    lines.push('');
    lines.push('');
    return lines.join('\n');
}
