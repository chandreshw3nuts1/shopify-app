import React from 'react';

const SampleReviewRequestEmail = ({ emailContents, documentObj }) => {
    var emailContentColor = "#ffffff";
    var emailBgColor = `bgcolor=#f8f9fb`;
    var emailTextColor = `#222222`;
    var buttonBackgroundColor = `#222222`;
    var buttonBorderColor = `#222222`;
    var buttonTitleColor = `#ffffff`;
    var fontSize = `14px`;
    var fontType = `Manrope`;
    
    if (documentObj.emailAppearance == "modern") {
        emailBgColor = null;
    } else if(documentObj.emailAppearance == "custom") {
        emailContentColor = documentObj.contentBackgroundColor
        emailBgColor = `bgcolor=${documentObj.emailBackgroundColor}`;
        emailTextColor = documentObj.emailTextColor
        buttonBackgroundColor = documentObj.buttonBackgroundColor
        buttonBorderColor = documentObj.buttonBorderColor
        buttonTitleColor = documentObj.buttonTitleColor
        fontSize = `${documentObj.fontSize}px`;
        fontType = documentObj.fontType;
    }
    var bannerHtml = "";
    var logoHtml = "";
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
                                               
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td align="center">
                                                                    <img src="${emailContents.getDefaultProductImage}" style="max-width: 160px;" alt="">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding-top: 10px;"></td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" style="font-family:'${fontType}', sans-serif, Roboto, arial,tahoma,verdana;font-size:16px;color:${emailTextColor}; font-weight: 600;">Sample Product</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding-top: 12px;"></td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="#" style="display: inline-block; line-height: 24px; background: ${buttonBackgroundColor}; border-radius: 50px; padding: 8px 24px; color: ${buttonTitleColor}; text-decoration: none; font-size: 14px; font-weight: bold; font-family:'${fontType}', sans-serif, Roboto, arial,tahoma,verdana; vertical-align: top; border:solid ${buttonBorderColor} 1px">Write a review</a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding-top: 12px;"></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
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
                                            <tr>
                                                <td align="center" style="font-family:'Manrope', sans-serif,Roboto, arial,tahoma,verdana;text-align:center;font-size:14px;color:#222222">
                                                    This email is sent for <a href="#" style="font-family:'Manrope', sans-serif,Roboto, arial,tahoma,verdana;text-align:center;font-size:14px;color:#222222;text-decoration:underline">companyname@gmail.com</a>
                                                </td>
                                            </tr>
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

export default SampleReviewRequestEmail;
