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
}

export {
  pton4
}
