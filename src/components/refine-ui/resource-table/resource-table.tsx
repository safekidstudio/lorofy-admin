import { type BaseRecord, type CrudFilter, useParsed } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { RotateLeft01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber } from "@/lib/format";
import { DataTable } from "../data-table/data-table";
import { resourceSchemas } from "./schemas";
import type { ResourceTableProps } from "./types";

export function ResourceTable<TData extends BaseRecord = BaseRecord>({
  resource: propResource,
  schema: propSchema,
  columns: customColumns,
  pageSize = 10,
  hideSearch = false,
  hideFilters = false,
  className,
}: ResourceTableProps<TData>) {
  const { resource: parsedResource } = useParsed();
  const resourceName = propResource ?? parsedResource?.name ?? "";
  const schema = propSchema ?? resourceSchemas[resourceName];

  if (!schema) {
    throw new Error(
      `ResourceTable: No schema found for resource "${resourceName}". Please pass a schema prop or register it in resourceSchemas.`,
    );
  }

  const columns = useMemo(
    () => (customColumns ?? schema.columns) as ColumnDef<TData, any>[],
    [customColumns, schema.columns],
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    schema.filters?.forEach((f) => {
      initial[f.field] = "all";
    });
    return initial;
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { reactTable, refineCore } = useTable<TData>({
    refineCoreProps: {
      resource: resourceName,
      sorters: schema.initialSort ? { initial: schema.initialSort } : undefined,
      pagination: { pageSize },
    },
    columns,
  });

  const setFilters = refineCore.setFilters;

  useEffect(() => {
    const filters: CrudFilter[] = [];

    if (debouncedSearch) {
      filters.push({
        field: schema.search?.field ?? "q",
        operator: "contains" as const,
        value: debouncedSearch,
      });
    }

    if (schema.filters) {
      for (const filterDef of schema.filters) {
        const selectedValue = filterValues[filterDef.field];
        if (selectedValue && selectedValue !== "all") {
          const option = filterDef.options.find(
            (opt) => opt.value === selectedValue,
          );
          const mapped = option && "mappedValue" in option ? option.mappedValue : selectedValue;

          filters.push({
            field: filterDef.field,
            operator: "eq" as const,
            value: mapped,
          });
        }
      }
    }

    setFilters(filters, "replace");
  }, [debouncedSearch, filterValues, schema, setFilters]);

  const loading = refineCore.tableQuery.isLoading;
  const total = refineCore.result.total ?? 0;

  const hasActiveFilters =
    search.length > 0 ||
    Object.values(filterValues).some((val) => val !== "all");

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    const resetVals: Record<string, string> = {};
    schema.filters?.forEach((f) => {
      resetVals[f.field] = "all";
    });
    setFilterValues(resetVals);
  };

  return (
    <Card size="sm" className={className}>
      <CardContent className="grid gap-3 pt-4">
        {(!hideSearch || !hideFilters) && (
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            {!hideSearch && (
              <div className="relative flex-1 lg:max-w-sm">
                <HugeIcon
                  icon={Search01Icon}
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={schema.search?.placeholder ?? "Search records..."}
                  className="h-8 pl-8"
                  aria-label={`Search ${resourceName}`}
                />
              </div>
            )}

            {!hideFilters && schema.filters && schema.filters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {schema.filters.map((filterDef) => (
                  <Select
                    key={filterDef.field}
                    value={filterValues[filterDef.field] ?? "all"}
                    onValueChange={(val) =>
                      setFilterValues((prev) => ({
                        ...prev,
                        [filterDef.field]: val,
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 w-fit min-w-fit px-3">
                      <SelectValue placeholder={filterDef.placeholder ?? filterDef.label} />
                    </SelectTrigger>
                    <SelectContent>
                      {filterDef.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-muted-foreground gap-1.5"
                  >
                    <HugeIcon icon={RotateLeft01Icon} size={14} />
                    Reset
                  </Button>
                )}
              </div>
            )}

            <Badge
              variant="secondary"
              className="ml-auto hidden lg:inline-flex font-normal"
            >
              {formatNumber(total)} {total === 1 ? "record" : "records"}
            </Badge>
          </div>
        )}

        <DataTable
          table={reactTable}
          isLoading={loading}
          emptyContent={
            schema.emptyState ? (
              <EmptyState
                icon={schema.emptyState.icon}
                title={schema.emptyState.title}
                description={
                  hasActiveFilters
                    ? "Try resetting filters or searching with a different term."
                    : schema.emptyState.description
                }
              />
            ) : undefined
          }
        />
      </CardContent>
    </Card>
  );
}
