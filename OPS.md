# Anime Dice Reference · 运营档案

> 舰队内**第一个不用 AnvilWiki 模板**的站。技术栈 Next.js 16 + Tailwind v4 + shadcn/ui。
> 建档 2026-09-22（上线当天）。

---

## 一、站点档案

| 项 | 值 |
|---|---|
| 域名 | `animedice.xyz`（+ www） |
| 仓库 | https://github.com/ken-fs/animedice |
| Worker | `animedice`（Cloudflare，静态资源） |
| 部署 | Cloudflare Git 集成，push → 自动构建（实测 ~60s） |
| 游戏 | Anime Dice（Roblox） |
| 开发者 | More & More Games |
| placeId / universeId | `113290951185459` / `10708913337` |
| 页面数 | 39（9 顶层 + 28 单位详情 + 404） |
| 技术栈 | Next.js 16 App Router · Tailwind v4 · shadcn/ui(radix) · Geist · Phosphor · `output: export` |
| GA4 | `G-2DH27T5NH6`（**同意门控**） |
| GSC | `sc-domain:animedice.xyz`，服务账号 `gsc-bot@ken-seo-tools...` Owner |
| IndexNow | key `d7a563837a340afeccecc731d4c7692f` |

### 页面结构

```
/               首页：hero + 3 个码 + 概率阶梯 + 四系统 + 诚实性声明
/codes/         14 个码（全部 ≥2 源验证）+ 兑换步骤 + 奖励去向
/units/         28 单位 + 对数轴 rank-frequency 图 + 可排序表格
/units/[slug]/  28 个单位页（odds / income / 阶梯定位 / 花费建议 / 邻居对比）
/grades/        9 个 Grade + **Grade reroll 计算器**（真实概率数学）
/dice/          8 个骰子阶梯 + 跳级决策流程
/traits/        13 个 trait 按 tier 分组
/mutations/     6 个 mutation（倍率故意留空）
/guide/         新手引导
/about/         数据来源规则 + 已知缺口 + 分析说明
```

---

## 二、数据基线（上线时）

### 游戏侧（Roblox API 实测 2026-09-22）

| 指标 | 值 |
|---|---|
| CCU | 39,696 |
| 总访问 | 25,752,639 |
| 收藏 | 73,567 |
| 访问/收藏 | 350（留存代理） |
| 上线 | 2026-08-15（38 天） |
| 最近更新 | 2026-09-21（活跃） |
| 好评率 | 99.4%（319,251 赞 / 2,003 踩） |

### 站点侧（GSC，上线当天）

```
sitemap 提交   2026-09-22T09:01:23
Google 首次抓取 2026-09-22T09:21:01（/）
收录            /  和 /codes/  = Submitted and indexed
其余             URL is unknown to Google（新站分批，正常）
展示/点击        0（尚未有数据）
```

**对照基准**：dungeonlootr 的 **174 点击/千 CCU**（28 天 808 点击 / 4,642 CCU）

---

## 三、核心赌注（还没验证）

**赌的是：零实体页是机会，不是信号。**

事实基础：
- 7 个竞品站，**340 个 URL，零实体页** —— 全在做主题枢纽
- `Anime Dice Enol` 的 SERP 是 u7buy / RockPaperShotgun / GamesRadar / YouTube
  → **没有任何专用站排上去**
- 实体名是故意拼错的动漫名（Sakuna←Sukuna / Naroto←Naruto）
  → 有搜索量但查询归属唯一

**验证方式（1-2 周后）**：
```bash
cd ~/Desktop/david/Ship
node scripts/gsc.mjs report 14 animedice
```
重点看实体词：`anime dice enol` / `anime dice naroto` / `how to get <unit>`

| 结果 | 结论 | 动作 |
|---|---|---|
| 实体词起来 | 模式成立 | 复制到下一个游戏 |
| 实体词没起 | 「零实体页」是信号不是机会（没人做因为没需求） | 回到 Step 0 重新审视判据 |

---

## 四、已知数据缺口（7 项，故意留空）

页面标 `not published`，**不编数字**。要补只能进游戏实测。

```
· 4 个单位的 income/odds（Gujo / Levy / Pikolo / Zenitsa）
· 13 个 traits 的全部 roll 概率
· 6 个 mutations 的全部倍率
· size modifier（huge / titanic）的倍率
· Grade 概率总和 98.6% ≠ 100%（差 1.39%，来源四舍五入或漏一档）
· Tickets 的用途
· Chrono Dice 是否在本阶梯内
```

### 🔴 采集陷阱（永久备查）

网上流传的这套 mutation 数据：
```
Demonic 10x / Dracula 8x / Nightmare 7x / Angelic 6x / Mars 6x / Void 6x
Sinister 5x / Lunar 4x / Solar 4x / Toxic 4x / Ghost 2.5x / Blood 2x
```
**属于 `Fish an Anime RNG`，不是 Anime Dice。**

Anime Dice 的真实 mutation 是**宝石系**：Silver / Gold / Emerald / Diamond / Ruby / Rainbow。
两套毫无重叠。

核实方法：`yt-dlp --print "%(title)s" <视频ID>` 看标题。

---

## 五、运营节奏

### 日常（已自动化）

| 频率 | 动作 | 触发 |
|---|---|---|
| push 时 | 自动构建部署 | Cloudflare Git 集成 |
| 每天 10:00 | 技术巡检（孤岛页/schema/sitemap/部署标记/新 badge） | launchd `com.ken.site-hygiene` |

### 手动

```bash
# 游戏更新时：查新 code / 新单位
curl "https://badges.roblox.com/v1/universes/10708913337/badges?limit=100&sortOrder=Asc"

# 验收
node ~/Desktop/david/Ship/scripts/verify.mjs --deep
```

### 内容更新触发条件

| 信号 | 动作 |
|---|---|
| 游戏出新 code | 抓 3 源交叉验证 → 更新 `/codes/` → 推 IndexNow |
| 游戏出新单位 | badge API 查 → 建单位页 → 更新 sitemap |
| 游戏出新 Grade/Trait/Mutation | 查 Sportskeeda → 更新对应页 + 计算器 |
| 排名数据有实体词展示 | 判断赌注是否成立 |

---

## 六、本批踩的坑（4 个，全部已修）

### 1. CF zone 创建后只检查一次 NS

NS 改完后 zone 一直 `pending`：
```json
"activation_failure_reason": "ns_delegated_from_provider",
"observed_name_servers": ["launch1.spaceship.net."],
"modified_on": "2026-09-22T07:50:38"   ← zone 创建后 38 秒，之后再没检查
```
**修法**：dashboard 点「立即检查名称服务器」。

### 2. 🔴 在 zone pending 时绑自定义域名 → 证书签发失败且不重试

**症状**：DNS 能解析、TCP 能连，但 **TLS 握手读 0 字节直接断**，浏览器「无法访问」。
```
openssl s_client -connect <ip>:443 -servername animedice.xyz
→ no peer certificate available
```

**根因**：绑定域名时 zone 还是 `pending`，CF 拿不到 DNS 控制权 → 证书签发失败，之后不重试。

**修法**：删掉绑定重新绑一次触发签发（17:40:25 签发成功，CN=animedice.xyz）。

**教训**：**必须先等 zone active，再绑自定义域名。**

### 3. `SITE_URL` 兜底指向占位域名会静默出错

4 个文件各写一遍 `process.env.NEXT_PUBLIC_SITE_URL ?? "https://animedice.wiki"`，
而 `animedice.wiki` **是别人没注册的域名**。

CF 构建环境没设变量时会产出指向**别人域名**的 canonical 和 37 条 sitemap URL，
**构建日志完全正常**。

**修法**：抽到 `src/lib/site.ts` 单一来源，兜底改真实域名。

### 4. Next 的 RSC sidecar `.txt` 会被判 soft 404

Next 在每个页面旁写 `__next.*.txt` 的 RSC payload，内容与页面重复但格式不是 HTML。

**修法**：robots 加 `Disallow: /*__next`。
（试过 `next.config` 的 `headers`，**`output: export` 下不生效**）

### 5. 本机 Clash fake-IP 未白名单新域名

排查时发现本机把 `animedice.xyz` 解析成 `198.18.0.84`（Clash fake-IP 段）。

**修法**：`profiles/Merge.yaml` 加 `DOMAIN-SUFFIX,animedice.xyz,DIRECT` +
`fake-ip-filter: "+.animedice.xyz"`，重启 Clash Verge。

---

## 七、方法论沉淀（已回写 SKILL / AGENTS.md）

1. **点击/千 CCU** 作为选游戏核心指标（雷达新增 Step 0「变现效率闸门」）
2. **autocomplete 有联想 ≠ 有搜索需求** —— `anime expeditions kitsune` 有 9 条联想但 SERP 零真实结果
3. **badge API 不是通用实体源** —— 11 个候选全返回 0，替代源用竞品 tier list 页
4. **竞品「主题枢纽」结构 = 最大机会信号** —— 有 `characters/tier-list` 但无 `characters/<名字>`
5. **点击/千 CCU 低时先查结构** —— animeexpeditions 的真因是缺实体页，不是游戏不行

---

## 八、待办队列

### 🔴 本周
- [ ] 等 Google 收录铺开（现在 2/37）
- [ ] 观察 CF 构建是否稳定（已实测 3 次自动部署）

### 🟡 1-2 周后（核心验证）
- [ ] 跑 `gsc.mjs report 14 animedice` 看实体词
- [ ] 判断赌注成立与否 → 决定是否复制模式

### 🔵 backlog（有流量再做）
- [ ] 补数据缺口（需进游戏实测）
- [ ] 加更多计算器（搜 "calculator" 有 5 个变体，目前只做了 Grade）
- [ ] 外链（DEV.to / 竞品分析稿）

---

## 九、变更记录

| 日期 | 动作 |
|---|---|
| 2026-09-22 | 雷达判决 GO（GAME-SCAN-2026-09-22.md） |
| 2026-09-22 | 数据采集完成（`animedice-research/`，7 项缺口） |
| 2026-09-22 | 建站完成（39 页，Pre-Flight 24/24） |
| 2026-09-22 | 域名 + 证书 + Git 自动部署 + GSC + IndexNow + GA 全部接线 |
| 2026-09-22 | 配色改为淡橙浅色系（用户要求），默认主题改浅色 |
| 2026-09-22 | 建立本档案 |
