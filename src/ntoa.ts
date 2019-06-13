const ntop4 = function (addr: Buffer): string {
  return Array.from(addr).join('.')
}

export {
  ntop4,
}
