import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { syncFamilyMembersHealth } from "../../lib/onboarding";
import type { FamilyMemberOnboarding } from "../../utils/types";
import { getInitial } from "../../utils/helpers";
import { OnboardingLayout } from "../../components/OnboardingLayout";

const HEALTH_CONDITIONS = [
  'Gout',
  'Mỡ máu',
  'Dạ dày',
  'Tiểu đường',
  'Huyết áp',
  'Không có'
];

export function HealthSetupScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [members, setMembers] = useState<FamilyMemberOnboarding[]>([]);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState('');

  // Load members from localStorage on mount
  useEffect(() => {
    const storedMembers = localStorage.getItem('familyMembers');
    if (storedMembers) {
      const parsedMembers = JSON.parse(storedMembers);
      setMembers(parsedMembers);
      
      // Get member index from URL param
      const memberId = searchParams.get('member');
      if (memberId) {
        const index = parsedMembers.findIndex((m: FamilyMemberOnboarding) => m.id === memberId);
        if (index !== -1) {
          setCurrentMemberIndex(index);
          // Load existing data if any
          if (parsedMembers[index].healthConditions) {
            setSelectedConditions(parsedMembers[index].healthConditions || []);
          }
          if (parsedMembers[index].allergies) {
            setAllergies(parsedMembers[index].allergies || '');
          }
        }
      }
    } else {
      // No members found, redirect back to family setup
      navigate('/onboarding/family');
    }
  }, [searchParams, navigate]);

  const currentMember = members[currentMemberIndex];
  const isLastMember = currentMemberIndex === members.length - 1;
  const nextMember = !isLastMember ? members[currentMemberIndex + 1] : null;

  const handleConditionToggle = (condition: string) => {
    if (condition === 'Không có') {
      setSelectedConditions(['Không có']);
    } else {
      const filtered = selectedConditions.filter(c => c !== 'Không có');
      
      if (filtered.includes(condition)) {
        setSelectedConditions(filtered.filter(c => c !== condition));
      } else {
        setSelectedConditions([...filtered, condition]);
      }
    }
  };

  const handleContinue = async () => {
    const updatedMembers = [...members];
    updatedMembers[currentMemberIndex] = {
      ...updatedMembers[currentMemberIndex],
      healthConditions: selectedConditions,
      allergies: allergies.trim()
    };
    
    localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
    setMembers(updatedMembers);
    if (user && isLastMember) {
      try {
        await syncFamilyMembersHealth(user.id, updatedMembers);
      } catch (_) {}
    }

    if (isLastMember) {
      navigate('/onboarding/preferences');
    } else {
      const nextMemberId = members[currentMemberIndex + 1].id;
      navigate(`/onboarding/health?member=${nextMemberId}`);
    }
  };

  const handleSkip = () => {
    if (isLastMember) {
      navigate('/onboarding/preferences');
    } else {
      const nextMemberId = members[currentMemberIndex + 1].id;
      navigate(`/onboarding/health?member=${nextMemberId}`);
    }
  };

  if (!currentMember) {
    return null;
  }

  return (
    <OnboardingLayout currentStep={2} backLabel="Quay lại bước trước">
        {/* Member Progress */}
        <div className="section-label section-label-primary mb-4 text-center">
          Thành viên {currentMemberIndex + 1}/{members.length} · Chọn tất cả phù hợp
        </div>

        {/* Member Avatar & Header */}
        <div className="flex flex-col items-center mb-6">
          {/* Avatar Circle */}
          <div 
            className="rounded-full flex items-center justify-center mb-4"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--color-text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--color-bg)'
            }}>
            {getInitial(currentMember.name)}
          </div>

          {/* Question */}
          <h1 
            className="mb-2 text-center"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: '1.3'
            }}>
            {currentMember.name} có cần kiêng gì không?
          </h1>
        </div>

      {/* Main Content */}
      <div className="flex-1 max-w-md mx-auto w-full">
        {/* Health Conditions Section */}
        <div className="mb-6">
          <div 
            className="mb-3"
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
            Chọn tất cả phù hợp
          </div>

          {/* Condition Chips */}
          <div className="flex flex-wrap gap-2">
            {HEALTH_CONDITIONS.map((condition) => {
              const isSelected = selectedConditions.includes(condition);
              
              return (
                <button
                  key={condition}
                  onClick={() => handleConditionToggle(condition)}
                  className="chip"
                  data-selected={isSelected}
                  style={{
                    fontSize: '15px',
                    border: isSelected
                      ? '2px solid var(--color-primary)'
                      : '2px solid var(--color-border-strong)'
                  }}>
                  {condition}
                </button>
              );
            })}
          </div>
        </div>

        {/* Allergies Section */}
        <div className="mb-6">
          <div 
            className="field-label">
            Có dị ứng thực phẩm không?
          </div>

          <input
            type="text"
            placeholder="Ví dụ: tôm, đậu phộng..."
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="input"
            style={{ height: '44px' }}
          />
        </div>
      </div>

      {/* Footer CTAs */}
      <div className="max-w-md mx-auto w-full space-y-3">
        {/* Primary CTA */}
        <button
          onClick={handleContinue}
          className="btn btn-lg btn-primary w-full inline-flex items-center justify-center gap-2">
          {isLastMember ? 'Hoàn thành' : `Tiếp theo → ${nextMember?.name}`}
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
          {isLastMember 
            ? `Bỏ qua cho ${currentMember.name}` 
            : `Bỏ qua cho ${currentMember.name}, sang ${nextMember?.name}`}
        </button>
      </div>
    </OnboardingLayout>
  );
}