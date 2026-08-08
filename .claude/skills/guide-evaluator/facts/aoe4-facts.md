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
- Mangudai can shoot while moving (a signature Mongol trait, but NOT unique to it - other mounted archers like the Abbasid Camel Archer also fire on the move; corrected 2026-07-07, earlier "unique among ranged units" wording was an overclaim); cited as "nearly twice the cost of a regular Archer." Example cited cost: 90 food / 60 gold, ~28s train time. ⚠️ CẦN NGƯỜI DUYỆT (exact cost numbers are patch-sensitive; "roughly 2x an Archer" is the durable claim, don't cite the raw numbers as fixed).
  source: https://forums.ageofempires.com/t/mongols-need-mangudai-cost-reduction-to-match-is-worth/230199
- Mongols are the nomadic/"du mục" civ: can pack up buildings and relocate (Ger/mobile base mechanic). They CANNOT build ANY walls - neither wood/palisade nor stone (not just stone walls). Confirmed by the site owner (AoE1/AoE4 insider), 2026-07-07. So "Mông Cổ không xây được tường luôn, cả game không một viên đá bo nhà" is CORRECT.
  source: general AoE4 civ knowledge + site owner confirmation 2026-07-07.

### Rus
- Horse Archer: light ranged cavalry, unique to Rus. Trained at the Archery Range starting in **Castle Age (Age III)** (search results describe it as "Castle Age onwards").
  source: https://aoe4world.com/explorer/civs/rus/units/horse-archer , https://ageofempires.fandom.com/wiki/Horse_Archer_(Age_of_Empires_IV)

### Japanese
- Onna-Musha: **cavalry, NOT infantry** - "Onna-Musha là kỵ binh", CONFIRMED BY SITE OWNER
  2026-08-08. Unique to Japanese, added in "The Sultans Ascend" expansion.
  - **Why this line now carries an owner stamp.** Across two rewrites of `cung-r-ngua-chem-aoe4`
    on 2026-08-08, NINE independent judges read Onna-Musha as infantry and flagged it every
    round. An audit of this entry found the original `CONFIRMED` was weak: it entered the file
    in the first commit (2026-07-06), was never read back to the owner, cited a "fandom wiki
    *summary*" at a time when fandom returned HTTP 402 to WebFetch, and leaned on a forum thread
    whose slug already contained "horse-archer". The owner settled it directly: cavalry.
  - **Sub-classification (ranged vs melee) is still WEB-SOURCED, not owner-confirmed.** The
    owner was asked "bộ hay kỵ" and answered "kỵ binh". The sources below say specifically
    *light ranged cavalry*, trained at the Archery Range from **Castle Age (Age III)**, ~5.5
    range, filling the Crossbowman slot for Japanese, countering Knights / Men-at-Arms /
    War Elephants (not Tower Elephants). An article MAY call it "kỵ cung" on that basis, but if
    a future pass needs certainty on ranged-vs-melee, that is a separate question to the owner.
  source: https://aoe4world.com/explorer/civs/japanese/units/onna-musha , https://ageofempires.fandom.com/wiki/Onna-Musha_(Age_of_Empires_IV) , https://forums.ageofempires.com/t/onna-musha-horse-archer/260959 , site owner 2026-08-08
  - **VERDICT: the recurring judge suspicion that Onna-Musha is infantry is FALSE, on the
    owner's word.** Do not re-raise it. Grouping it alongside Mangudai and Horse Archer stands.
  - Separately CONFIRMED by owner 2026-07-07: it deals bonus damage vs heavy units, so
    "xuyên giáp nặng" / "đánh vào giáp nặng thì đau hơn" is acceptable phrasing. That half never
    depended on the class label.

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
- For **most** civs, advancing an age is done by constructing one of two choosable **Landmark** buildings (not a simple button/tech at the Town Center as in AoE2), each granting a different bonus/unlock path. This is the DEFAULT path, not a universal one.
  source: https://ageofempires.fandom.com/wiki/Advancement , https://ageofempires.fandom.com/wiki/Age
- **Not every civ ages up through a Landmark.** Some civs still age up at the **Town Center**, and some at a **secondary building** instead. - CONFIRMED by site owner (AoE4 domain expert), 2026-08-07. So "lên đời phải dựng Landmark", stated as absolute, is a factual error.
  ⚠️ CẦN NGƯỜI DUYỆT: the exact civ → mechanism mapping is NOT recorded here. Documented non-Landmark civs so far are Abbasid Dynasty, Ayyubids, Knights Templar and Golden Horde (recorded below as tech-research age-ups). Do NOT assert which specific civ uses the Town Center path or the secondary-building path without a fresh check - name the paths generically instead.
- Exceptions already documented: Abbasid Dynasty, Ayyubids, Knights Templar, and Golden Horde age up via unique tech-research mechanics rather than picking landmarks in the standard way.
- **WRITING RULE (owner, 2026-08-07): never write the Landmark age-up as an absolute.** Say "hầu hết các phe" and add that some civs age up at the Town Center or at a secondary building. An article that says every civ must build a Landmark to age up is a `contradiction`, not a style note.
- **The Landmark age-up is NOT an AoE4 invention - it comes from AoE3 (owner, 2026-08-08).** In
  Age of Empires III: The Asian Dynasties (2007), the three Asian civilizations advance ages by
  building a Wonder chosen from a selection, each granting a different bonus, "instead of
  advancing from the Town Center". AoE4 took that idea and made it the default for nearly the
  whole roster. The series wiki's own Landmark page draws the same line, calling landmarks
  similar to Wonders in The Asian Dynasties.
  - source: https://en.wikipedia.org/wiki/Age_of_Empires_III:_The_Asian_Dynasties ,
    https://ageofempires.fandom.com/wiki/Landmark , owner confirmation 2026-08-08
  - Worth writing whenever an article frames Landmarks as what makes AoE4 different: the choose-
    your-age-up idea is a series inheritance, and presenting it as new is the kind of error a
    long-time player spots at once.

---

## Economy / Age-up costs

- Advancing Dark Age → Feudal Age costs **400 Food + 200 Gold** for most civilizations, build time cited around 3:10.
  - VERDICT: guide's "đủ 400 thực và 200 vàng thì lên Đời II" is **CONFIRMED as the standard, near-universal cost** for most civs.
  - ⚠️ CẦN NGƯỜI DUYỆT: while the Feudal-age resource cost is described as "standard across civilizations" by multiple sources, the civs with alternate age-up mechanics (Abbasid, Ayyubids, Knights Templar, Golden Horde) do NOT necessarily follow this exact cost/mechanic - the guide's "nền văn minh nào cũng áp dụng được" framing should be understood as "the default/most-civs case," not universally exception-free. Worth a caveat sentence in the guide, but not a factual error given it's presented as a beginner-default build.
  source: search synthesis (GamesRadar, Fandom Feudal Age page, GameNGuide).

- **"7 thực 3 vàng" is an AoE4 convention, and this is its home.** Seven villagers on food and
  three on gold is the basic Feudal opening - it sizes directly to the 400 food + 200 gold
  age-up cost above. CONFIRMED by site owner 2026-08-08. `build-order-co-ban-aoe4.ts` already
  teaches it correctly.
  - **Recorded here because it was previously filed under the wrong game.** `aoe1-facts.md`
    carried it as an AoE1 convention with a `CONFIRMED` stamp from 2026-07-06, re-affirmed
    2026-08-07, and it reached a draft article before the owner caught it on 2026-08-08. That
    entry is now retracted. Advancing an age in AoE1 costs no gold, so a food/gold villager
    split cannot describe an AoE1 opening - the mechanics rule it out.
  - Treat it the same way as any other build number: a convention that tracks the meta, not an
    engine rule.

---

## Counters / counter triangle

- Primary AoE4 counter triangle: **Spearman (giáo) counters Horseman/Cavalry (kỵ)** → **Cavalry counters Archer (cung)** → **Archer counters Spearman**.
  - VERDICT: guide's stated loop "giáo khắc kỵ, kỵ khắc cung, cung khắc giáo" is **CONFIRMED**, matches the standard rock-paper-scissors design of AoE4.
  source: https://aoedb.net/aoe4/counters/ , https://ageofempires.fandom.com/wiki/Spearman_(Age_of_Empires_IV) , https://ageofempires.fandom.com/wiki/Counter
- Additional/secondary counters mentioned in sources (not asserted by the guides, included for context only): Men-at-Arms counter both Spearmen and Archers; Mangonels/siege counter all three infantry-tier unit types.

### Counter structure in depth (added 2026-08-08, for the AoE2/AoE3 comparison articles)

Fetched from the series wiki's cross-title `Counter` page, which covers AoE1/AoE2/AoE3/AoE4 side
by side - the same page that supplies `aoe2-facts.md`. source: https://ageofempires.fandom.com/wiki/Counter

- AoE4 has **hard counters** (large bonuses against a unit type) and **soft counters** (an
  advantage that can be mitigated). Several **counter triangles** exist, not one.
- **The primary triangle is between the Feudal Age 'trash' units**: Horsemen beat Archers, Archers
  beat Spearmen, Spearmen beat Horsemen. Each is a hard counter that reliably wins a 1v1.
  Note the wiki calls these "trash" units in AoE4 too, but `aoe2-facts.md` records AoE2's precise
  definition (costs no gold and no stone) - **the two uses are not the same concept**, so do not
  carry the AoE2 definition across into an AoE4 sentence.
- **Heavy units** arrive mainly in the Castle Age and are meant to beat multiple units of that
  first triangle - hence the 'fast castle' strategy existing to reach them early. Lancers and
  other heavy melee cavalry beat Archers and Horsemen; Men-at-Arms and other heavy melee infantry
  beat all three. Heavy units are answered by **anti-heavy** units, the Crossbowman being the
  primary example, and anti-heavy units are in turn answered by trash units - **a second
  triangle**.
- When a heavy unit does appear in the Feudal Age it has reduced stats: Early Men-at-Arms have
  less pierce armor and deal less damage, so Archers and Horsemen beat them cost-effectively
  without winning a straight equal-numbers fight. The wiki names this as its example of a soft
  counter.
- **Ships have their own hard triangle**: archer ships beat incendiary ships beat springald ships
  beat archer ships. Warships soft counter springald ships and can replace them in the Imperial
  Age.
- **Mass breaks counters.** Once a unit type reaches sufficient numbers it handles its supposed
  counter, especially ranged units, which is why Mangonels exist for massed ranged and Springalds
  and Ribauldequins for massed melee.
- **Ranged cavalry and heavy cavalry have very few hard counters.** Ranged cavalry combine range
  with hit-and-run mobility that avoids the melee units meant to beat them; heavy cavalry can beat
  almost anything 1v1 including Spearmen and Crossbowmen. Both are held in check mainly by cost -
  they lose to an equal-*resources* number of counters, not an equal-*unit* number - which stops
  working in a late game with a developed economy. The wiki's stated answer there is combined
  arms.
- Camel Riders "defeat all cavalry" but are more susceptible to (not hard countered by) Archers
  and heavy infantry.
- **WRITING NOTE for comparison articles**: AoE4's counters really are triangles, and AoE2's
  really are not - `aoe2-facts.md` records 27 armor classes and stacking flat bonuses that the
  wiki says "more often than not subvert" the rock-paper-scissors reading. That contrast is
  sourced on both sides and is the strongest single mechanical comparison available. Do not
  overstate it into "AoE4 is simpler": the same page spends a long paragraph on how AoE4 counters
  fail to describe real unit interactions.

---

## Cross-title speed ranking (AoE1/2/3/4)

- The guide's claim "AoE3 > AoE1 > AoE4 > AoE2" (relative game-speed ranking across the series) is CONFIRMED accurate by the domain expert (user, 2026-07-06) and re-confirmed in the 2026-08-08 full re-read of the owner-only lines. It is not an official benchmarked metric, but it is treated as true for this audience and must NOT be flagged as a factual error. On both passes the owner asked for the word "nhịp trận" to be dropped in favour of tốc độ / speed setting - see the next entry, which is the binding definition.
- **WHAT THE RANKING ACTUALLY MEASURES (owner, 2026-08-08): raw game speed, not "match pacing".**
  It is how fast things MOVE - villager movement, cavalry movement - with the game's speed
  setting pushed to maximum. It is NOT a statement about how long a match lasts, how much
  thinking time you get per phase, or how frantic the APM is.
  - **WRITING RULE**: describe it in those concrete terms ("dân đi nhanh hay chậm, quân xông lên
    nhanh hay chậm khi đẩy thiết lập tốc độ lên mức cao nhất"). Do NOT translate it into
    "nhịp trận", "thêm thời gian ở mỗi pha", "đỡ phải bấm gấp" or any other claim about pacing
    or reaction time - the owner corrected exactly that rewording on 2026-08-08. The ranking
    licenses a statement about unit speed and nothing beyond it.

---

## Fortifications (context for "tuong-thanh-phong-thu-aoe4" guide, spot-checked, not deeply researched this pass)

- Stone Walls in AoE4 cannot be destroyed by melee units' torches - they can only be damaged by dedicated siege weapons. This is a well-documented AoE4 mechanic (distinct from AoE2 where towers/walls have HP damageable by most unit types with reduced effectiveness).
- Outpost (chòi canh) in AoE4 does NOT shoot arrows by default - it must be upgraded (Arrow Slits) before it can fire. Confirmed by the site owner (insider), 2026-07-07. So the guide claim "muốn nó bắn tên phải nâng cấp thêm" is CORRECT. (Town Center, by contrast, fires arrows by default and fires more when garrisoned.)
  source: site owner confirmation 2026-07-07.
  ⚠️ CẦN NGƯỜI DUYỆT: age tiers of walls/Keep/ram/Mangonel/Trebuchet/bombard and "torch damage strongest on cavalry" are still not independently verified this pass.

---

## Counters & civ economy (insider-confirmed 2026-07-07, "cung-r-ngua-chem" guide)

- Light cavalry (kỵ nhẹ) counters ALL archer/ranged units in AoE4 (not only horse archers). So "kỵ cung chưa đủ đông thì bị kỵ nhẹ săn" is CORRECT.
- Heavy cavalry (kỵ nặng) is countered by BOTH Spearman (giáo) AND Crossbowman (nỏ). So "giáo cộng nỏ khắc kỵ nặng" is CORRECT.
- Onna-Musha (Japanese) deals bonus damage vs heavy units; calling this "xuyên giáp nặng" is acceptable phrasing (it is bonus damage, not a literal armor-penetration mechanic).
- Abbasid Dynasty has the STRONGEST economy of all AoE4 civs. So "Abbasid vốn mạnh kinh tế / boom kinh tế" is CORRECT.
  source: site owner (AoE1/AoE4 domain expert), 2026-07-07.
- **Lạc đà Abbasid và lạc đà Pal (Đế chế 1) cùng là quân xoay chuyển cục diện, nhưng bằng hai
  đường khác nhau (owner, 2026-08-08).** Pal là **hệ chém phũ**: tốc độ cực cao, sát thương lớn,
  lao vào bẻ trận. Abbasid là **hệ chủ lực ôm bản đồ**: boom kinh tế trước rồi lấy thịt đè người.
  Đây là cách so hai con lạc đà cho dân Đế chế 1, chuẩn hơn hẳn việc nói "Đế chế 4 trao vai lạc
  đà Pal cho Abbasid" - hai phe làm cùng một việc theo hai phong cách trái ngược.
- **Kỵ binh bên Đế chế 4 đắt, trong khi các dòng khắc nó là giáo và nỏ thì rẻ hơn hẳn, nên mọi
  pha đổi quân bằng kỵ đều phải cân nhắc (owner, 2026-08-08).** Khớp với dòng counter đã có ở
  trên (giáo + nỏ khắc kỵ nặng) và với ghi chú wiki rằng kỵ chủ yếu bị giữ chân bằng chi phí
  chứ không bằng một khắc tinh cứng.

## Ranked ladder (added 2026-08-08, for `ranked-aoe4-vs-ladder-starcraft`)

> ⚠️ **A ranked ladder is NOT an AoE4 differentiator (owner, 2026-08-08). Every title in the
> series has one.** Everything below describes how AoE4 divides its ranks; none of it is a
> reason to prefer AoE4 over AoE2, AoE3 or AoE1 DE. An article that lists "has a seasonal
> ranked ladder" among AoE4's advantages is making a false comparison, and the owner corrected
> exactly that on 2026-08-08.

- **Six rank divisions, each with three tiers**, lowest to highest: Bronze, Silver, Gold,
  Platinum, Diamond, **Conqueror**. Tiers are written like "Silver II", giving 18 steps in all.
  - source: https://www.ageofempires.com/news/deep-dive-on-age-of-empires-iv-1v1v-ranked-seasons/
- **5 placement battles** at the start of each season; a rank is granted on completing the fifth.
  - source: https://support.ageofempires.com/hc/en-us/articles/5776946601876-Age-Of-Empires-IV-Ranked-Season-FAQ
- Winning ranked games earns **Rank Points** and losing them costs Rank Points. **Each division
  and tier has a Rank Point requirement**, visible in the Rank List, and the Ranked tab shows
  current Rank Points against what is needed to ascend.
  - source: the FAQ above
- **Ranked queue is disabled between seasons.** The Search Game button greys out and the game
  shows "No Active Season". - source: the FAQ above
- The leaderboard is **per season**, selectable from a dropdown, and stops updating once its
  season ends. - source: the FAQ above
- Rank is shown on the player profile, in loading screens and in game lobbies.
  - source: the FAQ above
- ⚠️ CẦN NGƯỜI DUYỆT - **season length.** The launch-era deep dive says "the first Ranked Season
  will span 12 weeks". That is a statement about season one in 2021, not a standing rule, and
  nothing found this pass confirms the current cadence. Do not write "mỗi mùa 12 tuần".
- ⚠️ CẦN NGƯỜI DUYỆT - **Elo vs Rank Points.** AoE4 support has an article titled "What's the
  difference between Elo and Rank Points?", so the game clearly tracks both and they are not the
  same thing. That article was not readable this pass, so the mechanism is unknown. This matters
  because StarCraft II has the same split (ladder points vs MMR, see `starcraft-facts.md`) and it
  is the most interesting thing to compare - but comparing them requires actually knowing how
  AoE4's works.

**Structural contrasts with the StarCraft II ladder that ARE sourced on both sides:**

| | AoE4 | StarCraft II |
| --- | --- | --- |
| Named steps | 6 divisions x 3 tiers = 18 | 7 leagues, subdivided into divisions of up to 100 players |
| Placement | 5 matches | 5 matches |
| Top rank | Conqueror, reached by Rank Point threshold | Grandmaster, a hard cap of the top 200 per region |
| Between seasons | ranked queue disabled outright | not established this pass - do not claim |

- The top-rank difference is the sharpest one: **Conqueror is a threshold anyone can cross,
  Grandmaster is 200 seats per region.** Two different answers to what "top rank" should mean.
  - source: the AoE4 FAQ above, https://liquipedia.net/starcraft2/Battle.net_Leagues

## Esports (added 2026-08-08, for `esports-aoe4-vs-starcraft2`)

- **Red Bull Wololo: Londinium, 1-6 April 2026**, is the flagship event. Official page: a
  "$250,000 total prize pool" across **both Age of Empires II: Definitive Edition and Age of
  Empires IV**, run over six days at three London venues - the Red Bull Gaming Sphere in
  Shoreditch for the group stage, ODEON Luxe Leicester Square for playoffs, and the **Royal
  Albert Hall** for the grand final, in front of more than 3,000 fans with a live 40-piece
  orchestra. - source: https://www.ageofempires.com/red-bull-wololo-londinium/
- **The AoE4 share of that is $40,000, not $250,000.** Liquipedia's AoE4 event page gives
  `prizepoolusd=40000`, S-Tier, offline, 1v1 single elimination, 4-6 April 2026, semifinals at
  ODEON Luxe and the final at the Royal Albert Hall. The $250,000 is the combined figure across
  both titles. **Writing "Đế chế 4 có giải 250 nghìn đô" is a factual error.**
  - source: https://liquipedia.net/ageofempires/Red_Bull_Wololo/Londinium/AoE4 (infobox)
- **Neither AoE4 nor StarCraft II is in the 2026 Esports World Cup.** Wikipedia states that
  excluding StarCraft II "meant that the 2026 EWC will not feature any real-time strategy games"
  - which necessarily includes AoE4. The 2026 EWC runs 24 titles for a $75 million purse.
  - source: https://en.wikipedia.org/wiki/2026_Esports_World_Cup
  - **This is the fair frame for the comparison article**: the story is not one RTS beating
    another, it is that the biggest event in esports carried no RTS at all in 2026, while both
    games kept their own circuits running. AoE's flagship filled the Royal Albert Hall; SC2's GSL
    ran a Tier 1 season on $15,000 (see `starcraft-facts.md`). Report both, rank neither.
- ⚠️ CẦN NGƯỜI DUYỆT - AoE4's full 2026 calendar and total annual prize money were NOT gathered.
  Liquipedia's `Age_of_Empires_IV/Tournaments` page is pure template transclusion, so its wikitext
  holds no tournament data - same dead end as the StarCraft `Winnings/<year>` pages. Only Red Bull
  Wololo is sourced here; do not imply it is the only AoE4 event of the year.

## Where AoE4 stands in Vietnam (added 2026-08-08, for `de-che-co-nhung-ban-nao`)

Site owner speaking about their own community, 2026-08-08. Same standing as the other
`Confirmed by site owner` lines here. See `aoe1-facts.md` for the AoE1 half of the picture.

- **AoE2 and AoE4 are currently level in Vietnam, and both are small next to AoE1.** Confirmed
  by site owner 2026-08-08.
- **On the current trend AoE4 is the one that will pull ahead of those two.** Confirmed by site
  owner 2026-08-08.
  - **WRITING RULE (owner, 2026-08-08)**: this is the owner's READ of a trend, not a measurement.
    Present it as a judgement ("theo đà hiện nay"). Dressing it up as data - a number, a player
    count, a survey - is a `contradiction`, because no such measurement exists in this store.

- **⚠️ CORRECTED SAME DAY - most of the "grounds" first written here were NOT differentiators.**
  The first version of this rule invited an article to justify the read with a list: newest
  title, steadiest content cadence, on PC/console/Game Pass, seasonal ranked ladder. The owner
  struck three of the four on 2026-08-08, because AoE2 matches AoE4 on every one of them:
  | Proposed ground | Verdict |
  | --- | --- |
  | Ra nội dung đều tay hơn | ❌ **Both AoE2 and AoE4 are updated heavily right now.** Cannot separate them. |
  | Có bảng xếp hạng theo mùa | ❌ Every title in the series has a ranked ladder. See the warning in "Ranked ladder". |
  | Có trên PC, console và Game Pass | ❌ AoE2 DE is on Xbox, PlayStation and Game Pass too. |
  | Là bản mới nhất của series | ✅ The only one that actually holds - AoE4 has the longest content life still ahead of it. |
  So an article may offer exactly one sourced ground (newest title) plus the owner's read of
  where new Vietnamese players are heading. **Manufacturing a longer list is a false comparison,
  and listing update cadence in particular is the trap** - it looks like the strongest argument
  and is in fact a tie.
- These claims must not be turned into disparagement of AoE2 or AoE1. The sourced material in
  `aoe2-facts.md` (seven years of continuous expansion, Metacritic 84, cross-platform) is the
  reason AoE2 is level rather than behind, and it belongs in any article that makes this
  comparison.

## Open questions for the human reviewer

1. Confirm current-patch (mid-2026) exact costs for Mangudai/Camel Archer/Camel Rider/Horse Archer/Onna-Musha/Royal Knight - this file cites figures gathered from web sources of varying vintage and AoE4 has had multiple balance patches since 2021 launch.
2. Confirm whether "The Sultans Ascend" (which added Japanese/Onna-Musha, Ayyubids, House of Lancaster, Knights Templar) is the correct/current DLC boundary as of July 2026, or whether a newer DLC has shipped that could add/change civs referenced in `cac-nen-van-minh-aoe4.ts`.
3. RESOLVED (user, 2026-07-06): the AoE3 > AoE1 > AoE4 > AoE2 speed ranking is confirmed accepted/accurate - no caveat needed.
4. Double check whether ALL civs truly use the 400 Food/200 Gold Feudal age-up cost, or whether any of the newer DLC civs (beyond the four tech-research exceptions already noted) deviate.
5. Map out the full civ → age-up-mechanism table (Landmark / Town Center / secondary building / tech research). The owner confirmed on 2026-08-07 that all of these paths exist, but this file only records the four tech-research civs by name, so articles currently have to describe the non-Landmark paths generically.
6. Verify Onna-Musha's availability is Japanese-only in the standard game (a search result surfaced an "Onna-Musha - Holy Roman Empire" aoe4world page, possibly reflecting an event/mercenary/shared-tech mechanic) - was not investigated further and could be worth a sanity check if the guide ever claims Onna-Musha is Japanese-exclusive.
