# StarCraft Facts Reference (ground truth for fact-checking comparison guides)

**Scope**: StarCraft II primarily, since that is what the queue's comparison items are about
(`aoe4-vs-starcraft-tu-duy-chien-thuat`, `dan-starcraft-choi-aoe4`,
`ranked-aoe4-vs-ladder-starcraft`, `esports-aoe4-vs-starcraft2`, `micro-aoe4-vs-starcraft`).

**Reviewed by**: NOBODY YET. Gathered 2026-08-08 with sources attached.

**Sourcing note.** Liquipedia is the canonical StarCraft reference and it *is* reachable: it
requires gzip and rate-limits `action=parse` to about one request per 30 seconds, which plain
`curl` handles fine. Its race pages and `starcraft.fandom.com` alike are written lore-first
though - the Terran page opens with a novel quote, not a build order - and the gameplay-mechanics
pages sit under titles that mostly redirect. So where the AoE2 file is built on stat infoboxes,
this one is built on prose plus two tournament infoboxes. The ladder, macro and 2026 esports
sections are solid; the race-design section is still the soft spot.

**Register warning**: the evaluator's `disparagement[]` rule covers StarCraft exactly as it covers
AoE1/AoE2/AoE3. StarCraft players are the intended readers of these articles. "SC quá khó",
"SC khô khan", "AoE4 dễ thở hơn nên hay hơn" are disparagement, not comparison.

---

## Races

- Three playable races: **Terran, Zerg, Protoss**. The campaigns split along them: Wings of
  Liberty (2010) Terran, Heart of the Swarm (2013) Zerg, Legacy of the Void (2015) Protoss.
  - source: https://en.wikipedia.org/wiki/StarCraft_II
- The design is **asymmetric balance**: three races that play completely differently, balanced
  against each other rather than mirrored. This is the sharpest contrast with the Age series,
  where civilizations share a common unit skeleton and differ by bonuses, unique units and
  tech-tree gaps.
  - source: WebSearch summary of https://simonhalliday.com/2019/09/04/starcraft-ii-a-study-in-asymmetrical-design/
  ⚠️ CẦN NGƯỜI DUYỆT - the claim is uncontroversial but came from a search summary of analysis
  pieces, not a primary design document.
- Flavour of the asymmetry, from the same summary: Zerg are built around swarm tactics where no
  single unit matches its counterpart - "four zerglings cost the same as a single protoss
  zealot". Terran can mine extra minerals; Zerg generate larvae at the hatchery to spawn many
  units at once.
  ⚠️ CẦN NGƯỜI DUYỆT - unit costs and racial economy wording are patch-sensitive and
  search-summary grade. Use to illustrate the design idea, never as a stat claim.

## Resources and supply

- StarCraft and StarCraft II have **two main resources: minerals and vespene gas.**
  - source: https://starcraft.fandom.com/wiki/Vespene_gas
- **Supply caps army size, with a maximum of 200**, and is raised by constructing supply
  buildings. New units can be produced only while cumulative supply stays within the available
  supply. - source: https://starcraft.fandom.com/wiki/Supply
- Community notation, useful because it shows what the game asks a player to track: supply is
  written *x*/*y* (used / available), and **unit costs are written x/y/z = minerals / vespene gas
  / supply**. - source: https://starcraft.fandom.com/wiki/Supply
- **All three races raise supply, each with its own thing: Pylons (Protoss), Depots (Terran),
  Overlords (Zerg).** Liquipedia names all three in one line and adds a useful framing - "Supply
  is considered one of the three Resources", so a StarCraft player thinks of supply as a resource
  to spend on, not just a ceiling to avoid.
  - source: https://liquipedia.net/starcraft2/Macro
  - The `starcraft.fandom.com` Supply page reads Terran-only ("a terran gameplay counter...
    supply depots") because it is written per-race; do not take it as meaning only Terran has
    supply.
- Compare with the Age series for the article: AoE2 has four resources including stone, AoE3 has
  three (food, coin, wood), AoE4 has four. StarCraft has two plus a hard supply cap. Those are
  all sourced in their own files.

## Ladder and ranking

- **Seven leagues**, lowest to highest: **Bronze, Silver, Gold, Platinum, Diamond, Master,
  Grandmaster.** Each is divided into numerous divisions.
  - source: https://liquipedia.net/starcraft2/Battle.net_Leagues
- **Divisions hold up to 100 players** each and are named from StarCraft terminology plus an ICAO
  phonetic-alphabet letter, e.g. "Gold League / Division Zeratul Juliet".
  - source: https://liquipedia.net/starcraft2/Battle.net_Leagues
- A player is placed after **5 placement matches**, and placement can never put a player directly
  into Grandmaster no matter how well they do.
  - source: https://liquipedia.net/starcraft2/Battle.net_Leagues
- **Grandmaster is the top 200 players per region**, 1v1 only, and opens one week after a season
  starts. It is the one league with a hard size cap rather than a skill threshold.
  - source: https://liquipedia.net/starcraft2/Battle.net_Leagues
- The system separates **ladder points from MMR**: points determine rank within a division and are
  "only weakly correlated to skill" - with an unspent bonus pool they track activity more than
  ability. The **bonus pool** accrues over time and absorbs losses. On promotion or demotion,
  points reset to 73 + spent bonus pool.
  - source: https://liquipedia.net/starcraft2/Battle.net_Leagues
- A **Copper league** below Bronze existed in beta and was removed; Master was added in patch 1.2
  and Grandmaster in 1.3. - source: https://liquipedia.net/starcraft2/Battle.net_Leagues
- **Liquipedia flags its own reliability here**: "Much of this article is based on empirical
  research and scattered Blue posts, so there might be errors and inaccuracies." Quote the league
  names and the top-200 cap with confidence; treat the points arithmetic as approximate.
  - source: https://liquipedia.net/starcraft2/Battle.net_Leagues
- ⚠️ BLOCKER for `ranked-aoe4-vs-ladder-starcraft`: **AoE4's own ranked structure is not recorded
  in `aoe4-facts.md`.** This file now has a well-sourced StarCraft half and there is still no
  AoE4 half to compare it against. That item stays blocked on the AoE4 side, not this one.

## Macro, micro, APM

- **Macro** (macromanagement) is "everything dealing with your economy" - spending minerals and
  gas, and avoiding a supply block. Liquipedia frames the decision as three places to put money:
  **Army** (units and the production buildings that make them), **Tech** (progressing the tech
  tree, or upgrades), and **Economy** (workers, expansions, and supply buildings). Players
  generally want to spend as soon as possible.
  - source: https://liquipedia.net/starcraft2/Macro
- **Micro** is the fine-grained half - individual units in combat, and worker efficiency. In Age
  terms, "if it relates to resources or your base, it falls under macro."
  - source: WebSearch summary of https://www.e-sportsbetting.org/blog/macro-micro-and-apm-starcraft-terminology-101/
    and https://steamcommunity.com/app/221380/discussions/0/350543389019096408/
- **SC2 deliberately automated things SC1 made you do by hand**, and the change was contested:
  Multiple Building Selection and Automine were "a hotly debated topic in the early stages of
  SC2's development", with players worried that lowering the macro workload would lower the skill
  ceiling. Concretely, unlike StarCraft 1, workers now start mining automatically when rallied to
  resources and **split themselves evenly among patches**.
  - source: https://liquipedia.net/starcraft2/Macro
  - This is the most useful single fact in this file for `micro-aoe4-vs-starcraft`: it shows the
    macro/micro split is a *design choice a series argues about internally*, not a fixed
    difference between franchises. It also lets the article make its point without ranking the
    two games against each other.
- **APM (actions per minute)** counts clicks and keyboard inputs per minute; higher APM means
  more things physically managed at once. StarCraft is widely described as demanding high APM at
  a high level. - source: same
- One concrete, non-judgmental mechanical difference: **AoE2 offers unit formations selectable in
  a single click** (square, turtle and so on) where StarCraft requires manual positioning through
  multiple clicks.
  - source: WebSearch summary of https://steamcommunity.com/app/105430/discussions/0/864960354170086771/
  ⚠️ CẦN NGƯỜI DUYỆT - from a Steam forum thread, not documentation.
- ⚠️ The framing "AoE is macro-first, StarCraft is micro-first" comes from the same forum summary.
  It is community opinion, NOT a sourced fact, and it slides easily into implying one game is
  shallower. If used at all, attribute it as how players describe the feel.

## Esports

- StarCraft II "was widely considered the largest esport in the world during its early years" and
  "has been credited as bringing esports to the rest of the world."
  - source: https://en.wikipedia.org/wiki/StarCraft_II
- Named tournaments: the **Global StarCraft II League (GSL)** and the **StarCraft II World
  Championship Series (WCS)**, the latter established in 2012.
  - source: https://en.wikipedia.org/wiki/StarCraft_II
### Circuit history

- **GSL** started in late August 2010 and runs multiple events a year on location in South Korea.
  Its first tournament, the GOMTV StarCraft II Open 1, ran 28 August to 2 October 2010. It was the
  first step toward a professional StarCraft II league in Korea.
  - source: https://liquipedia.net/starcraft2/Global_StarCraft_II_League
- **ESL Pro Tour (EPT)** was announced by ESL in January 2020, replacing Blizzard's WCS system. It
  combined ESL, DreamHack and WCS legacies in a three-year partnership, offered "more than $4
  million USD in prize money across the tours", and crowned the official StarCraft II World
  Champions, building toward the Masters Championship at IEM Katowice each year.
  - source: https://liquipedia.net/starcraft2/ESL_Pro_Tour

### 2026: the funding fell away, the scene did not

Two facts here are primary and safe to state plainly.

- **StarCraft II is NOT in the 2026 Esports World Cup.** The 2026 EWC runs 25 events across 24
  titles for a $75 million total purse, up from $71.5 million in 2025, and StarCraft II was one of
  two titles dropped from the 2025 lineup. Wikipedia states the consequence directly: "The
  exclusion of StarCraft II from the lineup meant that the 2026 EWC will not feature any real-time
  strategy games." - source: https://en.wikipedia.org/wiki/2026_Esports_World_Cup
- **GSL 2026 Season 1 ran 29 April to 17 May 2026, organised by SOOP, with a $15,000 prize pool**,
  1v1 group stages plus playoffs, sponsors Intel and ONSYDE. Liquipedia still rates it **Tier 1**.
  - source: https://liquipedia.net/starcraft2/Global_StarCraft_II_League/2026/Season_1 (infobox)

**The honest comparison to draw is between those two sourced numbers**: the EPT offered more than
$4 million across its tours in 2020; a Tier 1 GSL season in 2026 carries $15,000. That contrast is
fully sourced on both ends and needs no editorialising.

⚠️ CẦN NGƯỜI DUYỆT - everything below is search-summary grade and must NOT be stated as fact:
that the ESL Pro Tour ended in April 2025; that total 2026 SC2 prize money is around $120,000
against $2.3 million in 2024; that GSL 2026 was revived by crowdfunding; that GSL evolved into a
"GSL CK" team format with captains drafting rosters. The GSL 2026 infobox lists corporate sponsors
rather than crowdfunding, which does not disprove the crowdfunding claim but does mean it is not
confirmed. Liquipedia's `Winnings/2026` page cannot verify the aggregates either - it is pure
template transclusion, so the numbers exist only in the rendered page, not the wikitext.

**WRITING RULE for this section.** The sourced facts describe money leaving the game, not the game
dying, and the difference is not a nicety - it is accuracy. A Tier 1 league still ran in 2026, with
sponsors, on schedule. Framing this as "SC2 esports đã tàn" or "hết thời" is both unsupported and a
`disparagement[]` violation against the exact readers the article is written for. State the
numbers, note that the scene now runs on a much smaller budget, and stop there. If a comparison
with AoE4 esports is drawn, the AoE4 half needs its own sourcing, which does not exist yet in
`aoe4-facts.md`.

## Access

- Since **2017**, StarCraft II's multiplayer, co-op mode and the first single-player campaign are
  **free-to-play**. This matters for any "dân StarCraft thử AoE4" article: the barrier is
  asymmetric, since SC2 is free to try and AoE4 is not.
  - source: https://en.wikipedia.org/wiki/StarCraft_II

---

## Open questions for the human reviewer

1. Mineral and gas gathering numbers - patch amounts, worker saturation per base. Both `Minerals`
   and `Vespene Gas` redirect to `liquipedia.net/starcraft2/Resources`, which was identified but
   not fetched. One request closes it. (The per-race supply buildings question that used to sit
   here is now answered and sourced above.)
2. The 2026 prize-money aggregates and whether GSL 2026 was crowdfunded. Liquipedia's
   `Winnings/2026` is template-only so wikitext cannot confirm it; the rendered page or
   esportsearnings.com would. Only matters if an article wants to quantify the drop beyond the
   two sourced figures already in the esports section.
3. **Does the Vietnamese RTS audience overlap with StarCraft at all?** Four of thirteen queued
   comparison items assume it does. If the overlap is thin, that is four articles chasing traffic
   that will not convert, and the queue wants reprioritising more than this file wants filling.
   This is a strategy question for the owner, and it outranks every other item on this list.
4. Brood War vs StarCraft II - the VN scene, if any, may sit on one and not the other. Nothing
   here distinguishes them.
5. AoE4 ranked structure, for the ladder comparison. Belongs in `aoe4-facts.md`, not here.
