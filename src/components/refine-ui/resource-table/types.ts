import type { BaseRecord, CrudSort } from "@refinedev/core";
import type { ColumnDef } from "@tanstack/react-table";

export interface ResourceFilterOption {
  label: string;
  value: string;
  mappedValue?: unknown;
}

export interface ResourceFilterDef {
  field: string;
  label: string;
  placeholder?: string;
  options: ResourceFilterOption[];
}

export interface ResourceSchema<TData extends BaseRecord = BaseRecord> {
  name: string;
  initialSort?: CrudSort[];
  search?: {
    placeholder: string;
    field?: string;
  };
  filters?: ResourceFilterDef[];
  columns: ColumnDef<TData, any>[];
  emptyState?: {
    icon: any;
    title: string;
    description: string;
  };
}

export interface ResourceTableProps<TData extends BaseRecord = BaseRecord> {
  resource?: string;
  schema?: ResourceSchema<TData>;
  columns?: ColumnDef<TData, any>[];
  pageSize?: number;
  hideSearch?: boolean;
  hideFilters?: boolean;
  className?: string;
}
