"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ColorPicker } from "./color-picker";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type {
  StoreAppearance,
  StoreAppearanceColors,
  StoreAppearanceTypography,
  StoreAppearanceSpacing,
  StoreAppearanceButtons,
  StoreAppearanceSections,
  AppearanceFontFamily,
  AppearanceHeadingSize,
  AppearanceBodySize,
  AppearanceFontWeight,
  AppearanceContainerWidth,
  AppearanceButtonRadius,
  AppearanceButtonStyle,
  AppearanceButtonSize,
} from "@/types";

// ── Section accordion ─────────────────────────────────────────
interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function EditorSection({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-muted/40 transition-colors"
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">{children}</div>}
    </div>
  );
}

// ── Select row ────────────────────────────────────────────────
interface SelectRowProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

function SelectRow<T extends string>({ label, value, options, onChange }: SelectRowProps<T>) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label className="text-sm text-muted-foreground shrink-0">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="flex-1 h-8 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Pill group (for button style etc) ────────────────────────
interface PillGroupProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

function PillGroup<T extends string>({ label, value, options, onChange }: PillGroupProps<T>) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              value === o.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Toggle row ────────────────────────────────────────────────
interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

// ── Main editor controls ──────────────────────────────────────
interface EditorControlsProps {
  appearance: StoreAppearance;
  onChange: (updated: StoreAppearance) => void;
}

export function EditorControls({ appearance, onChange }: EditorControlsProps) {
  // Patch helpers — update one sub-group without spreading everything manually
  function patchColors(patch: Partial<StoreAppearanceColors>) {
    onChange({ ...appearance, colors: { ...appearance.colors, ...patch } });
  }
  function patchTypography(patch: Partial<StoreAppearanceTypography>) {
    onChange({ ...appearance, typography: { ...appearance.typography, ...patch } });
  }
  function patchSpacing(patch: Partial<StoreAppearanceSpacing>) {
    onChange({ ...appearance, spacing: { ...appearance.spacing, ...patch } });
  }
  function patchButtons(patch: Partial<StoreAppearanceButtons>) {
    onChange({ ...appearance, buttons: { ...appearance.buttons, ...patch } });
  }
  function patchSections(patch: Partial<StoreAppearanceSections>) {
    onChange({ ...appearance, sections: { ...appearance.sections, ...patch } });
  }

  const { colors, typography, spacing, buttons, sections } = appearance;

  return (
    <div className="space-y-3">

      {/* ── COLORS ── */}
      <EditorSection title="🎨 Colors">
        <ColorPicker label="Accent"      value={colors.accent}     onChange={(v) => patchColors({ accent: v })} />
        <ColorPicker label="Background"  value={colors.background} onChange={(v) => patchColors({ background: v })} />
        <ColorPicker label="Surface"     value={colors.surface}    onChange={(v) => patchColors({ surface: v })} />
        <ColorPicker label="Text"        value={colors.text}       onChange={(v) => patchColors({ text: v })} />
        <ColorPicker label="Muted text"  value={colors.textMuted}  onChange={(v) => patchColors({ textMuted: v })} />
        <ColorPicker label="Border"      value={colors.border}     onChange={(v) => patchColors({ border: v })} />

        {/* Preset palette swatches */}
        <div className="pt-1">
          <p className="text-xs text-muted-foreground mb-2">Quick palettes</p>
          <div className="flex flex-wrap gap-2">
            {PALETTES.map((palette) => (
              <button
                key={palette.name}
                type="button"
                title={palette.name}
                onClick={() => patchColors(palette.colors)}
                className="flex gap-0.5 rounded-lg overflow-hidden border border-border hover:scale-110 transition-transform"
              >
                {Object.values(palette.colors).slice(0, 4).map((c, i) => (
                  <div key={i} className="h-5 w-3" style={{ backgroundColor: c }} />
                ))}
              </button>
            ))}
          </div>
        </div>
      </EditorSection>

      {/* ── TYPOGRAPHY ── */}
      <EditorSection title="✍️ Typography">
        <SelectRow<AppearanceFontFamily>
          label="Font"
          value={typography.fontFamily}
          onChange={(v) => patchTypography({ fontFamily: v })}
          options={[
            { value: "Inter",             label: "Inter (default)" },
            { value: "Lora",              label: "Lora (serif)" },
            { value: "DM Mono",           label: "DM Mono (monospace)" },
            { value: "Cal Sans",          label: "Cal Sans (display)" },
            { value: "Playfair Display",  label: "Playfair Display (editorial)" },
          ]}
        />
        <PillGroup<AppearanceHeadingSize>
          label="Heading size"
          value={typography.headingSize}
          onChange={(v) => patchTypography({ headingSize: v })}
          options={[
            { value: "xl",   label: "S" },
            { value: "2xl",  label: "M" },
            { value: "3xl",  label: "L" },
            { value: "4xl",  label: "XL" },
          ]}
        />
        <PillGroup<AppearanceBodySize>
          label="Body size"
          value={typography.bodySize}
          onChange={(v) => patchTypography({ bodySize: v })}
          options={[
            { value: "xs",   label: "XS" },
            { value: "sm",   label: "SM" },
            { value: "base", label: "Base" },
          ]}
        />
        <PillGroup<AppearanceFontWeight>
          label="Weight"
          value={typography.fontWeight}
          onChange={(v) => patchTypography({ fontWeight: v })}
          options={[
            { value: "normal",   label: "Normal" },
            { value: "medium",   label: "Medium" },
            { value: "semibold", label: "Semibold" },
            { value: "bold",     label: "Bold" },
          ]}
        />
      </EditorSection>

      {/* ── SPACING ── */}
      <EditorSection title="📐 Spacing" defaultOpen={false}>
        <SelectRow<AppearanceContainerWidth>
          label="Container width"
          value={spacing.containerWidth}
          onChange={(v) => patchSpacing({ containerWidth: v })}
          options={[
            { value: "sm",  label: "Small (640px)" },
            { value: "md",  label: "Medium (768px)" },
            { value: "lg",  label: "Large (1024px)" },
            { value: "xl",  label: "XL (1280px)" },
            { value: "2xl", label: "2XL (1536px)" },
          ]}
        />
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Section gap</Label>
            <span className="text-xs font-mono text-muted-foreground">
              {parseInt(spacing.sectionGap, 10) * 4}px
            </span>
          </div>
          <input
            type="range" min={4} max={20} step={1}
            value={parseInt(spacing.sectionGap, 10)}
            onChange={(e) => patchSpacing({ sectionGap: e.target.value })}
            className="w-full accent-primary"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Card padding</Label>
            <span className="text-xs font-mono text-muted-foreground">
              {parseInt(spacing.cardPadding, 10) * 4}px
            </span>
          </div>
          <input
            type="range" min={2} max={10} step={1}
            value={parseInt(spacing.cardPadding, 10)}
            onChange={(e) => patchSpacing({ cardPadding: e.target.value })}
            className="w-full accent-primary"
          />
        </div>
      </EditorSection>

      {/* ── BUTTONS ── */}
      <EditorSection title="🔘 Buttons" defaultOpen={false}>
        <PillGroup<AppearanceButtonStyle>
          label="Style"
          value={buttons.style}
          onChange={(v) => patchButtons({ style: v })}
          options={[
            { value: "filled",  label: "Filled" },
            { value: "outline", label: "Outline" },
            { value: "soft",    label: "Soft" },
          ]}
        />
        <PillGroup<AppearanceButtonRadius>
          label="Shape"
          value={buttons.radius}
          onChange={(v) => patchButtons({ radius: v })}
          options={[
            { value: "none", label: "Square" },
            { value: "sm",   label: "Slight" },
            { value: "md",   label: "Rounded" },
            { value: "lg",   label: "Large" },
            { value: "full", label: "Pill" },
          ]}
        />
        <PillGroup<AppearanceButtonSize>
          label="Size"
          value={buttons.size}
          onChange={(v) => patchButtons({ size: v })}
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
          ]}
        />

        {/* Live button preview inside the editor itself */}
        <div className="pt-1">
          <p className="text-xs text-muted-foreground mb-2">Preview</p>
          <div className="flex items-center justify-center p-4 rounded-lg bg-muted/30">
            <button
              type="button"
              className="font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: buttons.style === "filled" ? colors.accent : buttons.style === "soft" ? `${colors.accent}26` : "transparent",
                color:           buttons.style === "filled" ? "#ffffff" : colors.accent,
                border:          `1px solid ${buttons.style === "outline" ? colors.accent : "transparent"}`,
                borderRadius:    { none: "0px", sm: "4px", md: "8px", lg: "12px", full: "9999px" }[buttons.radius],
                height:          { sm: "32px", md: "40px", lg: "48px" }[buttons.size],
                padding:         { sm: "0 12px", md: "0 16px", lg: "0 24px" }[buttons.size],
                fontSize:        { sm: "12px", md: "14px", lg: "16px" }[buttons.size],
              }}
            >
              Buy now
            </button>
          </div>
        </div>
      </EditorSection>

      {/* ── SECTIONS ── */}
      <EditorSection title="👁️ Section visibility" defaultOpen={false}>
        <ToggleRow
          label="Bio"
          description="Show your profile bio text"
          checked={sections.showBio}
          onChange={(v) => patchSections({ showBio: v })}
        />
        <ToggleRow
          label="Social links"
          description="Twitter, Instagram, YouTube icons"
          checked={sections.showSocials}
          onChange={(v) => patchSections({ showSocials: v })}
        />
        <ToggleRow
          label="Custom links"
          description="Your bio link buttons"
          checked={sections.showLinks}
          onChange={(v) => patchSections({ showLinks: v })}
        />
        <ToggleRow
          label="Products"
          description="Your published products"
          checked={sections.showProducts}
          onChange={(v) => patchSections({ showProducts: v })}
        />
        <ToggleRow
          label="Footer"
          description='"Powered by Stanly" text'
          checked={sections.showFooter}
          onChange={(v) => patchSections({ showFooter: v })}
        />
      </EditorSection>
    </div>
  );
}

// ── Quick colour palettes ─────────────────────────────────────
const PALETTES: { name: string; colors: Partial<StoreAppearanceColors> }[] = [
  {
    name: "Dark purple (default)",
    colors: { accent: "#7c3aed", background: "#0f0f0f", surface: "#1a1a1a", text: "#f5f5f5", textMuted: "#a1a1aa", border: "#27272a" },
  },
  {
    name: "Midnight blue",
    colors: { accent: "#3b82f6", background: "#020617", surface: "#0f172a", text: "#f1f5f9", textMuted: "#94a3b8", border: "#1e293b" },
  },
  {
    name: "Forest green",
    colors: { accent: "#16a34a", background: "#052e16", surface: "#14532d", text: "#f0fdf4", textMuted: "#86efac", border: "#166534" },
  },
  {
    name: "Rose",
    colors: { accent: "#e11d48", background: "#0f0609", surface: "#1c0a10", text: "#fdf2f8", textMuted: "#f9a8d4", border: "#3f1220" },
  },
  {
    name: "Light mode",
    colors: { accent: "#7c3aed", background: "#ffffff", surface: "#f9fafb", text: "#111827", textMuted: "#6b7280", border: "#e5e7eb" },
  },
  {
    name: "Warm cream",
    colors: { accent: "#b45309", background: "#fffbeb", surface: "#fef3c7", text: "#1c1917", textMuted: "#78716c", border: "#e7e5e4" },
  },
];
