import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Lock, Star } from "lucide-react";
import { BottomNav } from "../../components/BottomNav";

type PlanOption = '6months' | '12months' | 'lifetime';

export function PaywallScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Map query param plan names to internal plan IDs
  const getInitialPlan = (): PlanOption => {
    const planParam = searchParams.get('plan');
    if (planParam === 'yearly' || planParam === '12months') return '12months';
    if (planParam === '6months') return '6months';
    if (planParam === 'lifetime') return 'lifetime';
    return '12months'; // default
  };

  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(getInitialPlan);

  // Mock personalized value data
  const totalSuggestions = 127;
  const healthFilteredDishes = 43;

  const plans = [
    {
      id: '6months' as PlanOption,
      label: '6 tháng',
      price: '990k',
      pricePerDay: '5.500đ',
      badge: null
    },
    {
      id: '12months' as PlanOption,
      label: '12 tháng',
      price: '1.690k',
      pricePerDay: '4.600đ',
      badge: 'PHỔ BIẾN'
    },
    {
      id: 'lifetime' as PlanOption,
      label: 'Trọn đời',
      price: '2.990k',
      pricePerDay: '—',
      badge: 'DÙNG MÃI MÃI'
    }
  ];

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  const handlePurchase = () => {
    console.log('Purchase plan:', selectedPlan);
    // Navigate to success screen with plan parameter
    navigate(`/app/purchase-success?plan=${selectedPlan}`);
  };

  return (
    <div 
      className="min-h-screen pb-24 flex flex-col">
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 pt-12 pb-8">
          
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'var(--color-surface-alt)',
                border: '1px solid var(--color-border)'
              }}>
              <Lock 
                size={40} 
                strokeWidth={1.5} 
                style={{ color: 'var(--color-text-disabled)' }} 
              />
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-center mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: '1.2'
            }}>
            Hết 14 ngày dùng thử miễn phí
          </h1>

          {/* Value Block */}
          <div 
            className="rounded-2xl p-5 mb-6"
            style={{
              backgroundColor: '#f0faf5',
              border: '1px solid var(--color-health-border)'
            }}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: '15px',
                    color: 'var(--color-text-secondary)'
                  }}>
                  Gợi ý món cho gia đình
                </span>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                  {totalSuggestions} món
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: '15px',
                    color: 'var(--color-text-secondary)'
                  }}>
                  Món tự lọc vì bệnh lý Ba, Mẹ
                </span>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                  {healthFilteredDishes} món
                </span>
              </div>
            </div>
          </div>

          {/* Price Hero */}
          <div 
            className="rounded-2xl px-6 py-6 mb-6"
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
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                Tiếp tục từ
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-3">
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '52px',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    lineHeight: '1'
                  }}>
                  4.600đ
                </span>
              </div>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.5'
                }}>
                mỗi ngày · rẻ hơn 1 ly trà đá
              </p>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="flex flex-col gap-3 mb-6">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className="relative rounded-2xl px-5 py-4 transition-all text-left"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-surface)',
                    border: isSelected 
                      ? '2px solid var(--color-primary)' 
                      : '2px solid var(--color-border)',
                    cursor: 'pointer'
                  }}>
                  
                  {/* Badge */}
                  {plan.badge && (
                    <div
                      className="absolute rounded-full px-3 py-1"
                      style={{
                        top: '-10px',
                        right: '16px',
                        backgroundColor: plan.id === 'lifetime' ? 'var(--color-gold)' : 'var(--color-warn)',
                        border: `1px solid ${plan.id === 'lifetime' ? 'var(--color-gold)' : 'var(--color-warn)'}`,
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>
                      {plan.badge}
                    </div>
                  )}

                  {/* Radio indicator */}
                  <div className="flex items-center gap-4">
                    <div
                      className="rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        width: '24px',
                        height: '24px',
                        border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        backgroundColor: 'var(--color-surface)'
                      }}>
                      {isSelected && (
                        <div
                          className="rounded-full"
                          style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: 'var(--color-primary)'
                          }}
                        />
                      )}
                    </div>

                    {/* Plan Info */}
                    <div className="flex-1">
                      <p
                        style={{
                          fontSize: '17px',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          marginBottom: '4px'
                        }}>
                        {plan.label}
                      </p>
                      <p
                        style={{
                          fontSize: '13px',
                          color: 'var(--color-text-secondary)'
                        }}>
                        {plan.pricePerDay !== '—' && `${plan.pricePerDay}/ngày · `}Trả một lần
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '24px',
                          fontWeight: 600,
                          color: 'var(--color-primary)',
                          lineHeight: '1'
                        }}>
                        {plan.price}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Social Proof Quote */}
          <div 
            className="rounded-2xl p-5 mb-6"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}>
            {/* 5 Stars */}
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star 
                  key={i}
                  size={16} 
                  fill="var(--color-gold)"
                  strokeWidth={0}
                  style={{ color: 'var(--color-gold)' }}
                />
              ))}
            </div>

            {/* Quote */}
            <p
              style={{
                fontSize: '15px',
                color: 'var(--color-text-primary)',
                lineHeight: '1.65',
                marginBottom: '8px',
                fontStyle: 'italic'
              }}>
              "Không còn phải nghĩ chiều nay ăn gì nữa"
            </p>

            {/* Attribution */}
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)'
              }}>
              — Lan Anh, TP.HCM
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handlePurchase}
            className="btn btn-primary w-full rounded-full transition-all mb-4"
            style={{
              height: '52px'
            }}>
            Mua gói {selectedPlanData?.label} — trả một lần
          </button>

          {/* Price Subtext */}
          <p
            className="text-center mb-6"
            style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.5'
            }}>
            {selectedPlanData?.price} · không tự gia hạn
          </p>

          {/* Legal Footer */}
          <div 
            className="text-center pt-4"
            style={{
              borderTop: '1px solid var(--color-border)'
            }}>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--color-text-disabled)',
                lineHeight: '1.6'
              }}>
              Không tự gia hạn · thanh toán qua PayOS
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - S-10 + S-11 still accessible */}
      <BottomNav />
    </div>
  );
}