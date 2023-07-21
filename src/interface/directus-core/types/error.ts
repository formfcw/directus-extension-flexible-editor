// Cloned from https://github.com/directus/directus/blob/main/app/src/types/error.ts

export type APIError = {
    message: string;
    extensions: {
        code: string;
        [key: string]: any;
    };
};
