import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4">
      
      <div className="text-center">
        <h1
          className="mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '36px',
            fontWeight: 600,
            color: 'var(--color-text-primary)'
          }}>
          404
        </h1>
        
        <p
          className="mb-8"
          style={{
            fontSize: '15px',
            color: 'var(--color-text-secondary)',
            maxWidth: '280px'
          }}>
          Trang này không tồn tại
        </p>

        <button
          onClick={() => navigate('/app/home')}
          className="btn btn-primary rounded-full transition-all flex items-center justify-center gap-2"
          style={{
            height: '52px',
            padding: '0 24px'
          }}>
          <ArrowLeft size={18} strokeWidth={1.5} />
          Về trang chủ
        </button>
      </div>
    </div>
  );
}