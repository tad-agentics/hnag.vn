import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Home, Share2, Lightbulb, Leaf, ThumbsDown, Meh, Heart, Bell } from "lucide-react";

interface CompletedDish {
  id: string;
  name: string;
  imageUrl: string;
  slotType: string;
}

export function CompleteScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [rating, setRating] = useState<'bad' | 'ok' | 'love' | null>(null);
  const [showNotificationOptIn, setShowNotificationOptIn] = useState(false);
  
  // Dynamic notification time (based on user preference or default)
  const notificationTime = '18:00'; // Could be dynamic based on meal planning time
  
  // Mock data
  const mealData = {
    date: 'Thứ Hai, 8 tháng 3, 2026',
    mealType: 'Bữa trưa',
    cookingTime: '45 phút',
    completedDishes: [
      {
        id: '1',
        name: 'Thịt Kho Tàu',
        imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=100',
        slotType: 'main'
      },
      {
        id: '2',
        name: 'Canh Chua Cá Lóc',
        imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=100',
        slotType: 'soup'
      },
      {
        id: '3',
        name: 'Rau Muống Xào',
        imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100',
        slotType: 'veggie'
      },
      {
        id: '4',
        name: 'Cơm Trắng',
        imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=100',
        slotType: 'rice'
      },
    ] as CompletedDish[],
    totalMealsMemorized: 24,
    dishesAvoidedDays: 12,
    careStreak: 8,
    recognitionCopy: 'Bữa hôm nay phù hợp Ba — không có món nào cần tránh',
    trialDaysLeft: 5, // Set to 0 if not in trial, or null
    isFirstCompletion: true // Set true for first time overlay - CHANGED TO TRUE FOR DEMO
  };

  // Check if should show notification opt-in
  useEffect(() => {
    if (mealData.isFirstCompletion) {
      // Check if notification permission is already granted
      if ('Notification' in window) {
        if (Notification.permission !== 'granted') {
          // Show opt-in overlay after brief delay
          setTimeout(() => {
            setShowNotificationOptIn(true);
          }, 500);
        }
      }
    }
  }, [mealData.isFirstCompletion]);

  const handleShare = () => {
    console.log('Share meal completion');
    // In real app: trigger share dialog
  };

  const handleGoHome = () => {
    navigate('/app/home');
  };

  const handleRating = (value: 'bad' | 'ok' | 'love') => {
    setRating(value);
    // In real app: save rating to backend
    console.log('Meal rated:', value);
  };

  const handleEnableNotifications = async () => {
    // Request notification permission
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notifications enabled for', notificationTime);
          // In real app: Save notification preference to backend
          setShowNotificationOptIn(false);
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  const handleDismissNotifications = () => {
    setShowNotificationOptIn(false);
    // In real app: Track dismissal
    console.log('Notification opt-in dismissed');
  };

  return (
    <>
      <div 
        className="min-h-screen pb-8">
        
        {/* Content */}
        <div className="px-4 pt-12">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '12px',
                lineHeight: '1.3'
              }}>
              Gia đình được chăm sóc hôm nay.
            </h1>
            
            {/* Sub Info */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)'
                }}>
                {mealData.date}
              </span>
              <span style={{ color: 'var(--color-border)' }}>·</span>
              <span
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)'
                }}>
                {mealData.mealType}
              </span>
              <span style={{ color: 'var(--color-border)' }}>·</span>
              <span
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)'
                }}>
                {mealData.cookingTime}
              </span>
            </div>
          </div>

          {/* Dish Grid 2×2 */}
          <div 
            className="mb-8"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
            {mealData.completedDishes.map((dish) => (
              <div 
                key={dish.id}
                className="flex flex-col items-center">
                {/* Dish Thumbnail */}
                <div 
                  className="rounded-lg overflow-hidden mb-2"
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundImage: `url(${dish.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid var(--color-border)'
                  }}
                />
                
                {/* Dish Name */}
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    textAlign: 'center'
                  }}>
                  {dish.name}
                </span>
              </div>
            ))}
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

          {/* Rating (Optional) */}
          <div className="mb-6">
            <p
              className="text-center mb-4"
              style={{
                fontSize: '15px',
                color: 'var(--color-text-secondary)'
              }}>
              Bữa này thế nào?
            </p>

            {/* Rating Buttons */}
            <div className="flex items-center justify-center gap-4">
              {/* Bad */}
              <button
                onClick={() => handleRating('bad')}
                className="rounded-full flex items-center justify-center transition-all"
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: rating === 'bad' ? 'var(--color-error-light)' : 'var(--color-surface)',
                  border: rating === 'bad' 
                    ? '2px solid var(--color-error)' 
                    : '1px solid var(--color-border)',
                  color: rating === 'bad' ? 'var(--color-error)' : 'var(--color-text-disabled)'
                }}
                onMouseEnter={(e) => {
                  if (rating !== 'bad') {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (rating !== 'bad') {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                  }
                }}>
                <ThumbsDown size={24} strokeWidth={1.5} />
              </button>

              {/* OK */}
              <button
                onClick={() => handleRating('ok')}
                className="rounded-full flex items-center justify-center transition-all"
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: rating === 'ok' ? 'var(--color-warn-light)' : 'var(--color-surface)',
                  border: rating === 'ok' 
                    ? '2px solid var(--color-warn)' 
                    : '1px solid var(--color-border)',
                  color: rating === 'ok' ? 'var(--color-warn)' : 'var(--color-text-disabled)'
                }}
                onMouseEnter={(e) => {
                  if (rating !== 'ok') {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (rating !== 'ok') {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                  }
                }}>
                <Meh size={24} strokeWidth={1.5} />
              </button>

              {/* Love */}
              <button
                onClick={() => handleRating('love')}
                className="rounded-full flex items-center justify-center transition-all"
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: rating === 'love' ? 'var(--color-primary-light)' : 'var(--color-surface)',
                  border: rating === 'love' 
                    ? '2px solid var(--color-primary)' 
                    : '1px solid var(--color-border)',
                  color: rating === 'love' ? 'var(--color-primary)' : 'var(--color-text-disabled)'
                }}
                onMouseEnter={(e) => {
                  if (rating !== 'love') {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (rating !== 'love') {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                  }
                }}>
                <Heart size={24} strokeWidth={1.5} />
              </button>
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

          {/* Memory Block */}
          <div 
            className="rounded-xl p-5 mb-4"
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              border: '1px solid var(--color-border)'
            }}>
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                <Lightbulb 
                  size={20} 
                  strokeWidth={1.5} 
                  style={{ color: 'var(--color-primary)' }} 
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.65'
                  }}>
                  <span style={{ fontWeight: 600 }}>Đã ghi nhớ</span> · {mealData.totalMealsMemorized} bữa của gia đình · {mealData.dishesAvoidedDays} món hôm nay không gợi ý lại trong 5 ngày.
                </p>
              </div>
            </div>
          </div>

          {/* Care Counter */}
          <div 
            className="rounded-xl p-5 mb-8"
            style={{
              backgroundColor: 'var(--color-health-light)',
              border: '1px solid var(--color-health-border)'
            }}>
            <div className="flex items-start gap-3 mb-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                <Leaf 
                  size={20} 
                  strokeWidth={1.5} 
                  style={{ color: 'var(--color-health)' }} 
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: '4px'
                  }}>
                  {mealData.careStreak} ngày chăm sóc
                </p>
                
                {/* Recognition Copy */}
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.6'
                  }}>
                  {mealData.recognitionCopy}
                </p>
              </div>
            </div>
          </div>

          {/* Trial Note (if applicable) */}
          {mealData.trialDaysLeft !== null && mealData.trialDaysLeft > 0 && (
            <div 
              className="rounded-xl p-4 mb-6"
              style={{
                backgroundColor: 'var(--color-primary-light)',
                border: '1px solid var(--color-primary-border)'
              }}>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-primary)',
                  lineHeight: '1.6',
                  textAlign: 'center'
                }}>
                Còn <span style={{ fontWeight: 600 }}>{mealData.trialDaysLeft} ngày</span> — khi sẵn sàng, giữ cho gia đình nhé{' '}
                <span 
                  onClick={() => navigate('/app/paywall')}
                  style={{ 
                    color: 'var(--color-primary)', 
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}>
                  →
                </span>
              </p>
            </div>
          )}

          {/* CTA Row */}
          <div className="flex items-center gap-3">
            {/* Go Home */}
            <button
              onClick={handleGoHome}
              className="btn btn-primary flex-1 rounded-full transition-all flex items-center justify-center gap-2"
              style={{
                height: '52px'
              }}>
              Về trang chủ
              <Home size={18} strokeWidth={1.5} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex-shrink-0 rounded-full transition-all flex items-center justify-center hover-bg-alt"
              style={{
                width: '52px',
                height: '52px',
                backgroundColor: 'transparent',
                border: '2px solid var(--color-border-strong)',
                color: 'var(--color-text-secondary)'
              }}>
              <Share2 size={18} strokeWidth={1.5} />
            </button>
          </div>

        </div>
      </div>

      {/* S-09n: Notification Opt-in Overlay */}
      {showNotificationOptIn && (
        <div 
          className="fixed inset-0 flex items-end justify-center z-50"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={handleDismissNotifications}>
          
          <div 
            className="w-full max-w-md px-5 pt-3 pb-8"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: '14px 14px 0 0',
              boxShadow: 'var(--shadow-overlay)'
            }}
            onClick={(e) => e.stopPropagation()}>
            
            {/* Drag Handle */}
            <div className="flex justify-center mb-5">
              <div 
                style={{
                  width: '36px',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: 'var(--color-border)'
                }}
              />
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div 
                className="rounded-full flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--color-primary-light)'
                }}>
                <Bell 
                  size={18} 
                  strokeWidth={1.5} 
                  style={{ color: 'var(--color-primary)' }} 
                />
              </div>
            </div>

            {/* Title */}
            <h2
              className="text-center mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
              }}>
              Muốn nhắc lúc {notificationTime} không?
            </h2>

            {/* Subtitle */}
            <p
              className="text-center mb-6"
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.6'
              }}>
              Mỗi tối, chúng mình sẽ nhắc bạn lên kế hoạch bữa ngày mai. Bạn có thể tắt bất cứ lúc nào.
            </p>

            {/* CTA: Enable */}
            <button
              onClick={handleEnableNotifications}
              className="w-full rounded-full transition-all mb-3 hover-bg-dark"
              style={{
                height: '52px',
                backgroundColor: 'var(--color-text-primary)',
                border: '2px solid var(--color-text-primary)',
                fontSize: '15px',
                fontWeight: 600,
                color: '#ffffff'
              }}>
              Nhắc tôi lúc {notificationTime}
            </button>

            {/* Dismiss */}
            <button
              onClick={handleDismissNotifications}
              className="w-full hover-text-dark"
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '12px'
              }}>
              Thôi được, cảm ơn
            </button>
          </div>
        </div>
      )}
    </>
  );
}