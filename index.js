require("dotenv").config();
const { Telegraf } = require("telegraf");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => {
  ctx.reply("👋 YouTube Downloader Bot\n\nیوازې YouTube لینک راولېږه");
});

bot.on("text", async ctx => {
  const url = ctx.message.text.trim();

  if (!ytdl.validateURL(url)) {
    return ctx.reply("❌ مهرباني وکړئ سم YouTube لینک ولیږئ");
  }

  try {
    await ctx.reply("⏳ Download شروع شو...");

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");

    const filePath = path.join(__dirname, `${title}.mp4`);

    const stream = ytdl(url, {
      quality: "18" // 360p (Telegram-friendly)
    }).pipe(fs.createWriteStream(filePath));

    stream.on("finish", async () => {
      await ctx.replyWithVideo({ source: filePath }, {
        caption: `✅ ${title}`
      });

      fs.unlinkSync(filePath);
    });

  } catch (err) {
    console.error(err);
    ctx.reply("❌ Download error");
  }
});

bot.launch();
console.log("🤖 Bot started");
