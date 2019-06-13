const ADDR4SIZE = 4;
const ADDR6SIZE = 16;

const ntop4 = function (addr: Buffer): string|null {
  const parts = Array.from(addr);

  if (parts.length !== ADDR4SIZE) {
    return null;
  }

  return parts.join('.');
};

interface TrackedGroup {
  base: number;
  len: number;
};

const ntop = function (addr: Buffer): string|null {
  const ipBuffer = Buffer.alloc(46);
  let words = Array(ADDR6SIZE / 2).fill(0);

  let best: TrackedGroup = {
    base: -1,
    len: 0
  };
  
  let current: TrackedGroup = {
    base: -1,
    len :0
  };

  if (addr.length === 4) {
    return ntop4(addr);
  }

  for (let i = 0; i < ADDR6SIZE; i++) {
    const index = ~~(i / 2);
    let value = (addr[i] << ((1 - (i % 2)) << 3));

    words[index] |= value;
  }

  for (let i = 0; i < ADDR6SIZE / 2; i++) {
    if (words[i] === 0) {
      if (current.base === -1) {
        current.base = i;
        current.len = 1;
      } else {
        current.len++;
      }
    } else {
      if (current.base !== -1) {
        if (best.base === -1 || current.len > best.len) {
          best = Object.assign({}, current);
        }

        current.base = -1;
      }
    }
  }

  if (current.base !== -1) {
    if (best.base === -1 || current.len > best.len) {
      best = current;
    }
  }

  if (best.base !== -1 && best.len < 2) {
    best.base = -1;
  }

  let bufferIndex = 0;

  for (let i = 0; i < ADDR6SIZE / 2; i++) {
    if (best.base !== -1 && i >= best.base && i < best.base + best.len) {
      if (i === best.base) {
        ipBuffer.write(':', bufferIndex++);
      }

      continue;
    }
    
    if (i !== 0) {
      ipBuffer.write(':', bufferIndex++);
    }
    
    if (i === 6 && best.base === 0 && (best.len === 6 ||
        (best.len === 7 && words[7] !== 0x0001) ||
        (best.len === 5 && words[5] === 0xffff)
    )) {
      return ntop4(addr.slice(12, 12 + ADDR4SIZE + 1));
    }

    const encoded = words[i].toString(16);

    ipBuffer.write(encoded, bufferIndex);
    bufferIndex += encoded.length;
  }
  
  if (best.base !== -1 && best.base + best.len === ADDR6SIZE / 2) {
    ipBuffer.write(':', bufferIndex++);
  }

  return ipBuffer.toString('ascii', 0, bufferIndex++);
};

export {
  ntop4,
  ntop
};
