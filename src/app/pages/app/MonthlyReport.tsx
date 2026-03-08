import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Share2, ArrowRight } from "lucide-react";

interface MonthlyStats {
  month: number;
  year: number;
  daysTracked: number;
  mealsPlanned: number;
  distinctDishes: number;
  violations: number;
  fridgeUsage: number;
  topDish: {
    name: string;
    imageUrl: string;
    count: number;
  };
}

export function MonthlyReportScreen() {
  const navigate = useNavigate();
  
  // Get family data
  const familyData = JSON.parse(localStorage.getItem('familyMembers') || '[]');
  
  // Mock monthly stats - In production, calculated server-side and rendered to PNG
  const [stats] = useState<MonthlyStats>({
    month: 3,
    year: 2026,
    daysTracked: 18,
    mealsPlanned: 21,
    distinctDishes: 42,
    violations: 0,
    fridgeUsage: 8,
    topDish: {
      name: 'Canh Bầu Nấu Tôm',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300',
      count: 4
    }
  });

  const handleShare = async () => {
    // In production, share the server-rendered PNG from R2
    console.log('Share monthly report:', stats);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Tháng ${stats.month}/${stats.year} — Báo cáo gia đình`,
          text: `${stats.daysTracked} ngày chăm sóc gia đình trong tháng ${stats.month}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      alert('Chia sẻ (chức năng demo)');
    }
  };

  const handleViewJournal = () => {
    navigate('/app/history');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(30, 20, 16, 0.5)' }}>
      
      {/* Report Card Container */}
      <div 
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)'
        }}>
        
        {/* Header Bar */}
        <div 
          className="px-4 py-3 flex items-center justify-between"
          style={{
            borderBottom: '1px solid var(--color-border)'
          }}>
          <div className="flex items-center gap-2">
            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: 'var(--color-surface-alt)'
              }}>
              <span style={{ fontSize: '16px' }}>📊</span>
            </div>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
              }}>
              Báo cáo tháng {stats.month}/{stats.year}
            </span>
          </div>
          <button
            onClick={() => navigate('/app/home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              padding: '4px'
            }}>
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Report Card */}
        <div className="p-5">
          <div 
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, #f7f4ef 0%, #eef5ee 100%)',
              border: '1px solid var(--color-border)'
            }}>
            
            {/* Month Header */}
            <p
              className="mb-6"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text-secondary)'
              }}>
              Tháng {stats.month}/{stats.year} — Báo cáo gia đình
            </p>

            {/* Primary Metric - Days Tracked */}
            <div 
              className="rounded-xl p-6 mb-5"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(234, 216, 200, 0.5)'
              }}>
              <div
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '64px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  lineHeight: '1',
                  textAlign: 'center'
                }}>
                {stats.daysTracked}
              </div>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                ngày chăm sóc gia đình trong tháng
              </p>
            </div>

            {/* 2x2 Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              
              {/* Meals Planned */}
              <div 
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(234, 216, 200, 0.5)'
                }}>
                <div
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '32px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.2'
                  }}>
                  {stats.mealsPlanned}
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.4'
                  }}>
                  bữa đã plan
                </p>
              </div>

              {/* Distinct Dishes */}
              <div 
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(234, 216, 200, 0.5)'
                }}>
                <div
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '32px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.2'
                  }}>
                  {stats.distinctDishes}
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.4'
                  }}>
                  món distinct
                </p>
              </div>

              {/* Violations */}
              <div 
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(234, 216, 200, 0.5)'
                }}>
                <div
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '32px',
                    fontWeight: 600,
                    color: stats.violations === 0 ? 'var(--color-health)' : 'var(--color-error)',
                    lineHeight: '1.2'
                  }}>
                  {stats.violations}
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.4'
                  }}>
                  vi phạm sức khỏe
                </p>
              </div>

              {/* Fridge Usage */}
              <div 
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(234, 216, 200, 0.5)'
                }}>
                <div
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '32px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.2'
                  }}>
                  {stats.fridgeUsage}
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.4'
                  }}>
                  lần dùng Chế Độ Tủ Lạnh
                </p>
              </div>
            </div>

            {/* Top Dish */}
            <div 
              className="rounded-xl p-4"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(234, 216, 200, 0.5)'
              }}>
              <p
                className="mb-3"
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textAlign: 'center'
                }}>
                Món được chọn nhiều nhất tháng
              </p>
              
              <div className="flex items-center justify-center gap-3">
                {/* Dish Thumbnail */}
                <div 
                  className="rounded-lg overflow-hidden flex-shrink-0"
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'var(--color-surface-alt)'
                  }}>
                  <img 
                    src={stats.topDish.imageUrl}
                    alt={stats.topDish.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Dish Name */}
                <div className="flex-1">
                  <p
                    className="mb-1"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '17px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      lineHeight: '1.3'
                    }}>
                    {stats.topDish.name}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-disabled)'
                    }}>
                    {stats.topDish.count} lần trong tháng
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleShare}
              className="flex-1 rounded-full py-3 flex items-center justify-center gap-2 transition-all hover-bg-dark"
              style={{
                backgroundColor: '#1E1410',
                border: '2px solid #1E1410',
                fontSize: '15px',
                fontWeight: 600,
                color: '#ffffff',
                cursor: 'pointer'
              }}>
              <Share2 size={18} strokeWidth={2} />
              Share
            </button>
            
            <button
              onClick={handleViewJournal}
              className="flex-1 rounded-full py-3 flex items-center justify-center gap-2 transition-all hover-bg-alt"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '2px solid var(--color-border-strong)',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                cursor: 'pointer'
              }}>
              S��� Gia Đình
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>

          {/* Auto-save Note */}
          <p
            className="text-center mt-4"
            style={{
              fontSize: '11px',
              color: 'var(--color-text-disabled)'
            }}>
            Báo cáo được lưu vĩnh viễn
          </p>
        </div>
      </div>
    </div>
  );
}