


$(document).ready(function () {
    $('[id^="testimonials-carousel-widget-component-"]').each(function () {
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
                no_of_chars: settings_vars.no_of_chars,
                quote_marks_icon_style: settings_vars.quote_marks_icon_style,
                reviewer_name_color: settings_vars.reviewer_name_color,
                text_color: settings_vars.text_color,
                widget_icon_color: settings_vars.widget_icon_color,
                quotes_icon_color: settings_vars.quotes_icon_color,
                arrow_icon_color: settings_vars.arrow_icon_color,
                hide_arrow_mobile: settings_vars.hide_arrow_mobile,
                show_pagination_dots: settings_vars.show_pagination_dots,
                selected_dot_color: settings_vars.selected_dot_color,
                dot_background_color: settings_vars.dot_background_color,
                auto_animation: settings_vars.auto_animation,
                delay_sec: settings_vars.delay_sec,
                product_id: product_id,
                shop_domain: shop_domain,
                customer_locale: customer_locale,
                block_id: block_id,
                actionType : "testimonialsCarouselWidget",
            },
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {
                $("#testimonials-carousel-widget-component-"+blockId).html(response.content);

                $(`#testimonials-carousel-widget-component-${blockId} .owl-carousel`).owlCarousel({
                    loop: true,
                    margin: 10,
                    nav: true,
                    autoplay: true,
                    autoplayTimeout: 5000,
                    autoplayHoverPause: true,
                    items: 4,
                    navText: ['<', '>']
                });

            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });

});
