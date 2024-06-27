jQuery(window).on('load', function () {
    
    setTimeout(function (){
        /* 1. Visualizing things on Hover - See next part for action on click */
        jQuery("#stars li").on("mouseover", function () {
            var onStar = parseInt(jQuery(this).data("value"), 10); // The star currently mouse on
            // console.log(onStar);
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
        jQuery("#stars li").on("click", function () {
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
            
        });
    }, 1000);
});

function responseMessage(msg) {
    jQuery(".success-box").fadeIn(200);
    jQuery(".success-box div.text-message").html("<span>" + msg + "</span>");
}


jQuery(window).on('load', function () {

    setTimeout(function (){
        let starLink = jQuery('.rating-stars ul > li.star');
        jQuery(starLink).each(function(){
            jQuery(this).on('click', function(){
                let parentDiv = jQuery(this).parents('.reviewsteps');
                console.log(parentDiv);
                jQuery(parentDiv).removeClass('activestep');
                jQuery(parentDiv).addClass('d-none');
                jQuery(parentDiv).next().removeClass('d-none');
            });
        });

        let popNextBtn = jQuery('.modal .reviewsteps .nextbtn');
        let popBackBtn = jQuery('.modal .reviewsteps .backbtn');

        jQuery(popNextBtn).each(function(){
            jQuery(this).on('click', function(e){
                e.preventDefault();
                let parentDiv = jQuery(this).parents('.reviewsteps');
                jQuery(parentDiv).addClass('d-none');
                jQuery(parentDiv).removeClass('activestep');
                jQuery(parentDiv).next().removeClass('d-none');
                jQuery(parentDiv).next().addClass('activestep');
            });
        });
        jQuery(popBackBtn).each(function(){
            jQuery(this).on('click', function(e){
                e.preventDefault();
                let parentDiv = jQuery(this).parents('.reviewsteps');
                jQuery(parentDiv).addClass('d-none');
                jQuery(parentDiv).removeClass('activestep');
                jQuery(parentDiv).prev().removeClass('d-none');
                jQuery(parentDiv).prev().addClass('activestep');
            });
        });
    }, 500);


});

jQuery(window).on('load', function () {
    setTimeout(function (){
        const myModalEl = document.getElementById('createReviewModal');
        console.log(myModalEl);
        let stepsDiv = jQuery('.addreviewpopup.modal .reviewsteps');
        let steps1Div = jQuery('.addreviewpopup.modal .reviewsteps.step-1');
        myModalEl.addEventListener('hidden.bs.modal', event => {
            // console.log('asdasdasdasdasd');
            jQuery(stepsDiv).each(function(){
                jQuery(this).addClass('d-none');
            });
            jQuery(steps1Div).removeClass('d-none');
        });
    }, 1500);
});


/* Upload Script : Start */

jQuery(window).on('load', function () {


    setTimeout(function (){
        const INPUT_FILE = document.querySelector('#upload-files');
        // console.log(INPUT_FILE);
    
        const INPUT_CONTAINER = document.querySelector('#upload-container');
        const FILES_LIST_CONTAINER = document.querySelector('#files-list-container');
        const FILE_LIST = [];
        let UPLOADED_FILES = [];

        const multipleEvents = (element, eventNames, listener) => {
        const events = eventNames.split(' ');
        
        events.forEach(event => {
            element.addEventListener(event, listener, false);
        });
        };

        const DeleteBin = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.5 8.38797C15.5575 8.18997 13.6033 8.08797 11.655 8.08797C10.5 8.08797 9.345 8.14797 8.19 8.26797L7 8.38797M10.2083 7.78199L10.3367 6.99599C10.43 6.426 10.5 6 11.4858 6H13.0142C14 6 14.0758 6.45 14.1633 7.00199L14.2917 7.78199M16.2458 10.2841L15.8666 16.326C15.8024 17.268 15.7499 18 14.1224 18H10.3774C8.74994 18 8.69744 17.268 8.63328 16.326L8.25411 10.2841M11.2759 14.6999H13.2184M10.7917 12.3H13.7083" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        const previewImages = () => {
            FILES_LIST_CONTAINER.innerHTML = '';
            if (FILE_LIST.length > 0) {
                jQuery('.filesupload_wrap').addClass('morethanone');
                FILE_LIST.forEach((addedFile, index) => {
                let content = `<div class="listbox"><div class="form__image-container js-remove-image" data-index="${index}">`
                if(addedFile.type.match("video/")) {
                    content+= `<video><source src="${addedFile.url}" type="video/mp4"></video>`
                } else {
                    content+= `<img class="form__image" src="${addedFile.url}" alt="${addedFile.name}">`
                }
                content+= `<div class="deleteicon">${DeleteBin}</div></div></div>`
                    
                FILES_LIST_CONTAINER.insertAdjacentHTML('beforeEnd', content);
                });
            } else {
                jQuery('.filesupload_wrap').removeClass('morethanone');
                console.log('empty')
                INPUT_FILE.value= "";
            }
        }

        const fileUpload = () => {
            if (FILES_LIST_CONTAINER) {
                multipleEvents(INPUT_FILE, 'click dragstart dragover', () => {
                    INPUT_CONTAINER.classList.add('active');
                });
            
                multipleEvents(INPUT_FILE, 'dragleave dragend drop change blur', () => {
                    INPUT_CONTAINER.classList.remove('active');
                });
            
                INPUT_FILE.addEventListener('change', () => {
                    const files = [...INPUT_FILE.files];
                    console.log("changed")
                    files.forEach(file => {
                        const fileURL = URL.createObjectURL(file);
                        const fileName = file.name;
                        const fileType = file.type;
                        if (!file.type.match("image/") && !file.type.match("video/")){
                            alert(file.name + " is not an image");
                            console.log(file.type)
                        } else {
                            const uploadedFiles = {
                                name: fileName,
                                url: fileURL,
                                type: fileType,
                            };
                            FILE_LIST.push(uploadedFiles);
                        }
                    });
                    
                    console.log(FILE_LIST)//final list of uploaded files
                    previewImages();
                    UPLOADED_FILES = document.querySelectorAll(".js-remove-image");
                    removeFile();
                }); 
            }
        };

        const removeFile = () => {
            UPLOADED_FILES = document.querySelectorAll(".js-remove-image");
            
            if (UPLOADED_FILES) {
                UPLOADED_FILES.forEach(image => {
                    image.addEventListener('click', function() {
                        const fileIndex = this.getAttribute('data-index');

                        FILE_LIST.splice(fileIndex, 1);
                        previewImages();
                        removeFile();
                    });
                });
            } else {
                [...INPUT_FILE.files] = [];
            }
        };

        fileUpload();
        removeFile();
    }, 1000);
});

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

