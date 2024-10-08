import React, { useState, useEffect } from 'react';
import settingsJson from './../../../utils/settings.json';

const EnableAppEmbedAlert = ({ alertKey, shopRecords, reviewExtensionId, activeThemeId, page, alertClose }) => {
    const [isVisibleInfo, setIsVisibleInfo] = useState(true);
    useEffect(() => {
        // Use the unique key to check visibility in localStorage
        const storedValue = localStorage.getItem(`infoAlertDismissed_${alertKey}`);
        setIsVisibleInfo(storedValue !== 'true');
    }, [alertKey]);

    const handleDismiss = (e) => {
        e.preventDefault();
        setIsVisibleInfo(false);
        // Store the visibility state in localStorage with the unique key
        localStorage.setItem(`infoAlertDismissed_${alertKey}`, 'true');
    };
    const addAppEmbedToTheme = async () => {
        const appEmbedUrl = `https://admin.shopify.com/store/${shopRecords.myshopify_domain.replace(".myshopify.com", "")}/themes/${activeThemeId}/editor?context=apps&activateAppId=${reviewExtensionId}%2Fapp-embed`;
        window.open(appEmbedUrl, '_blank');
    }

    return (
        <>
            {
                isVisibleInfo && (
                    <>
                        {page === "index" && (
                            <div className="dashalertbox">
                                <div className="detailbox flxflexi flxcol">
                                    <h4>Action required - {settingsJson.app_name} is not set up</h4>
                                    <p>Reviews will only be displayed once you enable {settingsJson.app_name} Core Script.</p>
                                </div>
                                <div className=" flxfix">
                                    <button type="button" className="revbtn" onClick={addAppEmbedToTheme}  >Enable {settingsJson.app_name} Core script</button>
                                </div>
                                {alertClose &&
                                    <div className="closebtn">
                                        <a href="#" onClick={handleDismiss}><i className="twenty-closeicon"></i></a>
                                    </div>
                                }
                            </div>
                        )}
                        {page === "general" && (
                            <div className="alertbox primarybox">
                                <div className="plaintext flxflexi">
                                    <p>To activate the feature, <a href="#" onClick={addAppEmbedToTheme} >Enable</a> {settingsJson.app_name} Core script. <a href="#">Learn more</a>.</p>
                                </div>

                                {alertClose &&
                                    <div className="closebtn">
                                        <a href="#" onClick={handleDismiss}><i className="twenty-closeicon"></i></a>
                                    </div>
                                }
                            </div>
                        )}
                    </>
                )
            }
        </>
    );
};

export default EnableAppEmbedAlert;
