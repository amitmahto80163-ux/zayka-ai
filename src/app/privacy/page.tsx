import { W } from '@/lib/theme';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px', color: W.text, lineHeight: 1.6 }}>
      <Link href="/" style={{ color: W.primary, textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>&larr; Back to Home</Link>
      <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, marginBottom: 24 }}>Privacy Policy</h1>
      <p>Last updated: September 2026</p>
      
      <h2 style={{ marginTop: 24, fontSize: 20 }}>1. Information We Collect</h2>
      <p>We collect information you provide directly to us when you create an account, save recipes, or use the Zayka AI features. This includes email, display name, and dietary preferences.</p>
      
      <h2 style={{ marginTop: 24, fontSize: 20 }}>2. How We Use Information</h2>
      <p>Your information is used to personalize your AI chef experience, store your favorite recipes, and provide AR cooking features.</p>
      
      <h2 style={{ marginTop: 24, fontSize: 20 }}>3. Data Deletion</h2>
      <p>You can delete your account and all associated data at any time from your Profile settings. Deleting your account will immediately remove your data from our active databases.</p>
    </div>
  );
}
