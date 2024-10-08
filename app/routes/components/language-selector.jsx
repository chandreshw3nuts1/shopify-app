import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import settingJson from './../../utils/settings.json';

const LanguageSelector = (props) => {
    const { i18n } = useTranslation();

    const languages = settingJson.languages;

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className={`form-group ${props.className}`}>
            <label htmlFor="">Current Language</label>
            <select value={i18n.language}  onChange={(e) =>  changeLanguage(e.target.value)} className="input_text">
                {languages.map((lng) => {
                    return (
                        <option key={lng.code} value={lng.code}>{lng.lang}</option>
                    );
                })}
            </select>
        </div>
    );
};

export default LanguageSelector;