import { cn } from "cn";
import type { MascotCategory } from "@/types/api";

const CATEGORY_EMOJI: Record<MascotCategory, string> = {
  PLANT: "🌱",
  ANIMAL: "🦊",
  FANTASY: "🐉",
};

interface MascotThumbProps {
  name: string;
  category: MascotCategory;
  imageUrl?: string | null;
  className?: string;
}

export function MascotThumb({
  name,
  category,
  imageUrl,
  className,
}: MascotThumbProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn(
          "size-10 shrink-0 rounded-lg border border-border object-cover",
          className,
        )}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-muted text-lg",
        className,
      )}
      aria-hidden
    >
      <span>{CATEGORY_EMOJI[category]}</span>
    </div>
  );
}
