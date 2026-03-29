#!/usr/bin/env npx tsx
/**
 * Blog Post Auto-Generation Script
 * 博客文章自动生成脚本
 *
 * 工作流: Tavily 选题 → OpenRouter 写作 → Unsplash 配图 → 保存 MDX → 翻译 → IndexNow
 *
 * Usage:
 *   npx tsx scripts/generate-blog-post.ts
 *   npx tsx scripts/generate-blog-post.ts --model "google/gemini-2.5-flash"
 *   npx tsx scripts/generate-blog-post.ts --topic "mindfulness fortune cookies"
 *   npx tsx scripts/generate-blog-post.ts --dry-run
 *   npx tsx scripts/generate-blog-post.ts --translate --notify
 *   npx tsx scripts/generate-blog-post.ts --help
 */

import * as dotenv from "dotenv";
import path from "path";

// 优先加载 .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { runContentGeneration, type PipelineOptions } from "../lib/content-pipeline";

// ─── CLI 参数解析 ─────────────────────────────────────────────────────────────

function parseArgs(): PipelineOptions & { help: boolean } {
  const args = process.argv.slice(2);
  const options: PipelineOptions & { help: boolean } = {
    help: false,
    translate: process.env.CONTENT_AUTO_TRANSLATE === "true",
    notify: process.env.CONTENT_AUTO_INDEXNOW === "true",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    switch (arg) {
      case "--help":
      case "-h":
        options.help = true;
        break;
      case "--model":
      case "-m":
        options.model = args[++i];
        break;
      case "--topic":
      case "-t":
        options.topic = args[++i];
        break;
      case "--dry-run":
      case "-d":
        options.dryRun = true;
        break;
      case "--translate":
        options.translate = true;
        break;
      case "--no-translate":
        options.translate = false;
        break;
      case "--notify":
        options.notify = true;
        break;
      case "--no-notify":
        options.notify = false;
        break;
      default:
        console.warn(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`
Fortune Cookie AI — Blog Post Auto-Generator
Usage: npx tsx scripts/generate-blog-post.ts [options]

Options:
  --model <model>    OpenRouter model (default: env CONTENT_GENERATION_MODEL or x-ai/grok-4.1-fast)
  --topic <text>     Specify topic manually (skips Tavily search)
  --dry-run          Show selected topic without generating content
  --translate        Auto-translate to zh, es, pt after generation
  --no-translate     Skip translation (overrides env CONTENT_AUTO_TRANSLATE)
  --notify           Notify IndexNow after generation
  --no-notify        Skip IndexNow notification
  --help             Show this help

Environment Variables:
  OPENROUTER_API_KEY          Required for AI writing
  TAVILY_API_KEY              Required for topic discovery (fallback pool used if missing)
  CONTENT_GENERATION_MODEL    Default AI model
  CONTENT_AUTO_TRANSLATE      "true" to auto-translate (default: false)
  CONTENT_AUTO_INDEXNOW       "true" to auto-notify IndexNow (default: false)

Examples:
  # Basic generation
  npx tsx scripts/generate-blog-post.ts

  # With Gemini Flash model
  npx tsx scripts/generate-blog-post.ts --model "google/gemini-2.5-flash"

  # Manual topic + translate all languages
  npx tsx scripts/generate-blog-post.ts --topic "AI astrology digital trends" --translate --notify

  # Preview topic only (no AI writing, no file saved)
  npx tsx scripts/generate-blog-post.ts --dry-run

  # Recommended for cron/scheduler:
  npx tsx scripts/generate-blog-post.ts --translate --notify
`);
}

// ─── 主函数 ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  // 检查必需的环境变量
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("Error: OPENROUTER_API_KEY environment variable is not set");
    console.error("Please add it to .env.local");
    process.exit(1);
  }

  if (!process.env.TAVILY_API_KEY && !options.topic) {
    console.warn(
      "Warning: TAVILY_API_KEY not set. Will use fallback topic pool for topic discovery.",
    );
  }

  const result = await runContentGeneration(options);

  if (!result.success) {
    console.error(`\nPipeline failed: ${result.error}`);
    console.error("\nStage summary:");
    result.stages.forEach((s) => {
      console.error(`  ${s.success ? "✓" : "✗"} ${s.stage}: ${s.message}`);
    });
    process.exit(1);
  }

  // 打印成功摘要
  console.log("\n📊 Pipeline Summary:");
  result.stages.forEach((s) => {
    const icon = s.success ? "✓" : "⚠";
    console.log(`   ${icon} ${s.stage.padEnd(20)} ${s.message} (${s.durationMs}ms)`);
  });

  process.exit(0);
}

main().catch((err: unknown) => {
  console.error("Fatal error:", err instanceof Error ? err.message : err);
  process.exit(1);
});
