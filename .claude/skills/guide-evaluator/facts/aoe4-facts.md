# AoE4 Facts Reference (Ground Truth)

Scope: Age of Empires IV (base game + DLC through "The Sultans Ascend"), patch era ~2026.
Reviewed by: user, 2026-07-06 - cross-title speed ranking confirmed accurate; unit-type/age/aura facts largely web-confirmed. Specific costs + DLC boundary still ⚠️ patch-sensitive below.
Purpose: fact-check Vietnamese guide articles in `src/data/guides/`. Do not invent doubts beyond what is listed here; do not assume a claim is wrong just because it sounds unusual for AoE2/AoE1 veterans.

Note on patch-sensitivity: unit costs, ages, and aura values in AoE4 have been rebalanced multiple times since 2021 launch. Where a fact is a specific number (cost, %, seconds) it is more likely to drift patch-to-patch than a unit's basic age-unlock or unit-type classification. Flagged accordingly below.

---

## Units by civ

### Mongols
- Mangudai: light ranged cavalry (horse archer), unique to Mongols. Trained at the Archery Range starting in **Feudal Age (Age II)**. Same age as regular Archer.
  source: https://aoe4world.com/explorer/civs/mongols/units/mangudai , https://ageofempires.fandom.com/wiki/Mangudai_(Age_of_Empires_IV)
- Mangudai can shoot while moving (unique trait among ranged units); cited as "nearly twice the cost of a regular Archer." Example cited cost: 90 food / 60 gold, ~28s train time. ⚠️ CẦN NGƯỜI DUYỆT (exact cost numbers are patch-sensitive; "roughly 2x an Archer" is the durable claim, don't cite the raw numbers as fixed).
  source: https://forums.ageofempires.com/t/mongols-need-mangudai-cost-reduction-to-match-is-worth/230199
- Mongols are the nomadic/"du mục" civ: can pack up buildings and relocate (Ger/mobile base mechanic). They CANNOT build ANY walls - neither wood/palisade nor stone (not just stone walls). Confirmed by the site owner (AoE1/AoE4 insider), 2026-07-07. So "Mông Cổ không xây được tường luôn, cả game không một viên đá bo nhà" is CORRECT.
  source: general AoE4 civ knowledge + site owner confirmation 2026-07-07.

### Rus
- Horse Archer: light ranged cavalry, unique to Rus. Trained at the Archery Range starting in **Castle Age (Age III)** (search results describe it as "Castle Age onwards").
  source: https://aoe4world.com/explorer/civs/rus/units/horse-archer , https://ageofempires.fandom.com/wiki/Horse_Archer_(Age_of_Empires_IV)

### Japanese
- Onna-Musha: **light ranged cavalry** (mounted horse-archer-type unit), NOT infantry. Unique to Japanese, added in "The Sultans Ascend" expansion.
  - CONFIRMED via multiple independent sources (aoe4world explorer, fandom wiki summary, AoE forum discussion) all describing it consistently as "light ranged cavalry."
  - Trained at the Archery Range starting in **Castle Age (Age III)**, effectively replacing/supplementing the Crossbowman slot for Japanese.
  - Role: mounted anti-heavy unit, counters Knights, Men-at-Arms, War Elephants (not Tower Elephants). ~5.5 range.
  source: https://aoe4world.com/explorer/civs/japanese/units/onna-musha , https://ageofempires.fandom.com/wiki/Onna-Musha_(Age_of_Empires_IV) , https://forums.ageofempires.com/t/onna-musha-horse-archer/260959
  - VERDICT on calibration doubt: the judge's suspicion that Onna-Musha is infantry is **FALSE**. It is a ranged cavalry / horse-archer type unit, consistent with the guide's grouping of it alongside Mangudai and Horse Archer.

### French
- Royal Knight: **Heavy Cavalry**, unique to French. Available at the Stable starting in **Feudal Age (Age II)**, unlocked via the "Royal Stallions" landmark.
  - Gains +3 bonus damage for 5 seconds after completing a charge.
  source: https://aoe4world.com/explorer/civs/french/units/royal-knight , https://ageofempires.fandom.com/wiki/Royal_Knight

### Abbasid Dynasty
- Camel Archer: **light ranged cavalry**, unique to Abbasid. Trained at the Archery Range starting in **Feudal Age (Age II)**.
  source: https://aoe4world.com/explorer/units/camel-archer , https://ageofempires.fandom.com/wiki/Camel_Archer_(Age_of_Empires_IV)
- Camel Rider: **light melee cavalry**, unique to Abbasid. Trained at the Stable starting in **Castle Age (Age III)**.
  source: https://aoe4world.com/explorer/civs/abbasid/units/camel-rider , https://ageofempires.fandom.com/wiki/Camel_Rider_(Age_of_Empires_IV)
  - VERDICT: **BOTH units exist** and are distinct (ranged vs melee, Feudal vs Castle). The guide's claim that Camel Archer unlocks in Age II and Camel Rider in Age III is CONFIRMED true.
- Abbasid Dynasty ages up via researching technologies rather than building a landmark structure (differs from most civs) - noted as an exception alongside Ayyubids, Knights Templar, Golden Horde.
  source: search synthesis from Age of Empires Fandom "Early Economy"/"Feudal Age" pages.

---

## Camel anti-cavalry aura ("Camel Unease")

- Both Camel Archer and Camel Rider carry an aura/ability called **"Camel Unease"**: reduces the **base attack** (not bonus attack) of enemy horse-based Cavalry units within ~5 tiles by **20%**, applied before flat armor reduction.
  - VERDICT: guide's claim "ngựa đối thủ đứng gần lạc đà bị trừ 20% sát thương" is **CONFIRMED** (20% figure is correct, though technically it's a base-attack reduction, not a flat total-damage reduction - the effective in-practice impact can vary above/below 20% depending on matchup, per the debuff math).
  source: https://ageofempires.fandom.com/wiki/Camel_unit , https://ageofempires.fandom.com/wiki/Ability_(Age_of_Empires_IV)
  ⚠️ CẦN NGƯỜI DUYỆT: exact aura radius/value can be patch-adjusted; 20% is the widely-cited current figure but verify against current patch notes if precision matters.

---

## Ages & unlocks (general)

- AoE4 has 4 Ages total: Dark Age (I) → Feudal Age (II) → Castle Age (III) → Imperial Age (IV).
- Advancing ages is done by constructing one of two choosable **Landmark** buildings (not a simple button/tech at the Town Center as in AoE2), each granting a different bonus/unlock path. This matches the guide's claim.
  source: https://ageofempires.fandom.com/wiki/Advancement , https://ageofempires.fandom.com/wiki/Age
- Exceptions: Abbasid Dynasty, Ayyubids, Knights Templar, and Golden Horde age up via unique tech-research mechanics rather than picking landmarks in the standard way.

---

## Economy / Age-up costs

- Advancing Dark Age → Feudal Age costs **400 Food + 200 Gold** for most civilizations, build time cited around 3:10.
  - VERDICT: guide's "đủ 400 thực và 200 vàng thì lên Đời II" is **CONFIRMED as the standard, near-universal cost** for most civs.
  - ⚠️ CẦN NGƯỜI DUYỆT: while the Feudal-age resource cost is described as "standard across civilizations" by multiple sources, the civs with alternate age-up mechanics (Abbasid, Ayyubids, Knights Templar, Golden Horde) do NOT necessarily follow this exact cost/mechanic - the guide's "nền văn minh nào cũng áp dụng được" framing should be understood as "the default/most-civs case," not universally exception-free. Worth a caveat sentence in the guide, but not a factual error given it's presented as a beginner-default build.
  source: search synthesis (GamesRadar, Fandom Feudal Age page, GameNGuide).

---

## Counters / counter triangle

- Primary AoE4 counter triangle: **Spearman (giáo) counters Horseman/Cavalry (kỵ)** → **Cavalry counters Archer (cung)** → **Archer counters Spearman**.
  - VERDICT: guide's stated loop "giáo khắc kỵ, kỵ khắc cung, cung khắc giáo" is **CONFIRMED**, matches the standard rock-paper-scissors design of AoE4.
  source: https://aoedb.net/aoe4/counters/ , https://ageofempires.fandom.com/wiki/Spearman_(Age_of_Empires_IV) , https://ageofempires.fandom.com/wiki/Counter
- Additional/secondary counters mentioned in sources (not asserted by the guides, included for context only): Men-at-Arms counter both Spearmen and Archers; Mangonels/siege counter all three infantry-tier unit types.

---

## Cross-title speed ranking (AoE1/2/3/4)

- The guide's claim "AoE3 > AoE1 > AoE4 > AoE2" (relative pacing/speed ranking across the series) is CONFIRMED accurate by the domain expert (user, 2026-07-06) as the accepted community ranking. It is not an official benchmarked metric, but it is treated as true for this audience and must NOT be flagged as a factual error.

---

## Fortifications (context for "tuong-thanh-phong-thu-aoe4" guide, spot-checked, not deeply researched this pass)

- Stone Walls in AoE4 cannot be destroyed by melee units' torches - they can only be damaged by dedicated siege weapons. This is a well-documented AoE4 mechanic (distinct from AoE2 where towers/walls have HP damageable by most unit types with reduced effectiveness).
- Outpost (chòi canh) in AoE4 does NOT shoot arrows by default - it must be upgraded (Arrow Slits) before it can fire. Confirmed by the site owner (insider), 2026-07-07. So the guide claim "muốn nó bắn tên phải nâng cấp thêm" is CORRECT. (Town Center, by contrast, fires arrows by default and fires more when garrisoned.)
  source: site owner confirmation 2026-07-07.
  ⚠️ CẦN NGƯỜI DUYỆT: age tiers of walls/Keep/ram/Mangonel/Trebuchet/bombard and "torch damage strongest on cavalry" are still not independently verified this pass.

---

## Open questions for the human reviewer

1. Confirm current-patch (mid-2026) exact costs for Mangudai/Camel Archer/Camel Rider/Horse Archer/Onna-Musha/Royal Knight - this file cites figures gathered from web sources of varying vintage and AoE4 has had multiple balance patches since 2021 launch.
2. Confirm whether "The Sultans Ascend" (which added Japanese/Onna-Musha, Ayyubids, House of Lancaster, Knights Templar) is the correct/current DLC boundary as of July 2026, or whether a newer DLC has shipped that could add/change civs referenced in `cac-nen-van-minh-aoe4.ts`.
3. RESOLVED (user, 2026-07-06): the AoE3 > AoE1 > AoE4 > AoE2 speed ranking is confirmed accepted/accurate - no caveat needed.
4. Double check whether ALL civs truly use the 400 Food/200 Gold Feudal age-up cost, or whether any of the newer DLC civs (beyond the four tech-research exceptions already noted) deviate.
5. Verify Onna-Musha's availability is Japanese-only in the standard game (a search result surfaced an "Onna-Musha - Holy Roman Empire" aoe4world page, possibly reflecting an event/mercenary/shared-tech mechanic) - was not investigated further and could be worth a sanity check if the guide ever claims Onna-Musha is Japanese-exclusive.
