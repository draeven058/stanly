"use client";

import { useRef } from "react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2">
        {/* Hex text input — lets users type or paste exact values */}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          onBlur={(e) => {
            // Normalise on blur: if incomplete hex, revert to current
            if (!/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
              onChange(value);
            }
          }}
          className="w-24 rounded-md border border-input bg-background px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring"
          spellCheck={false}
        />
        {/* Color swatch — clicking opens native color picker */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-7 w-7 rounded-md border border-border transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: value }}
          title={`Pick ${label} color`}
        />
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
      </div>
    </div>
  );
}
