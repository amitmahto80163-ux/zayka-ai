const fs = require('fs');
let hook = fs.readFileSync('src/hooks/useARChef.ts', 'utf8');

if (!hook.includes('auth.currentUser')) {
  // Add auth import if not present
  if (!hook.includes('import { auth } from')) {
    hook = hook.replace('import { useState, useRef } from "react";', 'import { useState, useRef } from "react";\nimport { auth } from "@/lib/firebase";');
  }

  // Find the fetch call
  const oldFetch = "const tokenResponse = await fetch('/api/session');";
  const newFetch = `
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      if (!token) throw new Error('Not authenticated');

      const tokenResponse = await fetch('/api/session', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!tokenResponse.ok) {
        throw new Error('Failed to get session token: ' + tokenResponse.statusText);
      }`;

  hook = hook.replace(oldFetch, newFetch);
  fs.writeFileSync('src/hooks/useARChef.ts', hook);
  console.log('Hook updated');
} else {
  console.log('Hook already updated');
}
