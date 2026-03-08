import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { Clock, DollarSign, Users, ChefHat, Package, ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { saveMealPlan } from "../../lib/deck";
import { getRecognitionCopy, updateLastRecognitionCopyKey } from "../../lib/recognition-copy";
import { BottomNav } from "../../components/BottomNav";
import type { MealType, SlotType, DishCard } from "../../utils/types";
import { getMealIcon, getMealLabel } from "../../utils/helpers";

interface Slot {
  type: SlotType;
  name: string;
  dish?: DishCard;
  badgeColor: string;
  badgeLabel: string;
}

interface Ingredient {
  name: string;
  quantity: string;
  hasInFridge: boolean;
}

const SLOT_BADGES: Record<SlotType, { color: string; label: string }> = {
  protein: { color: '#D9622B', label: 'MẶN' },
  soup: { color: '#5A8A6A', label: 'CANH' },
  vegetable: { color: '#5A8A6A', label: 'RAU' },
  rice: { color: '#B09A8C', label: 'CƠM' },
};

const SLOT_NAMES: Record<SlotType, string> = {
  protein: 'Món mặn',
  soup: 'Canh',
  vegetable: 'Rau',
  rice: 'Cơm',
};

export function SummaryScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user, profile, refreshProfile } = useAuth();
  
  const mealType: MealType = (searchParams.get('meal') as MealType) || 'dinner';
  const fridgeMode = searchParams.get('fridge') === 'true';
  const stateSlots = (location.state as { slots?: Array<{ type: SlotType; name: string; dish?: DishCard; completed: boolean }> })?.slots;
  
  const familySize = 4;
  const totalTime = 85;
  const totalCost = 225;

  const slots: Slot[] = stateSlots?.length
    ? stateSlots.map((s) => ({
        type: s.type,
        name: s.name || SLOT_NAMES[s.type],
        dish: s.dish,
        badgeColor: SLOT_BADGES[s.type]?.color ?? '#D9622B',
        badgeLabel: SLOT_BADGES[s.type]?.label ?? '',
      }))
    : [
        { type: 'protein' as SlotType, name: 'Món mặn', badgeColor: '#D9622B', badgeLabel: 'MẶN', dish: { id: '1', name: 'Cá Kho Tộ', imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400', cookingTime: '35 phút', cost: '85k', healthTags: [], dishType: 'Món mặn' } },
        { type: 'soup' as SlotType, name: 'Canh', badgeColor: '#5A8A6A', badgeLabel: 'CANH', dish: { id: '3', name: 'Canh Chua Cá', imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400', cookingTime: '30 phút', cost: '65k', healthTags: [], dishType: 'Món canh' } },
        { type: 'vegetable' as SlotType, name: 'Rau', badgeColor: '#5A8A6A', badgeLabel: 'RAU', dish: { id: '2', name: 'Rau Muống Xào Tỏi', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', cookingTime: '20 phút', cost: '75k', healthTags: [], dishType: 'Rau củ' } },
      ];

  const recognitionCopy = useMemo(() => {
    if (!profile) return null;
    const careDays = Math.max(1, profile.care_days_count);
    return getRecognitionCopy({
      lastCopyKey: profile.last_recognition_copy_key,
      careDays,
      mealType,
    });
  }, [profile?.care_days_count, profile?.last_recognition_copy_key, mealType, profile]);

  useEffect(() => {
    if (!user || !stateSlots?.length) return;
    const dishesPayload = stateSlots
      .filter((s) => s.dish)
      .map((s) => ({ dish_id: s.dish!.id, slot_type: s.type, is_auto: s.type === 'rice' }));
    if (dishesPayload.length === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    saveMealPlan(user.id, today, mealType, dishesPayload).catch(() => {});
  }, [user?.id, mealType, stateSlots]);

  useEffect(() => {
    if (!user?.id || !recognitionCopy?.key) return;
    updateLastRecognitionCopyKey(user.id, recognitionCopy.key).then(() => refreshProfile?.()).catch(() => {});
  }, [user?.id, recognitionCopy?.key]);

  // Mock ingredient data for Fridge Mode
  const ingredients: Ingredient[] = [
    { name: 'Trứng gà', quantity: '5 quả', hasInFridge: true },
    { name: 'Cà chua', quantity: '3 quả', hasInFridge: true },
    { name: 'Thịt heo', quantity: '300g', hasInFridge: true },
    { name: 'Dầu ăn', quantity: '2 tbsp', hasInFridge: true },
    { name: 'Muối', quantity: '1 tsp', hasInFridge: true },
    { name: 'Tiêu', quantity: '1/2 tsp', hasInFridge: true },
    { name: 'Nước dừa', quantity: '200ml', hasInFridge: false },
    { name: 'Hành tím', quantity: '3 củ', hasInFridge: false },
    { name: 'Tỏi', quantity: '1 củ', hasInFridge: false },
  ];

  const ingredientsInFridge = ingredients.filter(i => i.hasInFridge);
  const ingredientsNeedToBuy = ingredients.filter(i => !i.hasInFridge);

  return (
    <div 
      className="min-h-screen pb-20">
      
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/app/home')}
          className="flex items-center gap-2 hover-text-accent"
          style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            fontWeight: 500
          }}>
          <ArrowLeft size={16} strokeWidth={1.5} />
          Quay lại
        </button>

        {/* Meal Title */}
        <div className="flex items-center gap-3 mb-3">
          <span style={{ color: 'var(--color-text-primary)' }}>
            {getMealIcon(mealType)}
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 600,
              color: 'var(--color-text-primary)'
            }}>
            {getMealLabel(mealType)} hôm nay
          </h1>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Users size={14} strokeWidth={1.5} style={{ color: 'var(--color-text-secondary)' }} />
            <span
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)'
              }}>
              {familySize} người
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} strokeWidth={1.5} style={{ color: 'var(--color-text-secondary)' }} />
            <span
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)'
              }}>
              ~{totalTime} phút
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={14} strokeWidth={1.5} style={{ color: 'var(--color-text-secondary)' }} />
            <span
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)'
              }}>
              ~{totalCost}k
            </span>
          </div>
        </div>

        {/* S-07 Recognition copy (tech-spec §18) */}
        {recognitionCopy?.copy && (
          <p
            className="mt-3 body-text"
            style={{
              fontSize: '15px',
              color: 'var(--color-text-secondary)',
              fontStyle: 'italic',
            }}>
            {recognitionCopy.copy}
          </p>
        )}
      </div>

      {/* Slot Cards */}
      <div className="px-4 mb-6">
        <div className="flex flex-col gap-3">
          {slots.map((slot) => {
            if (!slot.dish) return null;
            
            return (
              <div
                key={slot.type}
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)'
                }}>
                {/* Badge Header */}
                <div 
                  className="px-4 py-2 flex items-center justify-between"
                  style={{
                    backgroundColor: 'var(--color-surface-alt)',
                    borderBottom: '1px solid var(--color-border)'
                  }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      color: slot.badgeColor
                    }}>
                    {slot.badgeLabel}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-3 flex gap-3">
                  {/* Thumbnail */}
                  <div 
                    className="rounded-lg overflow-hidden flex-shrink-0"
                    style={{
                      width: '80px',
                      height: '80px'
                    }}>
                    <img 
                      src={slot.dish.imageUrl}
                      alt={slot.dish.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        marginBottom: '6px'
                      }}>
                      {slot.dish.name}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="flex items-center gap-1"
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-text-secondary)'
                        }}>
                        <Clock size={12} strokeWidth={1.5} />
                        {slot.dish.cookingTime}
                      </span>
                      <span
                        className="flex items-center gap-1"
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-text-secondary)'
                        }}>
                        <DollarSign size={12} strokeWidth={1.5} />
                        {slot.dish.cost}
                      </span>
                    </div>

                    {/* Health Tags */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {slot.dish.healthTags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-health-light)',
                            border: '1px solid var(--color-health-border)',
                            fontSize: '10px',
                            fontWeight: 500,
                            color: 'var(--color-health)'
                          }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => navigate(`/app/recipe?dish=${slot.dish!.id}&return=summary`)}
                      className="self-start px-3 py-1 rounded-full transition-all hover-row"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid var(--color-border-strong)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--color-text-secondary)'
                      }}>
                      Nấu ngay
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Starch Slot (Auto) */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: 'transparent',
              border: '2px dashed var(--color-border-strong)'
            }}>
            {/* Badge Header */}
            <div 
              className="px-4 py-2 flex items-center justify-between"
              style={{
                backgroundColor: 'var(--color-surface-alt)',
                borderBottom: '2px dashed var(--color-border-strong)'
              }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: 'var(--color-text-disabled)'
                }}>
                CƠM (TỰ ĐỘNG)
              </span>
            </div>

            {/* Card Content */}
            <div className="p-3 flex gap-3 items-center">
              {/* Icon */}
              <div 
                className="rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: 'var(--color-surface-alt)',
                  fontSize: '32px'
                }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-disabled)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11h18"/><path d="M5 11c0-4 3-8 7-8s7 4 7 8"/><path d="M3 15c0 2 4 4 9 4s9-2 9-4"/><path d="M3 11v4"/><path d="M21 11v4"/></svg>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col">
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: '4px'
                  }}>
                  Cơm trắng
                </h3>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '8px'
                  }}>
                  Tự động thêm vào mỗi bữa
                </p>

                {/* Change Button */}
                <button
                  onClick={() => console.log('Change starch type')}
                  className="self-start px-3 py-1 rounded-full transition-all hover-row"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border-strong)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)'
                  }}>
                  Đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredient Panel - Fridge Mode Only */}
      {fridgeMode && (
        <div className="px-4 mb-6">
          <div 
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}>
            {/* Panel Header */}
            <div 
              className="px-4 py-3 flex items-center justify-between"
              style={{
                backgroundColor: 'var(--color-surface-alt)',
                borderBottom: '1px solid var(--color-border)'
              }}>
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)'
                }}>
                Nguyên liệu cần cho {getMealLabel(mealType).toLowerCase()}
              </h3>
              <span
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor: '#e8f5e8',
                  border: '1px solid var(--color-health-border)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-health)'
                }}>
                Cần mua: {ingredientsNeedToBuy.length} thứ
              </span>
            </div>

            {/* Panel Content */}
            <div className="p-4">
              {/* Group 1 - Already Have */}
              <div className="mb-5">
                {/* Label */}
                <div className="flex items-center gap-2 mb-3">
                  <Check size={12} strokeWidth={2} style={{ color: 'var(--color-health)' }} />
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      color: 'var(--color-text-secondary)',
                      textTransform: 'uppercase'
                    }}>
                    Đã có trong tủ
                  </span>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-2">
                  {ingredientsInFridge.map((ingredient) => (
                    <div 
                      key={ingredient.name}
                      className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check 
                          size={14} 
                          strokeWidth={1.5} 
                          style={{ color: '#bbbbbb', flexShrink: 0 }} 
                        />
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#bbbbbb',
                            textDecoration: 'line-through'
                          }}>
                          {ingredient.name}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '13px',
                          color: '#bbbbbb'
                        }}>
                        {ingredient.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 2 - Need to Buy */}
              <div>
                {/* Label */}
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart size={12} strokeWidth={1.5} style={{ color: 'var(--color-warn)' }} />
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      color: 'var(--color-warn)',
                      textTransform: 'uppercase'
                    }}>
                    Cần mua thêm
                  </span>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-2">
                  {ingredientsNeedToBuy.map((ingredient) => (
                    <div 
                      key={ingredient.name}
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{
                        backgroundColor: '#fff8f0',
                        border: '1px solid #f0e0c0'
                      }}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="rounded-full flex-shrink-0"
                          style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: 'var(--color-warn)'
                          }}
                        />
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)'
                          }}>
                          {ingredient.name}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--color-text-secondary)'
                        }}>
                        {ingredient.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="px-4 mb-6">
        {/* Primary CTA - Start Cooking */}
        <button
          onClick={() => navigate('/app/recipe?sequential=true')}
          className="w-full rounded-full transition-all flex items-center justify-center gap-2 mb-3 hover-bg-dark"
          style={{
            height: '52px',
            backgroundColor: 'var(--color-text-primary)',
            border: '2px solid var(--color-text-primary)',
            fontSize: '15px',
            fontWeight: 600,
            color: '#ffffff'
          }}>
          <ChefHat size={18} strokeWidth={1.5} />
          Bắt đầu nấu
        </button>

        {/* Phase 2 Hidden - Order Delivery */}
        {false && (
          <button
            onClick={() => console.log('Order delivery')}
            className="w-full rounded-full transition-all flex items-center justify-center gap-2 hover-bg-alt"
            style={{
              height: '52px',
              backgroundColor: 'transparent',
              border: '2px solid var(--color-border-strong)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)'
            }}>
            <Package size={18} strokeWidth={1.5} />
            Gọi món
          </button>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}