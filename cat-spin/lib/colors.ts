export const PALETTE = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#FF922B", "#CC5DE8", "#20C997", "#F06595",
  "#74C0FC", "#A9E34B", "#FFA94D", "#DA77F2",
  "#63E6BE", "#FF8787", "#748FFC", "#69DB7C",
]

export function assignColor(usedColors: string[]): string {
  const available = PALETTE.find((c) => !usedColors.includes(c))
  return available ?? PALETTE[usedColors.length % PALETTE.length]
}
