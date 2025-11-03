import React from 'react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { signInWithGoogle, signOut, getUser } from '../utils/auth';

export default function Settings() {
  const [userEmail, setUserEmail] = React.useState('');
  const [signedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    const check = async () => {
      const { data } = await getUser();
      if (data?.user) {
        setUserEmail(data.user.email || '');
        setSignedIn(true);
      } else {
        setSignedIn(false);
        setUserEmail('');
      }
    };
    check();
  }, []);

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      // eslint-disable-next-line no-alert
      alert('Failed to start Google sign-in. Check redirect URLs.');
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      // eslint-disable-next-line no-alert
      alert('Sign-out failed.');
    } else {
      setSignedIn(false);
      setUserEmail('');
    }
  };

  return (
    <div className="container">
      <h2>Settings</h2>
      <p className="text-muted">Sign in with Google to sync your weekly reports.</p>

      <Card title="Authentication">
        <div style={{ display: 'flex', gap: 12 }}>
          {!signedIn ? (
            <Button variant="primary" onClick={handleGoogleSignIn}>Sign in with Google</Button>
          ) : (
            <>
              <span>Signed in as {userEmail}</span>
              <Button variant="ghost" onClick={handleSignOut}>Sign out</Button>
            </>
          )}
        </div>
      </Card>

      <Card title="Profile" subtitle="Optional fields">
        <div style={{ display: 'grid', gap: 12 }}>
          <Input label="Display Name" placeholder="Your name" />
          <Input label="Email" placeholder="email@example.com" type="email" value={userEmail} readOnly />
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="primary">Save</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
