/**
 * Parallax ImageScroll - jQuery plugin
 * Author: Peder A. Nielsen
 * Created date: 04.12.13
 * Updated date: 07.06.14
 * Version: 0.1.4
 * Company: Making Waves
 * Licensed under the MIT license
 */
;
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(root.jQuery);
    }
}(this, function ($) {
    "use strict";

    var ImageScroll,
        defaults = {
            image: null,
            imageAttribute: 'image',
            holderClass: 'imageHolder',
            container: $('body'),
            speed: 0.2,
            coverRatio: 0.75,
            holderMinHeight: 200,
            extraHeight: 0,
            mediaWidth: 1600,
            mediaHeight: 900,
            parallax: true,
            touch: false
        },
        ImageScrollModernizr = {},
        docElement = document.documentElement,
        mod = 'imageScrollModernizr',
        modElem = document.createElement(mod),
        mStyle = modElem.style,
        omPrefixes = 'Webkit Moz O ms',
        cssomPrefixes = omPrefixes.split(' '),
        domPrefixes = omPrefixes.toLowerCase().split(' '),
        tests = {},
        $win = $(window),
        lastTickTime = 0,
        supportedFeature = '',
        transformProperty,
        injectElementWithStyles = function (rule, callback, nodes, testnames) {

            var style, ret, node, docOverflow,
                div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

            if (parseInt(nodes, 10)) {
                while (nodes--) {
                    node = document.createElement('div');
                    node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                    div.appendChild(node);
                }
            }

            style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
            div.id = mod;
            (body ? div : fakeBody).innerHTML += style;
            fakeBody.appendChild(div);
            if (!body) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
                docOverflow = docElement.style.overflow;
                docElement.style.overflow = 'hidden';
                docElement.appendChild(fakeBody);
            }

            ret = callback(div, rule);
            if (!body) {
                fakeBody.parentNode.removeChild(fakeBody);
                docElement.style.overflow = docOverflow;
            } else {
                div.parentNode.removeChild(div);
            }

            return !!ret;

        };

    function is(obj, type) {
        return typeof obj === type;
    }

    function contains(str, substr) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps(props, prefixed) {
        for (var i in props) {
            var prop = props[i];
            if (!contains(prop, "-") && mStyle[prop] !== undefined) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps(props, obj, elem) {
        for (var i in props) {
            var item = obj[props[i]];
            if (item !== undefined) {

                if (elem === false) return props[i];

                if (is(item, 'function')) {
                    return item.bind(elem || obj);
                }

                return item;
            }
        }
        return false;
    }

    function testPropsAll(prop, prefixed, elem) {
        var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
            props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        if (is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed);
        } else {
            props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
            return testDOMProps(props, prefixed, elem);
        }
    }

    tests['csstransforms'] = function () {
        return !!testPropsAll('transform');
    };

    tests['csstransforms3d'] = function () {

        var ret = !!testPropsAll('perspective');

        if (ret && 'webkitPerspective' in docElement.style) {

            injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#imageScrollModernizr{left:9px;position:absolute;height:3px;}}', function (node, rule) {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;
    };

    ImageScrollModernizr.prefixed = function (prop, obj, elem) {
        if (!obj) {
            return testPropsAll(prop, 'pfx');
        } else {
            return testPropsAll(prop, obj, elem);
        }
    };

    window.requestAnimationFrame = ImageScrollModernizr.prefixed('requestAnimationFrame', window) || function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTickTime));
        var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            },
            timeToCall);
        lastTickTime = currTime + timeToCall;
        return id;
    };

    if (tests['csstransforms3d']()) {
        supportedFeature = 'csstransforms3d';
    } else if (tests['csstransforms']()) {
        supportedFeature = 'csstransforms';
    }

    if (supportedFeature !== '') {
        transformProperty = ImageScrollModernizr.prefixed('transform');
    }

    ImageScroll = function (imageHolder, options) {
        return {
            init: function () {
                this.$imageHolder = $(imageHolder);
                this.settings = $.extend({}, defaults, options);
                this.image = this.$imageHolder.data(this.settings.imageAttribute) || this.settings.image;
                this.mediaWidth = this.$imageHolder.data('width') || this.settings.mediaWidth;
                this.mediaHeight = this.$imageHolder.data('height') || this.settings.mediaHeight;
                this.coverRatio = this.$imageHolder.data('cover-ratio') || this.settings.coverRatio;
                this.extraHeight = this.$imageHolder.data('extra-height') || this.settings.extraHeight;
                this.ticking = false;

                if (this.image) {
                    this.$scrollingElement = $('<img/>', {
                        src: this.image
                    });
                } else {
                    throw new Error('You need to provide either a data-img attr or an image option');
                }

                if (this.settings.touch === true) {
                    this.$scrollingElement.css({maxWidth: '100%'}).prependTo(this.$imageHolder);
                } else if (this.settings.parallax === true) {
                    this.$scrollerHolder = $('<div/>', {
                        html: this.$imageHolder.html()
                    }).css({
                        top: 0,
                        visibility: 'hidden',
                        position: 'fixed',
                        overflow: 'hidden'
                    }).addClass(this.settings.holderClass).prependTo(this.settings.container);
                    this.$imageHolder.css('visibility', 'hidden').empty();
                    this.$scrollingElement.css({position: 'absolute', visibility: 'hidden', maxWidth: 'none'}).prependTo(this.$scrollerHolder);
                } else {
                    this.$scrollerHolder = this.$imageHolder.css({overflow: 'hidden'});
                    this.$scrollingElement.css({position: 'relative', overflow: 'hidden'}).prependTo(this.$imageHolder);
                }

                if (this.settings.touch === false) {
                    this._adjustImgHolderHeights();
                    if (this.settings.parallax === true) {
                        this._updatePositions();
                    }
                    else {
                        this._updateFallbackPositions();
                    }
                    this._bindEvents();
                }
            },
            _adjustImgHolderHeights: function () {
                var winHeight = $win.height(),
                    winWidth = $win.width() - this.settings.container.offset().left,
                    imgHolderHeight = this.coverRatio * winHeight,
                    imgTopPos,
                    imgLeftPos,
                    fromY,
                    imgScrollingDistance,
                    travelDistance,
                    imgWidth,
                    imgHeight,
                    fakedImgHeight,
                    imageDiff;
                imgHolderHeight = (this.settings.holderMinHeight < imgHolderHeight ? Math.floor(imgHolderHeight) : this.settings.holderMinHeight) + this.extraHeight;
                fakedImgHeight = Math.floor(winHeight - (winHeight - imgHolderHeight) * this.settings.speed);
                imgWidth = Math.round(this.mediaWidth * (fakedImgHeight / this.mediaHeight));

                if (imgWidth >= winWidth) {
                    imgHeight = fakedImgHeight;
                } else {
                    imgWidth = winWidth;
                    imgHeight = Math.round(this.mediaHeight * (imgWidth / this.mediaWidth));
                }

                imageDiff = fakedImgHeight - imgHolderHeight;
                travelDistance = winHeight + imgHolderHeight;
                imgScrollingDistance = (((winHeight * 2) * (1 - this.settings.speed)) - imageDiff);
                imgTopPos = -((imageDiff / 2) + ((imgHeight - fakedImgHeight) / 2));
                imgLeftPos = Math.round((imgWidth - winWidth) * -0.5);
                fromY = imgTopPos - (imgScrollingDistance / 2);

                this.$scrollingElement.css({
                    height: imgHeight,
                    width: imgWidth
                });
                this.$imageHolder.height(imgHolderHeight);

                this.$scrollerHolder.css({
                    height: imgHolderHeight,
                    width: imgWidth
                });

                this.scrollingState = {
                    winHeight: winHeight,
                    fromY: fromY,
                    imgTopPos: imgTopPos,
                    imgLeftPos: imgLeftPos,
                    imgHolderHeight: imgHolderHeight,
                    imgScrollingDistance: imgScrollingDistance,
                    travelDistance: travelDistance,
                    holderDistanceFromTop: this.$imageHolder.offset().top - $win.scrollTop()
                };
            },
            _bindEvents: function () {
                var self = this;
                $win.on('resize', function (evt) {
                    self._adjustImgHolderHeights();
                    if (self.settings.parallax === true) {
                        self._requestTick();
                    } else {
                        self._updateFallbackPositions();
                    }
                });
                if (this.settings.parallax === true) {
                    $win.on('scroll', function (evt) {
                        self.scrollingState.holderDistanceFromTop = self.$imageHolder.offset().top - $win.scrollTop();
                        self._requestTick();
                    });
                }
            },
            _requestTick: function () {
                var self = this;
                if (!this.ticking) {
                    this.ticking = true;
                    requestAnimationFrame(function () {
                        self._updatePositions();
                    });
                }
            },
            _updatePositions: function () {
                if (this.scrollingState.holderDistanceFromTop <= (this.scrollingState.winHeight) && this.scrollingState.holderDistanceFromTop >= -this.scrollingState.imgHolderHeight) {
                    var distanceFromTopAddedWinHeight = this.scrollingState.holderDistanceFromTop + this.scrollingState.imgHolderHeight,
                        distanceInPercent = distanceFromTopAddedWinHeight / this.scrollingState.travelDistance,
                        currentImgYPosition = Math.round(this.scrollingState.fromY + (this.scrollingState.imgScrollingDistance * (1 - distanceInPercent))),
                        leftOffset = this.settings.container.offset().left;

                    this.$scrollerHolder.css(this._getCSSObject({
                        transform: transformProperty,
                        left: leftOffset,
                        x: Math.ceil(this.scrollingState.imgLeftPos) + (supportedFeature === '' && leftOffset > 0 ? leftOffset : 0),
                        y: Math.round(this.scrollingState.holderDistanceFromTop),
                        visibility: 'visible'
                    }));

                    this.$scrollingElement.css(this._getCSSObject({
                        transform: transformProperty,
                        x: 0,
                        y: currentImgYPosition,
                        visibility: 'visible'
                    }));
                } else {
                    this.$scrollerHolder.css({visibility: 'hidden'});
                    this.$scrollingElement.css({visibility: 'hidden'});
                }

                this.ticking = false;
            },
            _updateFallbackPositions: function () {
                this.$scrollerHolder.css({width: '100%'});
                this.$scrollingElement.css({
                    top: this.scrollingState.imgTopPos,
                    left: this.scrollingState.imgLeftPos
                });
            },
            _getCSSObject: function (options) {
                if (supportedFeature === "csstransforms3d") {
                    options.transform = "translate3d(" + options.x + "px, " + options.y + "px, 0)";
                } else if (supportedFeature === "csstransforms") {
                    options.transform = "translate(" + options.x + "px, " + options.y + "px)";
                } else {
                    options.top = options.y;
                    options.left = options.x;
                }
                return options;
            }
        };
    };

    ImageScroll.defaults = defaults;
    $.fn.imageScroll = function (options) {
        return this.each(function () {
            new ImageScroll(this, options).init();
        });
    };

    return ImageScroll;
}));