'use client';

import { ReactNode, useEffect, useRef } from 'react'
import { Paintbrush } from 'lucide-react'
import './auth.css'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const particleCount = 80; // Reduced for better performance
    const connectionDistance = 120;
    const mouseRadius = 100;
    let mouseX = 0;
    let mouseY = 0;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.fill();

        // Connect particles
        particles.forEach((otherParticle, otherIndex) => {
          if (index === otherIndex) return;

          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const opacity = (1 - distance / connectionDistance) * 0.3;
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        // Connect to mouse
        const mouseDx = particle.x - mouseX;
        const mouseDy = particle.y - mouseY;
        const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        if (mouseDistance < mouseRadius) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseX, mouseY);
          const opacity = (1 - mouseDistance / mouseRadius) * 0.5;
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="auth-container min-h-screen relative overflow-hidden bg-gray-900">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="auth-canvas absolute inset-0 z-0"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Branding - Hidden on mobile and tablet */}
        <div className="hidden xl:flex xl:w-1/2 xl:flex-col xl:justify-center xl:px-8">
          <div className="mx-auto max-w-sm">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-8 shadow-lg shadow-orange-500/25">
                <Paintbrush className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                PakeAja CRM
              </h1>
              <p className="mt-4 text-base text-gray-300">
                Solusi Coating Management Terpadu
              </p>
            </div>
            
            <div className="mt-10 space-y-3">
              <div className="flex items-start space-x-3 backdrop-blur-sm bg-white/5 rounded-lg p-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <svg className="h-2.5 w-2.5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-white">Kalkulasi Coating Akurat</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Multi-brand support dengan spreading rate tepat</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 backdrop-blur-sm bg-white/5 rounded-lg p-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="h-2.5 w-2.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-white">Project Management</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Monitoring progress dengan weather integration</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 backdrop-blur-sm bg-white/5 rounded-lg p-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <svg className="h-2.5 w-2.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-white">Sales Pipeline</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Lead tracking & conversion optimization</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex flex-1 flex-col justify-center px-6 py-12 xl:px-8">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile branding */}
            <div className="text-center xl:hidden mb-8">
              <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/25">
                <Paintbrush className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                PakeAja CRM
              </h1>
              <p className="mt-2 text-sm text-gray-300">
                Solusi Coating Management Terpadu
              </p>
            </div>
            
            {/* Auth form content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 