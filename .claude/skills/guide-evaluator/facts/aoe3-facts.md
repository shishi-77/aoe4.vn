# AoE3 Facts Reference (ground truth for fact-checking comparison guides)

**Scope**: Age of Empires III, original (2005) plus the Definitive Edition (2020), which is the
version played today.

**Reviewed by**: NOBODY YET. Gathered 2026-08-08 with sources attached. Lower standing than
`aoe1-facts.md` / `aoe4-facts.md`, which had a domain-expert pass.

**How this was fetched**: `ageofempires.fandom.com` returns HTTP 402 to WebFetch but answers
plain `curl` with a descriptive User-Agent on `?action=raw`. Script: `scripts/fetch-wiki-facts.sh`.

---

## Ages - and a naming conflict to be careful with

- AoE3 has **five Ages**, one more than AoE1/AoE2/AoE4.
- **The two sources disagree on what the first two are called.** English Wikipedia calls them
  **Discovery** and **Colonial**; the Fandom wiki calls them **Exploration** and **Commerce**.
  Both agree on **Fortress → Industrial → Imperial** for ages three to five.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_III ,
    https://ageofempires.fandom.com/wiki/Age_of_Empires_III
  ⚠️ CẦN NGƯỜI DUYỆT - do not print either pair as the name until someone with the game open
  says which is current. Most likely one set is the Definitive Edition's renaming and the other
  the 2005 original, but neither source says so, and guessing which is which is exactly how an
  article ends up confidently wrong. Safe phrasing: "năm đời" without naming the first two.
- What each age does: age one is exploration and economy; age two unlocks early military; the
  Fortress Age unlocks forts and a complete military; the Industrial Age brings a strong economy
  via factories - buildings that produce resources or artillery - and unlocks all units and
  cards; the Imperial Age unlocks all buildings and upgrades.
  - source: https://ageofempires.fandom.com/wiki/Age_of_Empires_III
- "All Ages cost food and coin to advance to, except the Colonial Age, which only costs food
  (800)." - source: https://en.wikipedia.org/wiki/Age_of_Empires_III
- **Politician system**: before advancing, the player picks from two or more politicians, each
  granting a bonus alongside the age-up - free units or crates of resources. The example given is
  "The Naturalist", which rewards four cows. More politicians unlock as the Home City levels, at
  a rate of one every ten levels. Nothing in AoE1/AoE2/AoE4 works like this.
  - source: https://ageofempires.fandom.com/wiki/Age_of_Empires_III

## Resources - three, not four

- AoE3 gathers **food, coin and wood**. There is no stone, and the gold-equivalent is called
  **coin**. AoE2 has four resources including stone; AoE4 has four. This is a clean, checkable
  difference. - source: https://ageofempires.fandom.com/wiki/Age_of_Empires_III

## Home City and shipment cards - the signature mechanic

- The **Home City** is "a second city, a powerhouse that is separated from the active game. It
  cannot be attacked or destroyed." It delivers economic and military shipments to the player's
  colony. - source: https://en.wikipedia.org/wiki/Age_of_Empires_III ,
  https://ageofempires.fandom.com/wiki/Home_City
- **Experience points** are earned by constructing buildings, training units, killing enemy units
  and collecting treasures. Crossing an XP threshold earns a **card** that can be shipped from
  the Home City. - source: https://ageofempires.fandom.com/wiki/Age_of_Empires_III
- Each civilization has its own Home City with **five interactable buildings** supplying cards:
  for Europeans, the New World Trading Company, the Military Academy (or a Fort), the Cathedral,
  the Manufacturing Plant and the Harbor. Home Cities are named and customisable.
  - source: https://ageofempires.fandom.com/wiki/Home_City
- A deck holds **twenty cards**, with extra slots every 10 Home City levels.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_III
- Not every civilization has a literal city: in The WarChiefs only the Aztecs do, the others use
  **Tribal Councils**. - source: https://ageofempires.fandom.com/wiki/Home_City
- Wikipedia describes the design as combining "real-time strategy and role-playing features" -
  meta-progression persisting between matches, which no other Age title has.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_III

## Setting and military

- The game picks up where AoE2 left off: the discovery of the New World, **roughly 1500 to 1900**.
  The player takes a European colony from settlement to empire.
  - source: https://ageofempires.fandom.com/wiki/Age_of_Empires_III
- Play starts with a Town Center, an **Explorer**, and several Settlers - or with only a Covered
  Wagon and an Explorer depending on game type.
  - source: https://ageofempires.fandom.com/wiki/Age_of_Empires_III
- "Unlike the other Age of Empires games, this game includes much prominent gunpowder warfare,
  including artillery and rifle companies." Artillery uses cannon and mortars, and some artillery
  is grenade-armed. - source: https://ageofempires.fandom.com/wiki/Age_of_Empires_III ,
  https://en.wikipedia.org/wiki/Age_of_Empires_III
- ⚠️ CẦN NGƯỜI DUYỆT - AoE3's counter system (the musketeer / cavalry / skirmisher relationships
  the community discusses) was NOT sourced. The Fandom `Counter` page covers AoE1, AoE2, AoM,
  AoE3 and AoE4, but the AoE3 section was not extracted this pass. **Do not write an AoE3
  counters paragraph yet** - it is one more fetch away, not a guess away.

## Natives, mercenaries, trade

- **Twelve Native American tribes** are available as allies, not playable factions; a player
  allies by building a trading post at their camp, unlocking unique units and improvements.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_III
- **Mercenaries** are shipped from the Home City or hired from saloons "for a lot of gold".
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_III

## Releases and support

- Original PC release **18 October 2005**. Expansions: **The WarChiefs** (17 Oct 2006, three
  Native American civilizations) and **The Asian Dynasties** (23 Oct 2007, three Asian
  civilizations). - source: https://ageofempires.fandom.com/wiki/Age_of_Empires_III
- **Definitive Edition released 15 October 2020**, bundling both expansions plus two new
  civilizations (Incas, Swedes), with 4K graphics, rebuilt assets, new modes (Art of War,
  Historical Battles, Diplomacy, Tycoon), an "extreme" AI, spectator mode and mod support.
  - source: https://ageofempires.fandom.com/wiki/Age_of_Empires_III ,
    https://en.wikipedia.org/wiki/Age_of_Empires_III:_Definitive_Edition
- Post-launch civilizations: United States (13 Apr 2021), Ethiopians and Hausa (2 Aug 2021),
  Mexico (1 Dec 2021), Italians and Maltese (26 May 2022).
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_III:_Definitive_Edition
- **The Baltic Powers (Danes, Poles) is dated 10 September 2026 - in the FUTURE as of
  2026-08-08.** Announced, not shipped. Never write it in the past tense.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_III:_Definitive_Edition
- **The old non-Definitive version is gone**: the Complete Collection was delisted from Steam on
  8 October 2024 and its multiplayer services ceased on 30 October 2024. So "play AoE3" today
  means the Definitive Edition, full stop - a useful, checkable fact for any "should I try it"
  article. - source: https://ageofempires.fandom.com/wiki/Age_of_Empires_III
- **Do not print a total civilization count**, for the same reason as AoE2: base roster plus six
  years of expansions. Describe the shape.

## Series pacing

- The AoE4 store records the community-accepted ranking, owner-confirmed 2026-07-06:
  **AoE3 > AoE1 > AoE4 > AoE2**, fastest to slowest. AoE3 is the fastest game in the series by
  that ranking. Not an official benchmark, but treated as true for this audience and must not be
  flagged as an error. - source: `.claude/skills/guide-evaluator/facts/aoe4-facts.md`

---

## Open questions for the human reviewer

1. **Age naming.** Discovery/Colonial or Exploration/Commerce? Highest-value question in this
   file - it appears in the first paragraph of any AoE3 article.
2. AoE3 counter system. One targeted fetch of the Fandom `Counter` page's AoE3 section fixes it.
3. Vietnamese vocabulary for AoE3, if the VN scene has any. Not invented here on purpose.
4. **Does "Đế chế 3" collide with "đời 3"?** The VN AoE1 meta is played in đời 3 (Bronze Age), so
   "Đế chế 3" in a headline may read as the age, not the game. Owner should rule on this before
   `aoe3-co-gi-hay` is written - it is a naming problem, not a facts problem, and CLAUDE.md's
   naming convention does not currently address it.
5. Is AoE3 actually played in Vietnam in any numbers, or is this purely a search-traffic play?
   Changes the framing of `aoe3-co-gi-hay` substantially.
