"use client";

import { useLayoutEffect, useRef, type TextareaHTMLAttributes } from "react";

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children"> & {
  minRows?: number;
};

/** Textarea that grows with its content so lines are never clipped. */
export function AutoTextarea({ className, minRows = 3, value, onChange, style, ...rest }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      {...rest}
      ref={ref}
      className={["textarea textarea-auto", className].filter(Boolean).join(" ")}
      rows={minRows}
      value={value}
      onChange={onChange}
      style={style}
    />
  );
}
