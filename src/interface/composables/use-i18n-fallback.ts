// Composable checks if i18n composable exists in order to provide a fallback message if it does not
import customMessages from "../i18n/custom-messages";

type Attributes = { t: (key: string) => string };

export const useI18nFallback = ({ t }: Attributes) => {
    return {
        t: (key: string) => {
            const message = findValueByDotNotation(key, customMessages);

            if (!message) {
                return t(key);
            }

            return $t(message);
        },
        $t,
    };

    function $t(name: string) {
        const isDirectusTranslation = name.indexOf("$t:") === 0;

        if (isDirectusTranslation) {
            return t(name.slice(3));
        }

        return name;
    }

    function findValueByDotNotation(key: string, data: any) {
        return key.split(".").reduce((ob, i) => ob?.[i], data);
    }
};
