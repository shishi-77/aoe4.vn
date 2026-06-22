/** Fisher-Yates với rng tiêm vào; trả `count` phần tử không trùng. */
export function pickRandom<T>(pool: T[], count: number, rng: () => number = Math.random): T[] {
  const arr = [...pool]
  const n = arr.length
  const take = Math.min(count, n)
  for (let i = n - 1; i >= n - take; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(n - take)
}
