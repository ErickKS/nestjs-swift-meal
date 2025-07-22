/**
 * Pauses the execution for a specified amount of time.
 *
 * @param {number} ms - The number of milliseconds to wait before resolving the Promise.
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 *
 * @example
 * await sleep(1000) // waits for 1 second
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
