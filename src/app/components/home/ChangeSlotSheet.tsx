import { Check, X, Soup, Drumstick, Leaf, Salad } from "lucide-react";
import { BottomSheet } from "../BottomSheet";

interface ChangeSlotSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlotType: string;
  currentSlotName: string;
  onChangeSlot: (newType: string) => void;
  onDeleteSlot: () => void;
}

interface SlotOption {
  type: string;
  name: string;
  icon: React.ReactNode;
}

const slotOptions: SlotOption[] = [
  { type: 'soup', name: 'Canh/Súp', icon: <Soup size={20} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} /> },
  { type: 'protein', name: 'Món mặn thêm', icon: <Drumstick size={20} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} /> },
  { type: 'vegetable', name: 'Rau/Củ', icon: <Leaf size={20} strokeWidth={1.5} style={{ color: 'var(--color-health)' }} /> },
  { type: 'salad', name: 'Gỏi/Nộm', icon: <Salad size={20} strokeWidth={1.5} style={{ color: 'var(--color-health)' }} /> },
];

export function ChangeSlotSheet({
  isOpen,
  onClose,
  currentSlotType,
  currentSlotName,
  onChangeSlot,
  onDeleteSlot
}: ChangeSlotSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Đổi slot này thành loại khác?"
      subtitle="Swipe deck sẽ cập nhật ngay"
    >
      {/* Slot Type Options */}
      <div className="flex flex-col gap-2 mb-4">
        {slotOptions.map((option) => {
          const isActive = option.type === currentSlotType;
          
          return (
            <button
              key={option.type}
              onClick={() => {
                if (!isActive) {
                  onChangeSlot(option.type);
                }
              }}
              className="flex items-center gap-3 p-4 rounded-xl transition-all text-left"
              style={{
                border: isActive 
                  ? '1.5px solid var(--color-primary)' 
                  : '1px solid var(--color-border)',
                backgroundColor: isActive 
                  ? 'var(--color-primary-light)' 
                  : 'transparent',
                cursor: isActive ? 'default' : 'pointer'
              }}>
              <span style={{ fontSize: '20px' }}>{option.icon}</span>
              <span
                style={{
                  flex: 1,
                  fontWeight: isActive ? 600 : 500,
                  color: 'var(--color-text-primary)'
                }}>
                {option.name}
              </span>
              {isActive && (
                <Check 
                  size={18} 
                  strokeWidth={2} 
                  style={{ color: 'var(--color-primary)' }} 
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Delete Option */}
      <button
        onClick={() => {
          onDeleteSlot();
          onClose();
        }}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl mb-3 transition-all"
        style={{
          backgroundColor: 'var(--color-error-light)',
          border: '1px solid #F0C0BC',
          fontWeight: 600,
          color: 'var(--color-error)'
        }}>
        <X size={16} strokeWidth={2} />
        Bỏ slot này luôn
      </button>

      {/* Cancel Button */}
      <button onClick={onClose} className="btn btn-ghost btn-lg w-full">
        Huỷ — giữ nguyên {currentSlotName}
      </button>
    </BottomSheet>
  );
}