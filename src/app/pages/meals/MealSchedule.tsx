import { useState } from "react";
import { Sun, CloudSun, Moon } from "lucide-react";
import { SettingsLayout } from "../../components/SettingsLayout";

interface MealSchedule {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  time: string;
  activeDays: string[];
  suggestedTime?: string;
}

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function MealScheduleScreen() {
  const [hasChanges, setHasChanges] = useState(false);

  const [meals, setMeals] = useState<MealSchedule[]>([
    {
      id: 'breakfast',
      name: 'Bữa sáng',
      icon: <Sun size={20} strokeWidth={1.5} style={{ color: 'currentColor' }} />,
      enabled: false,
      time: '7:00',
      activeDays: [],
      suggestedTime: 'Gợi ý từ 5:30 - 9:00'
    },
    {
      id: 'lunch',
      name: 'Bữa trưa',
      icon: <CloudSun size={20} strokeWidth={1.5} style={{ color: 'currentColor' }} />,
      enabled: true,
      time: '10:30',
      activeDays: ['T2', 'T3', 'T4', 'T5', 'T6']
    },
    {
      id: 'dinner',
      name: 'Bữa tối',
      icon: <Moon size={20} strokeWidth={1.5} style={{ color: 'currentColor' }} />,
      enabled: true,
      time: '17:00',
      activeDays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
    }
  ]);

  const toggleMeal = (id: string) => {
    setMeals(meals.map(meal => 
      meal.id === id 
        ? { ...meal, enabled: !meal.enabled, activeDays: !meal.enabled ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] : [] }
        : meal
    ));
    setHasChanges(true);
  };

  const updateMealTime = (id: string, time: string) => {
    setMeals(meals.map(meal => 
      meal.id === id ? { ...meal, time } : meal
    ));
    setHasChanges(true);
  };

  const toggleDay = (mealId: string, day: string) => {
    setMeals(meals.map(meal => {
      if (meal.id === mealId) {
        const activeDays = meal.activeDays.includes(day)
          ? meal.activeDays.filter(d => d !== day)
          : [...meal.activeDays, day];
        return { ...meal, activeDays };
      }
      return meal;
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Save meal schedules:', meals);
    setHasChanges(false);
  };

  return (
    <SettingsLayout
      activeItem="schedule"
      mobileTitle="Lịch bữa ăn"
      desktopDescription="Chọn các bữa ăn kế hoạch — mỗi bữa có lịch riêng để nhắc nhở"
      hasChanges={hasChanges}
      onSave={handleSave}
      onCancel={() => setHasChanges(false)}
    >
      <div className="px-4 lg:px-0 pt-6 pb-8">
        <p className="section-label section-label-secondary mb-4">Lịch bữa ăn trong ngày</p>

        <div className="space-y-4">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: meal.enabled ? '2px solid var(--color-text-primary)' : '1px solid var(--color-border)'
              }}>
              
              {/* Header with toggle */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2">
                  <span style={{ fontSize: '20px' }}>{meal.icon}</span>
                  <div>
                    <h3 style={{
                      color: meal.enabled ? 'var(--color-text-primary)' : 'var(--color-text-disabled)',
                      marginBottom: '2px'
                    }}>
                      {meal.name}
                    </h3>
                    <p className="body-text-sm">
                      {meal.enabled ? `Nhắc lúc ${meal.time}` : meal.suggestedTime}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleMeal(meal.id)}
                  className="toggle-switch"
                  data-checked={meal.enabled ? "true" : "false"}>
                  <div className="toggle-knob" />
                </button>
              </div>

              {/* Content when disabled */}
              {!meal.enabled && (
                <div
                  className="rounded-lg py-3 text-center"
                  style={{ backgroundColor: 'var(--color-surface-alt)' }}>
                  <p className="body-text-sm" style={{ color: 'var(--color-text-disabled)' }}>
                    Bật để cài đặt thời gian nhắc
                  </p>
                </div>
              )}

              {/* Content when enabled */}
              {meal.enabled && (
                <>
                  {/* Time Picker */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="body-text body-text-md">Nhắc lúc</span>
                    <input
                      type="time"
                      value={meal.time}
                      onChange={(e) => updateMealTime(meal.id, e.target.value)}
                      className="input"
                      style={{ width: 'auto', height: 'auto', padding: '8px 16px', fontWeight: 600, fontSize: '17px' }}
                    />
                  </div>

                  {/* Day Selection */}
                  <div>
                    <p className="body-text-sm mb-3" style={{ fontWeight: 500 }}>
                      Bật để nhắc ngày
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map((day) => {
                        const isActive = meal.activeDays.includes(day);
                        return (
                          <button
                            key={day}
                            onClick={() => toggleDay(meal.id, day)}
                            className="rounded-full transition-all"
                            style={{
                              width: '44px',
                              height: '44px',
                              backgroundColor: isActive ? 'var(--color-text-primary)' : 'transparent',
                              border: isActive ? '2px solid var(--color-text-primary)' : '2px solid var(--color-border)',
                              fontSize: '15px',
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? '#ffffff' : 'var(--color-text-disabled)',
                              cursor: 'pointer'
                            }}>
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </SettingsLayout>
  );
}