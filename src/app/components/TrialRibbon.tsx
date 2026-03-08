import { useNavigate } from "react-router";

interface TrialRibbonProps {
  daysRemaining: number;
}

export function TrialRibbon({ daysRemaining }: TrialRibbonProps) {
  const navigate = useNavigate();

  return (
    <div
      className="w-full flex items-center justify-between gap-3 px-4 py-3"
      style={{
        backgroundColor: 'var(--color-surface-warm)',
        borderBottom: '1px solid var(--color-border)'
      }}>
      
      {/* Copy */}
      <p
        className="flex-1"
        style={{
          fontSize: '13px',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          lineHeight: '1.5'
        }}>
        Còn <span style={{ fontWeight: 600 }}>{daysRemaining} ngày</span> dùng thử — khi sẵn sàng, giữ cho gia đình nhé
      </p>

      {/* Upgrade Button */}
      <button
        onClick={() => navigate('/app/paywall')}
        className="btn btn-primary rounded-full transition-all flex-shrink-0"
        style={{
          height: '36px',
          padding: '0 16px',
          whiteSpace: 'nowrap'
        }}>
        Nâng cấp
      </button>
    </div>
  );
}