import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Plus, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { saveFamilyMembers } from "../../lib/onboarding";
import type { FamilyMemberOnboarding } from "../../utils/types";
import { getInitial } from "../../utils/helpers";
import { OnboardingLayout } from "../../components/OnboardingLayout";

export function FamilySetupScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Default family members
  const [members, setMembers] = useState<FamilyMemberOnboarding[]>([
    { id: '1', name: 'Ba', age: '' },
    { id: '2', name: 'Mẹ', age: '' },
    { id: '3', name: 'Con', age: '' }
  ]);

  const handleAddMember = () => {
    // Limit to maximum 5 members
    if (members.length >= 5) {
      return;
    }
    
    const newMember: FamilyMemberOnboarding = {
      id: Date.now().toString(),
      name: '',
      age: ''
    };
    setMembers([...members, newMember]);
  };

  const handleRemoveMember = (id: string) => {
    // Don't allow removing all members - keep at least one
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const handleUpdateMember = (id: string, field: 'name' | 'age', value: string) => {
    setMembers(members.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleContinue = async () => {
    localStorage.setItem('familyMembers', JSON.stringify(members));
    if (user) {
      try {
        await saveFamilyMembers(user.id, members);
      } catch (_) {
        // Offline or Supabase not configured: continue with localStorage
      }
    }
    if (members.length > 0) {
      navigate(`/onboarding/health?member=${members[0].id}`);
    }
  };

  const handleSkip = async () => {
    localStorage.setItem('familyMembers', JSON.stringify(members));
    if (user) {
      try {
        await saveFamilyMembers(user.id, members);
      } catch (_) {}
    }
    navigate('/onboarding/preferences');
  };

  return (
    <OnboardingLayout currentStep={1}>
        {/* Question */}
        <div className="text-center mb-8">
          <h1 
            className="mb-2"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: '1.3'
            }}>
            Nhà mình có những ai?
          </h1>
          <p 
            style={{ 
              fontSize: '15px',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.6'
            }}>
            Để mình gợi ý đúng cho từng người
          </p>
        </div>

      {/* Main Content */}
      <div className="flex-1 max-w-md mx-auto w-full">
        {/* Member Cards */}
        <div className="space-y-4 mb-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="rounded-xl p-4 relative"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)'
              }}>
              
              <div className="flex items-start gap-3">
                {/* Avatar Circle */}
                <div 
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'var(--color-primary-light)',
                    border: '2px solid var(--color-primary-border)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--color-primary)'
                  }}>
                  {getInitial(member.name)}
                </div>

                {/* Input Fields */}
                <div className="flex-1 space-y-3">
                  {/* Name Input */}
                  <input
                    type="text"
                    placeholder="Tên (vd: Ba, Mẹ, Con)"
                    value={member.name}
                    onChange={(e) => handleUpdateMember(member.id, 'name', e.target.value)}
                    className="input"
                    style={{ height: '40px' }}
                  />

                  {/* Age Input */}
                  <input
                    type="number"
                    placeholder="Tuổi"
                    value={member.age}
                    onChange={(e) => handleUpdateMember(member.id, 'age', e.target.value)}
                    className="input"
                    style={{ height: '40px' }}
                  />
                </div>

                {/* Remove Button (only show if more than 1 member) */}
                {members.length > 1 && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="flex-shrink-0 rounded-full p-1 hover-bg-alt"
                    style={{
                      color: 'var(--color-text-disabled)'
                    }}>
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add Member Card (Dashed) */}
          {members.length < 5 && (
            <button
              onClick={handleAddMember}
              className="btn-dashed">
              <Plus className="w-5 h-5" strokeWidth={1.5} />
              Thêm người
            </button>
          )}
          
          {/* Max members message */}
          {members.length >= 5 && (
            <div
              className="w-full rounded-xl p-4 text-center"
              style={{
                backgroundColor: 'var(--color-surface-alt)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                fontStyle: 'italic'
              }}>
              Tối đa 5 thành viên
            </div>
          )}
        </div>
      </div>

      {/* Footer CTAs */}
      <div className="max-w-md mx-auto w-full space-y-3">
        {/* Primary CTA */}
        <button
          onClick={handleContinue}
          className="btn btn-lg btn-primary w-full inline-flex items-center justify-center gap-2">
          Tiếp theo
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
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
          Bỏ qua, tôi điền sau
        </button>
      </div>
    </OnboardingLayout>
  );
}