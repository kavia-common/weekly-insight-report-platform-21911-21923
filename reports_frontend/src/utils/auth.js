import { supabase } from './supabase';
import { getURL } from './getURL';

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getURL()}auth/callback`,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

export const handleAuthError = (error, navigate) => {
  // eslint-disable-next-line no-console
  console.error('Authentication error:', error);
  if (!error) return;
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('redirect')) {
    navigate('/auth/error?type=redirect');
  } else if (msg.includes('email')) {
    navigate('/auth/error?type=email');
  } else {
    navigate('/auth/error');
  }
};
