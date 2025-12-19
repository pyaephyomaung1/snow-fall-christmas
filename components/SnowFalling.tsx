"use client";

import { useEffect, useRef } from "react";

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
  wind: number;
};

type MousePosition = {
  x: number;
  y: number;
};

export default function SnowFalling() {
  const BASE_SPEED = 0.5; // constant medium fall speed
  const FLAKE_COUNT = 150; // medium density

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flakes = useRef<Snowflake[]>([]);
  const mousePos = useRef<MousePosition>({ x: 0, y: 0 });
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

    const createFlake = (): Snowflake => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 0.5 + 0.5,
        speed: BASE_SPEED,
        sway: Math.random() * 0.15,
        swaySpeed: Math.random() * 0.05 + 0.02,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.8 + 0.2,
        color: "rgba(255, 255, 255, 0.9)",
        wind: Math.random() * 0.5 - 0.25
      };
    };

    // Initialize snowflakes
    flakes.current = Array.from({ length: FLAKE_COUNT }, createFlake);

    const drawHexSnowflake = (ctx: CanvasRenderingContext2D, f: Snowflake) => {
      const arms = 6;
      const armLength = f.r * 4;

      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.lineWidth = Math.max(0.8, f.r * 0.6);
      ctx.lineCap = "round";
      ctx.strokeStyle = f.color;

      for (let i = 0; i < arms; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / arms);

        // main arm
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -armLength);
        ctx.stroke();

        // side branches
        ctx.beginPath();
        ctx.moveTo(0, -armLength * 0.5);
        ctx.lineTo(-armLength * 0.25, -armLength * 0.7);
        ctx.moveTo(0, -armLength * 0.5);
        ctx.lineTo(armLength * 0.25, -armLength * 0.7);
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore();
    };

    const animate = (timestamp: number) => {
      const deltaTime = lastTime.current ? timestamp - lastTime.current : 16;
      lastTime.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (gradientRef.current) {
        ctx.fillStyle = gradientRef.current;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const time = timestamp * 0.0001; // slow, stable time base

      flakes.current.forEach((f) => {
        f.y += f.speed * (deltaTime / 16);
        f.x += Math.sin(f.swayOffset + time * f.swaySpeed) * f.sway + windForce.current + f.wind;
        
        const dx = f.x - mousePos.current.x;
        const dy = f.y - mousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const avoidRadius = 100;
        
        if (distance < avoidRadius && distance > 20) {
          const force = (avoidRadius - distance) / avoidRadius;
          f.x += (dx / distance) * force;
          f.y += (dy / distance) * force;
        }

        if (f.y > canvas.height + 10) {
          Object.assign(f, createFlake());
          f.y = -10;
          f.x = Math.random() * canvas.width;
        }
        
        if (f.x > canvas.width + 10) f.x = -10;
        if (f.x < -10) f.x = canvas.width + 10;

        const drawX = Math.round(f.x * 2) / 2;
        const drawY = Math.round(f.y * 2) / 2;

        ctx.save();
        ctx.globalAlpha = f.opacity;
        ctx.fillStyle = f.color;
        ctx.strokeStyle = f.color;

        drawHexSnowflake(ctx, { ...f, x: drawX, y: drawY });

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
  }, []);


  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
      
    </div>
  );
}