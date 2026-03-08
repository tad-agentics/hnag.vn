import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signInWithOAuth, profile, refreshProfile } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return;
    }
    await refreshProfile();
    onClose();
    if (onSuccess) onSuccess();
    else navigate(profile?.onboarding_completed ? '/app/home' : '/onboarding');
  };

  const handleGoogleLogin = () => {
    setAuthError(null);
    signInWithOAuth('google');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        {/* Close Button */}
        <button className="modal-close" onClick={onClose} aria-label="Đóng">
          <X className="w-4 h-4" strokeWidth={1.5} style={{ color: 'var(--color-text-secondary)' }} />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
               style={{ backgroundColor: 'var(--color-primary)' }}>
            <span className="text-white text-2xl font-semibold">HN</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 className="modal-title mb-2">Đăng nhập</h2>
        <p className="modal-subtitle mb-6">Đăng nhập để tiếp tục</p>

        {/* Social Login */}
        <button className="btn-social" onClick={handleGoogleLogin}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Tiếp tục với Google
        </button>

        {/* Divider */}
        <div className="divider">
          <span className="divider-text">hoặc dùng email</span>
        </div>

        {authError && (
          <p className="body-text-sm mb-2" style={{ color: 'var(--color-error)' }}>{authError}</p>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Mật khẩu"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <a href="#" className="link link-sm">
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-md btn-primary w-full">
            Đăng nhập
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center mt-4 body-text-sm">
          Chưa có tài khoản?{' '}
          <a href="#" className="link">
            Đăng ký
          </a>
        </p>

        {/* Terms */}
        <p className="text-center mt-4 meta-text-sm meta-text-disabled">
          Bằng cách đăng nhập, bạn đồng ý với{' '}
          <a href="#" className="link link-sm">
            Điều khoản sử dụng
          </a>
          {' '}và{' '}
          <a href="#" className="link link-sm">
            Chính sách bảo mật
          </a>
        </p>
      </div>
    </div>
  );
}