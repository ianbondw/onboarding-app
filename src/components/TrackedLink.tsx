"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { track } from "@vercel/analytics";
import { appendAttributionParams } from "@/lib/attribution";

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
  const [resolvedHref, setResolvedHref] = useState(href);

  useEffect(() => {
    if (isExternal || typeof window === "undefined") {
      setResolvedHref(href);
      return;
    }
    setResolvedHref(appendAttributionParams(href, new URLSearchParams(window.location.search)));
  }, [href, isExternal]);

  function handleClick(_: MouseEvent<HTMLElement>) {
    track(eventName, eventProps);
  }

  if (isExternal) {
    return (
      <a
        className={className}
        href={resolvedHref}
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
    <Link className={className} href={resolvedHref} onClick={handleClick}>
      {children}
    </Link>
  );
}
