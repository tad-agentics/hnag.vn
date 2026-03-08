import type { FamilyMemberFull } from "../../utils/types";
import { useState } from "react";
import { Plus, X, Minus } from "lucide-react";
import { SettingsLayout } from "../../components/SettingsLayout";

export function FamilySettingsScreen() {
  // Mock family data
  const [members] = useState<FamilyMemberFull[]>([
    {
      id: '1',
      name: 'Ba',
      age: 36,
      gender: 'male',
      healthConstraints: ['gout', 'highCholesterol'],
      allergies: ['Hải sản có vỏ'],
      spiceLevel: 'mild',
      saltPreference: 'light',
      cookingMethods: ['Hấp', 'Luộc'],
      proteins: ['Cá', 'Gà'],
      dislikes: []
    },
    {
      id: '2',
      name: 'Mẹ',
      age: 34,
      gender: 'female',
      healthConstraints: ['highBloodPressure'],
      allergies: [],
      spiceLevel: 'none',
      saltPreference: 'light',
      cookingMethods: [],
      proteins: [],
      dislikes: []
    },
    {
      id: '3',
      name: 'Con',
      age: 5,
      gender: 'male',
      healthConstraints: [],
      allergies: [],
      spiceLevel: 'none',
      saltPreference: 'normal',
      cookingMethods: [],
      proteins: [],
      dislikes: ['Rau mùi', 'Cà rốt']
    }
  ]);

  const [selectedMemberId, setSelectedMemberId] = useState('1');
  const [hasChanges, setHasChanges] = useState(false);
  const [allergyInput, setAllergyInput] = useState('');
  const [dislikeInput, setDislikeInput] = useState('');

  const selectedMember = members.find(m => m.id === selectedMemberId) || members[0];

  // Health conditions list
  const healthConditions = [
    { id: 'gout', label: 'Gout (tăng acid uric)' },
    { id: 'highCholesterol', label: 'Mỡ máu cao' },
    { id: 'diabetes', label: 'Tiểu đường type 2' },
    { id: 'highBloodPressure', label: 'Huyết áp cao' },
    { id: 'stomach', label: 'Dạ dày / Trào ngược' },
    { id: 'kidneyDisease', label: 'Suy thận' }
  ];

  const spiceLevels = [
    { id: 'none', label: 'Không cay' },
    { id: 'mild', label: 'Cay nhẹ' },
    { id: 'medium', label: 'Cay vừa' },
    { id: 'hot', label: 'Rất cay' }
  ];

  const saltPreferences = [
    { id: 'light', label: 'Ăn nhạt' },
    { id: 'normal', label: 'Bình thường' },
    { id: 'salty', label: 'Ăn mặn' }
  ];

  const cookingMethodOptions = ['Hấp', 'Luộc', 'Xào', 'Nướng', 'Chiên', 'Kho'];
  const proteinOptions = ['Cá', 'Gà', 'Heo', 'Bò', 'Tôm', 'Mực', 'Đậu hũ'];

  return (
    <SettingsLayout
      activeItem="family"
      mobileTitle="Gia đình"
      desktopDescription="Quản lý gia đình, bệnh lý và khẩu vị ăn uống"
      hasChanges={hasChanges}
      onSave={() => { console.log('Save changes'); setHasChanges(false); }}
      onCancel={() => setHasChanges(false)}
      mobileHeaderRight={
        <button
          onClick={() => {/* Add member */}}
          className="link"
          style={{ fontSize: '15px', fontWeight: 600, padding: '8px' }}>
          + Thêm
        </button>
      }
    >
      <MemberTabsContent
        members={members}
        selectedMemberId={selectedMemberId}
        setSelectedMemberId={setSelectedMemberId}
        selectedMember={selectedMember}
        healthConditions={healthConditions}
        spiceLevels={spiceLevels}
        saltPreferences={saltPreferences}
        cookingMethodOptions={cookingMethodOptions}
        proteinOptions={proteinOptions}
        allergyInput={allergyInput}
        setAllergyInput={setAllergyInput}
        dislikeInput={dislikeInput}
        setDislikeInput={setDislikeInput}
        setHasChanges={setHasChanges}
      />
    </SettingsLayout>
  );
}

interface MemberTabsContentProps {
  members: FamilyMemberFull[];
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
  selectedMember: FamilyMemberFull;
  healthConditions: { id: string; label: string }[];
  spiceLevels: { id: string; label: string }[];
  saltPreferences: { id: string; label: string }[];
  cookingMethodOptions: string[];
  proteinOptions: string[];
  allergyInput: string;
  setAllergyInput: (value: string) => void;
  dislikeInput: string;
  setDislikeInput: (value: string) => void;
  setHasChanges: (value: boolean) => void;
}

function MemberTabsContent({
  members,
  selectedMemberId,
  setSelectedMemberId,
  selectedMember,
  healthConditions,
  spiceLevels,
  saltPreferences,
  cookingMethodOptions,
  proteinOptions,
  allergyInput,
  setAllergyInput,
  dislikeInput,
  setDislikeInput,
  setHasChanges
}: MemberTabsContentProps) {
  const [localMember, setLocalMember] = useState(selectedMember);
  const [localHealthConstraints, setLocalHealthConstraints] = useState<string[]>(selectedMember.healthConstraints);
  const [localAllergies, setLocalAllergies] = useState<string[]>(selectedMember.allergies);
  const [localDislikes, setLocalDislikes] = useState<string[]>(selectedMember.dislikes);
  const [localCookingMethods, setLocalCookingMethods] = useState<string[]>(selectedMember.cookingMethods);
  const [localProteins, setLocalProteins] = useState<string[]>(selectedMember.proteins);

  const handleAgeChange = (delta: number) => {
    const newAge = Math.max(1, Math.min(120, localMember.age + delta));
    setLocalMember({ ...localMember, age: newAge });
    setHasChanges(true);
  };

  const toggleHealthConstraint = (id: string) => {
    const newConstraints = localHealthConstraints.includes(id)
      ? localHealthConstraints.filter(c => c !== id)
      : [...localHealthConstraints, id];
    setLocalHealthConstraints(newConstraints);
    setHasChanges(true);
  };

  const addAllergy = () => {
    if (allergyInput.trim()) {
      setLocalAllergies([...localAllergies, allergyInput.trim()]);
      setAllergyInput('');
      setHasChanges(true);
    }
  };

  const removeAllergy = (allergy: string) => {
    setLocalAllergies(localAllergies.filter(a => a !== allergy));
    setHasChanges(true);
  };

  const addDislike = () => {
    if (dislikeInput.trim()) {
      setLocalDislikes([...localDislikes, dislikeInput.trim()]);
      setDislikeInput('');
      setHasChanges(true);
    }
  };

  const removeDislike = (dislike: string) => {
    setLocalDislikes(localDislikes.filter(d => d !== dislike));
    setHasChanges(true);
  };

  const toggleCookingMethod = (method: string) => {
    const newMethods = localCookingMethods.includes(method)
      ? localCookingMethods.filter(m => m !== method)
      : [...localCookingMethods, method];
    setLocalCookingMethods(newMethods);
    setHasChanges(true);
  };

  const toggleProtein = (protein: string) => {
    const newProteins = localProteins.includes(protein)
      ? localProteins.filter(p => p !== protein)
      : [...localProteins, protein];
    setLocalProteins(newProteins);
    setHasChanges(true);
  };

  return (
    <div className="px-4 lg:px-0 pt-6 pb-8">
      {/* Section Label */}
      <p className="section-label section-label-secondary mb-3">Thành viên</p>

      {/* Member Tabs */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {members.map((member) => {
          const isActive = member.id === selectedMemberId;
          return (
            <button
              key={member.id}
              onClick={() => setSelectedMemberId(member.id)}
              className="chip chip-filled"
              data-selected={isActive ? "true" : "false"}
              style={isActive ? {
                backgroundColor: 'var(--color-text-primary)',
                borderColor: 'var(--color-text-primary)',
                color: '#ffffff',
                fontSize: '15px'
              } : { fontSize: '15px' }}>
              {member.name} ({member.age}t)
            </button>
          );
        })}
        <button
          onClick={() => {/* Add member */}}
          className="chip"
          style={{ border: '2px dashed var(--color-border)', fontSize: '15px', gap: '8px' }}>
          <Plus size={16} strokeWidth={1.5} />
          Thêm
        </button>
      </div>

      {/* Member Details Card */}
      <div className="card p-6 mb-6">
        
        {/* Basic Info Section */}
        <div className="mb-8">
          <p className="section-label section-label-secondary mb-4">Thông tin cơ bản</p>

          {/* Name Input */}
          <div className="mb-4">
            <label className="field-label">Gọi là</label>
            <input
              type="text"
              value={localMember.name}
              onChange={(e) => {
                setLocalMember({ ...localMember, name: e.target.value });
                setHasChanges(true);
              }}
              className="input"
              style={{ height: 'auto', padding: '12px 16px' }}
            />
          </div>

          {/* Age Stepper */}
          <div className="mb-4">
            <label className="field-label">Tuổi</label>
            <div className="flex items-center gap-3">
              <button onClick={() => handleAgeChange(-1)} className="stepper-btn">
                <Minus size={16} strokeWidth={1.5} />
              </button>
              <input
                type="number"
                value={localMember.age}
                onChange={(e) => {
                  const age = parseInt(e.target.value) || 1;
                  setLocalMember({ ...localMember, age });
                  setHasChanges(true);
                }}
                className="stepper-value"
                style={{ outline: 'none' }}
              />
              <button onClick={() => handleAgeChange(1)} className="stepper-btn">
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Gender Radio */}
          <div>
            <label className="field-label">Giới tính</label>
            <div className="flex items-center gap-3">
              {[
                { id: 'male', label: 'Nam' },
                { id: 'female', label: 'Nữ' },
                { id: 'other', label: 'Khác' }
              ].map((option) => {
                const isSelected = localMember.gender === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setLocalMember({ ...localMember, gender: option.id as 'male' | 'female' | 'other' });
                      setHasChanges(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg flex-1"
                    style={{
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-surface-alt)',
                      border: isSelected ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                      cursor: 'pointer'
                    }}>
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: '20px',
                        height: '20px',
                        border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        backgroundColor: 'var(--color-surface)'
                      }}>
                      {isSelected && (
                        <div
                          className="rounded-full"
                          style={{
                            width: '10px',
                            height: '10px',
                            backgroundColor: 'var(--color-primary)'
                          }}
                        />
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                      }}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Health Constraints Section */}
        <div className="mb-8 pb-8 divider-line" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <p className="section-label section-label-health mb-4">Bệnh lý / Kiêng ăn</p>

          {/* Health Conditions Checkboxes */}
          <div className="flex flex-wrap gap-2 mb-4">
            {healthConditions.map((condition) => {
              const isSelected = localHealthConstraints.includes(condition.id);
              return (
                <button
                  key={condition.id}
                  onClick={() => toggleHealthConstraint(condition.id)}
                  className="chip chip-health"
                  data-selected={isSelected ? "true" : "false"}>
                  {isSelected && '✓ '}
                  {condition.label}
                </button>
              );
            })}
          </div>

          {/* Allergies Input */}
          <div className="mb-3">
            <label className="field-label">Dị ứng thực phẩm</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAllergy();
                  }
                }}
                placeholder="Thêm: tôm, đậu phộng, gluten..."
                className="input flex-1"
                style={{ height: 'auto', padding: '8px 16px' }}
              />
              <button onClick={addAllergy} className="btn-inline-add">
                Thêm
              </button>
            </div>
          </div>

          {/* Allergy Tags */}
          {localAllergies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localAllergies.map((allergy, index) => (
                <div key={index} className="removable-tag removable-tag-error">
                  <span className="body-text-sm" style={{ color: 'inherit' }}>{allergy}</span>
                  <button onClick={() => removeAllergy(allergy)} className="removable-tag-btn">
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Food Preferences Section */}
        <div>
          <p className="section-label section-label-primary mb-4">Khẩu vị & Sở thích</p>

          {/* Spice Level */}
          <div className="mb-4">
            <label className="field-label">Mức độ cay</label>
            <div className="flex gap-2 flex-wrap">
              {spiceLevels.map((level) => {
                const isSelected = localMember.spiceLevel === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => {
                      setLocalMember({ ...localMember, spiceLevel: level.id as any });
                      setHasChanges(true);
                    }}
                    className="chip"
                    data-selected={isSelected ? "true" : "false"}>
                    {level.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Salt Preference */}
          <div className="mb-4">
            <label className="field-label">Độ mặn</label>
            <div className="flex gap-2 flex-wrap">
              {saltPreferences.map((pref) => {
                const isSelected = localMember.saltPreference === pref.id;
                return (
                  <button
                    key={pref.id}
                    onClick={() => {
                      setLocalMember({ ...localMember, saltPreference: pref.id as any });
                      setHasChanges(true);
                    }}
                    className="chip"
                    data-selected={isSelected ? "true" : "false"}>
                    {pref.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cooking Methods */}
          <div className="mb-4">
            <label className="field-label">Cách nấu ưa thích</label>
            <div className="flex gap-2 flex-wrap">
              {cookingMethodOptions.map((method) => {
                const isSelected = localCookingMethods.includes(method);
                return (
                  <button
                    key={method}
                    onClick={() => toggleCookingMethod(method)}
                    className="chip"
                    data-selected={isSelected ? "true" : "false"}>
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Protein Preferences */}
          <div className="mb-4">
            <label className="field-label">Protein ưa thích</label>
            <div className="flex gap-2 flex-wrap">
              {proteinOptions.map((protein) => {
                const isSelected = localProteins.includes(protein);
                return (
                  <button
                    key={protein}
                    onClick={() => toggleProtein(protein)}
                    className="chip"
                    data-selected={isSelected ? "true" : "false"}>
                    {protein}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dislikes Input */}
          <div className="mb-3">
            <label className="field-label">Không thích ăn</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={dislikeInput}
                onChange={(e) => setDislikeInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addDislike();
                  }
                }}
                placeholder="Rau mùi, cà rốt..."
                className="input flex-1"
                style={{ height: 'auto', padding: '8px 16px' }}
              />
              <button onClick={addDislike} className="btn-inline-add">
                Thêm
              </button>
            </div>
          </div>

          {/* Dislike Tags */}
          {localDislikes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localDislikes.map((dislike, index) => (
                <div key={index} className="removable-tag removable-tag-neutral">
                  <span className="body-text-sm" style={{ color: 'inherit' }}>{dislike}</span>
                  <button onClick={() => removeDislike(dislike)} className="removable-tag-btn">
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}