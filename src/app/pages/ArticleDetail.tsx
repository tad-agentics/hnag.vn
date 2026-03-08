import { ArrowLeft, Share2, Check, Lightbulb } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { BottomNav } from "../components/BottomNav";

interface ArticleContent {
  slug: string;
  title: string;
  author: string;
  organization: string;
  date: string;
  category: string;
  categoryColor: string;
  imageUrl: string;
  intro: string;
  sections: {
    title: string;
    content?: string;
    items?: string[];
  }[];
}

// Sample article data
const ARTICLES: Record<string, ArticleContent> = {
  'nguoi-bi-gout-nen-an-gi': {
    slug: 'nguoi-bi-gout-nen-an-gi',
    title: 'Người bị gout nên ăn gì và kiêng gì? 30 món Việt an toàn',
    author: 'BS. Dinh dưỡng',
    organization: 'Viện Dinh Dưỡng',
    date: '15/02/2025',
    category: 'GOUT',
    categoryColor: '#5A8A6A',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    intro: 'Gout xảy ra khi acid uric tích tụ trong máu, gây ra các đợt viêm đau khớp cấp tính. Nhiều người lầm tưởng phải ăn rất nhạt nhẽo — thực tế, người bị gout vẫn có thể ăn ngon nếu biết chọn đúng thực phẩm.',
    sections: [
      {
        title: 'Thực phẩm nên ăn',
        items: [
          'Rau xanh lá: rau muống, cải xanh, bắp cải — ít purine, giàu folate, giúp giảm axit uric hóa',
          'Thịt trắng: thịt gà (bỏ da), cá lóc, cá diêu hồng — purine thấp hơn thịt đỏ',
          'Trứng, đậu phụ: nguồn protein an toàn, không có purine đáng kể'
        ]
      },
      {
        title: 'Thực phẩm nên hạn chế hoặc tránh',
        items: [
          'Nội tạng: gan, lòng, tim, óc — purine rất cao (150-1000 mg/100g)',
          'Hải sản có vỏ: tôm, cua, ghẹ — purine trung bình đến cao',
          'Thịt đỏ đậm: bò, heo nạc thăn — giới hạn 1-2 lần/tuần, khẩu phần nhỏ',
          'Rượu bia: tăng acid uric và giảm thải trừ qua thận'
        ]
      },
      {
        title: '30 món Việt an toàn cho người gout',
        content: 'Dưới đây là danh sách các món ăn truyền thống Việt Nam được điều chỉnh phù hợp:'
      },
      {
        title: 'Món mặn (protein)',
        items: [
          'Gà luộc gừng (bỏ da)',
          'Cá kho tộ (cá lóc, cá rô)',
          'Trứng chiên mỡ hành',
          'Đậu hũ nhồi thịt gà',
          'Cá diêu hồng hấp gừng',
          'Chả cá lã vọng (điều chỉnh)',
          'Gà xào sả ớt (ít dầu)',
          'Trứng kho tiêu'
        ]
      },
      {
        title: 'Canh & súp',
        items: [
          'Canh chua cá lóc',
          'Canh rau ngót nấu tôm (ít tôm)',
          'Súp bí đỏ',
          'Canh khổ qua nhồi thịt gà',
          'Canh mướp đắng nấu trứng'
        ]
      },
      {
        title: 'Rau củ',
        items: [
          'Rau muống xào tỏi',
          'Cải xào nấm',
          'Súp lơ luộc chấm mắm',
          'Bí đao xào tỏi',
          'Đậu que xào thịt gà',
          'Cà chua sốt trứng'
        ]
      },
      {
        title: 'Lưu ý quan trọng khi ăn uống',
        items: [
          'Uống đủ nước: 2-3 lít/ngày để giúp thận thải acid uric',
          'Tránh ăn quá no: chia thành nhiều bữa nhỏ trong ngày',
          'Kiểm soát cân nặng: béo phì làm tăng nguy cơ gout tái phát',
          'Hạn chế đường fructose: nước ngọt, nước trái cây đóng chai'
        ]
      },
      {
        title: 'Kết luận',
        content: 'Người bị gout hoàn toàn có thể ăn ngon và đủ dinh dưỡng. Chìa khóa là chọn đúng thực phẩm, nấu đúng cách, và kiểm soát khẩu phần. Danh sách 30 món trên đây là nền tảng để bạn xây dựng thực đơn gia đình an toàn, không nhạt nhẽo.'
      }
    ]
  },
  'tieu-duong-an-com': {
    slug: 'tieu-duong-an-com',
    title: 'Tiểu đường type 2 ăn cơm được không?',
    author: 'BS. Dinh dưỡng',
    organization: 'Viện Dinh Dưỡng',
    date: '12/02/2025',
    category: 'TIỂU ĐƯỜNG',
    categoryColor: '#C97B2A',
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800',
    intro: 'Câu hỏi phổ biến nhất từ người bị tiểu đường type 2: "Tôi có thể ăn cơm không?" Câu trả lời ngắn gọn: Có — nhưng đúng cách và đúng lượng.',
    sections: [
      {
        title: 'Tại sao nhiều người nghĩ phải bỏ cơm?',
        content: 'Cơm trắng có chỉ số đường huyết (GI) cao (73-90), nghĩa là làm tăng đường huyết nhanh sau ăn. Nhưng điều này không có nghĩa là bạn phải bỏ cơm hoàn toàn.'
      },
      {
        title: 'Cách ăn cơm an toàn cho người tiểu đường',
        items: [
          'Kiểm soát khẩu phần: 3-4 muỗng cơm/bữa (khoảng 100-120g)',
          'Kết hợp với rau và protein: ăn cơm cùng rau xanh và thịt/cá để giảm tốc độ hấp thụ đường',
          'Ăn cơm nguội: cơm để nguội tạo tinh bột kháng, giảm GI xuống 20-30%',
          'Chọn gạo lứt hoặc gạo trộn: GI thấp hơn, nhiều chất xơ hơn'
        ]
      },
      {
        title: 'Thay thế cơm trắng',
        items: [
          'Gạo lứt: GI 50-55, giàu chất xơ',
          'Gạo trộn ngũ cốc: kết hợp gạo trắng + gạo lứt + hạt diêm mạch',
          'Khoai lang: GI thấp hơn cơm (54), giàu vitamin A',
          'Bí đỏ hấp: GI rất thấp (75), nhiều chất chống oxy hóa'
        ]
      }
    ]
  }
};

export function ArticleDetailPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  
  const isAuthenticated = !!localStorage.getItem('user');
  const familyData = isAuthenticated ? JSON.parse(localStorage.getItem('familyMembers') || '[]') : [];
  
  // Get first family member for personalized CTA
  const getFirstMember = () => {
    if (!familyData || familyData.length === 0) return null;
    return familyData[0];
  };

  const firstMember = getFirstMember();
  
  // Get article content
  const article = slug ? ARTICLES[slug] : null;

  if (!article) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p
            style={{
              fontSize: '15px',
              color: 'var(--color-text-secondary)'
            }}>
            Bài viết không tồn tại
          </p>
          <button
            onClick={() => navigate('/dinh-duong')}
            className="mt-4 rounded-full px-5 py-2"
            style={{
              backgroundColor: 'var(--color-primary)',
              border: 'none',
              fontSize: '15px',
              fontWeight: 600,
              color: '#ffffff',
              cursor: 'pointer'
            }}>
            Quay lại Dinh Dưỡng
          </button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link đã được sao chép!');
    }
  };

  return (
    <div 
      className="min-h-screen">
      
      {/* Back Bar */}
      <div 
        className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)'
        }}>
        <button
          onClick={() => navigate('/dinh-duong')}
          className="flex items-center gap-2"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '15px',
            color: 'var(--color-text-secondary)'
          }}>
          <ArrowLeft size={20} strokeWidth={1.5} />
          Dinh Dưỡng
        </button>
        <button
          onClick={handleShare}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            padding: '8px'
          }}>
          <Share2 size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Article Content */}
      <article className="max-w-2xl mx-auto px-4 py-6 pb-24">
        
        {/* Hero Image */}
        <div 
          className="rounded-2xl overflow-hidden mb-6 relative"
          style={{ height: '240px' }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(135deg, ${article.categoryColor}33 0%, ${article.categoryColor}66 100%)`
            }}>
            <img 
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover opacity-60"
            />
          </div>
          <div 
            className="absolute bottom-4 left-4 rounded-full px-3 py-1"
            style={{
              backgroundColor: article.categoryColor,
              fontSize: '10px',
              fontWeight: 600,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
            {article.category}
          </div>
        </div>

        {/* Article Header */}
        <h1
          className="mb-3"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: '1.3'
          }}>
          {article.title}
        </h1>

        {/* Meta */}
        <div 
          className="mb-6 pb-6"
          style={{ borderBottom: '1px solid var(--color-border)' }}>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)'
            }}>
            {article.author} · {article.organization} · {article.date}
          </p>
        </div>

        {/* Intro */}
        <p
          className="mb-8"
          style={{
            fontSize: '17px',
            color: 'var(--color-text-primary)',
            lineHeight: '1.7',
            fontWeight: 500
          }}>
          {article.intro}
        </p>

        {/* Article Sections */}
        {article.sections.map((section, index) => (
          <div key={index} className="mb-8">
            <h2
              className="mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                lineHeight: '1.3'
              }}>
              {section.title}
            </h2>
            
            {section.content && (
              <p
                className="mb-4"
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.7'
                }}>
                {section.content}
              </p>
            )}

            {section.items && (
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 mt-1"
                      style={{ color: 'var(--color-health)' }}>
                      <Check size={18} strokeWidth={2} />
                    </div>
                    <span
                      style={{
                        fontSize: '15px',
                        color: 'var(--color-text-secondary)',
                        lineHeight: '1.7'
                      }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Inline App CTA */}
        <div 
          className="rounded-2xl p-5 mt-10 mb-8"
          style={{
            backgroundColor: 'var(--color-primary-light)',
            border: '2px solid var(--color-primary-border)'
          }}>
          <div className="flex items-start gap-3">
            <div 
              className="flex-shrink-0"
              style={{ color: 'var(--color-primary)' }}>
              <Lightbulb size={24} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              {isAuthenticated && firstMember ? (
                <>
                  <h3
                    className="mb-2"
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--color-primary)'
                    }}>
                    App đã áp dụng cho {firstMember.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.6'
                    }}>
                    Gợi ý bữa ăn tự động lọc {firstMember.healthConditions?.join(', ') || 'bệnh lý'} — không cần nhớ danh sách này.
                  </p>
                </>
              ) : (
                <>
                  <h3
                    className="mb-2"
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--color-primary)'
                    }}>
                    Để app áp dụng cho gia đình bạn
                  </h3>
                  <p
                    className="mb-4"
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.6'
                    }}>
                    Gợi ý bữa ăn tự động lọc theo bệnh lý gia đình — bạn không cần nhớ danh sách này.
                  </p>
                  <button
                    onClick={() => navigate('/onboarding')}
                    className="rounded-full px-4 py-2 inline-flex items-center gap-2"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}>
                    Dùng miễn phí 14 ngày →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Back to Blog Link */}
        <div className="text-center pt-8">
          <button
            onClick={() => navigate('/dinh-duong')}
            className="inline-flex items-center gap-2"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-primary)'
            }}>
            <ArrowLeft size={16} strokeWidth={2} />
            Đọc thêm bài viết khác
          </button>
        </div>
      </article>

      {/* Bottom Navigation - Only for authenticated users */}
      {isAuthenticated && <BottomNav />}
    </div>
  );
}