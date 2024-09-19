import React from 'react';
import settingJson from './../../../utils/settings.json';

const EmailTemplate = ({ emailContents }) => {

    const checkMarkEmail = settingJson.host_url + '/images/email_template/check-mark-email.png';
    const mainStarIcon = settingJson.host_url + '/images/email_template/main-star-icon.png';
    const eyeIcon = settingJson.host_url + '/images/email_template/eye-icon.png';
    const logoImg = settingJson.host_url + '/images/email_template/logo.png';

    const productUrl = `https://${emailContents.shop_domain}/products/${emailContents.product_url}`;
    const starIcon = settingJson.host_url + `/images/email_template/star-${emailContents.rating}.png`;
    const questionsHtml = emailContents.questions.map((item) => {
        if (item.answer != null) {
            return ` <tr>
                        <td style="padding-top: 12px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana;font-size:16px;color:#222222; font-weight: bold;">${item.question_name}</td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 4px;"></td>
                                </tr>
                                <tr>
                                    <td style="font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana;font-size:14px;color:#757575;">${item.answer}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    `;
        } else {
            return ''; // or any other default value or message when answer is not available
        }

    }).join('');

    const questionsContent = questionsHtml ?
        `<table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
                <td style="padding-top: 12px;"></td>
            </tr>
            <tr>
                <td bgcolor="#E3E4E5" height="1"></td>
            </tr>
            ${questionsHtml}
        </table>`
        : '';

    var autoPublishNote = "";
    var autoPublishOption = "";
    if (emailContents.status == 'publish') {
        autoPublishNote = `<table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="display: block; line-height: 24px; background: #C2F7AA; border-radius: 50px; padding: 12px 24px; color: #222222; text-decoration: none; font-size: 16px; font-weight: bold; font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana;">
                                        <img src=${checkMarkEmail} width="24" height="24" alt="" style="vertical-align: top; margin-right: 5px;">
                                        This review was automatically published. <a href="#" style="color: #222222; text-decoration: underline;">Learn more</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 32px;"></td>
                                </tr>
                            </table>`;
        autoPublishOption = `<td align="center">
            <a href=${emailContents.shopifyStoreUrl} style="display: inline-block; line-height: 24px; background: #F8F9FB; border-radius: 50px; padding: 8px 24px; color: #222222; text-decoration: none; font-size: 16px; font-weight: bold; font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana; vertical-align: top;"><img src=${eyeIcon} width="24" height="24" alt="" style="vertical-align: top; margin-right: 5px;">Unpublish review</a>
        </td>`;
    }

    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email template</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');
    </style>
</head>
<body>
    <table bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tbody>
            <tr>
                <td style="padding: 15px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td></td>
                            <td width="600">
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td align="center">
                                            <img src=${logoImg} width="132" height="60" alt="">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 32px;"></td>
                                    </tr>
                                </table>
                                ${autoPublishNote}
                            </td>
                            <td></td>
                        </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td></td>
                            <td width="600">
                                <table bgcolor="#F8F9FB" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-radius: 20px;">
                                    <tr>
                                        <td style="padding: 44px 32px;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                <tr>
                                                    <td align="center">
                                                        <img src=${mainStarIcon} width="96" height="96" alt="">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 24px;"></td>
                                                </tr>
                                                <tr>
                                                    <td align="center" style="font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana;text-align:center;font-size:26px;color:#222222; font-weight: bold;">
                                                        Nicely Done!!!
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 16px;"></td>
                                                </tr>
                                                <tr>
                                                    <td align="center" style="font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana;text-align:center;font-size:18px;color:#222222; font-weight: 600;">
                                                        You have a new ${emailContents.rating}-star review of
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 16px;"></td>
                                                </tr>
                                                <tr>
                                                    <td align="center" style="font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana;text-align:center;font-size:18px;color:#222222; font-weight: 600;">
                                                        <a href="${productUrl}" style="font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana;text-align:center;font-size:18px;color:#222222; font-weight: 600; display: inline-block; vertical-align: top; text-decoration: none; background: #E3E4E5; border-radius: 40px; padding: 12px 44px;">${emailContents.product_title}</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 16px;"></td>
                                                </tr>
                                                <tr>
                                                    <td align="center" style="font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana;text-align:center;font-size:16px;color:#222222; font-weight: 600;">
                                                        From ${emailContents.first_name} ${emailContents.first_name} (<strong>${emailContents.email}</strong>)
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 32px;"></td>
                                                </tr>
                                            </table>
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#FFFFFF" style="border-radius: 10px;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana;font-size:16px;color:#222222; font-weight: 600;">${emailContents.first_name} ${emailContents.first_name} </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding-top: 8px;"></td>
                                                            </tr>
                                                            <tr>
                                                                <td style="font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana;font-size:14px;color:#757575; font-weight: 600;">${emailContents.display_name}.</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding-top: 12px;"></td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                                        <tr>
                                                                            <td width="120"><img style="vertical-align: top;" width="120" height="24" src=${starIcon} alt=""></td>
                                                                            <td width="8"></td>
                                                                            <td width="42" style="background: #2196F3; border-radius: 5px; font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana; text-align: center; color: #FFFFFF;">${emailContents.rating}.0</td>
                                                                            <td></td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="padding-top: 12px;"></td>
                                                            </tr>
                                                         
                                                            <tr>
                                                                <td style="padding-top: 6px;"></td>
                                                            </tr>
                                                            <tr>
                                                                <td style="font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana;font-size:14px;color:#222222; line-height: 1.7;">
                                                                ${emailContents.description}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        ${questionsContent}
                                                        
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding-top: 32px;"></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                <tr>
                                                    ${autoPublishOption}
                                                    <td>
                                                        <a href=${emailContents.shopifyStoreUrl} style="display: inline-block; line-height: 24px; background: #2196F3; border-radius: 50px; padding: 8px 24px; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: bold; font-family:'Manrope', sans-serif, Roboto, arial,tahoma,verdana; vertical-align: top;">View, Reply or Share</a>
                                                    </td>
                                                </tr>
                                            </table>
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
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tbody>
                            <tr>
                                <td></td>
                                <td width="600">
                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                        <tr>
                                            <td height="1" bgcolor="#E3E4E5"></td>
                                        </tr>
                                    </table>
                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="padding-top: 24px;"></td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="font-family:'Manrope', sans-serif,Roboto, arial,tahoma,verdana;text-align:center;font-size:14px;color:#222222">
                                                    This email is sent for <a href="https://${emailContents.shop_domain}" style="font-family:'Manrope', sans-serif,Roboto, arial,tahoma,verdana;text-align:center;font-size:14px;color:#222222;text-decoration:underline">${emailContents.shop_domain}</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top: 12px;"></td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="font-family:'Manrope', sans-serif,Roboto, arial,tahoma,verdana;text-align:center;font-size:14px;color:#2196F3"><a href="${emailContents.unsubscriptionLink}" style="font-family:'Manrope', sans-serif,Roboto, arial,tahoma,verdana;text-align:center;font-size:14px;color:#2196F3;text-decoration:underline">Unsubscribe</a>
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
    
</body>
</html>`;

    return <div dangerouslySetInnerHTML={{ __html: emailHtml }} />;

};

export default EmailTemplate;
