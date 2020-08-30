import { Dictionary } from '../Tilemap'

export default function toValidationMessages(tilemap = []) {
  const [counterTypes, counter] = factoryCounterTypes()
  tilemap.forEach((columns) => {
    columns.forEach(counter)
  })

  const messages = []
  /** @type {Array<[string, (counterTypes: { [key: string]: number }) => boolean]} */
  const validations = [
    ['You cannot have multiple players', validateUniquePlayer],
    [
      'There should be the same or more rescue points than rescuable boxes',
      validateRescuableCounts,
    ],
    ['There should be at least one rescuable box', validateMinRescuableBoxes],
    ['There should be at least one rescue point', validateMinRescuePoints],
  ]
  validations.forEach(([message, isValid]) => {
    if (!isValid(counterTypes)) {
      messages.push(message)
    }
  })
  return messages
}

/**
 * Factories counter for tile type
 * @returns {[{ [key: string]: number }, (tileValue: string) => void]}
 */
function factoryCounterTypes() {
  const counterTypes = {
    [Dictionary.MoveableBox]: 0,
    [Dictionary.RescuableBox]: 0,
    [Dictionary.None]: 0,
    [Dictionary.Player]: 0,
    [Dictionary.RescuePoint]: 0,
    [Dictionary.Wall]: 0,
  }
  const counter = (tileValue) => {
    counterTypes[tileValue] = 1 + (counterTypes[tileValue] || 0)
  }

  return [counterTypes, counter]
}

/**
 * Validates if there is only one player
 * @param {{ [key: string]: number }} counterTypes
 * @returns {boolean}
 */
function validateUniquePlayer(counterTypes) {
  return counterTypes[Dictionary.Player] === 1
}

/**
 * Validates if there is at least one block rescuable box
 * @param {{ [key: string]: number }} counterTypes
 * @returns {boolean}
 */
function validateMinRescuableBoxes(counterTypes) {
  return counterTypes[Dictionary.RescuableBox] > 0
}

/**
 * Validates if there is at least one rescue point
 * @param {{ [key: string]: number }} counterTypes
 * @returns {boolean}
 */
function validateMinRescuePoints(counterTypes) {
  return counterTypes[Dictionary.RescuePoint] > 0
}

/**
 * Validates if there is the same or greater amount of rescue points
 * than rescuable boxes
 * @param {{ [key: string]: number }} counterTypes
 * @returns {boolean}
 */
function validateRescuableCounts(counterTypes) {
  return (
    counterTypes[Dictionary.RescuePoint] >=
    counterTypes[Dictionary.RescuableBox]
  )
}
