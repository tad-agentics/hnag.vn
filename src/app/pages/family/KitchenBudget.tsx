import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { SettingsLayout } from "../../components/SettingsLayout";

interface Equipment {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface SpecialMode {
  id: string;
  day: string;
  mode: string;
  maxTime: string;
}

export function KitchenBudgetScreen() {
  const [hasChanges, setHasChanges] = useState(false);
  
  // Budget state
  const [weekdayBudget, setWeekdayBudget] = useState(120000);
  const [weekendBudget, setWeekendBudget] = useState(200000);
  const [defaultServings, setDefaultServings] = useState(3);

  // Time state
  const [weekdayTime, setWeekdayTime] = useState(30);
  const [weekendTime, setWeekendTime] = useState(60);

  // Equipment state
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: 'stove', name: 'Bếp từ / bếp gas', description: '2 bếp đang dùng', enabled: true },
    { id: 'riceCooker', name: 'Nồi cơm điện', description: 'Tính vào thời gian nấu', enabled: true },
    { id: 'steamer', name: 'Nồi hấp', description: 'Mở thêm món hấp', enabled: true },
    { id: 'oven', name: 'Lò nướng / Air fryer', description: 'Mở thêm món nướng', enabled: false },
    { id: 'blender', name: 'Máy xay sinh tố', description: 'Cho món smoothie', enabled: false }
  ]);

  // Special modes state
  const [specialModes] = useState<SpecialMode[]>([
    { id: '1', day: 'Thứ 6', mode: 'Nhanh', maxTime: '≤ 20p' },
    { id: '2', day: 'Thứ 7', mode: 'Bình thường', maxTime: '≤ 60p' }
  ]);

  const toggleEquipment = (id: string) => {
    setEquipment(equipment.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
    setHasChanges(true);
  };

  const handleBudgetChange = (type: 'weekday' | 'weekend', value: number) => {
    if (type === 'weekday') {
      setWeekdayBudget(Math.max(0, value));
    } else {
      setWeekendBudget(Math.max(0, value));
    }
    setHasChanges(true);
  };

  const handleTimeChange = (type: 'weekday' | 'weekend', delta: number) => {
    if (type === 'weekday') {
      setWeekdayTime(Math.max(10, Math.min(180, weekdayTime + delta)));
    } else {
      setWeekendTime(Math.max(10, Math.min(180, weekendTime + delta)));
    }
    setHasChanges(true);
  };

  const handleServingsChange = (delta: number) => {
    setDefaultServings(Math.max(1, Math.min(10, defaultServings + delta)));
    setHasChanges(true);
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <SettingsLayout
      activeItem="kitchen"
      mobileTitle="Bếp & Ngân sách"
      desktopDescription="Quản lý thiết bị nhà bếp và ngân sách hàng ngày"
      hasChanges={hasChanges}
      onSave={() => { console.log('Save changes'); setHasChanges(false); }}
      onCancel={() => setHasChanges(false)}
    >
      <div className="px-4 lg:px-0 pt-6 pb-8">
        
        {/* Budget Section */}
        <div className="card p-6 mb-6">
          <p className="section-label section-label-secondary mb-5">Ngân sách</p>

          {/* Weekday Budget */}
          <div className="mb-4 flex items-center justify-between">
            <span className="body-text body-text-md" style={{ color: 'var(--color-text-primary)' }}>
              Ngày thường
            </span>
            <input
              type="text"
              value={formatCurrency(weekdayBudget)}
              onChange={(e) => {
                const value = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                handleBudgetChange('weekday', value);
              }}
              className="input text-right"
              style={{ width: '140px', height: 'auto', padding: '8px 16px', fontWeight: 600 }}
            />
          </div>

          {/* Weekend Budget */}
          <div className="mb-5 flex items-center justify-between">
            <span className="body-text body-text-md" style={{ color: 'var(--color-text-primary)' }}>
              Cuối tuần
            </span>
            <input
              type="text"
              value={formatCurrency(weekendBudget)}
              onChange={(e) => {
                const value = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                handleBudgetChange('weekend', value);
              }}
              className="input text-right"
              style={{ width: '140px', height: 'auto', padding: '8px 16px', fontWeight: 600 }}
            />
          </div>

          {/* Default Servings */}
          <div className="pt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
            <label className="field-label">Số người mặc định</label>
            <div className="flex items-center gap-3">
              <button onClick={() => handleServingsChange(-1)} className="stepper-btn">
                <Minus size={16} strokeWidth={1.5} />
              </button>
              <div className="stepper-value">{defaultServings}</div>
              <button onClick={() => handleServingsChange(1)} className="stepper-btn">
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Time Section */}
        <div className="card p-6 mb-6">
          <p className="section-label section-label-secondary mb-5">Thời gian nấu tối đa</p>

          {/* Weekday Time */}
          <div className="mb-4">
            <span className="field-label" style={{ fontSize: '15px', color: 'var(--color-text-primary)' }}>
              Ngày thường
            </span>
            <div className="flex items-center gap-3">
              <button onClick={() => handleTimeChange('weekday', -5)} className="stepper-btn">
                <Minus size={16} strokeWidth={1.5} />
              </button>
              <div className="stepper-value">{weekdayTime} phút</div>
              <button onClick={() => handleTimeChange('weekday', 5)} className="stepper-btn">
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Weekend Time */}
          <div>
            <span className="field-label" style={{ fontSize: '15px', color: 'var(--color-text-primary)' }}>
              Cuối tuần
            </span>
            <div className="flex items-center gap-3">
              <button onClick={() => handleTimeChange('weekend', -5)} className="stepper-btn">
                <Minus size={16} strokeWidth={1.5} />
              </button>
              <div className="stepper-value">{weekendTime} phút</div>
              <button onClick={() => handleTimeChange('weekend', 5)} className="stepper-btn">
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Equipment Section */}
        <div className="card p-6 mb-6">
          <p className="section-label section-label-secondary mb-5">Thiết bị bếp</p>

          {equipment.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-start justify-between py-3">
                <div className="flex-1">
                  <p style={{ fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    {item.name}
                  </p>
                  <p className="body-text-sm">{item.description}</p>
                </div>
                
                {/* Toggle Switch */}
                <button
                  onClick={() => toggleEquipment(item.id)}
                  className="toggle-switch ml-4"
                  data-checked={item.enabled ? "true" : "false"}>
                  <div className="toggle-knob" />
                </button>
              </div>
              
              {index < equipment.length - 1 && (
                <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Special Modes Section */}
        <div className="card p-6">
          <p className="section-label section-label-secondary mb-5">Chế độ đặc biệt theo ngày</p>

          {/* Table Header */}
          <div
            className="grid grid-cols-3 gap-3 pb-3 mb-3"
            style={{ borderBottom: '1px solid var(--color-border)' }}>
            <span className="meta-text" style={{ fontWeight: 500 }}>Ngày</span>
            <span className="meta-text" style={{ fontWeight: 500 }}>Chế độ</span>
            <span className="meta-text text-right" style={{ fontWeight: 500 }}>Thời gian</span>
          </div>

          {/* Special Mode Rows */}
          {specialModes.map((mode) => (
            <div
              key={mode.id}
              className="grid grid-cols-3 gap-3 py-3"
              style={{ borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-text-primary)' }}>{mode.day}</span>
              <span style={{ color: 'var(--color-text-primary)' }}>{mode.mode}</span>
              <span className="body-text-sm text-right">{mode.maxTime}</span>
            </div>
          ))}

          {/* Add Day Button */}
          <button
            onClick={() => {
              console.log('Add special mode');
              setHasChanges(true);
            }}
            className="btn-dashed mt-4">
            <Plus size={16} strokeWidth={1.5} />
            Thêm ngày
          </button>
        </div>
      </div>
    </SettingsLayout>
  );
}
