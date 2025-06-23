
import { useRef } from 'react';

interface Package3DProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
  animated?: boolean;
}

const Package3D = ({ position, scale = 1, color = '#8B5CF6', animated = true }: Package3DProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  // Simple 2D representation instead of 3D
  return (
    <div 
      ref={divRef}
      className="relative w-16 h-16 mx-auto"
      style={{
        transform: `scale(${scale})`,
        animation: animated ? 'float 2s ease-in-out infinite' : 'none'
      }}
    >
      <div 
        className="w-full h-full rounded-lg shadow-lg"
        style={{ backgroundColor: color }}
      />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Package3D;
