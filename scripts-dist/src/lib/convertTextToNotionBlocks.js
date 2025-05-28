"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTextToNotionBlocks = convertTextToNotionBlocks;
/**
 * 文章（複数行）をNotion API用のparagraphブロック配列に変換
 */
function convertTextToNotionBlocks(text) {
    return text.split('\n').map(function (line) { return ({
        object: 'block',
        type: 'paragraph',
        paragraph: {
            rich_text: [
                {
                    type: 'text',
                    text: { content: line },
                },
            ],
        },
    }); });
}
