"use client";

import { useState, useEffect, useRef } from 'react';

export function MouseSpotlight() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Smooth animation with easing
  useEffect(() => {
    const animate = () => {
      setSmoothPosition(prevPos => {
        const dx = mousePosition.x - prevPos.x;
        const dy = mousePosition.y - prevPos.y;
        
        // Easing factor - smaller value = slower movement
        const easing = 0.05;
        
        return {
          x: prevPos.x + dx * easing,
          y: prevPos.y + dy * easing
        };
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <div
      className="fixed inset-0 pointer-events-none transition-opacity duration-300"
      style={{
        background: `radial-gradient(900px circle at ${smoothPosition.x}px ${smoothPosition.y}px, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 40%, rgba(255, 255, 255, 0.02) 60%, transparent 100%)`,
        zIndex: 1,
      }}
    />
  );
}
