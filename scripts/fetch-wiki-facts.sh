#!/usr/bin/env bash
#
# Refresh source material for the fact stores in .claude/skills/guide-evaluator/facts/.
#
# Why this exists: the agent's WebFetch tool gets HTTP 402 from ageofempires.fandom.com and
# HTTP 403 from liquipedia.net, so an agent that only knows WebFetch concludes the sources are
# unreachable. They are not. Both answer plain curl given the right request:
#
#   - Fandom: use the ?action=raw endpoint, which returns page wikitext including the stat
#     infoboxes. Send a descriptive User-Agent. Fandom rate-limits at roughly 8 rapid requests
#     and returns 403 until you pause, so a 403 here means "slow down", not "forbidden" -
#     hence the retry loop.
#   - Liquipedia: gzip is mandatory (a plain request gets 406 telling you so) and action=parse
#     is limited to about one request per 30 seconds under their API terms. Hence the slow lane.
#     See https://liquipedia.net/api-terms-of-use
#
# Output lands in a directory you pass as $1 (default ./wiki-cache), one file per page. Nothing
# here writes to the fact stores - a human still reads the wikitext and decides what becomes a
# fact, because the whole point of the stores is that a claim carries a source somebody checked.
#
# Usage: bash scripts/fetch-wiki-facts.sh [output-dir]
set -u

OUT="${1:-./wiki-cache}"
UA="aoe4vn-facts-builder/1.0 (https://aoe4.vn; contact quanglinhcnf@gmail.com)"
mkdir -p "$OUT"
log() { echo "[$(date +%H:%M:%S)] $*"; }

# Fandom wikis: ?action=raw, retried because 403 means rate limit rather than refusal.
fandom() {
  local host="$1" page="$2" name="$3" attempt code size
  for attempt in 1 2 3; do
    code=$(curl -sS -m 30 -A "$UA" -o "$OUT/$name.wiki" -w '%{http_code}' \
      "https://$host/wiki/$page?action=raw")
    size=$(wc -c <"$OUT/$name.wiki" 2>/dev/null || echo 0)
    log "$name (attempt $attempt) -> $code, $size bytes"
    [ "$code" = "200" ] && { sleep 8; return 0; }
    [ "$code" = "404" ] && { log "$name: page title does not exist, not retrying"; return 1; }
    sleep 20
  done
  log "$name: GAVE UP"
  return 1
}

# Liquipedia: gzip mandatory, ~1 request / 30s for action=parse. Returns JSON, not raw wikitext.
liquipedia() {
  local wiki="$1" page="$2" name="$3" code size
  code=$(curl -sS -m 30 --compressed -A "$UA" -o "$OUT/$name.json" -w '%{http_code}' \
    "https://liquipedia.net/$wiki/api.php?action=parse&prop=wikitext&format=json&page=$page")
  size=$(wc -c <"$OUT/$name.json" 2>/dev/null || echo 0)
  log "$name -> $code, $size bytes"
  sleep 31
}

log "=== AoE2 (feeds aoe2-facts.md) ==="
fandom ageofempires.fandom.com "Counter" counter-all-titles
fandom ageofempires.fandom.com "Feudal_Age_(Age_of_Empires_II)" aoe2-feudal
fandom ageofempires.fandom.com "Castle_Age_(Age_of_Empires_II)" aoe2-castle-age
fandom ageofempires.fandom.com "Imperial_Age_(Age_of_Empires_II)" aoe2-imperial
fandom ageofempires.fandom.com "Stone_Wall_(Age_of_Empires_II)" aoe2-stone-wall
fandom ageofempires.fandom.com "Palisade_Wall_(Age_of_Empires_II)" aoe2-palisade
fandom ageofempires.fandom.com "Watch_Tower_(Age_of_Empires_II)" aoe2-tower
fandom ageofempires.fandom.com "Castle_(Age_of_Empires_II)" aoe2-castle
fandom ageofempires.fandom.com "Trash_unit" aoe2-trash
fandom ageofempires.fandom.com "Farm_(Age_of_Empires_II)" aoe2-farm

log "=== AoE3 (feeds aoe3-facts.md) ==="
fandom ageofempires.fandom.com "Age_of_Empires_III" aoe3-main
fandom ageofempires.fandom.com "Home_City" aoe3-home-city

log "=== AoE4 (feeds aoe4-facts.md) ==="
fandom ageofempires.fandom.com "Age_of_Empires_IV" aoe4-main

log "=== StarCraft (feeds starcraft-facts.md) ==="
# starcraft.fandom.com is lore-first - its race pages open with novel quotes - so gameplay
# mechanics come from Liquipedia. These two Fandom pages are the exception worth keeping.
fandom starcraft.fandom.com "Supply" sc-supply
fandom starcraft.fandom.com "Vespene_gas" sc-vespene

log "=== Liquipedia slow lane, ~30s apart ==="
liquipedia starcraft2 "Battle.net_Leagues" sc2-leagues
liquipedia starcraft2 "Macro" sc2-macro
liquipedia starcraft2 "Resources" sc2-resources
liquipedia starcraft2 "Global_StarCraft_II_League" sc2-gsl

log "DONE - read the files in $OUT, then update the fact stores by hand."
