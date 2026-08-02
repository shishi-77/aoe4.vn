type GtagFn = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GtagFn
  }
}

export interface OutboundClickEvent {
  channel: 'discord' | 'facebook'
  /** Where the CTA lives on the page. */
  placement: 'header' | 'article_footer' | 'homepage'
  /** Route path where the click happened, e.g. /guides/cach-tai-aoe4/ */
  path: string
}

/** Inject the GA4 gtag snippet. No-op when the id is empty (analytics off). */
export function initAnalytics(measurementId: string): void {
  if (!measurementId) return
  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId)
  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)
}

/** Report a click on a community CTA link. Safe no-op when analytics is off. */
export function trackOutboundClick(event: OutboundClickEvent): void {
  window.gtag?.('event', 'join_community_click', {
    channel: event.channel,
    placement: event.placement,
    page_path: event.path,
  })
}
