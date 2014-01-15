/**
 * Author: Peder A. Nielsen
 * Date: 05.12.13
 * Company: Making Waves
 */
require.config({
    baseUrl: '../',
    paths: {
        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min'
    }
});

require(['jquery.imageScroll'], function (ImageScroll) {
    ImageScroll.defaults.speed = .2;
    $('.img-holder').each(function () {
        new ImageScroll(this, {}).init();
    });
    //or
    //$('.img-holder').imageScroll();
});