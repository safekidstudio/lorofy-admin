import type { Column } from "@tanstack/react-table";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Sorting05Icon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DataTableSorterProps<TData, TValue = unknown> {
  column: Column<TData, TValue>;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DataTableSorter<TData, TValue = unknown>({
  column,
  title,
  children,
  className,
}: DataTableSorterProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={className}>{children ?? title}</span>;
  }

  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-3 h-8 data-[state=open]:bg-accent", className)}
      onClick={() => column.toggleSorting(isSorted === "asc")}
    >
      <span>{children ?? title}</span>
      {isSorted === "desc" ? (
        <HugeIcon icon={ArrowDown01Icon} size={14} className="ml-2" />
      ) : isSorted === "asc" ? (
        <HugeIcon icon={ArrowUp01Icon} size={14} className="ml-2" />
      ) : (
        <HugeIcon icon={Sorting05Icon} size={14} className="ml-2 opacity-40" />
      )}
    </Button>
  );
}
