import { useState } from "react";
import { ChevronRight, Plus, GripVertical, Sun, CloudSun, Moon, CookingPot } from "lucide-react";
import { SettingsLayout } from "../../components/SettingsLayout";
import type { MealType } from "../../utils/types";

type PresetType = 'basic' | 'standard' | 'full';

interface Slot {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface MealStructure {
  preset: PresetType;
  slots: Slot[];
}

const PRESETS = {
  basic: { label: 'Cơ bản 2 món', slots: 2 },
  standard: { label: 'Tiêu chuẩn 4 món', slots: 4 },
  full: { label: 'Đầy đủ 5 món', slots: 5 }
};

const DEFAULT_SLOTS: Record<number, Slot> = {
  1: { id: '1', name: 'Slot 1', description: 'Món mặn (thịt/cá)', category: 'protein' },
  2: { id: '2', name: 'Slot 2', description: 'Món mặn (trứng/đậu)', category: 'protein' },
  3: { id: '3', name: 'Slot 3', description: 'Món canh / súp', category: 'soup' },
  4: { id: '4', name: 'Slot 4', description: 'Rau / củ', category: 'vegetable' },
  5: { id: '5', name: 'Slot 5', description: 'Rau luộc / xào', category: 'vegetable' }
};

export function MealStructureScreen() {
  const [activeMeal, setActiveMeal] = useState<MealType>('dinner');
  const [hasChanges, setHasChanges] = useState(false);

  const [structures, setStructures] = useState<Record<MealType, MealStructure>>({
    breakfast: {
      preset: 'basic',
      slots: [DEFAULT_SLOTS[1], DEFAULT_SLOTS[2]]
    },
    lunch: {
      preset: 'standard',
      slots: [DEFAULT_SLOTS[1], DEFAULT_SLOTS[2], DEFAULT_SLOTS[3], DEFAULT_SLOTS[4]]
    },
    dinner: {
      preset: 'standard',
      slots: [DEFAULT_SLOTS[1], DEFAULT_SLOTS[2], DEFAULT_SLOTS[3], DEFAULT_SLOTS[4]]
    }
  });

  const currentStructure = structures[activeMeal];

  const handlePresetChange = (preset: PresetType) => {
    const slotCount = PRESETS[preset].slots;
    const newSlots = Array.from({ length: slotCount }, (_, i) => DEFAULT_SLOTS[i + 1]);
    
    setStructures({
      ...structures,
      [activeMeal]: { preset, slots: newSlots }
    });
    setHasChanges(true);
  };

  const handleAddSlot = () => {
    if (currentStructure.slots.length >= 6) return;
    
    const newSlotId = (currentStructure.slots.length + 1).toString();
    const newSlot: Slot = {
      id: newSlotId,
      name: `Slot ${newSlotId}`,
      description: 'Món mặn / rau',
      category: 'other'
    };

    setStructures({
      ...structures,
      [activeMeal]: {
        ...currentStructure,
        slots: [...currentStructure.slots, newSlot]
      }
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Save meal structures:', structures);
    setHasChanges(false);
  };

  const getMealLabel = (meal: MealType): string => {
    switch (meal) {
      case 'breakfast': return 'Sáng';
      case 'lunch': return 'Trưa';
      case 'dinner': return 'Tối';
    }
  };

  const getMealIcon = (meal: MealType): React.ReactNode => {
    switch (meal) {
      case 'breakfast': return <Sun size={18} strokeWidth={1.5} />;
      case 'lunch': return <CloudSun size={18} strokeWidth={1.5} />;
      case 'dinner': return <Moon size={18} strokeWidth={1.5} />;
    }
  };

  return (
    <SettingsLayout
      activeItem="structure"
      mobileTitle="Cấu trúc bữa ăn"
      desktopDescription="Tuỳ chỉnh số món cho mỗi bữa — mỗi slot là một lần swipe"
      hasChanges={hasChanges}
      onSave={handleSave}
      onCancel={() => setHasChanges(false)}
    >
      <div className="px-4 lg:px-0 pt-4 pb-8">
        
        {/* Meal Tabs */}
        <div
          className="flex items-center justify-center gap-1 mb-6"
          style={{ borderBottom: '1px solid var(--color-border)' }}>
          {(['dinner', 'lunch', 'breakfast'] as MealType[]).map((meal) => {
            const isActive = activeMeal === meal;
            return (
              <button
                key={meal}
                onClick={() => setActiveMeal(meal)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-all"
                style={{
                  fontSize: '15px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderBottom: isActive ? '3px solid var(--color-text-primary)' : '3px solid transparent',
                  marginBottom: '-1px'
                }}>
                <span style={{ fontSize: '18px' }}>{getMealIcon(meal)}</span>
                {getMealLabel(meal)}
              </button>
            );
          })}
        </div>

        {/* Meal Summary */}
        <p className="body-text body-text-md mb-5">
          Bữa {getMealLabel(activeMeal).toLowerCase()} · 4 người · {currentStructure.slots.length} món
        </p>

        {/* Preset Selection */}
        <div className="mb-6">
          <p className="section-label section-label-secondary mb-3">Preset cơ sở</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PRESETS) as PresetType[]).map((preset) => {
              const isActive = currentStructure.preset === preset;
              return (
                <button
                  key={preset}
                  onClick={() => handlePresetChange(preset)}
                  className="chip"
                  data-selected={isActive ? "true" : "false"}
                  style={{ fontSize: '15px', border: isActive ? '2px solid var(--color-primary)' : '2px solid var(--color-border)' }}>
                  {PRESETS[preset].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slot List */}
        <div className="mb-6">
          <p className="section-label section-label-secondary mb-3">Cấu trúc bữa ăn (từ trên xuống)</p>

          <div className="space-y-2 mb-4">
            {currentStructure.slots.map((slot) => (
              <div
                key={slot.id}
                className="rounded-xl p-4 flex items-center gap-3"
                style={{
                  backgroundColor: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)'
                }}>
                
                {/* Drag Handle */}
                <div style={{ color: 'var(--color-text-disabled)', cursor: 'grab' }}>
                  <GripVertical size={20} strokeWidth={1.5} />
                </div>

                {/* Slot Info */}
                <div className="flex-1">
                  <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                    {slot.name}
                  </p>
                  <p className="body-text-sm">{slot.description}</p>
                </div>

                {/* Edit Arrow */}
                <button
                  onClick={() => console.log('Edit slot:', slot.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-disabled)',
                    padding: '4px'
                  }}>
                  <ChevronRight size={20} strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Slot Button */}
          {currentStructure.slots.length < 6 && (
            <button onClick={handleAddSlot} className="btn-dashed">
              <Plus size={16} strokeWidth={1.5} />
              Thêm slot
            </button>
          )}

          {/* Reorder Hint */}
          <p className="body-text-sm text-center mt-3" style={{ color: 'var(--color-text-disabled)' }}>
            Kéo để sắp xếp lại thứ tự
          </p>
        </div>

        {/* Starch Note */}
        <div className="card p-5">
          <div className="flex items-start gap-3">
            <div
              className="rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: 'var(--color-surface-alt)',
                border: '1px solid var(--color-border)'
              }}>
              <CookingPot size={20} strokeWidth={1.5} style={{ color: 'var(--color-text-disabled)' }} />
            </div>
            <div className="flex-1">
              <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Cơm / Tinh bột
              </p>
              <p className="body-text-sm" style={{ lineHeight: '1.6' }}>
                Cơm trắng tự động — không cần swipe
              </p>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}