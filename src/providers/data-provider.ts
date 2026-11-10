import type {
  BaseRecord,
  CreateParams,
  CreateResponse,
  CrudFilter,
  CustomParams,
  CustomResponse,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  GetListParams,
  GetListResponse,
  GetManyParams,
  GetManyResponse,
  GetOneParams,
  GetOneResponse,
  UpdateParams,
  UpdateResponse,
} from "@refinedev/core";
import { apiRequest, type QueryValue } from "@/lib/api-client";
import { API_URL } from "@/lib/env";
import type { PageResponse } from "@/types/api";

function buildQuery(params: GetListParams): Record<string, QueryValue> {
  const query: Record<string, QueryValue> = {
    page: Math.max(0, (params.pagination?.currentPage ?? 1) - 1),
    size: params.pagination?.pageSize ?? 10,
  };

  const sort = params.sorters
    ?.filter((sorter) => sorter.field)
    .map((sorter) => `${sorter.field},${sorter.order}`);

  if (sort?.length) query.sort = sort;

  const applyFilter = (filter: CrudFilter): void => {
    if (filter.operator === "and" || filter.operator === "or") {
      (filter.value as CrudFilter[]).forEach(applyFilter);
      return;
    }

    if (!("field" in filter)) return;
    const { field, value } = filter;
    if (value === undefined || value === null || value === "") return;

    switch (filter.operator) {
      case "eq":
        query[field] = typeof value === "boolean" ? value : String(value);
        break;
      case "ne":
        query[`${field}Not`] = String(value);
        break;
      case "contains":
        // Backend admin endpoints accept both `search` and `q`
        query.search = String(value);
        query.q = String(value);
        break;
      case "in":
        if (Array.isArray(value)) {
          query[field] = value.map(String).join(",");
        }
        break;
      case "gte":
        query[`${field}From`] = String(value);
        break;
      case "lte":
        query[`${field}To`] = String(value);
        break;
      default:
        break;
    }
  };

  params.filters?.forEach(applyFilter);
  return query;
}

const realDataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>(
    params: GetListParams,
  ): Promise<GetListResponse<TData>> => {
    const resource = params.resource;
    const res = await apiRequest<unknown>(`/admin/${resource}`, {
      query: buildQuery(params),
    });

    if (Array.isArray(res)) {
      const pageIndex = Math.max(0, (params.pagination?.currentPage ?? 1) - 1);
      const pageSize = params.pagination?.pageSize ?? 10;
      const start = pageIndex * pageSize;
      return {
        data: (res as TData[]).slice(start, start + pageSize),
        total: res.length,
      };
    }

    if (res && typeof res === "object" && "content" in res) {
      const page = res as PageResponse<TData>;
      return {
        data: page.content ?? [],
        total: page.totalElements ?? 0,
      };
    }

    return { data: [], total: 0 };
  },

  getOne: async <TData extends BaseRecord = BaseRecord>({
    resource,
    id,
  }: GetOneParams): Promise<GetOneResponse<TData>> => {
    const data = await apiRequest<TData>(`/admin/${resource}/${id}`);
    return { data };
  },

  create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({
    resource,
    variables,
  }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    const data = await apiRequest<TData>(`/admin/${resource}`, {
      method: "POST",
      body: variables,
    });
    return { data };
  },

  update: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({
    resource,
    id,
    variables,
  }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    const method =
      resource === "categories" || resource === "badges" ? "PUT" : "PATCH";
    const data = await apiRequest<TData>(`/admin/${resource}/${id}`, {
      method,
      body: variables,
    });
    return { data };
  },

  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({
    resource,
    id,
    variables,
  }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    const data = await apiRequest<TData>(`/admin/${resource}/${id}`, {
      method: "DELETE",
      body: variables,
    });
    return { data };
  },

  getMany: async <TData extends BaseRecord = BaseRecord>({
    resource,
    ids,
  }: GetManyParams): Promise<GetManyResponse<TData>> => {
    const records = await Promise.all(
      ids.map((id) =>
        apiRequest<TData>(`/admin/${resource}/${id}`).catch(() => null),
      ),
    );

    return {
      data: records.filter((record) => record !== null) as unknown as TData[],
    };
  },

  custom: async <
    TData extends BaseRecord = BaseRecord,
    TQuery = unknown,
    TPayload = unknown,
  >({
    url,
    method,
    payload,
    query,
  }: CustomParams<TQuery, TPayload>): Promise<CustomResponse<TData>> => {
    const data = await apiRequest<TData>(url, {
      method: (method?.toUpperCase() ?? "GET") as
        | "GET"
        | "POST"
        | "PUT"
        | "PATCH"
        | "DELETE",
      body: payload,
      query: query as Record<string, QueryValue>,
    });
    return { data };
  },

  getApiUrl: () => API_URL,
};

export const dataProvider: DataProvider = realDataProvider;
