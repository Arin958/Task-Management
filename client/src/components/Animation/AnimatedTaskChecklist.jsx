import { useEffect, useRef } from 'react';

const AnimatedTaskChecklist = () => {
  const pathsRef = useRef([]);
  const dotsRef = useRef([]);

  useEffect(() => {
    // Apply animations directly via style attributes
    pathsRef.current.forEach((path, i) => {
      path.style.animation = `draw 1s ${i * 0.2}s forwards`;
      path.style.strokeDasharray = '100';
      path.style.strokeDashoffset = '100';
    });
    
    dotsRef.current.forEach((dot, i) => {
      dot.style.animation = `float 3s ${0.6 + i * 0.1}s infinite forwards`;
    });
  }, []);

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Pulsing background circle */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          animation: 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite'
        }}
      >
        <div className="w-40 h-40 rounded-full bg-indigo-400 opacity-20" />
      </div>

      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated checkmarks */}
        <path
          ref={el => pathsRef.current[0] = el}
          d="M20,30 L40,50 L80,20"
          className="stroke-white stroke-[4] fill-none opacity-0"
        />
        <path
          ref={el => pathsRef.current[1] = el}
          d="M20,50 L40,70 L80,40"
          className="stroke-white stroke-[4] fill-none opacity-0"
        />
        
        {/* Floating task dots */}
        {[70, 50, 30].map((y, i) => (
          <circle
            key={i}
            ref={el => dotsRef.current[i] = el}
            cx={20 + i * 30}
            cy={y}
            r="5"
            className="fill-white opacity-0"
          />
        ))}
      </svg>

      {/* Inline style tag for animations */}
      <style jsx>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          50% { transform: translateY(-15px); }
        }
        @keyframes ping {
          0% { transform: scale(0.8); opacity: 0.8; }
          70%, 100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedTaskChecklist;