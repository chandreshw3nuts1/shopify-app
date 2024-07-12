import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import settingJson from './../../utils/settings.json';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const languages = settingJson.languages;

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (

        <div className="col-lg-6">
            <div className="form-group">
                <label htmlFor="">Current Language</label>
                <select onChange={(e) => changeLanguage(e.target.value)} className="input_text">
                    {languages.map((lng) => {
                        return (
                            <option selected={lng.code === i18n.language} value={lng.code}>{lng.lang}</option>
                        );
                    })}

                </select>
            </div>
        </div>


    );
};

export default LanguageSelector;