export const parseLineQty = (value: unknown): number => {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(999, Math.floor(n))
}

export const lineItemAmount = (unitPrice: number, qty?: unknown): number =>
  Number((Number(unitPrice) * parseLineQty(qty)).toFixed(2))
