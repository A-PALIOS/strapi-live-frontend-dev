"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { StrapiImage, getStrapiMedia } from "@/components/StrapiImage";

type LogoProps = {
  src: string;
  alt?: string;
};

type StrapiImageWithLogoProps =
  | ({
      logo?: LogoProps | null;
    } & {
      src: string;
      alt: string;
      className?: string;
      width: number;
      height: number;
      fill?: false;
      quality?: number;
      unoptimized?: boolean;
      sizes?: string;
    })
  | ({
      logo?: LogoProps | null;
    } & {
      src: string;
      alt: string;
      className?: string;
      fill: true;
      width?: never;
      height?: never;
      quality?: number;
      unoptimized?: boolean;
      sizes?: string;
    });

/* ------------------------------------------------------------------ *
 * Logo sizing
 *
 * The project logos are PNGs uploaded to Strapi with very different
 * amounts of transparent padding baked into the file. Measured:
 *
 *   2 1.png   (WHO)  canvas 267x124, artwork 223x70   (22/27px padding)
 *   MSD LOGO  1.png  canvas 188x72,  artwork 188x72   (no padding)
 *   33 1.png         canvas 335x158, artwork 240x41   (44/60px padding)
 *
 * Fitting them into one box with object-contain normalises the CANVAS,
 * not the artwork, so at a shared 106px box height the WHO mark drew at
 * ~60px tall, MSD at 106px and 33 1 at ~28px — the reason they never
 * looked the same size.
 *
 * So instead of trusting the canvas we measure the opaque bounding box
 * of each logo once (on a canvas, from the same-origin /_next/image
 * response so the pixels are readable) and crop the padding away.
 *
 * What we then match across logos is optical AREA, not height. Matching
 * height only works when every mark has a similar shape: the Agios
 * Savvas wordmark is 5.85:1, so at the same height as the 2.6:1 MSD mark
 * it ran 351px wide and swamped the card. Sizing each logo so that
 * sqrt(width x height) is constant makes a wide wordmark and a square
 * emblem carry the same visual weight, which is how a logo wall is
 * normally set. The min/max height rails stop the extremes of that rule
 * (a very wide or very tall mark) going too far.
 *
 * New logos uploaded to Strapi are handled automatically — nobody has to
 * re-crop or re-scale a file first.
 * ------------------------------------------------------------------ */

/** Target geometric mean of the artwork's width and height, in px. 102
 *  keeps the WHO mark at 182x57 and MSD at 165x63 — i.e. both stay the
 *  size they already read at. */
const LOGO_OPTICAL_SIZE = 102;

/** Rails on the resulting artwork height, so a 6:1 wordmark doesn't get
 *  hairline-thin and a square emblem doesn't tower over the card. */
const LOGO_MIN_HEIGHT = 45;
const LOGO_MAX_HEIGHT = 81;

/** Height used only when the artwork bounds can't be measured at all. */
const LOGO_FALLBACK_HEIGHT = 60;

/** Inset from the top-left corner of the image (matches `left-4 top-4`). */
const LOGO_INSET = 16;

/** Alpha above which a pixel counts as artwork rather than padding.
 *  Non-zero so anti-aliased edges and near-invisible export noise don't
 *  widen the box back out to the full canvas. */
const ALPHA_THRESHOLD = 16;

type InkBox = {
  /** width / height of the whole image */
  aspect: number;
  /** opaque bounds as fractions of the image, so the numbers stay valid
   *  whatever resolution the optimiser handed us */
  x: number;
  y: number;
  w: number;
  h: number;
};

const inkCache = new Map<string, InkBox | null>();
const inkPending = new Map<string, Promise<InkBox | null>>();

function optimized(url: string, w: number) {
  return `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75`;
}

async function readInkBox(url: string): Promise<InkBox | null> {
  // Same-origin first: reading pixels back off a cross-origin image taints
  // the canvas and getImageData throws. The raw URL is only a last resort
  // (it works when the media server sends CORS headers).
  const candidates = [optimized(url, 384), optimized(url, 640), url];

  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate);
      if (!res.ok) continue;

      const bitmap = await createImageBitmap(await res.blob());
      const W = bitmap.width;
      const H = bitmap.height;

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        bitmap.close?.();
        return null;
      }
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close?.();

      const data = ctx.getImageData(0, 0, W, H).data;
      let x0 = W;
      let y0 = H;
      let x1 = -1;
      let y1 = -1;
      for (let y = 0; y < H; y++) {
        const row = y * W;
        for (let x = 0; x < W; x++) {
          if (data[(row + x) * 4 + 3] > ALPHA_THRESHOLD) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
        }
      }

      // Fully transparent, or a flattened logo on an opaque background —
      // there is nothing to trim, so the whole canvas is the artwork.
      if (x1 < 0) return null;

      return {
        aspect: W / H,
        x: x0 / W,
        y: y0 / H,
        w: (x1 - x0 + 1) / W,
        h: (y1 - y0 + 1) / H,
      };
    } catch {
      // try the next candidate
    }
  }
  return null;
}

function useInkBox(url: string | null) {
  const [box, setBox] = useState<InkBox | null | undefined>(() =>
    url !== null && inkCache.has(url) ? inkCache.get(url) : undefined
  );

  useEffect(() => {
    if (!url) return;

    if (inkCache.has(url)) {
      setBox(inkCache.get(url));
      return;
    }

    let alive = true;
    let job = inkPending.get(url);
    if (!job) {
      job = readInkBox(url).then((result) => {
        inkCache.set(url, result);
        inkPending.delete(url);
        return result;
      });
      inkPending.set(url, job);
    }
    job.then((result) => {
      if (alive) setBox(result);
    });

    return () => {
      alive = false;
    };
  }, [url]);

  return box; // undefined = still measuring, null = nothing to trim
}

function LogoOverlay({ src, alt }: Readonly<{ src: string; alt: string }>) {
  const url = getStrapiMedia(src);
  const frameRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(0);
  const box = useInkBox(url);

  // How much room the logo has before it would run into the right edge of
  // the card — small cards on phones are much narrower than the hero.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setAvailable(entry.contentRect.width);
    });
    observer.observe(el);
    setAvailable(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  if (!url) return null;

  return (
    <div
      ref={frameRef}
      className="pointer-events-none absolute z-10"
      style={{ left: LOGO_INSET, top: LOGO_INSET, right: LOGO_INSET }}
    >
      {box === undefined ? null : box === null ? (
        // Couldn't read the pixels at all: fall back to fitting the whole
        // file into a fixed-height box, as before.
        <div
          className="relative"
          style={{ height: LOGO_FALLBACK_HEIGHT, width: "100%" }}
        >
          <Image
            src={url}
            alt={alt}
            fill
            className="object-contain object-left-top"
            sizes="640px"
          />
        </div>
      ) : (
        <TrimmedLogo url={url} alt={alt} box={box} available={available} />
      )}
    </div>
  );
}

function TrimmedLogo({
  url,
  alt,
  box,
  available,
}: Readonly<{ url: string; alt: string; box: InkBox; available: number }>) {
  // Aspect ratio of the artwork itself (not of the file it sits in).
  const inkAspect = box.aspect * (box.w / box.h);

  // Height at which this mark's area matches every other mark's, held
  // inside the rails so the extremes stay sensible.
  const inkHeight = Math.min(
    LOGO_MAX_HEIGHT,
    Math.max(LOGO_MIN_HEIGHT, LOGO_OPTICAL_SIZE / Math.sqrt(inkAspect))
  );

  // Scale the whole file so its opaque part lands on that height...
  let height = inkHeight / box.h;
  let width = height * box.aspect;

  // ...then step back if that would push the artwork past the card edge.
  const inkWidth = width * box.w;
  if (available > 0 && inkWidth > available) {
    const shrink = available / inkWidth;
    height *= shrink;
    width *= shrink;
  }

  const cropW = Math.round(width * box.w);
  const cropH = Math.round(height * box.h);

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: cropW, height: cropH }}
    >
      <Image
        src={url}
        alt={alt}
        width={Math.round(width)}
        height={Math.round(height)}
        sizes="640px"
        style={{
          position: "absolute",
          left: -Math.round(width * box.x),
          top: -Math.round(height * box.y),
          width: Math.round(width),
          height: Math.round(height),
          maxWidth: "none",
        }}
      />
    </div>
  );
}

export function StrapiImageWithLogo(
  props: Readonly<StrapiImageWithLogoProps>
) {
  const { logo } = props;

  // IMPORTANT: wrapper must be relative for overlay
  return (
    <div className="relative w-full h-full">
      {/* Original image (unchanged behavior) */}
      <StrapiImage {...props} />

      {logo?.src && <LogoOverlay src={logo.src} alt={logo.alt || "logo"} />}
    </div>
  );
}
