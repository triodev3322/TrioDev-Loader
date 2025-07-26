import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Loader = ({ result }) => {
  const containerRef = useRef(null);
  const svgContainerRef = useRef(null);
  const [looping, setLooping] = useState(true);

  useEffect(() => {
    if (result) {
      setLooping(false);
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });
    }
  }, [result]);

  useEffect(() => {
    if (!looping) return;

    fetch('/logo.svg')
      .then((res) => res.text())
      .then((svgText) => {
        svgContainerRef.current.innerHTML = svgText;

        const paths = svgContainerRef.current.querySelectorAll('path');

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });

        paths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
            stroke: '#0f766e',
            fill: 'transparent',
          });
        });

        paths.forEach((path, i) => {
          const length = path.getTotalLength();
          tl.to(
            path,
            {
              strokeDashoffset: 0,
              fill: '#0f766e',
              duration: 1.6,
              ease: 'power2.inOut',
            },
            i * 0.05 
          );
        });

        paths.forEach((path, i) => {
          const length = path.getTotalLength();
          tl.to(
            path,
            {
              strokeDashoffset: length,
              fill: 'transparent',
              duration: 1.6,
              ease: 'power2.inOut',
            },
            '+=0.8' + i * 0.03 
          );
        });
      });
  }, [looping]);

  return looping ? (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center transition-opacity duration-500"
    >
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-400/40 to-white/10 blur-3xl opacity-50 animate-ping" />
        <div
          ref={svgContainerRef}
          className="relative z-10 w-40 h-40 [&_svg]:w-full [&_svg]:h-full [&_path]:stroke-[2px]"
        />
      </div>

      <div className="mt-1 text-gray-600 text-sm tracking-wider font-medium animate-pulse">
        Loading your experience...
      </div>

      <div className="mt-4 w-40 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-400 to-teal-600"
          style={{
            animation: 'progressAnim 3s ease-in-out infinite alternate',
          }}
        />
      </div>

      <style>
        {`
          @keyframes progressAnim {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}
      </style>
    </div>
  ) : null;
};

export default Loader;
