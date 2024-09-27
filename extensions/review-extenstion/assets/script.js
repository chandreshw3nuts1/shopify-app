var imageAndVideoFiles = [];
var FILE_LIST = [];
if (typeof jQuery !== 'undefined') {

    $(document).ready(function () {
        jQuery("#stars li").on("mouseover", function () {
            var onStar = parseInt(jQuery(this).data("value"), 10);
            jQuery(this).parent().removeClass("hover-1 hover-2 hover-3 hover-4 hover-5");
            jQuery(this).parent().addClass(`hover-${onStar}`);
            jQuery(this).parent().children("li.star").each(function (e) {
                if (e < onStar) {
                    jQuery(this).addClass("hover");
                } else {
                    jQuery(this).removeClass("hover");
                }
            });
        }).on("mouseout", function () {
            jQuery(this).parent().children("li.star").each(function (e) {
                jQuery(this).removeClass("hover");
                jQuery(this).parent().removeClass("hover-1 hover-2 hover-3 hover-4 hover-5");
            });

        });

        $(document).on("click", "#stars li", function () {
            var onStar = parseInt(jQuery(this).data("value"), 10);
            var stars = jQuery(this).parent().children("li.star");

            for (i = 0; i < stars.length; i++) {
                jQuery(stars[i]).removeClass("selected");
            }

            for (i = 0; i < onStar; i++) {
                jQuery(stars[i]).addClass("selected");
            }

            var ratingValue = parseInt(
                jQuery("#stars li.selected").last().data("value"), 10,
            );

            jQuery(this).parent().removeClass('star-1 star-2 star-3 star-4 star-5');
            jQuery(this).parent().addClass(`star-${ratingValue}`);

            jQuery('.success-box').removeClass('star-1 star-2 star-3 star-4 star-5');
            jQuery('.success-box').addClass(`star-${ratingValue}`);

            var msg = "";
            msg = jQuery(this).attr("title");
            responseMessage(msg);
            jQuery('#review_rating').val(ratingValue);


            let parentDiv = jQuery(this).parents('.reviewsteps');
            jQuery(parentDiv).find(".nextbtn").removeAttr('disabled');
        });


        $(document).on("click", ".modal .reviewsteps .nextbtn", function (e) {
            e.preventDefault();
            let parentDiv = jQuery(this).parents('.reviewsteps');
            jQuery(parentDiv).addClass('d-none');
            jQuery(parentDiv).removeClass('activestep');
            jQuery(parentDiv).next().removeClass('d-none');
            jQuery(parentDiv).next().addClass('activestep');
        });

        $(document).on("click", ".modal .reviewsteps .backbtn", function (e) {
            e.preventDefault();
            let parentDiv = jQuery(this).parents('.reviewsteps');
            jQuery(parentDiv).addClass('d-none');
            jQuery(parentDiv).removeClass('activestep');
            jQuery(parentDiv).prev().removeClass('d-none');
            jQuery(parentDiv).prev().addClass('activestep');
        });

        var DeleteBin = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.5 8.38797C15.5575 8.18997 13.6033 8.08797 11.655 8.08797C10.5 8.08797 9.345 8.14797 8.19 8.26797L7 8.38797M10.2083 7.78199L10.3367 6.99599C10.43 6.426 10.5 6 11.4858 6H13.0142C14 6 14.0758 6.45 14.1633 7.00199L14.2917 7.78199M16.2458 10.2841L15.8666 16.326C15.8024 17.268 15.7499 18 14.1224 18H10.3774C8.74994 18 8.69744 17.268 8.63328 16.326L8.25411 10.2841M11.2759 14.6999H13.2184M10.7917 12.3H13.7083" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        var previewImages = function () {
            $('#files-list-container').html('');
            if (FILE_LIST.length > 0) {
                $('.filesupload_wrap').addClass('morethanone');

                $.each(FILE_LIST, function (index, addedFile) {

                    var content = '<div class="listbox"><div class="form__image-container js-remove-image" data-index="' + index + '">';
                    if (addedFile.type.match("video/")) {
                        content += '<video controls><source src="' + addedFile.url + '" type="video/mp4"></video>';
                    } else {
                        content += '<img class="form__image" src="' + addedFile.url + '" alt="' + addedFile.name + '">';
                    }
                    content += '<div class="deleteicon">' + DeleteBin + '</div></div></div>';
                    $('#files-list-container').append(content);
                });
            } else {
                $('.filesupload_wrap').removeClass('morethanone');
                $("#upload-files").val("");
            }
        };

        $(document).on("change", "#upload-files", function (event) {

            if (this.files.length > 5 || parseInt(FILE_LIST.length + this.files.length) > 5) {
                $(".uploadDocError").removeClass('d-none');

            } else {
                const fileSizeLimit = 250 * 1024 * 1024;
                let checkUploadFilesIsValid = true;
                $.each(this.files, function (index, file) {
                    if (file.size > fileSizeLimit) {
                        checkUploadFilesIsValid = false;
                    }
                });
                if (!checkUploadFilesIsValid) {
                    $("#upload-files").val("");
                    $(".uploadDocSizeError").removeClass('d-none');
                    return true;
                }
                $(".uploadDocSizeError").addClass('d-none');

                $(".uploadDocError").addClass('d-none');
                $(".w3revbtnblock").addClass('d-none');
                $('.form__container').addClass('pointnone');
                $(".w3loadingblock").removeClass('d-none');

                let formData = new FormData($('#review_submit_btn_form')[0]);
                formData.append("actionType", "uploadDocuments");
                formData.append("shop_domain", shop_domain);

                let reviewUrl = $("#review_submit_btn_form").attr('action');

                $.ajax({
                    type: 'POST',
                    url: reviewUrl,
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.files.length > 0) {
                            $.each(response.files, function (index, item) {
                                imageAndVideoFiles.push(item);
                            });
                            $("#file_objects").val(imageAndVideoFiles);


                            var files = event.target.files;

                            $.each(files, function (index, file) {
                                const fileURL = URL.createObjectURL(file);
                                const fileName = file.name;
                                const fileType = file.type;
                                if (response.content == true) {
                                    const uploadedFiles = {
                                        name: fileName,
                                        url: fileURL,
                                        type: fileType,
                                    };
                                    FILE_LIST.push(uploadedFiles);
                                } else if (file.type.match("image/")) {
                                    const uploadedFiles = {
                                        name: fileName,
                                        url: fileURL,
                                        type: fileType,
                                    };
                                    FILE_LIST.push(uploadedFiles);
                                }
                            });
                            $("#upload-files").val("");
                            previewImages();


                        }

                        $(".w3revbtnblock").removeClass('d-none');
                        $(".w3loadingblock").addClass('d-none');
                        $('.form__container').removeClass('pointnone');

                    },
                    error: function (xhr, status, error) {
                        console.error(xhr.responseText);
                    }
                });

            }
        });


        $(document).on("click", ".js-remove-image .deleteicon", function (event) {
            const fileIndex = $(this).parents('.js-remove-image').data('index');
            const deleteFileName = imageAndVideoFiles[fileIndex];

            FILE_LIST.splice(fileIndex, 1);
            imageAndVideoFiles.splice(fileIndex, 1);

            $.ajax({
                type: 'POST',
                url: $("#review_submit_btn_form").attr('action'),
                data: {
                    actionType: "deleteDocuments",
                    deleteFileName: deleteFileName,
                    shop_domain: shop_domain
                },
                success: function (response) {
                    $("#file_objects").val(imageAndVideoFiles.join(','));
                    $(".uploadDocError").addClass('d-none');
                    previewImages();
                },
                error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });

        });

        let mediaRecorder;
        let recordedChunks = [];
        let stream;
        let recordedBlob;
        async function startRecording() {
            try {

                stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                    },
                    video: { width: 1920, height: 1080 }
                });
                $('#record_video_el').prop('srcObject', stream);

                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };
                mediaRecorder.onstop = () => {
                    recordedBlob = new Blob(recordedChunks, { type: 'video/mp4' });
                    const url = URL.createObjectURL(recordedBlob);
                    $('#record_video_el').prop('src', url).prop('controls', true).get(0).play();
                    recordedChunks = [];
                };

                mediaRecorder.start();

            } catch (err) {
                console.error('Error accessing media devices.', err);
            }
        }

        function stopRecording() {
            $('#record_video_el').prop('srcObject', null);
            $("#stopVideoRecording").hide();
            $("#startVideoRecordingAgain").show();

            mediaRecorder.stop();

            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }

        $(document).on('click', '#showRecordVideoModal', function () {
            $('#record_video_el').prop('src', null).prop('controls', false);
            $("#record_review_video_modal").modal("show");
            $('#startVideoRecording').show();
            $('#submitVideoRecording').hide();
            $('#stopVideoRecording').hide();
            $("#uploadingVideoRecording").hide();

        });

        $(document).on('click', '#startVideoRecording', function () {
            $(this).hide();
            $('#record_video_el').prop('src', null).prop('controls', false);
            startRecording();
            $('#submitVideoRecording').hide();
            $('#stopVideoRecording').show();

        });



        $(document).on('click', '#stopVideoRecording', function () {
            stopRecording();
            $('#submitVideoRecording').show();
            $('#startVideoRecording').show();
        });

        $(document).on('click', '#submitVideoRecording', function () {
            let $this = $(this);
            let formData = new FormData($('#review_submit_btn_form')[0]);
            formData.append("actionType", "uploadVideoRecording");
            formData.append("video_record", recordedBlob, 'recording.mp4');
            formData.append("shop_domain", shop_domain);

            let reviewUrl = $("#review_submit_btn_form").attr('action');
            $this.hide();
            $("#startVideoRecording").hide();
            $("#uploadingVideoRecording").show();

            $.ajax({
                type: 'POST',
                url: reviewUrl,
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    $.each(response, function (index, item) {
                        imageAndVideoFiles.push(item);
                    });
                    $("#file_objects").val(imageAndVideoFiles);
                    $("#record_review_video_modal").modal("hide");

                    const fileURL = URL.createObjectURL(recordedBlob);
                    const fileName = recordedBlob.name;
                    const fileType = recordedBlob.type;
                    const uploadedFiles = {
                        name: fileName,
                        url: fileURL,
                        type: fileType,
                    };
                    FILE_LIST.push(uploadedFiles);
                    previewImages();
                    $("#uploadingVideoRecording").hide();
                    $this.show();

                },
                error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });

        });

        $(document).on('hide.bs.modal', '#record_review_video_modal', function () {

            const videoElement = $('#record_video_el').get(0);
            if (videoElement) {
                videoElement.pause();
                videoElement.src = '';
                videoElement.srcObject = null;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        });


        function responseMessage(msg) {
            jQuery(".success-box").fadeIn(200);
            jQuery(".success-box div.text-message").html("<span>" + msg + "</span>");
        }


        $(document).on('click', '.check-answer', function () {
            $(this).parents(".reviewsteps").find('.nextbtn').removeClass('d-none');
        });

        $(document).on('keyup', '.review-description', function () {
            if (typeof $(this).val() == 'undefined' || $.trim($(this).val()) == "") {
                $(this).parents(".reviewsteps").find('.nextbtn').attr('disabled', 'disabled');
            } else {
                $(this).parents(".reviewsteps").find('.nextbtn').removeAttr('disabled');
            }
        });


        $(document).on('click', '.continueBtn', function () {
            window.location.reload();
        });

        var page = 1;
        var settings_vars = $("#display-widget-component").data('product-settings') || {};
        const product_id = $("#display-widget-component").data('product-id');
        const shop_domain = $("#display-widget-component").data('shop-domain');
        const product_url = $("#display-widget-component").data('product-url');
        const product_title = $("#display-widget-component").data('product-title');
        const cust_first_name = $("#display-widget-component").data('cust-first_name');
        const cust_last_name = $("#display-widget-component").data('cust-last_name');
        const cust_email = $("#display-widget-component").data('cust-email');
        const customer_locale = $("#display-widget-component").data('customer-locale');
        const cart_count = $("#display-widget-component").data('cust-cart-count');

        var masonryObj;
        let hideProductWidget = false;
        if (settings_vars && typeof settings_vars.hide_when_empty !== "undefined" && settings_vars.hide_when_empty == true) {
            if (typeof cart_count != "undefined" && cart_count == 0) {
                hideProductWidget = true;
            }
        }
        if (!hideProductWidget) {
            loadReviews(page);
        }


        function loadReviews(page) {
            var filter_by_ratting = $("#ratting_wise_filter").val();
            var sort_by = $("#sort_by_filter").val();
            $.ajax({
                type: 'POST',
                url: `/apps/w3-proxy/widget`,
                data: {
                    no_of_review: settings_vars.no_of_review_per_page,
                    show_image_reviews: settings_vars.show_image_reviews,
                    hide_product_thumbnails: settings_vars.hide_product_thumbnails,
                    show_all_reviews: settings_vars.show_all_reviews,
                    filter_by_ratting: filter_by_ratting,
                    sort_by: sort_by,
                    page: page,
                    product_id: product_id,
                    shop_domain: shop_domain,
                    customer_locale: customer_locale
                },
                dataType: "json",
                beforeSend: function () {
                    $('#load_more_review').hide();
                    $('#w3loadingmorerws').show();
                },
                success: function (response) {
                    if (page == 1) {
                        $("#display-widget-component").html(response.body);
                        var $initialItems = $('.main_review_block');
                        $initialItems.imagesLoaded(function () {
                            masonryObj = $initialItems.masonry({
                                itemSelector: '.w3grid-review-item',
                                columnWidth: '.w3grid-review-item',
                                percentPosition: true
                            });
                        });

                    } else {
                        var $newItems = $(response.body);
                        $(".main_review_block").append($newItems);

                        $newItems.imagesLoaded(function () {
                            $('.main_review_block').masonry('appended', $newItems).masonry('layout');
                        });
                    }
                    $('#load_more_review').show();
                    $('#w3loadingmorerws').hide();
                    if (response.hasMore == 0) {
                        $("#load_more_review").hide();
                    }
                },
                error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });
        }
        $(document).on("click", "#show_create_review_modal", function (e) {
            e.preventDefault();
            var $this = $(this);

            if ($this.data('requestRunning')) {
                return;
            }
            $this.data('requestRunning', true);

            $.ajax({
                type: 'POST',
                url: `/apps/w3-proxy/widget`,
                data: {
                    product_id: product_id,
                    shop_domain: shop_domain,
                    cust_first_name: cust_first_name,
                    cust_last_name: cust_last_name,
                    cust_email: cust_email,
                    customer_locale: customer_locale,
                    actionType: 'openModal'
                },
                dataType: "json",
                success: function (response) {
                    imageAndVideoFiles = [];
                    FILE_LIST = [];

                    $("#createReviewModal").remove();

                    var modal_html = response.htmlModalContent;
                    $("body").append(modal_html);

                    $("#createReviewModal").modal("show");
                },
                error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                },
                complete: function () {
                    $this.data('requestRunning', false);
                }
            });

        });


        $(document).on("click", ".product_widget_w3grid-review-item", function () {
            var $this = $(this);

            if ($this.data('requestRunning')) {
                return;
            }
            $this.data('requestRunning', true);

            reviewId = $(this).data('reviewid');
            $.ajax({
                type: 'POST',
                url: `/apps/w3-proxy/widget`,
                data: {
                    reviewId: reviewId,
                    actionType: 'openReviewDetailModal',
                    shop_domain: shop_domain,
                    hide_product_thumbnails: settings_vars.hide_product_thumbnails,
                    customer_locale: customer_locale
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
                },
                complete: function () {
                    $this.data('requestRunning', false);
                }
            });
        });
        $(document).on("click", "#load_more_review", function (e) {
            e.preventDefault();
            page = page + 1;
            loadReviews(page);
        });
        $(document).on("submit", "#review_submit_btn_form", function (e) {
            e.preventDefault();
            var _this = $(this);
            $('.error').text('');
            var firstName = $.trim($('#first_name').val());
            var lastName = $.trim($('#last_name').val());
            var emailfield = $.trim($('#emailfield').val());
            var isValid = true;
            if (firstName === '') {
                $('#firstNameError').text('First name is required.');
                isValid = false;
            }
            if (lastName === '') {
                $('#lastNameError').text('Last name is required.');
                isValid = false;
            }
            if (emailfield === '') {
                $('#emailError').text('Email is required.');
                isValid = false;
            } else if (!validateEmail(emailfield)) {
                $('#emailError').text('Please enter a valid email address.');
                isValid = false;
            }
            if (isValid) {
                var formData = new FormData($(this)[0]);
                if (formData.get('description') == "") {
                    formData.delete('description');
                    formData.append('description', 'N/A');
                }
                formData.append('shop_domain', shop_domain);
                formData.append('product_id', product_id);
                formData.append('product_title', product_title);
                formData.append('product_url', product_url);
                formData.append('customer_locale', customer_locale);
                var reviewUrl = $(this).attr('action');
                $.ajax({
                    type: 'POST',
                    url: reviewUrl,
                    data: formData,
                    contentType: false,
                    processData: false,
                    beforeSend: function () {
                        _this.find('.submitBtn').attr('disabled', 'disabled');
                    },
                    success: function (response) {
                        $(".reviewsteps").addClass('d-none');
                        $("#thankyou-page-content").removeClass('d-none');
                        $("#thankyou-page-content").html(response.content);
                    },
                    error: function (xhr, status, error) {
                        console.error(xhr.responseText);
                    }
                });
            }
        });
        function validateEmail(email) {
            var re = /^[\w+-.]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
            return re.test(email);
        }
        $(document).on("click", ".dropdown-menu .product_widget_stardetailrow,.stardetaildd .product_widget_stardetailrow", function (e) {

            var ratingNumber = $(this).find('.sratnumber').text();
            var haveReview = $(this).find('.sratnumber').data('review');
            if (parseInt(haveReview) > 0) {
                $("#ratting_wise_filter").val(ratingNumber);
                page = 1;
                loadReviews(page);
            }
        });
        $(document).on("click", ".dropdown-menu .sort_by_filter", function (e) {
            e.preventDefault();
            var sortType = $(this).data('sort');
            $("#sort_by_filter").val(sortType);
            page = 1;
            loadReviews(page);
        });
        $(document).on("click", "#copy-button", function () {
            var discountCode = $('#discount-code').text();
            navigator.clipboard.writeText(discountCode).then(function () {
                $('#copy-message').fadeIn().delay(1000).fadeOut();
            }).catch(function (error) {
                console.error('Failed to copy text: ', error);
            });
        });
    });

}