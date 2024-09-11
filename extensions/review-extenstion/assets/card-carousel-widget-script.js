$(document).ready(function () {
    $('[id^="card-carousel-widget-component-"]').each(function () {
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
                border_radius: settingsVars.border_radius,
                no_of_chars: settingsVars.no_of_chars,
                reviewer_name_color: settingsVars.reviewer_name_color,
                text_color: settingsVars.text_color,
                text_bg_color: settingsVars.text_bg_color,
                widget_icon_color: settingsVars.widget_icon_color,
                widget_bg_icon_color: settingsVars.widget_bg_icon_color,
                arrow_icon_color: settingsVars.arrow_icon_color,
                arrow_bg_color: settingsVars.arrow_bg_color,
                show_border: settingsVars.show_border,
                border_width: settingsVars.border_width,
                border_color: settingsVars.border_color,
                product_id: productId,
                shop_domain: shopDomain,
                customer_locale: customerLocale,
                block_id: blockId,
                actionType: "cardCarouselWidget",
            },
            dataType: "json",
            success: function (response) {
                // Inject HTML content into the correct element
                $(`#card-carousel-widget-component-${blockId}`).html(response.content);

                let noOfDesktopReviews = settingsVars.desktop_reviews;
                let noOfMobileReviews = settingsVars.mobile_reviews;

                // Initialize Owl Carousel after the content is fully loaded
                $(`#card-carousel-widget-component-${blockId} .owl-carousel`).owlCarousel({
                    loop: true,
                    margin: 10,
                    nav: true,
                    autoplay: false,
                    autoplayTimeout: 5000,
                    autoplayHoverPause: true,
                    dots: false,
                    navText: [
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.7559 17.7625C15.0814 17.4459 15.0814 16.9325 14.7559 16.6159L10.0118 12L14.7559 7.38414C15.0814 7.0675 15.0814 6.55412 14.7559 6.23748C14.4305 5.92084 13.9028 5.92084 13.5774 6.23748L8.24408 11.4267C8.0878 11.5787 8 11.785 8 12C8 12.215 8.0878 12.4213 8.24408 12.5733L13.5774 17.7625C13.9028 18.0792 14.4305 18.0792 14.7559 17.7625Z" fill="currentColor"/></svg>',
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.24408 17.7625C7.91864 17.4459 7.91864 16.9325 8.24408 16.6159L12.9882 12L8.24408 7.38414C7.91864 7.0675 7.91864 6.55412 8.24408 6.23748C8.56951 5.92084 9.09715 5.92084 9.42259 6.23748L14.7559 11.4267C14.9122 11.5787 15 11.785 15 12C15 12.215 14.9122 12.4213 14.7559 12.5733L9.42259 17.7625C9.09715 18.0792 8.56951 18.0792 8.24408 17.7625Z" fill="currentColor"/></svg>'
                    ],
                    responsive: {
                        0: {
                            items: noOfMobileReviews  // 1 image on mobile devices (0px and up)
                        },
                        768: {
                            items: noOfDesktopReviews  // 3 images on desktop (1000px and up)
                        }
                    }
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
        const videoDiv = $(this).closest('.item');

        if (video.paused) {
            video.play();
            $(this).text('Pause');
            videoDiv.addClass('videoplaying');
        } else {
            video.pause();
            $(this).html('<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 5.98505V3.48882C0.5 0.379742 2.65027 -0.890796 5.28325 0.663743L7.40426 1.91933L9.52527 3.17492C12.1582 4.72946 12.1582 7.27054 9.52527 8.82508L7.40426 10.0807L5.28325 11.3363C2.65027 12.8908 0.5 11.6203 0.5 8.51118V5.98505Z" fill="currentColor"/></svg>');
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
        $(this).find('video').each(function () {
            this.pause();
            $(this).closest('.item').find('.play-pause').html('<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 5.98505V3.48882C0.5 0.379742 2.65027 -0.890796 5.28325 0.663743L7.40426 1.91933L9.52527 3.17492C12.1582 4.72946 12.1582 7.27054 9.52527 8.82508L7.40426 10.0807L5.28325 11.3363C2.65027 12.8908 0.5 11.6203 0.5 8.51118V5.98505Z" fill="currentColor"/></svg>');
        });
    });

    $(document).on('ended', '.owl-carousel .video-content', function () {
        $(this).closest('.item').find('.play-pause').html('<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 5.98505V3.48882C0.5 0.379742 2.65027 -0.890796 5.28325 0.663743L7.40426 1.91933L9.52527 3.17492C12.1582 4.72946 12.1582 7.27054 9.52527 8.82508L7.40426 10.0807L5.28325 11.3363C2.65027 12.8908 0.5 11.6203 0.5 8.51118V5.98505Z" fill="currentColor"/></svg>');
    });
});
