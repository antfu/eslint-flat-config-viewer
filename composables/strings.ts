export function nth(n: number) {
  if (n === 1)
    return '1st'
  if (n === 2)
    return '2nd'
  if (n === 3)
    return '3rd'
  return `${n}th`
}
