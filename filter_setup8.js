const fs = require('fs');
let store = fs.readFileSync('src/store/index.ts', 'utf8');

if (!store.includes('requestNotificationPermission')) {
  store = store.replace(
    "import { syncStateToFirestore, loadStateFromFirestore } from '@/lib/db';",
    "import { syncStateToFirestore, loadStateFromFirestore } from '@/lib/db';\nimport { requestNotificationPermission } from '@/lib/notifications';"
  );
  
  store = store.replace(
    "set((state) => ({ ...state, ...serverState }));",
    "set((state) => ({ ...state, ...serverState }));\n              requestNotificationPermission(user.id);"
  );
  
  fs.writeFileSync('src/store/index.ts', store);
}
