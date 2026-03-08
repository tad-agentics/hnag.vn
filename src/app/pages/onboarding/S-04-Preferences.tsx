import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { saveUserSettingsFromOnboarding } from "../../lib/onboarding";
import { OnboardingLayout } from "../../components/OnboardingLayout";

type CookingTime = 'under20' | '20to40' | 'over40';
type Budget = 'under80' | '80to150' | 'over150';
type CookingFrequency = 'often' | 'order' | 'depends';

interface UserHabits {
  cookingTime: CookingTime;
  budget: Budget;
  cookingFrequency: CookingFrequency;
}

const cookTimeMap: Record<CookingTime, number> = { under20: 20, '20to40': 30, over40: 60 };
const budgetMap: Record<Budget, number> = { under80: 80000, '80to150': 120000, over150: 200000 };

export function PreferencesScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [cookingTime, setCookingTime] = useState<CookingTime>('20to40');
  const [budget, setBudget] = useState<Budget>('80to150');
  const [cookingFrequency, setCookingFrequency] = useState<CookingFrequency>('often');

  const handleComplete = async () => {
    const habits: UserHabits = { cookingTime, budget, cookingFrequency };
    localStorage.setItem('userHabits', JSON.stringify(habits));
    if (user) {
      try {
        await saveUserSettingsFromOnboarding(user.id, {
          cookTimeWeekdayMin: cookTimeMap[cookingTime],
          cookTimeWeekendMin: cookingTime === 'over40' ? 60 : 30,
          budgetWeekdayVnd: budgetMap[budget],
          budgetWeekendVnd: Math.round(budgetMap[budget] * 1.5),
        });
      } catch (_) {}
    }
    navigate('/onboarding/commitment');
  };

  const handleSkip = async () => {
    const defaultHabits: UserHabits = {
      cookingTime: '20to40',
      budget: '80to150',
      cookingFrequency: 'often'
    };
    localStorage.setItem('userHabits', JSON.stringify(defaultHabits));
    if (user) {
      try {
        await saveUserSettingsFromOnboarding(user.id, {});
      } catch (_) {}
    }
    navigate('/onboarding/commitment');
  };

  return (
    <OnboardingLayout currentStep={3}>
      {/* Main Content */}
      <div className="flex-1 max-w-md mx-auto w-full">
        
        {/* Q1: Cooking Time */}
        <div className="mb-10">
          <h2 
            className="mb-4"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: '1.3'
            }}>
            Thường nấu bao lâu?
          </h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCookingTime('under20')}
              className="pill-button"
              data-selected={cookingTime === 'under20'}>
              Dưới 20p
            </button>
            <button
              onClick={() => setCookingTime('20to40')}
              className="pill-button"
              data-selected={cookingTime === '20to40'}>
              20–40p
            </button>
            <button
              onClick={() => setCookingTime('over40')}
              className="pill-button"
              data-selected={cookingTime === 'over40'}>
              Trên 40p
            </button>
          </div>
        </div>

        {/* Q2: Budget */}
        <div className="mb-10">
          <h2 
            className="mb-4"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: '1.3'
            }}>
            Ngân sách mỗi bữa?
          </h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setBudget('under80')}
              className="pill-button"
              data-selected={budget === 'under80'}>
              ≤ 80k
            </button>
            <button
              onClick={() => setBudget('80to150')}
              className="pill-button"
              data-selected={budget === '80to150'}>
              80–150k
            </button>
            <button
              onClick={() => setBudget('over150')}
              className="pill-button"
              data-selected={budget === 'over150'}>
              150k+
            </button>
          </div>
        </div>

        {/* Q3: Cooking Frequency */}
        <div className="mb-10">
          <h2 
            className="mb-4"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: '1.3'
            }}>
            Hay nấu hay gọi?
          </h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCookingFrequency('often')}
              className="pill-button"
              data-selected={cookingFrequency === 'often'}>
              Hay nấu
            </button>
            <button
              onClick={() => setCookingFrequency('order')}
              className="pill-button"
              data-selected={cookingFrequency === 'order'}>
              Hay gọi
            </button>
            <button
              onClick={() => setCookingFrequency('depends')}
              className="pill-button"
              data-selected={cookingFrequency === 'depends'}>
              Tuỳ ngày
            </button>
          </div>
        </div>
      </div>

      {/* Footer CTAs */}
      <div className="max-w-md mx-auto w-full space-y-3">
        {/* Primary CTA */}
        <button
          onClick={handleComplete}
          className="btn btn-lg btn-primary w-full">
          Xong! Vào app →
        </button>

        {/* Skip Link */}
        <button
          onClick={handleSkip}
          className="w-full py-3 text-center hover-text-accent"
          style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            fontWeight: 500
          }}>
          Bỏ qua, tôi tự chỉnh sau
        </button>
      </div>
    </OnboardingLayout>
  );
}