import {
  GridViewIcon,
  LaptopIcon,
  ListViewIcon,
  Maximize01Icon,
  Minimize01Icon,
  Moon01Icon,
  RotateLeft01Icon,
  Settings03Icon,
  SidebarLeft01Icon,
  Sun01Icon,
  Tick01Icon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import {
  COLOR_PRESETS,
  type ColorPreset,
  RADIUS_OPTIONS,
  type SidebarVariant,
  type ThemeMode,
} from "@/lib/theme-tokens";
import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function ThemeCustomizer() {
  const {
    theme,
    colorPreset,
    radius,
    layoutDensity,
    contentWidth,
    sidebarVariant,
    sidebarCollapsible,
    sidebarTheme,
    setTheme,
    setColorPreset,
    setRadius,
    setLayoutDensity,
    setContentWidth,
    setSidebarVariant,
    setSidebarCollapsible,
    setSidebarTheme,
    resetToDefaults,
  } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-8"
          title="Settings & Appearance"
          aria-label="Settings & Appearance"
        >
          <HugeIcon icon={Settings03Icon} size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[360px] sm:w-[440px] overflow-y-auto p-6">
        <SheetHeader className="pb-2">
          <div className="flex items-center justify-between pr-6">
            <SheetTitle className="text-base font-semibold">
              Settings & Appearance
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <HugeIcon icon={RotateLeft01Icon} size={14} />
              Reset
            </Button>
          </div>
          <SheetDescription className="text-xs">
            Customize theme mode, color palettes, layout density, and interface appearance. Preferences persist across sessions.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-5 py-4">
          {/* 1. Theme Mode */}
          <div className="grid gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mode
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "light", label: "Light", icon: Sun01Icon },
                { id: "dark", label: "Dark", icon: Moon01Icon },
                { id: "system", label: "System", icon: LaptopIcon },
              ].map((item) => {
                const isSelected = theme === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-9 gap-1.5 justify-center font-normal",
                      isSelected && "font-medium shadow-xs",
                    )}
                    onClick={() => setTheme(item.id as ThemeMode)}
                  >
                    <HugeIcon icon={item.icon} size={15} />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* 2. Color Palette */}
          <div className="grid gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Color Palette
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(COLOR_PRESETS).map((preset) => {
                const isSelected = colorPreset === preset.id;
                return (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 justify-start gap-2 border font-normal",
                      isSelected && "border-primary bg-primary/5 font-semibold text-primary",
                    )}
                    onClick={() => setColorPreset(preset.id as ColorPreset)}
                  >
                    <span
                      className="size-4 shrink-0 rounded-full border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: preset.previewColor }}
                    />
                    <span className="truncate text-xs">{preset.label}</span>
                    {isSelected && (
                      <HugeIcon icon={Tick01Icon} size={14} className="ml-auto text-primary" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* 3. Border Radius */}
          <div className="grid gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Border Radius
            </Label>
            <div className="grid grid-cols-4 gap-1.5">
              {RADIUS_OPTIONS.map((opt) => {
                const isSelected = radius === opt.value;
                return (
                  <Button
                    key={opt.value}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-xs font-normal"
                    onClick={() => setRadius(opt.value)}
                  >
                    {opt.value}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* 4. Sidebar Configuration */}
          <div className="grid gap-3">
            <div className="flex items-center gap-1.5">
              <HugeIcon icon={SidebarLeft01Icon} size={15} className="text-primary" />
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sidebar Settings
              </Label>
            </div>

            {/* Sidebar Style */}
            <div className="grid gap-1.5">
              <span className="text-[11px] text-muted-foreground">Style</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "sidebar", label: "Default" },
                  { id: "floating", label: "Floating" },
                  { id: "inset", label: "Inset" },
                ].map((item) => {
                  const isSelected = sidebarVariant === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs font-normal"
                      onClick={() => setSidebarVariant(item.id as SidebarVariant)}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Collapse Behavior */}
            <div className="grid gap-1.5">
              <span className="text-[11px] text-muted-foreground">Collapse Behavior</span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={sidebarCollapsible === "icon" ? "default" : "outline"}
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-normal"
                  onClick={() => setSidebarCollapsible("icon")}
                >
                  <HugeIcon icon={SidebarLeft01Icon} size={14} />
                  Icon Rail
                </Button>
                <Button
                  variant={sidebarCollapsible === "offcanvas" ? "default" : "outline"}
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-normal"
                  onClick={() => setSidebarCollapsible("offcanvas")}
                >
                  <HugeIcon icon={ViewOffIcon} size={14} />
                  Off-canvas
                </Button>
              </div>
            </div>

            {/* Sidebar Theme */}
            <div className="grid gap-1.5">
              <span className="text-[11px] text-muted-foreground">Theme</span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={sidebarTheme === "default" ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs font-normal"
                  onClick={() => setSidebarTheme("default")}
                >
                  Follow App
                </Button>
                <Button
                  variant={sidebarTheme === "dark" ? "default" : "outline"}
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-normal"
                  onClick={() => setSidebarTheme("dark")}
                >
                  <HugeIcon icon={Moon01Icon} size={14} />
                  Always Dark
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* 5. Layout Density */}
          <div className="grid gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Data Density
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={layoutDensity === "comfortable" ? "default" : "outline"}
                size="sm"
                className="h-9 gap-1.5 font-normal"
                onClick={() => setLayoutDensity("comfortable")}
              >
                <HugeIcon icon={ListViewIcon} size={15} />
                <span className="text-xs">Comfortable</span>
              </Button>
              <Button
                variant={layoutDensity === "compact" ? "default" : "outline"}
                size="sm"
                className="h-9 gap-1.5 font-normal"
                onClick={() => setLayoutDensity("compact")}
              >
                <HugeIcon icon={GridViewIcon} size={15} />
                <span className="text-xs">Compact</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* 6. Content Width */}
          <div className="grid gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Content Width
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={contentWidth === "full" ? "default" : "outline"}
                size="sm"
                className="h-9 gap-1.5 font-normal"
                onClick={() => setContentWidth("full")}
              >
                <HugeIcon icon={Maximize01Icon} size={15} />
                <span className="text-xs">Full Width</span>
              </Button>
              <Button
                variant={contentWidth === "boxed" ? "default" : "outline"}
                size="sm"
                className="h-9 gap-1.5 font-normal"
                onClick={() => setContentWidth("boxed")}
              >
                <HugeIcon icon={Minimize01Icon} size={15} />
                <span className="text-xs">Boxed (1280px)</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
