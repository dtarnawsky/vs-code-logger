# Remote Logging

Call `initLogger` to override `console.log`, `console.warn`, `console.error` and `console.info` functions which will be routed to the given remote server.

```typescript
import { initLogger } from 'vs-code-logger';

initLogger('192.168.1.130:9000');
```

