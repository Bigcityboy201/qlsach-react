// Utility helpers: formatters, mappers, and common pure functions.
function padTime(value: number): string {
  return String(value).padStart(2, '0')
}

function toVietnameseTimestamp(date: Date): string {
  const day = padTime(date.getDate())
  const month = padTime(date.getMonth() + 1)
  const year = date.getFullYear()
  const hours = padTime(date.getHours())
  const minutes = padTime(date.getMinutes())
  const seconds = padTime(date.getSeconds())
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

export function logValidationErrorLikeBackend(message: string, details: unknown = null): void {
  console.error({
    operationType: 'Failure',
    message,
    code: 'BAD_REQUEST',
    domain: 'request',
    details,
    'thời gian': toVietnameseTimestamp(new Date())
  })
}
