// app/components/EmailTemplate.jsx
import React from 'react';

const ReviewRequestEmailTemplate = ({ emailContents, mapProductDetails, generalAppearancesObj }) => {
    var emailContentColor = "#ffffff";
    var emailBgColor = `bgcolor=#f8f9fb`;
    var emailTextColor = `#222222`;
    var buttonBackgroundColor = `#222222`;
    var buttonBorderColor = `#222222`;
    var buttonTitleColor = `#ffffff`;
    var fontSize = `14px`;
    var fontType = `Manrope`;

    if (generalAppearancesObj.emailAppearance == "modern") {
        emailBgColor = null;
    } else if (generalAppearancesObj.emailAppearance == "custom") {
        emailContentColor = generalAppearancesObj.contentBackgroundColor
        emailBgColor = `bgcolor=${generalAppearancesObj.emailBackgroundColor}`;
        emailTextColor = generalAppearancesObj.emailTextColor
        buttonBackgroundColor = generalAppearancesObj.buttonBackgroundColor
        buttonBorderColor = generalAppearancesObj.buttonBorderColor
        buttonTitleColor = generalAppearancesObj.buttonTitleColor
        fontSize = `${generalAppearancesObj.fontSize}px`;
        fontType = generalAppearancesObj.fontType;
    }
    var productsHtml = "";
    if (mapProductDetails.length > 0) {

        productsHtml = mapProductDetails.map((product) => {
            const productId = product.id.split('/').pop();

            return `
            <tr>
            <td style="padding: 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td align="center">
                            <img src=${product.images.edges[0].node.transformedSrc} style="max-width: 160px;" alt=${product.title}>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 10px;"></td>
                    </tr>
                    <tr>
                        <td align="center" style="font-family:'${fontType}', sans-serif, Roboto, arial,tahoma,verdana;font-size:16px;color:${emailTextColor}; font-weight: 600;">${product.title}</td>
                    </tr>

                     <tr>
                        <td align="center" style="font-family:'${fontType}', sans-serif, Roboto, arial,tahoma,verdana;font-size:16px;color:${emailTextColor}; font-weight: 400;padding-top:5px">{{variant_title_${productId}}}</td>
                    </tr>
                    
                    <tr>
                        <td style="padding-top: 12px;"></td>
                    </tr>
                    <tr>
                        <td align="center">
                            <a style="display: inline-block; line-height: 24px; background: ${buttonBackgroundColor}; border-radius: 50px; padding: 8px 24px; color: ${buttonTitleColor}; text-decoration: none; font-size: 14px; font-weight: bold; font-family:'${fontType}', sans-serif, Roboto, arial,tahoma,verdana; vertical-align: top; border:solid ${buttonBorderColor} 1px" href={{review_link_${productId}}} target="_blank">${emailContents.buttonText}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 12px;"></td>
                    </tr>
                </table>
            </td>
        </tr> `;

        }).join('');
    } else {
        productsHtml = ` <tr>
            <td style="padding: 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td align="center">
                            <img src="${emailContents.defaultProductImg}" style="max-width: 160px;" alt="">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 10px;"></td>
                    </tr>
                    <tr>
                        <td align="center" style="font-family:'${fontType}', sans-serif, Roboto, arial,tahoma,verdana;font-size:16px;color:${emailTextColor}; font-weight: 600;">Sample Product</td>

                    </tr>

                    <tr>
                        <td align="center" style="font-family:'${fontType}', sans-serif, Roboto, arial,tahoma,verdana;font-size:16px;color:${emailTextColor}; font-weight: 400;padding-top:5px">L / Blue</td>
                    </tr>
                    <tr>
                        <td style="padding-top: 12px;"></td>
                    </tr>
                    <tr>
                        <td align="center">
                            <a href="#" style="display: inline-block; line-height: 24px; background: ${buttonBackgroundColor}; border-radius: 50px; padding: 8px 24px; color: ${buttonTitleColor}; text-decoration: none; font-size: 14px; font-weight: bold; font-family:'${fontType}', sans-serif, Roboto, arial,tahoma,verdana; vertical-align: top; border:solid ${buttonBorderColor} 1px">${emailContents.buttonText}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 12px;"></td>
                    </tr>
                </table>
            </td>
        </tr>
    `;
    }

    var bannerHtml = "";
    var logoHtml = "";
    var footerContent = "";

    if (emailContents.banner != null && emailContents.banner != "") {
        bannerHtml = ` <tr>
                <td align="center">
                    <img src="${emailContents.banner}" width="96" height="96" alt="" style="width: 100%; height: auto; border-radius: 10px;">
                </td>
            </tr>
            <tr>
                <td style="padding-top: 18px;"></td>
            </tr>
    `;
    }


    if (emailContents.logo != null && emailContents.logo != "") {
        logoHtml = ` <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td></td>
                            <td width="600">
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td align="center">
                                            <img src="${emailContents.logo}" height="60" alt="">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 32px;"></td>
                                    </tr>
                                </table>
                            </td>
                            <td></td>
                        </tr>
                    </table>
    `;
    }
    if (emailContents.email_footer_enabled){
        footerContent = `<tr>
            <td align="center" style="font-family:'Manrope', sans-serif,Roboto, arial,tahoma,verdana;text-align:center;font-size:14px;color:#222222">
                ${emailContents.footerContent}
            </td>
        </tr>`;
    }
    const emailHtml = `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email template</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');
    </style>
</head>
<body>
    <table bgcolor="${emailContentColor}" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tbody>
            <tr>
                <td style="padding: 15px;">
                    ${logoHtml}
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td></td>
                            <td width="600">
                                <table ${emailBgColor} cellpadding="0" cellspacing="0" border="0" width="100%" style="border-radius: 20px;">
                                    <tr>
                                        <td style="padding: 32px 32px;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">

                                                <!-- If banner Has : Start -->
                                                ${bannerHtml}
                                                <!-- If banner Has : End -->
                                                
                                                
                                                <tr>
                                                    <td style="font-family:'${fontType}', sans-serif, Roboto, arial,tahoma,verdana;font-size:${fontSize};color:${emailTextColor}; white-space:pre-line">
                                                        ${emailContents.body}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 24px;"></td>
                                                </tr>
                                            </table>
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-radius: 10px;">
                                                ${productsHtml}
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td></td>
                        </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tbody>
                            <tr>
                                <td></td>
                                <td width="600">
                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="padding-top: 24px;"></td>
                                            </tr>
                                            ${footerContent}
                                            <tr>
                                                <td style="padding-top: 12px;"></td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="font-family:'Manrope', sans-serif,Roboto, arial,tahoma,verdana;text-align:center;font-size:14px;color:#2196F3"><a href="#" style="font-family:'Manrope', sans-serif,Roboto, arial,tahoma,verdana;text-align:center;font-size:14px;color:#2196F3;text-decoration:underline">Unsubscribe</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    
</body>`;


    return <html lang="en" dangerouslySetInnerHTML={{ __html: emailHtml }} />;

};

export default ReviewRequestEmailTemplate;
