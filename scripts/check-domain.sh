#!/usr/bin/env bash
# 检查 animedice.xyz 是否已生效（NS 改完后跑）
set -uo pipefail
D=animedice.xyz

echo "▸ NS 委派"
NS=$(dig +short @1.1.1.1 NS $D 2>/dev/null | sort)
if echo "$NS" | grep -q cloudflare; then
  echo "$NS" | sed 's/^/    ✅ /'
else
  echo "$NS" | sed 's/^/    ⏳ /' || echo "    ⏳ 无记录"
  echo "    → 去 Spaceship 改成: ariella.ns.cloudflare.com / seamus.ns.cloudflare.com"
fi

echo
echo "▸ A 记录"
IP=$(dig +short @1.1.1.1 $D A 2>/dev/null | tail -1)
[ -n "$IP" ] && echo "    $D → $IP" || echo "    ⏳ 未解析"

echo
echo "▸ HTTP 响应"
for u in "https://$D/" "https://www.$D/"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 --resolve "${u#https://}:443:${IP:-1.1.1.1}" "$u" 2>/dev/null)
  printf "    %-30s %s\n" "$u" "$code"
done

echo
echo "▸ 内容核对（走 workers.dev，不受本机 DNS 影响）"
B="https://animedice.493129720ljw.workers.dev"
curl -s --max-time 20 "$B/robots.txt" | sed 's/^/    /'
