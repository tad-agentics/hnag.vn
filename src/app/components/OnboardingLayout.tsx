import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

interface OnboardingLayoutProps {
  /** 1-based current step number (1–4) */
  currentStep: number;
  /** Total number of steps shown in the progress bar */
  totalSteps?: number;
  /** Text for the back button */
  backLabel?: string;
  /** Custom back handler — defaults to navigate(-1) */
  onBack?: () => void;
  /** Content of the page */
  children: React.ReactNode;
}

export function OnboardingLayout({
  currentStep,
  totalSteps = 4,
  backLabel = "Quay lại",
  onBack,
  children,
}: OnboardingLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        {/* Back Link */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 mb-4 transition-colors hover-text-accent"
          style={{
            fontSize: '14px',
            color: 'var(--color-primary)',
            fontWeight: 500
          }}>
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          {backLabel}
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className="h-1 flex-1 rounded-full transition-all"
              style={{
                backgroundColor: step <= currentStep
                  ? 'var(--color-primary)'
                  : 'var(--color-border)'
              }}
            />
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}