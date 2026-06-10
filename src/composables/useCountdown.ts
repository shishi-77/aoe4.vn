import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
  isLive: boolean
}

/** Pure function: given target + now (epoch ms), return the countdown breakdown. */
export function computeCountdown(targetMs: number, nowMs: number): CountdownState {
  const diff = targetMs - nowMs
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true }
  }
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isLive: false,
  }
}

export interface Countdown {
  days: Ref<number>
  hours: Ref<number>
  minutes: Ref<number>
  seconds: Ref<number>
  isLive: Ref<boolean>
}

/** Reactive countdown that ticks every second from mount until the event goes live. */
export function useCountdown(targetIso: string): Countdown {
  const targetMs = new Date(targetIso).getTime()
  const initial = computeCountdown(targetMs, Date.now())
  const days = ref(initial.days)
  const hours = ref(initial.hours)
  const minutes = ref(initial.minutes)
  const seconds = ref(initial.seconds)
  const isLive = ref(initial.isLive)
  let timer: ReturnType<typeof setInterval> | undefined

  function tick() {
    const state = computeCountdown(targetMs, Date.now())
    days.value = state.days
    hours.value = state.hours
    minutes.value = state.minutes
    seconds.value = state.seconds
    isLive.value = state.isLive
    if (state.isLive && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }

  onMounted(() => {
    tick()
    if (!isLive.value) {
      timer = setInterval(tick, 1000)
    }
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { days, hours, minutes, seconds, isLive }
}
