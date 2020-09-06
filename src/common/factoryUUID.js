import getRandomHash from './ui/getRandomHash'
import random from './ui/random'

export default function factoryUUID() {
  const RandomHash = getRandomHash()
  const max = RandomHash.length
  return () => {
    const id = random(100000)
    return [
      RandomHash[random(max)],
      random(100000),
      RandomHash[random(max)],
      random(100000),
      Date.now(),
    ].join('-')
  }
}
