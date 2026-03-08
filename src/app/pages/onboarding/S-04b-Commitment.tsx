import { useNavigate } from "react-router";
import { Brain, Calendar, Star, Building2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { completeOnboarding } from "../../lib/onboarding";

export function CommitmentScreen() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const handleStartTrial = async () => {
    localStorage.setItem('onboarding_complete', 'true');
    if (user) {
      try {
        await completeOnboarding(user.id);
        await refreshProfile();
      } catch (_) {}
    }
    navigate('/app/home');
  };

  return (
    <div 
      className="min-h-screen flex flex-col px-4 py-12">
      
      <div className="flex-1 max-w-md mx-auto w-full flex flex-col">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          {/* Brain Icon */}
          <div 
            className="inline-flex items-center justify-center mb-6"
            style={{ color: 'var(--color-primary)' }}>
            <Brain size={32} strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h1 
            className="mb-3"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: '1.3'
            }}>
            App sẽ học về gia đình bạn
          </h1>

          {/* Subtitle */}
          <p 
            style={{ 
              fontSize: '15px',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.6'
            }}>
            Càng dùng lâu — càng hiểu bạn hơn
          </p>
        </div>

        {/* Milestones */}
        <div className="space-y-4 mb-8">
          
          {/* Milestone 1: Today */}
          <div 
            className="p-4 rounded-2xl flex gap-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}>
            <div 
              className="flex-shrink-0 flex items-center justify-center rounded-full"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--color-surface-alt)'
              }}>
              <Calendar size={20} strokeWidth={1.5} style={{ color: 'var(--color-text-secondary)' }} />
            </div>
            <div className="flex-1">
              <h3 
                className="mb-1"
                style={{
                  fontSize: '17px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)'
                }}>
                Hôm nay
              </h3>
              <p 
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6'
                }}>
                Gợi ý dựa trên thông tin vừa nhập. Chính xác khoảng 70% — hoàn toàn bình thường.
              </p>
            </div>
          </div>

          {/* Milestone 2: After 7 days */}
          <div 
            className="p-4 rounded-2xl flex gap-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-strong)'
            }}>
            <div 
              className="flex-shrink-0 flex items-center justify-center rounded-full"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--color-surface-alt)'
              }}>
              <Calendar size={20} strokeWidth={1.5} style={{ color: 'var(--color-text-secondary)' }} />
            </div>
            <div className="flex-1">
              <h3 
                className="mb-1"
                style={{
                  fontSize: '17px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)'
                }}>
                Sau 7 ngày
              </h3>
              <p 
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6'
                }}>
                App nhớ thói quen, món đã chọn, món bị bỏ qua. Gợi ý đạt ~85%.
              </p>
            </div>
          </div>

          {/* Milestone 3: After 30 days - Highlighted */}
          <div 
            className="p-4 rounded-2xl flex gap-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '2px solid var(--color-text-primary)'
            }}>
            <div 
              className="flex-shrink-0 flex items-center justify-center rounded-full"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--color-text-primary)'
              }}>
              <Star size={20} strokeWidth={1.5} style={{ color: '#ffffff' }} fill="#ffffff" />
            </div>
            <div className="flex-1">
              <h3 
                className="mb-1"
                style={{
                  fontSize: '17px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)'
                }}>
                Sau 30 ngày
              </h3>
              <p 
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6'
                }}>
                App hiểu gia đình bạn hơn bất kỳ công cụ nào — gợi ý như người thân trong nhà.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div 
          className="p-4 rounded-2xl flex gap-3 mb-8"
          style={{
            backgroundColor: '#FFF8F0',
            border: '1px solid #F0D8B0'
          }}>
          <div className="flex-shrink-0">
            <Building2 size={20} strokeWidth={1.5} style={{ color: 'var(--color-text-secondary)' }} />
          </div>
          <p 
            style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.7'
            }}>
            Dữ liệu dinh dưỡng theo <strong style={{ fontWeight: 600 }}>Bảng Thành Phần Thực Phẩm Việt Nam</strong> — Viện Dinh Dưỡng Quốc Gia (Bộ Y tế). Constraint bệnh lý không để AI tự suy luận.
          </p>
        </div>

        {/* Spacer to push CTA to bottom */}
        <div className="flex-1" />

        {/* CTA Section */}
        <div className="space-y-3">
          {/* Primary CTA */}
          <button
            onClick={handleStartTrial}
            className="w-full py-4 rounded-full text-white font-semibold transition-all hover-bg-dark"
            style={{
              backgroundColor: 'var(--color-text-primary)',
              fontSize: '15px',
              border: 'none',
              transitionDuration: 'var(--dur-fast)'
            }}>
            Bắt đầu 14 ngày dùng thử →
          </button>

          {/* Legal Text */}
          <p 
            className="text-center"
            style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.5'
            }}>
            Không cần thẻ tín dụng · Mua 1 lần, dùng mãi
          </p>
        </div>
      </div>
    </div>
  );
}