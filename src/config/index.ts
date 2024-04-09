require("dotenv").config();

export const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) throw new Error("Missing bot token in .env file");
