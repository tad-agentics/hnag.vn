import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle } from "lucide-react";

export function PurchaseSuccessScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get plan from URL params or default to 12 months
  const planId = searchParams.get('plan') || '12months';
  
  // Plan data mapping
  const planData: Record<string, { label: string; price: string; expiryDate: string }> = {
    '6months': {
      label: '6 tháng',
      price: '990.000đ',
      expiryDate: '08/09/2026' // 6 months from today (March 8, 2026)
    },
    '12months': {
      label: '12 tháng',
      price: '1.690.000đ',
      expiryDate: '08/03/2027' // 12 months from today
    },
    'lifetime': {
      label: 'Trọn đời',
      price: '2.990.000đ',
      expiryDate: 'Không giới hạn'
    }
  };

  const currentPlan = planData[planId] || planData['12months'];
  const purchaseDate = '08/03/2026'; // Today's date

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full py-12">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: '88px',
              height: '88px',
              border: '2px solid var(--color-health)',
              backgroundColor: 'transparent'
            }}>
            <CheckCircle 
              size={44} 
              strokeWidth={2} 
              style={{ color: 'var(--color-health)' }} 
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
            lineHeight: '1.3',
            paddingLeft: '16px',
            paddingRight: '16px'
          }}>
          Từ hôm nay, gia đình được chăm sóc lâu dài hơn rồi.
        </h1>

        {/* Body */}
        <p
          className="text-center mb-8"
          style={{
            fontSize: '15px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.65'
          }}>
          Gói {currentPlan.label} đã kích hoạt
        </p>

        {/* Receipt Card */}
        <div 
          className="rounded-2xl p-6 mb-8"
          style={{
            backgroundColor: 'var(--color-surface-alt)',
            border: '1px solid var(--color-border)'
          }}>
          
          {/* Receipt Header */}
          <div 
            className="pb-4 mb-4"
            style={{
              borderBottom: '1px solid var(--color-border)'
            }}>
            <p
              className="section-label"
              style={{
                color: 'var(--color-text-secondary)',
                marginBottom: '8px'
              }}>
              Biên lai
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)'
              }}>
              Hôm Nay Ăn Gì? Premium
            </p>
          </div>

          {/* Receipt Details */}
          <div className="flex flex-col gap-3">
            
            {/* Plan */}
            <div className="flex items-start justify-between">
              <span
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)'
                }}>
                Gói
              </span>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  textAlign: 'right'
                }}>
                {currentPlan.label}
              </span>
            </div>

            {/* Payment */}
            <div className="flex items-start justify-between">
              <span
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)'
                }}>
                Thanh toán
              </span>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  textAlign: 'right'
                }}>
                {currentPlan.price}
              </span>
            </div>

            {/* Purchase Date */}
            <div className="flex items-start justify-between">
              <span
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)'
                }}>
                Ngày mua
              </span>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  textAlign: 'right'
                }}>
                {purchaseDate}
              </span>
            </div>

            {/* Expiry */}
            <div className="flex items-start justify-between">
              <span
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)'
                }}>
                Hết hạn
              </span>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  textAlign: 'right'
                }}>
                {currentPlan.expiryDate}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/app/home')}
          className="btn btn-primary w-full rounded-full transition-all"
          style={{
            height: '52px'
          }}>
          Về nhà với gia đình →
        </button>

        {/* Legal Footer */}
        <div className="text-center">
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-text-disabled)',
              lineHeight: '1.6'
            }}>
            Biên lai đã gửi qua email
          </p>
        </div>
      </div>
    </div>
  );
}