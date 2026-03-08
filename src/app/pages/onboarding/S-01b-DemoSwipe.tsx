import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, X, Check, Clock, DollarSign, Users, CheckCircle } from "lucide-react";
import dishImage from "@/assets/114ba5fefffd477df4c6c425cad3b0c295781848.png";

export function DemoSwipeScreen() {
  const navigate = useNavigate();
  const [swiped, setSwiped] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const offsetX = clientX - dragStart.x;
    const offsetY = clientY - dragStart.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const swipeThreshold = 100;
    const { x } = dragOffset;
    
    if (Math.abs(x) > swipeThreshold) {
      // Swipe completed - animate off screen
      const direction = x > 0 ? 1 : -1;
      setDragOffset({ x: direction * 500, y: dragOffset.y });
      
      setTimeout(() => {
        setSwiped(true);
        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
      }, 300);
    } else {
      // Snap back to center
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
    }
  };

  const handleAccept = () => {
    // Animate swipe right
    setDragOffset({ x: 500, y: -50 });
    setTimeout(() => {
      setSwiped(true);
      setDragOffset({ x: 0, y: 0 });
    }, 300);
  };

  const handleReject = () => {
    // Animate swipe left
    setDragOffset({ x: -500, y: -50 });
    setTimeout(() => {
      setSwiped(true);
      setDragOffset({ x: 0, y: 0 });
    }, 300);
  };

  // Calculate rotation based on drag
  const rotation = Math.max(-5, Math.min(5, dragOffset.x * 0.05)); // Cap at ±5 degrees
  const opacity = Math.max(0, 1 - Math.abs(dragOffset.x) / 200);

  // Determine swipe direction for background tint
  const getSwipeStyle = () => {
    if (Math.abs(dragOffset.x) < 30) return {};
    
    if (dragOffset.x > 0) {
      // Swipe right - health green tint
      return {
        backgroundColor: 'rgba(90, 138, 106, 0.06)'
      };
    } else {
      // Swipe left - primary terracotta tint
      return {
        backgroundColor: 'rgba(217, 98, 43, 0.06)'
      };
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col px-4 py-6">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 
          className="mb-2"
          style={{ 
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: '1.3'
          }}>
          Thử xem — swipe để chọn
        </h1>
        <p 
          style={{ 
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.5'
          }}>
          Phù hợp? Vuốt phải <Check className="inline w-3 h-3" strokeWidth={2} /> · Không thích? Vuốt trái <X className="inline w-3 h-3" strokeWidth={2} />
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        
        {!swiped ? (
          /* Demo Card */
          <div className="w-full max-w-xs mb-8">
            {/* Swipe Card */}
            <div 
              ref={cardRef}
              className="rounded-3xl overflow-hidden select-none cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
              onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchEnd={handleDragEnd}
              style={{ 
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-strong)',
                transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1.0)',
                opacity: opacity,
                ...getSwipeStyle()
              }}>
              {/* Dish Image */}
              <div 
                className="relative w-full overflow-hidden"
                style={{ height: '200px' }}>
                <img 
                  src={dishImage} 
                  alt="Canh Chua Cá Lóc"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: 'linear-gradient(to top, rgba(30,20,16,0.7) 0%, transparent 55%)'
                  }}>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                {/* Dish Name */}
                <h2 
                  className="mb-3"
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.3'
                  }}>
                  Canh Chua Cá Lóc
                </h2>

                {/* Tags Row */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {/* Health Tag - Ba (Gout phù hợp) */}
                  <div className="pill-tag pill-tag-health">
                    <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Ba (Gout phù hợp)</span>
                  </div>

                  {/* Family Tag - Cả nhà */}
                  <div className="pill-tag pill-tag-health">
                    <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Cả nhà</span>
                  </div>
                </div>

                {/* Meta Row - Time & Budget */}
                <div className="flex gap-3">
                  {/* Time */}
                  <div className="pill-tag">
                    <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>25p</span>
                  </div>

                  {/* Budget */}
                  <div className="pill-tag">
                    <DollarSign className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>60k</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-6 mt-6">
              {/* Reject Button */}
              <div className="text-center">
                <button
                  onClick={handleReject}
                  className="rounded-full inline-flex items-center justify-center transition-all duration-150"
                  style={{ 
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'transparent',
                    border: '2px solid var(--color-border-strong)',
                    color: 'var(--color-text-secondary)'
                  }}>
                  <X className="w-6 h-6" strokeWidth={1.5} />
                </button>
                <p 
                  className="mt-2"
                  style={{ 
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)'
                  }}>
                  Bỏ qua
                </p>
              </div>

              {/* Accept Button */}
              <div className="text-center">
                <button
                  onClick={handleAccept}
                  className="rounded-full inline-flex items-center justify-center transition-all duration-150"
                  style={{ 
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'transparent',
                    border: '2px solid var(--color-primary)',
                    color: 'var(--color-primary)'
                  }}>
                  <Check className="w-7 h-7" strokeWidth={2} />
                </button>
                <p 
                  className="mt-2"
                  style={{ 
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-primary)'
                  }}>
                  Chọn!
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Post-Swipe Completion Card */
          <div className="w-full max-w-md mb-6">
            <div 
              className="rounded-2xl p-6 text-center"
              style={{ 
                backgroundColor: '#E8F2EC',
                border: '2px dashed var(--color-health-border)'
              }}>
              <h3 
                className="mb-2"
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)'
                }}>
                Xong rồi.
              </h3>
              <p 
                style={{ 
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6'
                }}>
                Để mình hỏi thêm về gia đình — gợi ý sẽ đúng hơn cho từng người.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CTA Button - only show after swiped */}
      {swiped && (
        <div className="w-full max-w-md mx-auto">
          <button
            onClick={() => navigate('/onboarding/family')}
            className="btn btn-lg btn-primary w-full inline-flex items-center justify-center gap-2">
            Tiếp tục
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
}