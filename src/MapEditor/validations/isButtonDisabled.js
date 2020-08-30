/**
 * Identify whether button is disabled based on messages
 * @param {Array<string>} messages
 * @returns {boolean}
 */
export default function isButtonDisabled(messages) {
  return Boolean(messages?.length)
}
