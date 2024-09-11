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
                show_rating_icon: settingsVars.show_rating_icon,
                show_name: settingsVars.show_name,
                hide_arrow_mobile: settingsVars.hide_arrow_mobile,
                widget_text_color: settingsVars.widget_text_color,
                widget_icon_color: settingsVars.widget_icon_color,
                play_button_color: settingsVars.play_button_color,
                show_border: settingsVars.show_border,
                border_color: settingsVars.border_color,
                border_width: settingsVars.border_width,
                product_id: productId,
                shop_domain: shopDomain,
                customer_locale: customerLocale,
                block_id: blockId,
                actionType: "videoSliderWidget",
                is_editing : Shopify.designMode || false
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
                            items: 1  // 1 image on mobile devices (0px and up)
                        },
                        768: {
                            items: 3  // 3 images on desktop (1000px and up)
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
        
        
        // Pause all other videos in the carousel
        $('.owl-carousel .video-content').each(function () {
            if (this !== video) {
                this.pause();
                this.currentTime = 0; // Optionally reset the video to the start
                $(this).closest('.item').find('.play-pause').html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8.98505V6.48882C3.5 3.37974 5.65027 2.1092 8.28325 3.66374L10.4043 4.91933L12.5253 6.17492C15.1582 7.72946 15.1582 10.2705 12.5253 11.8251L10.4043 13.0807L8.28325 14.3363C5.65027 15.8908 3.5 14.6203 3.5 11.5112V8.98505Z" fill="currentColor"/></svg>'); // Play Icon
                $(this).closest('.item').removeClass('videoplaying');
            }
        });


        if (video.paused) {
            video.play();
            $(this).html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 2C5.82843 2 6.5 2.67157 6.5 3.5L6.5 14.5C6.5 15.3284 5.82843 16 5 16C4.17157 16 3.5 15.3284 3.5 14.5L3.5 3.5C3.5 2.67157 4.17157 2 5 2ZM13 2C13.8284 2 14.5 2.67157 14.5 3.5L14.5 14.5C14.5 15.3284 13.8284 16 13 16C12.1716 16 11.5 15.3284 11.5 14.5L11.5 3.5C11.5 2.67157 12.1716 2 13 2Z" fill="currentColor"/></svg>');
            videoDiv.addClass('videoplaying'); // Pause Icon
        } else {
            video.pause();
            $(this).html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8.98505V6.48882C3.5 3.37974 5.65027 2.1092 8.28325 3.66374L10.4043 4.91933L12.5253 6.17492C15.1582 7.72946 15.1582 10.2705 12.5253 11.8251L10.4043 13.0807L8.28325 14.3363C5.65027 15.8908 3.5 14.6203 3.5 11.5112V8.98505Z" fill="currentColor"/></svg>'); // Play Icon
        }

        $(video).on('ended', function () {
            videoDiv.removeClass('videoplaying');
            $(this).parents('.item').find('.play-pause').html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8.98505V6.48882C3.5 3.37974 5.65027 2.1092 8.28325 3.66374L10.4043 4.91933L12.5253 6.17492C15.1582 7.72946 15.1582 10.2705 12.5253 11.8251L10.4043 13.0807L8.28325 14.3363C5.65027 15.8908 3.5 14.6203 3.5 11.5112V8.98505Z" fill="currentColor"/></svg>'); // Play Icon
            video.currentTime = 0;
        });

    });

    // Delegate event handlers to handle dynamic content
    $(document).on('click', '.owl-carousel .rightaction .playpause', function () {
        const video = $(this).closest('.item').find('.video-content')[0];
        const videoDiv = $(this).closest('.item');

        if (video.paused) {
            video.play();
            $(this).html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 2C5.82843 2 6.5 2.67157 6.5 3.5L6.5 14.5C6.5 15.3284 5.82843 16 5 16C4.17157 16 3.5 15.3284 3.5 14.5L3.5 3.5C3.5 2.67157 4.17157 2 5 2ZM13 2C13.8284 2 14.5 2.67157 14.5 3.5L14.5 14.5C14.5 15.3284 13.8284 16 13 16C12.1716 16 11.5 15.3284 11.5 14.5L11.5 3.5C11.5 2.67157 12.1716 2 13 2Z" fill="currentColor"/></svg>');
            // videoDiv.addClass('videoplaying'); // Pause Icon
        } else {
            video.pause();
            $(this).html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8.98505V6.48882C3.5 3.37974 5.65027 2.1092 8.28325 3.66374L10.4043 4.91933L12.5253 6.17492C15.1582 7.72946 15.1582 10.2705 12.5253 11.8251L10.4043 13.0807L8.28325 14.3363C5.65027 15.8908 3.5 14.6203 3.5 11.5112V8.98505Z" fill="currentColor"/></svg>'); // Play Icon
        }

    });


    $(document).on('click', '.owl-carousel .rightaction .muteunmute', function () {
        const video = $(this).closest('.item').find('.video-content')[0];
        if (video.muted) {
            video.muted = false;
            $(this).html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.00542 14.4934C9.00542 14.8038 8.8222 15.0859 8.53548 15.2175C8.42462 15.2688 8.30583 15.2937 8.18782 15.2937C8.00092 15.2937 7.81577 15.2308 7.66622 15.1094L3.19747 11.4839H0.817408C0.366044 11.4843 0 11.1257 0 10.6838V7.49529C0 7.05318 0.366044 6.6948 0.817408 6.6948H3.19766L7.66642 3.06933C7.91057 2.8712 8.24915 2.82896 8.53567 2.96155C8.8222 3.0932 9.00561 3.37543 9.00561 3.6857L9.00542 14.4934ZM12.1468 13.2428C12.1269 13.2441 12.1077 13.2449 12.088 13.2449C11.8721 13.2449 11.6639 13.1614 11.5101 13.0106L11.4008 12.9032C11.114 12.623 11.0804 12.1792 11.3218 11.8606C11.934 11.0526 12.2571 10.0947 12.2571 9.08981C12.2571 8.00899 11.8902 6.99522 11.1961 6.15799C10.9318 5.83977 10.9562 5.37759 11.2524 5.08777L11.3615 4.98075C11.5248 4.82088 11.7436 4.73375 11.9804 4.74758C12.211 4.75894 12.4263 4.86521 12.5726 5.04023C13.5355 6.19379 14.0441 7.59435 14.0441 9.09C14.0441 10.483 13.5943 11.8089 12.7431 12.9238C12.6009 13.1097 12.3834 13.2263 12.1468 13.2428ZM15.5263 15.7161C15.3785 15.8871 15.1647 15.9898 14.9358 15.9992C14.9246 15.9996 14.9132 16 14.9016 16C14.6851 16 14.4773 15.9163 14.3235 15.7657L14.2161 15.6606C13.9161 15.367 13.8957 14.8974 14.1685 14.5795C15.4868 13.0445 16.2131 11.095 16.2131 9.08981C16.2131 7.00412 15.4356 4.99629 14.0242 3.43623C13.7381 3.11952 13.7526 2.64011 14.0571 2.34082L14.1643 2.2357C14.3233 2.07924 14.5299 1.99305 14.7669 2.00044C14.9919 2.00669 15.2048 2.10405 15.3543 2.26885C17.0603 4.14939 18 6.57206 18 9.08981C18.0004 11.5123 17.1218 13.8656 15.5263 15.7161Z" fill="currentColor"/></svg>'); // Unmute Icon
        } else {
            video.muted = true;
            $(this).html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5054 14.3983C10.5054 14.7088 10.3222 14.9908 10.0355 15.1225C9.92462 15.1738 9.80583 15.1986 9.68782 15.1986C9.50092 15.1986 9.31577 15.1357 9.16622 15.0143L4.69747 11.3889H2.31741C1.86604 11.3892 1.5 11.0307 1.5 10.5887V7.40026C1.5 6.95816 1.86604 6.59978 2.31741 6.59978H4.69766L9.16642 2.9743C9.41057 2.77617 9.74915 2.73393 10.0357 2.86652C10.3222 2.99817 10.5056 3.2804 10.5056 3.59067L10.5054 14.3983Z" fill="currentColor"/><path d="M16.2997 7.1056C16.0322 6.83817 15.599 6.83817 15.3316 7.1056L14.5001 7.93698L13.6686 7.1056C13.4012 6.83817 12.968 6.83817 12.7006 7.1056C12.4331 7.37302 12.4331 7.80647 12.7006 8.07368L13.532 8.90503L12.7006 9.73639C12.4331 10.0038 12.4331 10.437 12.7006 10.7045C12.8343 10.8382 13.0094 10.905 13.1846 10.905C13.3598 10.905 13.5349 10.8382 13.6686 10.7045L14.5001 9.87308L15.3316 10.7045C15.4653 10.8382 15.6405 10.905 15.8156 10.905C15.9908 10.905 16.166 10.8382 16.2997 10.7045C16.5671 10.437 16.5671 10.0038 16.2997 9.73639L15.4682 8.90503L16.2997 8.07368C16.5671 7.80647 16.5671 7.37302 16.2997 7.1056Z" fill="currentColor"/></svg>'); // Mute Icon
        }
    });

    $(document).on('translate.owl.carousel', '.owl-carousel', function (event) {
        // Pause all videos when the slide changes
        $(this).find('video').each(function () {
            this.pause();
            $(this).closest('.item').find('.play-pause').html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8.98505V6.48882C3.5 3.37974 5.65027 2.1092 8.28325 3.66374L10.4043 4.91933L12.5253 6.17492C15.1582 7.72946 15.1582 10.2705 12.5253 11.8251L10.4043 13.0807L8.28325 14.3363C5.65027 15.8908 3.5 14.6203 3.5 11.5112V8.98505Z" fill="currentColor"/></svg>'); // Play Icon
            $(this).closest('.item').removeClass('videoplaying');
        });
    });

    $(document).on('ended', '.owl-carousel .video-content', function () {
        $(this).closest('.item').find('.play-pause').html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 2C5.82843 2 6.5 2.67157 6.5 3.5L6.5 14.5C6.5 15.3284 5.82843 16 5 16C4.17157 16 3.5 15.3284 3.5 14.5L3.5 3.5C3.5 2.67157 4.17157 2 5 2ZM13 2C13.8284 2 14.5 2.67157 14.5 3.5L14.5 14.5C14.5 15.3284 13.8284 16 13 16C12.1716 16 11.5 15.3284 11.5 14.5L11.5 3.5C11.5 2.67157 12.1716 2 13 2Z" fill="currentColor"/></svg>'); // Pause Icon
    });
});
