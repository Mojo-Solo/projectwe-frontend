"use client";

import React, { useCallback } from "react";
import { useTracking } from "@/components/providers/tracking-provider";

interface TrackableElementProps {
  children: React.ReactNode;
  elementId: string;
  elementType: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  as?: keyof JSX.IntrinsicElements;
}

export function TrackableElement({
  children,
  elementId,
  elementType,
  className,
  onClick,
  as: Component = "div",
}: TrackableElementProps) {
  const { trackClick } = useTracking();

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      // Track the click
      await trackClick(elementId, elementType);

      // Call original onClick if provided
      if (onClick) {
        onClick(e);
      }
    },
    [trackClick, elementId, elementType, onClick],
  );

  return (
    <Component className={className} onClick={handleClick}>
      {children}
    </Component>
  );
}

// Specific tracking components
export function TrackableButton({
  children,
  elementId,
  ...props
}: Omit<TrackableElementProps, "elementType" | "as"> &
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { trackClick } = useTracking();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      await trackClick(elementId, "button");
      if (props.onClick) {
        props.onClick(e);
      }
    },
    [trackClick, elementId, props],
  );

  return (
    <button {...(props || {})} onClick={handleClick}>
      {children}
    </button>
  );
}

export function TrackableLink({
  children,
  elementId,
  href,
  ...props
}: Omit<TrackableElementProps, "elementType" | "as"> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { trackClick } = useTracking();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      await trackClick(elementId, "link");
      if (props.onClick) {
        props.onClick(e);
      }
    },
    [trackClick, elementId, props],
  );

  return (
    <a {...(props || {})} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
