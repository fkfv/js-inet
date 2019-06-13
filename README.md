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
 * pton, pton4 converts a presentation format IP address to binary form,
 * in network byte order.
 *
 * The pton4 function will only work on IPv4 addresses, while pton function
 * will work on both.
 */
function pton4(addr: string): Buffer|null;
function pton(addr: string): Buffer|null;

inet.pton4('127.0.0.1').toString('hex') // = 7F000001
inet.pton4('256.0.0.1')                 // = null
inet.pton('::1').toString('hex')       // = 00000000000000000000000000000001

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
