"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotionClient = getNotionClient;
var client_1 = require("@notionhq/client");
/**
 * Notionクライアントを初期化して返す
 */
function getNotionClient() {
    if (!process.env.NOTION_SECRET) {
        throw new Error('NOTION_SECRET is not set in environment variables');
    }
    return new client_1.Client({ auth: process.env.NOTION_SECRET });
}
