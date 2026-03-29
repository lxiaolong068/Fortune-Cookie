/**
 * Content Auto-Generation Pipeline
 * 自动化内容生成管道：Tavily 选题 → OpenRouter 写作 → Unsplash 配图 → MDX 文件
 */

import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { spawnSync } from "child_process";

import {
  TOPIC_SEED_QUERIES,
  INTERNAL_LINK_TARGETS,
  DEFAULT_CONTENT_MODEL,
  OPENROUTER_CONFIG,
  FALLBACK_TOPICS,
  UNSPLASH_QUERY_MAP,
  type FallbackTopic,
} from "./content-pipeline-config";

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// ─── 类型定义 ─────────────────────────────────────────────────────────────────

export interface PipelineOptions {
  model?: string;
  topic?: string;      // 手动指定话题，跳过 Tavily
  translate?: boolean; // 生成后自动翻译
  notify?: boolean;    // 生成后通知 IndexNow
  dryRun?: boolean;    // 不保存文件，仅展示将要生成的内容
}

export interface StageResult {
  stage: string;
  success: boolean;
  message: string;
  durationMs: number;
  data?: Record<string, unknown>;
}

export interface PipelineResult {
  success: boolean;
  slug?: string;
  title?: string;
  filePath?: string;
  stages: StageResult[];
  error?: string;
}

interface ExistingPost {
  slug: string;
  title: string;
  tags: string[];
  date: string;
}

interface TopicDecision {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  outline: string[];
  unsplashQuery: string;
  targetKeywords: string[];
}

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

// ─── 环境变量 ─────────────────────────────────────────────────────────────────
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const BLOG_DIR = path.join(process.cwd(), "content/blog");

// Unsplash 访问密钥列表
function getUnsplashAccessKeys(): string[] {
  try {
    const configPath = path.join(process.cwd(), "unsplash.config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as { accessKeys?: string[] };
    return config.accessKeys ?? [];
  } catch {
    return [];
  }
}

// ─── Stage 1: 加载现有文章库 ──────────────────────────────────────────────────

function loadExistingPosts(): ExistingPost[] {
  const enDir = path.join(BLOG_DIR, "en");
  if (!fs.existsSync(enDir)) return [];

  const posts: ExistingPost[] = [];
  const files = fs.readdirSync(enDir).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    try {
      const slug = file.replace(".mdx", "");
      const source = fs.readFileSync(path.join(enDir, file), "utf-8");
      const { data } = matter(source);
      posts.push({
        slug,
        title: (data.title as string) || slug,
        tags: (data.tags as string[]) || [],
        date: (data.date as string) || "",
      });
    } catch {
      // 跳过解析失败的文件
    }
  }

  return posts;
}

// ─── Stage 2: Tavily 选题搜索 ─────────────────────────────────────────────────

async function searchWithTavily(queries: string[]): Promise<TavilyResult[]> {
  if (!TAVILY_API_KEY) {
    throw new Error("TAVILY_API_KEY not set");
  }

  const results: TavilyResult[] = [];

  for (const query of queries) {
    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: TAVILY_API_KEY,
          query,
          search_depth: "advanced",
          include_answer: false,
          include_images: false,
          max_results: 5,
          topic: "general",
        }),
      });

      if (!response.ok) {
        console.warn(`[Tavily] Query "${query}" failed: ${response.status}`);
        continue;
      }

      const data = await response.json() as { results?: TavilyResult[] };
      if (data.results) {
        results.push(...data.results);
      }
    } catch (err) {
      console.warn(`[Tavily] Query "${query}" error:`, err);
    }
  }

  // 按 score 降序去重
  const seen = new Set<string>();
  return results
    .filter((r) => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 15);
}

// ─── Stage 3: AI 选题决策 ─────────────────────────────────────────────────────

async function decideTopicWithAI(
  tavilyResults: TavilyResult[],
  existingPosts: ExistingPost[],
  model: string,
  manualTopic?: string,
): Promise<TopicDecision> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY not set");
  }

  const existingTitles = existingPosts.map((p) => `- ${p.title} (slug: ${p.slug})`).join("\n");

  const tavilyContext = tavilyResults.length > 0
    ? `Web search results for inspiration:\n${tavilyResults
        .slice(0, 10)
        .map((r) => `- ${r.title}: ${r.content?.slice(0, 120) ?? ""}...`)
        .join("\n")}`
    : "No web search results available. Use your knowledge to generate a relevant topic.";

  const userInstruction = manualTopic
    ? `The user has requested a specific topic: "${manualTopic}". Generate a blog post idea based on this topic.`
    : `Based on the web search results above and current trends, select the most SEO-valuable and reader-engaging topic.`;

  const systemPrompt = `You are a senior content strategist for Fortune Cookie AI (fortune-cookie.cc), a website with an AI-powered fortune cookie generator.

The blog covers these content pillars:
- AI & Technology (highest priority)
- Wellness & Mindfulness
- Cultural History of Fortune Cookies
- Occasions & Special Events
- Psychology of Luck

EXISTING POSTS (do NOT duplicate these topics):
${existingTitles}

Your task: Select ONE blog post topic that:
1. Does NOT duplicate any existing post (check slug and title carefully)
2. Is SEO-friendly and has search demand
3. Relates naturally to fortune cookies, luck, wisdom, AI, or wellness
4. Will attract readers and drive traffic

${userInstruction}

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "title": "Full blog post title (SEO-optimized, 50-70 characters)",
  "slug": "url-friendly-slug-with-hyphens",
  "description": "Meta description for SEO (140-160 characters)",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "outline": ["H2 section 1", "H2 section 2", "H2 section 3", "H2 section 4", "H2 section 5"],
  "unsplashQuery": "3-4 word query for finding a relevant hero image on Unsplash",
  "targetKeywords": ["primary keyword", "secondary keyword 1", "secondary keyword 2"]
}`;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(`${OPENROUTER_CONFIG.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": OPENROUTER_CONFIG.referer,
          "X-Title": OPENROUTER_CONFIG.title,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: tavilyContext },
          ],
          temperature: 0.4,
          max_tokens: 800,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter API error ${response.status}: ${errText}`);
      }

      const data = await response.json() as { choices?: { message?: { content?: string } }[] };
      const content = data.choices?.[0]?.message?.content?.trim() ?? "";

      // 解析 JSON（兼容 markdown code block 包裹）
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) ?? null;
      const jsonStr = jsonMatch ? jsonMatch[1]!.trim() : content;
      const decision = JSON.parse(jsonStr) as TopicDecision;

      // 验证必填字段
      if (!decision.title || !decision.slug || !decision.description) {
        throw new Error("Invalid topic decision: missing required fields");
      }

      // 检查 slug 冲突
      const slugConflict = existingPosts.some((p) => p.slug === decision.slug);
      if (slugConflict) {
        throw new Error(`Slug conflict: "${decision.slug}" already exists`);
      }

      return decision;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[TopicDecision] Attempt ${attempt}/3 failed: ${lastError.message}`);
      if (attempt < 3) {
        await sleep(2000 * attempt);
      }
    }
  }

  throw lastError ?? new Error("Topic decision failed after 3 attempts");
}

// ─── Stage 4: AI 内容生成 ─────────────────────────────────────────────────────

async function generateContentWithAI(
  topic: TopicDecision,
  model: string,
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY not set");
  }

  const internalLinksContext = INTERNAL_LINK_TARGETS.slice(0, 5)
    .map((l) => `- [${l.anchor}](${l.path}) — ${l.context}`)
    .join("\n");

  const systemPrompt = `You are a professional content writer for Fortune Cookie AI (fortune-cookie.cc).

Write a complete, high-quality blog post in MDX format. Follow these requirements:

CONTENT REQUIREMENTS:
- Target length: 1,200-1,800 words
- Use H2 (##) and H3 (###) headings for clear structure
- Engaging, conversational tone — educational yet accessible
- Include 2-3 internal links naturally within the text using these available pages:
${internalLinksContext}
- Sprinkle the target keywords naturally: ${topic.targetKeywords.join(", ")}
- The opening paragraph should hook the reader immediately
- End with a clear call-to-action encouraging readers to try Fortune Cookie AI

MDX FORMAT:
- Use standard Markdown formatting
- Internal links: [anchor text](/path)
- External links may be included where they add genuine value
- Do NOT include frontmatter (---) — that will be added separately
- Do NOT include the title as H1 — it's in the frontmatter

OUTLINE TO FOLLOW:
${topic.outline.map((section, i) => `${i + 1}. ${section}`).join("\n")}

SEO OPTIMIZATION:
- Include the primary keyword in the first 100 words
- Use keywords in 2-3 H2 headings
- Write meta-friendly alt text for any image descriptions`;

  const userPrompt = `Write a complete blog post with this topic:
Title: ${topic.title}
Description: ${topic.description}
Tags: ${topic.tags.join(", ")}

Follow the outline and guidelines exactly. Return only the MDX content.`;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(`${OPENROUTER_CONFIG.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": OPENROUTER_CONFIG.referer,
          "X-Title": OPENROUTER_CONFIG.title,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter API error ${response.status}: ${errText}`);
      }

      const data = await response.json() as { choices?: { message?: { content?: string } }[] };
      const content = data.choices?.[0]?.message?.content?.trim() ?? "";

      if (content.length < 500) {
        throw new Error(`Content too short: ${content.length} characters`);
      }

      // 移除可能存在的 frontmatter 或 H1 标题
      const cleaned = content
        .replace(/^---[\s\S]*?---\n/m, "")
        .replace(/^#\s+.+\n/m, "")
        .trim();

      return cleaned;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[ContentGeneration] Attempt ${attempt}/2 failed: ${lastError.message}`);
      if (attempt < 2) {
        await sleep(3000);
      }
    }
  }

  throw lastError ?? new Error("Content generation failed after 2 attempts");
}

// ─── Stage 5: Unsplash 配图 ───────────────────────────────────────────────────

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

async function fetchUnsplashImage(query: string): Promise<string> {
  const accessKeys = getUnsplashAccessKeys();
  if (accessKeys.length === 0) {
    return FALLBACK_IMAGE;
  }

  // 随机轮换 access key
  const key = accessKeys[Math.floor(Math.random() * accessKeys.length)]!;

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=5&orientation=landscape&client_id=${key}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json() as { results?: { id: string; urls?: { regular?: string } }[] };
    const photos = data.results ?? [];

    if (photos.length === 0) {
      return FALLBACK_IMAGE;
    }

    // 随机从前 3 张中选一张，增加多样性
    const pick = photos[Math.floor(Math.random() * Math.min(3, photos.length))]!;
    const photoId = pick.id;

    // 构建 Unsplash CDN hotlink URL（与现有博客文章格式一致）
    return `https://images.unsplash.com/photo-${photoId}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080`;
  } catch (err) {
    console.warn(`[Unsplash] Image fetch failed: ${err instanceof Error ? err.message : err}`);
    return FALLBACK_IMAGE;
  }
}

// ─── Stage 6: 保存 MDX 文件 ───────────────────────────────────────────────────

function saveMdxFile(topic: TopicDecision, content: string, imageUrl: string): string {
  const enDir = path.join(BLOG_DIR, "en");
  if (!fs.existsSync(enDir)) {
    fs.mkdirSync(enDir, { recursive: true });
  }

  const today = new Date().toISOString().split("T")[0]!;
  const filePath = path.join(enDir, `${topic.slug}.mdx`);

  const frontmatter = {
    title: topic.title,
    description: topic.description,
    date: today,
    author: "Fortune Cookie AI Team",
    tags: topic.tags,
    image: imageUrl,
    featured: false,
  };

  const mdxContent = matter.stringify(content, frontmatter);
  fs.writeFileSync(filePath, mdxContent, "utf-8");

  return filePath;
}

// ─── Stage 7: 翻译 ────────────────────────────────────────────────────────────

function translatePost(slug: string): { success: boolean; message: string } {
  const locales = ["zh", "es", "pt"];
  const errors: string[] = [];

  for (const locale of locales) {
    try {
      const result = spawnSync(
        "npx",
        ["tsx", "scripts/translate-blog.ts", "--locale", locale, "--slug", slug],
        {
          cwd: process.cwd(),
          stdio: "pipe",
          encoding: "utf-8",
          timeout: 120_000,
        },
      );

      if (result.status !== 0) {
        const errMsg = result.stderr || result.stdout || `exit code ${result.status}`;
        errors.push(`${locale}: ${errMsg.slice(0, 200)}`);
      } else {
        console.log(`[Translate] ✓ ${locale} completed`);
      }
    } catch (err) {
      errors.push(`${locale}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (errors.length > 0) {
    return { success: false, message: `Translation errors: ${errors.join("; ")}` };
  }

  return { success: true, message: `Translated to ${locales.join(", ")}` };
}

// ─── Stage 8: IndexNow 通知 ───────────────────────────────────────────────────

async function notifySearchEngines(slug: string): Promise<{ success: boolean; message: string }> {
  try {
    // 动态 import 以避免服务端模块加载问题
    const { notifyBlogPostUpdate } = await import("./indexnow");
    const result = await notifyBlogPostUpdate(slug);
    return {
      success: result.status === "success",
      message: result.message,
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pickRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ─── 主入口 ───────────────────────────────────────────────────────────────────

export async function runContentGeneration(
  options: PipelineOptions = {},
): Promise<PipelineResult> {
  const {
    model = DEFAULT_CONTENT_MODEL,
    topic: manualTopic,
    translate = process.env.CONTENT_AUTO_TRANSLATE === "true",
    notify = process.env.CONTENT_AUTO_INDEXNOW === "true",
    dryRun = false,
  } = options;

  const stages: StageResult[] = [];
  const log = (stage: string, success: boolean, message: string, durationMs: number, data?: Record<string, unknown>) => {
    stages.push({ stage, success, message, durationMs, data });
    const icon = success ? "✓" : "✗";
    console.log(`[${icon}] ${stage}: ${message} (${durationMs}ms)`);
  };

  console.log(`\n🍪 Fortune Cookie AI — Content Generation Pipeline`);
  console.log(`   Model: ${model}`);
  console.log(`   Mode: ${dryRun ? "dry-run" : "production"}\n`);

  // ── Stage 1: 加载现有文章库 ────────────────────────────────────────────────
  let existingPosts: ExistingPost[] = [];
  {
    const t = Date.now();
    try {
      existingPosts = loadExistingPosts();
      log("LoadPosts", true, `Found ${existingPosts.length} existing posts`, Date.now() - t);
    } catch (err) {
      log("LoadPosts", false, err instanceof Error ? err.message : String(err), Date.now() - t);
      return { success: false, stages, error: "Failed to load existing posts" };
    }
  }

  // ── Stage 2: Tavily 选题搜索 ───────────────────────────────────────────────
  let tavilyResults: TavilyResult[] = [];
  {
    const t = Date.now();
    if (manualTopic) {
      log("TavilySearch", true, "Skipped (manual topic provided)", Date.now() - t);
    } else {
      try {
        const queries = pickRandomItems(TOPIC_SEED_QUERIES, 3);
        console.log(`   Searching: ${queries.join(", ")}`);
        tavilyResults = await searchWithTavily(queries);
        log("TavilySearch", true, `Found ${tavilyResults.length} results`, Date.now() - t);
      } catch (err) {
        // Tavily 失败：使用 fallback 话题池
        const msg = err instanceof Error ? err.message : String(err);
        log("TavilySearch", false, `${msg} — using fallback topics`, Date.now() - t);
      }
    }
  }

  // ── Stage 3: AI 选题决策 ───────────────────────────────────────────────────
  let topicDecision: TopicDecision;
  {
    const t = Date.now();
    try {
      if (tavilyResults.length === 0 && !manualTopic) {
        // 使用 fallback 话题池
        const existingSlugs = new Set(existingPosts.map((p) => p.slug));
        const available = FALLBACK_TOPICS.filter((t) => !existingSlugs.has(t.slug));
        if (available.length === 0) {
          throw new Error("All fallback topics already exist");
        }
        const picked = available[Math.floor(Math.random() * available.length)]!;
        topicDecision = {
          title: picked.title,
          slug: picked.slug,
          description: picked.description,
          tags: picked.tags,
          outline: picked.outline,
          unsplashQuery: picked.unsplashQuery,
          targetKeywords: picked.tags.slice(0, 3),
        };
        log("TopicDecision", true, `Using fallback: "${topicDecision.title}"`, Date.now() - t);
      } else {
        topicDecision = await decideTopicWithAI(tavilyResults, existingPosts, model, manualTopic);
        log("TopicDecision", true, `Selected: "${topicDecision.title}"`, Date.now() - t, {
          slug: topicDecision.slug,
          tags: topicDecision.tags,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log("TopicDecision", false, msg, Date.now() - t);
      return { success: false, stages, error: `Topic decision failed: ${msg}` };
    }
  }

  if (dryRun) {
    console.log("\n📋 Dry run — topic selected, no file will be saved:");
    console.log(JSON.stringify(topicDecision, null, 2));
    return { success: true, slug: topicDecision.slug, title: topicDecision.title, stages };
  }

  // ── Stage 4: AI 内容生成 ───────────────────────────────────────────────────
  let generatedContent: string;
  {
    const t = Date.now();
    try {
      generatedContent = await generateContentWithAI(topicDecision, model);
      const wordCount = generatedContent.split(/\s+/).length;
      log("ContentGeneration", true, `Generated ~${wordCount} words`, Date.now() - t);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log("ContentGeneration", false, msg, Date.now() - t);
      return { success: false, stages, error: `Content generation failed: ${msg}` };
    }
  }

  // ── Stage 5: Unsplash 配图 ─────────────────────────────────────────────────
  let imageUrl: string;
  {
    const t = Date.now();
    try {
      imageUrl = await fetchUnsplashImage(topicDecision.unsplashQuery);
      const isFallback = imageUrl === FALLBACK_IMAGE;
      log("UnsplashImage", true, isFallback ? "Using fallback image" : `Fetched: ${topicDecision.unsplashQuery}`, Date.now() - t);
    } catch (err) {
      imageUrl = FALLBACK_IMAGE;
      log("UnsplashImage", false, `Failed, using fallback: ${err instanceof Error ? err.message : err}`, Date.now() - t);
    }
  }

  // ── Stage 6: 保存 MDX 文件 ─────────────────────────────────────────────────
  let filePath: string;
  {
    const t = Date.now();
    try {
      filePath = saveMdxFile(topicDecision, generatedContent, imageUrl);
      log("SaveMdx", true, `Saved to ${filePath}`, Date.now() - t);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log("SaveMdx", false, msg, Date.now() - t);
      return { success: false, stages, error: `Failed to save MDX: ${msg}` };
    }
  }

  // ── Stage 7: 翻译 ──────────────────────────────────────────────────────────
  if (translate) {
    const t = Date.now();
    const result = translatePost(topicDecision.slug);
    log("Translation", result.success, result.message, Date.now() - t);
    // 翻译失败不终止流程
  } else {
    stages.push({
      stage: "Translation",
      success: true,
      message: "Skipped (translate=false)",
      durationMs: 0,
    });
  }

  // ── Stage 8: IndexNow 通知 ─────────────────────────────────────────────────
  if (notify) {
    const t = Date.now();
    const result = await notifySearchEngines(topicDecision.slug);
    log("IndexNow", result.success, result.message, Date.now() - t);
    // 通知失败不终止流程
  } else {
    stages.push({
      stage: "IndexNow",
      success: true,
      message: "Skipped (notify=false)",
      durationMs: 0,
    });
  }

  console.log(`\n🎉 Done! New post: "${topicDecision.title}"`);
  console.log(`   File: ${filePath!}`);
  console.log(`   URL:  /blog/${topicDecision.slug}\n`);

  return {
    success: true,
    slug: topicDecision.slug,
    title: topicDecision.title,
    filePath: filePath!,
    stages,
  };
}
