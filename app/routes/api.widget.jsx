import { json } from "@remix-run/node";
import { ObjectId } from 'mongodb';
import ReactDOMServer from 'react-dom/server';
import ProductReviewWidget from './components/widget-components/product-review-widget';
import WidgetModalRviews from './components/widget-components/widget-modal-reviews';
import CreateReviewModalWidget from './components/widget-components/create-review-modal-widget';
import ReviewDetailModalWidget from './components/widget-components/review-detail-modal-widget';
import RatingWidget from './components/widget-components/rating-widget';
import AllReviewWidget from './components/widget-components/all-review-counter-widget';
import SidebarRatingWidget from './components/widget-components/sidebar-rating-widget';
import PopupModalWidget from './components/widget-components/popup-modal-widget';
import VideoSliderWidget from './components/widget-components/video-slider-widget';
import VideoSliderError from './components/widget-components/video-slider-error';
import GalleyCarouselWidget from './components/widget-components/galley-carousel-widget';
import TestimonialsCarouselWidget from './components/widget-components/testimonials-carousel-widget';
import CardCarouselWidget from './components/widget-components/card-carousel-widget';
import SnippetWidget from './components/widget-components/snippet-widget';

import { getShopDetailsByShop, findOneRecord, getCustomQuestions } from './../utils/common';
import { mongoConnection } from './../utils/mongoConnection';
import productReviews from "./models/productReviews";
import generalAppearances from "./models/generalAppearances";
import generalSettings from "./models/generalSettings";
import productReviewWidgetCustomizes from "./models/productReviewWidgetCustomizes";
import reviewFormSettings from "./models/reviewFormSettings";
import sidebarReviewWidgetCustomizes from "./models/sidebarReviewWidgetCustomizes";
import floatingWidgetCustomizes from "./models/floatingWidgetCustomizes";
import popupModalWidgetCustomizes from "./models/popupModalWidgetCustomizes";
import productGroups from './models/productGroups';


import { getShopifyProducts, getDiscounts } from "./../utils/common";
import { ratingbabycloth, ratingbasket, ratingbones, ratingcoffeecup, ratingcrisamascap, ratingdiamondfront, ratingdiamondtop, ratingdogsleg, ratingfireflame, ratingflight, ratingfood, ratinggraduationcap, ratingheartround, ratingheartsq, ratingleafcanada, ratingleafnormal, ratinglikenormal, ratinglikerays, ratingpethouse, ratingplant, ratingshirt, ratingshoppingbag1, ratingshoppingbag2, ratingshoppingbag3, ratingstarrays, ratingstarrounded, ratingstarsq, ratingsunglass, ratingteacup, ratingtrophy1, ratingtrophy2, ratingtrophy3, ratingtshirt, ratingwine } from './../routes/components/icons/CommonIcons';
import settingsJson from './../utils/settings.json';


export async function loader() {

    return json({

    });
}

export async function action({ request }) {

    try {
        const formData = await request.formData();
        const actionType = formData.get('actionType');
        const shop = formData.get('shop_domain');
        const shopRecords = await getShopDetailsByShop(shop);
        const blockId = formData.get('block_id') != null ? "-" + formData.get('block_id') : "";

        const generalSettingsModel = await generalSettings.findOne({ shop_id: shopRecords._id });

        shopRecords.reviewers_name_format = generalSettingsModel.reviewers_name_format;
        shopRecords.verified_review_style = generalSettingsModel.verified_review_style;
        shopRecords.is_enable_import_from_external_source = generalSettingsModel.is_enable_import_from_external_source;
        shopRecords.is_enable_marked_verified_by_store_owner = generalSettingsModel.is_enable_marked_verified_by_store_owner;
        shopRecords.is_enable_review_written_by_site_visitor = generalSettingsModel.is_enable_review_written_by_site_visitor;
        shopRecords.is_enable_review_not_verified = generalSettingsModel.is_enable_review_not_verified;
        shopRecords.is_enable_future_purchase_discount = generalSettingsModel.is_enable_future_purchase_discount;

        var customer_locale = formData.get('customer_locale') || generalSettingsModel.defaul_language;
        const shopSessionRecords = await findOneRecord("shopify_sessions", { shop: shop });
        const generalAppearancesModel = await generalAppearances.findOne({
            shop_id: shopRecords._id
        });

        /* Fetch transation languge*/
        if (customer_locale == 'zh-CN') {
            customer_locale = 'cn1';
        } else if (customer_locale == 'zh-TW') {
            customer_locale = 'cn2';
        }

        const language = settingsJson.languages.find(language => language.code === customer_locale);
        customer_locale = language ? language.code : generalSettingsModel.defaul_language;

        const apiUrl = `${settingsJson.host_url}/locales/${customer_locale}/translation.json`;
        const lang = await fetch(apiUrl, {
            method: 'GET'
        });
        const translations = await lang.json();
        /* Fetch transation languge End*/

        const productReviewWidgetCustomizesModel = await productReviewWidgetCustomizes.findOne({ shop_id: shopRecords._id });
        const languageWiseProductWidgetSettings = productReviewWidgetCustomizesModel[customer_locale] ? productReviewWidgetCustomizesModel[customer_locale] : {};
        const otherProps = {
            translations,
            productReviewWidgetCustomizesModel,
            languageWiseProductWidgetSettings,
            generalSettingsModel,
            settingsJson
        }

        const StarIcon = generalAppearancesModel.starIcon.replace(/-/g, '');
        const iconComponents = {
            ratingbabycloth, ratingbasket, ratingbones, ratingcoffeecup, ratingcrisamascap, ratingdiamondfront, ratingdiamondtop, ratingdogsleg, ratingfireflame, ratingflight, ratingfood, ratinggraduationcap, ratingheartround, ratingheartsq, ratingleafcanada, ratingleafnormal, ratinglikenormal, ratinglikerays, ratingpethouse, ratingplant, ratingshirt, ratingshoppingbag1, ratingshoppingbag2, ratingshoppingbag3, ratingstarrays, ratingstarrounded, ratingstarsq, ratingsunglass, ratingteacup, ratingtrophy1, ratingtrophy2, ratingtrophy3, ratingtshirt, ratingwine
        };
        const IconComponent = iconComponents[StarIcon] || ratingstarrounded;


        if (actionType == "openModal") {
            try {
                const customQuestionsData = await getCustomQuestions({
                    shop_id: shopRecords._id,
                });



                const reviewFormSettingsModel = await reviewFormSettings.findOne({ shop_id: shopRecords._id });
                if (reviewFormSettingsModel) {
                    const languageWiseReviewFormSettings = reviewFormSettingsModel[customer_locale] ? reviewFormSettingsModel[customer_locale] : {};
                    otherProps['reviewFormSettingsModel'] = reviewFormSettingsModel;
                    otherProps['languageWiseReviewFormSettings'] = languageWiseReviewFormSettings;
                }

                const discountObj = await getDiscounts(shopRecords);
                const paramObj = {
                    cust_first_name: formData.get('cust_first_name'),
                    cust_last_name: formData.get('cust_last_name'),
                    cust_email: formData.get('cust_email'),
                    discountObj: discountObj
                }
                const dynamicModalComponent = <CreateReviewModalWidget shopRecords={shopRecords} customQuestionsData={customQuestionsData} paramObj={paramObj} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} otherProps={otherProps} />;
                const htmlModalContent = ReactDOMServer.renderToString(dynamicModalComponent);
                return json({
                    htmlModalContent: htmlModalContent
                });
            } catch (error) {
                console.log(error);
                return json({
                    error
                });
            }
        } else if (actionType == "openReviewDetailModal") {
            try {

                const reviewId = new ObjectId(formData.get('reviewId'));

                const reviewQuery = {
                    _id: reviewId,
                };
                const reviewItems = await productReviews.aggregate([
                    {
                        $match: reviewQuery
                    },
                    {
                        $lookup: {
                            from: 'review_documents',
                            localField: '_id',
                            foreignField: 'review_id',
                            as: 'reviewDocuments'
                        }
                    },
                    {
                        $lookup: {
                            from: 'product_review_questions',
                            localField: '_id',
                            foreignField: 'review_id',
                            as: 'reviewQuestionsAnswer'
                        }
                    },
                    {
                        $unwind: {
                            path: "$reviewQuestionsAnswer",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "custom_questions",
                            localField: "reviewQuestionsAnswer.question_id",
                            foreignField: "_id",
                            as: "reviewQuestionsAnswer.reviewQuestions"
                        }
                    },
                    {
                        $unwind: {
                            path: "$reviewQuestionsAnswer.reviewQuestions",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            description: { $first: "$description" },
                            rating: { $first: "$rating" },
                            first_name: { $first: "$first_name" },
                            display_name: { $first: "$display_name" },
                            email: { $first: "$email" },
                            last_name: { $first: "$last_name" },
                            createdAt: { $first: "$createdAt" },
                            status: { $first: "$status" },
                            replyText: { $first: "$replyText" },
                            variant_title: { $first: "$variant_title" },
                            product_id: { $first: "$product_id" },
                            tag_as_feature: { $first: "$tag_as_feature" },
                            verify_badge: { $first: "$verify_badge" },
                            is_imported: { $first: "$is_imported" },
                            reviewDocuments: { $first: "$reviewDocuments" }, // Use $first to avoid duplicates
                            reviewQuestionsAnswer: {
                                $push: {
                                    _id: "$reviewQuestionsAnswer._id",
                                    review_id: "$reviewQuestionsAnswer.review_id",
                                    answer: "$reviewQuestionsAnswer.answer",
                                    question_name: "$reviewQuestionsAnswer.question_name",
                                    question_id: "$reviewQuestionsAnswer.question_id",
                                    createdAt: "$reviewQuestionsAnswer.createdAt",
                                    deletedAt: "$reviewQuestionsAnswer.deletedAt",
                                    reviewQuestions: {
                                        _id: "$reviewQuestionsAnswer.reviewQuestions._id",
                                        question: "$reviewQuestionsAnswer.reviewQuestions.question",
                                        isHideAnswers: "$reviewQuestionsAnswer.reviewQuestions.isHideAnswers",
                                        createdAt: "$reviewQuestionsAnswer.reviewQuestions.createdAt"
                                    }
                                }
                            }
                        }
                    },
                    {
                        $addFields: {
                            reviewDocuments: {
                                $sortArray: {
                                    input: "$reviewDocuments",
                                    sortBy: { is_cover: -1 }
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            description: 1,
                            rating: 1,
                            first_name: 1,
                            display_name: 1,
                            email: 1,
                            last_name: 1,
                            createdAt: 1,
                            status: 1,
                            images: 1,
                            replyText: 1,
                            variant_title: 1,
                            product_id: 1,
                            is_review_request: 1,
                            tag_as_feature: 1,
                            verify_badge: 1,
                            is_imported: 1,
                            reviewDocuments: {
                                $filter: {
                                    input: "$reviewDocuments",
                                    as: "doc",
                                    cond: { $eq: ["$$doc.is_approve", true] }
                                }
                            },
                            reviewQuestionsAnswer: {
                                $filter: {
                                    input: "$reviewQuestionsAnswer",
                                    as: "item",
                                    cond: {
                                        $and: [
                                            { $ne: ["$$item._id", null] },
                                            { $eq: ["$$item.deletedAt", null] }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                ]);

                const reviewDetails = reviewItems[0];
                const productId = `"gid://shopify/Product/${reviewDetails.product_id}"`;
                var productsDetails = await getShopifyProducts(shopRecords.myshopify_domain, productId);

                const hideProductThumbnails = formData.get('hide_product_thumbnails') || 'false';

                const formParams = {
                    hideProductThumbnails: hideProductThumbnails,
                }
                const dynamicComponent = <ReviewDetailModalWidget shopRecords={shopRecords} reviewDetails={reviewDetails} productsDetails={productsDetails} formParams={formParams} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} otherProps={otherProps} />;
                const htmlContent = ReactDOMServer.renderToString(dynamicComponent);
                return json({
                    body: htmlContent,
                });


            } catch (error) {
                console.log(error);
                return json({
                    error
                });
            }
        } else if (actionType == "reviewRatingWidget") {
            try {
                const product_id = parseInt(formData.get('product_id'));
                const font_size = formData.get('font_size');
                const widget_text_color = formData.get('widget_text_color');
                const widget_icon_color = formData.get('widget_icon_color');
                const show_all_reviews = formData.get('show_all_reviews');
                const widget_text = formData.get('widget_text');
                const widget_alignment = formData.get('widget_alignment');
                const widget_layout = formData.get('widget_layout');
                const open_float_reviews = formData.get('open_float_reviews');
                const show_empty_stars = formData.get('show_empty_stars');

                const hide_text = formData.get('hide_text');

                const query = {
                    shop_id: shopRecords._id,
                    status: 'publish',
                };
                if (show_all_reviews == 'false' && product_id != "") {
                    query['product_id'] = product_id;
                }
                const countRating = await productReviews.aggregate([
                    { $match: query },
                    { $group: { _id: "$rating", count: { $sum: 1 } } }
                ])
                var mapRatting = countRating.map(item => ({
                    stars: item._id,
                    count: item.count
                }));

                const totalReviews = mapRatting.reduce((acc, item) => acc + item.count, 0);
                var averageRating = Math.round((mapRatting.reduce((acc, item) => acc + item.stars * item.count, 0) / totalReviews).toFixed(1));
                if (isNaN(averageRating)) {
                    averageRating = 0;
                }
                const formParams = {
                    totalReviews,
                    averageRating,
                    font_size,
                    widget_text_color,
                    widget_icon_color,
                    hide_text,
                    open_float_reviews,
                    widget_layout,
                    widget_alignment,
                    widget_text,
                    show_empty_stars,
                    blockId
                }
                const dynamicRatingComponent = <RatingWidget formParams={formParams} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} />;
                const htmlRatingContent = ReactDOMServer.renderToString(dynamicRatingComponent);
                return json({
                    htmlRatingContent: htmlRatingContent
                });

            } catch (error) {
                console.log(error);
                return json({
                    error
                });
            }
        } else if (actionType == "allReviewCounterWidget") {
            try {
                const product_id = parseInt(formData.get('product_id'));
                const font_size = formData.get('font_size');
                const widget_text_color = formData.get('widget_text_color');
                const widget_icon_color = formData.get('widget_icon_color');
                const widget_text = formData.get('widget_text');
                const widget_alignment = formData.get('widget_alignment');
                const widget_layout = formData.get('widget_layout');
                const open_float_reviews = formData.get('open_float_reviews');
                const border_radius = formData.get('border_radius');
                const show_branding = formData.get('show_branding');
                const show_rating = formData.get('show_rating');
                const show_rating_icon = formData.get('show_rating_icon');
                const show_review = formData.get('show_review');
                const widget_background_color = formData.get('widget_background_color');
                const widget_border_color = formData.get('widget_border_color');
                const widget_secondary_background_color = formData.get('widget_secondary_background_color');
                const widget_secondary_text_color = formData.get('widget_secondary_text_color');


                const hide_text = formData.get('hide_text');

                const query = {
                    shop_id: shopRecords._id,
                    status: 'publish',
                };

                const countRating = await productReviews.aggregate([
                    { $match: query },
                    { $group: { _id: "$rating", count: { $sum: 1 } } }
                ])
                var mapRatting = countRating.map(item => ({
                    stars: item._id,
                    count: item.count
                }));

                const totalReviews = mapRatting.reduce((acc, item) => acc + item.count, 0);
                var averageRating = Math.round((mapRatting.reduce((acc, item) => acc + item.stars * item.count, 0) / totalReviews).toFixed(1));
                var displayRverageRating = ((mapRatting.reduce((acc, item) => acc + item.stars * item.count, 0) / totalReviews).toFixed(1));

                if (isNaN(averageRating)) {
                    averageRating = 0;
                    displayRverageRating = 0.0;
                }
                const formParams = {
                    totalReviews,
                    averageRating,
                    displayRverageRating,
                    font_size,
                    widget_text_color,
                    widget_icon_color,
                    open_float_reviews,
                    widget_layout,
                    widget_alignment,
                    widget_text,
                    border_radius,
                    show_branding,
                    show_rating_icon,
                    show_rating,
                    show_review,
                    widget_background_color,
                    widget_border_color,
                    widget_secondary_background_color,
                    widget_secondary_text_color,
                    blockId
                }

                const dynamicRatingComponent = <AllReviewWidget formParams={formParams} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} />;
                const htmlRatingContent = ReactDOMServer.renderToString(dynamicRatingComponent);
                return json({
                    htmlRatingContent: htmlRatingContent
                });

            } catch (error) {
                console.log(error);
                return json({
                    error
                });
            }
        } else if (actionType == "videoSliderWidget") {
            try {
                const selected_reviews = formData.get('selected_reviews');
                const border_radius = formData.get('border_radius');
                const show_rating_icon = formData.get('show_rating_icon');
                const show_name = formData.get('show_name');
                const hide_arrow_mobile = formData.get('hide_arrow_mobile');
                const widget_text_color = formData.get('widget_text_color');
                const widget_icon_color = formData.get('widget_icon_color');
                const play_button_color = formData.get('play_button_color');
                const show_border = formData.get('show_border');
                const border_color = formData.get('border_color');
                const border_width = formData.get('border_width');
                const is_editing = formData.get('is_editing') || false;

                const sortOption = {};
                sortOption["createdAt"] = -1;
                sortOption["_id"] = -1;

                let query = {
                    shop_id: shopRecords._id,
                    status: 'publish',
                };

                if (selected_reviews == 'true') {
                    query["video_slider"] = true;
                }
                const reviewItems = await productReviews.aggregate([
                    {
                        $match: query
                    },
                    {
                        $lookup: {
                            from: 'review_documents',
                            localField: '_id',
                            foreignField: 'review_id',
                            as: 'reviewDocuments'
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            rating: { $first: "$rating" },
                            first_name: { $first: "$first_name" },
                            display_name: { $first: "$display_name" },
                            last_name: { $first: "$last_name" },
                            createdAt: { $first: "$createdAt" },
                            product_id: { $first: "$product_id" },
                            verify_badge: { $first: "$verify_badge" },
                            reviewDocuments: { $first: "$reviewDocuments" }, // Use $first to avoid duplicates
                        }
                    },
                    {
                        $sort: sortOption
                    },

                    {
                        $project: {
                            _id: 1,
                            rating: 1,
                            first_name: 1,
                            display_name: 1,
                            last_name: 1,
                            createdAt: 1,
                            product_id: 1,
                            verify_badge: 1,
                            reviewDocuments: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$reviewDocuments",
                                            as: "doc",
                                            cond: {
                                                $and: [
                                                    { $eq: ["$$doc.is_approve", true] },
                                                    { $eq: ["$$doc.is_cover", true] }
                                                ]
                                            }
                                        }
                                    },
                                    0
                                ]
                            },
                        }
                    },
                    {
                        $match: {
                            reviewDocuments: { $ne: null }
                        }
                    }
                ]);

                const formParams = {
                    selected_reviews,
                    border_radius,
                    show_rating_icon,
                    show_name,
                    hide_arrow_mobile,
                    widget_text_color,
                    widget_icon_color,
                    play_button_color,
                    show_border,
                    border_color,
                    border_width,
                    blockId
                }

                if (is_editing == 'true' && reviewItems.length < 3) {
                    const dynamicComponent = <VideoSliderError />;
                    const content = ReactDOMServer.renderToString(dynamicComponent);
                    return json({
                        content: content
                    });
                } else if (reviewItems.length >= 3) {
                    const dynamicComponent = <VideoSliderWidget shopRecords={shopRecords} formParams={formParams} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} reviewItems={reviewItems} />;
                    const content = ReactDOMServer.renderToString(dynamicComponent);
                    return json({
                        content: content
                    });
                }
                return json({
                    content: ""
                });

            } catch (error) {
                console.log(error);
                return json({
                    error
                });
            }
        } else if (actionType == "snippetWidget") {
            try {
                const widget_alignment = formData.get('widget_alignment');
                const widget_width = formData.get('widget_width');
                const no_display_reviews = parseInt(formData.get('no_display_reviews'));
                const show_rating_icon = formData.get('show_rating_icon');
                const show_review_image = formData.get('show_review_image');
                const hide_arrow_mobile = formData.get('hide_arrow_mobile');
                const font_size = formData.get('font_size');
                const no_of_chars = formData.get('no_of_chars');
                const show_border = formData.get('show_border');
                const border_radius = formData.get('border_radius');
                const background_color = formData.get('background_color');
                const text_color = formData.get('text_color');
                const reviewer_name_color = formData.get('reviewer_name_color');
                const widget_icon_color = formData.get('widget_icon_color');
                const border_color = formData.get('border_color');
                const productId = parseInt(formData.get('product_id'));

                const reviewItems = await getImageAndVideoForCarousel(shopRecords, no_display_reviews, productId);
                console.log(reviewItems);
                const formParams = {
                    widget_alignment,
                    widget_width,
                    no_display_reviews,
                    show_rating_icon,
                    show_review_image,
                    hide_arrow_mobile,
                    font_size,
                    no_of_chars,
                    show_border,
                    border_radius,
                    background_color,
                    text_color,
                    reviewer_name_color,
                    widget_icon_color,
                    border_color,
                    blockId
                }


                const dynamicComponent = <SnippetWidget shopRecords={shopRecords} formParams={formParams} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} reviewItems={reviewItems} />;
                const content = ReactDOMServer.renderToString(dynamicComponent);
                return json({
                    content: content
                });

            } catch (error) {
                console.log(error);
                return json({
                    error
                });
            }
        } else if (actionType == "galleryCarouselWidget") {
            try {
                const reviewer_name_color = formData.get('reviewer_name_color');
                const border_radius = formData.get('border_radius');
                const widget_icon_color = formData.get('widget_icon_color');
                const arrow_icon_color = formData.get('arrow_icon_color');
                const arrow_bg_color = formData.get('arrow_bg_color');
                const show_border = formData.get('show_border');
                const border_color = formData.get('border_color');
                const border_width = formData.get('border_width');

                const formParams = {
                    reviewer_name_color,
                    show_border,
                    widget_icon_color,
                    border_radius,
                    arrow_icon_color,
                    border_color,
                    arrow_bg_color,
                    border_width,
                    blockId
                }

                const reviewItems = await getImageAndVideoForCarousel(shopRecords);
                const dynamicComponent = <GalleyCarouselWidget shopRecords={shopRecords} formParams={formParams} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} reviewItems={reviewItems} />;
                const content = ReactDOMServer.renderToString(dynamicComponent);
                return json({
                    content: content
                });

            } catch (error) {
                console.log(error);
                return json({
                    error
                });
            }
        } else if (actionType == "cardCarouselWidget") {
            try {


                const reviewer_name_color = formData.get('reviewer_name_color');
                const border_radius = formData.get('border_radius');
                const widget_icon_color = formData.get('widget_icon_color');
                const arrow_icon_color = formData.get('arrow_icon_color');
                const arrow_bg_color = formData.get('arrow_bg_color');
                const show_border = formData.get('show_border');
                const border_color = formData.get('border_color');
                const border_width = formData.get('border_width');
                const no_of_chars = formData.get('no_of_chars');
                const text_color = formData.get('text_color');
                const text_bg_color = formData.get('text_bg_color');
                const widget_bg_icon_color = formData.get('widget_bg_icon_color');

                const formParams = {
                    reviewer_name_color,
                    show_border,
                    widget_icon_color,
                    border_radius,
                    arrow_icon_color,
                    border_color,
                    arrow_bg_color,
                    border_width,
                    no_of_chars,
                    text_color,
                    text_bg_color,
                    widget_bg_icon_color,
                    blockId
                }

                const reviewItems = await getImageAndVideoForCarousel(shopRecords);


                const dynamicComponent = <CardCarouselWidget shopRecords={shopRecords} formParams={formParams} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} reviewItems={reviewItems} />;
                const content = ReactDOMServer.renderToString(dynamicComponent);
                return json({
                    content: content
                });

            } catch (error) {
                console.log(error);
                return json({
                    error
                });
            }
        } else if (actionType == "testimonialsCarouselWidget") {
            try {
                const font_size = formData.get('font_size');
                const no_of_chars = formData.get('no_of_chars');
                const quote_marks_icon_style = formData.get('quote_marks_icon_style');
                const reviewer_name_color = formData.get('reviewer_name_color');
                const text_color = formData.get('text_color');
                const widget_icon_color = formData.get('widget_icon_color');
                const quotes_icon_color = formData.get('quotes_icon_color');
                const arrow_icon_color = formData.get('arrow_icon_color');
                const hide_arrow_mobile = formData.get('hide_arrow_mobile');
                const show_pagination_dots = formData.get('show_pagination_dots');
                const selected_dot_color = formData.get('selected_dot_color');
                const dot_background_color = formData.get('dot_background_color');

                const sortOption = {};
                sortOption["createdAt"] = -1;
                sortOption["_id"] = -1;

                let query = {
                    shop_id: shopRecords._id,
                    status: 'publish',
                    add_to_carousel: true
                };

                const reviewItems = await productReviews.aggregate([
                    {
                        $match: query
                    },
                    {
                        $group: {
                            _id: "$_id",
                            rating: { $first: "$rating" },
                            first_name: { $first: "$first_name" },
                            display_name: { $first: "$display_name" },
                            last_name: { $first: "$last_name" },
                            description: { $first: "$description" },
                            createdAt: { $first: "$createdAt" },
                            product_id: { $first: "$product_id" },
                            verify_badge: { $first: "$verify_badge" }
                        }
                    },
                    {
                        $sort: sortOption
                    },
                    {
                        $project: {
                            _id: 1,
                            rating: 1,
                            first_name: 1,
                            display_name: 1,
                            last_name: 1,
                            description: 1,
                            createdAt: 1,
                            product_id: 1,
                            verify_badge: 1

                        }
                    }
                ]);

                const formParams = {
                    font_size,
                    no_of_chars,
                    quote_marks_icon_style,
                    reviewer_name_color,
                    text_color,
                    widget_icon_color,
                    quotes_icon_color,
                    arrow_icon_color,
                    hide_arrow_mobile,
                    show_pagination_dots,
                    selected_dot_color,
                    dot_background_color,
                    blockId
                }

                const dynamicComponent = <TestimonialsCarouselWidget shopRecords={shopRecords} formParams={formParams} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} reviewItems={reviewItems} />;
                const content = ReactDOMServer.renderToString(dynamicComponent);
                return json({
                    content: content
                });

            } catch (error) {
                console.log(error);
                return json({
                    error
                });
            }
        } else if (actionType == "sidebarRatingWidget") {
            try {


                const sidebarReviewWidgetCustomizesModel = await sidebarReviewWidgetCustomizes.findOne({
                    shop_id: shopRecords._id
                });

                let dynamicClass = "";
                if (sidebarReviewWidgetCustomizesModel.widgetPosition == 'left') {
                    dynamicClass = sidebarReviewWidgetCustomizesModel.widgetOrientation == 'btt' ? 'leftside bottomtotop' : 'leftside';
                } else {
                    dynamicClass = sidebarReviewWidgetCustomizesModel.widgetOrientation == 'btt' ? 'rightside bottomtotop' : 'rightside';

                }
                const dynamicSidebarRatingComponent = <SidebarRatingWidget sidebarReviewWidgetCustomizesModel={sidebarReviewWidgetCustomizesModel} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} settingsJson={settingsJson} />;
                const htmlSidebrRatingContent = ReactDOMServer.renderToString(dynamicSidebarRatingComponent);
                return json({
                    content: htmlSidebrRatingContent,
                    class: dynamicClass
                });

            } catch (error) {
                console.log(error);
                return json({
                    error
                });
            }
        } else if (actionType == "popupModalWidget") {
            try {

                const popupModalWidgetCustomizesModel = await popupModalWidgetCustomizes.findOne({ shop_id: shopRecords._id });

                let query = {
                    shop_id: shopRecords._id,
                    status: 'publish'
                };

                if (popupModalWidgetCustomizesModel.minimumRatingDisplay != "all") {
                    query['rating'] = parseInt(popupModalWidgetCustomizesModel.minimumRatingDisplay);
                }
                const sortOption = {
                    createdAt: -1,
                    _id: -1
                };
                const aggregationPipeline = [
                    {
                        $match: query
                    },
                    {
                        $lookup: {
                            from: 'review_documents',
                            localField: '_id',
                            foreignField: 'review_id',
                            as: 'reviewDocuments'
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            rating: { $first: "$rating" },
                            first_name: { $first: "$first_name" },
                            display_name: { $first: "$display_name" },
                            last_name: { $first: "$last_name" },
                            description: { $first: "$description" },
                            createdAt: { $first: "$createdAt" },
                            product_id: { $first: "$product_id" },
                            verify_badge: { $first: "$verify_badge" },
                            reviewDocuments: { $first: "$reviewDocuments" } // Use $first to avoid duplicates
                        }
                    },
                    {
                        $sort: sortOption
                    },
                    {
                        $project: {
                            _id: 1,
                            rating: 1,
                            first_name: 1,
                            display_name: 1,
                            last_name: 1,
                            description: 1,
                            createdAt: 1,
                            product_id: 1,
                            verify_badge: 1,
                            reviewDocuments: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$reviewDocuments",
                                            as: "doc",
                                            cond: {
                                                $and: [
                                                    { $eq: ["$$doc.is_approve", true] },
                                                    { $eq: ["$$doc.is_cover", true] }
                                                ]
                                            }
                                        }
                                    },
                                    0
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            reviewDocuments: { $ne: null }
                        }
                    },
                    {
                        $limit: parseInt(popupModalWidgetCustomizesModel.maximumPerPage > 0 ? popupModalWidgetCustomizesModel.maximumPerPage : settingsJson.page_limit)
                    }
                ];

                const reviewItems = await productReviews.aggregate(aggregationPipeline);
                var mapProductDetails = {};

                if (reviewItems.length > 0) {
                    const uniqueProductIds = [...new Set(reviewItems.map(item => item.product_id))];

                    const productIds = uniqueProductIds.map((item) => `"gid://shopify/Product/${item}"`);
                    var productsDetails = await getShopifyProducts(shopRecords.myshopify_domain, productIds);

                    if (productsDetails.length > 0) {
                        productsDetails.forEach(node => {
                            if (node) {
                                const id = node.id.split('/').pop();
                                mapProductDetails[id] = node;
                            }

                        });
                    }

                }

                reviewItems.map(items => {
                    items.productDetails = mapProductDetails[items.product_id];
                    return items;
                });


                const dynamicPopupModalComponent = <PopupModalWidget shopRecords={shopRecords} popupModalWidgetCustomizesModel={popupModalWidgetCustomizesModel} reviewItems={reviewItems} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} settingsJson={settingsJson} />;
                const htmlPopupModalContent = ReactDOMServer.renderToString(dynamicPopupModalComponent);
                return json({
                    content: htmlPopupModalContent
                });

            } catch (error) {
                console.log(error);
                return json({
                    content: ""
                });
            }
        } else {

            const limit = formData.get('no_of_review') != null ? parseInt(formData.get('no_of_review')) : parseInt(settingsJson.page_limit);
            const page = parseInt(formData.get('page'));
            const sortBy = formData.get('sort_by') != null ? formData.get('sort_by') : productReviewWidgetCustomizesModel.defaultSorting;
            const filterByRatting = parseInt(formData.get('filter_by_ratting'));
            const productId = parseInt(formData.get('product_id'));
            const showImageReviews = formData.get('show_image_reviews');
            const showAllReviews = formData.get('show_all_reviews');
            const hideProductThumbnails = formData.get('hide_product_thumbnails');
            const is_modal_reviews = formData.get('is_modal_reviews');

            let sortByfield = "tag_as_feature";
            let sortByValue = -1;
            if (sortBy == 'featured') {
                sortByfield = "tag_as_feature";
                sortByValue = 1;
            } else if (sortBy == 'newest') {
                sortByfield = "createdAt";
                sortByValue = -1;
            } else if (sortBy == 'highest_ratings') {
                sortByfield = "rating";
                sortByValue = -1;
            } else if (sortBy == 'lowest_ratings') {
                sortByfield = "rating";
                sortByValue = 1;
            }

            const sortOption = {};
            sortOption[sortByfield] = sortByValue;
            sortOption["_id"] = -1;
            const query = {
                shop_id: shopRecords._id,
                status: 'publish',
            };
            if (showAllReviews == 'false' && productId != "") {
                let uniqProductIds = [productId];
                if (is_modal_reviews == null) {

                    const productGroupsResult = await productGroups.aggregate([
                        {
                            $match: {
                                shop_id: shopRecords._id,
                                product_ids: productId
                            }
                        },
                        {
                            $unwind: "$product_ids"
                        },
                        {
                            $group: {
                                _id: null,
                                uniqueProductIds: { $addToSet: "$product_ids" }
                            }
                        }
                    ]);

                    console.log(productGroupsResult);
                    if (productGroupsResult.length > 0 && productGroupsResult[0].uniqueProductIds) {
                        uniqProductIds = productGroupsResult[0].uniqueProductIds;
                    }
                }
                query['product_id'] = { $in: uniqProductIds };

            }

            let matchFilterOption = {};
            if (showImageReviews == 'true') {
                matchFilterOption = {
                    "reviewDocuments": {
                        $all: [
                            { $elemMatch: { type: "image" } }
                        ],
                        $not: { $elemMatch: { type: { $ne: "image" } } }
                    }
                };
            }
            const countRating = await productReviews.aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: 'review_documents',
                        localField: '_id',
                        foreignField: 'review_id',
                        as: 'reviewDocuments'
                    }
                },
                { $match: matchFilterOption },
                { $group: { _id: "$rating", count: { $sum: 1 } } }
            ])
            var mapRatting = countRating.map(item => ({
                stars: item._id,
                count: item.count
            }));
            const totalReviews = mapRatting.reduce((acc, item) => acc + item.count, 0);

            var averageRating = Math.round((mapRatting.reduce((acc, item) => acc + item.stars * item.count, 0) / totalReviews).toFixed(1));
            if (isNaN(averageRating)) {
                averageRating = 0;
            }

            if (!isNaN(filterByRatting)) {
                query['rating'] = filterByRatting;
            }
            const totalReviewItemsPipeline = [
                { $match: query },
                {
                    $lookup: {
                        from: 'review_documents',
                        localField: '_id',
                        foreignField: 'review_id',
                        as: 'reviewDocuments'
                    }
                },
                { $match: matchFilterOption },
                { $count: "total" }
            ];
            const totalReviewItemsResult = await productReviews.aggregate(totalReviewItemsPipeline);
            const totalReviewItems = totalReviewItemsResult.length > 0 ? totalReviewItemsResult[0].total : 0;
            // const averageRating = Math.round((mapRatting.reduce((acc, item) => acc + item.stars * item.count, 0) / totalReviewItems).toFixed(1));

            const reviewItems = await productReviews.aggregate([
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: 'review_documents',
                        localField: '_id',
                        foreignField: 'review_id',
                        as: 'reviewDocuments'
                    }
                },
                {
                    $lookup: {
                        from: 'product_review_questions',
                        localField: '_id',
                        foreignField: 'review_id',
                        as: 'reviewQuestionsAnswer'
                    }
                },
                {
                    $unwind: {
                        path: "$reviewQuestionsAnswer",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        description: { $first: "$description" },
                        rating: { $first: "$rating" },
                        first_name: { $first: "$first_name" },
                        display_name: { $first: "$display_name" },
                        email: { $first: "$email" },
                        last_name: { $first: "$last_name" },
                        createdAt: { $first: "$createdAt" },
                        status: { $first: "$status" },
                        replyText: { $first: "$replyText" },
                        product_id: { $first: "$product_id" },
                        variant_title: { $first: "$variant_title" },
                        tag_as_feature: { $first: "$tag_as_feature" },
                        verify_badge: { $first: "$verify_badge" },
                        reviewDocuments: { $first: "$reviewDocuments" }, // Use $first to avoid duplicates
                        reviewQuestionsAnswer: {
                            $push: {
                                _id: "$reviewQuestionsAnswer._id",
                                review_id: "$reviewQuestionsAnswer.review_id",
                                answer: "$reviewQuestionsAnswer.answer",
                                question_name: "$reviewQuestionsAnswer.question_name",
                                question_id: "$reviewQuestionsAnswer.question_id",
                                createdAt: "$reviewQuestionsAnswer.createdAt",
                                deletedAt: "$reviewQuestionsAnswer.deletedAt",
                            }
                        }
                    }
                },
                {
                    $match: matchFilterOption // Apply your second match filter
                },
                {
                    $sort: sortOption // Sort based on your sort option
                },
                {
                    $skip: (page - 1) * limit // Skip documents for pagination
                },
                {
                    $limit: limit // Limit the number of results per page
                },
                {
                    $project: {
                        _id: 1,
                        description: 1,
                        rating: 1,
                        first_name: 1,
                        display_name: 1,
                        email: 1,
                        last_name: 1,
                        createdAt: 1,
                        status: 1,
                        images: 1,
                        replyText: 1,
                        product_id: 1,
                        variant_title: 1,
                        is_review_request: 1,
                        tag_as_feature: 1,
                        verify_badge: 1,
                        reviewDocuments: {
                            $filter: {
                                input: "$reviewDocuments",
                                as: "doc",
                                cond: { $eq: ["$$doc.is_approve", true] }
                            }
                        },
                        reviewQuestionsAnswer: {
                            $filter: {
                                input: "$reviewQuestionsAnswer",
                                as: "item",
                                cond: {
                                    $and: [
                                        { $ne: ["$$item._id", null] },
                                        { $eq: ["$$item.deletedAt", null] }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]);

            var mapProductDetails = {};

            let hasMore = 0;
            if (reviewItems.length > 0) {
                hasMore = 1;
                const totalPages = page * limit;
                if (totalPages >= totalReviewItems) {
                    hasMore = 0;
                }


                const uniqueProductIds = [...new Set(reviewItems.map(item => item.product_id))];

                const productIds = uniqueProductIds.map((item) => `"gid://shopify/Product/${item}"`);
                var productsDetails = await getShopifyProducts(shopRecords.myshopify_domain, productIds);

                if (productsDetails.length > 0) {
                    productsDetails.forEach(node => {
                        if (node) {
                            const id = node.id.split('/').pop();
                            mapProductDetails[id] = node;
                        }

                    });
                }

            }

            reviewItems.map(items => {
                items.productDetails = mapProductDetails[items.product_id];
                return items;
            });

            const formParams = {
                productId: productId,
                page: page,
                sortBy: sortBy,
                filterByRatting: filterByRatting,
                hasMore: hasMore,
                hideProductThumbnails: hideProductThumbnails,
                totalReviewItems: totalReviews,
                mapRatting: mapRatting,
                averageRating: averageRating,
                blockId: blockId,
                is_modal_reviews: is_modal_reviews
            }
            if (is_modal_reviews == 'true') {


                const floatingWidgetCustomizesModel = await floatingWidgetCustomizes.findOne({ shop_id: shopRecords._id });
                otherProps['floatingWidgetCustomizesModel'] = floatingWidgetCustomizesModel;

                var dynamicComponent = <WidgetModalRviews shopRecords={shopRecords} reviewItems={reviewItems} formParams={formParams} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} otherProps={otherProps} />;
                var htmlContent = ReactDOMServer.renderToString(dynamicComponent);

            } else {
                var dynamicComponent = <ProductReviewWidget shopRecords={shopRecords} reviewItems={reviewItems} formParams={formParams} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={IconComponent} otherProps={otherProps} />;
                var htmlContent = ReactDOMServer.renderToString(dynamicComponent);
            }


            return json({
                body: htmlContent,
                hasMore: hasMore,
            });
        }

    } catch (error) {
        console.log(error);
        return json({
            error
        });
    }

}

async function getImageAndVideoForCarousel(shopRecords, limit = null, productId = 0) {
    const sortOption = {
        createdAt: -1,
        _id: -1
    };

    let query = {
        shop_id: shopRecords._id,
        status: 'publish',
        add_to_carousel: true
    };

    if (productId > 0) {
        query['product_id'] = productId;
    }
    const aggregationPipeline = [
        {
            $match: query
        },
        {
            $lookup: {
                from: 'review_documents',
                localField: '_id',
                foreignField: 'review_id',
                as: 'reviewDocuments'
            }
        },
        {
            $group: {
                _id: "$_id",
                rating: { $first: "$rating" },
                first_name: { $first: "$first_name" },
                display_name: { $first: "$display_name" },
                last_name: { $first: "$last_name" },
                description: { $first: "$description" },
                createdAt: { $first: "$createdAt" },
                product_id: { $first: "$product_id" },
                verify_badge: { $first: "$verify_badge" },
                reviewDocuments: { $first: "$reviewDocuments" } // Use $first to avoid duplicates
            }
        },
        {
            $sort: sortOption
        },
        {
            $project: {
                _id: 1,
                rating: 1,
                first_name: 1,
                display_name: 1,
                last_name: 1,
                description: 1,
                createdAt: 1,
                product_id: 1,
                verify_badge: 1,
                reviewDocuments: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$reviewDocuments",
                                as: "doc",
                                cond: {
                                    $and: [
                                        { $eq: ["$$doc.is_approve", true] },
                                        { $eq: ["$$doc.is_cover", true] }
                                    ]
                                }
                            }
                        },
                        0
                    ]
                }
            }
        },
        {
            $match: {
                reviewDocuments: { $ne: null }
            }
        }
    ];

    // Add limit stage if a limit is passed
    if (limit) {
        aggregationPipeline.push({ $limit: limit });
    }

    const reviewItems = await productReviews.aggregate(aggregationPipeline);

    return reviewItems;
}

