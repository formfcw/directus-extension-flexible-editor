// Based on https://github.com/directus/directus/blob/main/app/src/utils/fetch-all.ts

// [START] different from original
// import api from '@/api';
import { useApi, useStores } from "@directus/extensions-sdk";
// import { useServerStore } from '@/stores/server';
// [END] different from original
import { cloneDeep, set } from "lodash";

export const fetchAll = async <T = unknown>(
    // [START] different from original
    url: Parameters<any["get"]>[0],
    config: Parameters<any["get"]>[1] = {},
    // [END] different from original
    limit = Infinity
): Promise<T[]> => {
    // [START] different from original
    const api = useApi();
    const { useServerStore } = useStores();
    // [END] different from original

    let page = 1;
    let hasMore = true;

    const { info } = useServerStore();

    if (!info.queryLimit || info.queryLimit?.max === -1) {
        // do a single request if possible
        set(config, "params.limit", -1);
        const { data } = await api.get(url, config);
        return data.data as T[];
    }

    const pageSize = info.queryLimit!.max;
    const result = [] as T[];

    while (result.length < limit && hasMore === true) {
        const configWithPagination = cloneDeep(config);
        set(configWithPagination, "params.page", page);
        set(configWithPagination, "params.limit", pageSize);

        const { data } = await api.get(url, configWithPagination);

        if (data.data.length === 0) {
            hasMore = false;
        } else {
            result.push(...data.data);
        }

        page++;
    }

    if (Number.isFinite(limit)) {
        return result.slice(0, limit);
    }

    return result;
};
