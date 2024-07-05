import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InformationAlert = () => {
    const [isVisibleInfo, setIsVisibleInfo] = useState(true);
	const navigate = useNavigate();

    useEffect(() => {
        const isVisibleInfo = localStorage.getItem('manualRequestEmailNotificationDismissed');
        setIsVisibleInfo(!isVisibleInfo);
    }, []);

    const handleDismiss = (e) => {
        e.preventDefault();
        setIsVisibleInfo(false);
        localStorage.setItem('manualRequestEmailNotificationDismissed', 'true');
    };

    const showBrandingPage = (e) => {
        e.preventDefault();
        navigate('/app/branding');
    }


    return (
        <>
            {
                isVisibleInfo &&
                <div className='alertbox primarybox'>
                    <div className='iconbox'>
                        <i className='twenty-customizeicon'></i>
                    </div>
                    <div className='flxflexi plaintext'>Your email appearance settings can be customized on the <a href="#" onClick={showBrandingPage} >Branding</a> page.</div>
                    <div className='closebtn'>
                        <a href="#" onClick={handleDismiss}><i className='twenty-closeicon'></i></a>
                    </div>
                </div>
            }
        </>
    );
};

export default InformationAlert;
