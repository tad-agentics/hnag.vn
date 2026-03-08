import { useNavigate } from "react-router";
import { ArrowLeft, Share2, ChevronRight, BookOpen } from "lucide-react";

interface MonthlyReport {
  id: string;
  month: number;
  year: number;
  daysTracked: number;
  mealsPlanned: number;
  distinctDishes: number;
  violations: number;
  isCurrent: boolean;
  reportUrl?: string; // PNG from R2
}

export function FamilyJournalScreen() {
  const navigate = useNavigate();
  
  // Mock data - In production, fetch from localStorage/backend
  // Empty state for demo - uncomment reports array to see populated state
  const reports: MonthlyReport[] = [
    // {
    //   id: '2026-03',
    //   month: 3,
    //   year: 2026,
    //   daysTracked: 18,
    //   mealsPlanned: 21,
    //   distinctDishes: 42,
    //   violations: 0,
    //   isCurrent: true,
    //   reportUrl: '/reports/2026-03.png'
    // },
    // {
    //   id: '2026-02',
    //   month: 2,
    //   year: 2026,
    //   daysTracked: 22,
    //   mealsPlanned: 28,
    //   distinctDishes: 48,
    //   violations: 2,
    //   isCurrent: false,
    //   reportUrl: '/reports/2026-02.png'
    // },
    // {
    //   id: '2026-01',
    //   month: 1,
    //   year: 2026,
    //   daysTracked: 15,
    //   mealsPlanned: 18,
    //   distinctDishes: 32,
    //   violations: 0,
    //   isCurrent: false,
    //   reportUrl: '/reports/2026-01.png'
    // }
  ];

  const monthNames = [
    '', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const handleViewReport = (report: MonthlyReport) => {
    // In production, navigate to monthly report or show PNG
    console.log('View report:', report);
    navigate('/app/monthly-report');
  };

  const handleShareReport = (report: MonthlyReport, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Share report:', report);
    
    if (navigator.share && report.reportUrl) {
      navigator.share({
        title: `${monthNames[report.month]} ${report.year} — Báo cáo gia đình`,
        url: report.reportUrl
      });
    }
  };

  return (
    <div 
      className="min-h-screen">
      
      {/* Header */}
      <div 
        className="px-4 py-3"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)'
        }}>
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => navigate('/app/settings')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}>
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
        </div>
        <div>
          <h1
            className="mb-1"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--color-text-primary)'
            }}>
            Sổ Gia Đình
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.5'
            }}>
            Nhật ký chăm sóc gia đình theo tháng
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5">
        
        {/* Empty State */}
        {reports.length === 0 && (
          <div 
            className="rounded-xl p-8 text-center"
            style={{
              border: '2px dashed var(--color-border)',
              backgroundColor: 'var(--color-surface)'
            }}>
            <div
              className="mb-4 mx-auto"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--color-surface-alt)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <BookOpen size={24} strokeWidth={1.5} style={{ color: 'var(--color-border)' }} />
            </div>
            <p
              className="mb-2"
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
              }}>
              Chưa có báo cáo nào
            </p>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.6',
                maxWidth: '320px',
                margin: '0 auto'
              }}>
              Cuối mỗi tháng, báo cáo gia đình được lưu tự động tại đây.
              Tiếp tục plan bữa ăn để nhận báo cáo đầu tiên!
            </p>
          </div>
        )}

        {/* Reports List */}
        {reports.length > 0 && (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => handleViewReport(report)}
                className="rounded-xl p-5 cursor-pointer transition-all"
                style={{
                  border: report.isCurrent
                    ? '2px solid var(--color-health-border)'
                    : '1px solid var(--color-border)',
                  background: report.isCurrent
                    ? 'linear-gradient(135deg, rgba(232, 242, 236, 0.3) 0%, var(--color-surface) 100%)'
                    : 'var(--color-surface)'
                }}
                onMouseEnter={(e) => {
                  if (!report.isCurrent) {
                    e.currentTarget.style.borderColor = 'var(--color-border-strong)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!report.isCurrent) {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                  }
                }}>
                
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {/* Month Label */}
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '18px',
                          fontWeight: 600,
                          color: report.isCurrent 
                            ? 'var(--color-health)' 
                            : 'var(--color-text-primary)'
                        }}>
                        {monthNames[report.month]} {report.year}
                      </h3>
                      {report.isCurrent && (
                        <span
                          className="rounded-full px-2 py-0.5"
                          style={{
                            backgroundColor: 'var(--color-health-light)',
                            fontSize: '10px',
                            fontWeight: 600,
                            color: 'var(--color-health)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                          Tháng này
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: '13px',
                        color: report.isCurrent 
                          ? 'var(--color-health)' 
                          : 'var(--color-text-disabled)'
                      }}>
                      Báo cáo gia đình
                    </p>
                  </div>
                  
                  {/* Share Button */}
                  <button
                    onClick={(e) => handleShareReport(report, e)}
                    className="rounded-lg p-2 transition-all hover-bg-alt"
                    style={{
                      backgroundColor: 'var(--color-surface-alt)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer'
                    }}>
                    <Share2 size={16} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Stats Grid - 2x2 */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* Days Tracked */}
                  <div>
                    <div
                      className="mb-0.5"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '24px',
                        fontWeight: 600,
                        color: report.isCurrent 
                          ? 'var(--color-health)' 
                          : 'var(--color-text-primary)',
                        lineHeight: '1.2'
                      }}>
                      {report.daysTracked}
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)'
                      }}>
                      ngày chăm sóc
                    </p>
                  </div>

                  {/* Meals Planned */}
                  <div>
                    <div
                      className="mb-0.5"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '24px',
                        fontWeight: 600,
                        color: report.isCurrent 
                          ? 'var(--color-health)' 
                          : 'var(--color-text-primary)',
                        lineHeight: '1.2'
                      }}>
                      {report.mealsPlanned}
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)'
                      }}>
                      bữa đã plan
                    </p>
                  </div>

                  {/* Distinct Dishes */}
                  <div>
                    <div
                      className="mb-0.5"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '24px',
                        fontWeight: 600,
                        color: report.isCurrent 
                          ? 'var(--color-health)' 
                          : 'var(--color-text-primary)',
                        lineHeight: '1.2'
                      }}>
                      {report.distinctDishes}
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)'
                      }}>
                      món distinct
                    </p>
                  </div>

                  {/* Violations */}
                  <div>
                    <div
                      className="mb-0.5"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '24px',
                        fontWeight: 600,
                        color: report.violations === 0 
                          ? (report.isCurrent ? 'var(--color-health)' : 'var(--color-text-primary)')
                          : 'var(--color-error)',
                        lineHeight: '1.2'
                      }}>
                      {report.violations}
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)'
                      }}>
                      vi phạm
                    </p>
                  </div>
                </div>

                {/* View Detail Arrow */}
                <div 
                  className="flex items-center justify-end"
                  style={{
                    paddingTop: '8px',
                    borderTop: '1px solid var(--color-border)'
                  }}>
                  <span
                    className="flex items-center gap-1"
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: report.isCurrent 
                        ? 'var(--color-health)' 
                        : 'var(--color-text-disabled)'
                    }}>
                    Xem chi tiết
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}