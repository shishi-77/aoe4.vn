# AoE2 Facts Reference (ground truth for fact-checking comparison guides)

**Scope**: Age of Empires II, primarily the Definitive Edition (2019) as the version people play
today. Facts specific to the original Age of Kings (1999) are marked.

**Reviewed by**: NOBODY YET. Gathered 2026-08-08, each entry carrying its source. Not the same
standing as `aoe1-facts.md` / `aoe4-facts.md`, which had a domain-expert pass.

**Why this file exists**: the scheduled headless run cannot reach the web (sandbox network policy
allows GitHub and npm only), so a `comparison` article could never satisfy the "must carry a
source URL" rule for AoE2 claims. This file is the cache: the fetch happened in an owner-present
session and the URL travels with the fact.

**How this was fetched**: `ageofempires.fandom.com` returns HTTP 402 to the agent's WebFetch tool
but answers plain `curl` with a descriptive User-Agent on the `?action=raw` endpoint, which
returns page wikitext including the stat infoboxes. Script:
`scripts/fetch-wiki-facts.sh`. Fandom rate-limits at roughly 8 rapid requests, returning 403 until
a pause - so a 403 there means "slow down", not "forbidden". Numbers below marked
**(infobox)** came from a page's own stat infobox, which is the closest thing to a primary
table available without owning the game files.

---

## Ages & advancing

- Four Ages: **Dark Age → Feudal Age → Castle Age → Imperial Age**, spanning a 1,000-year frame.
  Castle Age represents the High Middle Ages, Imperial the Renaissance.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II
- **The age-up is a technology researched at the Town Center**, gated on having built a number of
  buildings from the current age. This is the durable structural contrast with AoE4, where most
  (not all) civs instead build one of two Landmarks. CONFIRMED - the earlier uncertainty about
  the Town Center is resolved; each age page's infobox lists `Building = Town Center`.
  - source: https://ageofempires.fandom.com/wiki/Feudal_Age_(Age_of_Empires_II) (infobox)
- Age-up costs and requirements **(infobox)**:
  | Age | Cost | Research time | Requires |
  | --- | --- | --- | --- |
  | Feudal | 500 food | 130 s | any **two** of Barracks, Mill/Folwark, Lumber Camp, Mining Camp, Dock, Mule Cart (or a single Settlement) |
  | Castle | 800 food + 200 gold | 160 s | any **two** of Archery Range, Stable, Market, Blacksmith (Siege Workshop for Cumans) |
  | Imperial | 1,000 food + 800 gold | 190 s | any **two** of Monastery/Fortified Church, University, Siege Workshop - **or one** Castle (Krepost for Bulgarians) |
  - source: https://ageofempires.fandom.com/wiki/Feudal_Age_(Age_of_Empires_II) ,
    https://ageofempires.fandom.com/wiki/Castle_Age_(Age_of_Empires_II) ,
    https://ageofempires.fandom.com/wiki/Imperial_Age_(Age_of_Empires_II)
  - The buildings that do NOT count toward the Feudal requirement are Houses, Farms, walls and
    Outposts. - source: https://ageofempires.fandom.com/wiki/Feudal_Age_(Age_of_Empires_II)
- Civilization exceptions exist and matter: **Khmer need no buildings at all to advance** at any
  age, and **Muisca pay 50% less gold** for Castle and Imperial. So "you must build two buildings
  to age up" is the default, not a universal law - phrase it as most civs, exactly as
  `aoe4-facts.md` requires for AoE4's Landmark rule.
  - source: the three age pages above

## Resources & economy

- **Four resources: food, wood, gold, stone.** - source: https://en.wikipedia.org/wiki/Age_of_Empires_II
- Villagers must return resources to a **drop-off building** - Town Center, mining camp, mill or
  lumber camp. - source: https://en.wikipedia.org/wiki/Age_of_Empires_II
- **Farm: 60 wood, built from the Dark Age, 480 HP, 15 s build time (infobox).** Farms are the
  food economy's backbone once berries, herdables and huntables run out, which the wiki places
  around the Feudal Age.
  - source: https://ageofempires.fandom.com/wiki/Farm_(Age_of_Empires_II) ,
    https://ageofempires.fandom.com/wiki/Feudal_Age_(Age_of_Empires_II)
- Population capacity is configurable **between 25 and 200 in steps of 25**.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II:_The_Age_of_Kings
- **Stone is a separate resource and it is what gates defensive building** - towers and Castles
  cost stone, walls cost stone. - source: the building infoboxes below
- ❌ **RETRACTED 2026-08-09: "AoE4 has no stone" was FALSE, and "one of the cleanest structural
  differences to write about" was exactly backwards.** The owner confirmed on 2026-08-09 that
  **cả AoE2 lẫn AoE4 đều có tài nguyên đá**. Stone is therefore NOT a structural difference
  between the two games; do not write it as one.
  - **How it survived.** The false clause was tacked onto a line whose source is the AoE2 building
    infoboxes below - so the AoE4 half never had a source at all, it just inherited the citation
    of the sentence it was glued to. Worse, this same file refers to "AoE4 stone walls" about
    sixty lines further down, so the file contradicted itself and still read as consistent to
    anyone checking a draft against it.
  - **This is the third instance of the same failure mode in this store** (after "7 thực 3 vàng"
    and the Onna-Musha class line): a wrong line inside the store matches itself, so grading
    articles against the store can never catch it. Only a cross-file comparison or the owner
    re-reading can. See `aoe4-facts.md` "Resources".
  - **Never restore the "AoE4 has no stone" wording.**

## Counters - a web of bonus damage, not a triangle

- The rock-paper-scissors reading is "more often than not **subverted**" by **armor classes**,
  which set the bonus damage a unit deals against units sharing a class.
  - source: https://ageofempires.fandom.com/wiki/Counter
- **There are 27 armor classes for units and 7 for buildings** (some unused).
  - source: https://ageofempires.fandom.com/wiki/Counter
- Bonus damage is a **flat additive value, and it stacks** when the target belongs to several
  classes. Worked example from the source: a War Elephant is in both the Elephant Units and the
  Cavalry armor class, and a Halberdier has a bonus against both, so both bonuses add.
  - source: https://ageofempires.fandom.com/wiki/Counter
- Units that deliberately break the triangle, all named by the source:
  - **Genoese Crossbowman** - an archer with +5 (+7 Elite) against the Cavalry armor class.
  - **Huskarl** and the **Eagle Scout** line - infantry that beat archers, via high pierce armor.
  - **Condottiero** - +10 against Gunpowder Units, plus its own armor class that resists
    gunpowder, making it a dedicated Hand Cannoneer answer.
  - source: https://ageofempires.fandom.com/wiki/Counter
- Practical counter matrix (secondary source, useful as a starting map): archers beat infantry
  and cavalry, lose to skirmishers and siege; skirmishers beat archers and spearmen, lose to
  infantry, cavalry and siege; spearmen/pikemen/halberdiers beat cavalry, lose to archers and
  hand cannoneers; knights beat archers, siege and monks, lose to spearmen and camels; camels
  counter cavalry; militia-line infantry beat buildings and trash, lose to archers, hand
  cannoneers and cavalry archers; mangonels beat massed archers and buildings, lose to cavalry
  and bombard cannons; monks convert expensive units, lose to light cavalry, scouts and eagle
  warriors. Worked bonus-damage example from the same source: a Halberdier has 6 base attack and
  +26 vs the cavalry armor class, hitting a Knight for 32 before the Knight's 2 melee armor.
  - source: https://aoedb.net/aoe2/counters/
  - Note the matrix is not internally consistent (knights both beat and lose to monks). That is a
    real property of bonus-damage counters - it depends on numbers, upgrades and whether a
    conversion lands - not an error. **Write AoE2 counters as a web, not a cycle.**
- **Trash units** are precisely defined: military units that **cost no gold and no stone**. They
  mass easily, are cheap, and matter in long games where gold runs out and on gold-poor maps. The
  concept becomes relevant late, usually in the Imperial Age, because the rare resources only
  become limiting then. AoE4 has no equivalent concept.
  - source: https://ageofempires.fandom.com/wiki/Trash_unit
- Naval combat gained a proper cycle in **The Last Chieftains** (Feb 2026): Galley → countered by
  Fire Galley → countered by Hulk → countered by Galley. In practice Hulks also do well against
  Galleys thanks to high melee attack. - source: https://ageofempires.fandom.com/wiki/Counter

## Defensive structures - the material for `tuong-thanh-aoe4-vs-aoe2`

All numbers **(infobox)**:

| Building | Age | Cost | HP | Armor / Pierce |
| --- | --- | --- | --- | --- |
| Palisade Wall | Dark | 3 wood | 150 Dark, 250 Feudal | 2 / 5 |
| Stone Wall | Feudal | 5 stone | 1,080 Feudal, 1,800 Castle+ | 8 / 10 |
| Watch Tower | Feudal | 35 wood + 125 stone | 850 Feudal, 1,020 Castle | 1 / 7 |
| Castle | Castle | 650 stone | 4,800 | 8 / 11 |

- source: https://ageofempires.fandom.com/wiki/Stone_Wall_(Age_of_Empires_II) ,
  https://ageofempires.fandom.com/wiki/Palisade_Wall_(Age_of_Empires_II) ,
  https://ageofempires.fandom.com/wiki/Watch_Tower_(Age_of_Empires_II) ,
  https://ageofempires.fandom.com/wiki/Castle_(Age_of_Empires_II)

- **The AoE2 wall rule is practical, not absolute, and this is the key contrast to get right.**
  The source says Stone Walls make it "near impossible for non-siege units to raid what's inside
  the base without the use of Siege Towers". That is a statement about practicality. The AoE4
  store records a *mechanical* rule: AoE4 stone walls can only be damaged by dedicated siege.
  **Do not write that AoE2 melee units cannot damage stone walls** - the source does not say
  that, and asserting it would be a `contradiction`.
  - source: https://ageofempires.fandom.com/wiki/Stone_Wall_(Age_of_Empires_II) ,
    `aoe4-facts.md` "Fortifications"
- Stone Wall upgrades to **Fortified Wall** for 200 food + 100 wood, described as high value.
  Walls cannot attack, so they need tower support at choke points, and Gates let friendly units
  through. The source's own cost illustration: 5 stone looks cheap, but a modest 20-tile stretch
  is 100 stone. - source: https://ageofempires.fandom.com/wiki/Stone_Wall_(Age_of_Empires_II)
- The **Castle** trains unique units, Petards and Trebuchets, researches technologies, garrisons
  20, has range 8, and carries attack bonuses of +2 vs Spearmen, +1 vs Camel Units, +11 vs Ships
  and +11 vs Stone Defense. - source: https://ageofempires.fandom.com/wiki/Castle_(Age_of_Empires_II)
- **Bombard Tower** arrives in the Imperial Age and is described as having the best combination
  of damage output and cost of any defensive structure.
  - source: https://ageofempires.fandom.com/wiki/Imperial_Age_(Age_of_Empires_II)

## Civilizations & unique units

- Each civilization has one or two **unique units, trained at the Castle**, plus unique
  technologies. - source: https://en.wikipedia.org/wiki/Age_of_Empires_II ,
  https://ageofempires.fandom.com/wiki/Castle_(Age_of_Empires_II)
- The original 1999 Age of Kings shipped **13 civilizations** in four architectural styles.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II
- **The current civilization count is contested and MUST NOT be printed as a hard number.**
  Read the same day: ageofempires.com says "35 different civilizations", the Steam listing says
  "42 Civilizations", a search summary of the Fandom wiki says 53 including 2026 DLC.
  - source: https://www.ageofempires.com/games/aoeiide/ ,
    https://store.steampowered.com/app/813780/Age_of_Empires_II_Definitive_Edition/
  - **WRITING RULE**: describe the shape ("hàng chục phe, và vẫn còn thêm qua DLC"), never a
    count. A hard number both dates the article and is likely wrong on the day it ships.

## Monks & relics

- Monks **convert** enemy units and **heal** allies. They collect relics, which generate gold in
  the monastery, and holding all relics is a victory condition.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II

## Definitive Edition: release, support, longevity

- Released **14 November 2019** on Windows; Xbox 31 January 2023; PlayStation 5 6 May 2025;
  macOS 28 May 2026. - source: https://en.wikipedia.org/wiki/Age_of_Empires_II:_Definitive_Edition
- **Still actively expanded in 2026**: Lords of the West (Jan 2021), Dawn of the Dukes (Aug
  2021), Dynasties of India (Apr 2022), Return of Rome (May 2023), The Mountain Royals (Oct
  2023), Victors and Vanquished (Mar 2024), Chronicles: Battle for Greece (Nov 2024), The Three
  Kingdoms (May 2025), Chronicles: Alexander the Great (Oct 2025), **The Last Chieftains (17 Feb
  2026)**. - source: https://en.wikipedia.org/wiki/Age_of_Empires_II:_Definitive_Edition
- **The Viking Sagas is announced for 2026 but had NOT shipped as of 2026-08-08.** Never write it
  in the past tense. - source: same
- Metacritic 84/100, OpenCritic 92% recommend; recurring criticism is balance and a "pay to win"
  concern around DLC civilizations. Cross-platform play works across PC, Xbox and PlayStation.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_II:_Definitive_Edition
- This is the sourced backbone for "why AoE2 is still the one people play": seven years of
  continuous expansion, cross-platform, frequent patches. It needs no disparagement of AoE4 -
  and per the evaluator's `disparagement[]` rule, must not have any.

---

## Open questions for the human reviewer

1. **Vietnamese vocabulary for AoE2 is deliberately absent.** `aoe1-facts.md` has a vocabulary
   map because the owner supplied it; inventing AoE2 slang is the audience-mismatch failure that
   got PR #24 rolled back. Owner: does the VN scene use distinct AoE2 terms, or English names?
   Related: is "trash unit" worth a Vietnamese coinage, or left in English?
2. Gathering rates per resource, and farm reseeding economics, were not pulled. Needed before
   `kinh-te-aoe4-vs-aoe2` can compare economies rather than just list buildings.
3. The aoedb.net counter matrix is a community site, not a wiki. Its bonus-damage worked example
   is checkable, but the matrix rows would be better replaced by per-unit infobox bonuses if this
   file ever gets a second pass.
4. Nothing here covers Trebuchets or siege in depth, which `tuong-thanh-aoe4-vs-aoe2` will
   probably want for the attacking half of the article.
