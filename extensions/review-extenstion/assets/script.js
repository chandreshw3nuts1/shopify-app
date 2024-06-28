var imageAndVideoFiles = [];
var FILE_LIST = [];

$(document).ready(function(){
        /* 1. Visualizing things on Hover - See next part for action on click */
        jQuery("#stars li").on("mouseover", function () {
            var onStar = parseInt(jQuery(this).data("value"), 10); // The star currently mouse on
            console.log(onStar);
            jQuery(this).parent().removeClass("hover-1 hover-2 hover-3 hover-4 hover-5");
            jQuery(this).parent().addClass(`hover-${onStar}`);
            // Now highlight all the stars that's not after the current hovered star
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

        /* 2. Action to perform on click */
        $(document).on("click", "#stars li", function () {
            var onStar = parseInt(jQuery(this).data("value"), 10); // The star currently selected
            var stars = jQuery(this).parent().children("li.star");

            for (i = 0; i < stars.length; i++) {
                jQuery(stars[i]).removeClass("selected");
            }

            for (i = 0; i < onStar; i++) {
                jQuery(stars[i]).addClass("selected");
            }

            // JUST RESPONSE (Not needed)
            var ratingValue = parseInt(
                jQuery("#stars li.selected").last().data("value"), 10,
            );
            
            jQuery(this).parent().removeClass('star-1 star-2 star-3 star-4 star-5');
            jQuery(this).parent().addClass(`star-${ratingValue}`);

            jQuery('.success-box').removeClass('star-1 star-2 star-3 star-4 star-5');
            jQuery('.success-box').addClass(`star-${ratingValue}`);
            
            var msg = "";
            /* if (ratingValue > 1) {
                msg = "Thanks! You rated this " + ratingValue + " stars.";
            } else {
                msg = "We will improve ourselves. You rated this " + ratingValue + " stars.";
            } */
            if (ratingValue == 5) {
                msg = "Awesome Product!";
            } else if ( ratingValue == 4) {
                msg = "Good Product!";
            } else if ( ratingValue == 3) {
                msg = "Okay!";
            } else if ( ratingValue == 2) {
                msg = "Bad!";
            } else {
                msg = "Terrible!";
            }
            responseMessage(msg);
            jQuery('#review_rating').val(ratingValue);
                    
            
            let parentDiv = jQuery(this).parents('.reviewsteps');
            console.log(parentDiv);
            jQuery(parentDiv).removeClass('activestep');
            jQuery(parentDiv).addClass('d-none');
            jQuery(parentDiv).next().removeClass('d-none');
        });


        // let starLink = jQuery('.rating-stars ul > li.star');
        // jQuery(starLink).each(function(){
        //     alert('dsads');
        //     jQuery(this).on('click', function(){
        //         let parentDiv = jQuery(this).parents('.reviewsteps');
        //         console.log(parentDiv);
        //         jQuery(parentDiv).removeClass('activestep');
        //         jQuery(parentDiv).addClass('d-none');
        //         jQuery(parentDiv).next().removeClass('d-none');
        //     });
        // });

        let popNextBtn = jQuery('.modal .reviewsteps .nextbtn');
        let popBackBtn = jQuery('.modal .reviewsteps .backbtn');

        $(document).on("click", ".modal .reviewsteps .nextbtn", function(e){
            e.preventDefault();
            let parentDiv = jQuery(this).parents('.reviewsteps');
            jQuery(parentDiv).addClass('d-none');
            jQuery(parentDiv).removeClass('activestep');
            jQuery(parentDiv).next().removeClass('d-none');
            jQuery(parentDiv).next().addClass('activestep');
        });

        $(document).on("click", ".modal .reviewsteps .backbtn", function(e){
            e.preventDefault();
            let parentDiv = jQuery(this).parents('.reviewsteps');
            jQuery(parentDiv).addClass('d-none');
            jQuery(parentDiv).removeClass('activestep');
            jQuery(parentDiv).prev().removeClass('d-none');
            jQuery(parentDiv).prev().addClass('activestep');
        });
        
        /* Upload Script : Start */

    
        // SVG icon for delete button
        var DeleteBin = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.5 8.38797C15.5575 8.18997 13.6033 8.08797 11.655 8.08797C10.5 8.08797 9.345 8.14797 8.19 8.26797L7 8.38797M10.2083 7.78199L10.3367 6.99599C10.43 6.426 10.5 6 11.4858 6H13.0142C14 6 14.0758 6.45 14.1633 7.00199L14.2917 7.78199M16.2458 10.2841L15.8666 16.326C15.8024 17.268 15.7499 18 14.1224 18H10.3774C8.74994 18 8.69744 17.268 8.63328 16.326L8.25411 10.2841M11.2759 14.6999H13.2184M10.7917 12.3H13.7083" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    
        // Function to preview uploaded images/videos
        var previewImages = function() {
            $('#files-list-container').html('');
            if (FILE_LIST.length > 0) {
                $('.filesupload_wrap').addClass('morethanone');

                $.each(FILE_LIST, function(index, addedFile) {

                    var content = '<div class="listbox"><div class="form__image-container js-remove-image" data-index="' + index + '">';
                    if (addedFile.type.match("video/")) {
                        content += '<video><source src="' + addedFile.url + '" type="video/mp4"></video>';
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

        $(document).on("change", "#upload-files", function(event){
            if (this.files.length > 5 || parseInt(FILE_LIST.length + this.files.length) >5) {
               $(".uploadDocError").removeClass('d-none');

            } else {
               $(".uploadDocError").addClass('d-none');
                
                let formData = new FormData($('#review_submit_btn_form')[0]);
                formData.append("actionType", "uploadDocuments");
                let reviewUrl = $("#review_submit_btn_form").attr('action');

                $.ajax({
                    type: 'POST',
                    url: reviewUrl,
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(response) {
                        $.each(response, function(index, item) {
                            imageAndVideoFiles.push(item);
                        });
                        $("#file_objects").val(imageAndVideoFiles);
                    },
                    error: function(xhr, status, error) {
                        console.error(xhr.responseText);
                    }
                });
                var files = event.target.files;

                $.each(files, function(index, file) {
                    const fileURL = URL.createObjectURL(file);
                    const fileName = file.name;
                    const fileType = file.type;
                    if (!file.type.match("image/") && !file.type.match("video/")) {
                        alert(file.name + " is not an image");
                        console.log(file.type);
                    } else {
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
        });


        // remove files
        $(document).on("click", ".js-remove-image .deleteicon", function(event){
            const fileIndex = $(this).parents('.js-remove-image').data('index');
            const deleteFileName = imageAndVideoFiles[fileIndex];

            // Assuming FILE_LIST and imageAndVideoFiles are globally accessible arrays
            console.log(FILE_LIST);
            FILE_LIST.splice(fileIndex, 1);
            imageAndVideoFiles.splice(fileIndex, 1);
            console.log(FILE_LIST);

            // Perform AJAX call using jQuery
            $.ajax({
                type: 'POST',
                url: $("#review_submit_btn_form").attr('action'),
                data: {
                    actionType: "deleteDocuments",
                    deleteFileName: deleteFileName
                },
                success: function(response) {
                    $("#file_objects").val(imageAndVideoFiles.join(','));
                    $(".uploadDocError").addClass('d-none');
                    previewImages();
                },
                error: function(xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });

        });
        
});

function responseMessage(msg) {
    jQuery(".success-box").fadeIn(200);
    jQuery(".success-box div.text-message").html("<span>" + msg + "</span>");
}


/* Upload script : End */
$(document).on('click','.check-answer', function() {
    $(this).parents(".reviewsteps").find('.nextbtn').removeClass('d-none');
});

$(document).on('keyup','.review-description', function() {
    if(typeof $(this).val() == 'undefined' || $.trim($(this).val()) == "" ) {
        $(this).parents(".reviewsteps").find('.nextbtn').addClass('d-none');
    } else {
        $(this).parents(".reviewsteps").find('.nextbtn').removeClass('d-none');
    }
});


$(document).on('click','.continueBtn', function() {
    window.location.reload();
});



var page = 1;
// console.log($("#display-widget-component").data('product-id'));
var settings_vars = $("#display-widget-component").data('product-settings');
const product_id = $("#display-widget-component").data('product-id');
const shop_domain = $("#display-widget-component").data('shop-domain');
const product_url = $("#display-widget-component").data('product-url');
const product_title = $("#display-widget-component").data('product-title');
//{{ block.settings | json }};
$(document).ready(function(){
	loadReviews(page);
});

function loadReviews(page){
	$.ajax({
        type: 'POST',
        url: `/apps/custom-proxy/widget`,
        data: {
			no_of_review: settings_vars.no_of_review_per_page,
			show_image_reviews: settings_vars.show_image_reviews,
			hide_product_thumbnails: settings_vars.hide_product_thumbnails,
			show_all_reviews: settings_vars.show_all_reviews,
			page: page,
            product_id : product_id,
			shop_domain : shop_domain
		},
		dataType : "json",
        success: function(response) {
			if(page == 1) {
	            $("#display-widget-component").html(response.body);
			} else {
	            $(".main_review_block").append(response.body);
			}
            if(response.hasMore == 0) {
                $("#load_more_review").hide();
            }
			//var modal_html = response.htmlModalContent;
			//$("body").append(modal_html);
		},
        error: function(xhr, status, error) {
            // Handle errors
            console.error(xhr.responseText);
        }
    });
}
$(document).on("click", "#show_create_review_modal",  function() {

    $.ajax({
        type: 'POST',
        url: `/apps/custom-proxy/widget`,
        data: {
            product_id : product_id,
			shop_domain : shop_domain,
			actionType : 'openModal'
		},
		dataType : "json",
        success: function(response) {
            imageAndVideoFiles = [];
            FILE_LIST = [];
    
			$("#createReviewModal").remove();

            var modal_html = response.htmlModalContent;
			$("body").append(modal_html);

            $("#createReviewModal").modal("show");
		},
        error: function(xhr, status, error) {
            // Handle errors
            console.error(xhr.responseText);
        }
    });


	
});

$(document).on("click", ".review-list-item",  function() {
    reviewId = $(this).data('reviewid');
    $.ajax({
        type: 'POST',
        url: `/apps/custom-proxy/widget`,
        data: {
            reviewId : reviewId,
			actionType : 'openReviewDetailModal',
			shop_domain : shop_domain
		},
		dataType : "json",
        success: function(response) {
            
			$("#staticBackdrop").remove();
            var modal_html = response.body;
			$("body").append(modal_html);

            $("#staticBackdrop").modal("show");
		},
        error: function(xhr, status, error) {
            // Handle errors
            console.error(xhr.responseText);
        }
    });
    
});
    $(document).on("click", "#load_more_review",  function() {
	page = page +1;
	loadReviews(page);
});

$(document).on("submit", "#review_submit_btn_form",  function(e) {
  	e.preventDefault();
    var _this = $(this);

    $('.error').text('');
    // Get the form values
    var firstName = $.trim($('#first_name').val());
    var lastName = $.trim($('#last_name').val());
    var emailfield = $.trim($('#emailfield').val());

    var isValid = true;

    // Validate first name
    if (firstName === '') {
        $('#firstNameError').text('First name is required.');
        isValid = false;
    }

    // Validate last name
    if (lastName === '') {
        $('#lastNameError').text('Last name is required.');
        isValid = false;
    }

    // Validate email
    if (emailfield === '') {
        $('#emailError').text('Email is required.');
        isValid = false;
    } else if (!validateEmail(emailfield)) {
        $('#emailError').text('Please enter a valid email address.');
        isValid = false;
    }
    if(isValid) {
        var formData = new FormData($(this)[0]);
        formData.append('shop_domain', shop_domain);
        formData.append('product_id', product_id);
        formData.append('product_title', product_title);
        formData.append('product_url', product_url);

        var reviewUrl = $(this).attr('action');
        $.ajax({
            type: 'POST',
            url: reviewUrl,
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function() {
                _this.find('.submitBtn').attr('disabled', 'disabled');
            },
            success: function(response) {
                $(".reviewsteps").addClass('d-none');
                $(".thankyou-page").removeClass('d-none');
            },
            error: function(xhr, status, error) {
                // Handle errors
                console.error(xhr.responseText);
            }
        });
    }
	
    
});

function validateEmail(email) {
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}
