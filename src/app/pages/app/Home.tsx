import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Check, X, Lightbulb, Sprout, Building2, ChefHat, Clock, DollarSign, UtensilsCrossed, Refrigerator, Search, Loader } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchDeck, recordSwipe } from "../../lib/deck";
import { getTrialState, hasSoftNudgeBeenShown, markSoftNudgeShown } from "../../lib/trial";
import { BottomNav } from "../../components/BottomNav";
import { TrialRibbon } from "../../components/TrialRibbon";
import { SoftNudgeModal } from "../../components/SoftNudgeModal";
import { FridgeSheet } from "../../components/home/FridgeSheet";
import { FridgeModeUI } from "../../components/home/FridgeModeUI";
import { ChangeSlotSheet } from "../../components/home/ChangeSlotSheet";
import { BottomSheet } from "../../components/BottomSheet";
import type { MealType, SlotType, DishCard } from "../../utils/types";
import { getMealIcon, getMealLabel, getSlotLabel } from "../../utils/helpers";

type MealStatus = 'off' | 'done' | 'planning';

interface Slot {
  type: SlotType;
  name: string;
  dish?: DishCard;
  completed: boolean;
}

// Mock dish data
const mockDishes: DishCard[] = [
  {
    id: '1',
    name: 'Cá Kho Tộ',
    imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400',
    cookingTime: '35 phút',
    cost: '85k',
    healthTags: ['Giàu Protein', 'Omega-3'],
    dishType: 'Món mặn',
    requiredIngredients: ['Cá lóc', 'Cà chua', 'Nước mắm', 'Đường'],
    matchedIngredients: ['Cá lóc', 'Cà chua', 'Nước mắm', 'Đường'],
    missingIngredients: [],
    ingredientMatchPercent: 100
  },
  {
    id: '2',
    name: 'Thịt Kho Trứng',
    imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400',
    cookingTime: '45 phút',
    cost: '75k',
    healthTags: ['Giàu Protein'],
    dishType: 'Món mặn',
    requiredIngredients: ['Thịt heo', 'Trứng gà', 'Nước mắm', 'Đường'],
    matchedIngredients: ['Thịt heo', 'Trứng gà', 'Đường'],
    missingIngredients: ['Nước mắm'],
    ingredientMatchPercent: 75
  },
  {
    id: '3',
    name: 'Canh Chua Cá',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
    cookingTime: '30 phút',
    cost: '65k',
    healthTags: ['Vitamin C', 'Ít Calo'],
    dishType: 'Món canh',
    requiredIngredients: ['Cá lóc', 'Cà chua', 'Thơm', 'Giá đỗ'],
    matchedIngredients: ['Cá lóc', 'Cà chua'],
    missingIngredients: ['Thơm', 'Giá đỗ'],
    ingredientMatchPercent: 50
  },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [sessionId] = useState(() => crypto.randomUUID());
  
  // State
  const [careDays, setCareDays] = useState(1);
  const [totalMeals, setTotalMeals] = useState(5);
  const [fridgeMode, setFridgeMode] = useState(false);
  const [deck, setDeck] = useState<DishCard[]>([]);
  const [deckLoading, setDeckLoading] = useState(false);
  const [currentDishIndex, setCurrentDishIndex] = useState(0);
  const [isDeckEmpty, setIsDeckEmpty] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showFridgeSheet, setShowFridgeSheet] = useState(false);
  const [showChangeSlotSheet, setShowChangeSlotSheet] = useState(false);
  
  // Trial & paywall (tech-spec §09 — S-12a ribbon, S-12b soft nudge, S-12c gate in Layout)
  const trial = getTrialState(profile ?? null);
  const showTrialRibbon = trial.phase === 'ribbon';
  const trialDaysRemaining = trial.daysRemaining;
  const [showSoftNudge, setShowSoftNudge] = useState(false);
  
  // Filter expansion options
  const [filterOptions, setFilterOptions] = useState({
    addTime: false,
    addBudget: false,
    removeFridge: false
  });
  
  // Fridge NLP state
  const [nlpInput, setNlpInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [nlpResults, setNlpResults] = useState<{ ingredient: string; confidence: number }[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const parseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Swipe state - use ref for initial position to avoid state updates
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  
  // Meal planning state
  const [activeMeal, setActiveMeal] = useState<MealType>('dinner');
  const [mealStatuses] = useState<Record<MealType, MealStatus>>({
    breakfast: 'off',
    lunch: 'done',
    dinner: 'planning'
  });
  
  const [familySize] = useState(4); // From onboarding
  const [slots, setSlots] = useState<Slot[]>([
    { type: 'protein', name: 'Món mặn', completed: false },
    { type: 'soup', name: 'Canh', completed: false },
    { type: 'vegetable', name: 'Rau', completed: false },
    { type: 'rice', name: 'Cơm', completed: false }
  ]);

  const currentSlotIndex = slots.findIndex(s => !s.completed);
  const currentSlot = slots[currentSlotIndex];
  const completedSlots = slots.filter(s => s.completed).length;
  const activeDeck = deck.length > 0 ? deck : mockDishes;
  const currentDish = activeDeck[currentDishIndex];

  useEffect(() => {
    const stored = localStorage.getItem('care_days');
    if (stored) setCareDays(parseInt(stored));
  }, []);

  // S-12b: show soft nudge once on day 12+ when in ribbon phase
  useEffect(() => {
    if (!user?.id || !trial.canShowSoftNudge || hasSoftNudgeBeenShown(user.id)) return;
    setShowSoftNudge(true);
  }, [user?.id, trial.canShowSoftNudge]);

  useEffect(() => {
    if (!currentSlot || !user) return;
    setDeckLoading(true);
    fetchDeck(activeMeal, currentSlot.type, 8, user?.id ?? undefined)
      .then((d) => {
        setDeck(d);
        setCurrentDishIndex(0);
        setIsDeckEmpty(false);
      })
      .catch(() => {
        setDeck([]);
      })
      .finally(() => setDeckLoading(false));
  }, [user?.id, activeMeal, currentSlot?.type]);

  const handleAccept = async () => {
    if (currentDish && user && currentSlot) {
      try {
        await recordSwipe(
          user.id,
          currentDish.id,
          'right',
          activeMeal,
          currentSlot.type,
          sessionId,
          currentDishIndex + 1
        );
      } catch (_) {}
    }
    const newSlots = [...slots];
    newSlots[currentSlotIndex] = {
      ...currentSlot,
      dish: currentDish,
      completed: true
    };
    setSlots(newSlots);
    const allDone = newSlots.every(s => s.completed);
    if (allDone) {
      const fridgeParam = fridgeMode ? '&fridge=true' : '';
      navigate('/app/summary?meal=' + activeMeal + fridgeParam, { state: { slots: newSlots } });
    }
  };

  const handleReject = async () => {
    if (currentDish && user && currentSlot) {
      try {
        await recordSwipe(
          user.id,
          currentDish.id,
          'left',
          activeMeal,
          currentSlot.type,
          sessionId,
          currentDishIndex + 1
        );
      } catch (_) {}
    }
    if (currentDishIndex < activeDeck.length - 1) {
      setCurrentDishIndex(currentDishIndex + 1);
    } else {
      setIsDeckEmpty(true);
    }
  };

  const handleDefer = () => {
    // Defer logic (move card to end of deck)
    console.log('Defer card');
    handleReject(); // For now, same as reject
  };

  // NLP Parsing logic (simulated)
  const handleNLPInput = (text: string) => {
    setNlpInput(text);
    
    // Clear existing timeout
    if (parseTimeoutRef.current) {
      clearTimeout(parseTimeoutRef.current);
    }
    
    // Debounce 600ms
    parseTimeoutRef.current = setTimeout(() => {
      if (text.trim().length > 0) {
        setIsParsing(true);
        
        // Simulate NLP parsing (in real app, call API)
        setTimeout(() => {
          // Mock parse results
          const mockResults: { ingredient: string; confidence: number }[] = [];
          
          if (text.toLowerCase().includes('gà')) {
            mockResults.push({ ingredient: 'Thịt gà', confidence: 0.9 });
          }
          if (text.toLowerCase().includes('cà chua')) {
            mockResults.push({ ingredient: 'Cà chua', confidence: 0.95 });
          }
          if (text.toLowerCase().includes('trứng')) {
            mockResults.push({ ingredient: 'Trứng gà', confidence: 0.85 });
          }
          if (text.toLowerCase().includes('heo') || text.toLowerCase().includes('lợn')) {
            mockResults.push({ ingredient: 'Thịt heo', confidence: 0.88 });
          }
          if (text.toLowerCase().includes('tôm')) {
            mockResults.push({ ingredient: 'Tôm', confidence: 0.92 });
          }
          
          setNlpResults(mockResults);
          
          // Auto-select high confidence (>= 0.7)
          const highConfidence = mockResults
            .filter(r => r.confidence >= 0.7)
            .map(r => r.ingredient);
          setSelectedIngredients(prev => {
            const newSelection = [...prev];
            highConfidence.forEach(ing => {
              if (!newSelection.includes(ing)) {
                newSelection.push(ing);
              }
            });
            return newSelection;
          });
          
          setIsParsing(false);
        }, 800); // Simulate API delay
      } else {
        setNlpResults([]);
      }
    }, 600);
  };

  const toggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  // Swipe handlers
  const handleDragStart = (clientX: number, clientY: number) => {
    startPosRef.current = { x: clientX, y: clientY };
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startPosRef.current.x;
    setSwipeOffset(deltaX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const SWIPE_THRESHOLD = 100;
    const deltaX = swipeOffset;
    
    // Check if swiped past threshold
    if (deltaX > SWIPE_THRESHOLD) {
      // Swipe right = Accept
      handleAccept();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      // Swipe left = Reject
      handleReject();
    }
    
    // Reset position
    setSwipeOffset(0);
    setIsDragging(false);
  };

  const getMealStatusLabel = (status: MealStatus) => {
    switch (status) {
      case 'off': return 'Tắt';
      case 'done': return 'Xong';
      case 'planning': return 'Đang chọn';
    }
  };

  return (
    <div 
      className="min-h-screen pb-20">
      
      {/* Trial Ribbon - S-12a (Days 11-14) */}
      {showTrialRibbon && (
        <TrialRibbon daysRemaining={trialDaysRemaining} />
      )}
      
      {/* Header Section */}
      <div className="px-4 pt-6 pb-4">
        
        {/* Meal Tabs */}
        <div className="flex items-center justify-center gap-8 mb-6 overflow-x-auto pb-2">
          {(['dinner', 'lunch', 'breakfast'] as MealType[]).map((meal) => {
            const status = mealStatuses[meal];
            const isActive = meal === activeMeal;
            
            return (
              <button
                key={meal}
                onClick={() => status !== 'off' && setActiveMeal(meal)}
                className="flex flex-col items-center gap-1 pb-1 whitespace-nowrap transition-all relative"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--color-text-primary)' : '3px solid transparent',
                  color: status === 'off' ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
                  opacity: status === 'off' ? 0.5 : 1,
                  cursor: status === 'off' ? 'not-allowed' : 'pointer',
                  minWidth: '80px'
                }}>
                <div className="flex items-center gap-2">
                  <span style={{ color: 'currentColor' }}>
                    {getMealIcon(meal)}
                  </span>
                  <span style={{ 
                    fontSize: '17px',
                    fontWeight: isActive ? 600 : 500
                  }}>
                    {getMealLabel(meal)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {status === 'done' && (
                    <Check size={12} strokeWidth={2} style={{ color: 'var(--color-health)' }} />
                  )}
                  <span 
                    style={{ 
                      fontSize: '13px',
                      color: status === 'done' ? 'var(--color-health)' : 'var(--color-text-secondary)',
                      fontWeight: 400
                    }}>
                    {getMealStatusLabel(status)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Care Days Counter */}
        {careDays >= 1 && (
          <div className="flex items-center justify-between gap-3 mb-4">
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)'
              }}>
              <Sprout 
                size={16} 
                strokeWidth={1.5} 
                style={{ color: 'var(--color-health)' }} 
              />
              <span
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)'
                }}>
                <strong style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {careDays}
                </strong> ngày gia đình được chăm sóc
              </span>
            </div>

            {/* Test Button for Soft Nudge Modal */}
            <button
              onClick={() => setShowSoftNudge(true)}
              className="px-3 py-2 rounded-lg transition-all flex-shrink-0"
              style={{
                backgroundColor: 'var(--color-warn-light)',
                border: '1px solid var(--color-warn-border)',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--color-warn)'
              }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/></svg>
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
              }}>
              Bữa {getMealLabel(activeMeal).toLowerCase()} · {familySize} người
            </span>
            <span
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)'
              }}>
              {completedSlots}/4 món
            </span>
          </div>
          
          {/* Slot Progress Pills */}
          <div className="flex items-center gap-2">
            {slots.map((slot, index) => (
              <div
                key={slot.type}
                className="h-2 flex-1 rounded-full transition-all"
                style={{
                  backgroundColor: slot.completed 
                    ? 'var(--color-health)' 
                    : index === currentSlotIndex
                      ? 'var(--color-text-primary)'
                      : 'var(--color-surface-alt)',
                  border: slot.completed || index === currentSlotIndex
                    ? 'none'
                    : '1px solid var(--color-border)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Current Slot Indicator */}
        {currentSlot && (
          <div 
            className="px-4 py-3 rounded-lg mb-4"
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              border: '1px solid var(--color-border)'
            }}>
            <div className="flex items-center justify-between">
              <span
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)'
                }}>
                Đang chọn: <strong style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {currentSlot.name}
                </strong>
              </span>
              <span
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  fontSize: '11px',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 500
                }}>
                {currentDish?.dishType}
              </span>
            </div>
          </div>
        )}

        {/* Memory Banner - only show if >= 10 meals */}
        {totalMeals >= 10 && (
          <div 
            className="px-4 py-3 rounded-lg mb-4 flex items-center gap-3"
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              border: '1px solid var(--color-health-border)'
            }}>
            <Lightbulb 
              size={16} 
              strokeWidth={1.5} 
              style={{ color: 'var(--color-primary)' }} 
            />
            <span
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.5'
              }}>
              Dựa trên <strong style={{ fontWeight: 600 }}>{totalMeals} bữa</strong>
            </span>
          </div>
        )}

        {/* Fridge Toggle */}
        <FridgeModeUI
          isActive={fridgeMode}
          selectedIngredients={selectedIngredients}
          onToggle={() => {
            const newFridgeMode = !fridgeMode;
            setFridgeMode(newFridgeMode);
            
            // Only show sheet when turning ON
            if (newFridgeMode) {
              setShowFridgeSheet(true);
            }
          }}
          tier0Count={0}
          tier1Count={0}
        />

        {/* Done Slots Recap - S-06 (only show when ≥ 1 slot completed) */}
        {completedSlots > 0 && !isDeckEmpty && (
          <div 
            className="rounded-2xl p-4 mb-4"
            style={{
              backgroundColor: '#f0faf5',
              border: '1px solid var(--color-health-border)'
            }}>
            <div className="flex items-center gap-2 mb-3">
              <Check size={16} strokeWidth={2} style={{ color: 'var(--color-health)' }} />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)'
                }}>
                Đã chọn ({completedSlots}/4)
              </span>
            </div>
            
            {/* Thumbnails Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {slots.filter(s => s.completed).map((slot) => (
                <div 
                  key={slot.type}
                  className="flex-shrink-0"
                  style={{ width: '80px' }}>
                  <div 
                    className="rounded-lg overflow-hidden mb-2"
                    style={{
                      width: '80px',
                      height: '80px',
                      border: '1px solid var(--color-border)'
                    }}>
                    <img 
                      src={slot.dish?.imageUrl}
                      alt={slot.dish?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-secondary)',
                      textAlign: 'center',
                      lineHeight: '1.3'
                    }}>
                    {slot.dish?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Swipe Card */}
      {!isDeckEmpty && currentDish && (
        <div className="px-4 mb-6">
          <div 
            className="rounded-3xl overflow-hidden relative"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1.5px solid var(--color-border-strong)',
              transform: isDragging 
                ? `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.05}deg)` 
                : 'translateX(0) rotate(0deg)',
              transition: isDragging ? 'none' : 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1.0)',
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'none',
              userSelect: 'none'
            }}
            onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
            onMouseMove={(e) => isDragging && handleDragMove(e.clientX, e.clientY)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => isDragging && handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleDragEnd}>
            
            {/* Swipe Overlay Tint */}
            {isDragging && Math.abs(swipeOffset) > 20 && (
              <div 
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  backgroundColor: swipeOffset > 0 
                    ? 'rgba(90, 138, 106, 0.06)' // Green tint for accept
                    : 'rgba(217, 98, 43, 0.06)', // Terracotta tint for reject
                  transition: 'background-color 150ms ease'
                }}
              />
            )}
            
            {/* Card Image */}
            <div 
              className="relative"
              style={{ height: '180px' }}>
              <img 
                src={currentDish.imageUrl}
                alt={currentDish.name}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(30,20,16,0.7) 0%, transparent 55%)'
                }}
              />
              {/* Dish Name on Image */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: '1.2'
                  }}>
                  {currentDish.name}
                </h3>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
              {/* Health Tags + Meta Info Pills */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {/* Health Tags */}
                {currentDish.healthTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-health-light)',
                      border: '1px solid var(--color-health-border)',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--color-health)'
                    }}>
                    {tag}
                  </span>
                ))}
                
                {/* Cooking Time Badge */}
                <span
                  className="px-3 py-1 rounded-full flex items-center gap-1"
                  style={{
                    backgroundColor: 'var(--color-surface-alt)',
                    border: '1px solid var(--color-border)',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)'
                  }}>
                  <Clock size={12} strokeWidth={1.5} style={{ color: 'currentColor' }} />
                  {currentDish.cookingTime}
                </span>
              </div>

              {/* Trust Badge */}
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)'
                }}>
                <Building2 size={12} strokeWidth={1.5} style={{ color: 'var(--color-text-secondary)' }} />
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-text-secondary)'
                  }}>
                  Dữ liệu dinh dưỡng Viện DD Quốc Gia
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div 
              className="flex items-center justify-center gap-4 py-4"
              style={{
                borderTop: '1px solid var(--color-border)'
              }}>
              {/* Reject */}
              <button
                onClick={handleReject}
                className="rounded-full flex items-center justify-center transition-all hover-bg-alt"
                style={{
                  width: '48px',
                  height: '48px',
                  border: '1.5px solid var(--color-border-strong)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)'
                }}>
                <X size={20} strokeWidth={1.5} />
              </button>

              {/* Defer */}
              <button
                onClick={handleDefer}
                className="rounded-full flex items-center justify-center transition-all hover-bg-alt"
                style={{
                  width: '48px',
                  height: '48px',
                  border: '1.5px solid var(--color-border-strong)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)'
                }}>
                <Lightbulb size={20} strokeWidth={1.5} />
              </button>

              {/* Accept */}
              <button
                onClick={handleAccept}
                className="rounded-full flex items-center justify-center transition-all hover-bg-dark"
                style={{
                  width: '48px',
                  height: '48px',
                  border: '1.5px solid var(--color-text-primary)',
                  backgroundColor: 'var(--color-text-primary)',
                  color: '#ffffff'
                }}>
                <Check size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Change Slot Type Link */}
          <div className="text-center mt-4">
            <button
              onClick={() => setShowChangeSlotSheet(true)}
              className="transition-colors hover-text-accent"
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                fontWeight: 500
              }}>
              Không thích món này? Đổi loại
            </button>
          </div>
        </div>
      )}

      {/* Empty Deck State - S-05e */}
      {isDeckEmpty && currentSlot && (
        <div className="px-4 mb-6">
          {/* Empty Card */}
          <div 
            className="rounded-3xl overflow-hidden p-8 flex flex-col items-center text-center mb-6"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '2px dashed var(--color-border-strong)'
            }}>
            <UtensilsCrossed 
              size={32} 
              strokeWidth={1.5} 
              style={{ color: 'var(--color-border)', marginBottom: '16px' }} 
            />
            <h3
              style={{
                fontSize: '17px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '8px'
              }}>
              Đã xem hết món phù hợp cho slot {currentSlot.name}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.6'
              }}>
              Thử mở rộng điều kiện lọc, đổi loại slot, hoặc nhập tên món
            </p>
          </div>

          {/* Escape Options */}
          <div className="flex flex-col gap-3 mb-6">
            {/* Escape 1: Expand Filters */}
            <button
              onClick={() => setShowFilterSheet(true)}
              className="btn btn-primary btn-lg w-full">
              Mở rộng bộ lọc →
            </button>

            {/* Escape 2: Change Slot Type */}
            <button
              onClick={() => setShowChangeSlotSheet(true)}
              className="btn btn-outline btn-lg w-full hover-bg-primary-light">
              Đổi loại slot này
            </button>
          </div>

          {/* Escape 3: Manual Entry Link */}
          <div className="text-center mb-8">
            <button
              onClick={() => {
                console.log('Navigate to manual dish entry');
              }}
              className="transition-colors hover-text-accent"
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                fontWeight: 500
              }}>
              Nhập tên món thủ công
            </button>
          </div>

          {/* Recap Section - Completed Dishes */}
          {completedSlots > 0 && (
            <div 
              className="rounded-2xl p-4"
              style={{
                backgroundColor: '#F0FAF5',
                border: '1px solid var(--color-health-border)'
              }}>
              <div className="flex items-center gap-2 mb-3">
                <Check size={16} strokeWidth={2} style={{ color: 'var(--color-health)' }} />
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                  Đã chọn ({completedSlots}/4)
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {slots.filter(s => s.completed).map((slot) => (
                  <div 
                    key={slot.type}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)'
                    }}>
                    <span
                      style={{
                        fontSize: '13px',
                        color: 'var(--color-text-secondary)'
                      }}>
                      {slot.name}
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)'
                      }}>
                      {slot.dish?.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Expansion Bottom Sheet */}
      <BottomSheet
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        title="Mở rộng bộ lọc"
        subtitle="Chọn tiêu chí để xem thêm món phù hợp"
      >
        {/* Filter Options */}
        <div className="flex flex-col gap-3 mb-6">
          {[
            { key: 'addTime' as const, title: 'Tăng thời gian nấu thêm 15 phút', desc: 'Xem thêm món cn thời gian dài hơn' },
            { key: 'addBudget' as const, title: 'Tăng ngân sách thêm 30%', desc: 'Xem thêm món đắt hơn một chút' },
            { key: 'removeFridge' as const, title: 'Bỏ điều kiện "Tủ lạnh"', desc: 'Xem tất cả món, không ưu tiên nguyên liệu có sẵn' }
          ].map((option) => (
            <label
              key={option.key}
              className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all"
              style={{
                border: '1px solid var(--color-border)',
                backgroundColor: filterOptions[option.key] ? 'var(--color-surface-alt)' : 'transparent'
              }}>
              <input
                type="checkbox"
                checked={filterOptions[option.key]}
                onChange={(e) => setFilterOptions({...filterOptions, [option.key]: e.target.checked})}
                className="w-5 h-5 rounded"
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <div className="flex-1">
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                  {option.title}
                </div>
                <p className="body-text-sm">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Apply Button */}
        <button
          onClick={() => {
            setShowFilterSheet(false);
            setIsDeckEmpty(false);
            setCurrentDishIndex(0);
            console.log('Apply filters:', filterOptions);
          }}
          className="btn btn-primary btn-lg w-full">
          Áp dụng và xem món mới
        </button>
      </BottomSheet>

      {/* Fridge Sheet */}
      <FridgeSheet
        isOpen={showFridgeSheet}
        onClose={() => setShowFridgeSheet(false)}
        nlpInput={nlpInput}
        onNLPInput={handleNLPInput}
        isParsing={isParsing}
        nlpResults={nlpResults}
        selectedIngredients={selectedIngredients}
        onToggleIngredient={toggleIngredient}
        onApply={() => {
          setShowFridgeSheet(false);
          console.log('Apply fridge ingredients:', selectedIngredients);
        }}
      />

      {/* Change Slot Type Sheet */}
      <ChangeSlotSheet
        isOpen={showChangeSlotSheet}
        onClose={() => setShowChangeSlotSheet(false)}
        currentSlotType={currentSlot?.type || 'protein'}
        currentSlotName={currentSlot?.name || 'Món mặn'}
        onChangeSlot={(newSlotType: string) => {
          // Update slot type logic
          const newSlots = [...slots];
          newSlots[currentSlotIndex] = {
            ...currentSlot,
            type: newSlotType as SlotType,
            name: getSlotLabel(newSlotType as SlotType)
          };
          setSlots(newSlots);
          setShowChangeSlotSheet(false);
          setCurrentDishIndex(0); // Reset deck
          setIsDeckEmpty(false);
          console.log('Changed slot type to:', newSlotType);
        }}
        onDeleteSlot={() => {
          // Delete current slot
          const newSlots = slots.filter((_, index) => index !== currentSlotIndex);
          setSlots(newSlots);
          setShowChangeSlotSheet(false);
          console.log('Deleted slot');
        }}
      />

      {/* Soft Nudge Modal - S-12b (Day 12, shown once) */}
      <SoftNudgeModal
        isOpen={showSoftNudge}
        onDismiss={() => {
          setShowSoftNudge(false);
          if (user?.id) markSoftNudgeShown(user.id);
        }}
        daysRemaining={trialDaysRemaining}
        totalDays={12}
        mealsCompleted={15}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}