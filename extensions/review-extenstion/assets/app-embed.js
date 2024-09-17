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
        }
    });
});


function loadModalReviews(page) {
    var filter_by_ratting = $("#widget_ratting_wise_filter").val();
    var sort_by = $("#widget_sort_by_filter").val();
    $.ajax({
        type: 'POST',
        url: `/apps/w3-proxy/widget`,
        data: {
            show_all_reviews: widget_settings_vars?.show_all_reviews || true,
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


    // Function to update button visibility based on video state
    function updateButtonVisibility(videoElement) {
        $(videoElement).closest('.videowrap').find('.mainVideoPlayButton').show();
        $(videoElement).closest('.videowrap').find('.mainVideoPauseButton').hide();
    }

    // Play video when play button is clicked
    $(document).on("click", ".mainVideoPlayButton", function () {
        // Pause all videos before playing a new one
        $('video').each(function () {
            this.pause();
        });

        // Hide all play buttons and show all pause buttons
        $('.mainVideoPlayButton').show();
        $('.mainVideoPauseButton').hide();

        // Find the closest video to the play button clicked
        var video = $(this).closest('.videowrap').find('.mainVideoPlayer')[0];

        if (video) {
            video.play().then(() => {
                // Hide the play button and show the pause button only for the related video
                $(this).hide();
                $(this).siblings('.mainVideoPauseButton').show();
            }).catch(error => {
                console.error('Error playing video:', error);
            });
        }
    });

    // Pause video when pause button is clicked
    $(document).on("click", ".mainVideoPauseButton", function () {
        // Find the closest video to the pause button clicked
        var video = $(this).closest('.videowrap').find('.mainVideoPlayer')[0];

        if (video) {
            video.pause();
            // Hide the pause button and show the play button only for the related video
            $(this).hide();
            $(this).siblings('.mainVideoPlayButton').show();
        }
    });

    // Attach 'ended' event listeners to all video elements
    $('.mainVideoPlayer').each(function () {
        this.addEventListener('ended', function () {

            updateButtonVisibility(this);
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
                const intervalTime = popupSettingData.popupDisplayTime > 0 ? popupSettingData.popupDisplayTime*1000 : 5000;
                let hoverPause = false;
                let timeoutId = null;
        
                // Function to show each modal in sequence
                function showModal(index) {
                    if (index >= modals.length) {
                        return; // End the slideshow if all modals have been displayed
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
                            }, popupSettingData.delayBetweenPopups > 0 ? popupSettingData.delayBetweenPopups*1000 : 5000); // Allow time for the slide-out animation
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
                $('.close-modal').on('click', function () {
                    hideAllModals();
                });
        
                // Start the modal slideshow
                function startSlideshow() {
                    clearTimeout(timeoutId);
                    showModal(currentIndex);
                }
        
                
                setTimeout(function () {
                    startSlideshow(); // Initial start
                }, popupSettingData.initialDelay*1000);

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
        $(".verify-transparency-popup-icon").toggle();
    });

    $(document).mouseup(function (e) {
        var popup = $(".verify-transparency-popup-icon");
        // If the target of the click isn't the popup or the toggle button
        if (!popup.is(e.target) && popup.has(e.target).length === 0) {
            popup.hide();
        }
    });

});




