const fs = require('fs');
let client = fs.readFileSync('src/app/_components/HomeClient.tsx', 'utf8');

client = client.replace(/import \{ initialDishes \} from '@\/data\/dishes';\n?/, '');

fs.writeFileSync('src/app/_components/HomeClient.tsx', client);
