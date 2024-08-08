import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeInformationAlert = ({ alertKey, className }) => {
    const [isVisibleInfo, setIsVisibleInfo] = useState(true);
	const navigate = useNavigate();

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

    const showBrandingPage = (e) => {
        e.preventDefault();
        navigate('/app/branding');
    }


    return (
        <>
            {
                isVisibleInfo &&

                <div className="dashalertbox">
					<div className="logobox flxfix">Logo</div>
					<div className="detailbox flxflexi flxcol">
						<h4>Our Software is here to help you jump-start your business!</h4>
						<p>Enjoy free access to Loox while the store is password protected on your Shopify trial.</p>
					</div>
					<div className="closebtn">
						<a href="#" onClick={handleDismiss}><i className="twenty-closeicon"></i></a>
					</div>
				</div>
                
            }
        </>
    );
};

export default HomeInformationAlert;
