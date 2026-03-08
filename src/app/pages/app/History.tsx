import { useState } from "react";
import { useNavigate } from "react-router";
import { ThumbsDown, Meh, Heart } from "lucide-react";
import { BottomNav } from "../../components/BottomNav";

interface MealHistoryEntry {
  id: string;
  date: string;
  mealType: 'Bữa sáng' | 'Bữa trưa' | 'Bữa tối';
  timestamp: Date;
  dishes: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
  rating: 'bad' | 'ok' | 'love' | null;
  cookingTime: string;
  servings: number;
}

type FilterType = 'all' | 'week' | 'month';

export function HistoryScreen() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Mock data - empty for initial state
  const [historyEntries] = useState<MealHistoryEntry[]>([
    {
      id: '1',
      date: 'Hôm nay, 8/3',
      mealType: 'Bữa trưa',
      timestamp: new Date('2026-03-08T12:30:00'),
      dishes: [
        { id: '1', name: 'Thịt Kho Tàu', imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=100' },
        { id: '2', name: 'Canh Chua', imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=100' },
        { id: '3', name: 'Rau Muống', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100' },
        { id: '4', name: 'Cơm Trắng', imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=100' }
      ],
      rating: 'love',
      cookingTime: '45 phút',
      servings: 4
    },
    {
      id: '2',
      date: 'Hôm qua, 7/3',
      mealType: 'Bữa tối',
      timestamp: new Date('2026-03-07T18:45:00'),
      dishes: [
        { id: '5', name: 'Cá Kho Tộ', imageUrl: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=100' },
        { id: '6', name: 'Canh Rau', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100' },
        { id: '7', name: 'Đậu Hũ Xào', imageUrl: 'https://images.unsplash.com/photo-1571942953698-f87307ec5df9?w=100' },
        { id: '8', name: 'Cơm Trắng', imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=100' }
      ],
      rating: 'ok',
      cookingTime: '35 phút',
      servings: 4
    },
    {
      id: '3',
      date: 'Thứ 6, 6/3',
      mealType: 'Bữa trưa',
      timestamp: new Date('2026-03-06T12:00:00'),
      dishes: [
        { id: '9', name: 'Gà Xào Sả Ớt', imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=100' },
        { id: '10', name: 'Canh Bí Đỏ', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100' },
        { id: '11', name: 'Rau Cải', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100' },
        { id: '12', name: 'Cơm Trắng', imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=100' }
      ],
      rating: 'love',
      cookingTime: '40 phút',
      servings: 4
    }
  ]);

  // Filter entries based on selected filter
  const getFilteredEntries = () => {
    const now = new Date();
    
    if (activeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return historyEntries.filter(entry => entry.timestamp >= weekAgo);
    }
    
    if (activeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return historyEntries.filter(entry => entry.timestamp >= monthAgo);
    }
    
    return historyEntries;
  };

  const filteredEntries = getFilteredEntries();

  const getRatingIcon = (rating: 'bad' | 'ok' | 'love' | null) => {
    if (rating === 'bad') {
      return <ThumbsDown size={16} strokeWidth={1.5} style={{ color: 'var(--color-error)' }} />;
    }
    if (rating === 'ok') {
      return <Meh size={16} strokeWidth={1.5} style={{ color: 'var(--color-warn)' }} />;
    }
    if (rating === 'love') {
      return <Heart size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />;
    }
    return null;
  };

  return (
    <div 
      className="min-h-screen pb-24">
      
      {/* Header */}
      <div 
        className="px-4 pt-12 pb-6"
        style={{ 
          borderBottom: '1px solid var(--color-border)'
        }}>
        <div className="mb-2">
          <span
            className="section-label section-label-primary">
            Lịch sử
          </span>
        </div>
        
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--color-text-primary)'
          }}>
          Bữa ăn đã nấu
        </h1>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 flex gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className="rounded-full transition-all"
          style={{
            height: '32px',
            padding: '0 12px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: activeFilter === 'all' 
              ? 'var(--color-primary-light)' 
              : 'var(--color-surface-alt)',
            color: activeFilter === 'all' 
              ? 'var(--color-primary)' 
              : 'var(--color-text-secondary)',
            border: activeFilter === 'all'
              ? '1px solid var(--color-primary-border)'
              : '1px solid var(--color-border)'
          }}>
          Tất cả
        </button>

        <button
          onClick={() => setActiveFilter('week')}
          className="rounded-full transition-all"
          style={{
            height: '32px',
            padding: '0 12px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: activeFilter === 'week' 
              ? 'var(--color-primary-light)' 
              : 'var(--color-surface-alt)',
            color: activeFilter === 'week' 
              ? 'var(--color-primary)' 
              : 'var(--color-text-secondary)',
            border: activeFilter === 'week'
              ? '1px solid var(--color-primary-border)'
              : '1px solid var(--color-border)'
          }}>
          Tuần này
        </button>

        <button
          onClick={() => setActiveFilter('month')}
          className="rounded-full transition-all"
          style={{
            height: '32px',
            padding: '0 12px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: activeFilter === 'month' 
              ? 'var(--color-primary-light)' 
              : 'var(--color-surface-alt)',
            color: activeFilter === 'month' 
              ? 'var(--color-primary)' 
              : 'var(--color-text-secondary)',
            border: activeFilter === 'month'
              ? '1px solid var(--color-primary-border)'
              : '1px solid var(--color-border)'
          }}>
          Tháng này
        </button>
      </div>

      {/* Content */}
      <div className="px-4">
        {filteredEntries.length === 0 ? (
          /* Empty State */
          <div 
            className="flex flex-col items-center justify-center text-center"
            style={{ paddingTop: '80px' }}>
            {/* Empty Icon */}
            <div className="mb-4">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="var(--color-border)" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round">
                <path d="M3 3h18v18H3z" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>

            <p
              style={{
                fontSize: '15px',
                color: 'var(--color-text-secondary)',
                maxWidth: '280px'
              }}>
              Bạn chưa có bữa ăn nào
            </p>

            <button
              onClick={() => navigate('/app/home')}
              className="btn btn-primary rounded-full transition-all flex items-center justify-center gap-2"
              style={{
                height: '44px',
                padding: '0 20px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff'
              }}>
              Bắt đầu lập kế hoạch
            </button>
          </div>
        ) : (
          /* History Cards */
          <div className="flex flex-col gap-4">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl p-4 cursor-pointer transition-all hover-border-strong"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)'
                }}
                onClick={() => {
                  // In real app: navigate to meal detail or summary
                  console.log('View meal:', entry.id);
                }}>
                
                {/* Header: Date + Meal Type */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        marginBottom: '2px'
                      }}>
                      {entry.date}
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)'
                      }}>
                      {entry.mealType}
                    </p>
                  </div>

                  {/* Rating */}
                  {entry.rating && (
                    <div 
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 
                          entry.rating === 'bad' ? 'var(--color-error-light)' :
                          entry.rating === 'ok' ? 'var(--color-warn-light)' :
                          'var(--color-primary-light)',
                        border: 
                          entry.rating === 'bad' ? '1px solid #F0C0BC' :
                          entry.rating === 'ok' ? '1px solid var(--color-warn-border)' :
                          '1px solid var(--color-primary-border)'
                      }}>
                      {getRatingIcon(entry.rating)}
                    </div>
                  )}
                </div>

                {/* 4 Dish Thumbnails Grid */}
                <div 
                  className="mb-3"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px'
                  }}>
                  {entry.dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="rounded-lg overflow-hidden"
                      style={{
                        aspectRatio: '1',
                        backgroundImage: `url(${dish.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '1px solid var(--color-border)'
                      }}
                    />
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-3">
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)'
                    }}>
                    {entry.cookingTime}
                  </span>
                  <span style={{ color: 'var(--color-border)' }}>·</span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)'
                    }}>
                    {entry.servings} người
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}