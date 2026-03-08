import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Edit3, Share2, BarChart3 } from "lucide-react";

interface WeeklyStats {
  weekNumber: number;
  month: number;
  year: number;
  mealsPlanned: number;
  distinctDishes: number;
  violations: number;
  daysTracked: number;
  violatingMembers?: string[];
}

export function WeeklyReportScreen() {
  const navigate = useNavigate();
  
  // Get family data
  const familyData = JSON.parse(localStorage.getItem('familyMembers') || '[]');
  const familyName = familyData.length > 0 ? familyData[0].name : 'gia đình';
  
  // Mock weekly stats - In production, this would be calculated from meal history
  const [stats] = useState<WeeklyStats>({
    weekNumber: 10,
    month: 3,
    year: 2026,
    mealsPlanned: 5,
    distinctDishes: 18,
    violations: 0,
    daysTracked: 22,
    violatingMembers: []
  });

  const [caption, setCaption] = useState(
    `${stats.mealsPlanned} bữa tuần ${stats.weekNumber} — ${familyName} đang được chăm sóc đều đặn`
  );
  const [isEditingCaption, setIsEditingCaption] = useState(false);

  const handleShareFacebook = () => {
    // In production, this would generate an image and share to Facebook
    console.log('Share to Facebook:', { stats, caption });
    alert('Chia sẻ lên Facebook (chức năng demo)');
  };

  const handleShareZalo = () => {
    // In production, this would share to Zalo
    console.log('Share to Zalo:', { stats, caption });
    alert('Chia sẻ lên Zalo (chức năng demo)');
  };

  const handleCaptionSave = () => {
    setIsEditingCaption(false);
    // Auto-save caption
    console.log('Caption saved:', caption);
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
              <span style={{ fontSize: '16px' }}><BarChart3 size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} /></span>
            </div>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
              }}>
              Tuần này của gia đình bạn
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
            className="rounded-xl p-6"
            style={{
              background: 'linear-gradient(135deg, #f0f4ef 0%, #e8f2ec 100%)',
              border: '1px solid var(--color-health-border)'
            }}>
            
            {/* Week Label */}
            <p
              className="mb-4"
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-health)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em'
              }}>
              Tuần {stats.weekNumber}
            </p>

            {/* Primary Metric */}
            <div className="mb-6">
              <div
                className="mb-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '56px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  lineHeight: '1'
                }}>
                {stats.mealsPlanned}
              </div>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)'
                }}>
                bữa đã plan cho gia đình
              </p>
            </div>

            {/* Secondary Metrics - 3 Columns */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Distinct Dishes */}
              <div className="text-center">
                <div
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.2'
                  }}>
                  {stats.distinctDishes}
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.4'
                  }}>
                  món distinct trong tuần
                </p>
              </div>

              {/* Violations */}
              <div className="text-center">
                <div
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: stats.violations === 0 ? 'var(--color-health)' : 'var(--color-error)',
                    lineHeight: '1.2'
                  }}>
                  {stats.violations}
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.4'
                  }}>
                  vi phạm bệnh lý{' '}
                  {stats.violatingMembers && stats.violatingMembers.length > 0 
                    ? stats.violatingMembers.join(' + ')
                    : familyData.slice(0, 2).map((m: any) => m.name.split(' ').pop()).join(' + ')
                  }
                </p>
              </div>

              {/* Days Tracked */}
              <div className="text-center">
                <div
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.2'
                  }}>
                  {stats.daysTracked}
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.4'
                  }}>
                  ngày gia đình được chăm sóc
                </p>
              </div>
            </div>

            {/* Editable Caption */}
            <div 
              className="rounded-xl p-4 mb-5"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                border: '2px dashed var(--color-border-strong)'
              }}>
              {isEditingCaption ? (
                <div>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    onBlur={handleCaptionSave}
                    autoFocus
                    rows={2}
                    className="w-full rounded-lg px-3 py-2 mb-2"
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-text-primary)',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                  <button
                    onClick={handleCaptionSave}
                    className="rounded-lg px-3 py-1"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}>
                    Xong
                  </button>
                </div>
              ) : (
                <div>
                  <p
                    className="mb-2"
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-text-primary)',
                      fontStyle: 'italic',
                      lineHeight: '1.6'
                    }}>
                    "{caption}"
                  </p>
                  <button
                    onClick={() => setIsEditingCaption(true)}
                    className="flex items-center gap-1"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: 'var(--color-text-disabled)'
                    }}>
                    <Edit3 size={12} strokeWidth={1.5} />
                    Chạm để chỉnh caption
                  </button>
                </div>
              )}
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareFacebook}
                className="rounded-full px-5 py-3 flex items-center justify-center gap-2 transition-all hover-bg-dark"
                style={{
                  backgroundColor: '#1E1410',
                  border: '2px solid #1E1410',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: 'pointer'
                }}>
                <Share2 size={16} strokeWidth={2} />
                Chia sẻ lên Facebook
              </button>
              <button
                onClick={handleShareZalo}
                className="rounded-full px-5 py-3 transition-all hover-bg-alt"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '2px solid var(--color-border-strong)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer'
                }}>
                Zalo
              </button>
            </div>
          </div>

          {/* Auto-save Note */}
          <p
            className="text-center mt-4"
            style={{
              fontSize: '12px',
              color: 'var(--color-text-disabled)'
            }}>
            Lưu vào Sổ Gia Đình tự động →
          </p>
        </div>
      </div>
    </div>
  );
}