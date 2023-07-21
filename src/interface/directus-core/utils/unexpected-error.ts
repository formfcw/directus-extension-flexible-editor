// Based on https://github.com/directus/directus/blob/main/app/src/utils/unexpected-error.ts

// [START] different from original
// import { RequestError } from "@/api";
import { RequestError } from "../types/api";
// import { i18n } from "@/lang";
import { useI18n } from "vue-i18n";
// import { useNotificationsStore } from "@/stores/notifications";
import { useStores } from "@directus/extensions-sdk";
// import { APIError } from "@/types/error";
import type { APIError } from "../types/error";
// [END] different from original

let store: any;

export function unexpectedError(error: Error | RequestError | APIError): void {
    // [START] different from original
    const i18n = { global: useI18n() };
    const { useNotificationsStore } = useStores();
    // [END] different from original

    if (!store) store = useNotificationsStore();

    const code =
        (error as RequestError).response?.data?.errors?.[0]?.extensions?.code ||
        (error as APIError)?.extensions?.code ||
        "UNKNOWN";

    // eslint-disable-next-line no-console
    console.warn(error);

    store.add({
        title: i18n.global.t(`errors.${code}`),
        type: "error",
        code,
        dialog: true,
        error,
    });
}
