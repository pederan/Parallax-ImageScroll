# Parallax ImageScroll - jQuery plugin

JQuery and amd compatible plugin to create a parallax effect with images. Heavily inspired by the [spotify.com](https://www.spotify.com) website.

The plugin is really simple to use with some options to tweek. It makes use of css3 transform for animation where supported and falls back to top and left positioning for ancient browsers.

[Check out the live demo](http://codepen.io/pederan/full/Hheuy). (No parallax effect and smaller image sizes for touch devices, see Touch section for details.)

### Markup

Markup can consist of as many image elements as you want, but you should separate them with a content block, e.g. a section.

```html
<div class="img-holder" data-image="anImage.jpg"></div>
<section><p>Content that "slides" on top of the images</p></section>
<div class="img-holder" data-image="anotherImage.jpg">[optional content to be displayed on top of the images]</div>
```

You can set parameters using html5 data attributes or with javascript, see options section for details.

### Initialization

To initialize the plugin, call the imageScroll method on your image elements
```javascript
$('.img-holder').imageScroll();
```

### AMD

The plugin is AMD compatible. To use with e.g. RequireJS, you can do this. See demo files for example.
```javascript
require(['jquery.imageScroll'], function (ImageScroll) {
    $('.img-holder').each(function () {
        new ImageScroll(this).init();
    });
});
```

### Options

You can configure the default options, by passing an option object to the plugin
```javascript
$('.img-holder').imageScroll({
    coverRatio: 0.5
});
```

or set the options via data attributes, data-*optionname* (available options: image, width (mediaWidth), height (mediaHeight), cover-ratio (coverRatio), extra-height (extraHeight)
```html
<div class="img-holder" data-image="anImage.jpg" data-cover-ratio="0.5"></div>
```

or set the options globally (only works when using with amd)
```javascript
ImageScroll.defaults.coverRatio = 0.5;
```

Configurable options are:
* ```image: null``` (**required**) The image to show
* ```imageAttribute: 'image'```: The data attribute name for images. Uses the value of this attribute to load the image
* ```container: $('body')``` The element to which the parallax image(s) will be attached to
* ```speed: 0.2``` The speed of the parallax effect. A floating number between 0 and 1, where a higher number will move the images faster upwards
* ```coverRatio: 0.75 //75%``` How many percent of the screen each image should cover
* ```holderClass: 'imageHolder'``` Class added to the image holder(s)
* ```holderMinHeight: 200``` The minimum height of the image in pixels
* ```extraHeight: 0``` Extra height added to the image. Can be useful if you want to show more of the top image
* ```mediaWidth: 1600``` The original width of the image
* ```mediaHeight: 900``` The original height of the image
* ```parallax: true``` Whether or not you want the parallax effect, e.g. does not work very well in ancient browsers
* ```touch: false``` Presents a mobile/tablet friendy version, no parallax effect and smaller images (should be used with a mobile/tablet optimized images)


### Touch

The effect is not very smooth on a touch device. You could therefore present the user with a fallback version, which displays the images with no parallax effect. You can do so by checking for touch (e.g. with Modernizr) and set dynamic options to adjust to this.
```javascript
var touch = Modernizr.touch;
$('.img-holder').imageScroll({
    imageAttribute: (touch === true) ? 'image-mobile' : 'image',
    touch: touch
});
```

### Installation

Install using bower
```sh
bower install Parallax-ImageScroll
```

### Requirements

jQuery version 1.8.0 or higher

### Notes

If you add content on top of the parallaxed image, make sure to apply a higher z-depth for the content (applies for browsers that support 3d transforms).
Example:

```html
<div class="img-holder" data-image="anotherImage.jpg"><p style="-webkit-transform: translateZ(1px)">Hello world!</p></div>
```

### Limitations

Does not work very well on mobile or IE <= 9. You can then present a fallback solution by disabling parallax for ancient desktop browser (set parallax option to false) and present touch optimized images for touch devices (set touch option to true).

### MIT

MIT licensed
