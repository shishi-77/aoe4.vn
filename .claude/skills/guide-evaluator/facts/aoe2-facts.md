# AoE2 Facts Reference (ground truth for fact-checking comparison guides)

**Scope**: Age of Empires II, primarily the Definitive Edition (2019) as the version people play
today. Where a fact is specific to the original Age of Kings (1999) it is marked.

**Reviewed by**: NOBODY YET. Every entry below was gathered from the web on 2026-08-08 and
carries the URL it came from. This file has NOT been through a domain-expert pass the way
`aoe1-facts.md` and `aoe4-facts.md` have. Treat it as sourced, not as blessed.

**Why this file exists**: the scheduled headless run cannot reach the web (network policy allows
only GitHub/npm), so a `comparison` article could never satisfy the "must carry a source URL"
rule for AoE2 claims. This file is the cache: the fetch happened here, in an owner-present
session, and the URL travels with the fact.

**Sourcing note**: `ageofempires.fandom.com` returns HTTP 402 and `liquipedia.net` returns HTTP
403 to the fetch tool, so neither could be read directly this pass. Facts below lean on English
Wikipedia, the Steam store listing, the official ageofempires.com page and aoedb.net. Where a
fact came from a search-result summary rather than a page actually read, it says so.

---

## Ages & advancing

- AoE2 has four Ages: **Dark Age → Feudal Age → Castle Age → Imperial Age**, spanning what the
  article calls "a 1,000-year timeframe". Castle Age represents the High Middle Ages, Imperial
  Age the Renaissance. - source: https://en.wikipedia.org/wiki/Age_of_Empires_II
- Advancing an Age has two requirements: **build certain buildings from the current age, then pay
  a sum of resources**. Advancing unlocks new units, structures and technologies.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II ,
    https://en.wikipedia.org/wiki/Age_of_Empires_II:_The_Age_of_Kings
- The age-up itself is researched **at the Town Center**, not by choosing a landmark building.
  This is the durable structural contrast with AoE4, where most (not all) civs pick one of two
  Landmarks. ⚠️ CẦN NGƯỜI DUYỆT - the Town Center location is consistent with both Wikipedia
  articles describing a resource payment plus building prerequisites, but neither page states
  "at the Town Center" in those words. Do not assert the phrasing without a fresh check.
- Cited age-up costs: **Feudal 500 food; Castle 800 food + 200 gold; Imperial 1000 food + 800
  gold**. Building prerequisite is **two buildings from the current age** (example given:
  Blacksmith + Archery Range before Castle Age).
  ⚠️ CẦN NGƯỜI DUYỆT - these numbers come from a WebSearch summary of gamerjournalist.com and
  forum threads, not from a primary stat table that was actually read. They match the widely
  cited community figures, but AoE2 numbers are also patch-adjustable. Treat "food-heavy, and it
  gets steeply more expensive each age" as the durable claim; cite the raw numbers only if
  re-verified. - source: WebSearch summary, https://gamerjournalist.com/age-of-empires-2-how-to-advance-ages/

## Resources & economy

- **Four resources: food, wood, gold, stone.** Food from hunting, berries, livestock, farming and
  fishing; wood from trees; gold from mines or trade; stone from stone mines.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II
- Villagers gather, and must return resources to a **drop-off building** - Town Center, mining
  camp, mill, or lumber camp. Villagers are male or female and sex does not affect ability.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II
- Population capacity is configurable **between 25 and 200, in steps of 25**.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II:_The_Age_of_Kings
- **Stone is a distinct resource in AoE2 and it is what gates defensive building.** This is a
  real structural difference from AoE4 worth writing about, but the exact costs of walls/towers
  were not sourced this pass. ⚠️ CẦN NGƯỜI DUYỆT before any article states a stone cost.

## Counters

- AoE2 combat follows a **rock-paper-scissors model**. Wikipedia's worked example: infantry are
  strong against buildings but weak against cavalry, so the infantry counter units - **spearmen
  and pikemen - carry an attack bonus against cavalry**.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II
- Counters work through **bonus damage against armor classes**, not categorical dominance. Worked
  example from the source: a Halberdier has 6 base attack but **+26 bonus damage vs the cavalry
  armor class**, so it hits a Knight for 32 before the Knight's 2 melee armor applies.
  - source: https://aoedb.net/aoe2/counters/
- Counter matrix as listed by aoedb.net:
  | Unit class | Beats | Loses to |
  | --- | --- | --- |
  | Archers | infantry, cavalry | skirmishers, siege |
  | Skirmishers | archers, spearmen | infantry, cavalry, siege |
  | Spearmen / Pikemen / Halberdiers | cavalry | archers, hand cannoneers |
  | Knights / cavalry | archers, siege, monks | spearmen, camels, monks |
  | Camels | cavalry | - |
  | Infantry (Militia line) | buildings, trash units | archers, hand cannoneers, cavalry archers |
  | Siege (Mangonels) | massed archers, buildings | cavalry, bombard cannons |
  | Monks | convert expensive units (knights, elephants) | light cavalry, scouts, eagle warriors |
  | Eagle Warriors | cavalry, gunpowder, chases archers | - |
  - source: https://aoedb.net/aoe2/counters/
  - Note the loop is NOT the tidy three-way cycle AoE4 has. Knights both beat monks and lose to
    monks in that table, which is a real property of bonus-damage counters (it depends on
    numbers, upgrades and whether conversion lands), not a mistake in the source. An article
    should describe AoE2 counters as a web of bonus damage, not as a triangle.
- **Skirmisher and Spearman are "trash units"** - the source's own term - meaning cheap counter
  units costing no gold. AoE4 has no direct equivalent concept.
  ⚠️ CẦN NGƯỜI DUYỆT - "trash unit" appears in the aoedb counter guide as community vocabulary;
  the no-gold definition is inferred from context, not stated outright.

## Defensive structures & the Castle

- Defensive building includes **walls and towers**; the Castle is a distinct, later building.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II:_The_Age_of_Kings
- The **Castle** is described as "a key offensive and defensive building": it builds trebuchets,
  trains the civilization's unique unit(s), and fires a hail of arrows at enemy units. Castles
  can only be built from the Castle Age onward in standard play.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II:_The_Age_of_Kings
- ⚠️ CẦN NGƯỜI DUYỆT - walls/gates/tower tiers, their HP, and whether melee units can damage
  stone walls in AoE2 were NOT sourced this pass. The AoE4 store records that AoE4 stone walls
  can only be damaged by dedicated siege; do NOT assume the AoE2 rule is the same or different
  without a source. The `tuong-thanh-aoe4-vs-aoe2` queue item cannot be written until this gap
  is filled.

## Civilizations & unique units

- Each civilization has **one or two unique units exclusive to it**, trained at the Castle, plus
  unique technologies. - source: https://en.wikipedia.org/wiki/Age_of_Empires_II ,
  https://en.wikipedia.org/wiki/Age_of_Empires_II:_The_Age_of_Kings
- The original 1999 Age of Kings shipped **13 civilizations** in four architectural styles.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II
- **The current civilization count is contested across official sources and MUST NOT be printed
  as a hard number in an article.** Gathered the same day: the official ageofempires.com product
  page says "35 different civilizations"; the Steam store listing says "42 Civilizations"; a
  WebSearch summary of the Fandom wiki says 53 including 2026 DLC. These disagree because the
  marketing pages are updated at different times and DLC keeps landing.
  - source: https://www.ageofempires.com/games/aoeiide/ ,
    https://store.steampowered.com/app/813780/Age_of_Empires_II_Definitive_Edition/ ,
    WebSearch summary of https://ageofempires.fandom.com/wiki/Civilization_(Age_of_Empires_II)
  - **WRITING RULE**: describe the shape ("hàng chục phe, và vẫn còn thêm qua DLC"), never a
    count. A hard number both dates the article and is likely to be wrong on the day it ships.

## Monks & relics

- Monks **convert enemy units** to the player's civilization and **heal allied units**. They also
  collect relics, which accumulate gold once stored in the player's monastery, and holding all
  relics is a victory condition. - source: https://en.wikipedia.org/wiki/Age_of_Empires_II

## Definitive Edition: release, support, longevity

- AoE2:DE released **14 November 2019** on Windows (Game Pass for PC, Microsoft Store, Steam),
  then Xbox One / Series X|S on 31 January 2023, PlayStation 5 on 6 May 2025, macOS on
  28 May 2026. - source: https://en.wikipedia.org/wiki/Age_of_Empires_II:_Definitive_Edition ,
  https://en.wikipedia.org/wiki/Age_of_Empires_II
- The game is **still actively expanded in 2026**. Expansion timeline: Lords of the West (Jan
  2021), Dawn of the Dukes (Aug 2021), Dynasties of India (Apr 2022), Return of Rome (May 2023),
  The Mountain Royals (Oct 2023), Victors and Vanquished (Mar 2024), Chronicles: Battle for
  Greece (Nov 2024), The Three Kingdoms (May 2025), Chronicles: Alexander the Great (Oct 2025),
  **The Last Chieftains (17 Feb 2026)**.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II:_Definitive_Edition
- **The Viking Sagas (Danes, Saxons, Varangians) is announced for 2026 but had not shipped as of
  2026-08-08.** Do not write about it in the past tense.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II:_Definitive_Edition , WebSearch
    summary describing a fall-2026 release
- Reception: Metacritic 84/100, OpenCritic 92% recommend. Critics praised the visual work; a
  recurring criticism is balance and a "pay to win" concern around DLC civilizations.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II:_Definitive_Edition
- Cross-platform play works across PC, Xbox and PlayStation, and balance patches ship frequently.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II:_Definitive_Edition
- This is the sourced backbone for "why AoE2 is still the one people play": continuous expansion
  for seven years, cross-platform, active patching. It does NOT require disparaging AoE4 - and
  per the evaluator's `disparagement[]` rule, must not.

---

## Open questions for the human reviewer

1. **Vietnamese vocabulary for AoE2 is deliberately absent from this file.** `aoe1-facts.md` has
   a vocabulary map because the owner supplied it. Nothing equivalent was gathered for AoE2, and
   inventing slang would be exactly the audience-mismatch failure that got PR #24 rolled back.
   Owner: does the VN scene use distinct AoE2 terms, or English unit names?
2. Walls/gates/towers in AoE2: tiers, stone cost, and whether non-siege units can damage stone
   walls. Blocks the `tuong-thanh-aoe4-vs-aoe2` queue item entirely.
3. Confirm the age-up costs (500 / 800+200 / 1000+800) against a primary stat table. Currently
   from a search summary.
4. Confirm the age-up is researched at the Town Center, and confirm the "two buildings from the
   current age" prerequisite generalizes to every age transition.
5. Is "trash unit" the right register for a Vietnamese article, and is there a VN equivalent?
6. Economy comparison AoE2 vs AoE4 (`kinh-te-aoe4-vs-aoe2`) needs farm/villager mechanics on the
   AoE2 side that were not gathered here - gathering rates, farm reseeding, market.
