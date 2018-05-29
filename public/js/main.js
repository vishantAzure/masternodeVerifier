/* Burger Nav */
jQuery(function($) {

    // Fakes the loading setting a timeout
    setTimeout(function() {
        $('body').addClass('loaded');
    }, 1500);

});

// Bootstrap tooltip
jQuery(function($) {
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    });
});

//HeroUnit Animation
jQuery(function($) {

    var motion_path_animate_time = 100; // lower makes more bouncey
    var cell_animation_time = 13; // left to right time, in seconds
    var cell_animation_time_variance = 6; // cell_animation_time +/- this, in seconds
    var total_cells = 60; // how many cells, more may hamper frame rate (includes rings)
    var total_ring_cells = 20; // total amount of rings, must be smaller than total cells
// random number
    function randomNumber(max) {
        return Math.floor(Math.random() * max) + 1;
    }
// set up
    var cells_html = "";
    var ring_cells_html = "";
    var motion_paths_html = "";
    var mp = '<path id="mp_{{id}}" d="M-20 10  Q 400 140, 800 130 Q 1000 130, 1220 160"><animate dur="{{duration}}s" begin="{{begin}}s" repeatCount="indefinite" attributeName="d" values="M-20 360 Q 400 320, 800 260 Q 1000 230, 1220 255; M-20 10  Q 400 140, 800 130 Q 1000 130, 1220 160; M-20 360 Q 400 320, 800 260 Q 1000 230, 1220 255;"/></path>';
    var cell = '<g><animateMotion dur="{{duration}}s" repeatCount="indefinite" begin="{{begin}}s"><mpath xlink:href="#mp_{{id}}"/></animateMotion><circle cx="0" cy="0" r="10"></circle></g>';
    var ring_cell = '<g><animateMotion dur="{{duration}}s" repeatCount="indefinite" begin="{{begin}}s"><mpath xlink:href="#mp_{{id}}"/></animateMotion><circle cx="0" cy="0" r="10"></circle><circle cx="0" cy="0" r="8"></circle></g>';
//
    var cell_animation_time_min = cell_animation_time - cell_animation_time_variance;
    var cell_animation_time_max = cell_animation_time + cell_animation_time_variance;
    var cell_animation_time_max_diff = cell_animation_time_max - cell_animation_time_min;
// generate
    for (var i = 0; i < total_cells; i++) {
        var this_mp_begin = randomNumber(motion_path_animate_time * 100) / -50;
        var this_mp_html = mp.replace("{{id}}",(i+1)).replace("{{begin}}",this_mp_begin).replace("{{duration}}",motion_path_animate_time);
        motion_paths_html += this_mp_html;
        //
        var this_cell_begin = randomNumber(100) / (cell_animation_time * -1);
        var this_cell_animate_time = (randomNumber(cell_animation_time_max_diff * 500) + (cell_animation_time_min * 100)) / 100;
        var this_cell_html = '';
        if (i < (total_cells - total_ring_cells)) {
            this_cell_html = cell.replace("{{id}}",(i+1)).replace("{{begin}}",this_cell_begin).replace("{{duration}}",this_cell_animate_time);
            cells_html += this_cell_html;
        } else {
            this_cell_html = ring_cell.replace("{{id}}",(i+1)).replace("{{begin}}",this_cell_begin).replace("{{duration}}",this_cell_animate_time);
            ring_cells_html += this_cell_html;
        }
    }
// append
    document.querySelectorAll(".funnel_paths")[0].innerHTML += motion_paths_html;
    document.querySelectorAll(".funnel_cells")[0].innerHTML += cells_html;
});

// Sticky Menu
jQuery(function($) {

    var $nav = $('nav'),
        $win = $(window),
        winH = $win.height();    // Get the window height.

    $win.on("scroll", function () {
        $nav.toggleClass("sticky", $(this).scrollTop() > winH );
    }).on("resize", function(){ // If the user resizes the window
        winH = $(this).height(); // you'll need the new height value
    });

});

//FAQ
(function($) {
    var timing = 300;

    $('#FAQ .faq-q').click(function () {
        if ($(this).children('.faq-a').hasClass('openFAQ')) {
            $(this).children('.faq-a').removeClass('openFAQ').addClass('closedFAQ').slideUp(timing);
        } else if ($('.faq-a').hasClass('openFAQ')) {
            $('.faq-a').removeClass('openFAQ').addClass('closedFAQ').slideUp(timing);
            $(this).children('.faq-a').removeClass('closedFAQ').addClass('openFAQ').slideDown(timing);
        } else {
            $(this).children('.faq-a').removeClass('closedFAQ').addClass('openFAQ').slideDown(timing);
        }
    });
})(jQuery);

//Placeholder
$(document).ready(function() {
    // Test for placeholder support
    $.support.placeholder = (function(){
        var i = document.createElement('input');
        return 'placeholder' in i;
    })();

    // Hide labels by default if placeholders are supported
    if($.support.placeholder) {
        $('.form-label').each(function(){
            $(this).addClass('js-hide-label');
        });

        // Code for adding/removing classes here
        $('.form-group').find('input, textarea').on('keyup blur focus', function(e){

            // Cache our selectors
            var $this = $(this),
                $parent = $this.parent().find("label");

            if (e.type == 'keyup') {
                if( $this.val() == '' ) {
                    $parent.addClass('js-hide-label');
                } else {
                    $parent.removeClass('js-hide-label');
                }
            }
            else if (e.type == 'blur') {
                if( $this.val() == '' ) {
                    $parent.addClass('js-hide-label');
                }
                else {
                    $parent.removeClass('js-hide-label').addClass('js-unhighlight-label');
                }
            }
            else if (e.type == 'focus') {
                if( $this.val() !== '' ) {
                    $parent.removeClass('js-unhighlight-label');
                }
            }
        });
    }
})