// ── Shared Meal Types ──
export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type SlotType = 'protein' | 'soup' | 'vegetable' | 'rice';

// ── Dish Card (used in Home swipe deck & Summary) ──
export interface DishCard {
  id: string;
  name: string;
  imageUrl: string;
  cookingTime: string;
  cost: string;
  healthTags: string[];
  dishType: string;
  // Health Rule Engine result (tech-spec §06)
  healthAction?: 'allow' | 'adapt' | 'caution';
  healthTooltip?: string;
  healthTooltipDetail?: string;
  memberAdaptations?: Array<{
    member_name: string;
    label_vi: string;
    steps_vi: string[];
  }>;
  // Fridge mode data (optional — only present when fridge mode active)
  requiredIngredients?: string[];
  matchedIngredients?: string[];
  missingIngredients?: string[];
  ingredientMatchPercent?: number;
}

// ── Family Member — onboarding & health setup (S-02, S-03) ──
export interface FamilyMemberOnboarding {
  id: string;
  name: string;
  age: string;
  healthConditions?: string[];
  allergies?: string;
}

// ── Family Member — full settings (W-03 FamilySettings) ──
export interface FamilyMemberFull {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  healthConstraints: string[];
  allergies: string[];
  spiceLevel: 'none' | 'mild' | 'medium' | 'hot';
  saltPreference: 'light' | 'normal' | 'salty';
  cookingMethods: string[];
  proteins: string[];
  dislikes: string[];
}
