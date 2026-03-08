import { useNavigate } from "react-router";
import { Check } from "lucide-react";

interface SoftNudgeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  daysRemaining: number;
  totalDays: number;
  mealsCompleted: number;
}

export function SoftNudgeModal({ 
  isOpen, 
  onDismiss, 
  daysRemaining,
  totalDays,
  mealsCompleted 
}: SoftNudgeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const pricingOptions = [
    {
      id: 'lifetime',
      label: 'Trọn đời',
      price: '2.990k',
      popular: false
    },
    {
      id: '12months',
      label: '12 tháng',
      price: '1.690k',
      popular: true
    },
    {
      id: '6months',
      label: '6 tháng',
      price: '990k',
      popular: false
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onDismiss}>
      
      {/* Overlay */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: 'rgba(30, 20, 16, 0.5)' 
        }}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-md rounded-3xl p-8"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-overlay)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}>
        
        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: '12px',
            lineHeight: '1.2',
            textAlign: 'center'
          }}>
          Còn {daysRemaining} ngày dùng thử
        </h2>

        {/* Body */}
        <p
          style={{
            fontSize: '15px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.65',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
          {totalDays} ngày qua — gia đình có bữa đàng hoàng {mealsCompleted} lần. Không phải ngẫu nhiên đâu.
        </p>

        {/* Price Anchor */}
        <div 
          className="rounded-2xl px-6 py-5 mb-6"
          style={{
            backgroundColor: 'var(--color-surface-alt)',
            border: '1px solid var(--color-border)'
          }}>
          <div className="text-center">
            <p
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
              Chỉ từ
            </p>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '48px',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  lineHeight: '1'
                }}>
                7.000đ
              </span>
            </div>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.5'
              }}>
              mỗi ngày · rẻ hơn 1 ly trà đá
            </p>
          </div>
        </div>

        {/* Pricing Options */}
        <div className="flex flex-col gap-3 mb-6">
          {pricingOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                console.log('Selected plan:', option.id);
                navigate('/app/paywall?plan=' + option.id);
              }}
              className="relative rounded-2xl px-5 py-4 transition-all text-left hover-bg-primary-light hover-border-strong"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '2px solid var(--color-border)',
                cursor: 'pointer'
              }}>
              
              {/* Popular Badge */}
              {option.popular && (
                <div
                  className="absolute rounded-full px-3 py-1"
                  style={{
                    top: '-10px',
                    right: '16px',
                    backgroundColor: 'var(--color-warn)',
                    border: '1px solid var(--color-warn)',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                  PHỔ BIẾN
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      marginBottom: '4px'
                    }}>
                    {option.label}
                  </p>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)'
                    }}>
                    Trả một lần
                  </p>
                </div>
                <div className="text-right">
                  <p
                    style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      lineHeight: '1'
                    }}>
                    {option.price}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/app/paywall')}
          className="w-full rounded-full transition-all mb-4 btn btn-primary"
          style={{
            height: '52px'
          }}>
          Chọn gói — trả một lần →
        </button>

        {/* Dismiss Link */}
        <div className="text-center">
          <button
            onClick={onDismiss}
            className="transition-colors hover-text-accent"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '8px'
            }}>
            Nhắc tôi sau
          </button>
        </div>
      </div>
    </div>
  );
}