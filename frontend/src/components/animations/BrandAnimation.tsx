import React from 'react';

const BrandAnimation = () => {
  return (
    <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Morphing Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 animate-morph blur-3xl"></div>
          
          {/* Animated Particles */}
          <div className="absolute w-full h-full">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/30 animate-float-rotate"
                style={{
                  width: Math.random() * 6 + 2 + 'px',
                  height: Math.random() * 6 + 2 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animationDuration: `${Math.random() * 8 + 4}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Energy Lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-pulse-slow"
              style={{
                top: `${(i + 1) * 12.5}%`,
                transform: `rotate(${i % 2 === 0 ? '5deg' : '-5deg'})`,
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Main Brand Text Container */}
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute inset-0 blur-2xl bg-blue-400/20 scale-150 animate-pulse-slow"></div>
          
          {/* Main Text */}
          <div className="relative text-7xl font-bold tracking-tight z-10 flex items-center gap-1">
            {/* Write */}
            <div className="relative inline-block group-hover:animate-wave">
              <span className="relative z-10 text-black animate-bounce-slow">Write</span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-black to-transparent transform origin-left scale-x-0 animate-expand"></div>
            </div>
            
            {/* lli */}
            <div className="relative inline-block group-hover:animate-wave" style={{ animationDelay: '0.1s' }}>
              <span className="relative z-10 text-[#0072df] animate-glow">
                <span className="animate-bounce-slow inline-block" style={{ animationDelay: '0.1s' }}>l</span>
                <span className="animate-bounce-slow inline-block" style={{ animationDelay: '0.2s' }}>l</span>
                <span className="animate-bounce-slow inline-block" style={{ animationDelay: '0.3s' }}>i</span>
              </span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#0072df] to-transparent transform origin-left scale-x-0 animate-expand animation-delay-300"></div>
            </div>
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine"></div>
        </div>

        {/* Orbiting Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Circles */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-32 rounded-full border-2 border-white/10 animate-spin-slow"
              style={{
                top: `${25 + i * 15}%`,
                left: `${25 + i * 15}%`,
                animationDuration: `${8 + i * 2}s`,
                animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandAnimation;
