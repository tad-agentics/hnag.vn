import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Clock } from "lucide-react";
import { BottomNav } from "../components/BottomNav";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  imageUrl: string;
  readTime: string;
  tags?: string[];
  slug: string;
}

type Category = 'personalized' | 'all' | 'gout' | 'diabetes' | 'hypertension' | 'children' | 'quick' | 'seasonal' | 'stomach';

const CATEGORIES_GUEST: { id: Category; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'gout', label: 'Gout' },
  { id: 'diabetes', label: 'Tiểu đường' },
  { id: 'hypertension', label: 'Huyết áp' },
  { id: 'children', label: 'Trẻ em' },
  { id: 'quick', label: 'Nấu nhanh' },
  { id: 'seasonal', label: 'Mùa & Nguyên liệu' },
  { id: 'stomach', label: 'Dạ dày' }
];

const CATEGORIES_AUTHENTICATED: { id: Category; label: string }[] = [
  { id: 'personalized', label: 'Cho gia đình tôi' },
  { id: 'gout', label: 'Gout' },
  { id: 'diabetes', label: 'Tiểu đường' },
  { id: 'hypertension', label: 'Huyết áp' },
  { id: 'children', label: 'Trẻ em' },
  { id: 'quick', label: 'Nấu nhanh' },
  { id: 'seasonal', label: 'Mùa & Nguyên liệu' },
  { id: 'stomach', label: 'Dạ dày' }
];

export function NutritionBlogPage() {
  const navigate = useNavigate();
  
  // Check authentication state
  const isAuthenticated = !!localStorage.getItem('user');
  const userData = isAuthenticated ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const familyData = isAuthenticated ? JSON.parse(localStorage.getItem('familyMembers') || '[]') : [];
  
  // Get health conditions from family
  const getHealthConditions = (): string[] => {
    if (!familyData || familyData.length === 0) return [];
    const conditions = new Set<string>();
    familyData.forEach((member: any) => {
      if (member.healthConditions) {
        member.healthConditions.forEach((condition: string) => {
          conditions.add(condition);
        });
      }
    });
    return Array.from(conditions);
  };

  const healthConditions = getHealthConditions();
  const categories = isAuthenticated ? CATEGORIES_AUTHENTICATED : CATEGORIES_GUEST;
  const [activeCategory, setActiveCategory] = useState<Category>(isAuthenticated ? 'personalized' : 'all');
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Get user initials for avatar
  const getUserInitials = (): string => {
    if (!userData || !userData.name) return 'U';
    const nameParts = userData.name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    return userData.name[0].toUpperCase();
  };

  // Sample articles data
  const articles: Article[] = [
    {
      id: '1',
      title: 'Người bị gout nên ăn gì và kiêng gì? 30 món Việt an toàn',
      excerpt: 'Gout không có nghĩa là nhịn. Ăn khỏe, 30 món truyền thống Việt an toàn với giải thích dinh dưỡng.',
      category: 'Gout',
      categoryColor: '#5A8A6A',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      readTime: '12đọc',
      tags: ['Gout', 'Món Việt', 'Bệnh lý'],
      slug: 'nguoi-bi-gout-nen-an-gi'
    },
    {
      id: '2',
      title: 'Tiểu đường type 2 ăn cơm được không?',
      excerpt: 'Ăn cơm được — nhưng đúng cách và đúng lượng.',
      category: 'Tiểu đường',
      categoryColor: '#C97B2A',
      imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
      readTime: '8 phút đọc',
      slug: 'tieu-duong-an-com'
    },
    {
      id: '3',
      title: 'Huyết áp cao kiêng ăn gì?',
      excerpt: 'Hạn mặn đúng cách — danh sách đầy đủ cho gia đình Việt.',
      category: 'Huyết áp',
      categoryColor: '#C04030',
      imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400',
      readTime: '10 phút đọc',
      slug: 'huyet-ap-cao-kieng-an-gi'
    },
    {
      id: '4',
      title: '5 bữa cơm dưới 30 phút — đủ dinh dưỡng',
      excerpt: 'Nhanh mà không thiếu chất — 5 mẫu bữa trưa & tối cho ngày bận.',
      category: 'Nấu nhanh',
      categoryColor: '#D9622B',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
      readTime: '6 phút đọc',
      slug: '5-bua-com-nhanh'
    },
    {
      id: '5',
      title: 'Con biếng ăn rau mỗi tối — 7 cách dụ dỗ tự dưỡng chất',
      excerpt: 'Trẻ em không ghét rau — chỉ ghét rau nhạt. Thử 7 mẹo này.',
      category: 'Trẻ em',
      categoryColor: '#C9933A',
      imageUrl: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400',
      readTime: '7 phút đọc',
      slug: 'tre-bieng-an-rau'
    },
    {
      id: '6',
      title: 'Viêm dạ dày nên ăn gì buổi tối?',
      excerpt: 'Bữa tối nhẹ nhàng cho dạ dày — không kích ứng.',
      category: 'Dạ dày',
      categoryColor: '#5A8A6A',
      imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
      readTime: '9 phút đọc',
      slug: 'viem-da-day-an-gi'
    },
    {
      id: '7',
      title: 'Rau củ tháng 3 miền Nam — nên mua gì, tránh gì',
      excerpt: 'Tháng 3 mùa rau gì — danh sách đầy đủ, giá hợp lý.',
      category: 'Mùa & Nguyên liệu',
      categoryColor: '#5A8A6A',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
      readTime: '5 phút đọc',
      slug: 'rau-cu-thang-3'
    },
    {
      id: '8',
      title: 'Hơn gia đình có 2 bệnh lý — ăn gì cho sạch để nguyên tắc đủ',
      excerpt: 'Khi vợ gout, chồng tiểu đường — làm sao nấu chung. Có cách.',
      category: 'Gout',
      categoryColor: '#5A8A6A',
      imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400',
      readTime: '11 phút đọc',
      slug: 'gia-dinh-nhieu-benh-ly'
    }
  ];

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  const filteredArticles = activeCategory === 'all' 
    ? gridArticles 
    : gridArticles.filter(article => {
        const categoryMap: Record<Category, string> = {
          all: '',
          gout: 'Gout',
          diabetes: 'Tiểu đường',
          hypertension: 'Huyết áp',
          children: 'Trẻ em',
          quick: 'Nấu nhanh',
          seasonal: 'Mùa & Nguyên liệu',
          stomach: 'Dạ dày'
        };
        return article.category === categoryMap[activeCategory];
      });

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', { email, topics: selectedTopics });
    // Handle newsletter subscription
  };

  return (
    <div className="min-h-screen">
      
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" 
           style={{ 
             backgroundColor: 'var(--color-surface)', 
             borderColor: 'var(--color-border)' 
           }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div 
              className="rounded-full flex items-center justify-center"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--color-primary)'
              }}>
              <span 
                className="text-white font-semibold"
                style={{ fontSize: '12px' }}>
                HN
              </span>
            </div>
            <span 
              className="font-semibold hidden md:block"
              style={{ 
                fontSize: '13px',
                color: 'var(--color-text-primary)'
              }}>
              Hôm Nay Ăn Gì?
            </span>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <a 
              href="/"
              className="transition-colors py-2"
              style={{ 
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--color-text-secondary)'
              }}>
              Tính năng
            </a>
            <a 
              href="/"
              className="transition-colors py-2"
              style={{ 
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--color-text-secondary)'
              }}>
              Giá
            </a>
            <a 
              href="/dinh-duong"
              className="transition-colors py-2 border-b-3"
              style={{ 
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-primary)',
                borderBottom: '3px solid var(--color-primary)',
                marginBottom: '-1px'
              }}>
              Dinh Dưỡng
            </a>
            
            {!isAuthenticated && (
              <>
                <a 
                  href="/"
                  className="transition-colors py-2"
                  style={{ 
                    fontSize: '15px',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)'
                  }}>
                  Đăng nhập
                </a>
                <button 
                  onClick={() => navigate('/onboarding')}
                  className="rounded-full px-5 py-2 transition-all"
                  style={{
                    height: '40px',
                    backgroundColor: 'var(--color-primary)',
                    border: '2px solid var(--color-primary)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}>
                  Dùng thử miễn phí
                </button>
              </>
            )}

            {isAuthenticated && (
              <button
                onClick={() => navigate('/app/settings/profile')}
                className="rounded-full flex items-center justify-center"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'var(--color-primary)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#ffffff'
                }}>
                {getUserInitials()}
              </button>
            )}
          </div>

          {/* Mobile CTA / Avatar */}
          {!isAuthenticated && (
            <button 
              onClick={() => navigate('/onboarding')}
              className="lg:hidden rounded-full px-4 py-2"
              style={{
                height: '36px',
                backgroundColor: 'var(--color-primary)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer'
              }}>
              Dùng thử
            </button>
          )}

          {isAuthenticated && (
            <button
              onClick={() => navigate('/app/settings/profile')}
              className="lg:hidden rounded-full flex items-center justify-center"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--color-primary)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff'
              }}>
              {getUserInitials()}
            </button>
          )}
        </div>
      </nav>

      {/* Editorial Header */}
      <section 
        className="pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-6"
        style={{ backgroundColor: '#1E1410' }}>
        <div className="max-w-5xl mx-auto">
          
          {/* Label */}
          <p
            className="mb-4"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              color: '#B09A8C',
              textTransform: 'uppercase',
              letterSpacing: '0.14em'
            }}>
            Dinh Dưỡng Gia Đình Việt
          </p>

          {/* H1 */}
          <h1
            className="mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: '1.3'
            }}>
            Ăn đúng cho từng người trong gia đình.
          </h1>

          {/* Subtitle */}
          <p
            className="mb-8"
            style={{
              fontSize: '17px',
              color: '#B09A8C',
              lineHeight: '1.65',
              maxWidth: '600px'
            }}>
            Kiến thức dinh dưỡng thực tế
          </p>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="rounded-full px-4 py-2 whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                    border: isActive ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.2)',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#ffffff' : '#B09A8C',
                    cursor: 'pointer'
                  }}>
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="px-4 md:px-6 -mt-8 mb-12 md:mb-16">
        <div className="max-w-5xl mx-auto">
          
          {/* Personalized Callout - Logged in only */}
          {isAuthenticated && healthConditions.length > 0 && (
            <div 
              className="rounded-2xl p-4 mb-6"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
              <p
                style={{
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.6'
                }}>
                Gợi ý theo gia đình bạn
              </p>
            </div>
          )}
          
          <div 
            className="rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01]"
            onClick={() => navigate(`/dinh-duong/${featuredArticle.slug}`)}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}>
            <div className="md:flex">
              {/* Image */}
              <div 
                className="md:w-[240px] h-[200px] md:h-auto relative flex-shrink-0"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${featuredArticle.categoryColor}33 0%, ${featuredArticle.categoryColor}66 100%)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                <img 
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div 
                  className="absolute top-4 left-4 rounded-full px-3 py-1"
                  style={{
                    backgroundColor: featuredArticle.categoryColor,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#ffffff'
                  }}>
                  {featuredArticle.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex-1">
                <h2
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '22px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.4'
                  }}>
                  {featuredArticle.title}
                </h2>
                <p
                  className="mb-4"
                  style={{
                    fontSize: '15px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.65'
                  }}>
                  {featuredArticle.excerpt}
                </p>

                {/* Tags & Read Link */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {featuredArticle.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-3 py-1"
                        style={{
                          backgroundColor: 'var(--color-surface-alt)',
                          fontSize: '12px',
                          color: 'var(--color-text-secondary)'
                        }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1"
                       style={{
                         fontSize: '13px',
                         fontWeight: 600,
                         color: 'var(--color-primary)'
                       }}>
                    Đọc
                    <ArrowRight size={14} strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="px-4 md:px-6 mb-12 md:mb-16">
        <div className="max-w-5xl mx-auto">
          
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h3
              style={{
                fontSize: '10px',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em'
              }}>
              Bài viết mới nhất
            </h3>
            <button
              className="flex items-center gap-1"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}>
              Xem tất cả bài viết
              <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
                onClick={() => navigate(`/dinh-duong/${article.slug}`)}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)'
                }}>
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <div 
                    className="w-20 h-20 rounded-lg relative flex-shrink-0 overflow-hidden"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${article.categoryColor}33 0%, ${article.categoryColor}66 100%)`
                    }}>
                    <img 
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div 
                      className="absolute top-1 left-1 rounded-full px-2 py-0.5"
                      style={{
                        backgroundColor: article.categoryColor,
                        fontSize: '9px',
                        fontWeight: 600,
                        color: '#ffffff'
                      }}>
                      {article.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="mb-2 line-clamp-2"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.4'
                      }}>
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Clock size={12} strokeWidth={1.5} style={{ color: 'var(--color-text-disabled)' }} />
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-text-disabled)'
                        }}>
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Cross-sell */}
      <section 
        className="px-4 md:px-6 py-12 md:py-16 mb-12 md:mb-16"
        style={{ backgroundColor: '#1E1410' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="mb-3"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              color: '#B09A8C',
              textTransform: 'uppercase',
              letterSpacing: '0.14em'
            }}>
            Để app lọc món thay bạn
          </p>
          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: '1.3'
            }}>
            Đọc xong — để app lọc món cho gia đình bạn
          </h2>
          <p
            className="mb-8"
            style={{
              fontSize: '15px',
              color: '#B09A8C',
              lineHeight: '1.65',
              maxWidth: '500px',
              margin: '0 auto 32px'
            }}>
            App tự động áp dụng kiến thức bệnh lý
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="btn btn-primary rounded-full px-6 py-3 transition-all inline-flex items-center gap-2"
            style={{
              cursor: 'pointer'
            }}>
            Dùng miễn phí 14 ngày
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 md:px-6 pb-16 md:pb-20">
        <div className="max-w-2xl mx-auto">
          <div 
            className="rounded-2xl p-6 md:p-8"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '2px solid var(--color-border)'
            }}>
            
            <h3
              className="mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
              }}>
              Mỗi tuần 1 bài — đúng bệnh lý gia đình bạn
            </h3>
            <p
              className="mb-6"
              style={{
                fontSize: '15px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.65'
              }}>
              Đăng ký để nhận bài viết mới
            </p>

            {/* Email Form */}
            <form onSubmit={handleNewsletterSubmit} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn"
                  required
                  className="flex-1 rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: 'var(--color-surface-alt)',
                    border: '1px solid var(--color-border-strong)',
                    fontSize: '15px',
                    color: 'var(--color-text-primary)',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="rounded-xl px-5 py-3 transition-all"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    border: '2px solid var(--color-primary)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}>
                  Đăng ký
                </button>
              </div>
            </form>

            {/* Topic Checkboxes */}
            <div>
              <p
                className="mb-3"
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)'
                }}>
                Chọn chủ đề quan tâm:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Gout', 'Tiểu đường', 'Huyết áp', 'Trẻ em', 'Nấu nhanh'].map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className="rounded-full px-4 py-2 transition-all"
                      style={{
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-surface-alt)',
                        border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        fontSize: '13px',
                        fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        cursor: 'pointer'
                      }}>
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA - Only on mobile and not authenticated */}
      {!isAuthenticated && (
        <div 
          className="md:hidden fixed bottom-0 left-0 right-0 px-4 py-3"
          style={{
            backgroundColor: '#1E1410',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p
                className="font-semibold truncate"
                style={{
                  fontSize: '13px',
                  color: '#ffffff',
                  marginBottom: '2px'
                }}>
                Để app lọc món thay bạn
              </p>
              <p
                className="truncate"
                style={{
                  fontSize: '11px',
                  color: '#B09A8C'
                }}>
                Miễn phí 14 ngày
              </p>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="rounded-full px-5 py-2 flex-shrink-0"
              style={{
                height: '40px',
                backgroundColor: 'var(--color-primary)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer'
              }}>
              Dùng thử →
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Only for authenticated users */}
      {isAuthenticated && (
        <BottomNav />
      )}

      {/* Add scrollbar hide CSS */}
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}