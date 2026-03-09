import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ThumbsDown, Meh, Heart } from "lucide-react";
import { BottomNav } from "../../components/BottomNav";
import { useAuth } from "../../contexts/AuthContext";

interface MealHistoryEntry {
  id: string;
  date: string;
  mealType: string;
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

function formatHistoryDate(mealDate: string): string {
  const d = new Date(mealDate + 'T12:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  if (d.toDateString() === today.toDateString()) return `Hôm nay, ${day}/${month}`;
  if (d.toDateString() === yesterday.toDateString()) return `Hôm qua, ${day}/${month}`;
  const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return `${weekdays[d.getDay()]}, ${day}/${month}`;
}

export function HistoryScreen() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [historyEntries, setHistoryEntries] = useState<MealHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) {
      setHistoryEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/meal-plan/history?filter=${activeFilter}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : { entries: [] }))
      .then((data: { entries?: Array<{ id: string; meal_date: string; meal_type: string; status: string; dishes: Array<{ dish_id: string; name_vi: string; image_url: string | null }> }> }) => {
        const entries = (data.entries ?? []).map((p) => ({
          id: p.id,
          date: formatHistoryDate(p.meal_date),
          mealType: p.meal_type,
          timestamp: new Date(p.meal_date + 'T12:00:00'),
          dishes: (p.dishes ?? []).map((d, i) => ({
            id: d.dish_id || `d-${i}`,
            name: d.name_vi || 'Món',
            imageUrl: d.image_url || '',
          })),
          rating: null as 'bad' | 'ok' | 'love' | null,
          cookingTime: '—',
          servings: 0,
        }));
        setHistoryEntries(entries);
      })
      .catch(() => setHistoryEntries([]))
      .finally(() => setLoading(false));
  }, [session?.access_token, activeFilter]);

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
        {loading ? (
          <div className="flex justify-center py-12">
            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Đang tải...</span>
          </div>
        ) : historyEntries.length === 0 ? (
          /* Empty State */
          <div
            className="flex flex-col items-center justify-center text-center"
            style={{ paddingTop: '80px' }}>
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
            {historyEntries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl p-4 cursor-pointer transition-all hover-border-strong"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)'
                }}
                onClick={() => {
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

                {/* Dish Thumbnails Grid */}
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
                      className="rounded-lg overflow-hidden bg-center bg-cover"
                      style={{
                        aspectRatio: '1',
                        backgroundImage: dish.imageUrl ? `url(${dish.imageUrl})` : undefined,
                        backgroundColor: dish.imageUrl ? undefined : 'var(--color-surface-alt)',
                        border: '1px solid var(--color-border)'
                      }}
                      title={dish.name}
                    />
                  ))}
                </div>

                {/* Meta Info */}
                {(entry.cookingTime !== '—' || entry.servings > 0) && (
                  <div className="flex items-center gap-3">
                    {entry.cookingTime !== '—' && (
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-text-secondary)'
                        }}>
                        {entry.cookingTime}
                      </span>
                    )}
                    {entry.servings > 0 && (
                      <>
                        {entry.cookingTime !== '—' && <span style={{ color: 'var(--color-border)' }}>·</span>}
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'var(--color-text-secondary)'
                          }}>
                          {entry.servings} người
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
