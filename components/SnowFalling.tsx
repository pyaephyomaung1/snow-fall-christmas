"use client";

import { useEffect, useRef, useState } from "react";

type Snowflake = {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  swaySpeed: number;
  swayOffset: number;
  opacity: number;
  color: string;
  sparkle: boolean;
  sparkleTimer: number;
  style: 'normal' | 'glitter' | 'crystal' | 'star';
  rotation: number;
  rotationSpeed: number;
  wind: number;
};

type MousePosition = {
  x: number;
  y: number;
};

export default function SnowFalling() {
  const BASE_SPEED = 0.6; // static, realistic fall speed

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flakes = useRef<Snowflake[]>([]);
  const mousePos = useRef<MousePosition>({ x: 0, y: 0 });
  const [snowIntensity, setSnowIntensity] = useState<'light' | 'medium' | 'heavy'>('medium');
  const windForce = useRef(0);
  const lastTime = useRef(0);
  const gradientRef = useRef<CanvasGradient | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Create gradient for colorful snow
      gradientRef.current = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );
      
      gradientRef.current.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradientRef.current.addColorStop(0.2, 'rgba(173, 216, 230, 0.08)');
      gradientRef.current.addColorStop(0.5, 'rgba(135, 206, 250, 0.06)');
      gradientRef.current.addColorStop(0.8, 'rgba(255, 255, 255, 0.04)');
      gradientRef.current.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      // Create wind effect based on mouse movement
      const dx = e.movementX;
      windForce.current = Math.max(-1, Math.min(1, dx * 0.02)) * 0.3;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    const getFlakeCount = () => {
      switch (snowIntensity) {
        case 'light': return 80;
        case 'medium': return 150;
        case 'heavy': return 250;
      }
    };

    const createFlake = (): Snowflake => {
      const styles: Array<Snowflake['style']> = ['normal', 'glitter', 'crystal', 'star'];
      const style = styles[Math.floor(Math.random() * styles.length)];
      const colors = [
        'rgba(255, 255, 255, 0.9)',
        'rgba(173, 216, 230, 0.8)',
        'rgba(240, 248, 255, 0.8)',
        'rgba(224, 255, 255, 0.8)',
        'rgba(255, 250, 240, 0.8)'
      ];
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: style === 'crystal' ? Math.random() * 2 + 1 : Math.random() * 3 + 1,
        speed: BASE_SPEED + Math.random() * 0.15,
        sway: Math.random() * 0.05,
        swaySpeed: Math.random() * 0.05 + 0.02,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        sparkle: Math.random() > 0.8,
        sparkleTimer: Math.random() * 100,
        style,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.02 - 0.01,
        wind: Math.random() * 0.5 - 0.25
      };
    };

    // Initialize snowflakes
    flakes.current = Array.from({ length: getFlakeCount() }, createFlake);

    const drawNormalFlake = (ctx: CanvasRenderingContext2D, f: Snowflake) => {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawCrystalFlake = (ctx: CanvasRenderingContext2D, f: Snowflake) => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rotation);
      
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(f.r * 3, 0);
        ctx.rotate(Math.PI / 3);
      }
      
      ctx.strokeStyle = f.color.replace('0.8', '0.6');
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    };

    const drawStarFlake = (ctx: CanvasRenderingContext2D, f: Snowflake) => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rotation);
      
      const spikes = 5;
      const outerRadius = f.r * 2;
      const innerRadius = f.r;
      
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / spikes) * i;
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      ctx.closePath();
      
      ctx.fillStyle = f.color;
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (ctx: CanvasRenderingContext2D, f: Snowflake) => {
      if (f.sparkle && Math.sin(f.sparkleTimer * 0.1) > 0) {
        ctx.save();
        ctx.translate(f.x, f.y);
        
        // Draw a glowing effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, f.r * 3);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, f.r * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw cross lines for sparkle
        ctx.strokeStyle = 'rgba(255, 255, 200, 0.8)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(-f.r * 2, 0);
          ctx.lineTo(f.r * 2, 0);
          ctx.stroke();
          ctx.rotate(Math.PI / 4);
        }
        
        ctx.restore();
      }
    };

    const drawFlakeTrail = (ctx: CanvasRenderingContext2D, f: Snowflake, prevY: number) => {
      const trailLength = 10;
      const gradient = ctx.createLinearGradient(f.x, f.y - trailLength, f.x, f.y);
      gradient.addColorStop(0, f.color.replace('0.8', '0.1'));
      gradient.addColorStop(1, 'transparent');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = f.r / 2;
      ctx.beginPath();
      ctx.moveTo(f.x, f.y - trailLength);
      ctx.lineTo(f.x, f.y);
      ctx.stroke();
    };

    const animate = (timestamp: number) => {
      const deltaTime = lastTime.current ? timestamp - lastTime.current : 16;
      lastTime.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (gradientRef.current) {
        ctx.fillStyle = gradientRef.current;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      flakes.current.forEach((f) => {
        const prevY = f.y;
        
        f.y += f.speed * (deltaTime / 16);
        f.x += Math.sin(f.swayOffset + timestamp * f.swaySpeed) * f.sway + windForce.current + f.wind;
        f.rotation += f.rotationSpeed;
        f.sparkleTimer += deltaTime * 0.001;
        
        const dx = f.x - mousePos.current.x;
        const dy = f.y - mousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const avoidRadius = 100;
        
        if (distance < avoidRadius) {
          const force = (avoidRadius - distance) / avoidRadius;
          f.x += (dx / distance) * force * 2;
          f.y += (dy / distance) * force * 2;
        }

        if (f.y > canvas.height + 10) {
          Object.assign(f, createFlake());
          f.y = -10;
          f.x = Math.random() * canvas.width;
        }
        
        if (f.x > canvas.width + 10) f.x = -10;
        if (f.x < -10) f.x = canvas.width + 10;

        ctx.save();
        ctx.globalAlpha = f.opacity;
        ctx.fillStyle = f.color;
        ctx.strokeStyle = f.color;
        
        if (f.speed > 0.7) {
          drawFlakeTrail(ctx, f, prevY);
        }
        
        switch (f.style) {
          case 'crystal':
            drawCrystalFlake(ctx, f);
            break;
          case 'star':
            drawStarFlake(ctx, f);
            break;
          default:
            drawNormalFlake(ctx, f);
        }
        
        drawSparkle(ctx, f);
        
        ctx.restore();
      });

      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < 50; i++) {
        const x = (i / 50) * canvas.width;
        const height = Math.sin(timestamp * 0.001 + i * 0.1) * 2 + 3;
        ctx.fillRect(x, canvas.height - height, 2, height);
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, [snowIntensity]);

  const changeSnowIntensity = (intensity: 'light' | 'medium' | 'heavy') => {
    setSnowIntensity(intensity);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
      
      <div className="absolute bottom-4 right-4 pointer-events-auto bg-black/30 backdrop-blur-sm rounded-full p-2 flex gap-2">
        {(['light', 'medium', 'heavy'] as const).map((level) => (
          <button
            key={level}
            onClick={() => changeSnowIntensity(level)}
            className={`px-3 py-1 rounded-full text-xs transition-all ${
              snowIntensity === level
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
      
      <div className="absolute top-4 left-4 pointer-events-auto text-white/60 text-xs bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg">
        Move cursor to interact with snow
      </div>
      
      <div className="absolute top-0 left-0 right-0 h-1 flex justify-between pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full animate-pulse ${
              i % 3 === 0 ? 'bg-red-500' : i % 3 === 1 ? 'bg-green-500' : 'bg-yellow-400'
            }`}
            style={{
              animationDelay: `${i * 0.1}s`,
              boxShadow: '0 0 8px currentColor'
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        .animate-pulse {
          animation: twinkle 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}