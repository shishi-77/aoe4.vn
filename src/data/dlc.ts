export const dlc = {
  name: 'Raiders of the North',
  fullName: 'Age of Empires IV: Raiders of the North',
  /** null = chưa có ngày chính xác; điền ISO +07:00 khi Microsoft công bố để bật đếm ngược. */
  releaseDate: '2026-10-30T00:00:00+07:00' as string | null,
  /** Ngày dự đoán để bật countdown trước khi Microsoft công bố ngày chính thức. */
  predictedReleaseDate: null as string | null,
  releaseLabel: '30 tháng 10 năm 2026',
  civs: ['Vikings', 'Scots'],
  highlights: [
    'Hai civ mới: Vikings và Scots',
    '4 nhiệm vụ Crucible mới (solo/co-op)',
    'Hai biome mới: Scottish Heathland và Tundra Summer',
  ],
  steamUrl:
    'https://store.steampowered.com/app/4336170/Age_of_Empires_IV_Raiders_of_the_North/',
}
