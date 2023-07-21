// Copied types from https://github.com/directus/directus/blob/main/app/src/api.ts

import type {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

type RequestConfig = InternalAxiosRequestConfig & { id: string };
type Response = AxiosResponse & { config: RequestConfig };
export type RequestError = AxiosError & { response: Response };
