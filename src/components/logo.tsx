import { cn } from "@/lib/utils";

export function Logo({
  className,
  iconBoxClassName,
  textClassName,
  wordmarkClassName,
  subtitle = "Admin Console",
}: {
  className?: string;
  iconBoxClassName?: string;
  textClassName?: string;
  wordmarkClassName?: string;
  subtitle?: string | null;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white ring-1 ring-black/5",
          iconBoxClassName,
        )}
      >
        <img
          src="/lorofy.png"
          alt="Lorofy"
          className="size-full scale-[1.22] object-contain"
          draggable={false}
        />
      </span>
      <span className={cn("flex min-w-0 flex-col text-left", textClassName)}>
        <span
          className={cn(
            "font-display text-2xl leading-none tracking-wide text-foreground",
            wordmarkClassName,
          )}
        >
          Lorofy
        </span>
        {subtitle ? (
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {subtitle}
          </span>
        ) : null}
      </span>
    </div>
  );
}
