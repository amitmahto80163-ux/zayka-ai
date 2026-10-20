const fs = require('fs');
let config = fs.readFileSync('next.config.ts', 'utf8');

if (!config.includes('withSentryConfig')) {
  config = `import { withSentryConfig } from '@sentry/nextjs';\n` + config;
  config = config.replace(
    'export default nextConfig;',
    `export default withSentryConfig(nextConfig, {
      silent: true,
      org: "zayka-ai",
      project: "javascript-nextjs",
    });`
  );
  fs.writeFileSync('next.config.ts', config);
}
