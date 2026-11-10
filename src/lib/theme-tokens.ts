export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export type ColorPreset =
  | "forest"
  | "blue"
  | "violet"
  | "rose"
  | "amber"
  | "zinc";

export type LayoutDensity = "comfortable" | "compact";
export type ContentWidth = "full" | "boxed";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarCollapsible = "icon" | "offcanvas";
export type SidebarTheme = "default" | "dark";

export interface ColorPresetDef {
  id: ColorPreset;
  label: string;
  previewColor: string;
  light: {
    primary: string;
    primaryForeground: string;
    ring: string;
  };
  dark: {
    primary: string;
    primaryForeground: string;
    ring: string;
  };
}

export const COLOR_PRESETS: Record<ColorPreset, ColorPresetDef> = {
  forest: {
    id: "forest",
    label: "Forest (Lorofy)",
    previewColor: "#0d5338",
    light: {
      primary: "oklch(0.18 0.03 155)",
      primaryForeground: "oklch(0.99 0 0)",
      ring: "oklch(0.18 0.03 155)",
    },
    dark: {
      primary: "oklch(0.72 0.17 150)",
      primaryForeground: "oklch(0.12 0.02 155)",
      ring: "oklch(0.72 0.17 150)",
    },
  },
  blue: {
    id: "blue",
    label: "Refine Blue",
    previewColor: "#2563eb",
    light: {
      primary: "oklch(0.55 0.22 255)",
      primaryForeground: "oklch(0.99 0 0)",
      ring: "oklch(0.55 0.22 255)",
    },
    dark: {
      primary: "oklch(0.68 0.19 250)",
      primaryForeground: "oklch(0.12 0.02 255)",
      ring: "oklch(0.68 0.19 250)",
    },
  },
  violet: {
    id: "violet",
    label: "Violet",
    previewColor: "#7c3aed",
    light: {
      primary: "oklch(0.54 0.23 295)",
      primaryForeground: "oklch(0.99 0 0)",
      ring: "oklch(0.54 0.23 295)",
    },
    dark: {
      primary: "oklch(0.70 0.19 295)",
      primaryForeground: "oklch(0.12 0.02 295)",
      ring: "oklch(0.70 0.19 295)",
    },
  },
  rose: {
    id: "rose",
    label: "Rose",
    previewColor: "#e11d48",
    light: {
      primary: "oklch(0.58 0.22 15)",
      primaryForeground: "oklch(0.99 0 0)",
      ring: "oklch(0.58 0.22 15)",
    },
    dark: {
      primary: "oklch(0.72 0.18 15)",
      primaryForeground: "oklch(0.12 0.02 15)",
      ring: "oklch(0.72 0.18 15)",
    },
  },
  amber: {
    id: "amber",
    label: "Amber",
    previewColor: "#d97706",
    light: {
      primary: "oklch(0.68 0.18 65)",
      primaryForeground: "oklch(0.12 0.02 65)",
      ring: "oklch(0.68 0.18 65)",
    },
    dark: {
      primary: "oklch(0.75 0.18 65)",
      primaryForeground: "oklch(0.12 0.02 65)",
      ring: "oklch(0.75 0.18 65)",
    },
  },
  zinc: {
    id: "zinc",
    label: "Zinc",
    previewColor: "#52525b",
    light: {
      primary: "oklch(0.20 0 0)",
      primaryForeground: "oklch(0.99 0 0)",
      ring: "oklch(0.20 0 0)",
    },
    dark: {
      primary: "oklch(0.92 0 0)",
      primaryForeground: "oklch(0.14 0 0)",
      ring: "oklch(0.92 0 0)",
    },
  },
};

export const RADIUS_OPTIONS = [
  { value: 0.3, label: "0.3 (Compact)" },
  { value: 0.5, label: "0.5 (Default)" },
  { value: 0.75, label: "0.75 (Soft)" },
  { value: 1.0, label: "1.0 (Rounded)" },
] as const;

export interface ThemeSettings {
  theme: ThemeMode;
  colorPreset: ColorPreset;
  radius: number;
  layoutDensity: LayoutDensity;
  contentWidth: ContentWidth;
  sidebarVariant: SidebarVariant;
  sidebarCollapsible: SidebarCollapsible;
  sidebarTheme: SidebarTheme;
}

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  theme: "light",
  colorPreset: "forest",
  radius: 0.5,
  layoutDensity: "comfortable",
  contentWidth: "full",
  sidebarVariant: "sidebar",
  sidebarCollapsible: "icon",
  sidebarTheme: "default",
};
