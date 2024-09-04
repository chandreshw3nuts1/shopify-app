$(document).ready(function () {
    $('[id^="display-video-slider-widget-component-"]').each(function () {
        var $this = $(this);
        var blockId = $this.data('block-id');
        var settingsVars = $this.data('common-settings');
        var productId = $this.data('product-id');
        var shopDomain = $this.data('shop-domain');
        var customerLocale = $this.data('customer-locale');

        $.ajax({
            type: 'POST',
            url: `/apps/w3-proxy/widget`,
            data: {
                selected_reviews: settingsVars.selected_reviews,
                border_radius: settingsVars.border_radius,
				show_rating: settingsVars.show_rating,
                show_rating_icon: settingsVars.show_rating_icon,
                show_name: settingsVars.show_name,
                hide_arrow_mobile: settingsVars.hide_arrow_mobile,
                widget_text_color: settingsVars.widget_text_color,
                widget_icon_color: settingsVars.widget_icon_color,
                play_button_color: settingsVars.play_button_color,
                product_id: productId,
                shop_domain: shopDomain,
                customer_locale: customerLocale,
                block_id: blockId,
                actionType: "videoSliderWidget",
            },
            dataType: "json",
            success: function (response) {
                // Inject HTML content into the correct element
                $(`#display-video-slider-widget-component-${blockId}`).html(response.content);

                // Initialize Owl Carousel after the content is fully loaded
                $(`#display-video-slider-widget-component-${blockId} .owl-carousel`).owlCarousel({
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

    // Delegate event handlers to handle dynamic content
    $(document).on('click', '.owl-carousel .play-pause', function () {
        const video = $(this).closest('.item').find('.video-content')[0];

        if (video.paused) {
            video.play();
            $(this).text('Pause');
        } else {
            video.pause();
            $(this).text('Play');
        }
    });

    $(document).on('click', '.owl-carousel .mute-unmute', function () {
        const video = $(this).closest('.item').find('.video-content')[0];
        if (video.muted) {
            video.muted = false;
            $(this).text('Mute');
        } else {
            video.muted = true;
            $(this).text('Unmute');
        }
    });

    $(document).on('translate.owl.carousel', '.owl-carousel', function (event) {
        // Pause all videos when the slide changes
		$(this).find('video').each(function() {
            this.pause();
            $(this).closest('.item').find('.play-pause').text('Play');
        });
    });

    $(document).on('ended', '.owl-carousel .video-content', function () {
        $(this).closest('.item').find('.play-pause').text('Play');
    });
});
