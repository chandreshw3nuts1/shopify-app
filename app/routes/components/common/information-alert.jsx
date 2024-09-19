import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InformationAlert = (props) => {
    const [isVisibleInfo, setIsVisibleInfo] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Use the unique key to check visibility in localStorage
        const storedValue = localStorage.getItem(`infoAlertDismissed_${props.alertKey}`);
        setIsVisibleInfo(storedValue !== 'true');
    }, [props.alertKey]);

    const handleDismiss = (e) => {
        e.preventDefault();
        setIsVisibleInfo(false);
        localStorage.setItem(`infoAlertDismissed_${props.alertKey}`, 'true');
    };

    const redirectPage = (e) => {
        e.preventDefault();
        navigate(props.pageSlug);
    };

    // Function to render alert content based on alert type
    const renderAlertContent = () => {
        switch (props.alertType) {
            case "email_appearance":
                return (
                    <div className='flxflexi plaintext'>
                        Your email appearance settings can be customized on the <a href="#" onClick={redirectPage}>Branding</a> page.
                    </div>
                );
            case "email_appearance_banner":
                return (
                    <div className='flxflexi plaintext'>
                        Want to add a Banner image? turn it on <a href="#" onClick={redirectPage}>here</a>.
                    </div>
                );
            case "import_from_other_app":
                return (
                    <div className='flxflexi plaintext'>
                        Need help migrating from other apps? You can always contact support.
                    </div>
                );
            case "import_spreadsheet_instructions":
                return (
                    <div className='flxflexi plaintext'>
                        Carefully review the Import Template Instructions and make sure that your file meets all requirements.
                    </div>
                );
            default:
                return null;
        }
    };
    
    let colorTheme = "primarybox";
    if (props.colorTheme) {
        colorTheme = props.colorTheme;
    }

    let iconClass = "twenty-customizeicon";
    if (props.iconClass) {
        iconClass = props.iconClass;
    }
    return (
        <>
            {isVisibleInfo && (
                <div className={`alertbox ${colorTheme} `}>
                    {props.iconClass &&
                        <div className="iconbox">
                            <i className={`${props.iconClass}`}></i>
                        </div>
                    }

                    {renderAlertContent()}
                    {props.alertClose && (
                        <div className='closebtn'>
                            <a href="#" onClick={handleDismiss}><i className='twenty-closeicon'></i></a>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default InformationAlert;
