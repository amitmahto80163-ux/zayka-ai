const fs = require('fs');
let client = fs.readFileSync('src/app/profile/_components/Client.tsx', 'utf8');

const signOutAndLinks = `
        {/* Sign Out */}
        <button 
          onClick={async () => {
            try {
              const { auth } = await import('@/lib/firebase');
              const { signOut } = await import('firebase/auth');
              await signOut(auth);
            } catch (err) {
              console.error(err);
            }
            useZaykaStore.getState().setUser(null);
            router.push('/auth');
          }}
          style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 18, padding: '14px', color: '#DC2626', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', width: '100%', marginBottom: 12 }}>
          Sign Out
        </button>

        {/* Delete Account */}
        <button 
          onClick={async () => {
            const confirmed = window.confirm('Are you sure you want to permanently delete your account and all data?');
            if (!confirmed) return;
            try {
              const { deleteAccount } = await import('@/lib/auth');
              await deleteAccount();
              useZaykaStore.getState().setUser(null);
              router.push('/auth');
            } catch (err: any) {
              if (err.message?.includes('requires-recent-login')) {
                alert('Please sign out and sign in again to verify your identity before deleting.');
              } else {
                alert('Failed to delete account. Please try again later.');
              }
            }
          }}
          style={{ background: 'transparent', border: 'none', padding: '14px', color: W.muted, fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', width: '100%', marginBottom: 24, textDecoration: 'underline' }}>
          Delete Account
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 40 }}>
           <Link href="/privacy" style={{ fontSize: 12, color: W.muted, fontWeight: 700 }}>Privacy Policy</Link>
           <Link href="/terms" style={{ fontSize: 12, color: W.muted, fontWeight: 700 }}>Terms of Service</Link>
        </div>
`;

client = client.replace(
  /\{\/\* Sign Out \*\/\}.*?<\/button>/s,
  signOutAndLinks
);

if (!client.includes("import Link from 'next/link';")) {
  client = "import Link from 'next/link';\n" + client;
}

fs.writeFileSync('src/app/profile/_components/Client.tsx', client);
console.log('Fixed Profile component');
