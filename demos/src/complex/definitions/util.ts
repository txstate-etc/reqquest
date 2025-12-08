export function getRandomUniqueElements<T> (arr: T[]): T[] {
  const count = Math.floor(Math.random() * arr.length) + 1
  const shuffled = shuffleArray(arr)
  return shuffled.slice(0, count)
}

function shuffleArray<T> (arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
