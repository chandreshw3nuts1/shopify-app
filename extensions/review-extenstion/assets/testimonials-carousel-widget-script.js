
if (typeof jQuery !== 'undefined') {

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
                    product_id: product_id,
                    shop_domain: shop_domain,
                    customer_locale: customer_locale,
                    block_id: block_id,
                    actionType: "testimonialsCarouselWidget",
                },
                dataType: "json",
                beforeSend: function () {

                },
                success: function (response) {
                    $("#testimonials-carousel-widget-component-" + blockId).html(response.content);
                    let autoAnimate = settings_vars.auto_animation;
                    let delaySec = settings_vars.delay_sec * 1000;
                    $(`#testimonials-carousel-widget-component-${blockId} .owl-carousel`).owlCarousel({
                        loop: true,
                        margin: 10,
                        nav: true,
                        dots: true,
                        autoplay: autoAnimate,
                        autoplayTimeout: delaySec,
                        autoplayHoverPause: true,
                        items: 1,
                        navText: [
                            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.7559 17.7625C15.0814 17.4459 15.0814 16.9325 14.7559 16.6159L10.0118 12L14.7559 7.38414C15.0814 7.0675 15.0814 6.55412 14.7559 6.23748C14.4305 5.92084 13.9028 5.92084 13.5774 6.23748L8.24408 11.4267C8.0878 11.5787 8 11.785 8 12C8 12.215 8.0878 12.4213 8.24408 12.5733L13.5774 17.7625C13.9028 18.0792 14.4305 18.0792 14.7559 17.7625Z" fill="currentColor"/></svg>',
                            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.24408 17.7625C7.91864 17.4459 7.91864 16.9325 8.24408 16.6159L12.9882 12L8.24408 7.38414C7.91864 7.0675 7.91864 6.55412 8.24408 6.23748C8.56951 5.92084 9.09715 5.92084 9.42259 6.23748L14.7559 11.4267C14.9122 11.5787 15 11.785 15 12C15 12.215 14.9122 12.4213 14.7559 12.5733L9.42259 17.7625C9.09715 18.0792 8.56951 18.0792 8.24408 17.7625Z" fill="currentColor"/></svg>'
                        ],
                    });

                },
                error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });
        });

    });
}