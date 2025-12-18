"use client";

/* eslint-disable react-hooks/static-components */
// This file intentionally creates motion components dynamically.
// Components are cached via WeakMap to prevent recreation on each render.

import * as React from "react";
import { motion, isMotionComponent, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type AnyProps = Record<string, unknown>;

type DOMMotionProps<T extends HTMLElement = HTMLElement> = Omit<
  HTMLMotionProps<keyof HTMLElementTagNameMap>,
  "ref"
> & { ref?: React.Ref<T> };

type WithAsChild<Base extends object> =
  | (Base & { asChild: true; children: React.ReactElement })
  | (Base & { asChild?: false | undefined });

type SlotProps<T extends HTMLElement = HTMLElement> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
} & DOMMotionProps<T>;

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    });
  };
}

function mergeProps<T extends HTMLElement>(
  childProps: AnyProps,
  slotProps: DOMMotionProps<T>
): AnyProps {
  const merged: AnyProps = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(
      childProps.className as string,
      slotProps.className as string
    );
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...(childProps.style as React.CSSProperties),
      ...(slotProps.style as React.CSSProperties),
    };
  }

  return merged;
}

// Memoize motion components outside of render to avoid creating components during render
// Using Map instead of WeakMap because React.ElementType can be a string (intrinsic elements)
const motionComponentCache = new Map<React.ElementType, React.ElementType>();

function getMotionComponent(type: React.ElementType): React.ElementType {
  if (motionComponentCache.has(type)) {
    return motionComponentCache.get(type)!;
  }
  const motionComponent = motion.create(type);
  motionComponentCache.set(type, motionComponent);
  return motionComponent;
}

function Slot<T extends HTMLElement = HTMLElement>({
  children,
  ref,
  ...props
}: SlotProps<T>) {
  const isValid = React.isValidElement(children);
  const childrenType = isValid ? children.type : null;

  const isAlreadyMotion =
    isValid &&
    typeof childrenType === "object" &&
    childrenType !== null &&
    isMotionComponent(childrenType);

  // Create component outside of render using memoization
  // Components are cached via WeakMap to avoid recreating on each render
  const Base = React.useMemo(() => {
    if (!isValid || !childrenType) return null;
    return isAlreadyMotion
      ? (childrenType as React.ElementType)
      : getMotionComponent(childrenType as React.ElementType);
  }, [isValid, isAlreadyMotion, childrenType]);

  if (!isValid || !Base) return null;

  const { ref: childRef, ...childProps } = children.props as AnyProps;

  const mergedProps = mergeProps(childProps, props);

  return (
    <Base {...mergedProps} ref={mergeRefs(childRef as React.Ref<T>, ref)} />
  );
}

export {
  Slot,
  type SlotProps,
  type WithAsChild,
  type DOMMotionProps,
  type AnyProps,
};
