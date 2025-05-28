"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTextToNotionBlocks = convertTextToNotionBlocks;
/**
 * 文章（複数行）をNotion API用のブロック配列に変換（太字・見出し・区切り線・リスト対応）
 */
function convertTextToNotionBlocks(text) {
    var boldPattern = /\*\*(.*?)\*\*/g;
    function parseRichText(line) {
        var richTexts = [];
        var cursor = 0;
        var match;
        while ((match = boldPattern.exec(line)) !== null) {
            var full = match[0], boldText = match[1];
            var start = match.index;
            var end = start + full.length;
            if (cursor < start) {
                richTexts.push({
                    type: 'text',
                    text: { content: line.slice(cursor, start) },
                });
            }
            richTexts.push({
                type: 'text',
                text: { content: boldText },
                annotations: { bold: true },
            });
            cursor = end;
        }
        if (cursor < line.length) {
            richTexts.push({
                type: 'text',
                text: { content: line.slice(cursor) },
            });
        }
        return richTexts;
    }
    var blocks = [];
    var lines = text.split('\n');
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        line = line.replace(/\r$/, ''); // CRのみ除去
        if (line === '') {
            blocks.push({
                object: 'block',
                type: 'paragraph',
                paragraph: { rich_text: [] },
            });
        }
        else if (line.trim() === '---') {
            blocks.push({
                object: 'block',
                type: 'divider',
                divider: {},
            });
        }
        else if (line.startsWith('# ')) {
            var content = line.slice(2).trim();
            blocks.push({
                object: 'block',
                type: 'heading_1',
                heading_1: { rich_text: parseRichText(content) },
            });
        }
        else if (line.startsWith('## ')) {
            var content = line.slice(3).trim();
            blocks.push({
                object: 'block',
                type: 'heading_2',
                heading_2: { rich_text: parseRichText(content) },
            });
        }
        else if (line.startsWith('### ')) {
            var content = line.slice(4).trim();
            blocks.push({
                object: 'block',
                type: 'heading_3',
                heading_3: { rich_text: parseRichText(content) },
            });
        }
        else if (line.trim().startsWith('- ') && !/^- \d/.test(line.trim())) {
            // 箇条書き
            var content = line.trim().slice(2).trim();
            blocks.push({
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: { rich_text: parseRichText(content) },
            });
        }
        else if (/^- ?\d/.test(line.trim())) {
            // 番号付きリスト
            var content = line.trim().replace(/^- ?\d+\.?/, '').trim();
            blocks.push({
                object: 'block',
                type: 'numbered_list_item',
                numbered_list_item: { rich_text: parseRichText(content) },
            });
        }
        else {
            // 通常パラグラフ
            blocks.push({
                object: 'block',
                type: 'paragraph',
                paragraph: { rich_text: parseRichText(line.trim()) },
            });
        }
    }
    return blocks;
}
