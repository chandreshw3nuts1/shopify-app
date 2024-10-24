import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Select, InlineGrid, Box, Text } from "@shopify/polaris";
import settingJson from './../../utils/settings.json';

const LanguageSelector = (props) => {
    const { i18n } = useTranslation();

    const languages = settingJson.languages;

    const changeLanguage = useCallback((lng) => {
        i18n.changeLanguage(lng);
    }, [i18n]);

    const languageOptions = languages.map((lng) => ({
        label: lng.lang,
        value: lng.code
    }));

    return (
            <Box>
                <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                    <Box padding="100" alignment="center">
                        <Text variant="bodyMd" as="label">
                            Current Language
                        </Text>
                    </Box>
                    <Box alignment="center">
                        <Select
                            options={languageOptions}
                            value={i18n.language}
                            onChange={(value) => changeLanguage(value)}
                        />
                    </Box>
                </InlineGrid>
            </Box>
    );
};

export default LanguageSelector;
