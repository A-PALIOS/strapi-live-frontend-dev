// app/_components/DapperTransition.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, Easing } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useNavProgress } from './NavProgressProvider';
import Image from 'next/image';

export default function DapperTransition() {
  const { isNavigating, stop } = useNavProgress();
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [phase, setPhase] = useState<'idle' | 'cover' | 'reveal'>('idle');
  const [visible, setVisible] = useState(false);

  // ✅ Start cover ONCE when navigation begins
  useEffect(() => {
    if (!isNavigating) return;
    setVisible(true);
    setPhase('cover');
    prevPathRef.current = pathname; // remember OLD path exactly once
  }, [isNavigating]); // <-- removed pathname from deps

  // If route changed while covering, kick to reveal (tiny delay to ensure fully closed)
  useEffect(() => {
    if (!visible) return;
    if (phase === 'cover' && pathname !== prevPathRef.current) {
      const t = setTimeout(() => setPhase('reveal'), 50);
      return () => clearTimeout(t);
    }
  }, [pathname, phase, visible]);

  // Failsafe: if reveal hasn't started in time, force it (e.g., 1s)
  useEffect(() => {
    if (!visible || phase !== 'cover') return;
    const t = setTimeout(() => setPhase('reveal'), 1000);
    return () => clearTimeout(t);
  }, [visible, phase]);

  const onExitAll = () => {
    setVisible(false);
    setPhase('idle');
    stop();
  };

  const ease = [0.83, 0, 0.17, 1] as Easing;

  const brandTop = '#8EC2F4';
  const brandBottom = '#1E9BFB';

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          key="dapper"
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          {/* COVER: slide in */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2"
            style={{ backgroundColor: brandTop }}
            initial={{ y: '-100%' }}
            animate={{ y: 0, transition: { duration: 0.5, ease } }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{ backgroundColor: brandBottom }}
            initial={{ y: '100%' }}
            animate={{ y: 0, transition: { duration: 0.5, ease } }}
          />

          {/* Logo stays until overlay unmounts */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
          >
            <Image
              src="http://localhost:1337/uploads/logo_3c09ed6dc2.svg" // (tip: serve from /public for speed)
              width={640}
              height={220}
              alt="CMT"
              priority
              style={{ width: 'min(60vw, 640px)', height: 'auto', filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.18))' }}
            />
          </motion.div>

          {/* REVEAL: slide out only after route changed */}
          {phase === 'reveal' && (
            <>
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2"
                style={{ backgroundColor: brandTop }}
                initial={{ y: 0 }}
                animate={{ y: '-100%', transition: { duration: 1, ease } }}
              />
              <motion.div
                className="absolute inset-x-0 bottom-0 h-1/2"
                style={{ backgroundColor: brandBottom }}
                initial={{ y: 0 }}
                animate={{ y: '100%', transition: { duration: 0.01, ease } }}
                onAnimationComplete={onExitAll}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
