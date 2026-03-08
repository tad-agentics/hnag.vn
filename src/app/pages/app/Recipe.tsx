import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Share2, Clock, Users, DollarSign, Check, AlertCircle, ChefHat, Timer } from "lucide-react";

interface Ingredient {
  name: string;
  quantity: string;
}

interface HealthTag {
  label: string;
  status: 'safe' | 'caution'; // safe = green check, caution = amber warning
}

interface CookingStep {
  id: number;
  instruction: string;
  timerMinutes?: number;
  status: 'done' | 'active' | 'pending';
}

interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

interface Tip {
  text: string;
  isPersonalized?: boolean;
  memberName?: string;
}

interface SimilarDish {
  id: string;
  name: string;
  imageUrl: string;
  cookingTime: string;
  servings: string;
}

export function RecipeScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const dishId = searchParams.get('dish') || '1';
  const returnPath = searchParams.get('return') || '/app/home';
  const sequential = searchParams.get('sequential') === 'true';
  
  // Mock recipe data - in real app, fetch based on dishId
  const recipe = {
    id: dishId,
    name: 'Canh Chua Cá Lóc',
    slotType: 'soup',
    slotLabel: 'CANH',
    slotProgress: '3/4',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800',
    cookingTime: '30 phút',
    servings: '4 người',
    cost: '65k',
    healthFit: 'PHỤC HỢP VỚI GIA ĐÌNH',
    healthTags: [
      { label: 'An toàn cho trẻ em', status: 'safe' as const },
      { label: 'Phù hợp người cao tuổi', status: 'safe' as const },
      { label: 'Lưu ý: Có cá', status: 'caution' as const },
    ],
    ingredients: [
      { name: 'Cá lóc', quantity: '500g' },
      { name: 'Cà chua', quantity: '3 quả' },
      { name: 'Dứa (thơm)', quantity: '1/4 quả' },
      { name: 'Giá đỗ', quantity: '100g' },
      { name: 'Rau ngổ', quantity: '1 bó nhỏ' },
      { name: 'Hành tím', quantity: '3 củ' },
      { name: 'Tỏi', quantity: '2 tép' },
      { name: 'Me', quantity: '1 tbsp' },
      { name: 'Nước mắm', quantity: '2 tbsp' },
      { name: 'Đường', quantity: '1 tsp' },
      { name: 'Muối', quantity: '1/2 tsp' },
      { name: 'Bột canh', quantity: '1/2 tsp' },
    ],
    cookingSteps: [
      { id: 1, instruction: 'Sơ chế cá lóc, cắt thành miếng nhỏ.', status: 'pending' as const },
      { id: 2, instruction: 'Chuẩn bị các nguyên liệu khác.', status: 'pending' as const },
      { id: 3, instruction: 'Đun nước sôi, thêm cá lóc vào.', timerMinutes: 5, status: 'pending' as const },
      { id: 4, instruction: 'Thêm cà chua, dứa, giá đỗ vào nước.', status: 'pending' as const },
      { id: 5, instruction: 'Đun nhỏ lửa, thêm rau ngổ, hành tím, tỏi.', status: 'pending' as const },
      { id: 6, instruction: 'Thêm me, nước mắm, đường, muối, bột canh.', status: 'pending' as const },
      { id: 7, instruction: 'Đun nhỏ lửa, nấu thêm 10 phút.', status: 'pending' as const },
      { id: 8, instruction: 'Dùng muỗng canh lấy ra cá lóc, rau ngổ.', status: 'pending' as const },
      { id: 9, instruction: 'Đổ canh vào tô, thưởng thức.', status: 'pending' as const },
    ],
    nutritionInfo: {
      calories: '200',
      protein: '15g',
      carbs: '10g',
      fat: '5g'
    }
  };

  const tips: Tip[] = [
    { text: 'Nên chọn cá lóc tươi, không có mùi hôi để món ăn ngon hơn.' },
    { text: 'Có thể thay thế dứa bằng khế hoặc me tươi để tạo vị chua tự nhiên.' },
    { 
      text: 'Bé An (7 tuổi) thích ăn canh không chua quá. Giảm lượng me xuống còn 1/2 tbsp.',
      isPersonalized: true,
      memberName: 'Bé An'
    },
  ];

  const similarDishes: SimilarDish[] = [
    {
      id: '2',
      name: 'Canh Chua Tôm',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
      cookingTime: '25 phút',
      servings: '4 người'
    },
    {
      id: '3',
      name: 'Canh Rau Muống',
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
      cookingTime: '15 phút',
      servings: '4 người'
    },
    {
      id: '4',
      name: 'Canh Bí Đỏ',
      imageUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400',
      cookingTime: '20 phút',
      servings: '4 người'
    },
  ];

  const handleShare = () => {
    console.log('Share recipe');
    // In real app: trigger share dialog
  };

  const handleStartCooking = () => {
    navigate('/app/cooking?dish=' + dishId);
  };

  const handleChangeDish = () => {
    if (returnPath === 'summary') {
      navigate('/app/summary');
    } else {
      navigate('/app/home');
    }
  };

  return (
    <div 
      className="min-h-screen pb-32">
      
      {/* Hero Section */}
      <div 
        className="relative"
        style={{ height: '360px' }}>
        {/* Hero Image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${recipe.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(30,20,16,0.3) 0%, rgba(30,20,16,0.7) 100%)'
          }}
        />

        {/* Top Actions */}
        <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-10">
          {/* Back Button */}
          <button
            onClick={() => navigate(returnPath === 'summary' ? '/app/summary' : '/app/home')}
            className="rounded-full flex items-center justify-center transition-all"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              color: 'var(--color-text-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }}>
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="rounded-full flex items-center justify-center transition-all"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              color: 'var(--color-text-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }}>
            <Share2 size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Slot Badge Overlay */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
          <div 
            className="px-4 py-2 rounded-full"
            style={{
              backgroundColor: 'rgba(30, 20, 16, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: '#ffffff'
              }}>
              {recipe.slotLabel} · {recipe.slotProgress}
            </span>
          </div>
        </div>

        {/* Dish Info Overlay (Bottom of Hero) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          {/* Dish Name */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 600,
              color: '#ffffff',
              marginBottom: '12px',
              lineHeight: '1.2'
            }}>
            {recipe.name}
          </h1>

          {/* Meta Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Time */}
            <div 
              className="px-3 py-1 rounded-full flex items-center gap-1"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)'
              }}>
              <Clock size={12} strokeWidth={1.5} style={{ color: '#ffffff' }} />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#ffffff'
                }}>
                {recipe.cookingTime}
              </span>
            </div>

            {/* Servings */}
            <div 
              className="px-3 py-1 rounded-full flex items-center gap-1"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)'
              }}>
              <Users size={12} strokeWidth={1.5} style={{ color: '#ffffff' }} />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#ffffff'
                }}>
                {recipe.servings}
              </span>
            </div>

            {/* Cost */}
            <div 
              className="px-3 py-1 rounded-full flex items-center gap-1"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)'
              }}>
              <DollarSign size={12} strokeWidth={1.5} style={{ color: '#ffffff' }} />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#ffffff'
                }}>
                {recipe.cost}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 pt-6">
        
        {/* Health Fit Section */}
        <div className="mb-6">
          {/* Health Fit Label */}
          <div 
            className="inline-block px-3 py-1 rounded-full mb-3"
            style={{
              backgroundColor: 'var(--color-health-light)',
              border: '1px solid var(--color-health-border)'
            }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: 'var(--color-health)'
              }}>
              {recipe.healthFit}
            </span>
          </div>

          {/* Health Tags */}
          <div className="flex flex-col gap-2">
            {recipe.healthTags.map((tag, index) => (
              <div 
                key={index}
                className="flex items-center gap-2">
                {tag.status === 'safe' ? (
                  <Check 
                    size={14} 
                    strokeWidth={2} 
                    style={{ 
                      color: 'var(--color-health)',
                      flexShrink: 0 
                    }} 
                  />
                ) : (
                  <AlertCircle 
                    size={14} 
                    strokeWidth={1.5} 
                    style={{ 
                      color: 'var(--color-warn)',
                      flexShrink: 0 
                    }} 
                  />
                )}
                <span
                  style={{
                    fontSize: '14px',
                    color: tag.status === 'safe' 
                      ? 'var(--color-text-secondary)' 
                      : 'var(--color-warn)'
                  }}>
                  {tag.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wavy Divider */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[...Array(7)].map((_, i) => (
            <span 
              key={i}
              style={{ 
                color: 'var(--color-border)',
                fontSize: '14px'
              }}>
              ~
            </span>
          ))}
        </div>

        {/* Ingredients Panel */}
        <div 
          className="rounded-2xl overflow-hidden mb-6 relative"
          style={{
            border: '1.5px solid var(--color-border-strong)',
            backgroundColor: 'var(--color-surface)'
          }}>
          
          {/* Floating Label */}
          <div 
            className="absolute rounded-full px-4 py-1"
            style={{
              top: '-12px',
              left: '20px',
              backgroundColor: 'var(--color-surface)',
              border: '1.5px solid var(--color-border-strong)',
              zIndex: 10
            }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: 'var(--color-primary)',
                textTransform: 'uppercase'
              }}>
              Nguyên liệu
            </span>
          </div>

          {/* Ingredients Grid */}
          <div 
            className="p-5 pt-6"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px 20px'
            }}>
            {recipe.ingredients.map((ingredient, index) => (
              <div 
                key={index}
                className="flex flex-col">
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    marginBottom: '2px'
                  }}>
                  {ingredient.name}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)'
                  }}>
                  {ingredient.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wavy Divider */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[...Array(7)].map((_, i) => (
            <span 
              key={i}
              style={{ 
                color: 'var(--color-border)',
                fontSize: '14px'
              }}>
              ~
            </span>
          ))}
        </div>

        {/* Cooking Steps Section */}
        <div className="mb-6">
          {/* Section Label */}
          <div className="mb-4">
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: 'var(--color-primary)',
                textTransform: 'uppercase'
              }}>
              Cách nấu
            </span>
          </div>

          {/* Steps Timeline */}
          <div className="relative">
            {recipe.cookingSteps.map((step, index) => {
              const isLast = index === recipe.cookingSteps.length - 1;
              const isDone = step.status === 'done';
              const isActive = step.status === 'active';
              const isPending = step.status === 'pending';
              
              return (
                <div 
                  key={step.id}
                  className="relative flex gap-4 pb-6">
                  
                  {/* Step Number Circle */}
                  <div className="relative flex-shrink-0">
                    {/* Connector Line */}
                    {!isLast && (
                      <div 
                        className="absolute left-1/2 top-8 bottom-0"
                        style={{
                          width: '1px',
                          backgroundColor: isDone 
                            ? 'var(--color-health)' 
                            : 'var(--color-border)',
                          transform: 'translateX(-0.5px)'
                        }}
                      />
                    )}
                    
                    {/* Circle */}
                    <div 
                      className="rounded-full flex items-center justify-center relative z-10"
                      style={{
                        width: '28px',
                        height: '28px',
                        border: isDone 
                          ? 'none'
                          : isActive
                            ? '2px solid var(--color-primary)'
                            : '1px solid var(--color-border)',
                        backgroundColor: isDone
                          ? 'var(--color-health)'
                          : isActive
                            ? 'var(--color-surface)'
                            : 'transparent'
                      }}>
                      {isDone ? (
                        <Check 
                          size={14} 
                          strokeWidth={2.5} 
                          style={{ color: '#ffffff' }} 
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: isActive ? '13px' : '12px',
                            fontWeight: isActive ? 700 : 500,
                            color: isActive 
                              ? 'var(--color-primary)' 
                              : 'var(--color-text-disabled)'
                          }}>
                          {step.id}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pt-1">
                    {/* Instruction */}
                    <p
                      style={{
                        fontSize: '15px',
                        fontWeight: isActive ? 600 : 400,
                        color: isPending 
                          ? 'var(--color-text-secondary)' 
                          : 'var(--color-text-primary)',
                        lineHeight: '1.6',
                        marginBottom: step.timerMinutes ? '8px' : '0'
                      }}>
                      {step.instruction}
                    </p>

                    {/* Timer Pill (if applicable) */}
                    {step.timerMinutes && isActive && (
                      <div 
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: 'var(--color-warn-light)',
                          border: '1px solid var(--color-warn-border)'
                        }}>
                        <Timer 
                          size={12} 
                          strokeWidth={1.5} 
                          style={{ color: 'var(--color-warn)' }} 
                        />
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--color-warn)'
                          }}>
                          {step.timerMinutes} phút
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wavy Divider */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[...Array(7)].map((_, i) => (
            <span 
              key={i}
              style={{ 
                color: 'var(--color-border)',
                fontSize: '14px'
              }}>
              ~
            </span>
          ))}
        </div>

        {/* Nutrition Info */}
        <div className="mb-8">
          {/* Section Label */}
          <div className="mb-4">
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: 'var(--color-primary)',
                textTransform: 'uppercase'
              }}>
              Dinh dưỡng
            </span>
          </div>

          {/* 4-Column Grid */}
          <div 
            className="rounded-xl p-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px'
            }}>
            
            {/* Calories */}
            <div className="flex flex-col items-center">
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '4px'
                }}>
                {recipe.nutritionInfo.calories}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center'
                }}>
                Kcal
              </span>
            </div>

            {/* Protein */}
            <div className="flex flex-col items-center">
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '4px'
                }}>
                {recipe.nutritionInfo.protein}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center'
                }}>
                Protein
              </span>
            </div>

            {/* Carbs */}
            <div className="flex flex-col items-center">
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '4px'
                }}>
                {recipe.nutritionInfo.carbs}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center'
                }}>
                Carb
              </span>
            </div>

            {/* Fat */}
            <div className="flex flex-col items-center">
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '4px'
                }}>
                {recipe.nutritionInfo.fat}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center'
                }}>
                Fat
              </span>
            </div>
          </div>
        </div>

        {/* Wavy Divider */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[...Array(7)].map((_, i) => (
            <span 
              key={i}
              style={{ 
                color: 'var(--color-border)',
                fontSize: '14px'
              }}>
              ~
            </span>
          ))}
        </div>

        {/* Tips Card */}
        <div 
          className="rounded-xl mb-8 overflow-hidden relative"
          style={{
            border: '1px solid var(--color-border-strong)',
            backgroundColor: 'var(--color-surface)'
          }}>
          
          {/* Floating Label */}
          <div 
            className="absolute rounded-full px-4 py-1"
            style={{
              top: '-12px',
              left: '20px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-strong)',
              zIndex: 10
            }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: 'var(--color-primary)',
                textTransform: 'uppercase'
              }}>
              Mẹo nhỏ
            </span>
          </div>

          {/* Tips List */}
          <div className="p-5 pt-6">
            {tips.map((tip, index) => (
              <div 
                key={index}
                className="mb-4 last:mb-0"
                style={{
                  backgroundColor: tip.isPersonalized ? 'var(--color-surface-alt)' : 'transparent',
                  padding: tip.isPersonalized ? '12px' : '0',
                  borderRadius: tip.isPersonalized ? '8px' : '0'
                }}>
                <div className="flex gap-3">
                  {/* Bullet */}
                  <div 
                    className="rounded-full flex-shrink-0"
                    style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: 'var(--color-primary)',
                      marginTop: '7px'
                    }}
                  />
                  
                  {/* Tip Content */}
                  <div className="flex-1">
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.65',
                        marginBottom: tip.isPersonalized ? '8px' : '0'
                      }}>
                      {tip.text}
                    </p>
                    
                    {/* Personalized Tag */}
                    {tip.isPersonalized && tip.memberName && (
                      <div 
                        className="inline-flex items-center px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: 'var(--color-primary-light)',
                          border: '1px solid var(--color-primary-border)'
                        }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: 'var(--color-primary)'
                          }}>
                          Personalized · {tip.memberName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Dishes Section */}
        <div className="mb-8">
          {/* Section Header */}
          <div className="mb-3 flex items-center justify-between">
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: 'var(--color-primary)',
                textTransform: 'uppercase'
              }}>
              Gợi ý thêm
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-text-disabled)'
              }}>
              ← kéo để xem →
            </span>
          </div>

          {/* Horizontal Scroll */}
          <div 
            className="flex gap-3 overflow-x-auto pb-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}>
            {similarDishes.map((dish) => (
              <div
                key={dish.id}
                onClick={() => navigate('/app/recipe?dish=' + dish.id)}
                className="rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                style={{
                  width: '160px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)'
                }}>
                
                {/* Dish Image */}
                <div 
                  style={{
                    height: '120px',
                    backgroundImage: `url(${dish.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />

                {/* Dish Info */}
                <div className="p-3">
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      marginBottom: '6px',
                      lineHeight: '1.3'
                    }}>
                    {dish.name}
                  </h4>

                  {/* Meta */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Clock size={10} strokeWidth={1.5} style={{ color: 'var(--color-text-disabled)' }} />
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-disabled)'
                        }}>
                        {dish.cookingTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={10} strokeWidth={1.5} style={{ color: 'var(--color-text-disabled)' }} />
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-disabled)'
                        }}>
                        {dish.servings}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div 
          className="rounded-xl mb-8 overflow-hidden relative"
          style={{
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-alt)'
          }}>
          
          {/* Floating Label */}
          <div 
            className="absolute rounded-full px-4 py-1"
            style={{
              top: '-12px',
              right: '20px',
              backgroundColor: 'var(--color-surface-alt)',
              border: '1px solid var(--color-border)',
              zIndex: 10
            }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase'
              }}>
              Lưu ý
            </span>
          </div>

          {/* Disclaimer Text */}
          <div className="p-5 pt-6">
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.7'
              }}>
              Thông tin dinh dưỡng và lời khuyên chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến bác sĩ hoặc chuyên gia dinh dưỡng nếu bạn có bất kỳ vấn đề sức khỏe đặc biệt nào.
            </p>
          </div>
        </div>

      </div>

      {/* Sticky CTA Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-4"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          boxShadow: '0 -2px 16px rgba(30, 20, 16, 0.08)'
        }}>
        <div className="flex items-center gap-3">
          {/* Primary CTA */}
          <button
            onClick={handleStartCooking}
            className="btn btn-primary flex-1 rounded-full transition-all flex items-center justify-center gap-2"
            style={{
              height: '52px'
            }}>
            <ChefHat size={18} strokeWidth={1.5} />
            Bắt đầu nấu
          </button>

          {/* Outline CTA */}
          <button
            onClick={handleChangeDish}
            className="flex-1 rounded-full transition-all hover-bg-alt"
            style={{
              height: '52px',
              backgroundColor: 'transparent',
              border: '2px solid var(--color-border-strong)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)'
            }}>
            Đổi món
          </button>
        </div>
      </div>
    </div>
  );
}