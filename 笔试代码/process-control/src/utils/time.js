export const pad = (str, count = 2, char = '0') => String(str).padStart(count, char)

export function getLocalTimeString(milliseconds) {
  if (!milliseconds) {
    return ''
  }

  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  return `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`
}