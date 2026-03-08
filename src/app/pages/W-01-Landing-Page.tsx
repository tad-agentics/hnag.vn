import { ChefHat, CheckCircle, Clock, Users, Download, ArrowRight, Zap, Shield, Brain, ChevronDown, X, Check, Lightbulb, Menu } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "../components/AuthModal";

export function LandingPage() {
  const [cardHover, setCardHover] = useState<'left' | 'right' | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Top Navigation - Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" 
           style={{ 
             backgroundColor: 'var(--color-surface)', 
             borderColor: 'var(--color-border)' 
           }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="icon-circle icon-circle-sm bg-[var(--color-primary)]">
              <span className="text-white text-xs font-semibold">HN</span>
            </div>
            <span className="body-text-md font-semibold hidden md:block text-[var(--color-text-primary)]">
              2.400+ gia đình đã không cần hỏi "hôm nay ăn gì?"
            </span>
            <span className="font-semibold md:hidden text-[13px] text-[var(--color-text-primary)]">
              Hôm Nay Ăn Gì?
            </span>
          </div>

          {/* Nav Links - Desktop Only */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#tinh-nang" 
               className="text-[15px] font-medium transition-colors"
               style={{ 
                 color: 'var(--color-text-secondary)' 
               }}>
              Tính năng
            </a>
            <a href="#gia" 
               className="text-[15px] font-medium transition-colors"
               style={{ 
                 color: 'var(--color-text-secondary)' 
               }}>
              Giá
            </a>
            <a href="#cau-hoi" 
               className="text-[15px] font-medium transition-colors"
               style={{ 
                 color: 'var(--color-text-secondary)' 
               }}>
              Về chúng tôi
            </a>
            <a href="#dang-nhap" 
               className="text-[15px] font-medium transition-colors"
               onClick={(e) => {
                 e.preventDefault();
                 setShowAuthModal(true);
               }}
               style={{ 
                 color: 'var(--color-text-secondary)' 
               }}>
              Đăng nhập
            </a>
            <button 
              className="btn btn-sm btn-primary"
              onClick={() => setShowAuthModal(true)}>
              Dùng thử miễn phí
            </button>
          </div>

          {/* Mobile CTA */}
          <button 
            className="lg:hidden btn btn-xs btn-primary"
            onClick={() => setShowAuthModal(true)}>
            Dùng thử
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column */}
            <div>
              {/* Badge */}
              <div className="badge badge-primary mb-4 md:mb-6">
                <ChefHat className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Đầu bếp cho gia đình Việt</span>
              </div>

              {/* H1 Headline */}
              <h1 className="mb-4 md:mb-6" 
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(32px, 5vw, 48px)',
                    fontWeight: 600,
                    lineHeight: '1.15',
                    color: 'var(--color-text-primary)'
                  }}>
                Hết băn khoăn<br />
                <span style={{ color: 'var(--color-primary)' }}>"Hôm nay nấu gì?"</span><br />
              </h1>

              {/* Subtext */}
              <p className="mb-6 md:mb-8" 
                 style={{ 
                   fontSize: '14px',
                   lineHeight: '1.65',
                   color: 'var(--color-text-secondary)'
                 }}>
                Gợi ý bữa ăn <strong style={{ color: 'var(--color-text-primary)' }}>phù hợp bệnh lý</strong> từng người — gout, huyết áp, tiểu đường, dạ dày. Quyết định trong <strong style={{ color: 'var(--color-text-primary)' }}>60 giây</strong>, không cần nghĩ.<br/><br/>
                <span className="hidden md:inline"><em>Về nhà sau 8 tiếng. Đầu óc trống rỗng. Tủ lạnh không biết còn gì. Mẹ chồng huyết áp cao. Con bé kén ăn. — Chúng tôi giải quyết dùng bởi toán đó.</em></span>
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <button 
                  className="btn btn-md md:btn-lg btn-primary inline-flex items-center gap-2"
                  onClick={() => setShowAuthModal(true)}>
                  Dùng miễn phí ngay
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              <p className="mt-4 md:mt-6 text-[11px] md:text-[12px]"
                 style={{ 
                   color: 'var(--color-text-disabled)'
                 }}>
                Miễn phí 14 ngày · Không cần thẻ tín dụng · Huỷ bất cứ lúc nào
              </p>
            </div>

            {/* Right Column - Preview Card */}
            <div>
              <div className="rounded-2xl md:rounded-3xl overflow-hidden border p-3 md:p-4"
                   style={{ 
                     backgroundColor: 'var(--color-surface)',
                     borderColor: 'var(--color-border-strong)'
                   }}>
                <p className="section-label section-label-disabled mb-3">
                  Thử ngay — Swipe để chọn bữa tối
                </p>

                {/* Card */}
                <div className="rounded-2xl md:rounded-3xl overflow-hidden border mb-4"
                     style={{ 
                       backgroundColor: 'var(--color-surface)',
                       borderColor: 'var(--color-border-strong)',
                       transform: cardHover === 'left' ? 'rotate(-5deg)' : cardHover === 'right' ? 'rotate(5deg)' : 'rotate(0deg)',
                       transition: 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1.0)',
                       ...(cardHover === 'left' && { backgroundColor: 'rgba(217,98,43,0.06)' }),
                       ...(cardHover === 'right' && { backgroundColor: 'rgba(90,138,106,0.06)' })
                     }}>
                  {/* Card Image */}
                  <div className="h-[200px] md:h-[240px] relative" 
                       style={{ backgroundColor: 'var(--color-surface-alt)' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(30,20,16,0.7)] via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-[10px] font-medium"
                         style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                      Swipe để chọn →
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 style={{ 
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(20px, 4vw, 24px)',
                        fontWeight: 700,
                        color: 'white'
                      }}>
                        Canh Chua Cá Lóc
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 md:p-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="tag tag-health">
                        <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Ba (Gout phù hợp)
                      </div>
                      <div className="tag tag-health">
                        <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Mẹ (Huyết áp)
                      </div>
                      <div className="tag tag-neutral">
                        <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                        25 phút · 60k
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex items-center justify-center gap-4 pt-4 border-t"
                         style={{ borderColor: 'var(--color-border)' }}>
                      <button 
                              onMouseEnter={() => setCardHover('left')}
                              onMouseLeave={() => setCardHover(null)}
                              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center transition-all"
                              style={{ 
                                borderColor: 'var(--color-border-strong)',
                                backgroundColor: 'transparent'
                              }}>
                        <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} style={{ color: 'var(--color-text-secondary)' }} />
                      </button>
                      <button 
                              onMouseEnter={() => setCardHover('right')}
                              onMouseLeave={() => setCardHover(null)}
                              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center transition-all"
                              style={{ 
                                borderColor: 'var(--color-primary)',
                                backgroundColor: 'transparent'
                              }}>
                        <Check className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Note Card */}
                <div className="callout callout-primary mb-4">
                  <Lightbulb className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
                  <p className="callout-text">
                    Dựa trên 14 bữa của gia đình bạn · App đang học thêm
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  <div className="stat-container">
                    <div className="stat-value">500+</div>
                    <p className="stat-label">món Việt<br />được tối ưu</p>
                  </div>
                  <div className="stat-container">
                    <div className="stat-value">6</div>
                    <p className="stat-label">bệnh lý<br />hỗ trợ</p>
                  </div>
                  <div className="stat-container">
                    <div className="stat-value">60s</div>
                    <p className="stat-label">quyết định<br />1 bữa ăn</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ba bài toán section */}
      <section className="py-12 md:py-20 px-4 md:px-6 border-y"
               style={{ 
                 backgroundColor: 'var(--color-surface)',
                 borderColor: 'var(--color-border)'
               }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center mb-3 section-label section-label-primary">
            Nhà bạn có quen không?
          </p>
          <h2 className="text-center mb-8 md:mb-16 px-4" 
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 5vw, 36px)',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
              }}>
            Ba bài toán không ai giải được cho bạn — cho đến giờ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Problem 1 */}
            <div className="p-5 md:p-6 rounded-2xl border"
                 style={{ 
                   backgroundColor: 'var(--color-bg)',
                   borderColor: 'var(--color-border)'
                 }}>
              <p className="section-label section-label-disabled mb-3">
                01
              </p>
              <h3 className="mb-3 md:mb-4" 
                  style={{ 
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                Về đến nhà là não đã trống
              </h3>
              <p style={{ 
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'var(--color-text-secondary)'
              }}>
                "Chiều nay nấu gì" rơi đúng vào lúc cognitive bandwidth = 0. Sau 8 tiếng làm việc, đây là câu hỏi khó nhất ngày.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="p-5 md:p-6 rounded-2xl border"
                 style={{ 
                   backgroundColor: '#1E1410',
                   borderColor: 'rgba(255,255,255,0.1)'
                 }}>
              <p className="text-[10px] uppercase font-medium tracking-wider mb-3"
                 style={{ 
                   color: 'rgba(255,255,255,0.5)',
                   letterSpacing: '0.14em'
                 }}>
                → Đau nhất
              </p>
              <h3 className="mb-3 md:mb-4" 
                  style={{ 
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'white'
                  }}>
                Bài toán đa biến không có công cụ
              </h3>
              <p style={{ 
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'rgba(255,255,255,0.7)'
              }}>
                Cân bằng gout Ba, huyết áp Mẹ, con kén ăn, thời gian 40 phút, ngân sách 150k — cùng lúc. ChatGPT trả lời được 1 lần nhưng không nhớ lần sau.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="p-5 md:p-6 rounded-2xl border"
                 style={{ 
                   backgroundColor: 'var(--color-bg)',
                   borderColor: 'var(--color-border)'
                 }}>
              <p className="section-label section-label-disabled mb-3">
                03
              </p>
              <h3 className="mb-3 md:mb-4" 
                  style={{ 
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                Gọi đồ ăn cũng không giải quyết được
              </h3>
              <p style={{ 
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'var(--color-text-secondary)'
              }}>
                Vẫn phải chọn món nào an toàn cho người gout, người dạ dày. Bài toán chỉ shift dạng — không mất đi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 bước - 60 giây section */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center mb-3 section-label section-label-disabled">
            CÁCH HOẠT ĐỘNG
          </p>
          <h2 className="text-center mb-8 md:mb-16" 
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 5vw, 36px)',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
              }}>
            3 bước — 60 giây mỗi bữa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="card text-center p-6 md:p-8">
              <div className="icon-circle icon-circle-lg mx-auto mb-4 md:mb-6">
                <Users className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h4 className="mb-3" 
                  style={{ 
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                1. Khai báo gia đình
              </h4>
              <p className="body-text-sm">
                Ai trong nhà có gout, tiểu đường, dạ dày, huyết áp? Thường nấu bao nhiêu phút, ngân sách bao nhiêu?
              </p>
            </div>

            {/* Step 2 */}
            <div className="card text-center p-6 md:p-8">
              <div className="icon-circle icon-circle-lg mx-auto mb-4 md:mb-6">
                <Zap className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h4 className="mb-3" 
                  style={{ 
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                2. Swipe chọn món
              </h4>
              <p className="body-text-sm">
                Chỉ thấy món đã lọc sẵn. Swipe phải = chọn. Swipe trái = bỏ. 3–4 card là xong 1 bữa.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card text-center p-6 md:p-8">
              <div className="icon-circle icon-circle-lg mx-auto mb-4 md:mb-6">
                <Brain className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h4 className="mb-3" 
                  style={{ 
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                3. App tự học & ghi nhớ
              </h4>
              <p className="body-text-sm">
                Mỗi lần dùng app hiểu gia đình bạn hơn. Sau 30 ngày — gợi ý chính xác hơn bất kỳ công cụ nào.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20 px-4 md:px-6 border-y"
               style={{ 
                 backgroundColor: 'var(--color-surface)',
                 borderColor: 'var(--color-border)'
               }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center mb-3 section-label section-label-primary">
            Gia đình Việt đang dùng — mỗi ngày
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
            {/* Testimonial 1 */}
            <div className="p-5 md:p-6 rounded-2xl border"
                 style={{ 
                   backgroundColor: 'var(--color-surface)',
                   borderColor: 'var(--color-border)'
                 }}>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="var(--color-gold)" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 italic" style={{ 
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'var(--color-text-secondary)'
              }}>
                "Không còn phải nghĩ chiều nay ăn gì nữa. Ba có gout mà app vẫn gợi ý được nhiều món ngon."
              </p>
              <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Loan Anh · TP.HCM
              </p>
              <p className="text-[10px] uppercase tracking-wider mt-1" 
                 style={{ color: 'var(--color-text-disabled)', letterSpacing: '0.12em' }}>
                dùng được 2 tháng
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="p-5 md:p-6 rounded-2xl border"
                 style={{ 
                   backgroundColor: 'var(--color-surface)',
                   borderColor: 'var(--color-border)'
                 }}>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="var(--color-gold)" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 italic" style={{ 
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'var(--color-text-secondary)'
              }}>
                "Mẹ chồng lại tiểu đường type 2. Cưới cùng cả cống cụ giúp tôi nấu yên tâm mà vẫn ngon."
              </p>
              <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Phương Thảo · Hà Nội
              </p>
              <p className="text-[10px] uppercase tracking-wider mt-1" 
                 style={{ color: 'var(--color-text-disabled)', letterSpacing: '0.12em' }}>
                dùng được 6 tuần
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="p-5 md:p-6 rounded-2xl border"
                 style={{ 
                   backgroundColor: 'var(--color-surface)',
                   borderColor: 'var(--color-border)'
                 }}>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="var(--color-gold)" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 italic" style={{ 
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'var(--color-text-secondary)'
              }}>
                "Tôi gọi đồ ăn 3 lần/tuần mà vẫn dùng app. Nó giúp mình chọn món nào phù hợp trong menu."
              </p>
              <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Minh Tú · Đà Nẵng
              </p>
              <p className="text-[10px] uppercase tracking-wider mt-1" 
                 style={{ color: 'var(--color-text-disabled)', letterSpacing: '0.12em' }}>
                dùng 3 tháng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="gia" className="py-12 md:py-20 px-4 md:px-6 border-y"
               style={{ 
                 backgroundColor: 'var(--color-bg)',
                 borderColor: 'var(--color-border)'
               }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center mb-3 section-label section-label-disabled">
            GIÁ
          </p>
          <h2 className="text-center mb-4" 
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 5vw, 36px)',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
              }}>
            Rẻ hơn 1 bữa gọi đồ ăn mỗi tháng
          </h2>
          <p className="text-center mb-8 md:mb-12 px-4" style={{ 
            fontSize: '14px',
            color: 'var(--color-text-secondary)'
          }}>
            Không auto-charge. Không subscription anxiety. Phù hợp tâm lý tiêu dùng Việt Nam.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Plan 1 - 6 months */}
            <div className="p-5 md:p-6 rounded-2xl border text-center"
                 style={{ 
                   backgroundColor: 'var(--color-bg)',
                   borderColor: 'var(--color-border)'
                 }}>
              <p className="section-label section-label-disabled mb-2">
                6 tháng
              </p>
              <div className="mb-4">
                <div style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 6vw, 40px)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)'
                }}>
                  990k
                </div>
                <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                  ~165k/tháng
                </p>
              </div>
              <button className="w-full btn btn-md md:btn-lg btn-outline"
                      onClick={() => setShowAuthModal(true)}>
                Chọn gói này
              </button>
            </div>

            {/* Plan 2 - 12 months - Popular */}
            <div className="p-5 md:p-6 rounded-2xl border-2 relative text-center"
                 style={{ 
                   backgroundColor: '#1E1410',
                   borderColor: 'var(--color-primary)'
                 }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full section-label"
                   style={{ 
                     backgroundColor: 'var(--color-primary)',
                     color: 'white'
                   }}>
                Phổ biến nhất
              </div>
              <p className="section-label section-label-white mb-2">
                12 tháng
              </p>
              <div className="mb-4">
                <div className="text-[14px] line-through mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  3.650k
                </div>
                <div style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 6vw, 40px)',
                  fontWeight: 600,
                  color: 'white'
                }}>
                  1.690k
                </div>
                <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  ~141k/tháng · Tiết kiệm 54%
                </p>
              </div>
              <button className="w-full btn btn-md md:btn-lg btn-primary"
                      onClick={() => setShowAuthModal(true)}>
                Chọn gói này
              </button>
            </div>

            {/* Plan 3 - Lifetime */}
            <div className="p-5 md:p-6 rounded-2xl border text-center"
                 style={{ 
                   backgroundColor: 'var(--color-bg)',
                   borderColor: 'var(--color-border)'
                 }}>
              <p className="section-label section-label-disabled mb-2">
                Trọn đời
              </p>
              <div className="mb-4">
                <div style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 6vw, 40px)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)'
                }}>
                  2.990k
                </div>
                <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                  Đầu tư 1 lần. Dùng mãi mãi.
                </p>
              </div>
              <button 
                className="w-full btn btn-md md:btn-lg btn-outline"
                onClick={() => setShowAuthModal(true)}>
                Chọn gói này
              </button>
            </div>
          </div>

          <p className="text-center mt-6 md:mt-8 text-[11px] md:text-[12px] px-4" 
             style={{ 
               color: 'var(--color-text-disabled)'
             }}>
            Dùng thử miễn phí 14 ngày · Không cần thẻ tín dụng · Mua 1 lần, dùng mãi
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="cau-hoi" className="py-12 md:py-20 px-4 md:px-6 border-y"
               style={{ 
                 backgroundColor: 'var(--color-surface)',
                 borderColor: 'var(--color-border)'
               }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center mb-8 md:mb-12" 
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 5vw, 36px)',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
              }}>
            Câu hỏi thường gặp
          </h2>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="p-5 md:p-6 rounded-2xl border"
                 style={{ 
                   backgroundColor: 'var(--color-surface)',
                   borderColor: 'var(--color-border)'
                 }}>
              <h4 className="mb-2" 
                  style={{ 
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                App có hỗ trợ người bị gout không?
              </h4>
              <p style={{ 
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'var(--color-text-secondary)'
              }}>
                Có. App có rule engine riêng cho gout — tự động lọc và đánh dấu những món cần tránh (nội tạng, hải sản, bía), chỉ gợi ý món an toàn. Nguồn: Viện Dinh Dưỡng Quốc Gia.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="p-5 md:p-6 rounded-2xl border"
                 style={{ 
                   backgroundColor: 'var(--color-surface)',
                   borderColor: 'var(--color-border)'
                 }}>
              <h4 className="mb-2" 
                  style={{ 
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                Khác gì ChatGPT hay Google?
              </h4>
              <p style={{ 
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'var(--color-text-secondary)'
              }}>
                ChatGPT không nhớ gia đình bạn và không có rule engine bệnh lý cứng. App này nhớ từng người trong nhà, học từ lịch sử và ngay cảng chỉnh xác hơn.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-5 md:p-6 rounded-2xl border"
                 style={{ 
                   backgroundColor: 'var(--color-surface)',
                   borderColor: 'var(--color-border)'
                 }}>
              <h4 className="mb-2" 
                  style={{ 
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                Nếu tôi thích gọi đ ăn, app có dùng được không?
              </h4>
              <p style={{ 
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'var(--color-text-secondary)'
              }}>
                Có. App gợi ý món — không bắt buộc phải nấu. Bạn có thể dùng gợi ý để tìm món phù hợp trên ShopeeFood hay Grab.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="p-5 md:p-6 rounded-2xl border"
                 style={{ 
                   backgroundColor: 'var(--color-surface)',
                   borderColor: 'var(--color-border)'
                 }}>
              <h4 className="mb-2" 
                  style={{ 
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                Có cần kết nối internet không?
              </h4>
              <p style={{ 
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'var(--color-text-secondary)'
              }}>
                PWA app hoạt động offline cho tính năng cơ bản (xem lịch sử, công thức đã lưu). Gợi ý mới cần kết nối.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Bar */}
      <section className="py-12 md:py-20 px-4 md:px-6"
               style={{ backgroundColor: '#1E1410' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-4" 
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 5vw, 40px)',
                fontWeight: 600,
                color: 'white'
              }}>
            Bắt đầu ngay — miễn phí 14 ngày
          </h2>
          <p className="mb-6 md:mb-8 text-[14px] md:text-[15px] px-4" 
             style={{ 
               color: 'rgba(255,255,255,0.7)'
             }}>
            Không cần thẻ tín dụng · Hủy bất cứ lúc nào · Mua 1 lần dùng mãi
          </p>
          <button className="h-[48px] md:h-[52px] px-8 md:px-10 rounded-full font-semibold text-white text-[14px] md:text-[15px] border-2 inline-flex items-center gap-2 transition-all duration-150 bg-[var(--color-primary)] border-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:border-[var(--color-primary-hover)]"
                  onClick={() => setShowAuthModal(true)}>
            Dùng miễn phí ngay
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </section>

      {/* PWA Install Strip */}
      <section className="py-6 md:py-8 px-4 md:px-6 border-t"
               style={{ 
                 backgroundColor: '#1E1410',
                 borderColor: 'rgba(255,255,255,0.1)'
               }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border"
                 style={{ 
                   backgroundColor: 'rgba(255,255,255,0.05)',
                   borderColor: 'rgba(255,255,255,0.1)'
                 }}>
              <Download className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} style={{ color: 'white' }} />
            </div>
            <div>
              <p className="font-semibold text-[14px] md:text-[15px]" 
                 style={{ 
                   color: 'white'
                 }}>
                Cài app về máy
              </p>
              <p className="text-[11px] md:text-[12px]" 
                 style={{ 
                   color: 'rgba(255,255,255,0.5)'
                 }}>
                Dùng offline · nhanh hơn
              </p>
            </div>
          </div>
          <button className="h-9 md:h-10 px-4 md:px-6 rounded-full font-semibold text-[12px] md:text-[13px] border transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]"
                  style={{ 
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}>
            Cài đặt
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 px-4 md:px-6 border-t"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)'
              }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px]" 
             style={{ 
               color: 'var(--color-text-primary)'
             }}>
            Hôm Nay Ăn Gì?
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a href="#" className="text-[12px]" 
               style={{ 
                 color: 'var(--color-text-secondary)'
               }}>
              Điều Khoản
            </a>
            <span className="text-[12px]" style={{ color: 'var(--color-text-disabled)' }}>|</span>
            <a href="#" className="text-[12px]" 
               style={{ 
                 color: 'var(--color-text-secondary)'
               }}>
              Bảo mật
            </a>
            <span className="text-[12px]" style={{ color: 'var(--color-text-disabled)' }}>|</span>
            <a href="#" className="text-[12px]" 
               style={{ 
                 color: 'var(--color-text-secondary)'
               }}>
              Liên hệ
            </a>
            <span className="text-[12px]" style={{ color: 'var(--color-text-disabled)' }}>|</span>
            <a href="#" className="text-[12px]" 
               style={{ 
                 color: 'var(--color-text-secondary)'
               }}>
              Dinh Dưỡng Blog
            </a>
          </div>
          <p className="text-[12px]" 
             style={{ 
               color: 'var(--color-text-disabled)'
             }}>
            © 2026 hnag.vn
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}