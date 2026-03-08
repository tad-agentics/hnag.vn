import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthModal } from "../../components/AuthModal";
import bowlIcon from "@/assets/d62eff65d3aa0caeed60036623d2aecd9d25f653.png";

export function SplashScreen() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div 
      className="min-h-screen flex flex-col items-center px-6 py-12">
      
      {/* Vertical spacer - push content to center */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* App Icon */}
        <div 
          className="rounded-xl overflow-hidden mb-6"
          style={{ 
            width: '48px',
            height: '48px',
            border: '1.5px solid var(--color-border-strong)'
          }}>
          <img 
            src={bowlIcon} 
            alt="Hôm Nay Ăn Gì" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* App Name */}
        <h1 
          className="text-center mb-2"
          style={{ 
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: '1.2'
          }}>
          Hôm Nay Ăn Gì?
        </h1>

        {/* Tagline */}
        <p 
          className="text-center"
          style={{ 
            fontSize: '15px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6'
          }}>
          Trợ lý bếp biết<br />
          cả nhà bạn
        </p>
      </div>

      {/* CTA Buttons - stick to bottom */}
      <div className="w-full max-w-md space-y-3">
        {/* Primary CTA */}
        <button
          onClick={() => navigate('/onboarding/demo')}
          className="btn btn-lg btn-primary w-full inline-flex items-center justify-center gap-2">
          Bắt đầu nhé
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </button>

        {/* Secondary - Already have account */}
        <button
          onClick={() => setShowAuthModal(true)}
          className="btn btn-lg btn-ghost w-full">
          Đã có tài khoản
        </button>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}