export function buildQueryString(
  params: Record<string, string | string[] | undefined>
): string {
  return Object.entries(params)
    .flatMap(([key, value]) => {
      if (value === undefined) return []
      if (Array.isArray(value)) {
        return value.map(
          (v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
        )
      }
      return [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`]
    })
    .join('&')
}
