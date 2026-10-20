const fs = require('fs');
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

if (!layout.includes('manifest.json')) {
  // Add metadata for manifest
  layout = layout.replace(
    'export const metadata: Metadata = {',
    "export const metadata: Metadata = {\n  manifest: '/manifest.json',"
  );
}

// Add script to register service worker
const swScript = `
<script
  dangerouslySetInnerHTML={{
    __html: \`
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').then(
            function(registration) { console.log('SW registered: ', registration.scope); },
            function(err) { console.log('SW registration failed: ', err); }
          );
        });
      }
    \`
  }}
/>
`;

if (!layout.includes('sw.js')) {
  layout = layout.replace('</body>', swScript + '\n      </body>');
}

fs.writeFileSync('src/app/layout.tsx', layout);
console.log('Registered SW in layout');
