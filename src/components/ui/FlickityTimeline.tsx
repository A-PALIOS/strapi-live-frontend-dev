"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// SSR-safe Flickity import
const Flickity = dynamic(() => import("react-flickity-component"), { ssr: false });

export type TimelineItem = {
  id: string | number;
  year?: string | number;
  images: { src: string; alt?: string }[];
  caption?: string;
  variant?: "single" | "double" | "tall";
};

type LightboxImage = {
  src: string;
  alt?: string;
  caption?: string;
};

export type FlickityTimelineProps = {
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  items: TimelineItem[];
  options?: Record<string, any>;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function FlickityTimeline({
  eyebrow,
  title,
  intro,
  items,
  options,
  className,
  size,
}: FlickityTimelineProps) {
  const flktyRef = useRef<any>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);

  const flickityOptions = useMemo(
    () => ({
      cellAlign: "left",
      contain: true,
      pageDots: false,
      prevNextButtons: false,
      wrapAround: false,
      draggable: true,
      imagesLoaded: true,
      setGallerySize: true,
      selectedAttraction: 0.03,
      friction: 0.28,
      ...(options || {}),
    }),
    [options]
  );

  const presets = {
    sm: { cellW: "52%", cardMax: "560px", clusterH: "430px", pieceW: "60%", imgRatio: "4/3" },
    md: { cellW: "60%", cardMax: "680px", clusterH: "500px", pieceW: "64%", imgRatio: "4/3" },
    lg: { cellW: "70%", cardMax: "380px", clusterH: "520px", pieceW: "72%", imgRatio: "4/3" },
  };

  const sz = presets[size ?? "md"];

useEffect(() => {
  const timer = setTimeout(() => {
    const inst = getFlickityInstance();
    if (!inst) return;

    const onChange = () => {
      setSelectedIndex(inst.selectedIndex ?? 0);
    };

    onChange();

    inst.on?.("ready", onChange);
    inst.on?.("change", onChange);
    inst.on?.("select", onChange);
    inst.on?.("settle", onChange);

    return () => {
      inst.off?.("ready", onChange);
      inst.off?.("change", onChange);
      inst.off?.("select", onChange);
      inst.off?.("settle", onChange);
    };
  }, 50);

  return () => clearTimeout(timer);
}, [items.length]);

 const getFlickityInstance = () => {
  const inst = flktyRef.current as any;
  return inst?.flkty || inst?.data || inst || null;
};

const updateSelectedIndex = () => {
  const inst = getFlickityInstance();
  if (!inst) return;
  setSelectedIndex(inst.selectedIndex ?? 0);
};

const prev = () => {
  const inst = getFlickityInstance();
  if (!inst) return;
  if ((inst.selectedIndex ?? 0) <= 0) return;
  inst.previous?.(true);
  requestAnimationFrame(updateSelectedIndex);
};

const next = () => {
  const inst = getFlickityInstance();
  if (!inst) return;
  const lastIndex = Math.max(0, (inst.cells?.length ?? items.length) - 1);
  if ((inst.selectedIndex ?? 0) >= lastIndex) return;
  inst.next?.(true);
  requestAnimationFrame(updateSelectedIndex);
};

const atStart = selectedIndex <= 0;
const atEnd = selectedIndex >= Math.max(0, items.length - 1);

  const openLightbox = (payload?: LightboxImage) => {
    if (!payload?.src) return;
    setLightboxImage(payload);
  };

  const closeLightbox = () => setLightboxImage(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    suppressClickRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!pointerStartRef.current) return;
    const dx = Math.abs(e.clientX - pointerStartRef.current.x);
    const dy = Math.abs(e.clientY - pointerStartRef.current.y);
    if (dx > 6 || dy > 6) suppressClickRef.current = true;
  };

  const handlePointerUp = () => {
    pointerStartRef.current = null;
  };

  const handleImageClick = (payload?: LightboxImage) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    openLightbox(payload);
  };



  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!lightboxImage) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxImage]);

  return (
    <section
      className={`timeline ${className || ""}`}
      style={
        {
          "--cell-w": sz.cellW,
          "--card-max": sz.cardMax,
          "--cluster-h": sz.clusterH,
          "--piece-w": sz.pieceW,
          "--img-ratio": sz.imgRatio,
        } as React.CSSProperties
      }
      aria-label={typeof title === "string" ? title : "Company timeline"}
    >
      <div className="container is--timeline-slider">
        <div className="timeline__row-title">
          <div className="timeline__col-title">
            {eyebrow && (
              <div className="timeline__eyebrow">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 40"
                  className="h-10 w-20 shrink-0 translate-y-1"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_d_130_275)">
                    <path
                      d="M106.065 27.9997C106.065 30.9452 108.453 33.333 111.399 33.333C114.344 33.333 116.732 30.9452 116.732 27.9997C116.732 25.0542 114.344 22.6664 111.399 22.6664C108.453 22.6664 106.065 25.0542 106.065 27.9997ZM86.8987 26.4667L86.8987 25.4667L86.8987 26.4667ZM34.3987 26.4667L34.355 27.4658L34.3769 27.4667H34.3987V26.4667ZM5.3987 26.4667C5.64424 25.4973 5.64448 25.4974 5.64471 25.4974C5.64478 25.4975 5.64501 25.4975 5.64516 25.4976C5.64544 25.4976 5.64571 25.4977 5.64597 25.4978C5.64648 25.4979 5.64693 25.498 5.64732 25.4981C5.6481 25.4983 5.64864 25.4984 5.64896 25.4985C5.64959 25.4987 5.64935 25.4986 5.64836 25.4984C5.64631 25.4978 5.64155 25.4965 5.63492 25.4945C5.6205 25.4903 5.60335 25.4847 5.58817 25.4791C5.56971 25.4722 5.572 25.4718 5.58879 25.4809C5.59797 25.4858 5.62159 25.4991 5.65294 25.5222C5.68156 25.5433 5.73964 25.5894 5.80053 25.6654C5.86104 25.741 5.95186 25.8809 5.98645 26.0824C6.0243 26.3028 5.98066 26.517 5.8856 26.6908C5.80029 26.8468 5.6929 26.9367 5.63602 26.978C5.57653 27.0213 5.53072 27.0414 5.51905 27.0464C5.49811 27.0553 5.5212 27.0431 5.62463 27.0218C5.72112 27.002 5.86215 26.9792 6.06111 26.9561L5.83057 24.9695C5.39017 25.0206 5.01133 25.0885 4.73386 25.207C4.62346 25.2541 4.31541 25.3937 4.1309 25.7311C4.02076 25.9325 3.97288 26.1738 4.01529 26.4208C4.05444 26.6488 4.15863 26.8147 4.23931 26.9155C4.38662 27.0994 4.56318 27.1999 4.63748 27.2401C4.73285 27.2917 4.8248 27.329 4.89094 27.3536C4.96038 27.3795 5.0228 27.3991 5.0668 27.4121C5.08937 27.4188 5.10854 27.4242 5.12311 27.4282C5.13043 27.4302 5.13667 27.4318 5.14171 27.4331C5.14423 27.4338 5.14645 27.4344 5.14836 27.4349C5.14932 27.4351 5.1502 27.4353 5.151 27.4355C5.1514 27.4356 5.15178 27.4357 5.15214 27.4358C5.15232 27.4359 5.15257 27.4359 5.15266 27.436C5.15291 27.436 5.15316 27.4361 5.3987 26.4667ZM11.9261 26.7866C14.149 26.7946 17.0688 26.8451 20.8913 26.9583L20.9505 24.9592C17.1167 24.8457 14.1786 24.7947 11.9333 24.7866L11.9261 26.7866Z"
                      fill="url(#paint0_linear_130_275)"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_d_130_275"
                      x="0"
                      y="0"
                      width="120.732"
                      height="41.333"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="SourceAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend in="SourceGraphic" result="shape" />
                    </filter>
                    <linearGradient
                      id="paint0_linear_130_275"
                      x1="10.48"
                      y1="4"
                      x2="108.4"
                      y2="26.08"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.13" stopColor="#0090FE" />
                      <stop offset="1" stopColor="#B4D3EF" />
                    </linearGradient>
                  </defs>
                </svg>
                <span>{eyebrow}</span>
              </div>
            )}

            <div className="timeline__title">
              {title ? <h2 className="h2">{title}</h2> : null}
              {intro ? <div className="timeline__text">{intro}</div> : null}
            </div>
          </div>

       <div className="timeline__col-arrows">
  <div className="flickity-arrows">
    <button
      type="button"
      aria-label="Previous"
      className="flickity-arrow"
      title="Previous slide"
      onClick={prev}
      disabled={atStart}
    >
      <ArrowMinimal direction="left" />
    </button>

    <button
      type="button"
      aria-label="Next"
      className="flickity-arrow"
      title="Next slide"
      onClick={next}
      disabled={atEnd}
    >
      <ArrowMinimal direction="right" />
    </button>
  </div>
</div>
        </div>

        <div className="flickity-collection" ref={listRef} tabIndex={0}>
          <Flickity
            className="flickity-list"
            options={flickityOptions}
            flickityRef={(c: any) => (flktyRef.current = c?.data ? c.data : c)}
            elementType="div"
          >
            {items.map((item) => {
              const variant: TimelineItem["variant"] =
                item.variant ?? (item.images.length >= 2 ? "double" : "single");

              const image0 = item.images?.[0];
              const image1 = item.images?.[1];

              return (
                <div className="flickity-item" key={item.id}>
                  {item.year && (
                    <div className="year">
                      <span className="year__text">{item.year}</span>
                      <span className="year__marker" />
                    </div>
                  )}

                  {variant === "double" && image0 && image1 ? (
                    <div className="cluster">
                      <div className="card piece piece--top">
                        <button
                          type="button"
                          className="image-button"
                          onPointerDown={handlePointerDown}
                          onPointerMove={handlePointerMove}
                          onPointerUp={handlePointerUp}
                          onPointerCancel={handlePointerUp}
                          onClick={() =>
                            handleImageClick({
                              src: image0.src,
                              alt: image0.alt,
                              caption: item.caption,
                            })
                          }
                          aria-label="Open image"
                        >
                          <img className="card__img" src={image0.src} alt={image0.alt || ""} />
                        </button>
                      </div>
                      <div className="card piece piece--bottom">
                        <button
                          type="button"
                          className="image-button"
                          onPointerDown={handlePointerDown}
                          onPointerMove={handlePointerMove}
                          onPointerUp={handlePointerUp}
                          onPointerCancel={handlePointerUp}
                          onClick={() =>
                            handleImageClick({
                              src: image1.src,
                              alt: image1.alt,
                              caption: item.caption,
                            })
                          }
                          aria-label="Open image"
                        >
                          <img className="card__img" src={image1.src} alt={image1.alt || ""} />
                        </button>
                      </div>
                      <div className="sticker" aria-hidden="true" />
                      {item.caption && (
                        <div className="cluster__caption" dangerouslySetInnerHTML={{ __html: item.caption }} />
                      )}
                    </div>
                  ) : variant === "tall" && image0 ? (
                    <>
                      <div className="card tall rotate-right">
                        <button
                          type="button"
                          className="image-button"
                          onPointerDown={handlePointerDown}
                          onPointerMove={handlePointerMove}
                          onPointerUp={handlePointerUp}
                          onPointerCancel={handlePointerUp}
                          onClick={() =>
                            handleImageClick({
                              src: image0.src,
                              alt: image0.alt,
                              caption: item.caption,
                            })
                          }
                          aria-label="Open image"
                        >
                          <img className="card__img" src={image0.src} alt={image0.alt || ""} />
                        </button>
                      </div>
                      {item.caption && (
                        <p className="card__caption" style={{ marginLeft: 10, maxWidth: 440 }}>
                          {item.caption}
                        </p>
                      )}
                    </>
                  ) : image0 ? (
                    <div className="card card--thick">
                      <button
                        type="button"
                        className="image-button"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        onClick={() =>
                          handleImageClick({
                            src: image0.src,
                            alt: image0.alt,
                            caption: item.caption,
                          })
                        }
                        aria-label="Open image"
                      >
                        <img className="card__img" src={image0.src} alt={image0.alt || ""} />
                      </button>
                      {item.caption && (
                        <p className="card__caption" dangerouslySetInnerHTML={{ __html: item.caption }} />
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </Flickity>
        </div>
      </div>

      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox} role="dialog" aria-modal="true">
          <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox__close"
              onClick={closeLightbox}
              aria-label="Close image preview"
            >
              ×
            </button>

            <div className="lightbox__content">
              <div className="lightbox__polaroid">
                {lightboxImage.caption && (
                  <div
                    className="lightbox__tag"
                    dangerouslySetInnerHTML={{ __html: lightboxImage.caption }}
                  />
                )}

                <div className="lightbox__paper-shine" />
                <div className="lightbox__image-wrap">
                  <img
                    className="lightbox__img"
                    src={lightboxImage.src}
                    alt={lightboxImage.alt || "Preview image"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.flickity-viewport) {
          overflow: hidden;
          min-height: clamp(320px, 55vw, 665px);
        }

        :global(.flickity-slider) {
          display: flex;
          gap: 24px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: clamp(16px, 2vw, 32px);
        }

        .timeline__row-title {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: end;
        }

        .timeline__eyebrow {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #111;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 700;
        }

        .h2 {
          font-style: italic;
          font-weight: 600;
          font-size: clamp(28px, 3.2vw, 42px);
          margin: 0.25rem 0 0.5rem;
        }

        .timeline__text {
          max-width: 72ch;
          color: #333;
        }

        .flickity-collection {
          margin-top: 18px;
          outline: none;
        }

        .flickity-item {
          width: var(--cell-w, 60%);
          max-width: var(--card-max, 720px);
          margin-right: 24px;
        }

        @media (min-width: 980px) {
          .flickity-item {
            width: var(--cell-w, 60%);
          }
        }

        .year {
          position: relative;
          padding-left: 4px;
          margin: 24px 0 8px;
        }

        .year__text {
          font-style: italic;
          font-size: clamp(32px, 4.6vw, 56px);
          color: #222;
        }

        .year__marker {
          display: inline-block;
          width: 14px;
          height: 14px;
          background: #2da5d1;
          border-radius: 2px;
          margin-left: 10px;
          vertical-align: 12px;
          position: relative;
        }

        .year__marker::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 14px;
          transform: translateX(-50%);
          width: 2px;
          height: 86px;
          background: linear-gradient(to bottom, #2da5d1 0 12px, rgba(0, 0, 0, 0.08) 12px 100%);
        }

        .card {
          background: #fff;
          border-radius: 22px;
          box-shadow: 13px 2px 12px 0px rgba(0, 0, 0, 0.15);
          padding: 14px;
          border: 1px solid #ececec;
        }

        .card--thick {
          max-width: var(--card-max, 720px);
        }

        .card__img {
          border-radius: 16px;
          display: block;
          width: 100%;
          height: auto;
        }

        .card__caption {
          margin: 0.75rem 4px 2px;
          font-weight: 800;
          letter-spacing: 0.01em;
          color: #111;
        }

        .cluster {
          position: relative;
          height: var(--cluster-h, 500px);
          padding-bottom: 110px;
        }

        .cluster .piece {
          position: absolute;
          width: var(--piece-w, 64%);
        }

        .cluster .piece--top {
          right: 4%;
          top: 0;
          transform: rotate(-8deg);
          z-index: 2;
        }

        .cluster .piece--bottom {
          left: 4%;
          top: 150px;
          transform: rotate(7deg);
          z-index: 1;
        }

        .cluster .piece .card__img {
          aspect-ratio: var(--img-ratio, 4/3);
          object-fit: cover;
        }

        .cluster__caption {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          font-weight: 800;
          text-align: center;
          width: 100%;
          max-width: 360px;
          z-index: 3;
        }

        .tall {
          max-width: var(--card-max, 720px);
        }

        .rotate-right {
          transform: rotate(6deg);
        }

    .timeline__col-arrows {
  display: flex;
  align-items: center;
  gap: 10px;
}

.flickity-arrows {
  display: flex;
  gap: 10px;
}

.flickity-arrow {
  width: 46px;
  height: 46px;
  border: 1px solid rgba(17, 17, 17, 0.08);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    opacity 0.18s ease;
}

.flickity-arrow:hover:not([disabled]) {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.flickity-arrow:active:not([disabled]) {
  transform: translateY(0);
}

.flickity-arrow[disabled] {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

.arrow-minimal__svg {
  width: 22px;
  height: 22px;
  color: #111;
}
        .image-button {
          display: block;
          width: 100%;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: zoom-in;
        }

        .image-button img {
          transition: transform 0.25s ease, filter 0.25s ease;
          user-select: none;
          -webkit-user-drag: none;
          pointer-events: none;
        }

        .image-button:hover img {
          transform: scale(1.015);
          filter: brightness(1.03);
        }

        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.42);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: lightboxFadeIn 0.28s ease;
        }

        .lightbox__inner {
          position: relative;
          max-width: min(1200px, 94vw);
          max-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lightboxZoomIn 0.34s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .lightbox__content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox__polaroid {
          position: relative;
          background: #fffdf8;
          padding: 18px 18px 54px;
          border-radius: 18px;
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.28),
            0 8px 24px rgba(0, 0, 0, 0.12);
          transform: rotate(-1.2deg);
          overflow: hidden;
          width: fit-content;
          max-width: min(1200px, 92vw);
        }

        .lightbox__paper-shine {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          pointer-events: none;
          z-index: 3;
          background: linear-gradient(
            120deg,
            rgba(255,255,255,0) 18%,
            rgba(255,255,255,0.32) 32%,
            rgba(255,255,255,0.08) 48%,
            rgba(255,255,255,0) 62%
          );
          transform: translateX(-140%);
          animation: paperSweep 1.15s ease-out 1 forwards;
        }

        .lightbox__tag {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 5;
          max-width: min(320px, 62%);
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.96);
          color: #111;
          border-radius: 14px;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
          font-size: 14px;
          font-weight: 700;
          line-height: 1.35;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .lightbox__image-wrap {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          max-width: 100%;
        }

        .lightbox__img {
          display: block;
          width: auto;
          max-width: min(100%, 1050px);
          max-height: 76vh;
          object-fit: contain;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
        }

        .lightbox__close {
          position: absolute;
          top: -18px;
          right: -18px;
          z-index: 20;
          width: 46px;
          height: 46px;
          border: 0;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.98);
          color: #111;
          font-size: 30px;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .lightbox__close:hover {
          transform: scale(1.08) rotate(90deg);
          background: #fff;
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.24);
        }

        .lightbox__close:active {
          transform: scale(0.95);
        }

        @keyframes lightboxFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes lightboxZoomIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes paperSweep {
          0% {
            transform: translateX(-140%);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          100% {
            transform: translateX(140%);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

function ArrowMinimal({ direction }: { direction: "left" | "right" }) {
  const isLeft = direction === "left";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="arrow-minimal__svg"
      aria-hidden="true"
    >
      <path
        d={isLeft ? "M14.5 5L7.5 12L14.5 19" : "M9.5 5L16.5 12L9.5 19"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}