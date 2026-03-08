import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Play, Pause, RotateCcw, Check, ArrowLeft, X } from "lucide-react";

interface CookingStep {
  id: number;
  instruction: string;
  timerMinutes?: number;
}

export function CookingScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const dishId = searchParams.get('dish') || '1';
  
  // Mock recipe data
  const recipe = {
    id: dishId,
    name: 'Canh Chua Cá Lóc',
    steps: [
      { id: 1, instruction: 'Sơ chế cá lóc, cắt thành miếng vừa ăn. Rửa sạch và để ráo nước.' },
      { id: 2, instruction: 'Chuẩn bị các nguyên liệu khác: cà chua thái múi cau, dứa cắt miếng, giá đỗ rửa sạch.' },
      { id: 3, instruction: 'Đun nước sôi trong nồi, thêm cá lóc vào luộc sơ trong 5 phút.', timerMinutes: 5 },
      { id: 4, instruction: 'Thêm cà chua, dứa, giá đỗ vào nồi nước.' },
      { id: 5, instruction: 'Đun nhỏ lửa, thêm rau ngổ, hành tím, tỏi băm nhỏ.' },
      { id: 6, instruction: 'Nêm me, nước mắm, đường, muối, bột canh vào nồi.' },
      { id: 7, instruction: 'Đun nhỏ lửa, nấu thêm 10 phút cho các vị ngấm đều.', timerMinutes: 10 },
      { id: 8, instruction: 'Dùng muỗng canh múc ra cá lóc và rau ngổ, xếp vào tô.' },
      { id: 9, instruction: 'Đổ canh vào tô, trang trí thêm rau thơm. Thưởng thức nóng.' },
    ] as CookingStep[]
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const currentStep = recipe.steps[currentStepIndex];
  const isLastStep = currentStepIndex === recipe.steps.length - 1;

  // Keep screen awake (via meta tag or API)
  useEffect(() => {
    // Request wake lock if supported
    let wakeLock: any = null;
    
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.log('Wake lock not supported');
      }
    };
    
    requestWakeLock();
    
    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, []);

  // Update clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || timerSeconds <= 0) return;
    
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Auto-start timer when entering a step with timer
  useEffect(() => {
    if (currentStep.timerMinutes && !completedSteps.includes(currentStep.id)) {
      setTimerSeconds(currentStep.timerMinutes * 60);
      setIsTimerRunning(true);
    }
  }, [currentStepIndex, currentStep.id, currentStep.timerMinutes]);

  const handleCompleteStep = () => {
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id]);
    }
    
    if (isLastStep) {
      // Navigate to completion screen (S-09)
      navigate('/app/complete?dish=' + dishId);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsTimerRunning(false);
    }
  };

  const handleExitCooking = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    navigate('/app/summary');
  };

  const handlePlayPause = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    if (currentStep.timerMinutes) {
      setTimerSeconds(currentStep.timerMinutes * 60);
      setIsTimerRunning(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <>
      <div 
        className="min-h-screen flex flex-col">
        
        {/* Black Header */}
        <div 
          className="px-4 py-5"
          style={{
            backgroundColor: '#1a1a1a',
            borderBottom: '1px solid #333'
          }}>
          <div className="flex items-center justify-between">
            {/* Dish Name */}
            <h1
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#ffffff',
                flex: 1
              }}>
              {recipe.name}
            </h1>
            
            {/* Clock */}
            <div
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: '0.05em'
              }}>
              {currentTime}
            </div>
          </div>
        </div>

        {/* Timer Controls (if current step has timer) */}
        {currentStep.timerMinutes && (
          <div 
            className="px-4 py-6"
            style={{
              backgroundColor: '#1a1a1a',
              borderBottom: '1px solid #333'
            }}>
            {/* Timer Display */}
            <div 
              className="text-center mb-4"
              style={{
                fontSize: '48px',
                fontWeight: 700,
                color: timerSeconds <= 60 ? '#ff6b6b' : '#ffffff',
                letterSpacing: '0.02em'
              }}>
              {formatTimer(timerSeconds)}
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-4">
              {/* Reset */}
              <button
                onClick={handleResetTimer}
                className="rounded-full flex items-center justify-center transition-all"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}>
                <RotateCcw size={20} strokeWidth={1.5} />
              </button>

              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="rounded-full flex items-center justify-center transition-all"
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  color: '#1a1a1a'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}>
                {isTimerRunning ? (
                  <Pause size={28} strokeWidth={2} fill="#1a1a1a" />
                ) : (
                  <Play size={28} strokeWidth={2} fill="#1a1a1a" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          
          {/* Active Step Card */}
          <div 
            className="rounded-xl p-5 mb-6"
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              border: '1px solid var(--color-border-strong)'
            }}>
            {/* Label */}
            <div className="mb-3">
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: 'var(--color-primary)',
                  textTransform: 'uppercase'
                }}>
                Bước đang làm
              </span>
            </div>

            {/* Step Number */}
            <div 
              className="inline-flex items-center justify-center rounded-full mb-3"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700
              }}>
              {currentStep.id}
            </div>

            {/* Step Instruction */}
            <p
              style={{
                fontSize: '17px',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                lineHeight: '1.7'
              }}>
              {currentStep.instruction}
            </p>
          </div>

          {/* All Steps List */}
          <div className="mb-6">
            <div className="mb-3">
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase'
                }}>
                Tất cả các bước
              </span>
            </div>

            <div className="space-y-3">
              {recipe.steps.map((step, index) => {
                const isDone = completedSteps.includes(step.id);
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;
                
                return (
                  <div 
                    key={step.id}
                    className="flex gap-3"
                    style={{
                      opacity: isDone ? 0.4 : isPending ? 0.3 : 1
                    }}>
                    {/* Step Circle */}
                    <div 
                      className="rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: isDone 
                          ? 'var(--color-health)' 
                          : isCurrent 
                            ? 'var(--color-primary)' 
                            : 'transparent',
                        border: isDone || isCurrent ? 'none' : '1px solid var(--color-border)',
                        color: isDone || isCurrent ? '#ffffff' : 'var(--color-text-disabled)'
                      }}>
                      {isDone ? (
                        <Check size={12} strokeWidth={2.5} />
                      ) : (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600
                          }}>
                          {step.id}
                        </span>
                      )}
                    </div>

                    {/* Step Text */}
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: isCurrent ? 600 : 400,
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.6',
                        flex: 1
                      }}>
                      {step.instruction}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* CTA Bar */}
        <div 
          className="p-4"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)'
          }}>
          
          {/* Primary Actions Row */}
          <div className="flex items-center gap-3 mb-3">
            {/* Complete Step Button */}
            <button
              onClick={handleCompleteStep}
              className="btn btn-primary flex-1 rounded-full transition-all flex items-center justify-center gap-2"
              style={{
                height: '52px'
              }}>
              <Check size={18} strokeWidth={2} />
              {isLastStep ? 'Hoàn thành' : `Xong bước ${currentStep.id}`}
            </button>

            {/* Previous Step Button */}
            {currentStepIndex > 0 && (
              <button
                onClick={handlePreviousStep}
                className="flex-shrink-0 rounded-full transition-all flex items-center justify-center gap-2 hover-bg-alt"
                style={{
                  height: '52px',
                  width: '52px',
                  backgroundColor: 'transparent',
                  border: '2px solid var(--color-border-strong)',
                  color: 'var(--color-text-secondary)'
                }}>
                <ArrowLeft size={18} strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Exit Link */}
          <div className="text-center">
            <button
              onClick={handleExitCooking}
              className="hover-text-dark"
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}>
              Thoát nấu
            </button>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div 
          className="fixed inset-0 flex items-end justify-center z-50"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          onClick={() => setShowExitDialog(false)}>
          
          <div 
            className="w-full max-w-md rounded-t-2xl p-6"
            style={{
              backgroundColor: 'var(--color-surface)',
              boxShadow: 'var(--shadow-overlay)'
            }}
            onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowExitDialog(false)}
                className="rounded-full flex items-center justify-center"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-secondary)'
                }}>
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="mb-6">
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '12px'
                }}>
                Thoát chế độ nấu?
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6'
                }}>
                Tiến trình sẽ không được lưu.
              </p>
            </div>

            {/* Dialog Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitDialog(false)}
                className="flex-1 rounded-full transition-all hover-bg-alt"
                style={{
                  height: '52px',
                  backgroundColor: 'transparent',
                  border: '2px solid var(--color-border-strong)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)'
                }}>
                Hủy
              </button>

              <button
                onClick={confirmExit}
                className="btn btn-primary flex-1 rounded-full transition-all"
                style={{
                  height: '52px'
                }}>
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}