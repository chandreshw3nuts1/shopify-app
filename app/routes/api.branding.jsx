import { json } from "@remix-run/node";
import { findOneRecord, createMetafields } from "./../utils/common";

import fs from "fs";
import path from "path";
import generalAppearances from './../routes/models/generalAppearances';
import emailReviewRequestSettings from './../routes/models/emailReviewRequestSettings';
import emailReviewReplySettings from './../routes/models/emailReviewReplySettings';
import emailDiscountPhotoVideoReviewSettings from './../routes/models/emailDiscountPhotoVideoReviewSettings';
import emailReviewRequestReminderSettings from './../routes/models/emailReviewRequestReminderSettings';
import emailPhotovideoReminderSettings from './../routes/models/emailPhotovideoReminderSettings';
import emailDiscountPhotoVideoReviewReminderSettings from './../routes/models/emailDiscountPhotoVideoReviewReminderSettings';
import emailResendReviewRequestSettings from './../routes/models/emailResendReviewRequestSettings';
import productReviewWidgetCustomizes from './../routes/models/productReviewWidgetCustomizes';
import reviewFormSettings from './../routes/models/reviewFormSettings';
import sidebarReviewWidgetCustomizes from './../routes/models/sidebarReviewWidgetCustomizes';
import floatingWidgetCustomizes from './../routes/models/floatingWidgetCustomizes';
import settingsJson from './../utils/settings.json';

export async function loader() {
    return json({
        name: "loading"
    });
}

export async function action({ params, request }) {
    let requestJson;
    let formData;
    let actionType;
    let shop;
    let subActionType;
    if (request.headers.get('Content-Type') === 'application/json') {
        requestJson = await request.json();
        actionType = requestJson.actionType;
        subActionType = requestJson.subActionType || null;
        shop = requestJson.shop_domain;
    } else {
        formData = await request.formData();
        actionType = formData.get('actionType');
        subActionType = formData.get('subActionType') || null;

        shop = formData.get('shop_domain');
    }

    const method = request.method;
    const shopRecords = await findOneRecord("shop_details", { "shop": shop });
    switch (method) {
        case "POST":
            try {
                const validImageExtensions = settingsJson.validImageExtensions;

                if (actionType == "uploadLogo") {
                    const logo = formData.get("logo");
                    const uploadsDir = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/logo`);
                    fs.mkdirSync(uploadsDir, { recursive: true });
                    const fileName = Date.now() + "-" + logo.name;

                    const fileExtension = fileName.split('.').pop().toLowerCase();
                    if (validImageExtensions.includes(fileExtension)) {
                        const filePath = path.join(uploadsDir, fileName);
                        const buffer = Buffer.from(await logo.arrayBuffer());
                        fs.writeFileSync(filePath, buffer);

                        const res = await generalAppearances.updateOne(
                            { shop_id: shopRecords._id },
                            {
                                $set: {
                                    shop_id: shopRecords._id,
                                    logo: fileName,
                                }
                            },
                            { upsert: true }
                        );

                    }
                    return json({ "status": 200, "message": 'Setting saved', 'logo': fileName });

                } else if (actionType == "uploadEmailBanner") {
                    const actionSubType = formData.get('actionSubType');
                    const language = formData.get('language') ?? "en";

                    const banner = formData.get("banner");
                    const uploadsDir = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/banners`);
                    fs.mkdirSync(uploadsDir, { recursive: true });
                    const fileName = Date.now() + "-" + banner.name;

                    const fileExtension = fileName.split('.').pop().toLowerCase();
                    if (validImageExtensions.includes(fileExtension)) {
                        const filePath = path.join(uploadsDir, fileName);
                        const buffer = Buffer.from(await banner.arrayBuffer());
                        fs.writeFileSync(filePath, buffer);


                        if (actionSubType == "reviewRequest") {
                            const query = { shop_id: shopRecords._id };
                            const OldBannerModel = await emailReviewRequestSettings.findOne(query).select(`shop_id ${language}`);
                            if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                                const deleteFileName = OldBannerModel[language].banner;

                                const deleteFilePath = uploadsDir + "/" + deleteFileName;
                                if (fs.existsSync(deleteFilePath)) {
                                    try {
                                        fs.unlinkSync(deleteFilePath);
                                    } catch (error) {
                                        console.error('Error deleting file:', error);
                                    }
                                }
                            }
                            const update = {
                                $set: {
                                    [`${language}.banner`]: fileName
                                }
                            };
                            const options = { upsert: true };
                            await emailReviewRequestSettings.findOneAndUpdate(query, update, options);

                        } else if (actionSubType == "reviewReply") {
                            const query = { shop_id: shopRecords._id };
                            const OldBannerModel = await emailReviewReplySettings.findOne(query).select(`shop_id ${language}`);
                            if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                                const deleteFileName = OldBannerModel[language].banner;

                                const deleteFilePath = uploadsDir + "/" + deleteFileName;
                                if (fs.existsSync(deleteFilePath)) {
                                    try {
                                        fs.unlinkSync(deleteFilePath);
                                    } catch (error) {
                                        console.error('Error deleting file:', error);
                                    }
                                }
                            }
                            const update = {
                                $set: {
                                    [`${language}.banner`]: fileName
                                }
                            };
                            const options = { upsert: true };
                            await emailReviewReplySettings.findOneAndUpdate(query, update, options);

                        } else if (actionSubType == "discountPhotoVideoReview") {
                            const query = { shop_id: shopRecords._id };
                            const OldBannerModel = await emailDiscountPhotoVideoReviewSettings.findOne(query).select(`shop_id ${language}`);

                            if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                                const deleteFileName = OldBannerModel[language].banner;

                                const deleteFilePath = uploadsDir + "/" + deleteFileName;
                                if (fs.existsSync(deleteFilePath)) {
                                    try {
                                        fs.unlinkSync(deleteFilePath);
                                    } catch (error) {
                                        console.error('Error deleting file:', error);
                                    }
                                }
                            }
                            const update = {
                                $set: {
                                    [`${language}.banner`]: fileName
                                }
                            };
                            const options = { upsert: true };
                            await emailDiscountPhotoVideoReviewSettings.findOneAndUpdate(query, update, options);

                        } else if (actionSubType == "reviewRequestReminder") {
                            const query = { shop_id: shopRecords._id };
                            const OldBannerModel = await emailReviewRequestReminderSettings.findOne(query).select(`shop_id ${language}`);
                            if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                                const deleteFileName = OldBannerModel[language].banner;

                                const deleteFilePath = uploadsDir + "/" + deleteFileName;
                                if (fs.existsSync(deleteFilePath)) {
                                    try {
                                        fs.unlinkSync(deleteFilePath);
                                    } catch (error) {
                                        console.error('Error deleting file:', error);
                                    }
                                }
                            }
                            const update = {
                                $set: {
                                    [`${language}.banner`]: fileName
                                }
                            };
                            const options = { upsert: true };
                            await emailReviewRequestReminderSettings.findOneAndUpdate(query, update, options);

                        } else if (actionSubType == "photoVideoReminder") {
                            const query = { shop_id: shopRecords._id };
                            const OldBannerModel = await emailPhotovideoReminderSettings.findOne(query).select(`shop_id ${language}`);
                            if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                                const deleteFileName = OldBannerModel[language].banner;

                                const deleteFilePath = uploadsDir + "/" + deleteFileName;
                                if (fs.existsSync(deleteFilePath)) {
                                    try {
                                        fs.unlinkSync(deleteFilePath);
                                    } catch (error) {
                                        console.error('Error deleting file:', error);
                                    }
                                }
                            }
                            const update = {
                                $set: {
                                    [`${language}.banner`]: fileName
                                }
                            };
                            const options = { upsert: true };
                            await emailPhotovideoReminderSettings.findOneAndUpdate(query, update, options);

                        } else if (actionSubType == "discountPhotoVideoReviewReminder") {
                            const query = { shop_id: shopRecords._id };
                            const OldBannerModel = await emailDiscountPhotoVideoReviewReminderSettings.findOne(query).select(`shop_id ${language}`);
                            if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                                const deleteFileName = OldBannerModel[language].banner;

                                const deleteFilePath = uploadsDir + "/" + deleteFileName;
                                if (fs.existsSync(deleteFilePath)) {
                                    try {
                                        fs.unlinkSync(deleteFilePath);
                                    } catch (error) {
                                        console.error('Error deleting file:', error);
                                    }
                                }
                            }
                            const update = {
                                $set: {
                                    [`${language}.banner`]: fileName
                                }
                            };
                            const options = { upsert: true };
                            await emailDiscountPhotoVideoReviewReminderSettings.findOneAndUpdate(query, update, options);

                        } else if (actionSubType == "resendReviewRequestReminder") {
                            const query = { shop_id: shopRecords._id };
                            const OldBannerModel = await emailResendReviewRequestSettings.findOne(query).select(`shop_id ${language}`);
                            if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                                const deleteFileName = OldBannerModel[language].banner;

                                const deleteFilePath = uploadsDir + "/" + deleteFileName;
                                if (fs.existsSync(deleteFilePath)) {
                                    try {
                                        fs.unlinkSync(deleteFilePath);
                                    } catch (error) {
                                        console.error('Error deleting file:', error);
                                    }
                                }
                            }
                            const update = {
                                $set: {
                                    [`${language}.banner`]: fileName
                                }
                            };
                            const options = { upsert: true };
                            await emailResendReviewRequestSettings.findOneAndUpdate(query, update, options);

                        }


                    }
                    return json({ "status": 200, "message": 'Banner saved', 'fileName': fileName });

                } else if (actionType == "setDefaultBanner") {
                    const actionSubType = formData.get('actionSubType');
                    const language = formData.get('language') ?? "en";
                    const fileName = "default-banner.png";
                    if (actionSubType == "reviewRequest") {
                        const query = { shop_id: shopRecords._id };

                        const update = {
                            $set: {
                                [`${language}.banner`]: fileName
                            }
                        };
                        const options = { upsert: true };
                        await emailReviewRequestSettings.findOneAndUpdate(query, update, options);

                    } else if (actionSubType == "reviewReply") {
                        const query = { shop_id: shopRecords._id };

                        const update = {
                            $set: {
                                [`${language}.banner`]: fileName
                            }
                        };
                        const options = { upsert: true };
                        await emailReviewReplySettings.findOneAndUpdate(query, update, options);

                    } else if (actionSubType == "discountPhotoVideoReview") {
                        const query = { shop_id: shopRecords._id };

                        const update = {
                            $set: {
                                [`${language}.banner`]: fileName
                            }
                        };
                        const options = { upsert: true };
                        await emailDiscountPhotoVideoReviewSettings.findOneAndUpdate(query, update, options);

                    } else if (actionSubType == "reviewRequestReminder") {
                        const query = { shop_id: shopRecords._id };

                        const update = {
                            $set: {
                                [`${language}.banner`]: fileName
                            }
                        };
                        const options = { upsert: true };
                        await emailReviewRequestReminderSettings.findOneAndUpdate(query, update, options);

                    } else if (actionSubType == "photoVideoReminder") {
                        const query = { shop_id: shopRecords._id };

                        const update = {
                            $set: {
                                [`${language}.banner`]: fileName
                            }
                        };
                        const options = { upsert: true };
                        await emailPhotovideoReminderSettings.findOneAndUpdate(query, update, options);

                    } else if (actionSubType == "discountPhotoVideoReviewReminder") {
                        const query = { shop_id: shopRecords._id };

                        const update = {
                            $set: {
                                [`${language}.banner`]: fileName
                            }
                        };
                        const options = { upsert: true };
                        await emailDiscountPhotoVideoReviewReminderSettings.findOneAndUpdate(query, update, options);

                    } else if (actionSubType == "resendReviewRequestReminder") {
                        const query = { shop_id: shopRecords._id };

                        const update = {
                            $set: {
                                [`${language}.banner`]: fileName
                            }
                        };
                        const options = { upsert: true };
                        await emailResendReviewRequestSettings.findOneAndUpdate(query, update, options);

                    }
                    

                    return json({ "status": 200, "message": 'Banner saved', 'fileName': fileName });

                } else if (actionType == "uploadCommonBanner") {
                    const banner = formData.get("banner");
                    const uploadsDir = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/banners`);
                    fs.mkdirSync(uploadsDir, { recursive: true });
                    const fileName = Date.now() + "-" + banner.name;

                    const fileExtension = fileName.split('.').pop().toLowerCase();
                    if (validImageExtensions.includes(fileExtension)) {
                        const filePath = path.join(uploadsDir, fileName);
                        const buffer = Buffer.from(await banner.arrayBuffer());
                        fs.writeFileSync(filePath, buffer);

                        const res = await generalAppearances.updateOne(
                            { shop_id: shopRecords._id },
                            {
                                $set: {
                                    shop_id: shopRecords._id,
                                    banner: fileName,
                                }
                            },
                            { upsert: true }
                        );

                    }
                    return json({ "status": 200, "message": 'Setting saved', "banner": fileName });

                } else if (actionType == "emailAppearanceSettings") {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestJson.field]: requestJson.value
                        }
                    };
                    const options = { upsert: true };
                    await generalAppearances.findOneAndUpdate(query, update, options);

                    return json({ "status": 200, "message": "Settings saved" });
                } else if (actionType == "updateStarIcon") {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            starIcon: requestJson.value
                        }
                    };
                    const options = { upsert: true };
                    await generalAppearances.findOneAndUpdate(query, update, options);

                    return json({ "status": 200, "message": "Settings saved" });
                } else if (actionType == "updateGeneralAppearance") {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestJson.field]: requestJson.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };

                    await generalAppearances.findOneAndUpdate(query, update, options);

                    return json({ "status": 200, "message": "Settings saved" });
                } else if (actionType == "updateColorCode") {

                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestJson.field]: requestJson.color
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };


                    if (subActionType == "brandingSetting") {
                        await generalAppearances.findOneAndUpdate(query, update, options);
                    } else if (subActionType == "productWidgetCustomize") {
                        await productReviewWidgetCustomizes.findOneAndUpdate(query, update, options);
                    } else if (subActionType == "reviewFormSettings") {
                        await reviewFormSettings.findOneAndUpdate(query, update, options);
                    } else if (subActionType == "sidebarRatingWidgetCustomize") {
                        await sidebarReviewWidgetCustomizes.findOneAndUpdate(query, update, options);
                    } else if (subActionType == "floatingWidgetCustomize") {
                        await floatingWidgetCustomizes.findOneAndUpdate(query, update, options);

                        const floatingWidgetModel = await floatingWidgetCustomizes.findOneAndUpdate(query, update, options);

                        const metafields = {
                            "title": floatingWidgetModel.title,
                            "backgroundColor": floatingWidgetModel.backgroundColor,
                            "textColor": floatingWidgetModel.textColor
                        };
                        await createMetafields(shopRecords.shop, metafields, subActionType);
                    }

                    return json({ "status": 200, "message": "Settings saved " });
                }


            } catch (error) {
                console.error('Error updating record:', error);
                return json({ error: 'Failed to update record' }, { status: 500 });
            }
        case "DELETE":
            try {
                if (actionType == "deleteLogo") {

                    const logoData = await findOneRecord("general_appearances", { "shop_id": shopRecords._id });
                    const res = await generalAppearances.updateOne(
                        { shop_id: shopRecords._id },
                        {
                            $set: {
                                logo: null,
                            }
                        }
                    );


                    const deleteFileName = logoData.logo;
                    const filePath = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/logo`) + "/" + deleteFileName;
                    if (fs.existsSync(filePath)) {
                        try {
                            fs.unlinkSync(filePath);
                        } catch (error) {
                            console.error('Error deleting file:', error);
                        }
                    } else {
                        console.log('File does not exist:', filePath);
                    }
                    return json({ "status": 200, "message": 'Setting saved' });

                } else if (actionType == "deleteCommonBanner") {
                    const defaultCommonBanner = 'default-banner.png';
                    const logoData = await findOneRecord("general_appearances", { "shop_id": shopRecords._id });
                    const res = await generalAppearances.updateOne(
                        { shop_id: shopRecords._id },
                        {
                            $set: {
                                banner: defaultCommonBanner,
                            }
                        }
                    );


                    const deleteFileName = logoData.logo;
                    const filePath = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/banners`) + "/" + deleteFileName;
                    if (fs.existsSync(filePath)) {
                        try {
                            fs.unlinkSync(filePath);
                        } catch (error) {
                            console.error('Error deleting file:', error);
                        }
                    } else {
                        console.log('File does not exist:', filePath);
                    }
                    return json({ "status": 200, "message": 'Setting saved' });

                } else if (actionType == "deleteEmailBanner") {
                    const actionSubType = formData.get('actionSubType');
                    const language = formData.get('language') ?? "en";
                    const query = { shop_id: shopRecords._id };
                    const deletePath = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/banners`) + "/";
                    if (actionSubType == "reviewRequest") {
                        const OldBannerModel = await emailReviewRequestSettings.findOne(query).select(`shop_id ${language}`);
                        if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                            const deleteFileName = OldBannerModel[language].banner;

                            const deleteFilePath = deletePath + deleteFileName;
                            if (fs.existsSync(deleteFilePath)) {
                                try {
                                    fs.unlinkSync(deleteFilePath);
                                } catch (error) {
                                    console.error('Error deleting file:', error);
                                }
                            }
                        }

                        await emailReviewRequestSettings.updateOne(
                            query,
                            {
                                $set: {
                                    [`${language}.banner`]: ""
                                }
                            }
                        );
                    } else if (actionSubType == "reviewReply") {
                        const OldBannerModel = await emailReviewReplySettings.findOne(query).select(`shop_id ${language}`);
                        if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                            const deleteFileName = OldBannerModel[language].banner;

                            const deleteFilePath = deletePath + deleteFileName;
                            if (fs.existsSync(deleteFilePath)) {
                                try {
                                    fs.unlinkSync(deleteFilePath);
                                } catch (error) {
                                    console.error('Error deleting file:', error);
                                }
                            }
                        }

                        await emailReviewReplySettings.updateOne(
                            query,
                            {
                                $set: {
                                    [`${language}.banner`]: ""
                                }
                            }
                        );
                    } else if (actionSubType == "discountPhotoVideoReview") {
                        const OldBannerModel = await emailDiscountPhotoVideoReviewSettings.findOne(query).select(`shop_id ${language}`);
                        if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                            const deleteFileName = OldBannerModel[language].banner;

                            const deleteFilePath = deletePath + deleteFileName;
                            if (fs.existsSync(deleteFilePath)) {
                                try {
                                    fs.unlinkSync(deleteFilePath);
                                } catch (error) {
                                    console.error('Error deleting file:', error);
                                }
                            }
                        }

                        await emailDiscountPhotoVideoReviewSettings.updateOne(
                            query,
                            {
                                $set: {
                                    [`${language}.banner`]: ""
                                }
                            }
                        );
                    } else if (actionSubType == "reviewRequestReminder") {
                        const OldBannerModel = await emailReviewRequestReminderSettings.findOne(query).select(`shop_id ${language}`);
                        if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                            const deleteFileName = OldBannerModel[language].banner;

                            const deleteFilePath = deletePath + deleteFileName;
                            if (fs.existsSync(deleteFilePath)) {
                                try {
                                    fs.unlinkSync(deleteFilePath);
                                } catch (error) {
                                    console.error('Error deleting file:', error);
                                }
                            }
                        }

                        await emailReviewRequestReminderSettings.updateOne(
                            query,
                            {
                                $set: {
                                    [`${language}.banner`]: ""
                                }
                            }
                        );
                    } else if (actionSubType == "photoVideoReminder") {
                        const OldBannerModel = await emailPhotovideoReminderSettings.findOne(query).select(`shop_id ${language}`);
                        if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                            const deleteFileName = OldBannerModel[language].banner;

                            const deleteFilePath = deletePath + deleteFileName;
                            if (fs.existsSync(deleteFilePath)) {
                                try {
                                    fs.unlinkSync(deleteFilePath);
                                } catch (error) {
                                    console.error('Error deleting file:', error);
                                }
                            }
                        }

                        await emailPhotovideoReminderSettings.updateOne(
                            query,
                            {
                                $set: {
                                    [`${language}.banner`]: ""
                                }
                            }
                        );
                    } else if (actionSubType == "discountPhotoVideoReviewReminder") {
                        const OldBannerModel = await emailDiscountPhotoVideoReviewReminderSettings.findOne(query).select(`shop_id ${language}`);
                        if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                            const deleteFileName = OldBannerModel[language].banner;

                            const deleteFilePath = deletePath + deleteFileName;
                            if (fs.existsSync(deleteFilePath)) {
                                try {
                                    fs.unlinkSync(deleteFilePath);
                                } catch (error) {
                                    console.error('Error deleting file:', error);
                                }
                            }
                        }

                        await emailDiscountPhotoVideoReviewReminderSettings.updateOne(
                            query,
                            {
                                $set: {
                                    [`${language}.banner`]: ""
                                }
                            }
                        );
                    } else if (actionSubType == "resendReviewRequestReminder") {
                        const OldBannerModel = await emailResendReviewRequestSettings.findOne(query).select(`shop_id ${language}`);
                        if (OldBannerModel && OldBannerModel[language] && OldBannerModel[language].banner) {
                            const deleteFileName = OldBannerModel[language].banner;

                            const deleteFilePath = deletePath + deleteFileName;
                            if (fs.existsSync(deleteFilePath)) {
                                try {
                                    fs.unlinkSync(deleteFilePath);
                                } catch (error) {
                                    console.error('Error deleting file:', error);
                                }
                            }
                        }

                        await emailResendReviewRequestSettings.updateOne(
                            query,
                            {
                                $set: {
                                    [`${language}.banner`]: ""
                                }
                            }
                        );
                    }

                    return json({ "status": 200, "message": 'Banner deleted' });

                }
            } catch (error) {
                console.error('Error updating record:', error);
                return json({ error: 'Failed to update record' }, { status: 500 });
            }
        default:

            return json({ "message": "", "method": "POST" });

    }
}