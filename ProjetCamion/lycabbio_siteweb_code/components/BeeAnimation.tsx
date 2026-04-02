import React, { useEffect, useState, useRef } from 'react';
import { Bee } from '../types';

interface BeeAnimationProps {
  count?: number;
  behavior?: 'swarm' | 'wander';
  className?: string;
}

const BeeAnimation: React.FC<BeeAnimationProps> = ({ 
  count = 8, 
  behavior = 'swarm', 
  className = 'absolute inset-0 pointer-events-none z-0 overflow-hidden'
}) => {
  const [bees, setBees] = useState<Bee[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    // Initialize bees
    const initialBees: Bee[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Percentage X
      y: Math.random() * 100, // Percentage Y
      vx: (Math.random() - 0.5) * (behavior === 'wander' ? 0.3 : 0.5), // Slower velocity for wandering
      vy: (Math.random() - 0.5) * (behavior === 'wander' ? 0.3 : 0.5),
      scale: 0.5 + Math.random() * 0.5,
      angle: 0
    }));
    setBees(initialBees);

    const animate = () => {
      setBees(prevBees => prevBees.map(bee => {
        let { x, y, vx, vy, angle } = bee;

        if (behavior === 'swarm') {
            // Behavior: Hover around the center-bottom area
            const targetX = 50;
            const targetY = 70;

            // Gentle attraction to target area
            vx += (targetX - x) * 0.0005;
            vy += (targetY - y) * 0.0005;

            // Dampening
            vx *= 0.98;
            vy *= 0.98;
        } else {
            // Behavior: Wander freely (no attraction)
            // Occasional random change in direction
            if (Math.random() < 0.02) {
                vx += (Math.random() - 0.5) * 0.1;
                vy += (Math.random() - 0.5) * 0.1;
            }
            
            // Minimal dampening to keep them moving
            vx *= 0.995; 
            vy *= 0.995;
        }

        // Random noise (turbulence)
        vx += (Math.random() - 0.5) * 0.05;
        vy += (Math.random() - 0.5) * 0.05;

        // Speed limit
        const maxSpeed = behavior === 'wander' ? 0.4 : 1.0;
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > maxSpeed) {
          vx = (vx / speed) * maxSpeed;
          vy = (vy / speed) * maxSpeed;
        }

        x += vx;
        y += vy;

        // Boundaries (Bounce)
        if (x < -5) { x = -5; vx *= -1; }
        if (x > 105) { x = 105; vx *= -1; }
        if (y < -5) { y = -5; vy *= -1; }
        if (y > 105) { y = 105; vy *= -1; }

        // Calculate angle (convert velocity to degrees) + 90deg offset for SVG orientation
        // Smooth rotation for wanderers could be improved, but this works generally
        angle = Math.atan2(vy, vx) * (180 / Math.PI) + 90;

        return { ...bee, x, y, vx, vy, angle };
      }));
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [count, behavior]);

  return (
    <div className={className}>
      {bees.map((bee) => (
        <div
          key={bee.id}
          className="absolute will-change-transform drop-shadow-md"
          style={{
            left: `${bee.x}%`,
            top: `${bee.y}%`,
            transform: `translate(-50%, -50%) scale(${bee.scale}) rotate(${bee.angle}deg)`,
            transition: behavior === 'wander' ? 'transform 0.5s linear' : 'top 0.1s linear, left 0.1s linear'
          }}
        >
           {/* Detailed SVG Bee */}
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8C8 8 2 6 2 12C2 16 7 16 8 16" fill="white" fillOpacity="0.6" stroke="#000" strokeWidth="0.5"/>
            <path d="M16 8C16 8 22 6 22 12C22 16 17 16 16 16" fill="white" fillOpacity="0.6" stroke="#000" strokeWidth="0.5"/>
            <ellipse cx="12" cy="14" rx="5" ry="8" fill="#FBBF24" stroke="#451a03" strokeWidth="1.5"/>
            <path d="M8 12H16" stroke="#451a03" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 15H16" stroke="#451a03" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 18H15" stroke="#451a03" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="10" cy="9" r="1" fill="#000"/>
            <circle cx="14" cy="9" r="1" fill="#000"/>
          </svg>
        </div>
      ))}
    </div>
  );
};

export default BeeAnimation;