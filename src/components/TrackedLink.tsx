"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { track } from "@vercel/analytics";

type EventValue = string | number | boolean | null;

export default function TrackedLink({
  href,
  eventName,
  eventProps,
  className,
  children,
  external,
  target,
  rel,
  download,
}: {
  href: string;
  eventName: string;
  eventProps?: Record<string, EventValue>;
  className?: string;
  children: ReactNode;
  external?: boolean;
  target?: string;
  rel?: string;
  download?: boolean;
}) {
  const isExternal = external ?? /^(https?:|mailto:)/i.test(href);

  function handleClick(_: MouseEvent<HTMLElement>) {
    track(eventName, eventProps);
  }

  if (isExternal) {
    return (
      <a
        className={className}
        href={href}
        target={target}
        rel={rel}
        download={download}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
