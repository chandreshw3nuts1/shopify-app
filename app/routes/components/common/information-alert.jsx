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
        // Store the visibility state in localStorage with the unique key
        localStorage.setItem(`infoAlertDismissed_${props.alertKey}`, 'true');
    };

    const showBrandingPage = (e) => {
        e.preventDefault();
        navigate('/app/branding');
    }


    return (
        <>
            {
                isVisibleInfo &&
                <div className={`alertbox primarybox ${props.className}`}>
                    <div className='iconbox'>
                        <i className='twenty-customizeicon'></i>
                    </div>
                    <div className='flxflexi plaintext'>Your email appearance settings can be customized on the <a href="#" onClick={showBrandingPage} >Branding</a> page.</div>

                    {props.alertClose &&
                        <div className='closebtn'>
                            <a href="#" onClick={handleDismiss}><i className='twenty-closeicon'></i></a>
                        </div>
                    }


                </div>
            }
        </>
    );
};

export default InformationAlert;
