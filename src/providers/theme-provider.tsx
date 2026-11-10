import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  COLOR_PRESETS,
  type ColorPreset,
  type ContentWidth,
  DEFAULT_THEME_SETTINGS,
  type LayoutDensity,
  type ResolvedTheme,
  type SidebarCollapsible,
  type SidebarTheme,
  type SidebarVariant,
  type ThemeMode,
  type ThemeSettings,
} from "@/lib/theme-tokens";

export type Theme = ThemeMode;

const STORAGE_KEY = "lorofy.admin.theme.settings.v1";

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  colorPreset: ColorPreset;
  radius: number;
  layoutDensity: LayoutDensity;
  contentWidth: ContentWidth;
  sidebarVariant: SidebarVariant;
  sidebarCollapsible: SidebarCollapsible;
  sidebarTheme: SidebarTheme;
  setTheme: (theme: ThemeMode) => void;
  setColorPreset: (preset: ColorPreset) => void;
  setRadius: (radius: number) => void;
  setLayoutDensity: (density: LayoutDensity) => void;
  setContentWidth: (width: ContentWidth) => void;
  setSidebarVariant: (variant: SidebarVariant) => void;
  setSidebarCollapsible: (collapsible: SidebarCollapsible) => void;
  setSidebarTheme: (theme: SidebarTheme) => void;
  resetToDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredSettings(): ThemeSettings {
  if (typeof window === "undefined") return DEFAULT_THEME_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        theme: parsed.theme ?? DEFAULT_THEME_SETTINGS.theme,
        colorPreset: parsed.colorPreset ?? DEFAULT_THEME_SETTINGS.colorPreset,
        radius: typeof parsed.radius === "number" ? parsed.radius : DEFAULT_THEME_SETTINGS.radius,
        layoutDensity: parsed.layoutDensity ?? DEFAULT_THEME_SETTINGS.layoutDensity,
        contentWidth: parsed.contentWidth ?? DEFAULT_THEME_SETTINGS.contentWidth,
        sidebarVariant: parsed.sidebarVariant ?? DEFAULT_THEME_SETTINGS.sidebarVariant,
        sidebarCollapsible: parsed.sidebarCollapsible ?? DEFAULT_THEME_SETTINGS.sidebarCollapsible,
        sidebarTheme: parsed.sidebarTheme ?? DEFAULT_THEME_SETTINGS.sidebarTheme,
      };
    }
  } catch {
    // Fallback if parsing fails
  }
  return DEFAULT_THEME_SETTINGS;
}

function applyThemeToDOM(
  resolvedTheme: ResolvedTheme,
  settings: ThemeSettings,
): void {
  const root = document.documentElement;

  // 1. Dark mode
  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme;

  // 2. Data attributes
  root.setAttribute("data-theme-color", settings.colorPreset);
  root.setAttribute("data-density", settings.layoutDensity);
  root.setAttribute("data-sidebar-theme", settings.sidebarTheme);

  // 3. Dynamic CSS custom properties
  root.style.setProperty("--radius", `${settings.radius}rem`);

  const preset = COLOR_PRESETS[settings.colorPreset] ?? COLOR_PRESETS.forest;
  const tokenValues = resolvedTheme === "dark" ? preset.dark : preset.light;

  root.style.setProperty("--primary", tokenValues.primary);
  root.style.setProperty("--primary-foreground", tokenValues.primaryForeground);
  root.style.setProperty("--ring", tokenValues.ring);
  root.style.setProperty("--sidebar-primary", tokenValues.primary);
  root.style.setProperty("--sidebar-primary-foreground", tokenValues.primaryForeground);
  root.style.setProperty("--sidebar-ring", tokenValues.ring);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(getStoredSettings);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    settings.theme === "system" ? getSystemTheme() : settings.theme,
  );

  useEffect(() => {
    const resolved =
      settings.theme === "system" ? getSystemTheme() : settings.theme;
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved, settings);
  }, [settings]);

  useEffect(() => {
    if (settings.theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      applyThemeToDOM(resolved, settings);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [settings]);

  const saveSettings = useCallback((updater: (prev: ThemeSettings) => ThemeSettings) => {
    setSettings((prev) => {
      const next = updater(prev);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Handle storage quota or private mode
      }
      return next;
    });
  }, []);

  const setTheme = useCallback(
    (theme: ThemeMode) => saveSettings((prev) => ({ ...prev, theme })),
    [saveSettings],
  );

  const setColorPreset = useCallback(
    (colorPreset: ColorPreset) =>
      saveSettings((prev) => ({ ...prev, colorPreset })),
    [saveSettings],
  );

  const setRadius = useCallback(
    (radius: number) => saveSettings((prev) => ({ ...prev, radius })),
    [saveSettings],
  );

  const setLayoutDensity = useCallback(
    (layoutDensity: LayoutDensity) =>
      saveSettings((prev) => ({ ...prev, layoutDensity })),
    [saveSettings],
  );

  const setContentWidth = useCallback(
    (contentWidth: ContentWidth) =>
      saveSettings((prev) => ({ ...prev, contentWidth })),
    [saveSettings],
  );

  const setSidebarVariant = useCallback(
    (sidebarVariant: SidebarVariant) =>
      saveSettings((prev) => ({ ...prev, sidebarVariant })),
    [saveSettings],
  );

  const setSidebarCollapsible = useCallback(
    (sidebarCollapsible: SidebarCollapsible) =>
      saveSettings((prev) => ({ ...prev, sidebarCollapsible })),
    [saveSettings],
  );

  const setSidebarTheme = useCallback(
    (sidebarTheme: SidebarTheme) =>
      saveSettings((prev) => ({ ...prev, sidebarTheme })),
    [saveSettings],
  );

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_THEME_SETTINGS);
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_THEME_SETTINGS),
      );
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      theme: settings.theme,
      resolvedTheme,
      colorPreset: settings.colorPreset,
      radius: settings.radius,
      layoutDensity: settings.layoutDensity,
      contentWidth: settings.contentWidth,
      sidebarVariant: settings.sidebarVariant,
      sidebarCollapsible: settings.sidebarCollapsible,
      sidebarTheme: settings.sidebarTheme,
      setTheme,
      setColorPreset,
      setRadius,
      setLayoutDensity,
      setContentWidth,
      setSidebarVariant,
      setSidebarCollapsible,
      setSidebarTheme,
      resetToDefaults,
    }),
    [
      settings,
      resolvedTheme,
      setTheme,
      setColorPreset,
      setRadius,
      setLayoutDensity,
      setContentWidth,
      setSidebarVariant,
      setSidebarCollapsible,
      setSidebarTheme,
      resetToDefaults,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
