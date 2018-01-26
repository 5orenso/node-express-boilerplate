$(document).ready(function () {

    // Add listeners to main menu
    // navbar-nav nav-link
    $('.navbar-nav .nav-item').each(function( index ) {
        // console.log(index + ": " + $(this).text());
        $(this).click(function() {
            $('.navbar-nav .nav-item').removeClass("active");
            $(this).addClass('active');
        });
    });

    $('.nav .nav-link').each(function( index ) {
        // console.log(index + ": " + $(this).text());
        $(this).click(function() {
            $('.nav .nav-link').removeClass("active");
            $(this).addClass('active');
        });
    });


});
