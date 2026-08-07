export const site = {
  name: 'AoE4 VN',
  description: 'Cộng đồng Age of Empires IV Việt Nam - giải đấu, công cụ và tin tức.',
  url: 'https://aoe4.vn',
  links: {
    discord: 'https://discord.gg/Bshbqw7nHN',
    facebook: 'https://www.facebook.com/groups/aoe4vietnam/',
    blog: 'https://aoe4vietnam.org',
    youtube: 'https://www.youtube.com/@clearmanaoe4',
    github: 'https://github.com/shishi-77/aoe4.vn',
  },
  /**
   * Tác giả mặc định cho bài viết, dùng cho tín hiệu E-E-A-T.
   * Để trống -> JSON-LD giữ nguyên author là Organization.
   */
  author: {
    name: '',
    url: '',
  },
  ahaslides: {
    url: 'https://ahaslides.com',
    /** Bật/tắt gợi ý AhaSlides ở trang giải đấu. */
    showTournamentHint: true,
  },
  analytics: {
    /** GA4 measurement id (G-XXXXXXXXXX). Empty string = analytics off. */
    ga4Id: 'G-NX88DCF7FM',
  },
}
