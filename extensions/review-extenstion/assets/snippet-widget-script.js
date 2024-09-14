if (typeof jQuery !== 'undefined') {
    $(document).ready(function () {
        $('[id^="snippet-widget-component-"]').each(function () {
            var $this = $(this);
            var blockId = $this.data('block-id');
            var settingsVars = $this.data('rating-settings');
            var productId = $this.data('product-id');
            var shopDomain = $this.data('shop-domain');
            var customerLocale = $this.data('customer-locale');

            $.ajax({
                type: 'POST',
                url: `/apps/w3-proxy/widget`,
                data: {
                    widget_alignment: settingsVars.widget_alignment,
                    widget_width: settingsVars.widget_width,
                    no_display_reviews: settingsVars.no_display_reviews,
                    show_rating_icon: settingsVars.show_rating_icon,
                    show_review_image: settingsVars.show_review_image,
                    hide_arrow_mobile: settingsVars.hide_arrow_mobile,
                    font_size: settingsVars.font_size,
                    no_of_chars: settingsVars.no_of_chars,
                    show_border: settingsVars.show_border,
                    border_radius: settingsVars.border_radius,
                    background_color: settingsVars.background_color,
                    text_color: settingsVars.text_color,
                    reviewer_name_color: settingsVars.reviewer_name_color,
                    widget_icon_color: settingsVars.widget_icon_color,
                    border_color: settingsVars.border_color,
                    product_id: productId,
                    shop_domain: shopDomain,
                    customer_locale: customerLocale,
                    block_id: blockId,
                    actionType: "snippetWidget",
                },
                dataType: "json",
                success: function (response) {
                    // Inject HTML content into the correct element
                    $(`#snippet-widget-component-${blockId}`).html(response.content);

                    // Initialize Owl Carousel after the content is fully loaded
                    $(`#snippet-widget-component-${blockId} .owl-carousel`).owlCarousel({
                        loop: true,
                        margin: 10,
                        nav: true,
                        autoplay: false,
                        autoplayTimeout: 5000,
                        autoplayHoverPause: true,
                        dots: false,
                        items: 1,
                        navText: [
                            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.7559 17.7625C15.0814 17.4459 15.0814 16.9325 14.7559 16.6159L10.0118 12L14.7559 7.38414C15.0814 7.0675 15.0814 6.55412 14.7559 6.23748C14.4305 5.92084 13.9028 5.92084 13.5774 6.23748L8.24408 11.4267C8.0878 11.5787 8 11.785 8 12C8 12.215 8.0878 12.4213 8.24408 12.5733L13.5774 17.7625C13.9028 18.0792 14.4305 18.0792 14.7559 17.7625Z" fill="currentColor"/></svg>',
                            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.24408 17.7625C7.91864 17.4459 7.91864 16.9325 8.24408 16.6159L12.9882 12L8.24408 7.38414C7.91864 7.0675 7.91864 6.55412 8.24408 6.23748C8.56951 5.92084 9.09715 5.92084 9.42259 6.23748L14.7559 11.4267C14.9122 11.5787 15 11.785 15 12C15 12.215 14.9122 12.4213 14.7559 12.5733L9.42259 17.7625C9.09715 18.0792 8.56951 18.0792 8.24408 17.7625Z" fill="currentColor"/></svg>'
                        ]
                    });
                },
                error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });
        });

    });
}