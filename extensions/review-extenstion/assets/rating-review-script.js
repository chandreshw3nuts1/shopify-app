
$(document).ready(function () {
    $('[id^="display-rating-widget-component-"]').each(function () {
        $this = $(this);
        var blockId = $(this).data('block-id');

        var settings_vars = $(this).data('rating-settings');
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
                hide_text: settings_vars.hide_text,
                widget_alignment: settings_vars.widget_alignment,
                widget_layout: settings_vars.widget_layout,
                widget_text_color: settings_vars.widget_text_color,
                widget_icon_color: settings_vars.widget_icon_color,
                show_all_reviews: settings_vars.show_all_reviews,
                open_float_reviews: settings_vars.open_float_reviews,
                show_empty_stars: settings_vars.show_empty_stars,
                product_id: product_id,
                shop_domain: shop_domain,
                customer_locale: customer_locale,
                block_id: block_id,
                actionType : "reviewRatingWidget",
            },
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {
                $("#display-rating-widget-component-"+blockId).html(response.htmlRatingContent);

            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });

});
