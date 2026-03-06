import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 overflow-hidden rounded-[28px] border border-white/60 bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
    />
  )
);

Card.displayName = "Card";

type CardRef = RefObject<HTMLDivElement | null>;

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (
  i: number,
  distX: number,
  distY: number,
  total: number
): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.15,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) => {
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
};

const CardSwap: React.FC<CardSwapProps> = ({
  width = 520,
  height = 360,
  cardDistance = 58,
  verticalDistance = 44,
  delay = 6000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 4,
  easing = "elastic",
  children,
}) => {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 1.05,
          durMove: 1,
          durReturn: 1,
          promoteOverlap: 0.7,
          returnDelay: 0.08,
          staggerEach: 0.07,
        }
      : {
          ease: "power2.inOut",
          durDrop: 0.65,
          durMove: 0.65,
          durReturn: 0.65,
          promoteOverlap: 0.48,
          returnDelay: 0.12,
          staggerEach: 0.05,
        };

  const childArr = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children]
  );

  const refs = useMemo<CardRef[]>(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    [childArr.length]
  );

  const order = useRef<number[]>(
    Array.from({ length: childArr.length }, (_, i) => i)
  );

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const isAnimating = useRef(false);
  const isPausedRef = useRef(false);
  const isMountedRef = useRef(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isMountedRef.current = true;

    const total = refs.length;
    if (!total) return;

    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(
          r.current,
          makeSlot(i, cardDistance, verticalDistance, total),
          skewAmount
        );
      }
    });

    const clearScheduled = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const scheduleNext = () => {
      clearScheduled();
      if (!isMountedRef.current || isPausedRef.current) return;

      timeoutRef.current = window.setTimeout(() => {
        runSwap();
      }, delay);
    };

    const runSwap = () => {
      if (!isMountedRef.current) return;
      if (isAnimating.current) return;
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;

      if (!elFront) {
        scheduleNext();
        return;
      }

      isAnimating.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          order.current = [...rest, front];
          isAnimating.current = false;
          tlRef.current = null;
          scheduleNext();
        },
      });

      tlRef.current = tl;

      tl.to(elFront, {
        y: "+=380",
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);

      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;

        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);

        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * config.staggerEach}`
        );
      });

      const backSlot = makeSlot(
        refs.length - 1,
        cardDistance,
        verticalDistance,
        refs.length
      );

      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);

      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return"
      );

      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return"
      );
    };

    runSwap();

    const node = container.current;

    const pause = () => {
      if (!pauseOnHover) return;
      isPausedRef.current = true;
      clearScheduled();
      tlRef.current?.pause();
    };

    const resume = () => {
      if (!pauseOnHover) return;
      isPausedRef.current = false;

      if (tlRef.current) {
        tlRef.current.play();
      } else if (!isAnimating.current) {
        scheduleNext();
      }
    };

    if (pauseOnHover && node) {
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
    }

    return () => {
      isMountedRef.current = false;
      clearScheduled();
      tlRef.current?.kill();
      tlRef.current = null;
      isAnimating.current = false;

      if (pauseOnHover && node) {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
      }
    };
  }, [
    cardDistance,
    verticalDistance,
    delay,
    pauseOnHover,
    skewAmount,
    easing,
    refs,
  ]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: {
            width,
            height,
            ...(child.props.style ?? {}),
          },
          onClick: (e) => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div
      ref={container}
      className="absolute bottom-0 right-0 origin-bottom-right perspective-[1200px] overflow-visible translate-x-[2%] translate-y-[12%] max-[768px]:translate-x-[14%] max-[768px]:translate-y-[18%] max-[768px]:scale-[0.82] max-[480px]:translate-x-[16%] max-[480px]:translate-y-[18%] max-[480px]:scale-[0.62]"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;