var widget_page = 1;
var widget_settings_vars, widget_block_id, widget_product_id, widget_shop_domain, widget_customer_locale = "";
var widgetElementObj = null;
var widgetMasonryObj;

$(document).on("click", "#testmodal", function (e) {
    alert('dsadsad');
    $("#myModaltest").modal("show");
});
$(document).on("click", ".open-w3-float-modal", function (e) {
    e.preventDefault();

    var $widget = $(this).parents(".w3-widgets");
    widget_settings_vars = $widget.data('rating-settings');
    widget_product_id = $widget.data('product-id');
    widget_shop_domain = $widget.data('shop-domain');
    widget_customer_locale = $widget.data('customer-locale');
    widget_block_id = $widget.data('block-id');

    widgetElementObj = $("#w3-float-modal-content-widget");
    widgetElementObj.find('.modal-body').html('');
    widgetElementObj.modal("show");
    widget_page = 1;
    loadModalReviews(widget_page);

});
$(document).on("click", "#widget_load_more_review", function (e) {
    e.preventDefault();
    widget_page = widget_page + 1;
    loadModalReviews(widget_page);
});

$(document).on('hide.bs.modal', '#w3-float-modal-content-widget', function () {
    widgetElementObj.find('.modal-body').html('');
});
$(document).on('hide.bs.modal', '#staticBackdrop', function () {

    $('#staticBackdrop video').each(function () {
        this.pause();
        this.currentTime = 0;
    });

    $("#w3-float-modal-content-widget").removeClass("modal-backdrop-grey");


});

$(document).on("click", ".dropdown-menu .widget_stardetailrow, .stardetaildd .widget_stardetailrow", function (e) {
    var ratingNumber = $(this).find('.sratnumber').text();
    var haveReview = $(this).find('.sratnumber').data('review');
    if (parseInt(haveReview) > 0) {
        $("#widget_ratting_wise_filter").val(ratingNumber);
        widget_page = 1;
        loadModalReviews(widget_page);
    }
});

$(document).on("click", ".dropdown-menu .widget_sort_by_filter", function (e) {
    e.preventDefault();
    var sortType = $(this).data('sort');
    $("#widget_sort_by_filter").val(sortType);
    widget_page = 1;
    loadModalReviews(widget_page);
});



$(document).on("click", ".widget_w3grid-review-item", function () {
    var $this = $(this);

    if ($this.data('requestRunning')) {
        return;
    }
    $this.data('requestRunning', true);

    reviewId = $(this).data('reviewid');
    let shop_domain = "";
    let customer_locale = "";

    if (typeof widget_shop_domain == 'undefined') {

        let $this = $(this).parents(".w3-widgets");
        shop_domain = $this.data('shop-domain');
        customer_locale = $this.data('customer-locale');

    } else {
        shop_domain = widget_shop_domain;
        customer_locale = widget_customer_locale;
    }


    $.ajax({
        type: 'POST',
        url: `/apps/w3-proxy/widget`,
        data: {
            reviewId: reviewId,
            actionType: 'openReviewDetailModal',
            shop_domain: shop_domain,
            customer_locale: customer_locale
        },
        dataType: "json",
        success: function (response) {
            $("#staticBackdrop").remove();
            var modal_html = response.body;
            $("body").append(modal_html);
            $("#staticBackdrop").modal("show");

            if (widgetElementObj) {
                widgetElementObj.addClass("modal-backdrop-grey");
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        }, complete: function () {
            $this.data('requestRunning', false);
        }
    });
});


function loadModalReviews(page) {
    var filter_by_ratting = $("#widget_ratting_wise_filter").val();
    var sort_by = $("#widget_sort_by_filter").val();
    var show_all_reviews = typeof widget_settings_vars?.show_all_reviews != "undefined" ? widget_settings_vars.show_all_reviews : true;
    $.ajax({
        type: 'POST',
        url: `/apps/w3-proxy/widget`,
        data: {
            show_all_reviews: show_all_reviews,
            filter_by_ratting: filter_by_ratting,
            sort_by: sort_by,
            page: page,
            product_id: widget_product_id,
            shop_domain: widget_shop_domain,
            customer_locale: widget_customer_locale,
            block_id: widget_block_id,
            is_modal_reviews: true
        },
        dataType: "json",
        beforeSend: function () {
            $('#widget_load_more_review').hide();
            $('#widget_w3loadingmorerws').show();
        },
        success: function (response) {
            if (widget_page == 1) {
                widgetElementObj.find('.modal-body').html(response.body);
                // Initialize Masonry on first load

                var $initialWidgetItems = widgetElementObj.find('.widget_main_review_block');
                $initialWidgetItems.imagesLoaded(function () {
                    widgetMasonryObj = $initialWidgetItems.masonry({
                        itemSelector: '.widget_w3grid-review-item',
                        columnWidth: '.widget_w3grid-review-item',
                        percentPosition: true
                    });
                });

            } else {
                var $newWidgetItems = $(response.body);
                widgetElementObj.find(".widget_main_review_block").append($newWidgetItems);

                $newWidgetItems.imagesLoaded(function () {
                    widgetElementObj.find(".widget_main_review_block").masonry('appended', $newWidgetItems).masonry('layout');
                });
            }
            $('#widget_load_more_review').show();
            $('#widget_w3loadingmorerws').hide();
            if (response.hasMore == 0) {
                $("#widget_load_more_review").hide();
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
}


$(document).on("click", ".common_widget_review_item", function () {
    reviewId = $(this).data('reviewid');

    var $commonWidget = $(this).parents(".w3-widgets");
    widget_product_id = $commonWidget.data('product-id');
    widget_shop_domain = $commonWidget.data('shop-domain');
    widget_customer_locale = $commonWidget.data('customer-locale');
    widget_block_id = $commonWidget.data('block-id');


    $.ajax({
        type: 'POST',
        url: `/apps/w3-proxy/widget`,
        data: {
            reviewId: reviewId,
            actionType: 'openReviewDetailModal',
            shop_domain: widget_shop_domain,
            customer_locale: widget_customer_locale
        },
        dataType: "json",
        success: function (response) {
            $("#staticBackdrop").remove();
            var modal_html = response.body;
            $("body").append(modal_html);
            $("#staticBackdrop").modal("show");
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
});



$(document).ready(function () {

    $(document).on('click', '.carousel-inner .mainVideoPlayButton', function () {
        const video = $(this).closest('.videowrap').find('.mainVideoPlayer')[0];

        if (video.paused) {
            video.play();
            $(this).html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 2C5.82843 2 6.5 2.67157 6.5 3.5L6.5 14.5C6.5 15.3284 5.82843 16 5 16C4.17157 16 3.5 15.3284 3.5 14.5L3.5 3.5C3.5 2.67157 4.17157 2 5 2ZM13 2C13.8284 2 14.5 2.67157 14.5 3.5L14.5 14.5C14.5 15.3284 13.8284 16 13 16C12.1716 16 11.5 15.3284 11.5 14.5L11.5 3.5C11.5 2.67157 12.1716 2 13 2Z" fill="currentColor"/></svg>');
        } else {
            video.pause();
            $(this).html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8.98505V6.48882C3.5 3.37974 5.65027 2.1092 8.28325 3.66374L10.4043 4.91933L12.5253 6.17492C15.1582 7.72946 15.1582 10.2705 12.5253 11.8251L10.4043 13.0807L8.28325 14.3363C5.65027 15.8908 3.5 14.6203 3.5 11.5112V8.98505Z" fill="currentColor"/></svg>');
        }

        $(video).on('ended', function () {
            $(this).parents('.videowrap').find('.mainVideoPlayButton').html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8.98505V6.48882C3.5 3.37974 5.65027 2.1092 8.28325 3.66374L10.4043 4.91933L12.5253 6.17492C15.1582 7.72946 15.1582 10.2705 12.5253 11.8251L10.4043 13.0807L8.28325 14.3363C5.65027 15.8908 3.5 14.6203 3.5 11.5112V8.98505Z" fill="currentColor"/></svg>');
            video.currentTime = 0;
        });

    });
    $(document).on('slid.bs.carousel', "#carouselExampleCaptions", function () {
        $('#carouselExampleCaptions video').each(function () {
            this.pause(); // Pause the video
            $(this).siblings('.mainVideoPlayButton').html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8.98505V6.48882C3.5 3.37974 5.65027 2.1092 8.28325 3.66374L10.4043 4.91933L12.5253 6.17492C15.1582 7.72946 15.1582 10.2705 12.5253 11.8251L10.4043 13.0807L8.28325 14.3363C5.65027 15.8908 3.5 14.6203 3.5 11.5112V8.98505Z" fill="currentColor"/></svg>');
            this.currentTime = 0;
        });
    });

    $(document).on('translate.owl.carousel', '.carousel', function (event) {
        $(this).find('video').each(function () {
            this.pause();
            $(this).closest('.item').find('.play-pause').html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8.98505V6.48882C3.5 3.37974 5.65027 2.1092 8.28325 3.66374L10.4043 4.91933L12.5253 6.17492C15.1582 7.72946 15.1582 10.2705 12.5253 11.8251L10.4043 13.0807L8.28325 14.3363C5.65027 15.8908 3.5 14.6203 3.5 11.5112V8.98505Z" fill="currentColor"/></svg>'); // Play Icon
            $(this).closest('.item').removeClass('videoplaying');

            $(this).closest('.item').find('.playpause').html('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 2C5.82843 2 6.5 2.67157 6.5 3.5L6.5 14.5C6.5 15.3284 5.82843 16 5 16C4.17157 16 3.5 15.3284 3.5 14.5L3.5 3.5C3.5 2.67157 4.17157 2 5 2ZM13 2C13.8284 2 14.5 2.67157 14.5 3.5L14.5 14.5C14.5 15.3284 13.8284 16 13 16C12.1716 16 11.5 15.3284 11.5 14.5L11.5 3.5C11.5 2.67157 12.1716 2 13 2Z" fill="currentColor"/></svg>'); // Play Icon


        });
    });

    /* Display Sidebar rating widget */
    if ($("#sidebar_popup_extension_widget").length > 0) {
        var shop_domain = $("#sidebar_popup_extension_widget").data('shop-domain');
        $.ajax({
            type: 'POST',
            url: `/apps/w3-proxy/widget`,
            data: {
                shop_domain: shop_domain,
                actionType: "sidebarRatingWidget",
            },
            dataType: "json",
            success: function (response) {
                $("#sidebar_popup_extension_widget").addClass(response.class);
                setTimeout(function () {
                    $("#sidebar_popup_extension_widget").html(response.content);
                }, 500);
            }
        });
    }


    /* Display Popup Modals widget */
    if ($("#popup_modal_extension_widget").length > 0) {
        var shop_domain = $("#popup_modal_extension_widget").data('shop-domain');
        $.ajax({
            type: 'POST',
            url: `/apps/w3-proxy/widget`,
            data: {
                shop_domain: shop_domain,
                actionType: "popupModalWidget",
            },
            dataType: "json",
            success: function (response) {
                // Insert the content of the modals dynamically into the widget container
                $("#popup_modal_extension_widget").html(response.content);
                const popupSettingData = $("#popup_modal_extension_widget").data('popup-settings');

                let numberOfModals = popupSettingData.maximumPerPage > 0 ? popupSettingData.maximumPerPage : 20;
                let modals = [];
                for (let i = 1; i <= numberOfModals; i++) {
                    modals.push(`#w3-popup-modal-content-${i}`);
                }

                let currentIndex = 0;
                const intervalTime = popupSettingData.popupDisplayTime > 0 ? popupSettingData.popupDisplayTime * 1000 : 5000;
                let hoverPause = false;
                let timeoutId = null;

                // Function to show each modal in sequence
                function showModal(index) {
                    if (index >= modals.length || index < 0) {
                        return;
                    }

                    const modal = $(modals[index]);
                    modal.css('display', 'block');
                    setTimeout(function () {
                        modal.addClass('slide-in');
                    }, 100);

                    timeoutId = setTimeout(function () {
                        if (!hoverPause) {
                            modal.addClass('slide-out');
                            setTimeout(function () {
                                modal.css('display', 'none');
                                modal.removeClass('slide-in slide-out');
                                currentIndex++;
                                showModal(currentIndex); // Show next modal
                            }, popupSettingData.delayBetweenPopups > 0 ? popupSettingData.delayBetweenPopups * 1000 : 5000); // Allow time for the slide-out animation
                        }
                    }, intervalTime);
                }

                // Hide all modals if the close button is clicked
                function hideAllModals() {
                    clearTimeout(timeoutId); // Stop any active timeouts
                    modals.forEach(function (modalId) {
                        const modal = $(modalId);
                        modal.addClass('slide-out');
                        setTimeout(function () {
                            modal.css('display', 'none');
                            modal.removeClass('slide-in slide-out');
                        }, 500);
                    });
                }

                // Close modal when close button is clicked
                $('.w3-close-popups-modal').on('click', function (e) {
                    e.preventDefault();
                    hideAllModals();
                    currentIndex = -1;
                });

                // Start the modal slideshow
                function startSlideshow() {
                    clearTimeout(timeoutId);
                    showModal(currentIndex);
                }


                setTimeout(function () {
                    startSlideshow(); // Initial start
                }, popupSettingData.initialDelay > 0 ? popupSettingData.initialDelay * 1000 : 5000);

                // Pause and resume slideshow on hover
                modals.forEach(function (modalId) {
                    $(modalId).hover(
                        function () {
                            hoverPause = true; // Pause the slideshow on hover
                            clearTimeout(timeoutId); // Clear the current timeout
                        },
                        function () {
                            hoverPause = false; // Resume slideshow on hover out
                            startSlideshow(); // Continue from where it left off
                        }
                    );
                });
            }
        });

    }

    $(document).on("click", ".open-transparency-popup-modal", function () {
        $(".verify-transparency-popup-icon").toggleClass("visible");
    });

    // Close the popup when clicking outside
    $(document).mouseup(function (e) {
        var popup = $(".verify-transparency-popup-icon");
        if (!popup.is(e.target) && popup.has(e.target).length === 0 && !$(e.target).closest('.open-transparency-popup-modal').length) {
            popup.removeClass("visible");
        }
    });
});




