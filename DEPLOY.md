# 部署说明

站点：`animedice`（Cloudflare Worker，静态资源）
仓库：https://github.com/ken-fs/animedice

---

## 当前状态

| 项 | 状态 |
|---|---|
| 代码 | ✅ 已推到 `main` |
| Worker | ✅ 已部署（手动 `wrangler deploy`） |
| 临时地址 | https://animedice.493129720ljw.workers.dev |
| **CF Git 集成** | ❌ **未连接，需要 dashboard 操作** |
| **域名** | ❌ **未定，`robots.txt` 目前指向占位域名** |

---

## 需要手动做的两件事

### ① 连接 Cloudflare Git 集成

**为什么必须手动**：`wrangler` 的 OAuth scope 列表里没有 `workers_builds`
（实测 `wrangler login --scopes-list` 确认），API 端点 `/accounts/{id}/builds/builds`
返回 `Authentication error`。Workers Builds 只能在 dashboard 配置。

**步骤**：

1. 打开 https://dash.cloudflare.com/?to=/:account/workers-and-pages
2. 点 `animedice` → **Settings** → **Builds**
3. **Connect Git** → 授权 GitHub → 选 `ken-fs/animedice`
4. 填构建配置：

| 字段 | 值 |
|---|---|
| Production branch | `main` |
| Build command | `npx next build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

5. 在 **Environment variables** 加：

| 变量 | 值 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | 最终域名，如 `https://animedice.gg` |

**不连的后果**（AGENTS.md 记过这个坑）：本地 `wrangler deploy` 只是临时生效，
下一次任何 push 触发重建时，未提交的改动会被静默覆盖。

### ② 定域名

`robots.txt` 和 `sitemap.xml` 里的地址由 `NEXT_PUBLIC_SITE_URL` 决定，
目前是占位值 `https://animedice.wiki`（**未注册**）。

**已查可用的候选**：

| 域名 | 状态 |
|---|---|
| `animedice.gg` | ✅ RDAP 404，可用 |
| `diceodds.wiki` | ✅ RDAP 404，可用 |
| `animediceguide.com` | ? 未确认 |
| `animedice.info` | ❌ 已注册 |

**域名加进 Cloudflare 后告诉我，我可以用 API 自动绑定**
（token 有 `workers_routes:write` scope，`custom_domains` 能直接调）。

---

## 域名定下来后我要跑的

```bash
cd ~/Desktop/david/Ship/animedice
NEXT_PUBLIC_SITE_URL=https://<域名> npx next build
npx wrangler deploy
# 然后：绑 custom domain + 提交 GSC + 推 IndexNow
```

---

## 日常部署（Git 集成连上之后）

```bash
git add -A && git commit -m "..." && git push
# → Cloudflare 自动构建并部署
```

推送兜底（GitHub 直连不稳）：

```bash
GIT_TERMINAL_PROMPT=0 git push -q origin main \
  || GIT_TERMINAL_PROMPT=0 git -c http.proxy=http://127.0.0.1:7897 push -q origin main
```

---

## 本地开发

```bash
pnpm dev            # 开发服务器
pnpm build          # 静态导出到 ./out
npx wrangler deploy # 手动部署（临时）
```
