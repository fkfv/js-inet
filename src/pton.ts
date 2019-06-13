const ADDR6SIZE = 16;
const ADDR4SIZE = 4;
const HEXDIGITS = '0123456789abcdef';

const pton4 = function (addr: string): Buffer|null {
  let ipBuffer = Buffer.alloc(ADDR4SIZE);
  let seenDigit = false;
  let octets = 0
  let bufferIndex = 0;

  while (addr.length !== 0) {
    let ch = addr[0];
    let pch = HEXDIGITS.indexOf(ch);

    addr = addr.slice(1);

    if (pch !== -1) {
      const newDigit = ipBuffer[bufferIndex] * 10 + pch;

      if (seenDigit && ipBuffer.readUInt8(bufferIndex) == 0) {
        return null;
      }

      if (newDigit > 255) {
        return null;
      }

      ipBuffer.writeUInt8(newDigit, bufferIndex);
      
      if (!seenDigit) {
        if (++octets > 4) {
          return null;
        }

        seenDigit = true;
      }
    } else if (ch === '.' && seenDigit) {
      if (octets === 4) {
        return null;
      }

      ipBuffer.writeUInt8(0, ++bufferIndex);
      seenDigit = false;
    } else {
      return null;
    }
  }

  if (octets < 4) {
    return null;
  }

  return ipBuffer;
};

const pton = function (addr: string): Buffer|null {
  let ipBuffer = Buffer.alloc(ADDR6SIZE)
  let bufferIndex = 0
  let val = 0
  let seenHex = 0
  let current = addr
  let colonPointer = null

  if (addr.length === 0) {
    return null;
  }

  if (addr[0] === ':') {
    if (addr[1] !== ':') {
      return null;
    }

    addr = addr.slice(1)
  }

  while (addr.length !== 0) {
    let ch = addr[0];
    let pch = HEXDIGITS.indexOf(ch.toLowerCase());

    addr = addr.slice(1);

    if (pch !== -1) {
      val <<= 4;
      val |= pch;

      if (++seenHex > 4) {
        return null;
      }

      continue;
    }

    if (ch === ':') {
      current = addr;

      if (!seenHex) {
        if (colonPointer) {
          return null;
        }

        colonPointer = bufferIndex;
        continue;
      } else if (addr.length === 0) {
        return null;
      }

      if (bufferIndex + 2 > ADDR6SIZE) {
        return null;
      }

      ipBuffer.writeUInt8((val >> 8) & 0xff, bufferIndex++);
      ipBuffer.writeUInt8(val & 0xff, bufferIndex++);
      seenHex = 0;
      val = 0;

      continue;
    }

    if (ch === '.' && (bufferIndex + ADDR4SIZE) <= ADDR6SIZE) {
      const ipv4 = pton4(current);

      if (ipv4 !== null) {
        return ipv4;
      }
    }

    return null;
  }

  if (seenHex) {
    if (bufferIndex + 2 > ADDR6SIZE) {
      return null;
    }

    ipBuffer.writeUInt8((val >> 8) & 0xff, bufferIndex++);
    ipBuffer.writeUInt8(val & 0xff, bufferIndex++);
  }

  if (colonPointer !== null) {
    if (bufferIndex === ADDR6SIZE) {
      return null;
    }

    const startIndex = bufferIndex - colonPointer;

    for (let i = 1; i <= startIndex; i++) {
      ipBuffer.writeUInt8(ipBuffer.readUInt8(colonPointer + startIndex - i), ipBuffer.length - i);
      ipBuffer.writeUInt8(0, colonPointer + startIndex - i);
    }

    bufferIndex = ADDR6SIZE;
  }

  if (bufferIndex !== ADDR6SIZE) {
    return null;
  }

  return ipBuffer;
};

export {
  pton4,
  pton
};
