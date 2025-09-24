// app/_components/NavLink.tsx
'use client';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { useNavProgress } from './NavProgressProvider';
import { ComponentPropsWithoutRef } from 'react';

const COVER_MS = 500; // must match panel cover duration in DapperTransition

type Props = LinkProps & ComponentPropsWithoutRef<'a'>;

export default function NavLink({ href, target, onClick, ...rest }: Props) {
  const router = useRouter();
  const { start } = useNavProgress();

  const isExternal =
    typeof href === 'string' &&
    (/^https?:\/\//i.test(href) || target === '_blank');

  return (
    <Link
      href={href}
      target={target}
      onClick={(e) => {
        // let new-tab/external & modified clicks behave normally
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
          isExternal
        ) return onClick?.(e);

        // we drive the nav: start overlay, then push after cover
        e.preventDefault();
        start();
        setTimeout(() => {
          if (typeof href === 'string') router.push(href);
        }, COVER_MS);

        onClick?.(e);
      }}
      {...rest}
    />
  );
}
