export interface Civ {
  id: string
  name: string
  emoji?: string
  /** Civ chưa phát hành (DLC sắp ra) — UI có thể loại khỏi tool đấu thật. */
  upcoming?: boolean
}

export const civs: Civ[] = [
  { id: 'abbasid', name: 'Abbasid Dynasty' },
  { id: 'ayyubids', name: 'Ayyubids' },
  { id: 'byzantines', name: 'Byzantines' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'delhi', name: 'Delhi Sultanate' },
  { id: 'english', name: 'English' },
  { id: 'french', name: 'French' },
  { id: 'hre', name: 'Holy Roman Empire' },
  { id: 'japanese', name: 'Japanese' },
  { id: 'jeanne', name: "Jeanne d'Arc" },
  { id: 'malians', name: 'Malians' },
  { id: 'mongols', name: 'Mongols' },
  { id: 'orderofthedragon', name: 'Order of the Dragon' },
  { id: 'ottomans', name: 'Ottomans' },
  { id: 'rus', name: 'Rus' },
  { id: 'zhuxi', name: "Zhu Xi's Legacy" },
  { id: 'knights-templar', name: 'Knights Templar' },
  { id: 'house-of-lancaster', name: 'House of Lancaster' },
  { id: 'vikings', name: 'Vikings', upcoming: true },
  { id: 'scots', name: 'Scots', upcoming: true },
]
