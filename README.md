# Parallax ImageScroll - jQuery plugin

JQuery and amd compatible plugin to create a parallax effect with images. Heavily inspired by the [spotify.com](https://www.spotify.com) website.

The plugin is really simple to use with some options to tweek. It makes use of css3 transform for animation where supported and falls back to top and left positioning for ancient browsers.

[Check out the live demo](http://codepen.io/pederan/full/Hheuy). (No parallax effect and smaller image sizes for touch devices, see Touch section for details.)

### Markup

Markup can consist of as many image elements as you want, but you should seperate them with a content block, e.g. a section.

```html
<div class="img-holder" data-image="anImage.jpg" data-width="1600" data-height="900"></div>
<section><p>Content that "slides" on top of the images</p></section>
<div class="img-holder" data-image="anotherImage.jpg" data-width="1600" data-height="900"></div>
```

You can use html5 data attributes for all the options listed below or set the options in javascript

### Initialization

To initialize the plugin, apply them to the elements you want
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

You can configure the default options, by passing an option object to the plugin, like this
```javascript
$('.img-holder').imageScroll({
    coverRatio: 0.5
});
```

or set the options globally (only works when using with amd)

```javascript
ImageScroll.defaults.coverRatio = 0.5;
```

Configurable options are:
* **image**: The image to show (default = null)
* **imageAttribute**: The data attribute name for images. Uses the value of this attribute to load the image (default = 'image')
* **container**: The element to which the parallax image(s) will be attached to (default = $('body'))
* **speed**: The speed of the parallax effect. A floating number between 0 and 1, where a higher number will move the images faster upwards (default = 0.2)
* **coverRatio**: How many percent of the screen each image should cover (default = 0.75)
* **holderMinHeight**: The minimum height of the image in pixels (default = 200)
* **extraHeight**: Extra height added to the image. Can be useful if you want to show more of the top image (default = 0)
* **mediaWidth**: The original width of the image (default = 1600)
* **mediaHeight**: The original height of the image (default = 900)
* **parallax**: Whether or not you want the parallax effect, e.g. does not work very well in ancient browsers (default = true)
* **touch**: Presents a mobile/tablet friendy version, no parallax effect and smaller images (should be used with a mobile/tablet optimized images) (default = false)


### Touch

The effect is not very smooth on a touch device. You could therefore present the user with a fallback version, which displays the images with no parallax effect. You can do so checking for touch (e.g. with Modernizr) and set dynamic options to adjust to this.
```javascript
var touch = Modernizr.touch;
$('.img-holder').imageScroll({
    imageAttribute: (touch === true) ? 'image-mobile' : 'image',
    touch: touch
});
```

### Requirements

jQuery version 1.8.0 or higher

### Limitations

Does not work very well on mobile or IE <= 9. Solution: check for touch and set touch option to true.

### MIT

MIT licensed
