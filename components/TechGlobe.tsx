
import React, { useMemo } from 'react';

// Function to generate points on a sphere using Fibonacci lattice
const generateGlobePoints = (samples: number) => {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians

  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
    const radius = Math.sqrt(1 - y * y); // radius at y
    const theta = phi * i; // golden angle increment
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    const lat = Math.asin(y) * 180 / Math.PI;
    const lon = Math.atan2(z, x) * 180 / Math.PI;
    points.push({ lat, lon });
  }
  return points;
};

const GlobePoint: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
  const containerStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: `rotateY(${lon}deg) rotateX(${-lat}deg) translateZ(var(--globe-radius))`,
  };
  const dotStyle = { animationDelay: `${Math.random() * 6}s` };
  return (
    <div style={containerStyle}>
      <div className="globe-dot" style={dotStyle}></div>
    </div>
  );
};

const ConnectionLine: React.FC<{ rX: number; rY: number; rZ: number; }> = ({ rX, rY, rZ }) => {
  const containerStyle = { transform: `rotateX(${rX}deg) rotateY(${rY}deg) rotateZ(${rZ}deg)` };
  return (
    <div className="connection-line-container" style={containerStyle}>
        <div className="connection-line"></div>
    </div>
  );
};

interface TechGlobeProps {
  startAnimation: boolean;
}

const TechGlobe: React.FC<TechGlobeProps> = ({ startAnimation }) => {
  const globePoints = useMemo(() => generateGlobePoints(150), []);
  const connectionLines = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      rX: Math.random() * 360,
      rY: Math.random() * 360,
      rZ: Math.random() * 360,
    }));
  }, []);

  // Oculta completamente o globo em telas pequenas para evitar qualquer custo de renderização.
  // A HeroSection já tem um pseudo-elemento de background para mobile.
  // Esta abordagem é mais performática que renderizar um globo 2D simplificado.
  return (
    <div className="tech-globe-container hidden md:flex">
      <div className={`globe-wrapper ${startAnimation ? 'settle-effect' : ''}`}>
        <div className="globe-background"></div>
        <div className={`rotating-elements ${startAnimation ? 'is-animating' : ''}`}>
          {globePoints.map((p, i) => <GlobePoint key={`dot-${i}`} {...p} />)}
          {connectionLines.map((l, i) => <ConnectionLine key={`line-${i}`} {...l} />)}
        </div>
      </div>
    </div>
  );
};

export default TechGlobe;
