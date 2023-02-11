# Remote Logging

Call `initLogger` to override `console.log`, `console.warn`, `console.error` and `console.info` functions which will be routed to the given remote server.

```shell
npm install vs-ionic-log@https://github.com/dtarnawsky/vs-code-logger
```

```typescript
import { initLogger } from 'vs-ionic-log';

initLogger('192.168.1.130:9000');
```

