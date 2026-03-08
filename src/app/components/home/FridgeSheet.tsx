import { Check, X, Search, Loader, Refrigerator } from "lucide-react";
import { BottomSheet } from "../BottomSheet";

interface FridgeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  nlpInput: string;
  onNLPInput: (text: string) => void;
  isParsing: boolean;
  nlpResults: { ingredient: string; confidence: number }[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  onApply: () => void;
}

export function FridgeSheet({
  isOpen,
  onClose,
  nlpInput,
  onNLPInput,
  isParsing,
  nlpResults,
  selectedIngredients,
  onToggleIngredient,
  onApply
}: FridgeSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxHeight="85vh"
      header={
        <>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <Refrigerator 
                size={24} 
                strokeWidth={1.5} 
                style={{ color: 'var(--color-primary)' }} 
              />
              <h2>Hôm nay tôi có...</h2>
            </div>
            <button
              onClick={onClose}
              className="modal-close"
              style={{ position: 'static' }}>
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          <p className="body-text-sm" style={{ marginBottom: '20px', lineHeight: '1.5' }}>
            Gõ hoặc chọn — app hiểu cả hai
          </p>
        </>
      }>

      {/* NLP Text Field */}
      <div className="relative mb-4">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
        </div>
        <input
          type="text"
          value={nlpInput}
          onChange={(e) => onNLPInput(e.target.value)}
          className="input pl-10 pr-10"
          placeholder="nửa con gà, cà chua, mấy quả trứng..."
          style={{
            height: 'auto',
            padding: '8px 40px 8px 40px',
            borderColor: 'var(--color-primary)',
            borderWidth: '1.5px',
            fontStyle: nlpInput ? 'normal' : 'italic'
          }}
        />
        {isParsing && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin">
              <Loader size={10} strokeWidth={2} style={{ color: 'var(--color-primary)' }} />
            </div>
          </div>
        )}
      </div>

      {/* NLP Result Row */}
      {nlpResults.length > 0 && !isParsing && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Check size={14} strokeWidth={2} style={{ color: 'var(--color-health)' }} />
            <span className="meta-text" style={{ fontWeight: 600 }}>Đã nhận ra:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {nlpResults.map((result) => {
              const isLowConfidence = result.confidence < 0.7;
              const isSelected = selectedIngredients.includes(result.ingredient);
              
              return (
                <button
                  key={result.ingredient}
                  onClick={() => onToggleIngredient(result.ingredient)}
                  className={`chip ${isLowConfidence ? '' : 'chip-filled'}`}
                  data-selected={isSelected ? "true" : "false"}
                  style={isLowConfidence ? {
                    backgroundColor: 'var(--color-warn-light)',
                    borderColor: 'var(--color-warn-border)',
                    color: 'var(--color-warn)',
                    fontSize: '12px'
                  } : { fontSize: '12px' }}>
                  {isLowConfidence && '? '}{result.ingredient}{isSelected && ' ✓'}
                </button>
              );
            })}
          </div>
          {nlpResults.some(r => r.confidence < 0.7) && (
            <p className="meta-text-sm" style={{ color: 'var(--color-warn)', marginTop: '6px' }}>
              Vàng = chưa chắc — tap để xác nhận hoặc bỏ qua
            </p>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="divider">
        <span className="divider-text" style={{ textTransform: 'lowercase' }}>
          hoặc chọn nhanh bên dưới
        </span>
      </div>

      {/* Chip Groups */}
      {[
        { label: 'THỊT · CÁ · HẢI SẢN', items: ['Thịt heo', 'Thịt gà', 'Thịt bò', 'Cá lóc', 'Cá hồi', 'Tôm'] },
        { label: 'RAU · CỦ · ĐẬU', items: ['Cà chua', 'Khoai tây', 'Bí đỏ', 'Cải xanh', 'Đậu hũ'] },
        { label: 'TRỨNG · KHÁC', items: ['Trứng gà', 'Trứng vịt'] }
      ].map((group) => (
        <div key={group.label} className="mb-5">
          <p className="section-label section-label-secondary mb-2" style={{ letterSpacing: '0.08em' }}>
            {group.label}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {group.items.map((ingredient) => {
              const isSelected = selectedIngredients.includes(ingredient);
              return (
                <button
                  key={ingredient}
                  onClick={() => onToggleIngredient(ingredient)}
                  className="chip chip-filled"
                  data-selected={isSelected ? "true" : "false"}>
                  {ingredient}{isSelected && ' ✓'}
                </button>
              );
            })}
            {group.label === 'TRỨNG · KHÁC' && (
              <button
                className="chip"
                style={{ border: '1px dashed var(--color-border)', gap: '4px' }}>
                <Search size={12} strokeWidth={1.5} />
                Thêm khác...
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Counter + CTA */}
      <div className="flex items-center justify-between mb-4">
        <span className="body-text-sm">
          Đã chọn <strong style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {selectedIngredients.length}
          </strong> nguyên liệu
        </span>
      </div>

      <button onClick={onApply} className="btn btn-primary btn-lg w-full">
        Áp dụng →
      </button>
    </BottomSheet>
  );
}
