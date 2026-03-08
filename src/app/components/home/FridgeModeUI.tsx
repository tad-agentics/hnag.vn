import { Refrigerator } from "lucide-react";

interface FridgeModeUIProps {
  isActive: boolean;
  selectedIngredients: string[];
  onToggle: () => void;
  tier0Count?: number;
  tier1Count?: number;
}

export function FridgeModeUI({ 
  isActive, 
  selectedIngredients, 
  onToggle,
  tier0Count = 0,
  tier1Count = 0
}: FridgeModeUIProps) {
  // Show up to 5 ingredients
  const displayIngredients = selectedIngredients.slice(0, 5);
  const ingredientText = displayIngredients.join(' · ');
  
  return (
    <>
      {/* Fridge Toggle */}
      <div 
        className="px-4 py-3 rounded-lg mb-4"
        style={{
          backgroundColor: isActive ? 'var(--color-health-light)' : 'var(--color-surface-alt)',
          border: isActive ? '1px solid var(--color-health-border)' : '1px solid var(--color-border)',
          transition: 'all 250ms ease'
        }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Refrigerator 
              size={20} 
              strokeWidth={1.5} 
              style={{ color: isActive ? 'var(--color-health)' : '#999' }} 
            />
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '2px'
                }}>
                {isActive ? (
                  <span style={{ color: 'var(--color-health)' }}>
                    Tủ lạnh: BẬT
                  </span>
                ) : (
                  'Tủ lạnh hôm nay'
                )}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)'
                }}>
                {isActive && selectedIngredients.length > 0 ? (
                  ingredientText
                ) : (
                  'Chọn nguyên liệu → app ưu tiên món nấu được ngay'
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="rounded-full transition-all"
            style={{
              width: '44px',
              height: '24px',
              backgroundColor: isActive ? 'var(--color-primary)' : '#D0D0D0',
              position: 'relative'
            }}>
            <div
              className="absolute top-1 rounded-full transition-all"
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: 'white',
                left: isActive ? '26px' : '2px',
                transitionDuration: 'var(--dur-fast)'
              }}
            />
          </button>
        </div>
      </div>

      {/* Result Count - only show when fridge mode active */}
      {isActive && (tier0Count > 0 || tier1Count > 0) && (
        <div 
          className="px-4 py-2 mb-4 text-center"
          style={{
            backgroundColor: 'transparent'
          }}>
          <span
            style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)'
            }}>
            {tier0Count > 0 && (
              <>
                <strong style={{ fontWeight: 600, color: 'var(--color-health)' }}>
                  {tier0Count}
                </strong> món nấu được ngay
              </>
            )}
            {tier0Count > 0 && tier1Count > 0 && ' · '}
            {tier1Count > 0 && (
              <>
                <strong style={{ fontWeight: 600, color: 'var(--color-warn)' }}>
                  {tier1Count}
                </strong> món mua thêm ít
              </>
            )}
          </span>
        </div>
      )}
    </>
  );
}