export default function getRandomHash() {
  return Array.from({ length: 100 }).map((_, index) =>
    Array.from({ length: 10 })
      .map(
        (_, index) => String.fromCharCode((Math.random() * 100) % 100) + index,
      )
      .join('')
      .replace(/[\W]/gi, ''),
  )
}
