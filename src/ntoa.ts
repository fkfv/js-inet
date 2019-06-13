const ntop4 = function (addr: Buffer): string|null {
  const parts = Array.from(addr);

  if (parts.length !== 4) {
    return null;
  }

  return parts.join('.');
};

export {
  ntop4
};
