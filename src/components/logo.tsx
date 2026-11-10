import { SproutIcon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  iconBoxClassName,
  textClassName,
}: {
  className?: string;
  iconBoxClassName?: string;
  textClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm",
          iconBoxClassName,
        )}
      >
        <HugeIcon icon={SproutIcon} size={18} />
      </div>
      <div className={cn("flex flex-col text-left leading-tight", textClassName)}>
        <span className="text-sm font-bold tracking-tight text-foreground">
          Lorofy
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Admin Console
        </span>
      </div>
    </div>
  );
}
