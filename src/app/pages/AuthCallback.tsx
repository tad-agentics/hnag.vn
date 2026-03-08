import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '@/lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        const { error: e } = await supabase.auth.exchangeCodeForSession(code);
        if (e) {
          setError(e.message);
          return;
        }
      }
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) {
        navigate('/', { replace: true });
        return;
      }
      const { data: profile } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', u.id)
        .single();
      if (profile?.onboarding_completed) {
        navigate('/app/home', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    };
    run();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
        <p className="body-text" style={{ color: 'var(--color-error)' }}>{error}</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
      <p className="body-text" style={{ color: 'var(--color-text-secondary)' }}>Đang đăng nhập...</p>
    </div>
  );
}
