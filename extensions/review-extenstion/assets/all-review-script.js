


$(document).ready(function () {
    $('[id^="display-all-review-widget-component-"]').each(function () {
        $this = $(this);
        var blockId = $(this).data('block-id');

        var settings_vars = $(this).data('rating-settings');
        console.log(settings_vars);
        const product_id = $(this).data('product-id');
        const shop_domain = $(this).data('shop-domain');
        const customer_locale = $(this).data('customer-locale');
        const block_id = $(this).data('block-id');

        $.ajax({
            type: 'POST',
            url: `/apps/w3-proxy/widget`,
            data: {
                
                font_size: settings_vars.font_size,
                widget_text: settings_vars.widget_text,
                border_radius: settings_vars.border_radius,
                widget_alignment: settings_vars.widget_alignment,
                widget_layout: settings_vars.widget_layout,
                widget_text_color: settings_vars.widget_text_color,
                widget_icon_color: settings_vars.widget_icon_color,
                open_float_reviews: settings_vars.open_float_reviews,
                show_branding: settings_vars.show_branding,
                show_rating: settings_vars.show_rating,
                show_rating_icon: settings_vars.show_rating_icon,
                show_review: settings_vars.show_review,
                widget_background_color: settings_vars.widget_background_color,
                widget_border_color: settings_vars.widget_border_color,
                widget_secondary_background_color: settings_vars.widget_secondary_background_color,
                product_id: product_id,
                shop_domain: shop_domain,
                customer_locale: customer_locale,
                block_id: block_id,
                actionType : "allReviewCounterWidget",
            },
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {
                $("#display-all-review-widget-component-"+blockId).html(response.htmlRatingContent);

            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });

});
