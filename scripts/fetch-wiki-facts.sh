#!/usr/bin/env bash
#
# Refresh source material for the fact stores in .claude/skills/guide-evaluator/facts/.
#
# ---------------------------------------------------------------------------------------------
# SOURCE RANKING - read this before reaching for any page below.
#
# Everything this script fetches is a SECONDARY source. Fandom and Liquipedia are community
# wikis; they are worth fetching because their stat infoboxes sit close to the game data, not
# because they are authoritative. Reach for them only after the ranking below is exhausted.
#
#   1. Publisher / rights holder - the primary source for what a game IS and what shipped:
#        https://www.ageofempires.com/games/aoe/                  (AoE1 DE)
#        https://www.ageofempires.com/games/aoeiide/              (AoE2 DE)
#        https://www.ageofempires.com/games/aoeiiide/             (AoE3 DE)
#        https://www.ageofempires.com/games/age-of-empires-iv/    (AoE4)
#        https://www.ageofempires.com/games/age-of-mythology-retold/
#        https://www.ageofempires.com/news/                       (per-DLC announcements, dated)
#        https://rebellion.com/                                   (Empire Earth rights holder)
#      All of these answer WebFetch directly - no curl needed. NOTE the product pages are
#      marketing pages: they carry pantheon/civ/DLC LISTS but usually no release dates.
#
#   2. Official storefront - the primary source for DATES, studios and DLC status. The release
#      date field is publisher-supplied metadata, and DLC marked "Coming Soon" is the cleanest
#      proof that something has NOT shipped yet:
#        store.steampowered.com/app/1017900/  AoE1 DE      store.steampowered.com/app/813780/   AoE2 DE
#        store.steampowered.com/app/933110/   AoE3 DE      store.steampowered.com/app/1466860/  AoE4
#        store.steampowered.com/app/1934680/  AoM Retold   gog.com/en/game/empire_earth_gold_edition
#      Caveat: a Steam date is the STEAM release, which can differ from the game's first
#      release (AoE1 DE launched on the Windows Store 2018-02-20 and reached Steam 2019-08-19).
#
#   3. Community wikis - what this script fetches. Gameplay mechanics, unit stats, counter
#      tables: things the publisher does not document. Also the fallback for the 1997-2007
#      original releases, whose primary pages no longer exist anywhere online.
#
# WHY THIS RANKING IS WRITTEN DOWN (owner, 2026-08-08): the `de-che-co-nhung-ban-nao` draft
# sourced 5 of its 10 claims-bearing URLs from Wikipedia and stated that Age of Mythology:
# Retold had two pantheon expansions. It has three - Obsidian Mirror shipped 2026-04-21 and
# Wikipedia had not caught up. The publisher's own page and the Steam page both listed it.
# The newer the content, the further behind the secondary sources are; for anything shipped in
# the last year or two, a wiki is the WORST place to look, not merely a weaker one.
# ---------------------------------------------------------------------------------------------
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
liquipedia starcraft2 "ESL_Pro_Tour" sc2-ept
# Current-season pages carry the live prize pool in their infobox. Bump the year as needed - the
# Winnings/<year> pages look like the obvious source for aggregates but are pure template
# transclusion, so their wikitext is empty of numbers.
liquipedia starcraft2 "Global_StarCraft_II_League/2026/Season_1" sc2-gsl-2026

liquipedia ageofempires "Red_Bull_Wololo/Londinium/AoE4" aoe4-rbw

# --- Ranked and esports sources (added 2026-08-08) ---
# These are not wikis, so they are listed here as documentation rather than fetched above:
#   AoE4 ranked FAQ (curl with a browser-ish UA; WebFetch gets 403):
#     https://support.ageofempires.com/hc/en-us/articles/5776946601876-Age-Of-Empires-IV-Ranked-Season-FAQ
#   AoE4 ranked divisions and tiers (WebFetch works):
#     https://www.ageofempires.com/news/deep-dive-on-age-of-empires-iv-1v1v-ranked-seasons/
#   ageofempires.com/stats/ageivseasons/ renders its season table via JS - useless to both tools.
# Liquipedia per-event pages DO carry the prize pool in their infobox, unlike the tournament
# index pages, which are pure template transclusion. Fetch events by name:
#   the aoe4-rbw line above is the pattern - swap the event name for next year's flagship.

log "DONE - read the files in $OUT, then update the fact stores by hand."
