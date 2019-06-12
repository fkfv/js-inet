# js-inet
> inet-aton, inet-ntoa implementations in javascript

## Notes
This implementation is written in pure TypeScript, and transpiled to JavaScript
for distribution. The implementation is based on that found in FreeBSD, 
specifically the IPv6 functions `inet_pton6()` and `inet_ntop6()`.

## Examples
```typescript
import * as inet from 'js-inet'

/**
 * pton, aton converts a presentation format IP address to binary form,
 * in network byte order.
 *
 * The signature for both functions is very similar, the only difference is the
 * return type. The pton function will return `null` on error, while the aton
 * function will return -1 on error. This difference is important, as -1
 * will be interpreted as the IPv4 address 255.255.255.255
 */
function pton(addr: string):? Buffer;
function aton(addr: string): Buffer;

inet.pton('127.0.0.1').toString('hex') // = 7F000001
inet.pton('256.0.0.1')                 // = null
inet.pton('::1').toString('hex')       // = 00000000000000000000000000000001

inet.aton('127.0.0.1').toString('hex') // = 7F000001
inet.aton('256.0.0.1').toString('hex') // = FFFFFFFF
inet.aton('::1').toString('hex')       // = 00000000000000000000000000000001
inet.aton('g000::').toString('hex')    // = FFFFFFFF

/**
 * ntoa converts a network byte order binary form IP address into
 * presentation form.
 */
function ntoa(addr: Buffer):? string;

inet.ntoa(Buffer.fromString('7F000001', 'hex')) // = 127.0.0.1

```

## License
This library keeps the same license as the functions in the FreeBSD
implementation, the ISC license. A copy can be found in LICENSE.txt
