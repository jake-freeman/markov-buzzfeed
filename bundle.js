(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var MarkovChain = require('markovchain'),
    //$           = require('jquery'),
    titles      = require('./titles.js');

var title_chain = new MarkovChain(titles);

var title_states = {
    good: '',
    bad_start: 'bad-start'
};

var title_length_slider;

function main() {
    $(document).ready(function() {
        add_jquery_plugins();
        register_form_components();
        display_title(generate_title());
    });
}

function generate_title(options) {
    var generated_title = '',
        state = title_states.good,
        start = options.start/*,
        contains = options.contains*/;
    options = options ? options : {};
    title_chain = new MarkovChain(titles);
    title_chain = title_chain.end(title_length_slider.slider('getValue'));

    if (start) {
        start = capitalizeFirstLetter(start).trim();
        title_chain = title_chain.start(start);
    }

    generated_title = title_chain.process();
    if (start && generated_title.length === start.length) {
        title_chain = new MarkovChain(titles);
        generated_title = start + ' ' + title_chain.process();
        state = title_states.bad_start;
    }

    return { title: generated_title, state: state };
}

function display_title(options) {
    var word_wrapper_class = 'title-status';
    var title_obj = $('.gen-title');
    title_obj.text(options.title);
    if (options.state !== title_states.good) {
        title_obj.wrapStart(1, word_wrapper_class);
        $('.' + word_wrapper_class).addClass(options.state);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function register_form_components() {
    var gen_button_selector = '#gen-title-button',
        gen_start_selector  = '#gen-title-start';
    $(gen_start_selector).keypress(function (e) {
        var code = e.keyCode || e.which;

        if (code === 13) {
            $('#gen-title-button').click();
        }
        else if (code === 32) {
            e.preventDefault();

            var current_element = $(this);

            current_element.addClass('highlight-error');
            var error_duration = 100;
            if (current_element.error_timeout_handler) {
                clearTimeout(current_element.error_timeout_handler);
            }
            current_element.error_timeout_handler = setTimeout(function() {
                current_element.removeClass('highlight-error');
                current_element.error_timeout_handler = null;
            }, error_duration);
        }
    });

    $(gen_button_selector).click(function() {
        var title_gen_options = {};
        if ($('#gen-word-select').val() === 'start-with') {
            title_gen_options = { start: $(gen_start_selector).val() };
        }
        else {
            title_gen_options = { contains: $(gen_start_selector).val() };
        }
        display_title(generate_title(title_gen_options));
    });

    title_length_slider = $('#gen-len-slider').slider({
        formatter: function(value) {
            return 'Max title length: ' + value;
        },
        tooltip_position: 'bottom'
    });
    title_length_slider.on('slide', function(e) {
        $('#gen-len-slider-val').text(e.value);
    });
}

function add_jquery_plugins() {
    $.fn.wrapStart = function (numWords, classname) {
        var node = this.contents().filter(function () {
                       return this.nodeType === 3;
                   }).first(),
            text = node.text(),
            first = text.split(" ", numWords).join(" ");

        if (!node.length) {
            return;
        }
        node[0].nodeValue = text.slice(first.length);
        node.before(`<span class="${classname}">` + first + '</span>');
    };
}

main();

},{"./titles.js":10,"markovchain":6}],2:[function(require,module,exports){
(function (process,global){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.async = global.async || {})));
}(this, (function (exports) { 'use strict';

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest$1(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

// Lodash rest function without function.toString()
// remappings
function rest(func, start) {
    return overRest$1(func, start, identity);
}

var initialParams = function (fn) {
    return rest(function (args /*..., callback*/) {
        var callback = args.pop();
        fn.call(this, args, callback);
    });
};

function applyEach$1(eachfn) {
    return rest(function (fns, args) {
        var go = initialParams(function (args, callback) {
            var that = this;
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            }, callback);
        });
        if (args.length) {
            return go.apply(this, args);
        } else {
            return go;
        }
    });
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  value = Object(value);
  return (symToStringTag && symToStringTag in value)
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

function once(fn) {
    return function () {
        if (fn === null) return;
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}

var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

var getIterator = function (coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
};

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$2.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag$1 = '[object Function]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$1.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    return function next() {
        return ++i < len ? { value: coll[i], key: i } : null;
    };
}

function createES2015Iterator(iterator) {
    var i = -1;
    return function next() {
        var item = iterator.next();
        if (item.done) return null;
        i++;
        return { value: item.value, key: i };
    };
}

function createObjectIterator(obj) {
    var okeys = keys(obj);
    var i = -1;
    var len = okeys.length;
    return function next() {
        var key = okeys[++i];
        return i < len ? { value: obj[key], key: key } : null;
    };
}

function iterator(coll) {
    if (isArrayLike(coll)) {
        return createArrayIterator(coll);
    }

    var iterator = getIterator(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}

function onlyOnce(fn) {
    return function () {
        if (fn === null) throw new Error("Callback was already called.");
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}

// A temporary value used to identify if the loop should be broken.
// See #1064, #1293
var breakLoop = {};

function _eachOfLimit(limit) {
    return function (obj, iteratee, callback) {
        callback = once(callback || noop);
        if (limit <= 0 || !obj) {
            return callback(null);
        }
        var nextElem = iterator(obj);
        var done = false;
        var running = 0;

        function iterateeCallback(err, value) {
            running -= 1;
            if (err) {
                done = true;
                callback(err);
            } else if (value === breakLoop || done && running <= 0) {
                done = true;
                return callback(null);
            } else {
                replenish();
            }
        }

        function replenish() {
            while (running < limit && !done) {
                var elem = nextElem();
                if (elem === null) {
                    done = true;
                    if (running <= 0) {
                        callback(null);
                    }
                    return;
                }
                running += 1;
                iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
            }
        }

        replenish();
    };
}

/**
 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name eachOfLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.eachOf]{@link module:Collections.eachOf}
 * @alias forEachOfLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A function to apply to each
 * item in `coll`. The `key` is the item's key, or index in the case of an
 * array. The iteratee is passed a `callback(err)` which must be called once it
 * has completed. If no error has occurred, the callback should be run without
 * arguments or with an explicit `null` argument. Invoked with
 * (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
function eachOfLimit(coll, limit, iteratee, callback) {
  _eachOfLimit(limit)(coll, iteratee, callback);
}

function doLimit(fn, limit) {
    return function (iterable, iteratee, callback) {
        return fn(iterable, limit, iteratee, callback);
    };
}

// eachOf implementation optimized for array-likes
function eachOfArrayLike(coll, iteratee, callback) {
    callback = once(callback || noop);
    var index = 0,
        completed = 0,
        length = coll.length;
    if (length === 0) {
        callback(null);
    }

    function iteratorCallback(err) {
        if (err) {
            callback(err);
        } else if (++completed === length) {
            callback(null);
        }
    }

    for (; index < length; index++) {
        iteratee(coll[index], index, onlyOnce(iteratorCallback));
    }
}

// a generic version of eachOf which can handle array, object, and iterator cases.
var eachOfGeneric = doLimit(eachOfLimit, Infinity);

/**
 * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
 * to the iteratee.
 *
 * @name eachOf
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEachOf
 * @category Collection
 * @see [async.each]{@link module:Collections.each}
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each
 * item in `coll`. The `key` is the item's key, or index in the case of an
 * array. The iteratee is passed a `callback(err)` which must be called once it
 * has completed. If no error has occurred, the callback should be run without
 * arguments or with an explicit `null` argument. Invoked with
 * (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @example
 *
 * var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
 * var configs = {};
 *
 * async.forEachOf(obj, function (value, key, callback) {
 *     fs.readFile(__dirname + value, "utf8", function (err, data) {
 *         if (err) return callback(err);
 *         try {
 *             configs[key] = JSON.parse(data);
 *         } catch (e) {
 *             return callback(e);
 *         }
 *         callback();
 *     });
 * }, function (err) {
 *     if (err) console.error(err.message);
 *     // configs is now a map of JSON data
 *     doSomethingWith(configs);
 * });
 */
var eachOf = function (coll, iteratee, callback) {
    var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, iteratee, callback);
};

function doParallel(fn) {
    return function (obj, iteratee, callback) {
        return fn(eachOf, obj, iteratee, callback);
    };
}

function _asyncMap(eachfn, arr, iteratee, callback) {
    callback = callback || noop;
    arr = arr || [];
    var results = [];
    var counter = 0;

    eachfn(arr, function (value, _, callback) {
        var index = counter++;
        iteratee(value, function (err, v) {
            results[index] = v;
            callback(err);
        });
    }, function (err) {
        callback(err, results);
    });
}

/**
 * Produces a new collection of values by mapping each value in `coll` through
 * the `iteratee` function. The `iteratee` is called with an item from `coll`
 * and a callback for when it has finished processing. Each of these callback
 * takes 2 arguments: an `error`, and the transformed item from `coll`. If
 * `iteratee` passes an error to its callback, the main `callback` (for the
 * `map` function) is immediately called with the error.
 *
 * Note, that since this function applies the `iteratee` to each item in
 * parallel, there is no guarantee that the `iteratee` functions will complete
 * in order. However, the results array will be in the same order as the
 * original `coll`.
 *
 * If `map` is passed an Object, the results will be an Array.  The results
 * will roughly be in the order of the original Objects' keys (but this can
 * vary across JavaScript engines)
 *
 * @name map
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a
 * transformed item. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an Array of the
 * transformed items from the `coll`. Invoked with (err, results).
 * @example
 *
 * async.map(['file1','file2','file3'], fs.stat, function(err, results) {
 *     // results is now an array of stats for each file
 * });
 */
var map = doParallel(_asyncMap);

/**
 * Applies the provided arguments to each function in the array, calling
 * `callback` after all functions have completed. If you only provide the first
 * argument, `fns`, then it will return a function which lets you pass in the
 * arguments as if it were a single function call. If more arguments are
 * provided, `callback` is required while `args` is still optional.
 *
 * @name applyEach
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} fns - A collection of asynchronous functions
 * to all call with the same arguments
 * @param {...*} [args] - any number of separate arguments to pass to the
 * function.
 * @param {Function} [callback] - the final argument should be the callback,
 * called when all functions have completed processing.
 * @returns {Function} - If only the first argument, `fns`, is provided, it will
 * return a function which lets you pass in the arguments as if it were a single
 * function call. The signature is `(..args, callback)`. If invoked with any
 * arguments, `callback` is required.
 * @example
 *
 * async.applyEach([enableSearch, updateSchema], 'bucket', callback);
 *
 * // partial application example:
 * async.each(
 *     buckets,
 *     async.applyEach([enableSearch, updateSchema]),
 *     callback
 * );
 */
var applyEach = applyEach$1(map);

function doParallelLimit(fn) {
    return function (obj, limit, iteratee, callback) {
        return fn(_eachOfLimit(limit), obj, iteratee, callback);
    };
}

/**
 * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
 *
 * @name mapLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a transformed
 * item. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an array of the
 * transformed items from the `coll`. Invoked with (err, results).
 */
var mapLimit = doParallelLimit(_asyncMap);

/**
 * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
 *
 * @name mapSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a
 * transformed item. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an array of the
 * transformed items from the `coll`. Invoked with (err, results).
 */
var mapSeries = doLimit(mapLimit, 1);

/**
 * The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
 *
 * @name applyEachSeries
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.applyEach]{@link module:ControlFlow.applyEach}
 * @category Control Flow
 * @param {Array|Iterable|Object} fns - A collection of asynchronous functions to all
 * call with the same arguments
 * @param {...*} [args] - any number of separate arguments to pass to the
 * function.
 * @param {Function} [callback] - the final argument should be the callback,
 * called when all functions have completed processing.
 * @returns {Function} - If only the first argument is provided, it will return
 * a function which lets you pass in the arguments as if it were a single
 * function call.
 */
var applyEachSeries = applyEach$1(mapSeries);

/**
 * Creates a continuation function with some arguments already applied.
 *
 * Useful as a shorthand when combined with other control flow functions. Any
 * arguments passed to the returned function are added to the arguments
 * originally passed to apply.
 *
 * @name apply
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} function - The function you want to eventually apply all
 * arguments to. Invokes with (arguments...).
 * @param {...*} arguments... - Any number of arguments to automatically apply
 * when the continuation is called.
 * @example
 *
 * // using apply
 * async.parallel([
 *     async.apply(fs.writeFile, 'testfile1', 'test1'),
 *     async.apply(fs.writeFile, 'testfile2', 'test2')
 * ]);
 *
 *
 * // the same process without using apply
 * async.parallel([
 *     function(callback) {
 *         fs.writeFile('testfile1', 'test1', callback);
 *     },
 *     function(callback) {
 *         fs.writeFile('testfile2', 'test2', callback);
 *     }
 * ]);
 *
 * // It's possible to pass any number of additional arguments when calling the
 * // continuation:
 *
 * node> var fn = async.apply(sys.puts, 'one');
 * node> fn('two', 'three');
 * one
 * two
 * three
 */
var apply$2 = rest(function (fn, args) {
    return rest(function (callArgs) {
        return fn.apply(null, args.concat(callArgs));
    });
});

/**
 * Take a sync function and make it async, passing its return value to a
 * callback. This is useful for plugging sync functions into a waterfall,
 * series, or other async functions. Any arguments passed to the generated
 * function will be passed to the wrapped function (except for the final
 * callback argument). Errors thrown will be passed to the callback.
 *
 * If the function passed to `asyncify` returns a Promise, that promises's
 * resolved/rejected state will be used to call the callback, rather than simply
 * the synchronous return value.
 *
 * This also means you can asyncify ES2016 `async` functions.
 *
 * @name asyncify
 * @static
 * @memberOf module:Utils
 * @method
 * @alias wrapSync
 * @category Util
 * @param {Function} func - The synchronous function to convert to an
 * asynchronous function.
 * @returns {Function} An asynchronous wrapper of the `func`. To be invoked with
 * (callback).
 * @example
 *
 * // passing a regular synchronous function
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(JSON.parse),
 *     function (data, next) {
 *         // data is the result of parsing the text.
 *         // If there was a parsing error, it would have been caught.
 *     }
 * ], callback);
 *
 * // passing a function returning a promise
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(function (contents) {
 *         return db.model.create(contents);
 *     }),
 *     function (model, next) {
 *         // `model` is the instantiated model object.
 *         // If there was an error, this function would be skipped.
 *     }
 * ], callback);
 *
 * // es6 example
 * var q = async.queue(async.asyncify(async function(file) {
 *     var intermediateStep = await processFile(file);
 *     return await somePromise(intermediateStep)
 * }));
 *
 * q.push(files);
 */
function asyncify(func) {
    return initialParams(function (args, callback) {
        var result;
        try {
            result = func.apply(this, args);
        } catch (e) {
            return callback(e);
        }
        // if result is Promise object
        if (isObject(result) && typeof result.then === 'function') {
            result.then(function (value) {
                callback(null, value);
            }, function (err) {
                callback(err.message ? err : new Error(err));
            });
        } else {
            callback(null, result);
        }
    });
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

/**
 * Determines the best order for running the functions in `tasks`, based on
 * their requirements. Each function can optionally depend on other functions
 * being completed first, and each function is run as soon as its requirements
 * are satisfied.
 *
 * If any of the functions pass an error to their callback, the `auto` sequence
 * will stop. Further tasks will not execute (so any other functions depending
 * on it will not run), and the main `callback` is immediately called with the
 * error.
 *
 * Functions also receive an object containing the results of functions which
 * have completed so far as the first argument, if they have dependencies. If a
 * task function has no dependencies, it will only be passed a callback.
 *
 * @name auto
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Object} tasks - An object. Each of its properties is either a
 * function or an array of requirements, with the function itself the last item
 * in the array. The object's key of a property serves as the name of the task
 * defined by that property, i.e. can be used when specifying requirements for
 * other tasks. The function receives one or two arguments:
 * * a `results` object, containing the results of the previously executed
 *   functions, only passed if the task has any dependencies,
 * * a `callback(err, result)` function, which must be called when finished,
 *   passing an `error` (which can be `null`) and the result of the function's
 *   execution.
 * @param {number} [concurrency=Infinity] - An optional `integer` for
 * determining the maximum number of tasks that can be run in parallel. By
 * default, as many as possible.
 * @param {Function} [callback] - An optional callback which is called when all
 * the tasks have been completed. It receives the `err` argument if any `tasks`
 * pass an error to their callback. Results are always returned; however, if an
 * error occurs, no further `tasks` will be performed, and the results object
 * will only contain partial results. Invoked with (err, results).
 * @returns undefined
 * @example
 *
 * async.auto({
 *     // this function will just be passed a callback
 *     readData: async.apply(fs.readFile, 'data.txt', 'utf-8'),
 *     showData: ['readData', function(results, cb) {
 *         // results.readData is the file's contents
 *         // ...
 *     }]
 * }, callback);
 *
 * async.auto({
 *     get_data: function(callback) {
 *         console.log('in get_data');
 *         // async code to get some data
 *         callback(null, 'data', 'converted to array');
 *     },
 *     make_folder: function(callback) {
 *         console.log('in make_folder');
 *         // async code to create a directory to store a file in
 *         // this is run at the same time as getting the data
 *         callback(null, 'folder');
 *     },
 *     write_file: ['get_data', 'make_folder', function(results, callback) {
 *         console.log('in write_file', JSON.stringify(results));
 *         // once there is some data and the directory exists,
 *         // write the data to a file in the directory
 *         callback(null, 'filename');
 *     }],
 *     email_link: ['write_file', function(results, callback) {
 *         console.log('in email_link', JSON.stringify(results));
 *         // once the file is written let's email a link to it...
 *         // results.write_file contains the filename returned by write_file.
 *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
 *     }]
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('results = ', results);
 * });
 */
var auto = function (tasks, concurrency, callback) {
    if (typeof concurrency === 'function') {
        // concurrency is optional, shift the args.
        callback = concurrency;
        concurrency = null;
    }
    callback = once(callback || noop);
    var keys$$1 = keys(tasks);
    var numTasks = keys$$1.length;
    if (!numTasks) {
        return callback(null);
    }
    if (!concurrency) {
        concurrency = numTasks;
    }

    var results = {};
    var runningTasks = 0;
    var hasError = false;

    var listeners = {};

    var readyTasks = [];

    // for cycle detection:
    var readyToCheck = []; // tasks that have been identified as reachable
    // without the possibility of returning to an ancestor task
    var uncheckedDependencies = {};

    baseForOwn(tasks, function (task, key) {
        if (!isArray(task)) {
            // no dependencies
            enqueueTask(key, [task]);
            readyToCheck.push(key);
            return;
        }

        var dependencies = task.slice(0, task.length - 1);
        var remainingDependencies = dependencies.length;
        if (remainingDependencies === 0) {
            enqueueTask(key, task);
            readyToCheck.push(key);
            return;
        }
        uncheckedDependencies[key] = remainingDependencies;

        arrayEach(dependencies, function (dependencyName) {
            if (!tasks[dependencyName]) {
                throw new Error('async.auto task `' + key + '` has a non-existent dependency in ' + dependencies.join(', '));
            }
            addListener(dependencyName, function () {
                remainingDependencies--;
                if (remainingDependencies === 0) {
                    enqueueTask(key, task);
                }
            });
        });
    });

    checkForDeadlocks();
    processQueue();

    function enqueueTask(key, task) {
        readyTasks.push(function () {
            runTask(key, task);
        });
    }

    function processQueue() {
        if (readyTasks.length === 0 && runningTasks === 0) {
            return callback(null, results);
        }
        while (readyTasks.length && runningTasks < concurrency) {
            var run = readyTasks.shift();
            run();
        }
    }

    function addListener(taskName, fn) {
        var taskListeners = listeners[taskName];
        if (!taskListeners) {
            taskListeners = listeners[taskName] = [];
        }

        taskListeners.push(fn);
    }

    function taskComplete(taskName) {
        var taskListeners = listeners[taskName] || [];
        arrayEach(taskListeners, function (fn) {
            fn();
        });
        processQueue();
    }

    function runTask(key, task) {
        if (hasError) return;

        var taskCallback = onlyOnce(rest(function (err, args) {
            runningTasks--;
            if (args.length <= 1) {
                args = args[0];
            }
            if (err) {
                var safeResults = {};
                baseForOwn(results, function (val, rkey) {
                    safeResults[rkey] = val;
                });
                safeResults[key] = args;
                hasError = true;
                listeners = [];

                callback(err, safeResults);
            } else {
                results[key] = args;
                taskComplete(key);
            }
        }));

        runningTasks++;
        var taskFn = task[task.length - 1];
        if (task.length > 1) {
            taskFn(results, taskCallback);
        } else {
            taskFn(taskCallback);
        }
    }

    function checkForDeadlocks() {
        // Kahn's algorithm
        // https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
        // http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
        var currentTask;
        var counter = 0;
        while (readyToCheck.length) {
            currentTask = readyToCheck.pop();
            counter++;
            arrayEach(getDependents(currentTask), function (dependent) {
                if (--uncheckedDependencies[dependent] === 0) {
                    readyToCheck.push(dependent);
                }
            });
        }

        if (counter !== numTasks) {
            throw new Error('async.auto cannot execute tasks due to a recursive dependency');
        }
    }

    function getDependents(taskName) {
        var result = [];
        baseForOwn(tasks, function (task, key) {
            if (isArray(task) && baseIndexOf(task, taskName, 0) >= 0) {
                result.push(key);
            }
        });
        return result;
    }
};

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined;
var symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the last unmatched string symbol.
 */
function charsEndIndex(strSymbols, chrSymbols) {
  var index = strSymbols.length;

  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the first unmatched string symbol.
 */
function charsStartIndex(strSymbols, chrSymbols) {
  var index = -1,
      length = strSymbols.length;

  while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff';
var rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23';
var rsComboSymbolsRange = '\\u20d0-\\u20f0';
var rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/** Used to compose unicode character classes. */
var rsAstralRange$1 = '\\ud800-\\udfff';
var rsComboMarksRange$1 = '\\u0300-\\u036f\\ufe20-\\ufe23';
var rsComboSymbolsRange$1 = '\\u20d0-\\u20f0';
var rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange$1 + ']';
var rsCombo = '[' + rsComboMarksRange$1 + rsComboSymbolsRange$1 + ']';
var rsFitz = '\\ud83c[\\udffb-\\udfff]';
var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
var rsNonAstral = '[^' + rsAstralRange$1 + ']';
var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
var rsZWJ$1 = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?';
var rsOptVar = '[' + rsVarRange$1 + ']?';
var rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*';
var rsSeq = rsOptVar + reOptMod + rsOptJoin;
var rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/**
 * Removes leading and trailing whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trim('  abc  ');
 * // => 'abc'
 *
 * _.trim('-_-abc-_-', '_-');
 * // => 'abc'
 *
 * _.map(['  foo  ', '  bar  '], _.trim);
 * // => ['foo', 'bar']
 */
function trim(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrim, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      chrSymbols = stringToArray(chars),
      start = charsStartIndex(strSymbols, chrSymbols),
      end = charsEndIndex(strSymbols, chrSymbols) + 1;

  return castSlice(strSymbols, start, end).join('');
}

var FN_ARGS = /^(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /(=.+)?(\s*)$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function parseParams(func) {
    func = func.toString().replace(STRIP_COMMENTS, '');
    func = func.match(FN_ARGS)[2].replace(' ', '');
    func = func ? func.split(FN_ARG_SPLIT) : [];
    func = func.map(function (arg) {
        return trim(arg.replace(FN_ARG, ''));
    });
    return func;
}

/**
 * A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
 * tasks are specified as parameters to the function, after the usual callback
 * parameter, with the parameter names matching the names of the tasks it
 * depends on. This can provide even more readable task graphs which can be
 * easier to maintain.
 *
 * If a final callback is specified, the task results are similarly injected,
 * specified as named parameters after the initial error parameter.
 *
 * The autoInject function is purely syntactic sugar and its semantics are
 * otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
 *
 * @name autoInject
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.auto]{@link module:ControlFlow.auto}
 * @category Control Flow
 * @param {Object} tasks - An object, each of whose properties is a function of
 * the form 'func([dependencies...], callback). The object's key of a property
 * serves as the name of the task defined by that property, i.e. can be used
 * when specifying requirements for other tasks.
 * * The `callback` parameter is a `callback(err, result)` which must be called
 *   when finished, passing an `error` (which can be `null`) and the result of
 *   the function's execution. The remaining parameters name other tasks on
 *   which the task is dependent, and the results from those tasks are the
 *   arguments of those parameters.
 * @param {Function} [callback] - An optional callback which is called when all
 * the tasks have been completed. It receives the `err` argument if any `tasks`
 * pass an error to their callback, and a `results` object with any completed
 * task results, similar to `auto`.
 * @example
 *
 * //  The example from `auto` can be rewritten as follows:
 * async.autoInject({
 *     get_data: function(callback) {
 *         // async code to get some data
 *         callback(null, 'data', 'converted to array');
 *     },
 *     make_folder: function(callback) {
 *         // async code to create a directory to store a file in
 *         // this is run at the same time as getting the data
 *         callback(null, 'folder');
 *     },
 *     write_file: function(get_data, make_folder, callback) {
 *         // once there is some data and the directory exists,
 *         // write the data to a file in the directory
 *         callback(null, 'filename');
 *     },
 *     email_link: function(write_file, callback) {
 *         // once the file is written let's email a link to it...
 *         // write_file contains the filename returned by write_file.
 *         callback(null, {'file':write_file, 'email':'user@example.com'});
 *     }
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('email_link = ', results.email_link);
 * });
 *
 * // If you are using a JS minifier that mangles parameter names, `autoInject`
 * // will not work with plain functions, since the parameter names will be
 * // collapsed to a single letter identifier.  To work around this, you can
 * // explicitly specify the names of the parameters your task function needs
 * // in an array, similar to Angular.js dependency injection.
 *
 * // This still has an advantage over plain `auto`, since the results a task
 * // depends on are still spread into arguments.
 * async.autoInject({
 *     //...
 *     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
 *         callback(null, 'filename');
 *     }],
 *     email_link: ['write_file', function(write_file, callback) {
 *         callback(null, {'file':write_file, 'email':'user@example.com'});
 *     }]
 *     //...
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('email_link = ', results.email_link);
 * });
 */
function autoInject(tasks, callback) {
    var newTasks = {};

    baseForOwn(tasks, function (taskFn, key) {
        var params;

        if (isArray(taskFn)) {
            params = taskFn.slice(0, -1);
            taskFn = taskFn[taskFn.length - 1];

            newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
        } else if (taskFn.length === 1) {
            // no dependencies, use the function as-is
            newTasks[key] = taskFn;
        } else {
            params = parseParams(taskFn);
            if (taskFn.length === 0 && params.length === 0) {
                throw new Error("autoInject task functions require explicit parameters.");
            }

            params.pop();

            newTasks[key] = params.concat(newTask);
        }

        function newTask(results, taskCb) {
            var newArgs = arrayMap(params, function (name) {
                return results[name];
            });
            newArgs.push(taskCb);
            taskFn.apply(null, newArgs);
        }
    });

    auto(newTasks, callback);
}

var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
var hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

function fallback(fn) {
    setTimeout(fn, 0);
}

function wrap(defer) {
    return rest(function (fn, args) {
        defer(function () {
            fn.apply(null, args);
        });
    });
}

var _defer;

if (hasSetImmediate) {
    _defer = setImmediate;
} else if (hasNextTick) {
    _defer = process.nextTick;
} else {
    _defer = fallback;
}

var setImmediate$1 = wrap(_defer);

// Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
// used for queues. This implementation assumes that the node provided by the user can be modified
// to adjust the next and last properties. We implement only the minimal functionality
// for queue support.
function DLL() {
    this.head = this.tail = null;
    this.length = 0;
}

function setInitial(dll, node) {
    dll.length = 1;
    dll.head = dll.tail = node;
}

DLL.prototype.removeLink = function (node) {
    if (node.prev) node.prev.next = node.next;else this.head = node.next;
    if (node.next) node.next.prev = node.prev;else this.tail = node.prev;

    node.prev = node.next = null;
    this.length -= 1;
    return node;
};

DLL.prototype.empty = DLL;

DLL.prototype.insertAfter = function (node, newNode) {
    newNode.prev = node;
    newNode.next = node.next;
    if (node.next) node.next.prev = newNode;else this.tail = newNode;
    node.next = newNode;
    this.length += 1;
};

DLL.prototype.insertBefore = function (node, newNode) {
    newNode.prev = node.prev;
    newNode.next = node;
    if (node.prev) node.prev.next = newNode;else this.head = newNode;
    node.prev = newNode;
    this.length += 1;
};

DLL.prototype.unshift = function (node) {
    if (this.head) this.insertBefore(this.head, node);else setInitial(this, node);
};

DLL.prototype.push = function (node) {
    if (this.tail) this.insertAfter(this.tail, node);else setInitial(this, node);
};

DLL.prototype.shift = function () {
    return this.head && this.removeLink(this.head);
};

DLL.prototype.pop = function () {
    return this.tail && this.removeLink(this.tail);
};

function queue(worker, concurrency, payload) {
    if (concurrency == null) {
        concurrency = 1;
    } else if (concurrency === 0) {
        throw new Error('Concurrency must not be zero');
    }

    function _insert(data, insertAtFront, callback) {
        if (callback != null && typeof callback !== 'function') {
            throw new Error('task callback must be a function');
        }
        q.started = true;
        if (!isArray(data)) {
            data = [data];
        }
        if (data.length === 0 && q.idle()) {
            // call drain immediately if there are no tasks
            return setImmediate$1(function () {
                q.drain();
            });
        }

        for (var i = 0, l = data.length; i < l; i++) {
            var item = {
                data: data[i],
                callback: callback || noop
            };

            if (insertAtFront) {
                q._tasks.unshift(item);
            } else {
                q._tasks.push(item);
            }
        }
        setImmediate$1(q.process);
    }

    function _next(tasks) {
        return rest(function (args) {
            workers -= 1;

            for (var i = 0, l = tasks.length; i < l; i++) {
                var task = tasks[i];
                var index = baseIndexOf(workersList, task, 0);
                if (index >= 0) {
                    workersList.splice(index);
                }

                task.callback.apply(task, args);

                if (args[0] != null) {
                    q.error(args[0], task.data);
                }
            }

            if (workers <= q.concurrency - q.buffer) {
                q.unsaturated();
            }

            if (q.idle()) {
                q.drain();
            }
            q.process();
        });
    }

    var workers = 0;
    var workersList = [];
    var q = {
        _tasks: new DLL(),
        concurrency: concurrency,
        payload: payload,
        saturated: noop,
        unsaturated: noop,
        buffer: concurrency / 4,
        empty: noop,
        drain: noop,
        error: noop,
        started: false,
        paused: false,
        push: function (data, callback) {
            _insert(data, false, callback);
        },
        kill: function () {
            q.drain = noop;
            q._tasks.empty();
        },
        unshift: function (data, callback) {
            _insert(data, true, callback);
        },
        process: function () {
            while (!q.paused && workers < q.concurrency && q._tasks.length) {
                var tasks = [],
                    data = [];
                var l = q._tasks.length;
                if (q.payload) l = Math.min(l, q.payload);
                for (var i = 0; i < l; i++) {
                    var node = q._tasks.shift();
                    tasks.push(node);
                    data.push(node.data);
                }

                if (q._tasks.length === 0) {
                    q.empty();
                }
                workers += 1;
                workersList.push(tasks[0]);

                if (workers === q.concurrency) {
                    q.saturated();
                }

                var cb = onlyOnce(_next(tasks));
                worker(data, cb);
            }
        },
        length: function () {
            return q._tasks.length;
        },
        running: function () {
            return workers;
        },
        workersList: function () {
            return workersList;
        },
        idle: function () {
            return q._tasks.length + workers === 0;
        },
        pause: function () {
            q.paused = true;
        },
        resume: function () {
            if (q.paused === false) {
                return;
            }
            q.paused = false;
            var resumeCount = Math.min(q.concurrency, q._tasks.length);
            // Need to call q.process once per concurrent
            // worker to preserve full concurrency after pause
            for (var w = 1; w <= resumeCount; w++) {
                setImmediate$1(q.process);
            }
        }
    };
    return q;
}

/**
 * A cargo of tasks for the worker function to complete. Cargo inherits all of
 * the same methods and event callbacks as [`queue`]{@link module:ControlFlow.queue}.
 * @typedef {Object} CargoObject
 * @memberOf module:ControlFlow
 * @property {Function} length - A function returning the number of items
 * waiting to be processed. Invoke like `cargo.length()`.
 * @property {number} payload - An `integer` for determining how many tasks
 * should be process per round. This property can be changed after a `cargo` is
 * created to alter the payload on-the-fly.
 * @property {Function} push - Adds `task` to the `queue`. The callback is
 * called once the `worker` has finished processing the task. Instead of a
 * single task, an array of `tasks` can be submitted. The respective callback is
 * used for every task in the list. Invoke like `cargo.push(task, [callback])`.
 * @property {Function} saturated - A callback that is called when the
 * `queue.length()` hits the concurrency and further tasks will be queued.
 * @property {Function} empty - A callback that is called when the last item
 * from the `queue` is given to a `worker`.
 * @property {Function} drain - A callback that is called when the last item
 * from the `queue` has returned from the `worker`.
 * @property {Function} idle - a function returning false if there are items
 * waiting or being processed, or true if not. Invoke like `cargo.idle()`.
 * @property {Function} pause - a function that pauses the processing of tasks
 * until `resume()` is called. Invoke like `cargo.pause()`.
 * @property {Function} resume - a function that resumes the processing of
 * queued tasks when the queue is paused. Invoke like `cargo.resume()`.
 * @property {Function} kill - a function that removes the `drain` callback and
 * empties remaining tasks from the queue forcing it to go idle. Invoke like `cargo.kill()`.
 */

/**
 * Creates a `cargo` object with the specified payload. Tasks added to the
 * cargo will be processed altogether (up to the `payload` limit). If the
 * `worker` is in progress, the task is queued until it becomes available. Once
 * the `worker` has completed some tasks, each callback of those tasks is
 * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
 * for how `cargo` and `queue` work.
 *
 * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
 * at a time, cargo passes an array of tasks to a single worker, repeating
 * when the worker is finished.
 *
 * @name cargo
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.queue]{@link module:ControlFlow.queue}
 * @category Control Flow
 * @param {Function} worker - An asynchronous function for processing an array
 * of queued tasks, which must call its `callback(err)` argument when finished,
 * with an optional `err` argument. Invoked with `(tasks, callback)`.
 * @param {number} [payload=Infinity] - An optional `integer` for determining
 * how many tasks should be processed per round; if omitted, the default is
 * unlimited.
 * @returns {module:ControlFlow.CargoObject} A cargo object to manage the tasks. Callbacks can
 * attached as certain properties to listen for specific events during the
 * lifecycle of the cargo and inner queue.
 * @example
 *
 * // create a cargo object with payload 2
 * var cargo = async.cargo(function(tasks, callback) {
 *     for (var i=0; i<tasks.length; i++) {
 *         console.log('hello ' + tasks[i].name);
 *     }
 *     callback();
 * }, 2);
 *
 * // add some items
 * cargo.push({name: 'foo'}, function(err) {
 *     console.log('finished processing foo');
 * });
 * cargo.push({name: 'bar'}, function(err) {
 *     console.log('finished processing bar');
 * });
 * cargo.push({name: 'baz'}, function(err) {
 *     console.log('finished processing baz');
 * });
 */
function cargo(worker, payload) {
  return queue(worker, 1, payload);
}

/**
 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
 *
 * @name eachOfSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.eachOf]{@link module:Collections.eachOf}
 * @alias forEachOfSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`. The
 * `key` is the item's key, or index in the case of an array. The iteratee is
 * passed a `callback(err)` which must be called once it has completed. If no
 * error has occurred, the callback should be run without arguments or with an
 * explicit `null` argument. Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Invoked with (err).
 */
var eachOfSeries = doLimit(eachOfLimit, 1);

/**
 * Reduces `coll` into a single value using an async `iteratee` to return each
 * successive step. `memo` is the initial state of the reduction. This function
 * only operates in series.
 *
 * For performance reasons, it may make sense to split a call to this function
 * into a parallel map, and then use the normal `Array.prototype.reduce` on the
 * results. This function is for situations where each step in the reduction
 * needs to be async; if you can get the data before reducing it, then it's
 * probably a good idea to do so.
 *
 * @name reduce
 * @static
 * @memberOf module:Collections
 * @method
 * @alias inject
 * @alias foldl
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {*} memo - The initial state of the reduction.
 * @param {Function} iteratee - A function applied to each item in the
 * array to produce the next step in the reduction. The `iteratee` is passed a
 * `callback(err, reduction)` which accepts an optional error as its first
 * argument, and the state of the reduction as the second. If an error is
 * passed to the callback, the reduction is stopped and the main `callback` is
 * immediately called with the error. Invoked with (memo, item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the reduced value. Invoked with
 * (err, result).
 * @example
 *
 * async.reduce([1,2,3], 0, function(memo, item, callback) {
 *     // pointless async:
 *     process.nextTick(function() {
 *         callback(null, memo + item)
 *     });
 * }, function(err, result) {
 *     // result is now equal to the last value of memo, which is 6
 * });
 */
function reduce(coll, memo, iteratee, callback) {
    callback = once(callback || noop);
    eachOfSeries(coll, function (x, i, callback) {
        iteratee(memo, x, function (err, v) {
            memo = v;
            callback(err);
        });
    }, function (err) {
        callback(err, memo);
    });
}

/**
 * Version of the compose function that is more natural to read. Each function
 * consumes the return value of the previous function. It is the equivalent of
 * [compose]{@link module:ControlFlow.compose} with the arguments reversed.
 *
 * Each function is executed with the `this` binding of the composed function.
 *
 * @name seq
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.compose]{@link module:ControlFlow.compose}
 * @category Control Flow
 * @param {...Function} functions - the asynchronous functions to compose
 * @returns {Function} a function that composes the `functions` in order
 * @example
 *
 * // Requires lodash (or underscore), express3 and dresende's orm2.
 * // Part of an app, that fetches cats of the logged user.
 * // This example uses `seq` function to avoid overnesting and error
 * // handling clutter.
 * app.get('/cats', function(request, response) {
 *     var User = request.models.User;
 *     async.seq(
 *         _.bind(User.get, User),  // 'User.get' has signature (id, callback(err, data))
 *         function(user, fn) {
 *             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
 *         }
 *     )(req.session.user_id, function (err, cats) {
 *         if (err) {
 *             console.error(err);
 *             response.json({ status: 'error', message: err.message });
 *         } else {
 *             response.json({ status: 'ok', message: 'Cats found', data: cats });
 *         }
 *     });
 * });
 */
var seq$1 = rest(function seq(functions) {
    return rest(function (args) {
        var that = this;

        var cb = args[args.length - 1];
        if (typeof cb == 'function') {
            args.pop();
        } else {
            cb = noop;
        }

        reduce(functions, args, function (newargs, fn, cb) {
            fn.apply(that, newargs.concat([rest(function (err, nextargs) {
                cb(err, nextargs);
            })]));
        }, function (err, results) {
            cb.apply(that, [err].concat(results));
        });
    });
});

/**
 * Creates a function which is a composition of the passed asynchronous
 * functions. Each function consumes the return value of the function that
 * follows. Composing functions `f()`, `g()`, and `h()` would produce the result
 * of `f(g(h()))`, only this version uses callbacks to obtain the return values.
 *
 * Each function is executed with the `this` binding of the composed function.
 *
 * @name compose
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {...Function} functions - the asynchronous functions to compose
 * @returns {Function} an asynchronous function that is the composed
 * asynchronous `functions`
 * @example
 *
 * function add1(n, callback) {
 *     setTimeout(function () {
 *         callback(null, n + 1);
 *     }, 10);
 * }
 *
 * function mul3(n, callback) {
 *     setTimeout(function () {
 *         callback(null, n * 3);
 *     }, 10);
 * }
 *
 * var add1mul3 = async.compose(mul3, add1);
 * add1mul3(4, function (err, result) {
 *     // result now equals 15
 * });
 */
var compose = rest(function (args) {
  return seq$1.apply(null, args.reverse());
});

function concat$1(eachfn, arr, fn, callback) {
    var result = [];
    eachfn(arr, function (x, index, cb) {
        fn(x, function (err, y) {
            result = result.concat(y || []);
            cb(err);
        });
    }, function (err) {
        callback(err, result);
    });
}

/**
 * Applies `iteratee` to each item in `coll`, concatenating the results. Returns
 * the concatenated list. The `iteratee`s are called in parallel, and the
 * results are concatenated as they return. There is no guarantee that the
 * results array will be returned in the original order of `coll` passed to the
 * `iteratee` function.
 *
 * @name concat
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, results)` which must be called once
 * it has completed with an error (which can be `null`) and an array of results.
 * Invoked with (item, callback).
 * @param {Function} [callback(err)] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 * @example
 *
 * async.concat(['dir1','dir2','dir3'], fs.readdir, function(err, files) {
 *     // files is now a list of filenames that exist in the 3 directories
 * });
 */
var concat = doParallel(concat$1);

function doSeries(fn) {
    return function (obj, iteratee, callback) {
        return fn(eachOfSeries, obj, iteratee, callback);
    };
}

/**
 * The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
 *
 * @name concatSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.concat]{@link module:Collections.concat}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, results)` which must be called once
 * it has completed with an error (which can be `null`) and an array of results.
 * Invoked with (item, callback).
 * @param {Function} [callback(err)] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 */
var concatSeries = doSeries(concat$1);

/**
 * Returns a function that when called, calls-back with the values provided.
 * Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
 * [`auto`]{@link module:ControlFlow.auto}.
 *
 * @name constant
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {...*} arguments... - Any number of arguments to automatically invoke
 * callback with.
 * @returns {Function} Returns a function that when invoked, automatically
 * invokes the callback with the previous given arguments.
 * @example
 *
 * async.waterfall([
 *     async.constant(42),
 *     function (value, next) {
 *         // value === 42
 *     },
 *     //...
 * ], callback);
 *
 * async.waterfall([
 *     async.constant(filename, "utf8"),
 *     fs.readFile,
 *     function (fileData, next) {
 *         //...
 *     }
 *     //...
 * ], callback);
 *
 * async.auto({
 *     hostname: async.constant("https://server.net/"),
 *     port: findFreePort,
 *     launchServer: ["hostname", "port", function (options, cb) {
 *         startServer(options, cb);
 *     }],
 *     //...
 * }, callback);
 */
var constant = rest(function (values) {
    var args = [null].concat(values);
    return initialParams(function (ignoredArgs, callback) {
        return callback.apply(this, args);
    });
});

function _createTester(eachfn, check, getResult) {
    return function (arr, limit, iteratee, cb) {
        function done() {
            if (cb) {
                cb(null, getResult(false));
            }
        }
        function wrappedIteratee(x, _, callback) {
            if (!cb) return callback();
            iteratee(x, function (err, v) {
                // Check cb as another iteratee may have resolved with a
                // value or error since we started this iteratee
                if (cb && (err || check(v))) {
                    if (err) cb(err);else cb(err, getResult(true, x));
                    cb = iteratee = false;
                    callback(err, breakLoop);
                } else {
                    callback();
                }
            });
        }
        if (arguments.length > 3) {
            cb = cb || noop;
            eachfn(arr, limit, wrappedIteratee, done);
        } else {
            cb = iteratee;
            cb = cb || noop;
            iteratee = limit;
            eachfn(arr, wrappedIteratee, done);
        }
    };
}

function _findGetResult(v, x) {
    return x;
}

/**
 * Returns the first value in `coll` that passes an async truth test. The
 * `iteratee` is applied in parallel, meaning the first iteratee to return
 * `true` will fire the detect `callback` with that result. That means the
 * result might not be the first item in the original `coll` (in terms of order)
 * that passes the test.

 * If order within the original `coll` is important, then look at
 * [`detectSeries`]{@link module:Collections.detectSeries}.
 *
 * @name detect
 * @static
 * @memberOf module:Collections
 * @method
 * @alias find
 * @category Collections
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, truthValue)` which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 * @example
 *
 * async.detect(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // result now equals the first file in the list that exists
 * });
 */
var detect = _createTester(eachOf, identity, _findGetResult);

/**
 * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name detectLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.detect]{@link module:Collections.detect}
 * @alias findLimit
 * @category Collections
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, truthValue)` which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 */
var detectLimit = _createTester(eachOfLimit, identity, _findGetResult);

/**
 * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
 *
 * @name detectSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.detect]{@link module:Collections.detect}
 * @alias findSeries
 * @category Collections
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, truthValue)` which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 */
var detectSeries = _createTester(eachOfSeries, identity, _findGetResult);

function consoleFunc(name) {
    return rest(function (fn, args) {
        fn.apply(null, args.concat([rest(function (err, args) {
            if (typeof console === 'object') {
                if (err) {
                    if (console.error) {
                        console.error(err);
                    }
                } else if (console[name]) {
                    arrayEach(args, function (x) {
                        console[name](x);
                    });
                }
            }
        })]));
    });
}

/**
 * Logs the result of an `async` function to the `console` using `console.dir`
 * to display the properties of the resulting object. Only works in Node.js or
 * in browsers that support `console.dir` and `console.error` (such as FF and
 * Chrome). If multiple arguments are returned from the async function,
 * `console.dir` is called on each argument in order.
 *
 * @name dir
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} function - The function you want to eventually apply all
 * arguments to.
 * @param {...*} arguments... - Any number of arguments to apply to the function.
 * @example
 *
 * // in a module
 * var hello = function(name, callback) {
 *     setTimeout(function() {
 *         callback(null, {hello: name});
 *     }, 1000);
 * };
 *
 * // in the node repl
 * node> async.dir(hello, 'world');
 * {hello: 'world'}
 */
var dir = consoleFunc('dir');

/**
 * The post-check version of [`during`]{@link module:ControlFlow.during}. To reflect the difference in
 * the order of operations, the arguments `test` and `fn` are switched.
 *
 * Also a version of [`doWhilst`]{@link module:ControlFlow.doWhilst} with asynchronous `test` function.
 * @name doDuring
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.during]{@link module:ControlFlow.during}
 * @category Control Flow
 * @param {Function} fn - A function which is called each time `test` passes.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} test - asynchronous truth test to perform before each
 * execution of `fn`. Invoked with (...args, callback), where `...args` are the
 * non-error args from the previous callback of `fn`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error if one occured, otherwise `null`.
 */
function doDuring(fn, test, callback) {
    callback = onlyOnce(callback || noop);

    var next = rest(function (err, args) {
        if (err) return callback(err);
        args.push(check);
        test.apply(this, args);
    });

    function check(err, truth) {
        if (err) return callback(err);
        if (!truth) return callback(null);
        fn(next);
    }

    check(null, true);
}

/**
 * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
 * the order of operations, the arguments `test` and `iteratee` are switched.
 *
 * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
 *
 * @name doWhilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {Function} iteratee - A function which is called each time `test`
 * passes. The function is passed a `callback(err)`, which must be called once
 * it has completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} test - synchronous truth test to perform after each
 * execution of `iteratee`. Invoked with the non-error callback results of 
 * `iteratee`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped.
 * `callback` will be passed an error and any arguments passed to the final
 * `iteratee`'s callback. Invoked with (err, [results]);
 */
function doWhilst(iteratee, test, callback) {
    callback = onlyOnce(callback || noop);
    var next = rest(function (err, args) {
        if (err) return callback(err);
        if (test.apply(this, args)) return iteratee(next);
        callback.apply(null, [null].concat(args));
    });
    iteratee(next);
}

/**
 * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
 * argument ordering differs from `until`.
 *
 * @name doUntil
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
 * @category Control Flow
 * @param {Function} fn - A function which is called each time `test` fails.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} test - synchronous truth test to perform after each
 * execution of `fn`. Invoked with the non-error callback results of `fn`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has passed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `fn`'s
 * callback. Invoked with (err, [results]);
 */
function doUntil(fn, test, callback) {
    doWhilst(fn, function () {
        return !test.apply(this, arguments);
    }, callback);
}

/**
 * Like [`whilst`]{@link module:ControlFlow.whilst}, except the `test` is an asynchronous function that
 * is passed a callback in the form of `function (err, truth)`. If error is
 * passed to `test` or `fn`, the main callback is immediately called with the
 * value of the error.
 *
 * @name during
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {Function} test - asynchronous truth test to perform before each
 * execution of `fn`. Invoked with (callback).
 * @param {Function} fn - A function which is called each time `test` passes.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error, if one occured, otherwise `null`.
 * @example
 *
 * var count = 0;
 *
 * async.during(
 *     function (callback) {
 *         return callback(null, count < 5);
 *     },
 *     function (callback) {
 *         count++;
 *         setTimeout(callback, 1000);
 *     },
 *     function (err) {
 *         // 5 seconds have passed
 *     }
 * );
 */
function during(test, fn, callback) {
    callback = onlyOnce(callback || noop);

    function next(err) {
        if (err) return callback(err);
        test(check);
    }

    function check(err, truth) {
        if (err) return callback(err);
        if (!truth) return callback(null);
        fn(next);
    }

    test(check);
}

function _withoutIndex(iteratee) {
    return function (value, index, callback) {
        return iteratee(value, callback);
    };
}

/**
 * Applies the function `iteratee` to each item in `coll`, in parallel.
 * The `iteratee` is called with an item from the list, and a callback for when
 * it has finished. If the `iteratee` passes an error to its `callback`, the
 * main `callback` (for the `each` function) is immediately called with the
 * error.
 *
 * Note, that since this function applies `iteratee` to each item in parallel,
 * there is no guarantee that the iteratee functions will complete in order.
 *
 * @name each
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEach
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item
 * in `coll`. The iteratee is passed a `callback(err)` which must be called once
 * it has completed. If no error has occurred, the `callback` should be run
 * without arguments or with an explicit `null` argument. The array index is not
 * passed to the iteratee. Invoked with (item, callback). If you need the index,
 * use `eachOf`.
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @example
 *
 * // assuming openFiles is an array of file names and saveFile is a function
 * // to save the modified contents of that file:
 *
 * async.each(openFiles, saveFile, function(err){
 *   // if any of the saves produced an error, err would equal that error
 * });
 *
 * // assuming openFiles is an array of file names
 * async.each(openFiles, function(file, callback) {
 *
 *     // Perform operation on file here.
 *     console.log('Processing file ' + file);
 *
 *     if( file.length > 32 ) {
 *       console.log('This file name is too long');
 *       callback('File name too long');
 *     } else {
 *       // Do work to process file here
 *       console.log('File processed');
 *       callback();
 *     }
 * }, function(err) {
 *     // if any of the file processing produced an error, err would equal that error
 *     if( err ) {
 *       // One of the iterations produced an error.
 *       // All processing will now stop.
 *       console.log('A file failed to process');
 *     } else {
 *       console.log('All files have been processed successfully');
 *     }
 * });
 */
function eachLimit(coll, iteratee, callback) {
  eachOf(coll, _withoutIndex(iteratee), callback);
}

/**
 * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
 *
 * @name eachLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A function to apply to each item in `coll`. The
 * iteratee is passed a `callback(err)` which must be called once it has
 * completed. If no error has occurred, the `callback` should be run without
 * arguments or with an explicit `null` argument. The array index is not passed
 * to the iteratee. Invoked with (item, callback). If you need the index, use
 * `eachOfLimit`.
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
function eachLimit$1(coll, limit, iteratee, callback) {
  _eachOfLimit(limit)(coll, _withoutIndex(iteratee), callback);
}

/**
 * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
 *
 * @name eachSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each
 * item in `coll`. The iteratee is passed a `callback(err)` which must be called
 * once it has completed. If no error has occurred, the `callback` should be run
 * without arguments or with an explicit `null` argument. The array index is
 * not passed to the iteratee. Invoked with (item, callback). If you need the
 * index, use `eachOfSeries`.
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
var eachSeries = doLimit(eachLimit$1, 1);

/**
 * Wrap an async function and ensure it calls its callback on a later tick of
 * the event loop.  If the function already calls its callback on a next tick,
 * no extra deferral is added. This is useful for preventing stack overflows
 * (`RangeError: Maximum call stack size exceeded`) and generally keeping
 * [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
 * contained.
 *
 * @name ensureAsync
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} fn - an async function, one that expects a node-style
 * callback as its last argument.
 * @returns {Function} Returns a wrapped function with the exact same call
 * signature as the function passed in.
 * @example
 *
 * function sometimesAsync(arg, callback) {
 *     if (cache[arg]) {
 *         return callback(null, cache[arg]); // this would be synchronous!!
 *     } else {
 *         doSomeIO(arg, callback); // this IO would be asynchronous
 *     }
 * }
 *
 * // this has a risk of stack overflows if many results are cached in a row
 * async.mapSeries(args, sometimesAsync, done);
 *
 * // this will defer sometimesAsync's callback if necessary,
 * // preventing stack overflows
 * async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
 */
function ensureAsync(fn) {
    return initialParams(function (args, callback) {
        var sync = true;
        args.push(function () {
            var innerArgs = arguments;
            if (sync) {
                setImmediate$1(function () {
                    callback.apply(null, innerArgs);
                });
            } else {
                callback.apply(null, innerArgs);
            }
        });
        fn.apply(this, args);
        sync = false;
    });
}

function notId(v) {
    return !v;
}

/**
 * Returns `true` if every element in `coll` satisfies an async test. If any
 * iteratee call returns `false`, the main `callback` is immediately called.
 *
 * @name every
 * @static
 * @memberOf module:Collections
 * @method
 * @alias all
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the
 * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
 * which must be called with a  boolean argument once it has completed. Invoked
 * with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 * @example
 *
 * async.every(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // if result is true then every file exists
 * });
 */
var every = _createTester(eachOf, notId, notId);

/**
 * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
 *
 * @name everyLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.every]{@link module:Collections.every}
 * @alias allLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in the
 * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
 * which must be called with a  boolean argument once it has completed. Invoked
 * with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 */
var everyLimit = _createTester(eachOfLimit, notId, notId);

/**
 * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
 *
 * @name everySeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.every]{@link module:Collections.every}
 * @alias allSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the
 * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
 * which must be called with a  boolean argument once it has completed. Invoked
 * with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 */
var everySeries = doLimit(everyLimit, 1);

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

function filterArray(eachfn, arr, iteratee, callback) {
    var truthValues = new Array(arr.length);
    eachfn(arr, function (x, index, callback) {
        iteratee(x, function (err, v) {
            truthValues[index] = !!v;
            callback(err);
        });
    }, function (err) {
        if (err) return callback(err);
        var results = [];
        for (var i = 0; i < arr.length; i++) {
            if (truthValues[i]) results.push(arr[i]);
        }
        callback(null, results);
    });
}

function filterGeneric(eachfn, coll, iteratee, callback) {
    var results = [];
    eachfn(coll, function (x, index, callback) {
        iteratee(x, function (err, v) {
            if (err) {
                callback(err);
            } else {
                if (v) {
                    results.push({ index: index, value: x });
                }
                callback();
            }
        });
    }, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, arrayMap(results.sort(function (a, b) {
                return a.index - b.index;
            }), baseProperty('value')));
        }
    });
}

function _filter(eachfn, coll, iteratee, callback) {
    var filter = isArrayLike(coll) ? filterArray : filterGeneric;
    filter(eachfn, coll, iteratee, callback || noop);
}

/**
 * Returns a new array of all the values in `coll` which pass an async truth
 * test. This operation is performed in parallel, but the results array will be
 * in the same order as the original.
 *
 * @name filter
 * @static
 * @memberOf module:Collections
 * @method
 * @alias select
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @example
 *
 * async.filter(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, results) {
 *     // results now equals an array of the existing files
 * });
 */
var filter = doParallel(_filter);

/**
 * The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name filterLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @alias selectLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 */
var filterLimit = doParallelLimit(_filter);

/**
 * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
 *
 * @name filterSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @alias selectSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results)
 */
var filterSeries = doLimit(filterLimit, 1);

/**
 * Calls the asynchronous function `fn` with a callback parameter that allows it
 * to call itself again, in series, indefinitely.

 * If an error is passed to the
 * callback then `errback` is called with the error, and execution stops,
 * otherwise it will never be called.
 *
 * @name forever
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Function} fn - a function to call repeatedly. Invoked with (next).
 * @param {Function} [errback] - when `fn` passes an error to it's callback,
 * this function will be called, and execution stops. Invoked with (err).
 * @example
 *
 * async.forever(
 *     function(next) {
 *         // next is suitable for passing to things that need a callback(err [, whatever]);
 *         // it will result in this function being called again.
 *     },
 *     function(err) {
 *         // if next is called with a value in its first parameter, it will appear
 *         // in here as 'err', and execution will stop.
 *     }
 * );
 */
function forever(fn, errback) {
    var done = onlyOnce(errback || noop);
    var task = ensureAsync(fn);

    function next(err) {
        if (err) return done(err);
        task(next);
    }
    next();
}

/**
 * Logs the result of an `async` function to the `console`. Only works in
 * Node.js or in browsers that support `console.log` and `console.error` (such
 * as FF and Chrome). If multiple arguments are returned from the async
 * function, `console.log` is called on each argument in order.
 *
 * @name log
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} function - The function you want to eventually apply all
 * arguments to.
 * @param {...*} arguments... - Any number of arguments to apply to the function.
 * @example
 *
 * // in a module
 * var hello = function(name, callback) {
 *     setTimeout(function() {
 *         callback(null, 'hello ' + name);
 *     }, 1000);
 * };
 *
 * // in the node repl
 * node> async.log(hello, 'world');
 * 'hello world'
 */
var log = consoleFunc('log');

/**
 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name mapValuesLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.mapValues]{@link module:Collections.mapValues}
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A function to apply to each value in `obj`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a
 * transformed value. Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 */
function mapValuesLimit(obj, limit, iteratee, callback) {
    callback = once(callback || noop);
    var newObj = {};
    eachOfLimit(obj, limit, function (val, key, next) {
        iteratee(val, key, function (err, result) {
            if (err) return next(err);
            newObj[key] = result;
            next();
        });
    }, function (err) {
        callback(err, newObj);
    });
}

/**
 * A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
 *
 * Produces a new Object by mapping each value of `obj` through the `iteratee`
 * function. The `iteratee` is called each `value` and `key` from `obj` and a
 * callback for when it has finished processing. Each of these callbacks takes
 * two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
 * passes an error to its callback, the main `callback` (for the `mapValues`
 * function) is immediately called with the error.
 *
 * Note, the order of the keys in the result is not guaranteed.  The keys will
 * be roughly in the order they complete, (but this is very engine-specific)
 *
 * @name mapValues
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each value and key in
 * `coll`. The iteratee is passed a `callback(err, transformed)` which must be
 * called once it has completed with an error (which can be `null`) and a
 * transformed value. Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 * @example
 *
 * async.mapValues({
 *     f1: 'file1',
 *     f2: 'file2',
 *     f3: 'file3'
 * }, function (file, key, callback) {
 *   fs.stat(file, callback);
 * }, function(err, result) {
 *     // result is now a map of stats for each file, e.g.
 *     // {
 *     //     f1: [stats for file1],
 *     //     f2: [stats for file2],
 *     //     f3: [stats for file3]
 *     // }
 * });
 */

var mapValues = doLimit(mapValuesLimit, Infinity);

/**
 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
 *
 * @name mapValuesSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.mapValues]{@link module:Collections.mapValues}
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each value in `obj`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a
 * transformed value. Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 */
var mapValuesSeries = doLimit(mapValuesLimit, 1);

function has(obj, key) {
    return key in obj;
}

/**
 * Caches the results of an `async` function. When creating a hash to store
 * function results against, the callback is omitted from the hash and an
 * optional hash function can be used.
 *
 * If no hash function is specified, the first argument is used as a hash key,
 * which may work reasonably if it is a string or a data type that converts to a
 * distinct string. Note that objects and arrays will not behave reasonably.
 * Neither will cases where the other arguments are significant. In such cases,
 * specify your own hash function.
 *
 * The cache of results is exposed as the `memo` property of the function
 * returned by `memoize`.
 *
 * @name memoize
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} fn - The function to proxy and cache results from.
 * @param {Function} hasher - An optional function for generating a custom hash
 * for storing results. It has all the arguments applied to it apart from the
 * callback, and must be synchronous.
 * @returns {Function} a memoized version of `fn`
 * @example
 *
 * var slow_fn = function(name, callback) {
 *     // do something
 *     callback(null, result);
 * };
 * var fn = async.memoize(slow_fn);
 *
 * // fn can now be used as if it were slow_fn
 * fn('some name', function() {
 *     // callback
 * });
 */
function memoize(fn, hasher) {
    var memo = Object.create(null);
    var queues = Object.create(null);
    hasher = hasher || identity;
    var memoized = initialParams(function memoized(args, callback) {
        var key = hasher.apply(null, args);
        if (has(memo, key)) {
            setImmediate$1(function () {
                callback.apply(null, memo[key]);
            });
        } else if (has(queues, key)) {
            queues[key].push(callback);
        } else {
            queues[key] = [callback];
            fn.apply(null, args.concat([rest(function (args) {
                memo[key] = args;
                var q = queues[key];
                delete queues[key];
                for (var i = 0, l = q.length; i < l; i++) {
                    q[i].apply(null, args);
                }
            })]));
        }
    });
    memoized.memo = memo;
    memoized.unmemoized = fn;
    return memoized;
}

/**
 * Calls `callback` on a later loop around the event loop. In Node.js this just
 * calls `setImmediate`.  In the browser it will use `setImmediate` if
 * available, otherwise `setTimeout(callback, 0)`, which means other higher
 * priority events may precede the execution of `callback`.
 *
 * This is used internally for browser-compatibility purposes.
 *
 * @name nextTick
 * @static
 * @memberOf module:Utils
 * @method
 * @alias setImmediate
 * @category Util
 * @param {Function} callback - The function to call on a later loop around
 * the event loop. Invoked with (args...).
 * @param {...*} args... - any number of additional arguments to pass to the
 * callback on the next tick.
 * @example
 *
 * var call_order = [];
 * async.nextTick(function() {
 *     call_order.push('two');
 *     // call_order now equals ['one','two']
 * });
 * call_order.push('one');
 *
 * async.setImmediate(function (a, b, c) {
 *     // a, b, and c equal 1, 2, and 3
 * }, 1, 2, 3);
 */
var _defer$1;

if (hasNextTick) {
    _defer$1 = process.nextTick;
} else if (hasSetImmediate) {
    _defer$1 = setImmediate;
} else {
    _defer$1 = fallback;
}

var nextTick = wrap(_defer$1);

function _parallel(eachfn, tasks, callback) {
    callback = callback || noop;
    var results = isArrayLike(tasks) ? [] : {};

    eachfn(tasks, function (task, key, callback) {
        task(rest(function (err, args) {
            if (args.length <= 1) {
                args = args[0];
            }
            results[key] = args;
            callback(err);
        }));
    }, function (err) {
        callback(err, results);
    });
}

/**
 * Run the `tasks` collection of functions in parallel, without waiting until
 * the previous function has completed. If any of the functions pass an error to
 * its callback, the main `callback` is immediately called with the value of the
 * error. Once the `tasks` have completed, the results are passed to the final
 * `callback` as an array.
 *
 * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
 * parallel execution of code.  If your tasks do not use any timers or perform
 * any I/O, they will actually be executed in series.  Any synchronous setup
 * sections for each task will happen one after the other.  JavaScript remains
 * single-threaded.
 *
 * It is also possible to use an object instead of an array. Each property will
 * be run as a function and the results will be passed to the final `callback`
 * as an object instead of an array. This can be a more readable way of handling
 * results from {@link async.parallel}.
 *
 * @name parallel
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection containing functions to run.
 * Each function is passed a `callback(err, result)` which it must call on
 * completion with an error `err` (which can be `null`) and an optional `result`
 * value.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
 * @example
 * async.parallel([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     // the results array will equal ['one','two'] even though
 *     // the second function had a shorter timeout.
 * });
 *
 * // an example using an object instead of an array
 * async.parallel({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }, function(err, results) {
 *     // results is now equals to: {one: 1, two: 2}
 * });
 */
function parallelLimit(tasks, callback) {
  _parallel(eachOf, tasks, callback);
}

/**
 * The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name parallelLimit
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.parallel]{@link module:ControlFlow.parallel}
 * @category Control Flow
 * @param {Array|Collection} tasks - A collection containing functions to run.
 * Each function is passed a `callback(err, result)` which it must call on
 * completion with an error `err` (which can be `null`) and an optional `result`
 * value.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
 */
function parallelLimit$1(tasks, limit, callback) {
  _parallel(_eachOfLimit(limit), tasks, callback);
}

/**
 * A queue of tasks for the worker function to complete.
 * @typedef {Object} QueueObject
 * @memberOf module:ControlFlow
 * @property {Function} length - a function returning the number of items
 * waiting to be processed. Invoke with `queue.length()`.
 * @property {boolean} started - a boolean indicating whether or not any
 * items have been pushed and processed by the queue.
 * @property {Function} running - a function returning the number of items
 * currently being processed. Invoke with `queue.running()`.
 * @property {Function} workersList - a function returning the array of items
 * currently being processed. Invoke with `queue.workersList()`.
 * @property {Function} idle - a function returning false if there are items
 * waiting or being processed, or true if not. Invoke with `queue.idle()`.
 * @property {number} concurrency - an integer for determining how many `worker`
 * functions should be run in parallel. This property can be changed after a
 * `queue` is created to alter the concurrency on-the-fly.
 * @property {Function} push - add a new task to the `queue`. Calls `callback`
 * once the `worker` has finished processing the task. Instead of a single task,
 * a `tasks` array can be submitted. The respective callback is used for every
 * task in the list. Invoke with `queue.push(task, [callback])`,
 * @property {Function} unshift - add a new task to the front of the `queue`.
 * Invoke with `queue.unshift(task, [callback])`.
 * @property {Function} saturated - a callback that is called when the number of
 * running workers hits the `concurrency` limit, and further tasks will be
 * queued.
 * @property {Function} unsaturated - a callback that is called when the number
 * of running workers is less than the `concurrency` & `buffer` limits, and
 * further tasks will not be queued.
 * @property {number} buffer - A minimum threshold buffer in order to say that
 * the `queue` is `unsaturated`.
 * @property {Function} empty - a callback that is called when the last item
 * from the `queue` is given to a `worker`.
 * @property {Function} drain - a callback that is called when the last item
 * from the `queue` has returned from the `worker`.
 * @property {Function} error - a callback that is called when a task errors.
 * Has the signature `function(error, task)`.
 * @property {boolean} paused - a boolean for determining whether the queue is
 * in a paused state.
 * @property {Function} pause - a function that pauses the processing of tasks
 * until `resume()` is called. Invoke with `queue.pause()`.
 * @property {Function} resume - a function that resumes the processing of
 * queued tasks when the queue is paused. Invoke with `queue.resume()`.
 * @property {Function} kill - a function that removes the `drain` callback and
 * empties remaining tasks from the queue forcing it to go idle. Invoke with `queue.kill()`.
 */

/**
 * Creates a `queue` object with the specified `concurrency`. Tasks added to the
 * `queue` are processed in parallel (up to the `concurrency` limit). If all
 * `worker`s are in progress, the task is queued until one becomes available.
 * Once a `worker` completes a `task`, that `task`'s callback is called.
 *
 * @name queue
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Function} worker - An asynchronous function for processing a queued
 * task, which must call its `callback(err)` argument when finished, with an
 * optional `error` as an argument.  If you want to handle errors from an
 * individual task, pass a callback to `q.push()`. Invoked with
 * (task, callback).
 * @param {number} [concurrency=1] - An `integer` for determining how many
 * `worker` functions should be run in parallel.  If omitted, the concurrency
 * defaults to `1`.  If the concurrency is `0`, an error is thrown.
 * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can
 * attached as certain properties to listen for specific events during the
 * lifecycle of the queue.
 * @example
 *
 * // create a queue object with concurrency 2
 * var q = async.queue(function(task, callback) {
 *     console.log('hello ' + task.name);
 *     callback();
 * }, 2);
 *
 * // assign a callback
 * q.drain = function() {
 *     console.log('all items have been processed');
 * };
 *
 * // add some items to the queue
 * q.push({name: 'foo'}, function(err) {
 *     console.log('finished processing foo');
 * });
 * q.push({name: 'bar'}, function (err) {
 *     console.log('finished processing bar');
 * });
 *
 * // add some items to the queue (batch-wise)
 * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
 *     console.log('finished processing item');
 * });
 *
 * // add some items to the front of the queue
 * q.unshift({name: 'bar'}, function (err) {
 *     console.log('finished processing bar');
 * });
 */
var queue$1 = function (worker, concurrency) {
  return queue(function (items, cb) {
    worker(items[0], cb);
  }, concurrency, 1);
};

/**
 * The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
 * completed in ascending priority order.
 *
 * @name priorityQueue
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.queue]{@link module:ControlFlow.queue}
 * @category Control Flow
 * @param {Function} worker - An asynchronous function for processing a queued
 * task, which must call its `callback(err)` argument when finished, with an
 * optional `error` as an argument.  If you want to handle errors from an
 * individual task, pass a callback to `q.push()`. Invoked with
 * (task, callback).
 * @param {number} concurrency - An `integer` for determining how many `worker`
 * functions should be run in parallel.  If omitted, the concurrency defaults to
 * `1`.  If the concurrency is `0`, an error is thrown.
 * @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are two
 * differences between `queue` and `priorityQueue` objects:
 * * `push(task, priority, [callback])` - `priority` should be a number. If an
 *   array of `tasks` is given, all tasks will be assigned the same priority.
 * * The `unshift` method was removed.
 */
var priorityQueue = function (worker, concurrency) {
    // Start with a normal queue
    var q = queue$1(worker, concurrency);

    // Override push to accept second parameter representing priority
    q.push = function (data, priority, callback) {
        if (callback == null) callback = noop;
        if (typeof callback !== 'function') {
            throw new Error('task callback must be a function');
        }
        q.started = true;
        if (!isArray(data)) {
            data = [data];
        }
        if (data.length === 0) {
            // call drain immediately if there are no tasks
            return setImmediate$1(function () {
                q.drain();
            });
        }

        priority = priority || 0;
        var nextNode = q._tasks.head;
        while (nextNode && priority >= nextNode.priority) {
            nextNode = nextNode.next;
        }

        for (var i = 0, l = data.length; i < l; i++) {
            var item = {
                data: data[i],
                priority: priority,
                callback: callback
            };

            if (nextNode) {
                q._tasks.insertBefore(nextNode, item);
            } else {
                q._tasks.push(item);
            }
        }
        setImmediate$1(q.process);
    };

    // Remove unshift function
    delete q.unshift;

    return q;
};

/**
 * Runs the `tasks` array of functions in parallel, without waiting until the
 * previous function has completed. Once any of the `tasks` complete or pass an
 * error to its callback, the main `callback` is immediately called. It's
 * equivalent to `Promise.race()`.
 *
 * @name race
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array containing functions to run. Each function
 * is passed a `callback(err, result)` which it must call on completion with an
 * error `err` (which can be `null`) and an optional `result` value.
 * @param {Function} callback - A callback to run once any of the functions have
 * completed. This function gets an error or result from the first function that
 * completed. Invoked with (err, result).
 * @returns undefined
 * @example
 *
 * async.race([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ],
 * // main callback
 * function(err, result) {
 *     // the result will be equal to 'two' as it finishes earlier
 * });
 */
function race(tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new TypeError('First argument to race must be an array of functions'));
    if (!tasks.length) return callback();
    for (var i = 0, l = tasks.length; i < l; i++) {
        tasks[i](callback);
    }
}

var slice = Array.prototype.slice;

/**
 * Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
 *
 * @name reduceRight
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reduce]{@link module:Collections.reduce}
 * @alias foldr
 * @category Collection
 * @param {Array} array - A collection to iterate over.
 * @param {*} memo - The initial state of the reduction.
 * @param {Function} iteratee - A function applied to each item in the
 * array to produce the next step in the reduction. The `iteratee` is passed a
 * `callback(err, reduction)` which accepts an optional error as its first
 * argument, and the state of the reduction as the second. If an error is
 * passed to the callback, the reduction is stopped and the main `callback` is
 * immediately called with the error. Invoked with (memo, item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the reduced value. Invoked with
 * (err, result).
 */
function reduceRight(array, memo, iteratee, callback) {
  var reversed = slice.call(array).reverse();
  reduce(reversed, memo, iteratee, callback);
}

/**
 * Wraps the function in another function that always returns data even when it
 * errors.
 *
 * The object returned has either the property `error` or `value`.
 *
 * @name reflect
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} fn - The function you want to wrap
 * @returns {Function} - A function that always passes null to it's callback as
 * the error. The second argument to the callback will be an `object` with
 * either an `error` or a `value` property.
 * @example
 *
 * async.parallel([
 *     async.reflect(function(callback) {
 *         // do some stuff ...
 *         callback(null, 'one');
 *     }),
 *     async.reflect(function(callback) {
 *         // do some more stuff but error ...
 *         callback('bad stuff happened');
 *     }),
 *     async.reflect(function(callback) {
 *         // do some more stuff ...
 *         callback(null, 'two');
 *     })
 * ],
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results[0].value = 'one'
 *     // results[1].error = 'bad stuff happened'
 *     // results[2].value = 'two'
 * });
 */
function reflect(fn) {
    return initialParams(function reflectOn(args, reflectCallback) {
        args.push(rest(function callback(err, cbArgs) {
            if (err) {
                reflectCallback(null, {
                    error: err
                });
            } else {
                var value = null;
                if (cbArgs.length === 1) {
                    value = cbArgs[0];
                } else if (cbArgs.length > 1) {
                    value = cbArgs;
                }
                reflectCallback(null, {
                    value: value
                });
            }
        }));

        return fn.apply(this, args);
    });
}

function reject$1(eachfn, arr, iteratee, callback) {
    _filter(eachfn, arr, function (value, cb) {
        iteratee(value, function (err, v) {
            cb(err, !v);
        });
    }, callback);
}

/**
 * The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
 *
 * @name reject
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @example
 *
 * async.reject(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, results) {
 *     // results now equals an array of missing files
 *     createFiles(results);
 * });
 */
var reject = doParallel(reject$1);

/**
 * A helper function that wraps an array or an object of functions with reflect.
 *
 * @name reflectAll
 * @static
 * @memberOf module:Utils
 * @method
 * @see [async.reflect]{@link module:Utils.reflect}
 * @category Util
 * @param {Array} tasks - The array of functions to wrap in `async.reflect`.
 * @returns {Array} Returns an array of functions, each function wrapped in
 * `async.reflect`
 * @example
 *
 * let tasks = [
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         // do some more stuff but error ...
 *         callback(new Error('bad stuff happened'));
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ];
 *
 * async.parallel(async.reflectAll(tasks),
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results[0].value = 'one'
 *     // results[1].error = Error('bad stuff happened')
 *     // results[2].value = 'two'
 * });
 *
 * // an example using an object instead of an array
 * let tasks = {
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         callback('two');
 *     },
 *     three: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'three');
 *         }, 100);
 *     }
 * };
 *
 * async.parallel(async.reflectAll(tasks),
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results.one.value = 'one'
 *     // results.two.error = 'two'
 *     // results.three.value = 'three'
 * });
 */
function reflectAll(tasks) {
    var results;
    if (isArray(tasks)) {
        results = arrayMap(tasks, reflect);
    } else {
        results = {};
        baseForOwn(tasks, function (task, key) {
            results[key] = reflect.call(this, task);
        });
    }
    return results;
}

/**
 * The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name rejectLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reject]{@link module:Collections.reject}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 */
var rejectLimit = doParallelLimit(reject$1);

/**
 * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
 *
 * @name rejectSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reject]{@link module:Collections.reject}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 */
var rejectSeries = doLimit(rejectLimit, 1);

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant$1(value) {
  return function() {
    return value;
  };
}

/**
 * Attempts to get a successful response from `task` no more than `times` times
 * before returning an error. If the task is successful, the `callback` will be
 * passed the result of the successful task. If all attempts fail, the callback
 * will be passed the error and result (if any) of the final attempt.
 *
 * @name retry
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
 * object with `times` and `interval` or a number.
 * * `times` - The number of attempts to make before giving up.  The default
 *   is `5`.
 * * `interval` - The time to wait between retries, in milliseconds.  The
 *   default is `0`. The interval may also be specified as a function of the
 *   retry count (see example).
 * * `errorFilter` - An optional synchronous function that is invoked on
 *   erroneous result. If it returns `true` the retry attempts will continue;
 *   if the function returns `false` the retry flow is aborted with the current
 *   attempt's error and result being returned to the final callback.
 *   Invoked with (err).
 * * If `opts` is a number, the number specifies the number of times to retry,
 *   with the default interval of `0`.
 * @param {Function} task - A function which receives two arguments: (1) a
 * `callback(err, result)` which must be called when finished, passing `err`
 * (which can be `null`) and the `result` of the function's execution, and (2)
 * a `results` object, containing the results of the previously executed
 * functions (if nested inside another control flow). Invoked with
 * (callback, results).
 * @param {Function} [callback] - An optional callback which is called when the
 * task has succeeded, or after the final failed attempt. It receives the `err`
 * and `result` arguments of the last attempt at completing the `task`. Invoked
 * with (err, results).
 * @example
 *
 * // The `retry` function can be used as a stand-alone control flow by passing
 * // a callback, as shown below:
 *
 * // try calling apiMethod 3 times
 * async.retry(3, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 3 times, waiting 200 ms between each retry
 * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 10 times with exponential backoff
 * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
 * async.retry({
 *   times: 10,
 *   interval: function(retryCount) {
 *     return 50 * Math.pow(2, retryCount);
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod the default 5 times no delay between each retry
 * async.retry(apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod only when error condition satisfies, all other
 * // errors will abort the retry control flow and return to final callback
 * async.retry({
 *   errorFilter: function(err) {
 *     return err.message === 'Temporary error'; // only retry on a specific error
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // It can also be embedded within other control flow functions to retry
 * // individual methods that are not as reliable, like this:
 * async.auto({
 *     users: api.getUsers.bind(api),
 *     payments: async.retry(3, api.getPayments.bind(api))
 * }, function(err, results) {
 *     // do something with the results
 * });
 *
 */
function retry(opts, task, callback) {
    var DEFAULT_TIMES = 5;
    var DEFAULT_INTERVAL = 0;

    var options = {
        times: DEFAULT_TIMES,
        intervalFunc: constant$1(DEFAULT_INTERVAL)
    };

    function parseTimes(acc, t) {
        if (typeof t === 'object') {
            acc.times = +t.times || DEFAULT_TIMES;

            acc.intervalFunc = typeof t.interval === 'function' ? t.interval : constant$1(+t.interval || DEFAULT_INTERVAL);

            acc.errorFilter = t.errorFilter;
        } else if (typeof t === 'number' || typeof t === 'string') {
            acc.times = +t || DEFAULT_TIMES;
        } else {
            throw new Error("Invalid arguments for async.retry");
        }
    }

    if (arguments.length < 3 && typeof opts === 'function') {
        callback = task || noop;
        task = opts;
    } else {
        parseTimes(options, opts);
        callback = callback || noop;
    }

    if (typeof task !== 'function') {
        throw new Error("Invalid arguments for async.retry");
    }

    var attempt = 1;
    function retryAttempt() {
        task(function (err) {
            if (err && attempt++ < options.times && (typeof options.errorFilter != 'function' || options.errorFilter(err))) {
                setTimeout(retryAttempt, options.intervalFunc(attempt));
            } else {
                callback.apply(null, arguments);
            }
        });
    }

    retryAttempt();
}

/**
 * A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method wraps a task and makes it
 * retryable, rather than immediately calling it with retries.
 *
 * @name retryable
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.retry]{@link module:ControlFlow.retry}
 * @category Control Flow
 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
 * options, exactly the same as from `retry`
 * @param {Function} task - the asynchronous function to wrap
 * @returns {Functions} The wrapped function, which when invoked, will retry on
 * an error, based on the parameters specified in `opts`.
 * @example
 *
 * async.auto({
 *     dep1: async.retryable(3, getFromFlakyService),
 *     process: ["dep1", async.retryable(3, function (results, cb) {
 *         maybeProcessData(results.dep1, cb);
 *     })]
 * }, callback);
 */
var retryable = function (opts, task) {
    if (!task) {
        task = opts;
        opts = null;
    }
    return initialParams(function (args, callback) {
        function taskFn(cb) {
            task.apply(null, args.concat([cb]));
        }

        if (opts) retry(opts, taskFn, callback);else retry(taskFn, callback);
    });
};

/**
 * Run the functions in the `tasks` collection in series, each one running once
 * the previous function has completed. If any functions in the series pass an
 * error to its callback, no more functions are run, and `callback` is
 * immediately called with the value of the error. Otherwise, `callback`
 * receives an array of results when `tasks` have completed.
 *
 * It is also possible to use an object instead of an array. Each property will
 * be run as a function, and the results will be passed to the final `callback`
 * as an object instead of an array. This can be a more readable way of handling
 *  results from {@link async.series}.
 *
 * **Note** that while many implementations preserve the order of object
 * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
 * explicitly states that
 *
 * > The mechanics and order of enumerating the properties is not specified.
 *
 * So if you rely on the order in which your series of functions are executed,
 * and want this to work on all platforms, consider using an array.
 *
 * @name series
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection containing functions to run, each
 * function is passed a `callback(err, result)` it must call on completion with
 * an error `err` (which can be `null`) and an optional `result` value.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This function gets a results array (or object)
 * containing all the result arguments passed to the `task` callbacks. Invoked
 * with (err, result).
 * @example
 * async.series([
 *     function(callback) {
 *         // do some stuff ...
 *         callback(null, 'one');
 *     },
 *     function(callback) {
 *         // do some more stuff ...
 *         callback(null, 'two');
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     // results is now equal to ['one', 'two']
 * });
 *
 * async.series({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback){
 *         setTimeout(function() {
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }, function(err, results) {
 *     // results is now equal to: {one: 1, two: 2}
 * });
 */
function series(tasks, callback) {
  _parallel(eachOfSeries, tasks, callback);
}

/**
 * Returns `true` if at least one element in the `coll` satisfies an async test.
 * If any iteratee call returns `true`, the main `callback` is immediately
 * called.
 *
 * @name some
 * @static
 * @memberOf module:Collections
 * @method
 * @alias any
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the array
 * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
 * be called with a boolean argument once it has completed. Invoked with
 * (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 * @example
 *
 * async.some(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // if result is true then at least one of the files exists
 * });
 */
var some = _createTester(eachOf, Boolean, identity);

/**
 * The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
 *
 * @name someLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.some]{@link module:Collections.some}
 * @alias anyLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in the array
 * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
 * be called with a boolean argument once it has completed. Invoked with
 * (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 */
var someLimit = _createTester(eachOfLimit, Boolean, identity);

/**
 * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
 *
 * @name someSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.some]{@link module:Collections.some}
 * @alias anySeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the array
 * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
 * be called with a boolean argument once it has completed. Invoked with
 * (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 */
var someSeries = doLimit(someLimit, 1);

/**
 * Sorts a list by the results of running each `coll` value through an async
 * `iteratee`.
 *
 * @name sortBy
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, sortValue)` which must be called once
 * it has completed with an error (which can be `null`) and a value to use as
 * the sort criteria. Invoked with (item, callback).
 * @param {Function} callback - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is the items
 * from the original `coll` sorted by the values returned by the `iteratee`
 * calls. Invoked with (err, results).
 * @example
 *
 * async.sortBy(['file1','file2','file3'], function(file, callback) {
 *     fs.stat(file, function(err, stats) {
 *         callback(err, stats.mtime);
 *     });
 * }, function(err, results) {
 *     // results is now the original array of files sorted by
 *     // modified date
 * });
 *
 * // By modifying the callback parameter the
 * // sorting order can be influenced:
 *
 * // ascending order
 * async.sortBy([1,9,3,5], function(x, callback) {
 *     callback(null, x);
 * }, function(err,result) {
 *     // result callback
 * });
 *
 * // descending order
 * async.sortBy([1,9,3,5], function(x, callback) {
 *     callback(null, x*-1);    //<- x*-1 instead of x, turns the order around
 * }, function(err,result) {
 *     // result callback
 * });
 */
function sortBy(coll, iteratee, callback) {
    map(coll, function (x, callback) {
        iteratee(x, function (err, criteria) {
            if (err) return callback(err);
            callback(null, { value: x, criteria: criteria });
        });
    }, function (err, results) {
        if (err) return callback(err);
        callback(null, arrayMap(results.sort(comparator), baseProperty('value')));
    });

    function comparator(left, right) {
        var a = left.criteria,
            b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
    }
}

/**
 * Sets a time limit on an asynchronous function. If the function does not call
 * its callback within the specified milliseconds, it will be called with a
 * timeout error. The code property for the error object will be `'ETIMEDOUT'`.
 *
 * @name timeout
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} asyncFn - The asynchronous function you want to set the
 * time limit.
 * @param {number} milliseconds - The specified time limit.
 * @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
 * to timeout Error for more information..
 * @returns {Function} Returns a wrapped function that can be used with any of
 * the control flow functions. Invoke this function with the same
 * parameters as you would `asyncFunc`.
 * @example
 *
 * function myFunction(foo, callback) {
 *     doAsyncTask(foo, function(err, data) {
 *         // handle errors
 *         if (err) return callback(err);
 *
 *         // do some stuff ...
 *
 *         // return processed data
 *         return callback(null, data);
 *     });
 * }
 *
 * var wrapped = async.timeout(myFunction, 1000);
 *
 * // call `wrapped` as you would `myFunction`
 * wrapped({ bar: 'bar' }, function(err, data) {
 *     // if `myFunction` takes < 1000 ms to execute, `err`
 *     // and `data` will have their expected values
 *
 *     // else `err` will be an Error with the code 'ETIMEDOUT'
 * });
 */
function timeout(asyncFn, milliseconds, info) {
    var originalCallback, timer;
    var timedOut = false;

    function injectedCallback() {
        if (!timedOut) {
            originalCallback.apply(null, arguments);
            clearTimeout(timer);
        }
    }

    function timeoutCallback() {
        var name = asyncFn.name || 'anonymous';
        var error = new Error('Callback function "' + name + '" timed out.');
        error.code = 'ETIMEDOUT';
        if (info) {
            error.info = info;
        }
        timedOut = true;
        originalCallback(error);
    }

    return initialParams(function (args, origCallback) {
        originalCallback = origCallback;
        // setup timer and call original function
        timer = setTimeout(timeoutCallback, milliseconds);
        asyncFn.apply(null, args.concat(injectedCallback));
    });
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil;
var nativeMax$1 = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax$1(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

/**
 * The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name timesLimit
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.times]{@link module:ControlFlow.times}
 * @category Control Flow
 * @param {number} count - The number of times to run the function.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - The function to call `n` times. Invoked with the
 * iteration index and a callback (n, next).
 * @param {Function} callback - see [async.map]{@link module:Collections.map}.
 */
function timeLimit(count, limit, iteratee, callback) {
  mapLimit(baseRange(0, count, 1), limit, iteratee, callback);
}

/**
 * Calls the `iteratee` function `n` times, and accumulates results in the same
 * manner you would use with [map]{@link module:Collections.map}.
 *
 * @name times
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Control Flow
 * @param {number} n - The number of times to run the function.
 * @param {Function} iteratee - The function to call `n` times. Invoked with the
 * iteration index and a callback (n, next).
 * @param {Function} callback - see {@link module:Collections.map}.
 * @example
 *
 * // Pretend this is some complicated async factory
 * var createUser = function(id, callback) {
 *     callback(null, {
 *         id: 'user' + id
 *     });
 * };
 *
 * // generate 5 users
 * async.times(5, function(n, next) {
 *     createUser(n, function(err, user) {
 *         next(err, user);
 *     });
 * }, function(err, users) {
 *     // we should now have 5 users
 * });
 */
var times = doLimit(timeLimit, Infinity);

/**
 * The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
 *
 * @name timesSeries
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.times]{@link module:ControlFlow.times}
 * @category Control Flow
 * @param {number} n - The number of times to run the function.
 * @param {Function} iteratee - The function to call `n` times. Invoked with the
 * iteration index and a callback (n, next).
 * @param {Function} callback - see {@link module:Collections.map}.
 */
var timesSeries = doLimit(timeLimit, 1);

/**
 * A relative of `reduce`.  Takes an Object or Array, and iterates over each
 * element in series, each step potentially mutating an `accumulator` value.
 * The type of the accumulator defaults to the type of collection passed in.
 *
 * @name transform
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {*} [accumulator] - The initial state of the transform.  If omitted,
 * it will default to an empty Object or Array, depending on the type of `coll`
 * @param {Function} iteratee - A function applied to each item in the
 * collection that potentially modifies the accumulator. The `iteratee` is
 * passed a `callback(err)` which accepts an optional error as its first
 * argument. If an error is passed to the callback, the transform is stopped
 * and the main `callback` is immediately called with the error.
 * Invoked with (accumulator, item, key, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the transformed accumulator.
 * Invoked with (err, result).
 * @example
 *
 * async.transform([1,2,3], function(acc, item, index, callback) {
 *     // pointless async:
 *     process.nextTick(function() {
 *         acc.push(item * 2)
 *         callback(null)
 *     });
 * }, function(err, result) {
 *     // result is now equal to [2, 4, 6]
 * });
 *
 * @example
 *
 * async.transform({a: 1, b: 2, c: 3}, function (obj, val, key, callback) {
 *     setImmediate(function () {
 *         obj[key] = val * 2;
 *         callback();
 *     })
 * }, function (err, result) {
 *     // result is equal to {a: 2, b: 4, c: 6}
 * })
 */
function transform(coll, accumulator, iteratee, callback) {
    if (arguments.length === 3) {
        callback = iteratee;
        iteratee = accumulator;
        accumulator = isArray(coll) ? [] : {};
    }
    callback = once(callback || noop);

    eachOf(coll, function (v, k, cb) {
        iteratee(accumulator, v, k, cb);
    }, function (err) {
        callback(err, accumulator);
    });
}

/**
 * Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
 * unmemoized form. Handy for testing.
 *
 * @name unmemoize
 * @static
 * @memberOf module:Utils
 * @method
 * @see [async.memoize]{@link module:Utils.memoize}
 * @category Util
 * @param {Function} fn - the memoized function
 * @returns {Function} a function that calls the original unmemoized function
 */
function unmemoize(fn) {
    return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
    };
}

/**
 * Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
 * stopped, or an error occurs.
 *
 * @name whilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Function} test - synchronous truth test to perform before each
 * execution of `iteratee`. Invoked with ().
 * @param {Function} iteratee - A function which is called each time `test` passes.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `iteratee`'s
 * callback. Invoked with (err, [results]);
 * @returns undefined
 * @example
 *
 * var count = 0;
 * async.whilst(
 *     function() { return count < 5; },
 *     function(callback) {
 *         count++;
 *         setTimeout(function() {
 *             callback(null, count);
 *         }, 1000);
 *     },
 *     function (err, n) {
 *         // 5 seconds have passed, n = 5
 *     }
 * );
 */
function whilst(test, iteratee, callback) {
    callback = onlyOnce(callback || noop);
    if (!test()) return callback(null);
    var next = rest(function (err, args) {
        if (err) return callback(err);
        if (test()) return iteratee(next);
        callback.apply(null, [null].concat(args));
    });
    iteratee(next);
}

/**
 * Repeatedly call `fn` until `test` returns `true`. Calls `callback` when
 * stopped, or an error occurs. `callback` will be passed an error and any
 * arguments passed to the final `fn`'s callback.
 *
 * The inverse of [whilst]{@link module:ControlFlow.whilst}.
 *
 * @name until
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {Function} test - synchronous truth test to perform before each
 * execution of `fn`. Invoked with ().
 * @param {Function} fn - A function which is called each time `test` fails.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has passed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `fn`'s
 * callback. Invoked with (err, [results]);
 */
function until(test, fn, callback) {
    whilst(function () {
        return !test.apply(this, arguments);
    }, fn, callback);
}

/**
 * Runs the `tasks` array of functions in series, each passing their results to
 * the next in the array. However, if any of the `tasks` pass an error to their
 * own callback, the next function is not executed, and the main `callback` is
 * immediately called with the error.
 *
 * @name waterfall
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array of functions to run, each function is passed
 * a `callback(err, result1, result2, ...)` it must call on completion. The
 * first argument is an error (which can be `null`) and any further arguments
 * will be passed as arguments in order to the next task.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This will be passed the results of the last task's
 * callback. Invoked with (err, [results]).
 * @returns undefined
 * @example
 *
 * async.waterfall([
 *     function(callback) {
 *         callback(null, 'one', 'two');
 *     },
 *     function(arg1, arg2, callback) {
 *         // arg1 now equals 'one' and arg2 now equals 'two'
 *         callback(null, 'three');
 *     },
 *     function(arg1, callback) {
 *         // arg1 now equals 'three'
 *         callback(null, 'done');
 *     }
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 *
 * // Or, with named functions:
 * async.waterfall([
 *     myFirstFunction,
 *     mySecondFunction,
 *     myLastFunction,
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 * function myFirstFunction(callback) {
 *     callback(null, 'one', 'two');
 * }
 * function mySecondFunction(arg1, arg2, callback) {
 *     // arg1 now equals 'one' and arg2 now equals 'two'
 *     callback(null, 'three');
 * }
 * function myLastFunction(arg1, callback) {
 *     // arg1 now equals 'three'
 *     callback(null, 'done');
 * }
 */
var waterfall = function (tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
    if (!tasks.length) return callback();
    var taskIndex = 0;

    function nextTask(args) {
        if (taskIndex === tasks.length) {
            return callback.apply(null, [null].concat(args));
        }

        var taskCallback = onlyOnce(rest(function (err, args) {
            if (err) {
                return callback.apply(null, [err].concat(args));
            }
            nextTask(args);
        }));

        args.push(taskCallback);

        var task = tasks[taskIndex++];
        task.apply(null, args);
    }

    nextTask([]);
};

/**
 * Async is a utility module which provides straight-forward, powerful functions
 * for working with asynchronous JavaScript. Although originally designed for
 * use with [Node.js](http://nodejs.org) and installable via
 * `npm install --save async`, it can also be used directly in the browser.
 * @module async
 */

/**
 * A collection of `async` functions for manipulating collections, such as
 * arrays and objects.
 * @module Collections
 */

/**
 * A collection of `async` functions for controlling the flow through a script.
 * @module ControlFlow
 */

/**
 * A collection of `async` utility functions.
 * @module Utils
 */
var index = {
  applyEach: applyEach,
  applyEachSeries: applyEachSeries,
  apply: apply$2,
  asyncify: asyncify,
  auto: auto,
  autoInject: autoInject,
  cargo: cargo,
  compose: compose,
  concat: concat,
  concatSeries: concatSeries,
  constant: constant,
  detect: detect,
  detectLimit: detectLimit,
  detectSeries: detectSeries,
  dir: dir,
  doDuring: doDuring,
  doUntil: doUntil,
  doWhilst: doWhilst,
  during: during,
  each: eachLimit,
  eachLimit: eachLimit$1,
  eachOf: eachOf,
  eachOfLimit: eachOfLimit,
  eachOfSeries: eachOfSeries,
  eachSeries: eachSeries,
  ensureAsync: ensureAsync,
  every: every,
  everyLimit: everyLimit,
  everySeries: everySeries,
  filter: filter,
  filterLimit: filterLimit,
  filterSeries: filterSeries,
  forever: forever,
  log: log,
  map: map,
  mapLimit: mapLimit,
  mapSeries: mapSeries,
  mapValues: mapValues,
  mapValuesLimit: mapValuesLimit,
  mapValuesSeries: mapValuesSeries,
  memoize: memoize,
  nextTick: nextTick,
  parallel: parallelLimit,
  parallelLimit: parallelLimit$1,
  priorityQueue: priorityQueue,
  queue: queue$1,
  race: race,
  reduce: reduce,
  reduceRight: reduceRight,
  reflect: reflect,
  reflectAll: reflectAll,
  reject: reject,
  rejectLimit: rejectLimit,
  rejectSeries: rejectSeries,
  retry: retry,
  retryable: retryable,
  seq: seq$1,
  series: series,
  setImmediate: setImmediate$1,
  some: some,
  someLimit: someLimit,
  someSeries: someSeries,
  sortBy: sortBy,
  timeout: timeout,
  times: times,
  timesLimit: timeLimit,
  timesSeries: timesSeries,
  transform: transform,
  unmemoize: unmemoize,
  until: until,
  waterfall: waterfall,
  whilst: whilst,

  // aliases
  all: every,
  any: some,
  forEach: eachLimit,
  forEachSeries: eachSeries,
  forEachLimit: eachLimit$1,
  forEachOf: eachOf,
  forEachOfSeries: eachOfSeries,
  forEachOfLimit: eachOfLimit,
  inject: reduce,
  foldl: reduce,
  foldr: reduceRight,
  select: filter,
  selectLimit: filterLimit,
  selectSeries: filterSeries,
  wrapSync: asyncify
};

exports['default'] = index;
exports.applyEach = applyEach;
exports.applyEachSeries = applyEachSeries;
exports.apply = apply$2;
exports.asyncify = asyncify;
exports.auto = auto;
exports.autoInject = autoInject;
exports.cargo = cargo;
exports.compose = compose;
exports.concat = concat;
exports.concatSeries = concatSeries;
exports.constant = constant;
exports.detect = detect;
exports.detectLimit = detectLimit;
exports.detectSeries = detectSeries;
exports.dir = dir;
exports.doDuring = doDuring;
exports.doUntil = doUntil;
exports.doWhilst = doWhilst;
exports.during = during;
exports.each = eachLimit;
exports.eachLimit = eachLimit$1;
exports.eachOf = eachOf;
exports.eachOfLimit = eachOfLimit;
exports.eachOfSeries = eachOfSeries;
exports.eachSeries = eachSeries;
exports.ensureAsync = ensureAsync;
exports.every = every;
exports.everyLimit = everyLimit;
exports.everySeries = everySeries;
exports.filter = filter;
exports.filterLimit = filterLimit;
exports.filterSeries = filterSeries;
exports.forever = forever;
exports.log = log;
exports.map = map;
exports.mapLimit = mapLimit;
exports.mapSeries = mapSeries;
exports.mapValues = mapValues;
exports.mapValuesLimit = mapValuesLimit;
exports.mapValuesSeries = mapValuesSeries;
exports.memoize = memoize;
exports.nextTick = nextTick;
exports.parallel = parallelLimit;
exports.parallelLimit = parallelLimit$1;
exports.priorityQueue = priorityQueue;
exports.queue = queue$1;
exports.race = race;
exports.reduce = reduce;
exports.reduceRight = reduceRight;
exports.reflect = reflect;
exports.reflectAll = reflectAll;
exports.reject = reject;
exports.rejectLimit = rejectLimit;
exports.rejectSeries = rejectSeries;
exports.retry = retry;
exports.retryable = retryable;
exports.seq = seq$1;
exports.series = series;
exports.setImmediate = setImmediate$1;
exports.some = some;
exports.someLimit = someLimit;
exports.someSeries = someSeries;
exports.sortBy = sortBy;
exports.timeout = timeout;
exports.times = times;
exports.timesLimit = timeLimit;
exports.timesSeries = timesSeries;
exports.transform = transform;
exports.unmemoize = unmemoize;
exports.until = until;
exports.waterfall = waterfall;
exports.whilst = whilst;
exports.all = every;
exports.allLimit = everyLimit;
exports.allSeries = everySeries;
exports.any = some;
exports.anyLimit = someLimit;
exports.anySeries = someSeries;
exports.find = detect;
exports.findLimit = detectLimit;
exports.findSeries = detectSeries;
exports.forEach = eachLimit;
exports.forEachSeries = eachSeries;
exports.forEachLimit = eachLimit$1;
exports.forEachOf = eachOf;
exports.forEachOfSeries = eachOfSeries;
exports.forEachOfLimit = eachOfLimit;
exports.inject = reduce;
exports.foldl = reduce;
exports.foldr = reduceRight;
exports.select = filter;
exports.selectLimit = filterLimit;
exports.selectSeries = filterSeries;
exports.wrapSync = asyncify;

Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":5}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":5}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var pickOneByWeight = require('pick-one-by-weight');

var isType = function isType(t) {
  return Object.prototype.toString.call(t).slice(8, -1).toLowerCase();
};

var MarkovChain = (function () {
  function MarkovChain(contents) {
    var normFn = arguments.length <= 1 || arguments[1] === undefined ? function (word) {
      return word.replace(/\.$/ig, '');
    } : arguments[1];

    _classCallCheck(this, MarkovChain);

    this.wordBank = Object.create(null);
    this.sentence = '';
    this._normalizeFn = normFn;
    this.parseBy = /(?:\.|\?|\n)/ig;
    this.parse(contents);
  }

  _createClass(MarkovChain, [{
    key: 'startFn',
    value: function startFn(wordList) {
      var k = Object.keys(wordList);
      var l = k.length;
      return k[~ ~(Math.random() * l)];
    }
  }, {
    key: 'endFn',
    value: function endFn() {
      return this.sentence.split(' ').length > 7;
    }
  }, {
    key: 'process',
    value: function process() {
      var curWord = this.startFn(this.wordBank);
      this.sentence = curWord;
      while (this.wordBank[curWord] && !this.endFn()) {
        curWord = pickOneByWeight(this.wordBank[curWord]);
        this.sentence += ' ' + curWord;
      }
      return this.sentence;
    }
  }, {
    key: 'parse',
    value: function parse() {
      var _this = this;

      var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var parseBy = arguments.length <= 1 || arguments[1] === undefined ? this.parseBy : arguments[1];

      text.split(parseBy).forEach(function (lines) {
        var words = lines.split(' ').filter(function (w) {
          return w.trim() !== '';
        });
        for (var i = 0; i < words.length - 1; i++) {
          var curWord = _this._normalize(words[i]);
          var nextWord = _this._normalize(words[i + 1]);

          if (!_this.wordBank[curWord]) {
            _this.wordBank[curWord] = Object.create(null);
          }
          if (!_this.wordBank[curWord][nextWord]) {
            _this.wordBank[curWord][nextWord] = 1;
          } else {
            _this.wordBank[curWord][nextWord] += 1;
          }
        }
      });
      return this;
    }
  }, {
    key: 'start',
    value: function start(fnStr) {
      var startType = isType(fnStr);
      if (startType === 'string') {
        this.startFn = function () {
          return fnStr;
        };
      } else if (startType === 'function') {
        this.startFn = function (wordList) {
          return fnStr(wordList);
        };
      } else {
        throw new Error('Must pass a function, or string into start()');
      }
      return this;
    }
  }, {
    key: 'end',
    value: function end(fnStrOrNum) {
      var _this2 = this;

      var endType = isType(fnStrOrNum);
      var self = this;

      if (endType === 'function') {
        this.endFn = function () {
          return fnStrOrNum(_this2.sentence);
        };
      } else if (endType === 'string') {
        this.endFn = function () {
          return _this2.sentence.split(' ').slice(-1)[0] === fnStrOrNum;
        };
      } else if (endType === 'number' || fnStrOrNum === undefined) {
        fnStrOrNum = fnStrOrNum || Infinity;
        this.endFn = function () {
          return self.sentence.split(' ').length > fnStrOrNum;
        };
      } else {
        throw new Error('Must pass a function, string or number into end()');
      }
      return this;
    }
  }, {
    key: '_normalize',
    value: function _normalize(word) {
      return this._normalizeFn(word);
    }
  }, {
    key: 'normalize',
    value: function normalize(fn) {
      this._normalizeFn = fn;
      return this;
    }
  }], [{
    key: 'VERSION',
    get: function get() {
      return require('../package').version;
    }
  }, {
    key: 'MarkovChain',
    get: function get() {
      // load older MarkovChain
      return require('../older/index.js').MarkovChain;
    }
  }]);

  return MarkovChain;
})();

module.exports = MarkovChain;
},{"../older/index.js":8,"../package":9,"pick-one-by-weight":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = pickOneByWeight;

function pickOneByWeight(anObj) {
  var _keys = Object.keys(anObj);
  var sum = _keys.reduce(function (p, c) {
    return p + anObj[c];
  }, 0);
  if (!Number.isFinite(sum)) {
    throw new Error("All values in object must be a numeric value");
  }
  var choose = ~ ~(Math.random() * sum);
  for (var i = 0, count = 0; i < _keys.length; i++) {
    count += anObj[_keys[i]];
    if (count > choose) {
      return _keys[i];
    }
  }
}

module.exports = exports["default"];
},{}],8:[function(require,module,exports){
(function (process){
'use strict';

var async = require('async')
  , fs = require('fs')
  , path = require('path')
  , pickOneByWeight = require('pick-one-by-weight')
  , isType
  , kindaFile
  , MarkovChain

isType = function(t) {
  return Object.prototype.toString.call(t).slice(8, -1).toLowerCase()
}

kindaFile = function(file) {
  return file.indexOf('.' + path.sep) === 0 || file.indexOf(path.sep) === 0
}

MarkovChain = function(args) {
  if (!args) { args = {} }
  this.wordBank = {}
  this.sentence = ''
  this.files = []
  if (args.files) {
    return this.use(args.files)
  }

  this.startFn = function(wordList) {
    var k = Object.keys(wordList)
    var l = k.length

    return k[~~(Math.random()*l)]
  }

  this.endFn = function() {
    return this.sentence.split(' ').length > 7
  }

  return this
}

MarkovChain.prototype.VERSION = require('../package').version

MarkovChain.prototype.use = function(files) {
  if (isType(files) === 'array') {
    this.files = files
  }
  else if (isType(files) === 'string') {
    this.files = [files]
  }
  else {
    throw new Error('Need to pass a string or array for use()')
  }
  return this
}

MarkovChain.prototype.readFile = function(file) {
  return function(callback) {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) {
        // if the file does not exist,
        // if `file` starts with ./ or /, assuming trying to be a file
        // if `file` has a '.', and the string after that has no space, assume file
        if (err.code === 'ENOENT' && !kindaFile(file)) {
          return callback(null, file);
        }
        return callback(err)
      }
      process.nextTick(function() { callback(null, data) })
    })
  }
}

MarkovChain.prototype.countTotal = function(word) {
  var total = 0
    , prop

  for (prop in this.wordBank[word]) {
    if (this.wordBank[word].hasOwnProperty(prop)) {
      total += this.wordBank[word][prop]
    }
  }
  return total
}

MarkovChain.prototype.process = function(callback) {
  var readFiles = []

  this.files.forEach(function(file) {
    readFiles.push(this.readFile(file))
  }.bind(this))

  async.parallel(readFiles, function(err, retFiles) {
    var words
      , curWord
    this.parseFile(retFiles.toString())

    curWord = this.startFn(this.wordBank)

    this.sentence = curWord

    while (this.wordBank[curWord] && !this.endFn()) {
      curWord = pickOneByWeight(this.wordBank[curWord])
      this.sentence += ' ' + curWord
    }
    callback(null, this.sentence.trim())

  }.bind(this))

  return this
}

MarkovChain.prototype.parseFile = function(file) {
  // splits sentences based on either an end line
  // or a period (followed by a space)
  file.split(/(?:\. |\n)/ig).forEach(function(lines) {
    var curWord
      , i
      , nextWord
      , words

    words = lines.split(' ').filter(function(w) { return (w.trim() !== '') })
    for (i = 0; i < words.length - 1; i++) {
      curWord = this.normalize(words[i])
      nextWord = this.normalize(words[i + 1])
      if (!this.wordBank[curWord]) {
        this.wordBank[curWord] = {}
      }
      if (!this.wordBank[curWord][nextWord]) {
        this.wordBank[curWord][nextWord] = 1
      }
      else {
        this.wordBank[curWord][nextWord] += 1
      }
    }
  }.bind(this))
}

MarkovChain.prototype.start = function(fnStr) {
  var startType = isType(fnStr)
  if (startType === 'string') {
    this.startFn = function() {
      return fnStr
    }
  }
  else if (startType === 'function') {
    this.startFn = function(wordList) {
      return fnStr(wordList)
    }
  }
  else {
    throw new Error('Must pass a function, or string into start()')
  }
  return this
}

MarkovChain.prototype.end = function(fnStrOrNum) {
  var endType = isType(fnStrOrNum)
  var self = this;

  if (endType === 'function') {
    this.endFn = function() { return fnStrOrNum(this.sentence) }
  }
  else if (endType === 'string') {
    this.endFn = function() {
      return self.sentence.split(' ').slice(-1)[0] === fnStrOrNum
    }
  }
  else if (endType === 'number' || fnStrOrNum === undefined) {
    fnStrOrNum = fnStrOrNum || Infinity
    this.endFn = function() { return self.sentence.split(' ').length > fnStrOrNum }
  }
  else {
    throw new Error('Must pass a function, string or number into end()')
  }
  return this
}

MarkovChain.prototype.normalize = function(word) {
  return word.replace(/\.$/ig, '')
}

module.exports.MarkovChain = MarkovChain

}).call(this,require('_process'))
},{"../package":9,"_process":5,"async":2,"fs":3,"path":4,"pick-one-by-weight":7}],9:[function(require,module,exports){
module.exports={
  "name": "markovchain",
  "version": "1.0.2",
  "description": "generates a markov chain of words based on input files",
  "main": "lib/index.js",
  "directories": {
    "test": "test"
  },
  "scripts": {
    "test": "mocha test/test*.js",
    "babel-watch": "babel src --watch --out-dir lib",
    "compile": "babel src --out-dir lib",
    "preversion": "npm test",
    "prepublish": "npm run compile && npm test",
    "postpublish": "rm -rf ./lib/*.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/swang/markovchain.git"
  },
  "keywords": [
    "markov chain",
    "markov"
  ],
  "dependencies": {
    "pick-one-by-weight": "~1.0.0"
  },
  "devDependencies": {
    "babel": "~5.8.23",
    "chai": "~3.4.1",
    "mocha": "~2.3.4"
  },
  "author": {
    "name": "Shuan Wang"
  },
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/swang/markovchain/issues"
  },
  "engines": {
    "node": ">=0.8"
  },
  "gitHead": "fee2d2011b382e87286434e638dc0f17e8ab7547",
  "homepage": "https://github.com/swang/markovchain#readme",
  "_id": "markovchain@1.0.2",
  "_shasum": "58b38643fb6093cd5b62455b7b1e7bbfe56d7e53",
  "_from": "markovchain@>=1.0.2 <2.0.0",
  "_npmVersion": "3.5.2",
  "_nodeVersion": "4.0.0",
  "_npmUser": {
    "name": "swang",
    "email": "shuanwang@gmail.com"
  },
  "dist": {
    "shasum": "58b38643fb6093cd5b62455b7b1e7bbfe56d7e53",
    "tarball": "https://registry.npmjs.org/markovchain/-/markovchain-1.0.2.tgz"
  },
  "maintainers": [
    {
      "name": "swang",
      "email": "shuanwang@gmail.com"
    }
  ],
  "_resolved": "https://registry.npmjs.org/markovchain/-/markovchain-1.0.2.tgz",
  "readme": "ERROR: No README data found!"
}

},{}],10:[function(require,module,exports){
module.exports = "Can You Guess Which Hipster Maple Product Is The Most Expensive?\n\
How The Elks Club Made Its Way To The 21st Century\n\
Only A True Science Nerd Can Get More Than 70% On This Quiz\n\
Do You Know What Happened In Tech The Week Of May 23?\n\
This Woman Tried To Find Her Best Friend Through A Game Show\n\
25 Awesome Father's Day Gifts You'll Want To Keep For Yourself\n\
We Gave People Tequila Then Asked Them About Love And Shit Got So Real\n\
This Guy Got Burnt To A Crisp By The Scripps Spelling Bee On Twitter\n\
Olly Alexander Had The Perfect Reaction To His Album Being Placed In A Store's Gay Section\n\
18 Tumblr Posts Asian People Will Find Just Excellent\n\
25 Parenting Products To Get You Through The Summer\n\
Jessica Lange Definitely Isn't Planning On Returning To American Horror Story\n\
This Couple Experienced Cuddling With Strangers And It Was Adorable\n\
One Man Opened Up About Surviving The Holocaust\n\
We Oiled Our Pubic Hair For A Week And It Was Quite The Experience\n\
The Most Interesting Photo Stories Of The Week\n\
The Most Surprising Stories You Can't Miss This Week\n\
Chewbacca Mask Mom Dishes On Her Viral Success, And Choice Of Streaming Platform\n\
69 Thoughts You Have While Getting A Pedicure\n\
Can You Guess Which Handbag Is The Most Expensive?\n\
After One Year And 200 Million Users, Here's What Google Photos Could Do Next\n\
41 Insane Memorial Day Weekend Sales To Shop Right Now\n\
Juan Gabriel Dropped A Creedence Clearwater Cover And It's Everything\n\
17 Fascinating, Intimate Photos Of Prostitutes Throughout History\n\
17 Things You'll Only Understand If You're Modern Mom\n\
19 Awards People With Anxiety In Big Cities Deserve To Receive\n\
The Triumphant Rise And Mysterious Fall Of Person Of Interest\n\
This Teen Designed An Amazing Handmade Coming To America Prom Dress\n\
Rebel Wilson Crushed David Schwimmer And James Corden In A Rap Battle\n\
37 Books Every Parent Needs To Read\n\
Can You Guess Which Sneaker Is The Most Expensive?\n\
51 Fifth Harmony Lyrics For When You Need An Instagram Caption\n\
This Is Why Everyone In Brazil Is Talking About Rape Culture\n\
The Inception Donut Is Here And It Is Too Beautiful For Words\n\
Here Is What People In Hiroshima Want Obama To Know\n\
Apple Removed This Lesbian Couple From International Versions Of Its Ad\n\
23 Of The Most Powerful Photos Of This Week\n\
This Woman Brought Ice Cream To McDonald's Because Their Machine Is Always Out\n\
Here's Why It's Actually Really Sad That Khloé And Lamar Are Definitely Divorcing\n\
Zenon Fans, Apparently We've Been Saying Zetus Lapetus Wrong This Entire Time\n\
21 Things People Who Are Slightly Obsessed With TV Will Understand\n\
23 Things Peruvians Know To Be True\n\
Please Let Chris Evans' Steve Rogers Be All Up In The New Spider-Man Movie\n\
Anti-Trump Protesters Clash With Supporters Outside San Diego Rally\n\
Trump's California Drought Plan: We're Going To Start Opening Up The Water\n\
Ed Rendell: Democrats Are Short About $10 Million For Convention\n\
Bernie Sanders Gets In Snippy Exchange With California Radio Hosts\n\
Amber Heard Obtains Restraining Order Against Johnny Depp, Citing Physical Abuse\n\
Alabama's Chief Justice Goes To Federal Court To Seek Civil Rights Protections\n\
World War II-Era Fighter Plane Crashes In Hudson River; Pilot Unaccounted For\n\
eBay Founder Rallies Behind Gawker In Its Effort To Appeal Hulk Hogan Case\n\
Laws That Once Restrained Feudal Lords Would've Helped Gawker Today\n\
Sean Parker Denies Being Mystery Friend In Peter Thiel's Secret War On Gawker\n\
Will Mark Zuckerberg Vote For Peter Thiel Now?\n\
Verizon And Unions Representing 39,000 Strikers Reach Agreement\n\
Glee Actor Mark Salling Indicted On Child Pornography Charges\n\
The “Cell Phones Cause Cancer” Myth That Just Won’t Die\n\
Senator Demands Immediate Action On No-Good College Accreditors\n\
President Obama Makes Historic Visit To Hiroshima\n\
Mayor Says He Heard About Alleged Coat Hanger Rape, But Town Kept It “Hush Hush”\n\
NFL Players Aren't Surprised The League Tried To Mess With Concussion Research\n\
Inside The College That Abolished The F And Raked In The Cash\n\
This Woman Was Expelled For Allegedly Sexually Assaulting A Man On Campus\n\
14 Badass Historical Women To Name Your Daughters After\n\
12 Historical Women Who Gave No Fucks\n\
This Mom Tried To Surprise Her Daughter At College And It Went Hilariously Wrong\n\
This Husband Has A Simple Way To Support His Wife After She Lost Her Pinky\n\
This Grandma's Makeup Transformation Is Jaw-Droppingly Gorgeous\n\
33 Products That Are Almost Too Clever To Use\n\
27 Dirty Tumblr Posts That Will Make You Laugh Then Pray For Forgiveness\n\
19 Photos Of Moms That Are Never Not Funny\n\
15 Anal Sex Horror Stories That’ll Make You Gag\n\
Kristen Bell Just Got So Real About What It's Like To Live With Anxiety And Depression\n\
21 Hilarious Tweets About Moms Guaranteed To Make You Laugh\n\
You Probably Shouldn't Open These Pictures Of Dicks And Balls In Public\n\
23 Products For Anyone Who Loves Butter\n\
Anthony Bourdain's Manila Episode Of Parts Unknown Will Make You Feel Things\n\
A Guy Says He Was Questioned On A Plane For Doing Math During A Flight\n\
This Couple Had An Insanely Unique Baby Gender Reveal\n\
We Can Tell Where You Last Had Sex In Just Five Questions\n\
Inside Palantir, Silicon Valley's Most Secretive Company\n\
17 Times Regular Food Wasn't Good Enough For Hipsters\n\
People Can't Get Enough Of This Guy's Homework Mistake\n\
People Are Really Upset Over This Girl's Sad Photo Of Her Grandma\n\
21 People Who Need To Be Thrown In Prison For Eternity\n\
The Urban Poor You Haven’t Noticed: Millennials Who're Broke, Hungry, But On Trend\n\
28 Photos That Prove The Kardashians Do Not Live A Normal Life\n\
Kristen Bell And Mila Kunis Being Surprised By Their Husbands Will Make Your Heart Hurt\n\
25 Photos So Satisfying They'll Make Everything OK Again\n\
Can You Pass This Maths SAT Test For 6-Year-Olds?\n\
This Naval Officer Is An Instagram Sensation Due To His Dashing Looks And Luscious Locks\n\
Here’s What Asos Prom Dresses And Suits Actually Look Like IRL\n\
Can You Pick Which Couple Is Actually Miserable?\n\
Sh*t You Do In Your Car\n\
Whiskey Chaser Taste Test\n\
This Tap Group Did A Tribute To Prince And It Was Amazing\n\
We Tried Men's Grooming Products For A Week And Smelled Like Dude\n\
One Man Opened Up About Surviving The Holocaust\n\
These Kids Explained Where Babies Come From And It Was Hilarious\n\
Asian Americans Discuss The Black Lives Matter Movement\n\
Men Got Transformed Into Male Fashion Icons And They Worked It\n\
This Is What Would Go Down If Meeting Your S.O.'s Parents Were Honest\n\
Let’s Settle The Age-Old Superpower Debate\n\
The Mysterious Death Of Biggie Smalls\n\
Chinese-American Guys Wear Traditional Chinese Clothing For A Day\n\
Rebel Wilson Crushed David Schwimmer And James Corden In A Rap Battle\n\
Abuelas Make Arroz Con Leche\n\
We Gave People Tequila Then Asked Them About Love And Shit Got So Real\n\
Hot Mess Mom Hacks\n\
Enjoy This Totally Awesome Cherry Moscow Mule This Weekend\n\
Here's How To Make A Delicious Spinach And Cheese Pork Roll\n\
Daughters Pranked Their Dads With A Fake Secret And It Was Intense\n\
35 Questions Everybody Asks Themselves\n\
This Is What Would Go Down If Meeting Your S.O.'s Parents Were Honest\n\
How To Get Dumped\n\
People React To Latin Music Video\n\
A Drummer In NYC's Subway Started A Dance Party To Rihanna’s Work And It Was Lit\n\
These Adorable Babies Were Too Cute For These People To Handle\n\
We Tried Men's Grooming Products For A Week And Smelled Like Dude\n\
If We Lived In A Genderless World\n\
6 Satisfying Moments Queer Women Understand\n\
Asian-Americans Played Mahjong And Things Got Crazy\n\
How Well Can You Differentiate Color?\n\
What Does Frijidiaré Mean?\n\
Best Friends Draw Each Other Like French Girls (From Titanic)\n\
Asian Americans Discuss The Black Lives Matter Movement\n\
Should You Live In NY Or L.A.?\n\
One Man Opened Up About Surviving The Holocaust\n\
This Tap Group Did A Tribute To Prince And It Was Amazing\n\
This Is What Would Happen If Men Got Pregnant\n\
These Kids Explained Where Babies Come From And It Was Hilarious\n\
We Got Our Arms Waxed For The First Time And It Was Painful\n\
Do I Want To Be Her Or Do I Want To F*ck Her?\n\
8 Awkward Moments Only Latinos Understand\n\
Can You Pass The FBI Entrance Exam?\n\
Kids Tried Yoga And Were Actually Good At It\n\
Can You Be Trusted With Contact Lenses?\n\
This Couple Swapped Phones For A Day And Things Got Out Of Hand\n\
What It's Like Being Single AF W/ Zach Kornfeld\n\
I Put A Payment Chip In My Hand To Replace My Wallet\n\
We Tried A Device To Get Rid Of Our Period Cramps And It Kind Of Worked\n\
Trying To Get A Bartender's Attention\n\
Can You Pick The Celebrity Who's Under 30?\n\
Can You Pick The Most Expensive Item From Anthropologie?\n\
Can You Pick The Most Expensive Manicure?\n\
Can You Pick Which Canadian Province Is The Drunkest?\n\
How Well Do You Know The iPhone Home Screen?\n\
Can You Actually Locate The Canadian Provinces And Territories?\n\
Do You Know What Happened In Tech The Week Of May 23?\n\
Can You Pick Which Bizarre Sex Toy Is The Most Expensive?\n\
Can You Guess Which Purse Belongs To Taylor Swift?\n\
We Know Which Dancing Kid GIF You'll Love Based On Your Zodiac Sign\n\
Can You Guess Which Hipster Maple Product Is The Most Expensive?\n\
What Fifth Harmony Song Are You Based On Your Zodiac Sign?\n\
Which Jennifer Lawrence Film Are You Based On Your Zodiac Sign?\n\
Can You Pick The Most Expensive Pair Of Jeans?\n\
Can You Ace This Beauty And The Beast Quiz?\n\
Can You Guess Which Female Pop Singer The Hair Belongs To?\n\
Can You Identify The X-Men Character By Their Comic Book Color Scheme?\n\
Which Pixar Movie Is The Story Of Your Life?\n\
Do You Remember Which Toy Story Movie These Quotes Are From?\n\
Can You Pick The Biggest Asshole At The Gym?\n\
What's Your True Zodiac Element?\n\
Can You Pick The Most Expensive Waitrose Item?\n\
Can You Solve The Toughest BuzzFeed Crossword Of The Week?\n\
We Bet You Can't Guess Which Of These Animals ISN'T A Criminal\n\
Do You Know What Happened In The News This Week?\n\
This “Powerpuff Girls” Trivia Test Will Determine Which Villain You Are\n\
Can You Pick The Shoes That Belong To Scarlett Johansson?\n\
Which Song From Meghan Trainor's Thank You Are You Based On Your Zodiac Sign?\n\
Can You Name These Cheeses?\n\
Which Johnny Depp Movie Should You Watch Based On The First Letter Of Your Name?\n\
Can You Guess Which Handbag Is The Most Expensive?\n\
Can You Pick The Tim Hortons Item With The Most Calories?\n\
What Would Your Barbie Name Be?\n\
Can You Guess Which Sneaker Is The Most Expensive?\n\
Only A True Science Nerd Can Get More Than 70% On This Quiz\n\
Can You Name These Crayola Crayon Colors?\n\
Can You Get Through Ikea Without Breaking Up?\n\
Which Disney Princess Movie Is Rated Higher On IMDb?\n\
What Does Your Favorite High School Musical Character Say About You?\n\
How Would You Die In “Game Of Thrones”?\n\
Can You Pick The Guy With The Biggest Dick?\n\
Can You Guess Which Disney Prince Is Actually A Fuckboy?\n\
Can You Guess Which Shoe Is The Most Expensive?\n\
We Bet You Can't Tell Which Of These Engagement Rings Is The Most Expensive\n\
Get 15/20 In This Quiz To Prove You're Really A '00s Kid\n\
Can You Pick Which Couple Is Actually Miserable?\n\
Can You Pick The Most Expensive Prom Dress?\n\
Can You Survive A Public Restroom?\n\
This Pubic Test Will Reveal A Deep And Meaningful Truth About You\n\
Guess How Much This Hipster Fucking Food Costs\n\
7 Delicious Dinners That Are Under 500 Calories Each\n\
The Inception Donut Is Here And It Is Too Beautiful For Words\n\
Help Us Pick The Ingredients For Our Next Tasty Recipe Video\n\
25 Mouthwatering Recipes To Grill For Memorial Day\n\
17 Recipes For The Perfect Summer Cookout\n\
15 Super-Easy Snacks You Can Make With 5 Ingredients Or Less\n\
7 Meal Prep Tips That'll Make You Feel Like A Boss\n\
21 Mac And Cheese Recipes That Will Blow Your Kids' Minds\n\
17 Meatless Slow Cooker Dinners That Are Actually Delicious\n\
How To Make The Most Pho-King Delicious Soup Ever\n\
Making Great Pho Is Hard, But Making A Life From Scratch Is Harder\n\
26 Essential Products Everyone Who Loves To Bake Should Own\n\
Can You Pick The Highest-Calorie McDonald's Menu Item?\n\
Which Piece Of Cheesecake From The Cheesecake Factory Has The Most Calories?\n\
15 Places You Must Drink Wine Before You Die\n\
Make These Tasty Cheese-Stuffed Cauliflower Nuggets With Your Kiddo\n\
Here's What Happens When You Stuff Pizza Into Tater Tots\n\
23 Pinterest Cooking Fails Guaranteed To Make You Laugh\n\
Which Depressing Bowl Of Sugary Cereal Should You Eat Tonight?\n\
The Ultimate Guide To NYC Cheap Eats\n\
Blake Shelton Tried Sushi For The First Time And Wasn't A Fan\n\
What Your Frozen Yogurt Order Says About You\n\
Turns Out, Being A Budget Vegan Is Way Easier Than Being A Fancy One\n\
Do You Know Which Starbucks Drink Has The Most Sugar?\n\
These Mozzarella Sticks + Onion Rings = Perfection\n\
Dunkin' Donuts Is Totally Obsessed With Sweet, Flavored Coffees\n\
22 Parents From Around The World Discuss Food And Their Kids\n\
Get Into This Chicken Soup That You Can Eat Out Of A Tortilla Bowl\n\
Olive Garden Launches Spaghetti Pie, Just In Time For Summer\n\
25 Awesome Father's Day Gifts You'll Want To Keep For Yourself\n\
Here's What People Want Most On Amazon This Week\n\
Can You Get Through Ikea Without Breaking Up?\n\
23 Products That Will Make Your Closet Your Happy Place\n\
Here's What People Are Buying On Amazon This Week\n\
27 Graduation Gifts That Will Kickstart Adulthood\n\
7 Bathroom Cleaning Tips You'll Actually Want To Try\n\
19 Beautiful Products That Are Surprisingly Soothing\n\
7 Quick Ways To Actually Declutter Your Life\n\
Can You Get Through This Post Without Spending $25\n\
17 DIY Bathroom Upgrades You Can Actually Do\n\
21 Lovely Wildflower Products To Lighten Up Your Life\n\
The Future Of The Apple Store Is Trees\n\
30 Completely Adorable Wall Decals For Kids' Rooms\n\
31 Completely Wonderful Decals You'll Want To Buy For Your Walls\n\
19 Father's Day Gifts To Help Your Dad Achieve Peak Dad\n\
Here's What People Want Most On Amazon This Week\n\
29 Clever Kitchen Cleaning Tips Every Clean Freak Needs To Know\n\
Here's What People Are Buying On Amazon Right Now\n\
Here's One Thing To Clean In Each Room Of Your Home This Week\n\
We Know What You Should Buy To Be An Actual Adult\n\
How Well Can You Guess The Cost Of These Anthropologie Products?\n\
7 Easy Decluttering Tricks You'll Actually Want To Try\n\
10 Little Spells That'll Help Send Love To Your Body\n\
23 Products Every Music-Obsessed Person Should Own\n\
23 Awesome Products From Amazon To Put On Your Wish List\n\
22 Cheap Sofas That Actually Look Expensive\n\
We Tried Fitbit's New Smartphone-Friendly Fitness Trackers\n\
22 Awesome Games You'll Love Playing With Your Family\n\
9 Cows Sitting Like Dogs\n\
This Crow Tried To Steal A Knife From A Crime Scene In Vancouver\n\
These Two Strangers Went On An Epic Cross-Country Quest To Save A Lobster From Death\n\
This Boy And His Dog Who Both Have Dwarfism Will Melt Your Heart\n\
We Met The Tower Of London's Ravenmaster And His Insanely Cool Ravens\n\
17 Tiny Animals You'll Want To Pop In Your Mouth For Safekeeping\n\
These Giant-Ass Dogs And Their Human Best Friend Are A Dream\n\
People Are Really Into This Sexy Horse With Handsome Looks\n\
This Girl And A Baby Gorilla Shared The Sweetest Moment Ever\n\
21 Times Cats Summed Up Your Entire Life\n\
The One Canadian Dog Breed Everyone Needs To Know About Immediately\n\
These National Geographic Animals Give Us Unrealistic Body Expectations\n\
Can You Identify The Celebrity Photoshopped As An Animal?\n\
22 Pictures That Show How Life Changes When You Get A Dog\n\
Can You Guess Which Kitty Secretly Wants To Be A Pup?\n\
What Percentage Cat Are You?\n\
This Boy And His Dog's Sweet Friendship Will Make You Feel All The Feels\n\
This Opossum Giving Her 8 Babies A Piggyback Is Either The Cutest Or Grossest Thing Ever\n\
This Woman Lives With 50 Pigs\n\
Can You Guess The Animal By Its Nose?\n\
Which Animal Should You Save Today?\n\
Varun Dhawan's Dog Doesn't Give A Shit About Staying In Shape\n\
Firefighters Rescued This Adorable Kitten From The Engine Of A Car\n\
18 Adorable Pictures Of Prince Harry With Dogs\n\
These Canadian Cat Lovers Got Married At A Kitty Sanctuary\n\
18 Reasons Working At A Vet Clinic Is The Best\n\
This Hilarious Video Shows Us What Life Is Like For An Insta-Famous Dog\n\
Which Of These People Is A Cat Person?\n\
What % Raccoon Are You?\n\
I Was A Thirsty Male Feminist For A Day And It Was Exhausting\n\
16 Books We Fell In Love With As Young Black Girls\n\
What Happens When You Try To Follow The Rules™ In Real Life?\n\
F@*K, Marry, Kill: Woke Men, Republican Candidates, And White Baes\n\
Melissa Harris-Perry On Her Split With MSNBC: I Am Not A Civil Rights Case\n\
14 Things You Never Knew About Hamilton's Lin-Manuel Miranda\n\
This Is What Lin-Manuel Miranda Said To Kanye When He Saw Hamilton\n\
Another Round, Episode 44: Mommy's Side Piece\n\
Another Round, Episode 41: To Be Young, Gifted, And Black\n\
Here's How W. Kamau Bell Talks About Race With His Kids\n\
Someone Appears To Have Stolen This Woman's Photos And Is Using Them To Troll People\n\
Another Round, Episode 43: A Gumbo Of Afrofuturism\n\
Listen To BuzzFeed's New Podcast The Tell Show!\n\
7 Reasons To Listen To BuzzFeed's New Podcast The Tell Show\n\
Another Round, Episode 40: Blacker History Month\n\
The Mystery Of Michael Jackson And Sonic The Hedgehog\n\
Another Round, Episode 39: The Betrayer Of The Patriarchy\n\
Another Round Episode 27: No New Friends, My Squirrel Dude\n\
Listen To BuzzFeed's Interview With Obama's Senior Advisor\n\
How A Gay Porn Star And Rapper Became Vine Famous And Then Liveblogged His Arrest On Facebook\n\
Another Round, Episode 36: U Mad?\n\
Everyone Is Convinced The Brother And Sister From This Folgers Ad Are Hooking Up\n\
Bored Over The Holidays? Let ‘Another Round’ Keep You Company\n\
How To Celebrate Kwanzaa, According To Another Round\n\
How Well Do You Know These Random, 16th Century Flemish Proverbs?\n\
Meet The Girl Who Buttchugged Cough Syrup\n\
27 Times Comedian Aparna Nancherla Explained Anxiety And Depression\n\
Zadie Smith's Productivity Tips Will Make You A More Focused Person\n\
This Is How A Rumor That Drake Died Got Started\n\
The Most Surprising Stories You Can't Miss This Week\n\
How The Elks Club Made Its Way To The 21st Century\n\
Inside A White Nationalist Conference Energized By Trump's Rise\n\
These Widows Hope That A Factory Can Rebuild What The Drug War Shattered\n\
E-Cigs Are Blowing Up In People's Faces\n\
My Son The ISIS Executioner\n\
This Syrian Doctor Won’t Stop Working Even After His Friend Was Killed\n\
Satan's Credit Card: What The Mark Of The Beast Taught Me About The Future Of Money\n\
The Famous Ethics Professor And The Women Who Accused Him\n\
Deonte Hoard Was The 53rd Of 489 Homicide Victims In Chicago Last Year\n\
The Most Jaw-Dropping Stories You Can't Miss This Week\n\
How Blac Chyna Beat The Kardashians At Their Own Game\n\
The Past Hundred Years Of Gender-Segregated Public Restrooms\n\
How Rona Barrett Became The Gossip Industry's Forgotten Trailblazer\n\
Can The Olympics Bring Marriage Equality To Japan?\n\
Employers Abuse Foreign Workers. U.S. Says, By All Means, Hire More.\n\
This Is How ISIS Uses The Internet\n\
The Most Incisive Stories You Need To Read This Week\n\
Lights! Camera! Suction! How A Plastic Surgeon Became A Snapchat Sensation\n\
Jodie Foster's Very Unconventional Directing Career\n\
Inside Palantir, Silicon Valley's Most Secretive Company\n\
This Is What Life Is Like When Your Daughter Is Kidnapped By Boko Haram\n\
Tijuana Wants You To Forget Everything You Know About It\n\
Jasha McQueen Is The Embryo Crusader\n\
The Hunt For Poland's Buried Nazi Gold Trains\n\
How One Indigenous Reserve Is Coping With Canada's Suicide Crisis\n\
How Kerry Washington Became A Publicity Magician\n\
A Surge Of Startups Is Changing Life In Utah\n\
The Most Earth-Shattering Stories You Can't Miss This Week\n\
Anna Jarvis Was Sorry She Ever Invented Mother’s Day\n\
Loretta Lynch Has An Agenda — And The Clock Is Ticking\n\
Educating People About Their Rights, One Mural At At Time\n\
What Does Safety Feel Like When You're A Sex Worker\n\
The Most Illuminating Stories You Can't Miss This Week\n\
Congratulations, Your Son Has Been Killed: What Happens When You Lose Someone To ISIS\n\
Inside “Emojigeddon”: The Fight Over The Future Of The Unicode Consortium\n\
Why America Is Ready For Novelist Angela Flournoy\n\
Donald Trump Won Control Of A Prized D.C. Landmark — Here’s How\n\
How A Prison Radio Show Has Changed Women's Lives\n\
Alabama's Chief Justice Goes To Federal Court To Seek Civil Rights Protections\n\
World War II-Era Fighter Plane Crashes In Hudson River; Pilot Unaccounted For\n\
Glee Actor Mark Salling Indicted On Child Pornography Charges\n\
The “Cell Phones Cause Cancer” Myth That Just Won’t Die\n\
Senator Demands Immediate Action On No-Good College Accreditors\n\
37 Books Every Parent Needs To Read\n\
I Stayed At An Airbnb Bookshop And You Can Too\n\
If The Harry Potter Books Were Set In Australia\n\
The New Little Prince Trailer Is Going To Make You Very Emotional\n\
The Ultimate Harry Potter Word Guessing Game\n\
Me Before You's Thea Sharrock On The Lack Of Female Directors: It Can Only Get Better\n\
This Game Of Thrones Time Travel Theory Is So Crazy It Just Might Be Real\n\
I’m A Writer And A Father, Not One In Spite Of The Other\n\
18 Gorgeous Covers From The New Pocket Penguins Series\n\
34 Reasons To Drop Everything And Visit Westeros\n\
7 Out Of 100 Apocalypses\n\
This Theory Explains Why Harry Doesn't Have A Lot Of Gryffindor Friends\n\
Proof That Christopher Pike Wrote Some Pretty Fucked-Up Books For Teens\n\
29 Reasons Sansa Stark On Game Of Thrones Is A True Queen\n\
17 Predictions For The Next 5 Game Of Thrones Episodes, Based On The Last 5\n\
Matthew Lewis Has A Big Beard In His Latest Photo Shoot And We Cannot Deal\n\
People Think This Game Of Thrones Character Might Return Next Week\n\
People Are Annoyed About How Me Before You Represents Disability\n\
Only Hardcore Harry Potter Fans Can Pass This Quote Test\n\
This Girl's Day Was Made When She Found An Inspiring Note Hidden In A Bookstore\n\
If College Students Had Their Own Snapchat Filters\n\
24 Times The Me Before You Cast Was Just Too Adorable\n\
How Steve Rogers Became One Of Marvel's Biggest Villains\n\
What Would Your Game Of Thrones Name Be Based On Your Choice Of Emoji?\n\
13 Incredible Books You Can Actually Find At Value Village\n\
If You're Confused About Game Of Thrones Time Travel, Read This\n\
22 Amazing Aboriginal Place Names Beyond Improvement\n\
Can You Correctly Choose The Most Expensive Comic Book?\n\
More Than 450 Authors Have Signed A Petition Against Donald Trump\n\
eBay Founder Rallies Behind Gawker In Its Effort To Appeal Hulk Hogan Case\n\
Laws That Once Restrained Feudal Lords Would've Helped Gawker Today\n\
Senator Demands Immediate Action On No-Good College Accreditors\n\
Verizon And Unions Representing 39,000 Strikers Reach Agreement\n\
Inside The College That Abolished The F And Raked In The Cash\n\
Oslo Freedom Forum Founder Says Thiel Has Every Right To Fund Media Lawsuits\n\
J.Crew Says The Golden Days Are Back, But Customers Aren't Buying It\n\
Uniqlo Says It's Struggling In The U.S.\n\
Dunkin' Donuts Is Totally Obsessed With Sweet, Flavored Coffees\n\
Report: Peter Thiel Is Bankrolling Hulk Hogan's Lawsuit Against Gawker\n\
Olive Garden Launches Spaghetti Pie, Just In Time For Summer\n\
Satan's Credit Card: What The Mark Of The Beast Taught Me About The Future Of Money\n\
Fast Food Workers Will Vote On Joining Service Workers Union\n\
Palantir To Buy Up To $225 Million Of Stock From Employees\n\
Nutrition Labels Will Now Show Calories For The Whole Tub Of Ice Cream\n\
Farewell, Victoria's Secret Catalog\n\
Why The Truck Drivers' Union Is Opposing Pot Legalization In California\n\
Inside Verizon's Spring Break For Strike Breakers\n\
Shop Jeen's Website Has Been Down For Days\n\
Here's How Taco Bell Makes A Taco Shell Out Of Fried Chicken\n\
Here's What Anthropologie's Giant New Stores Look Like\n\
LinkedIn Says Hackers May Have Stolen More Than 100 Million Passwords\n\
McDonald's Doubles Down On Cheap, Says McPick 2 Deals Here To Stay\n\
Auto Title Loans: One In Five Borrowers End Up Losing Their Car\n\
Shady Chinese Clothing Sites Get A Boost From U.S. Customs\n\
High Schoolers Can Now Use Federal Grants To Pay For College Classes\n\
Expedia Users Can Now Pay For Hotels Via Monthly Installments\n\
Taco Bell Is Getting A Makeover, Exposed Brick And All\n\
Wendy's New Self-Service Kiosks Have People With A Lot Of Mixed Feelings\n\
This Woman Tried To Find Her Best Friend Through A Game Show\n\
18 Tumblr Posts Asian People Will Find Just Excellent\n\
Can You Pick The Celebrity Who's Under 30?\n\
The Most Interesting Photo Stories Of The Week\n\
17 Fascinating, Intimate Photos Of Prostitutes Throughout History\n\
23 Of The Most Powerful Photos Of This Week\n\
23 Things Peruvians Know To Be True\n\
Zenon Fans, Apparently We've Been Saying Zetus Lapetus Wrong This Entire Time\n\
37 Books Every Parent Needs To Read\n\
We Know Which Dancing Kid GIF You'll Love Based On Your Zodiac Sign\n\
Please Let Chris Evans' Steve Rogers Be All Up In The New Spider-Man Movie\n\
What Fifth Harmony Song Are You Based On Your Zodiac Sign?\n\
Mariah Carey Playfully Kicked Lee Daniels For Calling Her Fragile\n\
38 Photos Of Black Graduates Guaranteed To Give You Life\n\
Can You Guess Which Purse Belongs To Taylor Swift?\n\
Tell Us The Craziest Place You've Had Sex While Traveling\n\
It's Time To Admit That Anna Scott Was The Freaking Worst\n\
Which Jennifer Lawrence Film Are You Based On Your Zodiac Sign?\n\
Can You Ace This Beauty And The Beast Quiz?\n\
9 Cows Sitting Like Dogs\n\
Olly Alexander Had The Perfect Reaction To His Album Being Placed In A Store's Gay Section\n\
Can You Guess Which Female Pop Singer The Hair Belongs To?\n\
Can You Identify The X-Men Character By Their Comic Book Color Scheme?\n\
Which Pixar Movie Is The Story Of Your Life?\n\
We Met The Tower Of London's Ravenmaster And His Insanely Cool Ravens\n\
Do You Remember Which Toy Story Movie These Quotes Are From?\n\
17 Pokémon Invented By Yik Yak That Actually Need To Exist\n\
NFL Players Aren't Surprised The League Tried To Mess With Concussion Research\n\
Which Song From Meghan Trainor's Thank You Are You Based On Your Zodiac Sign?\n\
23 Double Chin Faces Guaranteed To Make You Laugh\n\
Trump Celebrates GOP Nomination With A Diet Coke, After Mocking Diet Coke\n\
9 Celebrity #TBT Photos You Need To See This Week\n\
Only Disney Princess Megafans Will Get 75% Or More On This Quiz\n\
What Was The Most Insane Thing That Happened On Degrassi?\n\
Can You Pick The Shoes That Belong To Scarlett Johansson?\n\
Atlanta Braves Outfielder Suspended 82 Games Following Assault Investigation\n\
Which Anna Kendrick Character Are You Based On Your Zodiac Sign?\n\
Which Emma Watson Character Are You Based On Your Zodiac Sign?\n\
We Know If You'll Find Your Soulmate This Year Based On The Heart You Choose\n\
The Ultimate Harry Potter Word Guessing Game\n\
Can We Guess Which Disney Channel Era You Belong To?\n\
Which Hogwarts Professor Would Definitely Hate You?\n\
Can You Guess The Disney Movie By These Emojis?\n\
Which Harry Potter Home Should You Live In?\n\
Which Ryan Reynolds Character Matches Your Favorite Color?\n\
Can You Pick The Celebrity Who's Under 30?\n\
Amber Heard Obtains Restraining Order Against Johnny Depp, Citing Physical Abuse\n\
Jessica Lange Definitely Isn't Planning On Returning To American Horror Story\n\
Mariah Carey Playfully Kicked Lee Daniels For Calling Her Fragile\n\
Can You Guess Which Purse Belongs To Taylor Swift?\n\
This Subtle Difference Between Daniel Radcliffe And Elijah Wood Is Pretty Unsettling\n\
Justin Bieber Is Being Sued For Allegedly Stealing Vocal Loops In Sorry\n\
39 Guys So Hot They'll Make You Instantly Pregnant\n\
23 Times Nigella Lawson Was A Goddess On MasterChef\n\
9 Celebrity #TBT Photos You Need To See This Week\n\
Can You Pick The Shoes That Belong To Scarlett Johansson?\n\
Judd Apatow’s “Well-Proportioned Dick” Will Make Its Acting Debut In “Popstar”\n\
Karlie Kloss Tried To Teach Jimmy Fallon How To Pose And It's Hilarious\n\
Khloé Kardashian Again Files For Divorce From Lamar Odom\n\
19 Things Taylor Swift Does That No One Else Could Ever Get Away With\n\
13 Photos Of Your Favorite Celebrities Supporting Red Nose Day\n\
Adele Forgot The Words To Her Own Song And Her Reaction Was Perfect\n\
Matthew Lewis Has A Big Beard In His Latest Photo Shoot And We Cannot Deal\n\
11 Revelations From That Kardashian Book That Aren't Actually Revelations At All\n\
Amber Heard Files For Divorce From Johnny Depp After 15 Months Of Marriage\n\
Real Housewives Of Beverly Hills Vs. Real Housewives Of Melbourne\n\
29 Reasons Sansa Stark On Game Of Thrones Is A True Queen\n\
I Bet You Can’t Guess Which Pharrell Williams Is Younger\n\
24 Times The Me Before You Cast Was Just Too Adorable\n\
This Is What Mmmbop Sound Like In The Game Of Thrones Language\n\
New Pictures Of Harry Styles' Short Hair Are Here To Kill You\n\
Can You Guess Which Of These Guys Is Named Chad?\n\
Everyone Is Blaming Barnaby Joyce For Johnny Depp And Amber Heard's Apparent Divorce\n\
Watch What Happens When This YouTuber Finds Out Beyoncé Played Her Video On The Formation Tour\n\
Can You Pick The Celebrity Who's Under 30?\n\
Please Let Chris Evans' Steve Rogers Be All Up In The New Spider-Man Movie\n\
It's Time To Admit That Anna Scott Was The Freaking Worst\n\
Jessica Lange Definitely Isn't Planning On Returning To American Horror Story\n\
21 Things People Who Are Slightly Obsessed With TV Will Understand\n\
Only Disney Princess Megafans Will Get 75% Or More On This Quiz\n\
This Game Of Thrones Time Travel Theory Is So Crazy It Just Might Be Real\n\
The Ultimate Harry Potter Word Guessing Game\n\
Which Movie Has The Most Uses Of The Word Fuck?\n\
Crush Is Back And Chiller Than Ever In Finding Dory\n\
The New Little Prince Trailer Is Going To Make You Very Emotional\n\
For Everyone Who Didn't Get The X-Men: Apocalypse Post-Credits Scene\n\
What To Expect From Sense8 Season 2\n\
17 Predictions For The Next 5 Game Of Thrones Episodes, Based On The Last 5\n\
This Guy Just Trolled A Game Of Thrones Actor And It's Entirely Too Soon\n\
People Think This Game Of Thrones Character Might Return Next Week\n\
29 Reasons Sansa Stark Is Actually The Best Game Of Thrones Character\n\
This Video Compares The New Beauty And The Beast With The Original Cartoon\n\
This Is What Mmmbop Sound Like In The Game Of Thrones Language\n\
This TV Show About Human Pups Is So Very WTF\n\
21 Movies From The '80s You Need To Show Your Kids\n\
Only Real Friends Fans Identify The Friend From These Close-Ups\n\
This Theory Explains Why Harry Doesn't Have A Lot Of Gryffindor Friends\n\
Everyone Is Freaking Out About This Jeopardy Champion\n\
People Are Selling Hodor Doorstops And It's Not OK\n\
56 Of The Most Beautiful Shots From The Original Star Wars Films\n\
23 Underrated Netflix Shows You Should Totally Be Watching\n\
Do You Know The Horror Movie By Its Tagline?\n\
How Steve Rogers Became One Of Marvel's Biggest Villains\n\
If You're Confused About Game Of Thrones Time Travel, Read This\n\
This May Explain Why Callie Torres' Departure On Grey's Anatomy Seemed Out Of The Blue\n\
Move Over Tom Hiddleston: Olivia Colman Is The Biggest Badass On “The Night Manager\n\
Which Harry Potter Film Got The Lowest Rotten Tomatoes Score?\n\
X-Men Characters On Screen Vs. In The Comics\n\
These New Movies Will Be Your Problematic Faves\n\
Bill Cosby To Face Trial For Sexual Assault Charges\n\
22 Times Alicia Florrick Went From The Good Wife To The Wife With No Fucks\n\
Jennifer Lawrence Gets A Booger On Live TV Just Like The Best Of Us\n\
The Bachelorette Season Trailer Is Here And Holy Shit\n\
The Captain America: Civil War Directors Reveal How It Was Assembled\n\
The Triumphant Rise And Mysterious Fall Of Person Of Interest\n\
What To Expect From Sense8 Season 2\n\
These New Movies Will Be Your Problematic Faves\n\
Jennifer Lawrence Gets A Booger On Live TV Just Like The Best Of Us\n\
Can You Guess Which Of These Guys Is Named Chad?\n\
Can You Pick The Shoes That Belong To Scarlett Johansson?\n\
New Pictures Of Harry Styles' Short Hair Are Here To Kill You\n\
Every Single Graduation Song From 1990-2016\n\
What The World Doesn't Understand About Britney Spears\n\
Justin Bieber Is Being Sued For Allegedly Stealing Vocal Loops In Sorry\n\
Ariana Grande's New Video Will Make You Wish You Were Completely In Love\n\
Please Let Chris Evans' Steve Rogers Be All Up In The New Spider-Man Movie\n\
17 Pokémon Invented By Yik Yak That Actually Need To Exist\n\
34 Reasons To Drop Everything And Visit Westeros\n\
17 Predictions For The Next 5 Game Of Thrones Episodes, Based On The Last 5\n\
Only Hardcore Harry Potter Fans Can Pass This Quote Test\n\
This Guy Just Trolled A Game Of Thrones Actor And It's Entirely Too Soon\n\
People Think This Game Of Thrones Character Might Return Next Week\n\
29 Reasons Sansa Stark Is Actually The Best Game Of Thrones Character\n\
This Is What Mmmbop Sound Like In The Game Of Thrones Language\n\
Do You Know The Horror Movie By Its Tagline?\n\
How Steve Rogers Became One Of Marvel's Biggest Villains\n\
If You're Confused About Game Of Thrones Time Travel, Read This\n\
An Artist Recreated “Star Wars: Episode IV” As An Epic Infographic\n\
This Instagrammer Creates The Most Gorgeous Lip Art You'll Ever See\n\
X-Men Characters On Screen Vs. In The Comics\n\
Which Harry Potter Film Got The Lowest Rotten Tomatoes Score?\n\
People On Twitter Are Asking Marvel To Give Captain America A Boyfriend\n\
Every Major Game Of Thrones Death So Far, Ranked By Sadness\n\
Gillian Anderson Tweeted A Poster Of Herself As The Next Bond And Now Everyone Wants It To Happen\n\
The People Behind Video Game Overwatch Did The Coolest Thing For A Young Fan\n\
19 Tumblr Posts That Sum Up How Hodor Fans Feel Right Now\n\
Here’s That Five Minute Trailer For “Independence Day: Resurgence” You Were Asking For\n\
You Need To See Conan Play Overwatch With Peter Dinklage And Lena Headey\n\
We Need To Talk About Brienne And Tormund On Game Of Thrones\n\
Here's How Hodor Reacted To This Week's Game Of Thrones\n\
This Couple Took The Most Magical Wizarding World Of Harry Potter Engagement Photos\n\
There Was An Extreme Penis Close-Up On GoT And People Freaked Out\n\
Can You Score At Least 75% On This Ulimate Disney Parks Trivia Quiz?\n\
Kylie And Kendall Jenner Have A YA Book Coming Out\n\
Can You Pick Which Bizarre Sex Toy Is The Most Expensive?\n\
Can You Pick The Biggest Asshole At The Gym?\n\
This 16-Year-Old Rock Climber Is Inspiring As Hell\n\
19 Things To Know If Your Kid Is Dealing With Depression\n\
Want To Sell An Anti-Aging Pill With No Human Testing? Make It A Supplement\n\
28 Important Ways To Teach Kids To Have a Healthy Body Image\n\
29 Pictures That Prove Pilates Isn't For Men\n\
22 Things You Know If You Pee Slightly More Often Than The Average Person\n\
This Is Why Black British Men Are Afraid Of Speaking About Their Mental Health\n\
Here's A Low-Carb Veggie Noodle Dish To Make For Dinner\n\
20 Things You Probably Didn't Know About Surrogacy\n\
Pebble's Back With Two New Smartwatches And One Weird Cube\n\
21 Tumblr Posts About Being A Nurse That Are Way Too Real\n\
22 Parents From Around The World Discuss Food And Their Kids\n\
How Working Out Taught Me To Embrace The Struggle\n\
27 Products That Will Make Running Infinitely Better\n\
In Defence Of Doing Things Alone\n\
7 Tasty Dinner Ideas\n\
12 Things You'll Only Understand If You Can't Get A Cleavage\n\
Can You Pick The Personal Trainer That Won't Make You Hate The Gym?\n\
16 Skills All Hardcore Criers Have Mastered\n\
7 Ways To Master Your Weekly Meal Prep\n\
How Well Can You Score On This Sex Knowledge Quiz?\n\
Can You Pick The Best Person To Be Stuck With When A Migraine Hits?\n\
I Tested The Sober Waters And Didn't Drown\n\
CDC Widens Warnings About Zika And Pregnancy\n\
11 Exercises That'll Make Book Lovers Excited To Work Out\n\
We Tried A Device To Get Rid Of Our Period Cramps And It Kind Of Worked\n\
26 People Share The Important Reasons They Stopped Dieting\n\
The Triumphant Rise And Mysterious Fall Of Person Of Interest\n\
19 Amazing Things About Growing Your Family Through Adoption\n\
Olly Alexander Had The Perfect Reaction To His Album Being Placed In A Store's Gay Section\n\
Sexual Health Charity Accuses Government Of Stalling Over Penile Cancer Vaccine\n\
YouTube Reinstates Gay Fetish Website’s Videos After Claims Of Anti-Gay Bias\n\
Sonam Kapoor, Ian McKellen, And Other Beautiful People Hung Out At This LGBT Film Fest\n\
11 States Sue Obama Administration Over Transgender Rules\n\
This Drag Queen Blew Up The Internet With Her Glammed Up Grocery Shopping\n\
Here's Why Malcolm Turnbull Was Asked About A 17-Year-Old Bisexual Schoolgirl\n\
Queensland Is Finally Going To Make The Age Of Consent Equal\n\
These New Movies Will Be Your Problematic Faves\n\
Clinton Fundraiser Slams Campaign For Ignoring Transgender Survey\n\
People On Twitter Are Asking Marvel To Give Captain America A Boyfriend\n\
People Are Angry With Time Magazine’s Use Of The Rainbow Flag For Trans Issues\n\
Victoria Has Apologised To People Convicted Of Historical Gay Sex Offences\n\
Sanders Responded To Transgender-Rights Survey — But Clinton Didn’t\n\
People Keep Sharing This Photo Of Two Men Kissing At A Neo-Nazi Protest\n\
Demi Lovato Took A Stand For Trans Rights At The Billboard Music Awards\n\
Do I Want To Be Her Or Do I Want To F*ck Her?\n\
Honolulu Set To Settle Suit From Lesbians Jailed After Kissing In Public\n\
Everyone Is Loving This Guy's Tweet About Secretly Taking His Boyfriend To Prom\n\
A Gay Choir Says They Were Humiliated By A Major League Baseball Team\n\
This Is What Workplace Discrimination Is Like For Transgender People\n\
An Artist Perfectly Illustrated 4 Types Of Homophobes You'll Find In India\n\
13 Words That Mean Something Totally Different To Trans People\n\
These Photos Of The LGBT Community In Bangladesh Are Hard-Hitting And Powerful\n\
People Can't Handle This Trans Teen's Response To This Viral Anti-Trans Photo\n\
This Gay Student Says Two Famous Gay Clubs Denied Her Entry Because She's A Woman\n\
Fake News Websites Are Pumping Out More Anti-Trans Hoaxes Than Ever\n\
Can You Pick The Most Expensive Item From Anthropologie?\n\
7 Delicious Dinners That Are Under 500 Calories Each\n\
Can You Pick The Most Expensive Manicure?\n\
29 Purrrfect Pins For Cat Lovers\n\
17 Things You'll Only Understand If You're Modern Mom\n\
Can You Pick Which Bizarre Sex Toy Is The Most Expensive?\n\
21 Things Every Expectant Mom Should Bring To The Hospital\n\
The Inception Donut Is Here And It Is Too Beautiful For Words\n\
25 Awesome Father's Day Gifts You'll Want To Keep For Yourself\n\
19 Amazing Things About Growing Your Family Through Adoption\n\
Here's How To Travel Overseas With Your Kids\n\
Can You Pick The Most Expensive Pair Of Jeans?\n\
41 Insane Memorial Day Weekend Sales To Shop Right Now\n\
Here's What People Want Most On Amazon This Week\n\
25 Mouthwatering Recipes To Grill For Memorial Day\n\
16 Reasons Being A Young Parent Is Actually The Best\n\
17 Recipes For The Perfect Summer Cookout\n\
Can You Pick The Biggest Asshole At The Gym?\n\
15 Super-Easy Snacks You Can Make With 5 Ingredients Or Less\n\
17 Milestones That Prove You're Becoming A Veteran Parent\n\
7 Meal Prep Tips That'll Make You Feel Like A Boss\n\
21 Parents Share Their Funniest Moments Raising Kids\n\
21 Mac And Cheese Recipes That Will Blow Your Kids' Minds\n\
This Woman Contoured Her Entire Face With Highlighter And It's Super Insane\n\
19 Parents Share Their Kids' Funniest Fails\n\
Can You Guess Which Handbag Is The Most Expensive?\n\
18 Beautiful African Prom Dresses That'll Give You Goals\n\
How To Make The Most Pho-King Delicious Soup Ever\n\
Making Great Pho Is Hard, But Making A Life From Scratch Is Harder\n\
17 Struggles Of Raising Your Second Kid\n\
Can You Guess Which Sneaker Is The Most Expensive?\n\
This Is What You Need To Know About Parenting Twins\n\
These Hot French Guys Will Give You Style Goals\n\
I’m A Writer And A Father, Not One In Spite Of The Other\n\
26 Essential Products Everyone Who Loves To Bake Should Own\n\
Can You Get Through Ikea Without Breaking Up?\n\
17 Adoption Stories That Will Warm Your Heart\n\
This 16-Year-Old Rock Climber Is Inspiring As Hell\n\
21 Sounds Every Parent Will Immediately Recognize\n\
Juan Gabriel Dropped A Creedence Clearwater Cover And It's Everything\n\
51 Fifth Harmony Lyrics For When You Need An Instagram Caption\n\
Olly Alexander Had The Perfect Reaction To His Album Being Placed In A Store's Gay Section\n\
We Know What New Song You'll Love Based On These Three Questions\n\
Mariah Carey Playfully Kicked Lee Daniels For Calling Her Fragile\n\
Can You Pick The Music Video With The Most YouTube Views?\n\
Justin Bieber Is Being Sued For Allegedly Stealing Vocal Loops In Sorry\n\
Do You Know Which Early '00s Song Came Out First?\n\
Two Desis Slammed The Curry-Scented Bitches Stereotype With A Hilarious Beyoncé Parody\n\
16 Bands With Undercover Famous People That Don't Suck\n\
Watch What Happens When This YouTuber Finds Out Beyoncé Played Her Video On The Formation Tour\n\
Blake Shelton Tried Sushi For The First Time And Wasn't A Fan\n\
Which Britney Spears Album Is The Highest Selling?\n\
How Well Do You Know The Lyrics To Can't Stop The Feeling By Justin Timberlake?\n\
Ariana Grande's New Video Will Make You Wish You Were Completely In Love\n\
How Well Do You Actually Know The Lyrics To Queen Songs?\n\
What The World Doesn't Understand About Britney Spears\n\
This Tap Group Did A Tribute To Prince And It Was Amazing\n\
A Hospice Patient Couldn’t Make It To A Florence + The Machine Gig So They Threw Her A Private Show\n\
Which The Veronicas Song Are You Based On Your Choice Of Twins?\n\
Demi Lovato Took A Stand For Trans Rights At The Billboard Music Awards\n\
BET Threw A Bit Of Shade After Madonna's Prince Tribute\n\
17 Times Camila Cabello Was Adorable AF On Instagram\n\
This Eurovision Star Wants To Be Known For His Photography Too\n\
Ariana Grande Fell Over On The Billboard Music Awards Red Carpet\n\
Kesha Performed At The Billboard Music Awards And Everyone Cried\n\
Britney Performed A Greatest Hits Medley At The BBMAs And It Was Baptizing\n\
21 Hilarious Tweets About Beyoncé\n\
Britney Spears Arrived At The BBMAs With Zero Flaws\n\
25 Parenting Products To Get You Through The Summer\n\
37 Books Every Parent Needs To Read\n\
17 Things You'll Only Understand If You're Modern Mom\n\
21 Things Every Expectant Mom Should Bring To The Hospital\n\
19 Amazing Things About Growing Your Family Through Adoption\n\
Here's How To Travel Overseas With Your Kids\n\
21 Mac And Cheese Recipes That Will Blow Your Kids' Minds\n\
16 Reasons Being A Young Parent Is Actually The Best\n\
No, You Don't Have To Pick Between Motherhood And Feminism; Feminists Raise Better Kids\n\
17 Milestones That Prove You're Becoming A Veteran Parent\n\
21 Parents Share Their Funniest Moments Raising Kids\n\
19 Parents Share Their Kids' Funniest Fails\n\
17 Struggles Of Raising Your Second Kid\n\
This Is What You Need To Know About Parenting Twins\n\
I’m A Writer And A Father, Not One In Spite Of The Other\n\
17 Adoption Stories That Will Warm Your Heart\n\
26 Insanely Creative Tattoos To Get With Your Mom\n\
21 Movies From The '80s You Need To Show Your Kids\n\
21 Sounds Every Parent Will Immediately Recognize\n\
17 Weird Things You Probably Saved If You're A Parent\n\
15 Thoughts On Raising Empowered Black Women\n\
21 Indispensable Tips And Tricks For Traveling With Kids\n\
11 Dad-Daughter Hair Tutorials That Are Too Cute To Freaking Handle\n\
7 Reasons I’m Not Sorry For Sharing Photos Of My Adorable Kid\n\
19 Things To Know If Your Kid Is Dealing With Depression\n\
20 Things You Probably Didn't Know About Surrogacy\n\
41 Photos To Take Of Your Kids From Birth To College\n\
18 Friends You Make When You Have Kids\n\
15 Things That Will Only Make Sense If You're A Second Generation Latina Mom\n\
Alabama's Chief Justice Goes To Federal Court To Seek Civil Rights Protections\n\
Trump's California Drought Plan: We're Going To Start Opening Up The Water\n\
Trump Criticized Obama For Not Intervening During 2009 Iran Protests\n\
Ed Rendell: Democrats Are Short About $10 Million For Convention\n\
Tech Company: We Will Put Up $10 Million For Bernie-Trump Debate\n\
Here's Audio Of Trump Supporting The Ouster Of Egypt's Hosni Mubarak\n\
RNC Chair: Nominating Clinton Is One Of The Biggest Blunders In Democrat's History\n\
Trump Withheld Alimony From Marla Maples When She Threatened His Presidential Ambitions\n\
Bernie Sanders Gets In Snippy Exchange With California Radio Hosts\n\
Inside A White Nationalist Conference Energized By Trump's Rise\n\
Colorado Gov. John Hickenlooper: Donald Trump Is Kind Of A Blowhard\n\
Drama! Trump Super PAC Strategist Suggests Roger Stone Is Jealous Of Him\n\
Colorado Senate Candidate: I Want To Go Beyond Trump's Muslim Ban\n\
The GOP Spent Years Building A Latino Outreach Project—Is Trump About To Destroy It?\n\
Bill Clinton Gets Into 30-Minute Debate With A 24-Year-Old Bernie Fan\n\
Trump Super PAC Chair Criticizes Trump For Going After Susana Martinez\n\
Toomey Has Missed More Than 80% Of Budget Committee Hearings Since 2013\n\
Is Donald Trump's Story Of A Mysterious Banker Saving Him From Collapse Made Up?\n\
Sen. Mike Lee: Trump Had The Best Court List From Any Candidate In History\n\
Juanita Broaddrick Extremely Surprised, But Not Unhappy To Be In New Trump Ad\n\
Sorry, Paul Ryan Still Has No Plans To Endorse Donald Trump\n\
Clinton Accusers Broaddrick, Wiley, Jones Give Joint Interview On Talk Radio\n\
Trump's Bad Prediction: High Gas Prices Like You've Never Seen If Obama's Re-Elected\n\
Donald Trump’s Dysfunctional Super PAC Family\n\
Sanders, Clinton Convention Compromise Sets Up Israel Fight\n\
In 2011 Interview, Donald Trump Blasted Obama For Not Toppling Qaddafi Sooner\n\
Supreme Court: Jurors Were Unconstitutionally Kept Off Murder-Trial Jury Based On Race\n\
Trump Biographer: Trump Threatened To Sue Me Before I Even Started My Book\n\
Bernie World Debates What’s Next\n\
Can You Solve The Toughest BuzzFeed Crossword Of The Week?\n\
Can You Figure Out The Theme To Today's BuzzFeed Crossword?\n\
Today's BuzzFeed Crossword, 5/25/16\n\
Today's BuzzFeed Crossword, 5/24/16\n\
Today's BuzzFeed Crossword, 5/23/16\n\
Today's BuzzFeed Crossword, 5/20/16\n\
Can You Figure Out The Theme Of Today's BuzzFeed Crossword?\n\
Today's BuzzFeed Crossword, 5/18/16\n\
Today's BuzzFeed Crossword, 5/17/16\n\
Today's BuzzFeed Crossword, 5/16/16\n\
Today's BuzzFeed Crossword, 5/13/16\n\
Can You Figure Out The Theme To Today's BuzzFeed Crossword?\n\
Today's BuzzFeed Crossword, 5/11/16\n\
Today's BuzzFeed Crossword, 5/10/16\n\
Today's BuzzFeed Crossword, 5/9/16\n\
Today's BuzzFeed Crossword, 5/6/16\n\
Can You Figure Out Which Politician Dropped Out Of Today's Crossword?\n\
Today's Crossword, 5/4/16\n\
Today's BuzzFeed Crossword, 5/3/16\n\
Today's BuzzFeed Crossword, 5/2/16\n\
Today's BuzzFeed Crossword, 4/29/16\n\
Today's BuzzFeed Crossword, 4/28/16\n\
Today's BuzzFeed Crossword, 4/27/16\n\
Today's BuzzFeed Crossword, 4/26/16\n\
Today's BuzzFeed Crossword, 4/25/16\n\
Can You Finish The Hardest BuzzFeed Crossword Of The Week?\n\
Can You Figure Out The Tricky Theme Of This BuzzFeed Crossword?\n\
Can You Solve This Disney-Themed BuzzFeed Crossword?\n\
Test Your Crossword Skills Out With This Easy BuzzFeed Puzzle\n\
7 Out Of 100 Apocalypses\n\
Making Great Pho Is Hard, But Making A Life From Scratch Is Harder\n\
How One Indigenous Reserve Is Coping With Canada's Suicide Crisis\n\
I’m A Writer And A Father, Not One In Spite Of The Other\n\
Being “One Of The Guys” Taught Me To Be A Better Girl\n\
I Tried To Eat My Past And My Past Ate Me\n\
Poem: Rated R By Denise Duhamel\n\
Confessions Of A Former Former Fat Kid\n\
Why Chance The Rapper's Black Christian Joy Matters\n\
The Year Cancer Didn't Kill Me\n\
How Rona Barrett Became The Gossip Industry's Forgotten Trailblazer\n\
How Blac Chyna Beat The Kardashians At Their Own Game\n\
The Past Hundred Years Of Gender-Segregated Public Restrooms\n\
Jodie Foster's Very Unconventional Directing Career\n\
Wrestling Taught Me How (Not) To Be A Man\n\
I Don’t Want My Body To Be Perfect Anymore, I Just Want It To Work\n\
9 Bodies I've Had\n\
My Best Friend Saved Me When I Attempted Suicide, But I Didn't Save Her\n\
Jian Ghomeshi's Statement, Annotated\n\
Why I Share My Favourite Porn With Other Women\n\
Tinder Wants My Mom's Approval And It's Pissing Me Off\n\
8 Black Women On Body Image And Societal Expectations\n\
What Girls And Broad City Teach Us About Female Friendship\n\
Getting Half A Boob Job Helped Me Love My Whole Self\n\
How Books Became The Language My Father And I Found Together\n\
Chris Evans' Version Of Masculinity Is What We Want Right Now\n\
Zac Efron Bros Down To Grow Up\n\
When My Mother Taught Me To Cook, She Taught Me How To Live\n\
My Son's Lifelong Silence Has Taught Me To Listen\n\
Zenon Fans, Apparently We've Been Saying Zetus Lapetus Wrong This Entire Time\n\
It's Time To Admit That Anna Scott Was The Freaking Worst\n\
A Reminder That Nikki Grahame Was The Best Big Brother Housemate Ever\n\
What Was The Most Ridiculous Rule Your School Had?\n\
23 Times Nigella Lawson Was A Goddess On MasterChef\n\
9 Celebrity #TBT Photos You Need To See This Week\n\
Only Disney Princess Megafans Will Get 75% Or More On This Quiz\n\
This “Powerpuff Girls” Trivia Test Will Determine Which Villain You Are\n\
Jessica Lange Definitely Isn't Planning On Returning To American Horror Story\n\
The Ultimate Harry Potter Word Guessing Game\n\
Crush Is Back And Chiller Than Ever In Finding Dory\n\
Hey Arnold! Is Basically Proof That Eating Ass Makes Everything Better\n\
Do You Know Which Early '00s Song Came Out First?\n\
This Video Compares The New Beauty And The Beast With The Original Cartoon\n\
21 Movies From The '80s You Need To Show Your Kids\n\
24 Facts About Aussie Food That Are Undeniably And Absolutely True\n\
19 Things Australians Secretly Admire About America\n\
Only Hardcore Harry Potter Fans Can Pass This Quote Test\n\
Which The Castle Character Are You?\n\
Which Disney Princess Movie Is Rated Higher On IMDb?\n\
This Theory Explains Why Harry Doesn't Have A Lot Of Gryffindor Friends\n\
If College Students Had Their Own Snapchat Filters\n\
56 Of The Most Beautiful Shots From The Original Star Wars Films\n\
Real Housewives Of Beverly Hills Vs. Real Housewives Of Melbourne\n\
18 Times You Were A Strong, Modern, Sexually Liberated Puppet Like Nanalan\n\
If Disney Princesses Were Dat Boi\n\
Which Depressing Bowl Of Sugary Cereal Should You Eat Tonight?\n\
Can You Pick The British Movie With The Lowest Rotten Tomatoes Rating?\n\
What Was The Most Insane Thing That Happened On Degrassi?\n\
The “Cell Phones Cause Cancer” Myth That Just Won’t Die\n\
E-Cigs Are Blowing Up In People's Faces\n\
What's Your Empathy Score?\n\
5 Things That Made No Sense In Trump's Big Energy Speech\n\
Want To Sell An Anti-Aging Pill With No Human Testing? Make It A Supplement\n\
Can We Guess What You Got In GCSE Maths?\n\
7 Things To Think About As You Try To Fall Asleep Tonight\n\
How Well Can You Tell Fake Movie Science From The Real Thing?\n\
Can You Pick The Right Chemical And Not Blow Up The Lab?\n\
Santa Cruz Biotech Loses License, Fined Record $3.5 Million\n\
CDC Widens Warnings About Zika And Pregnancy\n\
Check This Map To See If Your Water Has Unsafe Levels Of “Fluorinated” Chemicals\n\
Scientists Test Ancient Body-Warming Method as Depression Treatment\n\
Scientists Are Angry About How Long It’s Taken Lawmakers To Get Zika Money\n\
Which Animal Should You Save Today?\n\
This Farm On The Welsh Coast Costs Just £1 A Year To Rent – For The Right Person\n\
Fracking Is Making Earthquakes Bigger In Texas\n\
Scientists Are Testing Psychedelic Drugs To Treat Depression\n\
Are These Photos Real Or From A Sci-Fi Movie?\n\
U.S. Zika Tests Unacceptably Backlogged\n\
Only A Real Science Geek Will Be Able To Solve More Than 10 Of These Riddles\n\
Are You More Of A Biologist, Chemist, Or Physicist?\n\
A Cancer Survivor Underwent The First Penis Transplant In The United States\n\
Zika Triggers Lots Of Birth Defects Besides Microcephaly, New Mouse Models Find\n\
18 Things Scientists Have Done At Least Once\n\
Meet The Scientists Fighting For More Studies On Genes And Racial Differences In Health\n\
The Weekend Effect Is More Complicated Than Jeremy Hunt Thinks, According To Two New Studies\n\
NASA Just Announced 1,284 New Planets\n\
Rising Sea Levels Swallow Five Pacific Islands\n\
NFL Players Aren't Surprised The League Tried To Mess With Concussion Research\n\
Atlanta Braves Outfielder Suspended 82 Games Following Assault Investigation\n\
San Francisco 49ers Owner Calls For Repeal Of North Carolina Anti-LGBT Law\n\
BMX Legend Dave Mirra Had Brain Disease CTE\n\
The NFL Meddled With And Backed Out Of A Brain Trauma Study, Investigators Say\n\
This NBA Playoff Series Could Be Decided By A Kick In The Balls\n\
The Rangers Want $500 Million From Taxpayers For A Ballpark With A Retractable Roof\n\
Golfer Phil Mickelson Named In Federal Lawsuit Alleging Insider Trading\n\
U.S. Investigation Reportedly Begins Into Russian Athletics Doping Scandal\n\
Rougned Odor Suspended 8 Games By MLB After Punching Jose Bautista\n\
MLB Now Without Any Latino Managers After Firing Of Braves' Fredi González\n\
The Brazilian Men's Gymnastics Team Is So Hot It's Problematic\n\
Rockies Shortstop Jose Reyes Suspended Over Domestic Violence Allegations\n\
People Went Crazy Over This Stray Cat That Ran Through A Baseball Game\n\
Youth Football Bans Kickoffs For Kids Under 10 One Day Before Congressional Hearing\n\
Seahawks Wide Receiver Ricardo Lockette To Retire At Age 29 After Neck Injury\n\
Spain's First Openly Gay Soccer Referee Has Quit Over Abuse And Heckling\n\
Stephen Curry's Daughter Is Cooler Than You'll Ever Be\n\
Can You Remember These '90s MLB All-Stars?\n\
UAB Football Player Greg Bryant Brain Dead After Shooting\n\
MLB Moves Pirates-Marlins Series From Puerto Rico Over Zika Fears\n\
Indiana Basketball Coach To Plead Guilty To Sexting 15-Year-Old Student\n\
Johnny Manziel Turns Himself In To Police On Assault Charge\n\
Women's World Cup Champion Abby Wambach Will Join ESPN As Analyst\n\
The End Of Monday's Thunder-Spurs Game Was A Referee Shitshow, NBA Says\n\
Leicester City Claims Premier League Title For The First Time Ever\n\
LeBron James Is Officially Starring In Space Jam 2\n\
Miami Marlins' Dee Gordon Suspended For 80 Games By MLB For PEDs\n\
NCAA Votes To Not Allow Anti-LGBT States To Host Events\n\
Can You Pick The Most Expensive Item From Anthropologie?\n\
Can You Pick The Most Expensive Manicure?\n\
29 Purrrfect Pins For Cat Lovers\n\
Can You Pick The Most Expensive Pair Of Jeans?\n\
41 Insane Memorial Day Weekend Sales To Shop Right Now\n\
This Woman Contoured Her Entire Face With Highlighter And It's Super Insane\n\
Can You Guess Which Handbag Is The Most Expensive?\n\
18 Beautiful African Prom Dresses That'll Give You Goals\n\
Can You Guess Which Sneaker Is The Most Expensive?\n\
These Hot French Guys Will Give You Style Goals\n\
I Decided To Let My Brothers Dress Me For A Week\n\
27 Highly-Rated Shoes From Zappos You'll Wear All Summer\n\
Brooklyn Decker Was So Candid About Why She Doesn't Miss Modeling\n\
H&M Is Collaborating With Kenzo And It's Stylish AF\n\
How Should You Respond To That Catcaller?\n\
11 Dad-Daughter Hair Tutorials That Are Too Cute To Freaking Handle\n\
We Tried Ashley Graham's New Plus-Size Swimsuits And They're Fierce AF\n\
This Might Be The Most Ridiculous Swimsuit Trend Ever\n\
Is This Item $50 Or $500?\n\
Which Easy Style Trend Do You Need To Try?\n\
Here’s Exactly How To Decide Which Body Part To Tattoo Next\n\
7 Seriously Easy Ways To Have A Good Hair Week\n\
Can You Predict Which Pair Of Panties Will Be Ruined By Your Period?\n\
Can You Spot The Most Expensive Plain White Tee?\n\
This Woman's Art-Inspired Makeup Transformations Are So Stunning\n\
18 Korean Beauty Products You Need In Your Life\n\
27 Insane Sales To Shop This Weekend\n\
A Plus-Size Model Plays Joe Jonas's Love Interest In His New Video And It's Hot AF\n\
Here's What 100 Years Of Nail Trends Look Like In Two Minutes\n\
Chewbacca Mask Mom Dishes On Her Viral Success, And Choice Of Streaming Platform\n\
Apple Removed This Lesbian Couple From International Versions Of Its Ad\n\
After One Year And 200 Million Users, Here's What Google Photos Could Do Next\n\
Do You Know What Happened In Tech The Week Of May 23?\n\
Sean Parker Denies Being Mystery Friend In Peter Thiel's Secret War On Gawker\n\
Will Mark Zuckerberg Vote For Peter Thiel Now?\n\
Univision Is Not Bidding To Buy Gawker\n\
Oslo Freedom Forum Founder Says Thiel Has Every Right To Fund Media Lawsuits\n\
Customers Say Postmates Has Been Underestimating Delivery Costs\n\
Sarah Jessica Parker Reveals She Uses A Blackberry\n\
Report: Peter Thiel Is Bankrolling Hulk Hogan's Lawsuit Against Gawker\n\
Pebble's Back With Two New Smartwatches And One Weird Cube\n\
Post-Uber Austin Has A Chance To Rebuild Ride-Hail\n\
Twitter Effectively Makes Tweets Longer With Handful Of New Tweaks\n\
Facebook Makes Changes To Trending Section After Bias Accusations\n\
So Snapchat Replaced Its Selfie Filters With X-Men Ones\n\
Lyft Testing Ride Reservation Feature\n\
Finding The Meaning Of Artificial Intelligence At Google I/O\n\
A Bunch Of ISIS Fanboys Posted Photo Messages And Accidentally Revealed Their Locations\n\
Palantir To Buy Up To $225 Million Of Stock From Employees\n\
Google's Crazy Modular Smartphone Is Officially On Its Way\n\
Do You Know What Happened In Tech The Week Of May 16?\n\
The Future Of The Apple Store Is Trees\n\
Scott Disick Goofed Up His Sponsored Instagram Post\n\
Airbnb Is Getting Sued For Racial Discrimination\n\
Why Google’s Encryption Choices Matter\n\
Ride-Hail Has A Woman Problem\n\
Mark Zuckerberg: I Know Many Conservatives Don't Trust Our Platform Is Unbiased\n\
When It Comes To The Future, Google Doesn’t Need To Be First\n\
If Idiotic TripAdvisor Users Ran Scottish Tourism\n\
The Ultimate Guide To NYC Cheap Eats\n\
17 Vacation Horror Stories That Will Make You Never Want To Travel\n\
How Many National Parks Have You Visited?\n\
21 Indispensable Tips And Tricks For Traveling With Kids\n\
Hey Bostonians: These Tweets Will Make You Laugh\n\
Here's Everything You Need To Eat In Charleston\n\
Can You Find The 20 Biggest U.S. Cities On A Map?\n\
Can You Score At Least 75% On This Ulimate Disney Parks Trivia Quiz?\n\
18 Places That Will Make You Fall Back In Love With London\n\
This Year’s Chelsea Flower Show Features 300,000 Spectacular Crocheted Poppies\n\
This Eurovision Star Wants To Be Known For His Photography Too\n\
Can You Actually Locate The States?\n\
10 Ethical Travel Destinations Worth Exploring\n\
27 Amazing Campgrounds In America For When You Need Chill Vibes\n\
Can You Get Over 30 In This Checklist Of Indian Places?\n\
11 Charts That Perfectly Sum Up Patio Season\n\
We Know Where You Should Travel Next Based On The Suitcase You Pick\n\
14 Incredible, Challenging, And Life-Changing Scottish Bike Rides\n\
Can You Pick Which Of These Apartments Is The Most Expensive?\n\
What's Your Favorite Street Food In The World?\n\
How Many European Capitals Have You Visited?\n\
You Can Now Stay In Aaron Paul's House For $400 A Night\n\
Here's Your Culinary Bucket List Straight From A Travel Pro\n\
24 Pieces Of Crap You'll Find In Every Tacky Scottish Gift Shop\n\
The Most Interesting Photo Stories We Saw This Week\n\
17 Signs You're Totally In Love With Disneyland\n\
Can You Name The City From A Satellite Photo?\n\
18 London Drinks To Order When You're Not Drinking\n\
This Couple Took The Most Magical Wizarding World Of Harry Potter Engagement Photos\n\
17 Absolutely Stunning Engagement Photos That'll Take Your Breath Away\n\
These Canadian Cat Lovers Got Married At A Kitty Sanctuary\n\
18 Times Same-Sex Couples Ruined The Sanctity Of Marriage\n\
What Wedding Gift Do You Wish You'd Registered For?\n\
Can You Tell Which Diamond Ring Is Real?\n\
15 Things Men Can Do To Show The World They're Engaged\n\
I Found Out How To Pee In Different Wedding Dresses And It Wasn't Easy\n\
Which One Of These People Should Be Your Maid Of Honor?\n\
This Bride With Cancer Did An Incredibly Breathtaking Photo Shoot\n\
This Couple Tied The Knot After A 44-Year Courtship\n\
Your Jaw Will Drop When You See This Couple's Amazing Star Wars Wedding Photos\n\
This Bride Found A Beautiful Way To Incorporate Her Grandma's Wedding Gown Into Her Wedding\n\
The Ultimate Costco Fans Just Took Their Engagement Photos There\n\
This Maternity Photo Shoot Turned Surprise Proposal Will Melt Your Heart\n\
19 Beautiful Alternative Wedding Bands That'll Steal The Damn Show\n\
Here's What People Really Think About Height And Dating\n\
9 Things I Wish People Knew About Dating Someone In A Wheelchair\n\
Tell Us Your Best Piece Of Honeymoon Planning Advice\n\
This Is Why It's Hard To Accept Love When You Hate Your Body\n\
This Music Fest-Themed Wedding, Combining Indian And Chinese Culture, Was Right On Beat\n\
This Vegan Wedding Was Attended By A TON Of Doggies, Like All Weddings Should Be\n\
Kristen Bell And Mila Kunis Being Surprised By Their Husbands Will Make Your Heart Hurt\n\
People Are Loving This Woman's Mirror Finish Cakes\n\
Guys Talk About Their Wedding-Related Body Image Issues\n\
We Bet You Can't Tell Which Of These Engagement Rings Is The Most Expensive\n\
20 Awesome Ways To Get Your Self-Care On Before Your Wedding\n\
This Husband Has A Simple Way To Support His Wife After She Lost Her Pinky\n\
12 Sex Positions Everyone In A Long-Term Relationship Should Try\n\
Apple Removed This Lesbian Couple From International Versions Of Its Ad\n\
No, France Has Not Banned People From Sending Work Emails After Hours\n\
This Is Why Everyone In Brazil Is Talking About Rape Culture\n\
All These Men Wore The Same Outfit To The G7 Summit\n\
A Factory In China Is Making The Creepiest Donald Trump Masks\n\
President Obama Makes Historic Visit To Hiroshima\n\
This Original Manga Art Shows What It Was Like After U.S. Dropped Atomic Bomb On Hiroshima\n\
This Guy Broke A World Record For Most Hugs By Speed Hugging 79 Humans In Under A Minute\n\
Bolivian Police Blast Disabled Activists With Water Cannons\n\
This Video Shows That The Refugee Crisis Is Ongoing And Still Deadly\n\
These Widows Hope That A Factory Can Rebuild What The Drug War Shattered\n\
Britain To Offer Next-Of-Kin Letters To Same-Sex Couples Travelling Abroad\n\
This Is Why Black British Men Are Afraid Of Speaking About Their Mental Health\n\
Oslo Freedom Forum Founder Says Thiel Has Every Right To Fund Media Lawsuits\n\
Here's What People In Hiroshima Want To Tell Obama\n\
Chinese Media Mocked Taiwan's New President For Being A Single Woman But The Internet Wasn't Having It\n\
This Drag Queen Blew Up The Internet With Her Glammed Up Grocery Shopping\n\
Japan Leader Publicly Criticizes Obama Over Murder Linked To U.S. Military Contractor\n\
This Woman Just Rapped About Inequality In Vietnamese For Obama And It Was Pretty Damn Impressive\n\
Create Your Own Made-Up EU Scare Story\n\
These Syrians Have Returned Home After Fleeing For Years\n\
Nepalis Are Sharing #IAmWithIshan After Someone Threw Paint On The Prime Minister's House\n\
Here's Why Fidel Castro Wears So Many Adidas Tracksuits\n\
A Giant Hole Swallowed A Load Of Cars In Florence\n\
Ukrainian Pilot Convicted Of Murdering Two Russian Journalists Has Been Freed\n\
This Woman Waking Up To Lions At Her Tent Is The Biggest Load Of Nope You'll See Today\n\
Pakistani Trans Activist Who Died After Being Shot Was Humiliated In The Hospital\n\
Bataclan Survivor Criticizes Jesse Hughes For Saying Attack Was Muslim Conspiracy\n\
We Found It — The Most Racist Ad Of 2016\n\
Do You Actually Love Mexican Food?\n\
Growing Up With Chill Parents Vs. Growing Up With Strict Parents\n\
Share Our Dog A Day Newsletter With The Dog Lovers In Your Life!\n\
This High School Realized It Named The Wrong Valedictorian 11 Days After Graduation\n\
20 Ways You Can Celebrate Your Heterosexual Pride\n\
People Are Playing Roomba Pong And It Looks Like An Actual Blast\n\
Immigrants Explain What Voting Is Like In America\n\
19 Products Made For The Ron Swansons Of The World\n\
#HeterosexualPrideDay Is Trending On Twitter And People Have A Lot Of Feelings\n\
17 Crazy Things That Actually Happened To People During Jury Duty\n\
People Are Going To Work Naked Because Their Country's Leader Told Them To\n\
What's The Weirdest Fast Food Item In America?\n\
We Tried Kylie's Beauty Routine And We Didn't Recognize Ourselves\n\
Best Friends Got Married For A Week And Things Got Real\n\
Picky Eaters Ate Adventurously For A Week And It Was Super Hard For Them\n\
This Misshapen Mr. Potato Head Encouraging Kids To Love Ugly Food Is Spudorable\n\
12 Ángeles Azules Songs That Will Make You Go, My Childhood!\n\
23 Things That Will Take Latinos Who Grew Up In L.A. Back To Their Childhoods\n\
17 Pictures Documenting The Olympic Torch's Weird As Hell Trip Through Brazil\n\
Here's The World's Most Awkward Three-Way Handshake\n\
Miss Teen USA Is Replacing The Swimsuit Competition With Athleisure\n\
Here's What Men Think About Wearing No Makeup-Makeup\n\
19 Insanely Pretty Products That Will Make All Makeup Addicts Orgasm\n\
A Ranking Of The Hottest U.S. Presidents\n\
Queen Rihanna Ordered Pizza For Her Fans Who Were Waiting In The Rain For Her Show\n\
The New Trolls Trailer Will Make Your Heart Explode With Joy\n\
The Incantations Of Daniel Johnston\n\
23 Of The Most Powerful Things Ever Said About Being An Immigrant\n\
19 Extremely Upsetting Wine Fails\n\
25 Photos That Show What Obama's Presidency Means To Young Black Americans\n\
Can We Fix Your iPhone With Just One Question?\n\
9 Common iPhone Problems And How To Fix Them\n\
23 Ways To Throw An Almost-Grownup Dinner Party\n\
17 Reasons To Make Your Own Ice Cream This Summer\n\
The Actor Who Plays Melisandre On “Game Of Thrones” Made A Dark But Funny Joke About Shireen\n\
This Amazing Choreographed Proposal At Pride Will Make Your Heart Grow Three Sizes\n\
30 Beautiful Tattoos Inspired By The Little Prince\n\
Find Your Next Healthy Recipe With The BuzzFeed Food Newsletter!\n\
23 Ingenious Products You Need Before Your Next Road Trip\n\
19 Photos That Will Remind You That You're Great At Your Job\n\
Today's BuzzFeed Crossword, 6/29\n\
21 Goats That Are Just Really Relatable\n\
Calvin Harris Seems To Be Shading The Hell Out Of Taylor Swift On Social Media\n\
At Least 41 Killed Including 13 Foreign Nationals In Attack On Istanbul Airport\n\
This Viral Photo Is Not From The Istanbul Airport Bombings\n\
Turkey Has Become The Hub Of All The Middle East’s Wars\n\
World Leaders React To Terror Attack On Istanbul Airport\n\
Investigators: EgyptAir Wreckage Shows Smoke, Heat Damage To Plane\n\
Defamation Lawsuit Against Rolling Stone For UVA Gang Rape Story Is Dismissed\n\
He Thinks He’s Untouchable”: Sexual Harassment Case Exposes Renowned Ebola Scientist\n\
Is Edward Snowden Trying To Get Vladimir Putin's Attention?\n\
After Abortion Controversy, AmeriCorps’ Health Program Is Shutting Down\n\
New Report Details Barriers To Prosecuting Police Officers For Wrongdoing\n\
A Beating At Bellevue, Then Months Of Silence\n\
Law & Order Director Gets Probation On Child Pornography Charges\n\
Marine Corps To Remove The Word “Man” From 19 Job Titles\n\
Jeremy Corbyn Insists He's Carrying On As Labour Leader And Won't Quit\n\
We Spoke To Victims Of Racist Abuse After The Brexit Vote\n\
Labour Party Deputy Says A Leadership Challenge To Jeremy Corbyn Is Inevitable\n\
This Guy Tried To Sum Up The Shitshow That Is British Politics Right Now And It's Confusing As Hell\n\
How The Internet Reacted To Possibly The Most Ridiculous Day In British Politics So Far\n\
Literally Just 9 Nice Things That People Have Done Since Brexit\n\
This Is What Facepalm MEP Was Thinking When Nigel Farage Started Speaking\n\
These Young Scientists Planned To Work In The U.K. — Now They Might Have To Leave\n\
Live Updates: EU Leaders Push UK For Clear Exit Path\n\
Trump In 2014: Hillary Clinton Is Very Smart, Will Be Tough To Beat In 2016\n\
Ivanka Trump: Athletes And Coaches Will Be Speaking At The RNC\n\
These Words Have Been Tested By Science To Get You To Vote\n\
People Are Wondering Why Donald Trump Gave A Speech In Front Of Garbage\n\
Rubio On Trump: I Don't Intend To Spurn Him Or Denigrate Him\n\
Elizabeth Warren Finally Opens Her Arms To Hillary Clinton\n\
Facebook To Decrease Publisher Reach To Show You More From Friends And Family\n\
Transgender Woman Wins Utah Democratic Senate Primary\n\
People Are Dying Laughing Over This Teen's Fail With Her Little Sister\n\
33 Kinda Terrifying Animal Facts You Probably Never Knew\n\
People Are Making Sushi Food Hybrids And It Is Bonkers\n\
26 Things Every Pregnant Woman Has Secretly Done\n\
This Game Of Thrones Fan Theory Might Reveal Jon Snow's Birth Name\n\
Holy Shit J.K. Rowling Just Released So Much Info On The American Wizarding School\n\
17 Bikinis For Big Boobs That Are Actually Really Pretty\n\
23 Pictures That Are Too Real If You've Ever Had Sex With A Penis\n\
Wow, Taylor Swift And Tom Hiddleston Are Moving Fast\n\
Can You Get 9/9 On This 1960s Louisiana Literacy Test?\n\
Here's One Thing You Probably Didn't Spot In The Game Of Thrones Finale\n\
22 Tweets About Families That Are Hilariously Real\n\
31 Jokes That Will Make Women Laugh Way Harder Than They Should\n\
81 Thoughts I Had During The Game Of Thrones Finale, Including CONFIRMED\n\
Justin Timberlake Gave His Thoughts On Jesse Williams' Speech About Race And Black People Went In\n\
Game Of Thrones Just Revealed Something Huge And People Aren't OK\n\
We Need To Talk About That Insane Game Of Thrones Twist\n\
People Are Freaking Out Over #TrumpGirlsBreakTheInternet\n\
Four Brexit Promises That Have Already Gone Up In Smoke\n\
A Police Officer Proposed To His Boyfriend At Pride And Melted Everyone's Hearts\n\
Police Killed A Texas Mom After She Shot Her Daughters Dead In The Street\n\
42 Ways To Make Your Entire Home Cleaner Than It's Ever Been\n\
People Are Freaking Out That Brexit Happened On The Same Day That Voldemort Returned\n\
Everything You Need To Know About This Game Of Thrones Fan Theory\n\
She Doesn't Have The Range Is The Most Delightfully Shady Thing On The Internet\n\
Kanye West Released A Video Of A Celeb Orgy And People Have A Lot To Say About It\n\
Literally Just A Bunch Of Game Of Thrones Season 6 Memes\n\
A Clothing Store Fired An Employee After She Had A Severe Allergic Reaction\n\
People Are Dragging Donald Trump After His Brexit Tweet About Scotland\n\
27 Brexit Tweets Guaranteed To Make You Laugh, Cry, Or Probably Both\n\
11 Things That Happen When You Suck At Adulting\n\
Stoned People Play With Cats On Catnip\n\
Can You Pass The Secret Service Logic Exam?\n\
These Ladies Airbrushed Their Makeup And Things Got Really Messy\n\
People Had Their Nightmares Interpreted And Shit Got SO Real\n\
The Horrifying Murders Of The Zodiac Killer\n\
5 Things That Are Harder Than Registering To Vote, Featuring President Obama\n\
Here's A Lasagna You Can Make From Veggies And It's Down Right Incredible\n\
These Guys Wore Skirts For A Week And Slayed For The Gawds\n\
This Tutorial Makes Applying Fake Lashes Incredibly Easy\n\
Immigrants Explain What Voting Is Like In America\n\
This Is How You Can Block Calliou From Showing Up On Netflix\n\
People Try Burger King's Mac N' Cheetos\n\
This Balloon Test Will Help You Make A Difficult Decision\n\
There's A Petition For Star Wars To Include An LGBT Character In Memory Of An Orlando Victim\n\
What It Feels Like To Tell Someone You're Trans\n\
Here's How Those Snapchat Filters You Love Work\n\
The Gender Binary Explained Through Toys\n\
These Popular DIY Hacks Can Really Eff With Your Skin\n\
Here's A Lasagna You Can Make From Veggies And It's Down Right Incredible\n\
This Is What Happens When You're Total Garbage At Dating\n\
Here's Everything You Say After Game Of Thrones Ends For The Season\n\
Celebs Play The Black Don't Crack Quiz At The BET Awards\n\
Being In Love With Your Best Friend\n\
8 Totally Ballin' Outfits You Can Make With One Lehenga Skirt\n\
Jesse Williams Gave An Incredibly Powerful Speech About Race At The BET Awards\n\
These Guys Wore Skirts For A Week And Slayed For The Gawds\n\
This Kid's Stare-Down Will Make You Question All Your Life Decisions\n\
Your 1st Time At A Gay Bar Vs Your 101st Time At A Gay Bar\n\
What It's Like Having A Trans Friend\n\
This Is What Happens When You Clean A Beautyblender 6 Ways\n\
What Happens To Your Body In Space\n\
Can You Pass The Secret Service Logic Exam?\n\
These Ladies Airbrushed Their Makeup And Things Got Really Messy\n\
Kids Created Tinder Profiles For Their Moms And They Were Super Protective\n\
Thoughts You Have While Putting On Makeup\n\
People Had Their Nightmares Interpreted And Shit Got SO Real\n\
You Have To See This Woman Transform Into Nickelodeon's Iconic 90's Cartoon Characters\n\
9 People You Should Unfollow On Twitter\n\
Here's How To Actually Save Money In A Relationship\n\
Watch These Kids Try Candy For The First Time In Their Lives\n\
The Cast Of 'The Neon Demon' Play 'Would You Rather?'\n\
This Restaurant Test Will Tell You Everything About Your Love Life\n\
The Anxiety Of Getting Your Prescription Refilled\n\
We Asked People In London What's More Terrifying: A President Trump Or #Brexit\n\
We Recreated The Moon Landing To See If It Could've Been Faked\n\
Can You Identify The Telenovela From A Single Image?\n\
Do You Actually Love Mexican Food?\n\
What Do You Actually Need From A Man?\n\
The First Name You See Is The Orange Is The New Black Character You'll Marry\n\
The Hardest Scott Pilgrim vs. The World Quiz You'll Ever Take\n\
This Game Of MASH Will Determine What Your Celebrity Life Would Be Like\n\
Which Hogwarts House Do You Belong In Based On Your Food Preferences?\n\
Which Song From Hamilton Are You Based On Your Zodiac Sign?\n\
Only A Real Texan Will Get 10/10 On This Quiz\n\
Can You Guess The Justin Bieber Album From A Single Lyric?\n\
Which Dragon Tales Character Are You Based On Your Birth Month?\n\
The First Name You See Is The Harry Potter Witch Or Wizard You'll Marry\n\
Which Eeveelution Matches Your Zodiac Sign?\n\
How Many Of These Iconically Fuckall Bollywood Movies Have You Seen?\n\
Which Alessia Cara Song Are You Based On Your Zodiac Sign?\n\
The First Word You See Is The Superpower You Deserve\n\
We Know Your Favorite Harry Potter Character Based On Your Favorite Harry Potter Character\n\
We Know Your Favorite Disney Princess Based On Your Favorite Harry Potter Character\n\
Can We Fix Your iPhone With Just One Question?\n\
Today's BuzzFeed Crossword, 6/29\n\
What The Fuck Are These Cartoon Animals Supposed To Be?\n\
This Quiz Will Determine How Dirty Your Mind Is\n\
We Know If You Like Black Licorice With Just One Question\n\
What Animal Would Be On Your Family Crest?\n\
Can You Get More Than 15 Out Of 20 On This Canadian Trivia Quiz?\n\
Who Said It: Donald Trump Or Bobby Newport?\n\
Which Of Tennis's Big Four Are You?\n\
We Know Your Favorite Disney Princess Based On Your Favorite Cheese\n\
We Know How Salty You Are Based On Your Favorite Chips\n\
How Well Do You Remember Roald Dahl's Gobblefunk Language From The BFG?\n\
What Percent Shit-Disturber Are You?\n\
This Is The Hardest Season 6 Game Of Thrones Quiz You'll Ever Take\n\
Do You Know What State This License Plate Is From?\n\
Which Season Of Supernatural Are You Based On Your Zodiac Sign?\n\
Are You More Arya Stark Or Sansa Stark?\n\
This Game Of MASH Will Determine What Your Gilmore Girls Life Would Be Like\n\
Which Game Of Thrones Character Are You In The Streets…And In The Sheets?\n\
Which Game Of Thrones Season 6 Death Scarred You The Most?\n\
Which Disney Channel Original Movie Character Are You Based On The First Letter Of Your Name?\n\
We Know Your Exact Age Based On What Alcohol You Drink\n\
We Bet You Can't Pick The Panera Item With The Most Calories\n\
Can You Pick The Cereal With The Most Sugar?\n\
Can You Spot The M&M Among The Skittles?\n\
Can You Guess Which Celeb Is A Natural Redhead?\n\
Can You Tell Which Bride Is Wearing The Most Expensive Wedding Dress?\n\
This Might Be The Hardest Female Sexual Anatomy Quiz Ever\n\
Can You Pick The Celebrity With The Most Money?\n\
Which Of These Fruits Has The Most Sugar?\n\
Can You Pick The Engagement Ring That's From Target?\n\
Do You Actually Love Mexican Food?\n\
23 Ways To Throw An Almost-Grownup Dinner Party\n\
You Guys, We've Found The Drink Of The Summer\n\
19 Extremely Upsetting Wine Fails\n\
17 Reasons To Make Your Own Ice Cream This Summer\n\
Here's A Refreshing Summer Salad That Will Leave You Feeling So Good\n\
19 Ways To Get Drunk Without A Glass\n\
We Bet You Can't Tell Which Of These Dishes Are Vegetarian And Which Aren't\n\
Here's A Lasagna You Can Make From Veggies And It's Down Right Incredible\n\
Can You Pick The Fast-Food French Fries With The Most Calories?\n\
15 Red, White, And Blue Treats That Are Perfect For Your July 4th BBQ\n\
People Are Making Sushi Food Hybrids And It Is Bonkers\n\
These Mutant Lemons Will Bring You Strange Joy And Extreme Discomfort\n\
Diet Pepsi Is Having A Serious Identity Crisis\n\
This Healthy Shrimp And Asparagus Stir-Fry Is Under 300 Calories\n\
7 Smart Tricks That'll Make Breakfast So Much Better\n\
18 Charts For Better, Healthier Snacking\n\
17 Genius Ideas For Tasty Quesadillas\n\
16 Pictures That Will Make You Drop Everything And Order A Burrito\n\
10 Insanely Delicious Vegan Recipes You Can Bring To A Cookout\n\
Which Food Network Competition Show Should You Compete In Based On Your Zodiac?\n\
17 No-Bake Treats That You Need In Your Life\n\
14 Ridiculously Yummy Foods You Must Eat In Madison, Wisconsin\n\
Can You Guess Which Bag Of Chips Has The Most Calories?\n\
This Creamy Pesto Pasta Bake Is Everything You Need For A Lazy Sunday\n\
7 Healthy Eating Tricks You're Going To Want To Try\n\
How Many Types Of Cheese Have You Eaten?\n\
This One-Pot Lemon Garlic Shrimp Pasta Will Make Your Dinner Dreams Come True\n\
Can You Guess Which Chocolate Bar Has The Most Sugar?\n\
9 Common iPhone Problems And How To Fix Them\n\
23 Ingenious Products You Need Before Your Next Road Trip\n\
Can We Fix Your iPhone With Just One Question?\n\
21 Space Tattoos To Totally Geek Out Over\n\
24 Unexpected Ways To Make Your Home Look A Little More Alive\n\
Here’s What People Are Buying On Amazon Right Now\n\
19 Gorgeous Ways To Display Your Favorite Travel Photos\n\
17 Refreshing Products For When You Don’t Have Time To Shower\n\
7 Quick Organizing Tricks You'll Actually Want To Try\n\
21 Things Every Mermaid Needs For Their Home\n\
Can You Get Through This Post Without Spending $50\n\
5 Insanely Clever DIYs That Are Actually Easy\n\
42 Ways To Make Your Entire Home Cleaner Than It's Ever Been\n\
22 Awesome Products From Amazon To Put On Your Wishlist\n\
11 New Features That'll Change The Way You Use Your Mac\n\
13 Clever Tiny Apartments That Are So Freaking Inspiring\n\
Here's What People Are Buying On Amazon Right Now\n\
I Tried Using A Smart Lock And It Was Magical\n\
18 Ingenious Products That'll Help You Clean Better Than Ever Before\n\
27 Perfect Products For Anyone Who's Actually A Mermaid\n\
7 Easy Ways To Actually Be More Organized This Week\n\
26 Insanely Useful Products All Gardeners Should Own\n\
21 Unexpected Ways To Get Drunk This Summer\n\
Can You Get Through This Post Without Spending $50\n\
23 Ridiculously Cute Products For Anyone Who Loves Totoro\n\
5 Insanely Easy 5-Minute DIYs You'll Actually Want To Try\n\
21 Awesome Products From Amazon To Put On Your Wish List\n\
What Art Print Fits You Most?\n\
We Tried The New iMessage App And It's Going To Change Your Nudes Forever\n\
What The Fuck Are These Cartoon Animals Supposed To Be?\n\
21 Goats That Are Just Really Relatable\n\
This Kitten Escaping Its Cage To See Its Puppy Friend Will Warm Your Heart\n\
9 Photos Of Tarantulas That Will Make You Say “Me… Maybe?\n\
What Animal Would Be On Your Family Crest?\n\
33 Kinda Terrifying Animal Facts You Probably Never Knew\n\
This Pet Fish Was Being Bullied In His Tank So A Vet Made Him A Fake Eye\n\
This Adorable Cat Is Being Fired From The Texas Library Where He's Worked For 6 Years\n\
Is This More Of A Dog's Name Or A Dude's Name?\n\
Do You Even Know What A Cat Is?\n\
What Kind Of Shark Are You?\n\
Do You Know What An Aardvark Looks Like?\n\
These Six-Month-Old Abandoned Kittens Had Surgery To Give Them Eyelids\n\
That Story About A Tiger And A Goat Being Best Friends Might Be Fake Because Joy Isn't Real\n\
18 Delightful Dogs On Planes\n\
There's A Shiba Inu Who Loves Swings So The World Can't Be That Bad\n\
This Shiba From Japan Is The Cutest And The Internet Can't Get Enough Of Her\n\
16 Reasons Poodles Are The Best Dogs\n\
Behold, The World's Officially Ugliest Dog\n\
Pick A Shark And We'll Tell You Why You Did\n\
22 Photos Of Pets With Snapchat Filters That Are Just Perfect\n\
We Bet You Can't Identify Dogs By Their Butts\n\
Just 42 Dog Vines, Because They're The Only Thing That Can Give You Joy\n\
21 Pure And Perfect Things To Cheer Up Remain Voters\n\
There's Now A Teaser Trailer For Red Dog: True Blue And It Looks Beautiful\n\
21 Extremely Good Dog Tweets\n\
A Bear Who Walks Upright Took A Neighborhood Stroll Because Why Not\n\
Try Not To Die While Watching This Cat Touch A Cherry\n\
These Two Puppies Were Rescued From A Dog Meat Festival, And We Are So Grateful\n\
Another Round, Episode 60: Down With Sporks\n\
Another Round, Episode 61: The Greatest\n\
Melissa Harris-Perry On Her Split With MSNBC: I Am Not A Civil Rights Case\n\
Another Round, Ep. 58: The Job Of Pettiness\n\
I Was A Thirsty Male Feminist For A Day And It Was Exhausting\n\
16 Books We Fell In Love With As Young Black Girls\n\
What Happens When You Try To Follow The Rules™ In Real Life?\n\
Someone Appears To Have Stolen This Woman's Photos And Is Using Them To Troll People\n\
Another Round, Episode 41: To Be Young, Gifted, And Black\n\
14 Things You Never Knew About Hamilton's Lin-Manuel Miranda\n\
This Is What Lin-Manuel Miranda Said To Kanye When He Saw Hamilton\n\
Another Round, Episode 44: Mommy's Side Piece\n\
Another Round, Episode 43: A Gumbo Of Afrofuturism\n\
Here's How W. Kamau Bell Talks About Race With His Kids\n\
F@*K, Marry, Kill: Woke Men, Republican Candidates, And White Baes\n\
Another Round, Episode 59: May She Forever Reign\n\
Listen To BuzzFeed's New Podcast The Tell Show!\n\
7 Reasons To Listen To BuzzFeed's New Podcast The Tell Show\n\
Another Round, Episode 40: Blacker History Month\n\
The Mystery Of Michael Jackson And Sonic The Hedgehog\n\
Another Round, Episode 39: The Betrayer Of The Patriarchy\n\
Another Round Episode 27: No New Friends, My Squirrel Dude\n\
Listen To BuzzFeed's Interview With Obama's Senior Advisor\n\
How A Gay Porn Star And Rapper Became Vine Famous And Then Liveblogged His Arrest On Facebook\n\
Another Round, Episode 36: U Mad?\n\
Everyone Is Convinced The Brother And Sister From This Folgers Ad Are Hooking Up\n\
Bored Over The Holidays? Let ‘Another Round’ Keep You Company\n\
How To Celebrate Kwanzaa, According To Another Round\n\
How Well Do You Know These Random, 16th Century Flemish Proverbs?\n\
The Most Shocking Stories You Can't Miss This Week\n\
Uber Data And Leaked Docs Provide A Look At How Much Uber Drivers Make\n\
How “Star Trek” Created, Lost, And Won Back Pop Culture’s Most Devoted Fandom\n\
Tories’ Biggest Donor Lycamobile Raided In Criminal Money-Laundering Probe\n\
The Gay Bathhouse Fire Of 1977\n\
Meet The Matriarch Of The Arm-Everyone Movement\n\
The Bold Survive: The Story Behind Ferris Bueller's Weekend Out\n\
Meet The Maserati-Driving Deadhead Lawyer Who Stands Between Hackers And Prison\n\
The Donald And The Dictator\n\
This Village In Zimbabwe Holds A Key To Ending AIDS\n\
Here's The Powerful Letter The Stanford Victim Read To Her Attacker\n\
The Most Important Stories You Can't Miss This Week\n\
The True Story Of The Fake Zombies, The Strangest Con In Rock History\n\
The Most Astonishing Stories You Can't Miss This Week\n\
How Drybar Plans To Blow Away The Competition\n\
This Is What It's Like To Be Trapped On Europe's Doorstep\n\
E-Cigs Are Blowing Up In People's Faces\n\
My Son The ISIS Executioner\n\
The Biggest Stories You Can't Miss This Week\n\
First Rule Of Elks Club Is: Tell All Your Friends About Elks Club\n\
Inside A White Nationalist Conference Energized By Trump's Rise\n\
These Widows Hope That A Factory Can Rebuild What The Drug War Shattered\n\
Inside The College That Abolished The F And Raked In The Cash\n\
The Most Surprising Stories You Can't Miss This Week\n\
This Syrian Doctor Won’t Stop Working Even After His Friend Was Killed\n\
Satan's Credit Card: What The Mark Of The Beast Taught Me About The Future Of Money\n\
The Famous Ethics Professor And The Women Who Accused Him\n\
Deonte Hoard Was The 53rd Of 489 Homicide Victims In Chicago Last Year\n\
The Most Jaw-Dropping Stories You Can't Miss This Week\n\
How Blac Chyna Beat The Kardashians At Their Own Game\n\
The Past Hundred Years Of Gender-Segregated Public Restrooms\n\
How Rona Barrett Became The Gossip Industry's Forgotten Trailblazer\n\
Can The Olympics Bring Marriage Equality To Japan?\n\
Employers Abuse Foreign Workers. U.S. Says, By All Means, Hire More.\n\
This Is How ISIS Uses The Internet\n\
The Most Incisive Stories You Need To Read This Week\n\
Lights! Camera! Suction! How A Plastic Surgeon Became A Snapchat Sensation\n\
Jodie Foster's Very Unconventional Directing Career\n\
Inside Palantir, Silicon Valley's Most Secretive Company\n\
Defamation Lawsuit Against Rolling Stone For UVA Gang Rape Story Is Dismissed\n\
He Thinks He’s Untouchable”: Sexual Harassment Case Exposes Renowned Ebola Scientist\n\
Is Edward Snowden Trying To Get Vladimir Putin's Attention?\n\
After Abortion Controversy, AmeriCorps’ Health Program Is Shutting Down\n\
A Beating At Bellevue, Then Months Of Silence\n\
57 Photos That Prove “Game Of Thrones Is The Most Visually Stunning Show On TV\n\
31 Books You Need To Bring To The Beach This Summer\n\
Daniel Radcliffe Has Said He Would Consider Reprising His Role As Harry Potter\n\
The Incantations Of Daniel Johnston\n\
17 Useful Gifts That Will Inspire Writers To Pick Up A Pen\n\
23 Of The Most Powerful Things Ever Said About Being An Immigrant\n\
This Might Confirm Who Jon Snow's Father Is On Game Of Thrones\n\
30 Beautiful Tattoos Inspired By The Little Prince\n\
This Game Of Thrones Fan Theory Might Reveal Jon Snow's Birth Name\n\
How Well Do You Remember Roald Dahl's Gobblefunk Language From The BFG?\n\
Holy Shit J.K. Rowling Just Released So Much Info On The American Wizarding School\n\
The First Name You See Is The Harry Potter Witch Or Wizard You'll Marry\n\
This Photographer Is Documenting Unidentified Murder Victims In America\n\
26 Books With LGBT Characters You Won't Be Able To Put Down\n\
Exclusive: Here's The Cover For Victoria Aveyard's Next Book\n\
Every Book Referenced On Season 4 Of Orange Is The New Black\n\
People Are Very Happy About This Game Of Thrones Scene\n\
This Answers Your Questions About Varys On Game Of Thrones\n\
The Cast Of “Game Of Thrones” Then Vs. Now\n\
Rory Gilmore Totally Nerded Out Over Books With Michelle Obama\n\
16 Page-Turners That You Should Read With Your Sister\n\
We Need To Talk About That Insane Game Of Thrones Twist\n\
People Are Freaking Out That Brexit Happened On The Same Day That Voldemort Returned\n\
Jon And Sansa On Game Of Thrones Might Be Headed In An Interesting Direction\n\
How Batman Made Me Fall In Love With Comic Books\n\
21 Things That Have Changed Since The First Harry Potter Book Came Out\n\
Here's One Thing You Probably Didn't Spot In The Game Of Thrones Finale\n\
Game Of Thrones Just Revealed Something Huge And People Aren't OK\n\
Everything You Need To Know About This Game Of Thrones Fan Theory\n\
Markets Settle As The Great British Freakout Takes A Break\n\
Law School Grads Could Be Next To Have Student Loans Cancelled\n\
Markets Fall All Over The World Again Thanks To Brexit Vote\n\
Diet Pepsi Is Having A Serious Identity Crisis\n\
As The Pound Crashes, Currency Exchange Shops Surrender\n\
Banks Are The Biggest Losers In Brexit Panic\n\
Markets Across The World Are In Full Brexit Freakout\n\
Nike Drops Lawsuit Against Star U.S. Runner As Olympic Trials Approach\n\
Government Set To Kill Controversial College Watchdog\n\
Baristas Say Morale At Starbucks Is Sinking\n\
Palantir Seeks To Muzzle Former Employees\n\
Nike Is Suing A Star U.S. Runner To Wear Its Brand For The Olympics\n\
Amazon Is Giving E-Book Buyers Free Money From Apple\n\
Chick-fil-A Leads Fast Food Industry In Customer Satisfaction, Chipotle Falls\n\
129 Zenefits Staff Quit After Offer From CEO\n\
After Dropping Cigarettes, CVS Gives Snack Aisle A Healthy Makeover\n\
Strangely, You Bake The New Deep Fried Twinkies\n\
How Hired Hackers Got “Complete Control” Of Palantir\n\
The Redstone/Viacom Fight Has Escalated Into Elder Abuse Subtweets\n\
An Old Beef Haunts Zenefits\n\
Disney-Owned ABC News Calls Shanghai Disney Resort A Magical New World\n\
Education Department Pushes To Terminate College Watchdog\n\
Kim Kardashian: Hollywood Is Hard To Copy Because There's Nobody Like Kim Kardashian\n\
5,000 Macy's Staff Set To Begin Strike Wednesday\n\
Zenefits Laying Off 100 More Employees, Will Pay Others To Quit\n\
For-Profit Colleges Say New Obama Rules Will Crush The Industry\n\
Hi, I'd Like To Share Some Jokes About Microsoft's Acquisiton Of LinkedIn\n\
Microsoft Is Buying LinkedIn For $26 Billion\n\
The Playboy Mansion Purchased By Owner Of Twinkie Maker\n\
The Hardest Scott Pilgrim vs. The World Quiz You'll Ever Take\n\
People Are Playing Roomba Pong And It Looks Like An Actual Blast\n\
#HeterosexualPrideDay Is Trending On Twitter And People Have A Lot Of Feelings\n\
20 Ways You Can Celebrate Your Heterosexual Pride\n\
This Game Of MASH Will Determine What Your Celebrity Life Would Be Like\n\
12 Ángeles Azules Songs That Will Make You Go, My Childhood!\n\
Which Hogwarts House Do You Belong In Based On Your Food Preferences?\n\
23 Things That Will Take Latinos Who Grew Up In L.A. Back To Their Childhoods\n\
15 Mouthwatering Strawberry Desserts You Should Eat ASAP\n\
Which Song From Hamilton Are You Based On Your Zodiac Sign?\n\
A Ranking Of The Hottest U.S. Presidents\n\
Can You Guess The Justin Bieber Album From A Single Lyric?\n\
Which Dragon Tales Character Are You Based On Your Birth Month?\n\
Queen Rihanna Ordered Pizza For Her Fans Who Were Waiting In The Rain For Her Show\n\
25 Photos That Show What Obama's Presidency Means To Young Black Americans\n\
The First Name You See Is The Harry Potter Witch Or Wizard You'll Marry\n\
Which Eeveelution Matches Your Zodiac Sign?\n\
Which Alessia Cara Song Are You Based On Your Zodiac Sign?\n\
14 Epic Sandwiches That'll Take Your Picnic Game To The Next Level\n\
This Amazing Choreographed Proposal At Pride Will Make Your Heart Grow Three Sizes\n\
31 Books You Need To Bring To The Beach This Summer\n\
We Know Your Favorite Harry Potter Character Based On Your Favorite Harry Potter Character\n\
What's The Weirdest Fast Food Item In America?\n\
We Know Your Favorite Disney Princess Based On Your Favorite Harry Potter Character\n\
19 Photos That Will Remind You That You're Great At Your Job\n\
17 Crazy Things That Actually Happened To People During Jury Duty\n\
17 Useful Gifts That Will Inspire Writers To Pick Up A Pen\n\
23 Of The Most Powerful Things Ever Said About Being An Immigrant\n\
This Kitten Escaping Its Cage To See Its Puppy Friend Will Warm Your Heart\n\
We Know If You Like Black Licorice With Just One Question\n\
North Carolina Bill Wouldn't Actually Walk Back Anti-LGBT Law, Advocates Say\n\
Which Of Tennis's Big Four Are You?\n\
11 Pop Stars Reimagined As Disney Characters\n\
9 Photos Of Tarantulas That Will Make You Say “Me… Maybe?\n\
30 Beautiful Tattoos Inspired By The Little Prince\n\
We Know Your Favorite Disney Princess Based On Your Favorite Cheese\n\
What Decadent Five-Course Meal Are You Destined To Eat?\n\
People In Japan Are Vacuuming Harmonicas And It Will Make You Feel So Alive\n\
These Are The Athletes Opting Out Of The Olympics Amid Zika Concerns\n\
Can We Guess Which Disney Channel Era You Belong To?\n\
Which Hogwarts Professor Would Definitely Hate You?\n\
Can You Guess The Disney Movie By These Emojis?\n\
Which Harry Potter Home Should You Live In?\n\
Which Ryan Reynolds Character Matches Your Favorite Color?\n\
Queen Rihanna Ordered Pizza For Her Fans Who Were Waiting In The Rain For Her Show\n\
Calvin Harris Seems To Be Shading The Hell Out Of Taylor Swift On Social Media\n\
Here's The New Trailer For Bridget Jones's Baby\n\
11 Pop Stars Reimagined As Disney Characters\n\
What You Think You Look Like Vs. What You Actually Look Like, Featuring Adriana Lima\n\
19 Perfect Tweets About This Week's Episode Of The Bachelorette\n\
Looks Like Blac Chyna And The Kardashians Are Finally Getting Along\n\
Rachel Roy Talked About Her Hair In Her First Interview After Lemonade\n\
Lena Dunham Just Shut Kanye West's Famous Video Down\n\
Kanye West's Famous Video Could Expose Him To Legal Action, Experts Say\n\
15 Celeb Photos From The BET Awards\n\
Chad From The Bachelorette Said Half The Contestants Are Cheaters\n\
Can You Pick The Youngest Audrey Tautou?\n\
The Emotional New Star Trek Beyond Trailer Hints That Rihanna Might Be A Trekkie\n\
Taylor Swift Has Entered The Vintage Taylor Swift Era\n\
Are You More Venus Or Serena Williams?\n\
Billy Zane Said His Titanic Character Should Have Ended Up With Rose\n\
Aubrey Plaza's Birthday Was Filled With Parks & Rec Love\n\
Wow, Taylor Swift And Tom Hiddleston Are Moving Fast\n\
30 Things You Should Know About Erin And Sara Foster\n\
Which Food Network Chef Should You Date Based On Your Zodiac Sign?\n\
Tina Knowles Lawson Accepted Beyoncé's BET Award Like A Total Boss\n\
Everyone Wants To Know Why Jesse Williams Isn't Running For President\n\
If Jennifer Saunders And Joanna Lumley Could Give You Advice, What Would You Ask Them?\n\
The BET Awards Gave Prince The Tribute He Deserves\n\
Jesse Williams Gave An Incredibly Powerful Speech About Race At The BET Awards\n\
People Are Cracking Up Because Spike Lee Looks Like Willy Wonka\n\
Beyoncé And Kendrick Lamar Just Surprised Everyone\n\
50 Cent Got Arrested For Saying Motherfucking In St. Kitts\n\
The New Trolls Trailer Will Make Your Heart Explode With Joy\n\
57 Photos That Prove “Game Of Thrones Is The Most Visually Stunning Show On TV\n\
The Actor Who Plays Melisandre On “Game Of Thrones” Made A Dark But Funny Joke About Shireen\n\
This Horrifying Rugrats Fan Theory Will Ruin Rugrats For You\n\
Daniel Radcliffe Has Said He Would Consider Reprising His Role As Harry Potter\n\
What The Fuck Are These Cartoon Animals Supposed To Be?\n\
This Might Confirm Who Jon Snow's Father Is On Game Of Thrones\n\
Here's The New Trailer For Bridget Jones's Baby\n\
There's A Petition For Star Wars To Include An LGBT Character In Memory Of An Orlando Victim\n\
12 Ways You Can Support The New Ghostbusters Movie Against The Hate Campaign\n\
This Game Of Thrones Fan Theory Might Reveal Jon Snow's Birth Name\n\
People Are Not OK After Watching This Gut-Wrenching Deleted Scene From Zootopia\n\
Someone Put The Crying Jordan Meme On Dead “Game Of Thrones” Characters\n\
Holy Shit J.K. Rowling Just Released So Much Info On The American Wizarding School\n\
19 Perfect Tweets About This Week's Episode Of The Bachelorette\n\
When You're Done With Season 4 Of Orange Is The New Black You Can Read This\n\
People Are Very Happy About This Game Of Thrones Scene\n\
Every Book Referenced On Season 4 Of Orange Is The New Black\n\
This Answers Your Questions About Varys On Game Of Thrones\n\
Hollywood Is Finally Ready For Taika Waititi\n\
19 People Who Are So Happy “Game of Thrones” Is Done\n\
People Are Living For Cersei's Outfit On Last Night's Game Of Thrones\n\
We Need To Talk About Arya Stark In The Season 6 Finale\n\
Chad From The Bachelorette Said Half The Contestants Are Cheaters\n\
Everyone Is Still Losing It Over Lyanna Mormont's Speech\n\
Billy Zane Said His Titanic Character Should Have Ended Up With Rose\n\
The Emotional New Star Trek Beyond Trailer Hints That Rihanna Might Be A Trekkie\n\
The Cast Of “Game Of Thrones” Then Vs. Now\n\
Aubrey Plaza's Birthday Was Filled With Parks & Rec Love\n\
Justin Timberlake Gave His Thoughts On Jesse Williams' Speech About Race And Black People Went In\n\
Here's One Thing You Probably Didn't Spot In The Game Of Thrones Finale\n\
We Need To Talk About That Insane Game Of Thrones Twist\n\
Game Of Thrones Just Revealed Something Huge And People Aren't OK\n\
Everyone Wants To Know Why Jesse Williams Isn't Running For President\n\
81 Thoughts I Had During The Game Of Thrones Finale, Including CONFIRMED\n\
Which Character From Game Of Thrones Will Be Your Downfall?\n\
Jon And Sansa On Game Of Thrones Might Be Headed In An Interesting Direction\n\
Jesse Williams Gave An Incredibly Powerful Speech About Race At The BET Awards\n\
Inside The Year’s Most Shocking Movie Ending\n\
How “Star Trek” Created, Lost, And Won Back Pop Culture’s Most Devoted Fandom\n\
Hollywood Is Finally Ready For Taika Waititi\n\
Every Episode Of Game Of Thrones Ranked From Worst To Best\n\
The Shallows Is Blake Lively's The Revenant\n\
14 Things You've Always Wanted To Know About Blake Lively\n\
Here Are All Of The Fabulous Looks From The 2016 BET Awards Red Carpet\n\
Nick Jonas Surprised A Bunch Of BuzzFeed Staffers With Bacon\n\
Here's What's Gone Down Between The Kardashians, Blac Chyna, And Rob So Far On KUWTK\n\
49 New Songs You Need In Your Life This June\n\
The BET Awards Gave Prince The Tribute He Deserves\n\
The Emotional New Star Trek Beyond Trailer Hints That Rihanna Might Be A Trekkie\n\
This Indian Remix Of Rihanna's Work Is Dripping With Bharatanatyam-Hip Hop Realness\n\
This Might Confirm Who Jon Snow's Father Is On Game Of Thrones\n\
57 Photos That Prove “Game Of Thrones Is The Most Visually Stunning Show On TV\n\
21 Tweets That Are Way Too Funny For All Hamilton Fans\n\
There's A Petition For Star Wars To Include An LGBT Character In Memory Of An Orlando Victim\n\
Holy Shit J.K. Rowling Just Released So Much Info On The American Wizarding School\n\
People Are Very Happy About This Game Of Thrones Scene\n\
Every Book Referenced On Season 4 Of Orange Is The New Black\n\
This Answers Your Questions About Varys On Game Of Thrones\n\
19 People Who Are So Happy “Game of Thrones” Is Done\n\
The Emotional New Star Trek Beyond Trailer Hints That Rihanna Might Be A Trekkie\n\
12 Ways You Can Support The New Ghostbusters Movie Against The Hate Campaign\n\
Which Character From Game Of Thrones Will Be Your Downfall?\n\
Here's One Thing You Probably Didn't Spot In The Game Of Thrones Finale\n\
We Need To Talk About That Insane Game Of Thrones Twist\n\
Game Of Thrones Just Revealed Something Huge And People Aren't OK\n\
81 Thoughts I Had During The Game Of Thrones Finale, Including CONFIRMED\n\
Which Hogwarts Houses Do These Orange Is The New Black Characters Belong In?\n\
Are You More Fire Or Ice?\n\
Are You More Johnny Bravo Or Johnny Test?\n\
This GIF Shows That Jon Snow's Sword Is Made Of Rubber And It's Hilarious\n\
20 Times Peridot From Steven Universe Was Our Favorite Gem\n\
42 Game Of Thrones Characters, Ranked By Dateability\n\
21 Things That Have Changed Since The First Harry Potter Book Came Out\n\
How Much Of A Lord Of The Rings Fan Are You Actually?\n\
This Game Of MASH Will Determine What Your Harry Potter Life Would Be Like\n\
Which Game Of Thrones Character Are You In The Streets…And In The Sheets?\n\
A New Captain America Porn Parody Is Happening And Cap Looks Just Like Ryan Reynolds\n\
Everything You Need To Know About This Game Of Thrones Fan Theory\n\
There's A New Ghostbusters Theme Song Now And It's By Fall Out Boy\n\
Here's How To Know If You Could Benefit From Therapy\n\
First Monkeys With Zika Show That Pregnancy Prolongs Infection\n\
17 Things Everyone Should Know About Epilepsy\n\
18 Charts For Better, Healthier Snacking\n\
Can You Guess Which Bag Of Chips Has The Most Calories?\n\
14 Very Unfortunate Medical Treatments That Actually Used To Exist\n\
8 Warm-Up Exercises You Aren't Doing But Totally Should\n\
11 Ways I Deal With Being A Social Introvert\n\
21 Insanely Useful Skills Every Late Person Has Perfected\n\
This Might Be The Hardest Period Quiz Ever\n\
23 Easy Healthy Recipes That Will Actually Make You Love Salad\n\
7 Easy And Fun Things To Try Out This Week\n\
Here's Why Apple Is Bringing Meditation To Your Wrist\n\
25 Things That Will Make Tall People Say Nope\n\
This Is What Happens When You Work Out With A Celebrity Fitness Trainer\n\
Porn Has Been Lying To Us About Anal Sex Since Forever TBH\n\
24 Dog Pictures That Will Make You Say Me On My Period\n\
21 Things To Do After A Book Breaks Your Damn Heart\n\
Transgender Women Get Real About Tucking\n\
Hey Guys, Periods Are Red\n\
5 Secrets People With Clammy Hands Will Never Tell You\n\
Here's What Personal Trainers Actually Eat After A Workout\n\
Here's What You Should Actually Say To Someone Who's Been Sexually Assaulted\n\
Here's What Happens When You Exercise After Drinking\n\
Can You Guess Which Food Has A Ton Of Protein?\n\
26 Things Queer People Actually Want To Hear After Orlando\n\
What's The Worst Part About Having A Peanut Allergy?\n\
Here's What Actually Happens When You Swallow Your Gum\n\
Fitbit Wants You To Go The F To Sleep\n\
20 Ways You Can Celebrate Your Heterosexual Pride\n\
#HeterosexualPrideDay Is Trending On Twitter And People Have A Lot Of Feelings\n\
49 Celebrities Memorialized The Orlando Victims In This Powerful Tribute\n\
40 Years Of Dykes On Bikes In San Francisco\n\
Here's Why Growing Up As A Queer Kid In India Can Be Confusing AF\n\
128 Members Of Congress Urge Appeals Court To Protect Gay Workers From Discrimination\n\
Transgender Woman Wins Utah Democratic Senate Primary\n\
When You're Done With Season 4 Of Orange Is The New Black You Can Read This\n\
A Group Of Clerics In Pakistan Issued A Fatwa Declaring That Transgender People Can Marry\n\
This Amazing Choreographed Proposal At Pride Will Make Your Heart Grow Three Sizes\n\
Gay YouTuber Says He Was Assaulted, Officials Unable To Substantiate Claims\n\
North Carolina Bill Wouldn't Actually Walk Back Anti-LGBT Law, Advocates Say\n\
What It Feels Like To Tell Someone You're Trans\n\
There's A Petition For Star Wars To Include An LGBT Character In Memory Of An Orlando Victim\n\
26 Books With LGBT Characters You Won't Be Able To Put Down\n\
We Talked About Being Bisexual While In An Actual Closet\n\
15 Adorable Dogs Told Us What Pride Means To Them\n\
Your 1st Time At A Gay Bar Vs Your 101st Time At A Gay Bar\n\
This Father And Son Did A Joint Makeup Portrait And It's Unbelievably Beautiful\n\
Pope Francis Says Church Must Say It's Sorry To Gays And Others It Has Offended\n\
A Police Officer Proposed To His Boyfriend At Pride And Melted Everyone's Hearts\n\
This Is How Brexit Could Affect LGBT Rights Around The World\n\
A Tory Cabinet Minister Just Came Out During Pride\n\
New York's Pride March Was Fabulously Defiant And Heartwarming\n\
Two Paramedics Got Engaged At NY Pride And It Was So Damn Cute\n\
New York’s Pride Parade Begins After Moment Of Silence For Orlando Victims\n\
Years & Years' Olly Alexander Gave An Emotional Speech At Glastonbury To Empower LGBT People\n\
Everything You Need To Know About THAT Scene In OITNB Season 4\n\
Ban On Transgender Military Service Expected To Be Lifted In July\n\
Do You Actually Love Mexican Food?\n\
This Is How You Can Block Calliou From Showing Up On Netflix\n\
9 Common iPhone Problems And How To Fix Them\n\
23 Ways To Throw An Almost-Grownup Dinner Party\n\
You Guys, We've Found The Drink Of The Summer\n\
23 Ingenious Products You Need Before Your Next Road Trip\n\
Here's What Men Think About Wearing No Makeup-Makeup\n\
Can We Fix Your iPhone With Just One Question?\n\
21 Space Tattoos To Totally Geek Out Over\n\
Do You Know What State This License Plate Is From?\n\
21 Chill Rompers For When You Don't Feel Like Getting Dressed This Summer\n\
Here's How To Know If You Could Benefit From Therapy\n\
6 Brides Whose Babies Just Needed To Eat\n\
These Mutant Lemons Will Bring You Strange Joy And Extreme Discomfort\n\
26 Things Every Pregnant Woman Has Secretly Done\n\
Can You Pass This Kinda Difficult New York Quiz?\n\
24 Unexpected Ways To Make Your Home Look A Little More Alive\n\
A Woman Re-Created That Creepy Black Bath Bomb IRL\n\
21 Summer Tops That Are Perfect For People Who Are Always Hot\n\
Here’s What People Are Buying On Amazon Right Now\n\
27 Wedding Dresses You Didn't Know You Could Get At Zappos\n\
24 Midi Skirts That Are Perfect For Every Occasion\n\
How Much Do You Really Know About Ohio?\n\
7 Smart Tricks That'll Make Breakfast So Much Better\n\
19 Gorgeous Ways To Display Your Favorite Travel Photos\n\
17 Genius Ideas For Tasty Quesadillas\n\
16 Pictures That Will Make You Drop Everything And Order A Burrito\n\
Can You Guess These Disney Princesses Drawn By A 6-Year-Old?\n\
17 No-Bake Treats That You Need In Your Life\n\
7 Healthy Eating Tricks You're Going To Want To Try\n\
My Mom Ran My Life For A Week And Here's What Happened\n\
17 Things Everyone Should Know About Epilepsy\n\
How Many Types Of Cheese Have You Eaten?\n\
24 Times Target T-Shirts Went Too Far\n\
19 Things Your Mom Would Never Be Caught Dead Saying\n\
Can You Guess Which Chocolate Bar Has The Most Sugar?\n\
7 Hella Impressive Beauty Products That Cost Less Than $7\n\
18 Charts For Better, Healthier Snacking\n\
17 Nightmares For Anyone Who Hates Feet (So, Everyone)\n\
People In Japan Are Vacuuming Harmonicas And It Will Make You Feel So Alive\n\
Which Country Music Star Are You?\n\
The Emotional New Star Trek Beyond Trailer Hints That Rihanna Might Be A Trekkie\n\
Kanye West's Famous Video Could Expose Him To Legal Action, Experts Say\n\
Lady Gaga Shook Hands With The Dalai Lama And Her Instagram Blew Up\n\
Tina Knowles Lawson Accepted Beyoncé's BET Award Like A Total Boss\n\
PJ Harvey Summed Up How Many People Feel About Brexit With A Powerful Poem At Glastonbury\n\
Years & Years' Olly Alexander Gave An Emotional Speech At Glastonbury To Empower LGBT People\n\
The BET Awards Gave Prince The Tribute He Deserves\n\
Beyoncé And Kendrick Lamar Just Surprised Everyone\n\
50 Cent Got Arrested For Saying Motherfucking In St. Kitts\n\
Here Are All Of The Fabulous Looks From The 2016 BET Awards Red Carpet\n\
Can You Guess The Modern-Day Pop Song Based On Its First Line?\n\
Which Lana Del Rey Born To Die Song Are You Based On Your Zodiac?\n\
23 Pictures That Prove How Ridiculous Glastonbury Was This Year\n\
150,000 People Sang Someone Like You With Adele At Glastonbury And It Will Give You The Chills\n\
All The Celebrity Instagrams From Glastonbury 2016\n\
Here's What All The Celebrities Wore At Glastonbury 2016\n\
Kanye West Released A Video Of A Celeb Orgy And People Have A Lot To Say About It\n\
18 Pieces Of Bad Fan Art Of Adele From Glastonbury\n\
Which S Club 7 Song Matches Your Zodiac?\n\
Kelly Clarkson Is Finally Going To Record The Soul Album We've All Been Waiting For\n\
17 Actually Genius Things To Bring To A Festival\n\
How Well Do You Remember The First 10 'Now' CDs?\n\
Snoop Has A Weed Brand Called “Leafs” And The Toronto Maple Leafs Are Not Happy\n\
What New Song Should You Play On Repeat This Weekend?\n\
What Dixie Chicks Song Are You?\n\
She Doesn't Have The Range Is The Most Delightfully Shady Thing On The Internet\n\
Can You Guess The Marina And The Diamonds Song From A Single Lyric?\n\
This Is How You Can Block Calliou From Showing Up On Netflix\n\
6 Brides Whose Babies Just Needed To Eat\n\
Parents Are Sharing This Hoax On Facebook Because Of What It Says About Kids These Days\n\
This Guy Found His SpongeBob Diary From When He Was 9 And It's Absolutely Fantastic\n\
26 Things Every Pregnant Woman Has Secretly Done\n\
Can You Guess These Disney Princesses Drawn By A 6-Year-Old?\n\
My Mom Ran My Life For A Week And Here's What Happened\n\
19 Things Your Mom Would Never Be Caught Dead Saying\n\
These Dad Joke Memes Are Guaranteed To Make You Laugh\n\
This Mom Spoke Up After Her Son Was The Only Kid Not Invited To A Birthday Party\n\
21 Technicolor Treats That Will Make Your Mouth Water\n\
24 Mom Jokes That Put Dad Jokes To Shame\n\
24 Tweets About Kids That Will Make Every Parent Laugh\n\
These Are The Things That Happen When You Become An Honorary Aunt Or Uncle\n\
This Mom Makes Her Kids Groan Every Day With Amazing Lunchbag Puns\n\
This Instagram Pic Of Tamera Mowry And Her Baby Has Won The Internet\n\
21 Things You Probably Shouldn't Buy At The Dollar Store\n\
These Babies Dressed Up As Icons And It Was Adorable\n\
This 15-Year-Old Got Stuck In A Barney Head And Firefighters Had To Save Her\n\
12 Photos Parents Are NOT Posting To Facebook\n\
If Phil Dunphy Quotes Were Motivational Posters\n\
Can You Get Through These 17 GIFs Of Massive Diaper Blowouts Without Losing Your Lunch?\n\
19 Hilarious Tumblr Posts That Prove Dads Are Precious\n\
26 Family Secrets That Will Leave You Slack-Jawed\n\
16 Things You'll Know If You've Been To A Latinx Child's Birthday Party\n\
We Gave 6 Dads A Father's Day Makeover And Here's What Happened\n\
This 7-Year-Old Is Way Cooler Than You\n\
Well Played: Chelsea Clinton Now Has Two Children Named After “Sex And The City Characters\n\
20 Ridiculously Cute Celebrity Dad Tweets\n\
Trump In 2014: Hillary Clinton Is Very Smart, Will Be Tough To Beat In 2016\n\
Ivanka Trump: Athletes And Coaches Will Be Speaking At The RNC\n\
Transgender Woman Wins Utah Democratic Senate Primary\n\
128 Members Of Congress Urge Appeals Court To Protect Gay Workers From Discrimination\n\
Rubio On Trump: I Don't Intend To Spurn Him Or Denigrate Him\n\
Republicans To Send Letter Of Concern To RNC Over Minority Outreach\n\
Donald Trump Took Back His Promise To Donate His Apprentice Salary To Charity\n\
Elizabeth Warren Finally Opens Her Arms To Hillary Clinton\n\
Federal Judge Criticizes Mississippi Marriage Recusal Law, Will Expand Injunction\n\
Huckabee: George Will, Ben Sasse Aren't Republicans Because They Don't Back Trump\n\
Texas Governor Isn't Feeling Texit\n\
Supreme Court Tosses Out Former Virginia Governor McDonnell's Corruption Conviction\n\
Supreme Court Strikes Down Texas Abortion Restrictions\n\
Texas Clinic Owner First In Line, Awaiting Decision From Supreme Court\n\
There's A Standoff Between States And The Feds Over Illegal Execution Drugs\n\
New York Case Could Provide Key Test For Establishing Legal Protections For Gay People\n\
Koch Super PAC Attacks Democrats Over Uber In Nevada\n\
Obama Makes The Case For Global Entrepreneurship Now And After His Presidency\n\
Trump Says He Knows Nothing About Hank Paulson, Whom He Praised By Name In 2008\n\
Arizona Presently Incapable Of Carrying Out An Execution, State Lawyers Say\n\
Conservative Talk Radio Loves Brexit\n\
Brexit Is Not The Same Thing As Trump\n\
Clinton Campaign Rejects Comparisons Between Trump And Brexit\n\
Immigration Policy Is Back In The Hands Of Voters\n\
Mitch McConnell On Donald Trump: He Better Shape Up If He Wants To Win\n\
Basically Every U.S. Politician Has The Same Sentence In Their #Brexit Statement\n\
GOP Senator: Donald Trump Can't Win 65 Million Votes Acting The Way He Does\n\
Former Trump Adviser: Corey Lewandowski Was Fired Over Judge Curiel Attack\n\
Bernie Sanders Says He Will Vote For Hillary Clinton\n\
Today's BuzzFeed Crossword, 6/29\n\
Today's BuzzFeed Crossword, 6/28\n\
Today's BuzzFeed Crossword, 6/27\n\
Can You Solve The Hardest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 6/23\n\
Today's BuzzFeed Crossword, 6/22\n\
Today's BuzzFeed Crossword, 6/21\n\
Today's BuzzFeed Crossword, 6/20\n\
Can You Solve The Hardest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 6/16\n\
Today's BuzzFeed Crossword, 6/15\n\
Today's BuzzFeed Crossword, 6/14\n\
Today's BuzzFeed Crossword, 6/13\n\
Can You Solve The Hardest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 6/9/16\n\
Today's BuzzFeed Crossword, 6/8/16\n\
Today's BuzzFeed Crossword, 6/7/16\n\
Today's BuzzFeed Crossword, 6/6/16\n\
How Much Of The Hardest BuzzFeed Crossword Of The Week Can You Finish?\n\
Can You Figure Out The Theme To Today's BuzzFeed Crossword?\n\
Today's BuzzFeed Crossword, 5/31/16\n\
Can You Solve The Toughest BuzzFeed Crossword Of The Week?\n\
Can You Figure Out The Theme To Today's BuzzFeed Crossword?\n\
Today's BuzzFeed Crossword, 5/25/16\n\
Today's BuzzFeed Crossword, 5/24/16\n\
Today's BuzzFeed Crossword, 5/23/16\n\
Today's BuzzFeed Crossword, 5/20/16\n\
Can You Figure Out The Theme Of Today's BuzzFeed Crossword?\n\
Today's BuzzFeed Crossword, 5/18/16\n\
The Incantations Of Daniel Johnston\n\
Here’s What Muhammad Ali Meant To Black Louisville Natives Like Me\n\
Every Book Referenced On Season 4 Of Orange Is The New Black\n\
Why Brexit Has Broken My Heart\n\
Poem: Social Skills Training By Solmaz Sharif\n\
Rape Culture Is Surveillance Culture\n\
From Orlando To NYC, Queer Latino Immigrants Ask “What's Next?”\n\
The Best Essays, Poems, And Advice Are In BuzzFeed READER's Newsletter!\n\
How Ramadan Helped Me Realize I Was Good Enough\n\
For Muslims Like Me, Trump's Words Are A Daily Nightmare\n\
The Gay Bathhouse Fire Of 1977\n\
I Found A Home In Clubs Like Pulse In Cities Like Orlando\n\
13 Soothing Books To Read When Everything Hurts\n\
Here Is What LGBT Muslims Want You To Know After The Orlando Shooting\n\
Why Queer Bars Matter\n\
What It's Like To Write About Your Best Friend's Death\n\
I Don’t Know Why I Pray But I Keep Trying\n\
There Is No Such Thing As A Safe City For Queer People\n\
Hamilton Won Almost Everything At This Year's Tony Awards\n\
The 7-1/2-Hour O.J. Simpson Doc Everyone Will Be Talking About This Summer\n\
Amber Heard And The Narratives Of Domestic Violence\n\
The Bold Survive: The Story Behind Ferris Bueller's Weekend Out\n\
Life Is What Happens While You’re Googling Symptoms Of Cancer\n\
What It Means To Fall In Friend-Love In Your Twenties\n\
Poem: The Five Stages Of Drowning By Patricia Smith\n\
Me Before You Mistreats Its Disabled Character For The Sake Of Romance\n\
Finding Our Own Coming-Of-Age Narratives\n\
Before I Was A Mother, I Was A Drunk\n\
The True Story Of The Fake Zombies, The Strangest Con In Rock History\n\
Can You Guess The Justin Bieber Album From A Single Lyric?\n\
The First Name You See Is The Harry Potter Witch Or Wizard You'll Marry\n\
The New Trolls Trailer Will Make Your Heart Explode With Joy\n\
Daniel Radcliffe Has Said He Would Consider Reprising His Role As Harry Potter\n\
11 Pop Stars Reimagined As Disney Characters\n\
What The Fuck Are These Cartoon Animals Supposed To Be?\n\
13 Mean Girls Quotes That Really Improve Australian Politics\n\
This Game Of MASH Will Determine What Your Gilmore Girls Life Would Be Like\n\
Can You Get 9/9 On This 1960s Louisiana Literacy Test?\n\
Do You Remember The Names Of These Sesame Street Characters?\n\
Arthur Doesn't Get How Ears Work Apparently\n\
Billy Zane Said His Titanic Character Should Have Ended Up With Rose\n\
If Aussie Politicians Were Disney Villains\n\
Can You Pick The Youngest Audrey Tautou?\n\
24 Extraordinary Photos Of Immigrants Passing Though Ellis Island\n\
Aubrey Plaza's Birthday Was Filled With Parks & Rec Love\n\
Game Of Thrones Just Revealed Something Huge And People Aren't OK\n\
Can You Guess Which Country These Disney Films Were Set In?\n\
Which ’90s Nickelodeon Cartoon Character Are You Based On Your Zodiac?\n\
Can We Guess Who You'll Vote For From Your Pick In A Party Mix?\n\
14 Reasons Olive's Parents From Easy A Are The Best Parents Of All Time\n\
This Horrifying Rugrats Fan Theory Will Ruin Rugrats For You\n\
23 Pictures That Are Too Real If You've Ever Had Sex With A Penis\n\
Can You Match The Quote To The Desperate Housewife?\n\
35 Reminders Of What Life Was Like 5 Years Ago\n\
Who Was Actually The Worst Friends Friend, Though?\n\
Can You Identify The Disney Movie From Its Closing Line?\n\
21 Things You'll Definitely Remember If You Watched Go Go Stop\n\
How Well Do You Know Daria Characters' Names?\n\
He Thinks He’s Untouchable”: Sexual Harassment Case Exposes Renowned Ebola Scientist\n\
After Abortion Controversy, AmeriCorps’ Health Program Is Shutting Down\n\
These Young Scientists Planned To Work In The U.K. — Now They Might Have To Leave\n\
These Words Have Been Tested By Science To Get You To Vote\n\
British Science Still Open For Business Despite Brexit Vote, Politicians Insist\n\
First Monkeys With Zika Show That Pregnancy Prolongs Infection\n\
After Brexit Shock, Drug Companies Try To Keep Britain Tied To Europe\n\
Coral Scientists Slam Australia On Great Barrier Reef\n\
Great Barrier Reef At Crisis Point As Australia Goes To Polls\n\
Here's Why Apple Is Bringing Meditation To Your Wrist\n\
14 Scientists On How They Feel About Brexit\n\
A Nasty Political Fight Is Brewing On Stem Cells — Again\n\
Why Self-Driving Cars Will Favor The Lives Of Passengers Over Pedestrians\n\
How Two Black Holes Collided A Billion Years Ago And Told Us About The First Years Of The Universe\n\
What's Your Physics Percentage?\n\
Zika Fears Are Spiking The Demand For Abortions In Countries Where It's Illegal\n\
Academia: Expectation Vs Reality\n\
Can You Remember These Primary School Experiments?\n\
19 Biology Tweets That Will Make You Laugh And Then Think\n\
After 20-Year Hiatus, Will Lawmakers Restart The CDC’s Gun Research?\n\
Workers May Soon Have To Share Health Data — Or Pay A Penalty\n\
Latin American Environmentalists Are Paying For Their Protests With Their Lives\n\
Literally Just 17 Beautiful Pics Of Our Solar System\n\
Zika Is Spreading Fast In Puerto Rico, Could Reach 25% Of Population\n\
ISIS Groups Gather Online Before Real World Attack, Computer Scientists Find\n\
Zika Infections In Third Trimester Don’t Lead To Severe Birth Defects, Study Finds\n\
This Glow Worm-Dotted Cave In New Zealand Is Literally Avatar IRL\n\
Scientists Have Seen Gravitational Waves For A Second Time – Here's Why That's A Huge Deal\n\
Donald Trump In 2004 On STDs And Dating: It’s Like Vietnam And Iraq\n\
These Are The Athletes Opting Out Of The Olympics Amid Zika Concerns\n\
Pat Summitt, Winningest Coach In Division 1 College Basketball History, Dies At 64\n\
Everyone In Cleveland Plus Their Brother Showed Up For The Cavaliers Championship Parade\n\
Cleveland Cavaliers Fans Risked Death To Catch A Glimpse Of The Championship Parade\n\
Lavezzi's Celebration Against USA Reminded Everyone Of Maradona\n\
Cleveland's LeBron James Banner Will Be Removed For The Republican Convention\n\
Dwayne Wade Is Naked And Perfect On The Cover Of ESPN Magazine's Body Issue\n\
The Internet Had A Field Day After LeBron James And The Cavs Won The NBA Finals\n\
LeBron James Breaks Down Crying After Leading Cavaliers To First Cleveland Championship Since 1964\n\
Fans Are Emotional After The Cleveland Cavaliers' Historic Win\n\
Cleveland Cavaliers Win First NBA Championship In Franchise History In Game 7 Over Golden State Warriors\n\
Do You Know Which Athlete Is Actually The Richest?\n\
The Internet Went In On Ayesha And Steph Curry After Last Night's Game\n\
Ayesha Curry Tweets That NBA Finals Are Rigged After Steph Is Ejected From Game 6\n\
LeBron James And The Cavaliers Dunked All Over The Warriors To Force A Game 7\n\
Cavaliers Stun Warriors With 112-97 Win To Stay Alive In The NBA Finals\n\
Did The Coach Of The German Euros Team Scratch, Then Sniff, His Balls On TV?\n\
Pittsburgh Penguins Win Stanley Cup With Game 6 Thriller\n\
A Mum With Two Sons On Opposing Football Teams Wore A T-Shirt Supporting Them Both\n\
Shirtless Man With Trump Sucks Written On Chest Runs Onto Court During NBA Finals\n\
Warriors One Win Away From Being Repeat NBA Champions After Game 4 Win In Cleveland\n\
NBA Players Union Says Better Data Is Needed To Understand The Grueling Season\n\
Cleveland Cavaliers Stomp Golden State Warriors 120-90 In Game 3 Win\n\
The NBA Released Pride Tees For All 30 Teams\n\
Maria Sharapova Suspended From Tennis For Two Years For Doping\n\
The NFL's Twitter Account Was Hacked To Say That Commissioner Roger Goodell Had Died\n\
The Italian Football Team Are So Hot Even People In Japan Have Huge Crushes On Them\n\
Steph Curry Will Not Play In The Olympics After Knee And Ankle Injuries\n\
Warriors Blowout Cavaliers Again In NBA Finals Game 2\n\
Here's What Men Think About Wearing No Makeup-Makeup\n\
21 Chill Rompers For When You Don't Feel Like Getting Dressed This Summer\n\
A Woman Re-Created That Creepy Black Bath Bomb IRL\n\
21 Summer Tops That Are Perfect For People Who Are Always Hot\n\
27 Wedding Dresses You Didn't Know You Could Get At Zappos\n\
24 Midi Skirts That Are Perfect For Every Occasion\n\
24 Times Target T-Shirts Went Too Far\n\
7 Hella Impressive Beauty Products That Cost Less Than $7\n\
We Tried Peel-Off Lip And Eyebrow Tints And This Is What Happened\n\
This Woman Styles Her Hijab For Work And It's Cool AF\n\
27 Magical Pins For People Who Are Obsessed With Fantasy\n\
17 Incredibly Pretty Hairstyle Ideas For Curly Hair\n\
23 '90s Fashions That Are Making A Comeback, Whether You Like It Or Not\n\
This Quiz Will Reveal Who You Are Based On Your Makeup Routine\n\
22 Insane Sales To Shop This Weekend\n\
We Know What Tee You'll Love Based On Your Sign\n\
We Gave 16 Trans People Makeovers To Honor Their Idols\n\
This College Student's Insane Optical Illusions Will Blow Your Mind\n\
Can You Guess Which Of These Supermodels Is The Highest-Earning?\n\
21 Pins You'll Absolutely Love If You Grew Up Latino\n\
Guys, You Can Test Out All The New Urban Decay Lipsticks In A Free App\n\
People Are Freaking Out Over These Cool AF Lipglosses With Flowers In Them\n\
A Teenager Dressed Me For A Week And It Actually Was Awesome\n\
18 Signs You Have Baby Fever But Definitely Aren't Ready For A Kid\n\
We Wore Bralettes With Our Big Boobs For A Week And Here’s How It Went\n\
17 Beauty Hacks On Instagram That Are Borderline Genius\n\
This Is What Happens When 10 Women Style The Same Skirt\n\
This Quiz Will Determine How Much Of A '90s Girl You Actually Are\n\
24 Stylish Swimsuits You Didn't Know You Could Get At Zappos\n\
Is Edward Snowden Trying To Get Vladimir Putin's Attention?\n\
Facebook To Decrease Publisher Reach To Show You More From Friends And Family\n\
Uber’s Testing A New Feature That Tracks Erratic Driving\n\
Hackers Gain Access To Uber CEO Travis Kalanick's Twitter\n\
Airbnb Sues San Francisco Over Rental Rules\n\
Now You Can Ask Alexa To Order Your Lyft\n\
Holy Fucking Shit, Twitter Has Stickers Now\n\
A Father-Daughter Team Wants To Take On Uber With A Women-Only App\n\
Twitter's Best Idea For Keeping Up With News Is Buried Too Deep\n\
Apple, Amazon, And Google Are Silent On Brexit Vote\n\
What Happens When A Stan Retires?\n\
Here's Why Apple Is Bringing Meditation To Your Wrist\n\
Should You Retweet Yourself?\n\
Facebook Live's New Feature Is Actually Cool\n\
Methodology For Estimating Uber Drivers’ Hourly Net Earnings\n\
C-SPAN Is Airing The House's Sit-In Using Periscope And Facebook Live\n\
Peter Thiel Got More Facebook Shareholder Votes Than Mark Zuckerberg\n\
Live-Streaming App YouNow Now Lets You Save Clips\n\
Palantir Seeks To Muzzle Former Employees\n\
Clown, Avocado, And Owl Emojis Are Finally Here\n\
FAA Approves Commercial Drone Operations For The First Time\n\
Slack Soups Up Bots To Conquer The Workplace\n\
You Can Now Share Live Streams On Tumblr\n\
Twitter Lengthens Video To 140 Seconds, Creates App For Influencers\n\
Disdain For Gawker And Praise For Thiel At Facebook's Stockholders Meeting\n\
China-Based Hackers Launch Fewer Attacks On U.S., Report Finds\n\
129 Zenefits Staff Quit After Offer From CEO\n\
Fitbit Wants You To Go The F To Sleep\n\
Apple Won't Be Funding The Republican Convention Because Of Trump\n\
Do You Know What State This License Plate Is From?\n\
Can You Pass This Kinda Difficult New York Quiz?\n\
7 Things That Happen When You Live In A Different Country For 10 Years\n\
There's Nothing Regular About Being Black And Muslim In America\n\
How Much Do You Really Know About Ohio?\n\
14 Ridiculously Yummy Foods You Must Eat In Madison, Wisconsin\n\
18 Delightful Dogs On Planes\n\
25 Insanely Useful Airbnb Tips That Will Make You A Better Host\n\
Here's How Brexit Will Impact Your European Travel Plans\n\
We Know Your Personality Based On Your Favorite Places\n\
Come, Hate Your Life: This Couple Makes A Living Travelling The World And Being Attractive\n\
Holidays On Instagram Vs Holidays In Reality\n\
Summer In Britain Vs. Summer In America\n\
Which European Country Should You Move To?\n\
A Bunch Of Naked People Ran Into A Freezing River To Celebrate The Winter Solstice\n\
21 Reasons You Shouldn't Bother Visiting The Isle Of Skye\n\
17 Absolutely Stunning Mosques From Around The World\n\
23 Of The Most Powerful Photos Of This Week\n\
The 30 Best Nachos In America\n\
What Are Your Best Tips For Traveling With Anxiety?\n\
18 Stunning Photos Of America Like You’ve Never Seen It Before\n\
These Might Just Be The Best Damn Lobster Rolls In NYC\n\
This 22-Year-Old Used A Crowdfunding Campaign To Travel Through All 29 States In 150 Days\n\
18 Air BnBs For Cat Ladies\n\
This Glow Worm-Dotted Cave In New Zealand Is Literally Avatar IRL\n\
27 Pictures That Will Fuel Your Wanderlust\n\
18 Fairytale Airbnb Castles That'll Make Your Dreams Come True\n\
18 Northern French Dishes So Good You'll Want To Move There\n\
18 Sexy Scottish Burgers That Are Better Than A Boyfriend\n\
People Think This Guy's Game Developer Barbie Hack For His Wife Is Amazing\n\
6 Brides Whose Babies Just Needed To Eat\n\
10 Charts To Help Anyone Write A Best Man Speech\n\
19 Ridiculous Ikea Fights That Will Make You Want To Be Single Forever\n\
17 Flawless Brides Rocking Their Natural Hair\n\
23 Insanely Romantic Quotes You'll Want To Include In Your Wedding Vows\n\
Holy Crap, This Guy Got Bitten By A Rattlesnake During His Wedding Photos\n\
Can You Get Through This Post Without Saying Awwww?\n\
This 9-Year-Old Wedding Photographer's Skills Will Give You Hope For The Future\n\
This Couple's Pirate-Themed Wedding Is Crazy Beautiful\n\
Tell Us About The Dumbest Fight You And Your S.O. Have Had In Ikea\n\
OK, These Toilet Paper Wedding Dresses Are Actually, Like, Really Pretty\n\
The Internet Is In Love With This Bride And Her Bridesmaids Flaunting Their Natural Hair\n\
Which Disney Movie Castle Is Your Dream Wedding Venue?\n\
5 Big-Batch Drinks That Will Get Your Bridal Shower Guests Drunk AF\n\
Which Style Of Engagement Ring Should You Get?\n\
Can You Pick The Engagement Ring That's From Target?\n\
Can You Tell Which Bride Is Wearing The Most Expensive Wedding Dress?\n\
This Woman's Pre-Wedding Photo Of Her Wig Falling Off Is Literally Perfection\n\
People Are In Love With This Groom's Reaction To Seeing His Bride Walk Down The Aisle\n\
21 Ridiculously Gorgeous Geeky Engagement Rings\n\
Wedding Etiquette Rules Every Grown-Ass Adult Should Know\n\
This Woman's Response To People Who Shamed Her Engagement Photos Is Too Perfect\n\
Here's A Free Coloring Book For When You Just Can't With Wedding Planning\n\
Stock In Kay Jewelers Owner Is Tumbling After A Critical Report\n\
These Men From Different Countries Fell In Love And Got Engaged, South Indian Style\n\
Can You Pick The Most Expensive Diamond Ring?\n\
This Toronto Couple Had The Cutest Raptors-Themed Wedding\n\
Watch One Woman Absolutely Rock Wedding Dresses Around India\n\
Is Edward Snowden Trying To Get Vladimir Putin's Attention?\n\
Turkey Has Become The Hub Of All The Middle East’s Wars\n\
17 Pictures Documenting The Olympic Torch's Weird As Hell Trip Through Brazil\n\
These Young Scientists Planned To Work In The U.K. — Now They Might Have To Leave\n\
Justin Trudeau Is On The Cover Of A Marvel Comic Because Of Course He Is\n\
Nigel Farage Is Receiving Online Death Threats In The Wake Of The Brexit Result\n\
An American Woman In London Wants Brits To Wear Safety Pins To Show Solidarity With Migrants After Brexit\n\
This Is What The 27 EU Leaders Will Say About Brexit On Wednesday\n\
World Leaders React To Terror Attack On Istanbul Airport\n\
These Are The Athletes Opting Out Of The Olympics Amid Zika Concerns\n\
At Least 41 Killed Including 13 Foreign Nationals In Attack On Istanbul Airport\n\
Justin Trudeau And Mexico's President Went For A Run In Very Short Shorts\n\
A German Woman Called LBC In Tears Over The Abuse She Says She's Received Since The Brexit Vote\n\
British Diplomats Say They're Fucked Over Brexit\n\
First Monkeys With Zika Show That Pregnancy Prolongs Infection\n\
The Long-Awaited Benghazi Report Is Out\n\
This MEP Got A Standing Ovation For Telling The EU Not To Let Scotland Down”\n\
Nigel Farage Just Had An Extraordinary Clash With MEPs Over Brexit\n\
Egyptians Are Outraged After This Prominent Journalist Was Deported To Lebanon\n\
This Indian Couple Claim To Be The First To Scale Mount Everest, But Did They Actually Do It?\n\
Meet The Nigerian Separatists Who Have Been Inspired By Brexit\n\
Lady Gaga Shook Hands With The Dalai Lama And Her Instagram Blew Up\n\
European Officials Say Boris Johnson's Post-Brexit Wishlist Is Delusional\n\
We Visited The Town Where 75.6% Of Voters Chose To Leave The EU\n\
Polish Embassy Shocked At Reports Of Xenophobic Abuse After Brexit Vote\n\
After Brexit Shock, Drug Companies Try To Keep Britain Tied To Europe\n\
9 Big Claims From Boris Johnson's Post-EU Referendum Column, Fact-Checked\n\
David Cameron Said His Government Will Not Tolerate Intolerance\n\
David Cameron Sets Up Brexit Unit To Work Out What Happens Next\n\
21 Small Animals That Deserve More Internet Love\n\
28 Summer Dresses For People Who Love To Wear Black\n\
18 Sandwiches You Must Try If You Live In Los Angeles\n\
Which Cereal Would You Rather Eat?\n\
How An 1891 Mass Lynching Tried To Make America Great Again\n\
16 TV Characters That Were Cooler Than Their Shows' Protagonists\n\
19 Gorgeous Items Every Spirited Away Fan Needs In Their Life\n\
Fuck, Marry, Kill: Olympic Men Edition\n\
19 Pizza Delivery Fails That'll Make You Say Enough\n\
18 Things People With Autoimmune Diseases Want You To Know\n\
Is Your Taste In Dessert The Same As Everyone Else's?\n\
The Olympics Actually Played Niger's National Anthem Instead Of Nigeria's By Mistake\n\
Real Nice Guys Can Hear The Word No\n\
We Tried Wearing Drug Store Makeup For A Week And There Were Some Hits And Misses\n\
Men Got Photoshopped To Re-Create The Ideal Female Body And The Results Were Alarming\n\
37 Thoughts Everyone Had While Watching Stranger Things\n\
We Asked Tech Industry People How To Solve The Millennial Lack Of Sex\n\
There's A New Nat Geo Nature Show On YouTube And It's Friggin' Awesome\n\
This Pokémon Go Player Just Became The Very First To Catch 'Em All Worldwide\n\
Facebook's Testing A Main Screen That Looks A Whole Lot Like Snapchat's\n\
Can You Match The Game Of Thrones Character To Their Last Words?\n\
The Best Essays, Poems, And Advice Are In BuzzFeed READER's Newsletter!\n\
12 Common Cooking Mistakes You Might Be Making\n\
How Well Do You Know The Lyrics To Before He Cheats By Carrie Underwood?\n\
Reminder That Nathan Adrian Is Actually The Hottest Olympic Swimmer\n\
19 Dogs Who Are Like “So You Gonna Finish All That, Or…”\n\
18 Reminders That Your Summer Vacation Could Be A Lot Worse\n\
What's The Best Advice You've Ever Gotten From A Book?\n\
Do You Know What Happened In The News This Week?\n\
23 Things That Will Make You Feel Like An Adult\n\
Poem: Aubade With Sage And Lemon By Tarfia Faizullah\n\
Can You Spot The Oldest Paul Rudd In A Sea Of Paul Rudds?\n\
I Tried The 10-Step Korean Skincare Routine And It Took A Long Time\n\
What's Going On Around The World Today?\n\
This Award-Winning Short Will Make You Cry And Laugh And Cry Again\n\
People Can't Get Enough Of This Facebook Post About A Trans Person's Positive TSA Experience\n\
11 Glam AF Makeup Tips For People With Hooded Eyes\n\
This Quiz Will Tell You The Exact Age You’ll Get Married\n\
22 Reasons Why Lazy Students Are Top Of Their Class\n\
Grab A Beverage And Check Out This Olympics Opening Ceremony Drinking Game\n\
18 Impossible Food Choices That Will Make Your Mouth Water\n\
21 Killer Kebabs To Serve At Your Next BBQ\n\
27 Hilariously Real Tweets About Going To Weddings\n\
Olympics Updates: Opening Ceremonies Kick Off Friday\n\
Donald Trump Now Admits He Never Saw A Video Of The US Sending Money To Iran\n\
Here's Why People Started Questioning Melania Trump’s Immigration Story\n\
Trump Supporters Don't Care That Melania Might Have Worked Illegally In The US\n\
Gov. Paul LePage: I Told Trump He Needs To Be More Disciplined\n\
Harry Reid Tells Democrats To Not Get Overconfident\n\
Trump Declines To Name Women He'd Put In His Cabinet Besides Daughter Ivanka\n\
Rudy Giuliani: Trump Shouldn't Attack Ryan, McCain, Or The Khans\n\
Trump Tells Story About His Own Running Mate Asking Permission To Endorse Paul Ryan\n\
Trump Isn't Going To Change And Republicans Know That\n\
FBI Spy Planes Filmed Protests In Baltimore, Raising Privacy Concerns\n\
Northern Virginia Mayor Arrested For Allegedly Distributing Meth In Exchange For Sex With Men\n\
FDA Approves Mutant Mosquito Experiment In Florida Keys\n\
Neighbor Arrested For Allegedly Burning Down Home Of Town's Only Black Firefighter\n\
Eight Hours In The Desert With Tesla's Biggest Fans\n\
George Zimmerman Allegedly Punched In Face After Bragging About Shooting Trayvon Martin\n\
Washington City's Election System Shuts Out Latinos, Lawsuit Says\n\
UK Could Lose Tens Of Billions Of Euros As It Leaves The EU\n\
California Mayor Charged With Secretly Recording Underage Strip Poker Game At Summer Camp\n\
Apple’s First-Ever Bug Bounty Will Pay Hackers To Find iOS Flaws\n\
Dylann Roof Assaulted By A Fellow Inmate Outside Jail Shower\n\
A Zoo Flamingo Had To Be Euthanized After A Man Allegedly Attacked Her\n\
Credit Card Chips Are The Absolute Fucking Worst\n\
This “Friends” News Will Make You Even Sadder For David The Scientist\n\
Mother Charged With Killing Her Toddler By Feeding Her A Teaspoon Of Salt\n\
26 Times Disney Fans Were The Gift The Internet Didn't Deserve\n\
Sasha Obama Proves She's A Normal Teen By Getting An Unglamorous Summer Job\n\
25 Things People Definitely Weren't Supposed To Eat\n\
11 Glam AF Makeup Tips For People With Hooded Eyes\n\
28 Real AF Jokes That Will Make Retail Workers Laugh Then Cry\n\
17 Boyfriends Who Deserve A Fucking Medal\n\
Here's How Rihanna Walked Over A Grate In Heels Without Falling: She's Rihanna\n\
This Teen Fed A Deer Some Crackers And Now They’re Best Friends\n\
21 Food Snapchats That Will Make You Laugh Harder Than They Should\n\
Sorry To Everyone Finding Out Today That You Actually Swiped Left On The Real Zac Efron\n\
I Tried To Look As Tall As Humanly Possible For A Week\n\
21 Puppies So Cute You Will Literally Gasp And Then Probably Cry\n\
How Suicide Squad Uses And Abuses Harley Quinn\n\
Margot Robbie's Unicorn Dress Was The Star Of The Suicide Squad Premiere\n\
16 Hilarious Be Careful Who You Call Ugly In Middle School Tweets\n\
These Illustrations Of What Anastasia Looks Like IRL Are Breathtaking\n\
J.K. Rowling's Son Got Her A Hilariously Inappropriate Harry Potter–Themed Present For Her Birthday\n\
Justin Bieber Just Shaded The Hell Out Of Taylor Swift On Instagram\n\
17 Japanese Urban Legends That'll Scare The Shit Out Of You\n\
22 Tumblr Posts That Are Guaranteed To Make Girls Laugh\n\
Here’s How Much The Cast Of “Jersey Shore” Has Changed Since Season 1\n\
Oops, Britney Spears Seems To Have Forgotten About That Time She Met Taylor Swift\n\
Something Weird Is Going On With Hiddleswift Since The Kimye Feud\n\
16 Photos Showing The Difference Between '00s Formals And Now\n\
18 Times Food Lied Straight To Your Face\n\
Trump Responds To Father Of Fallen Soldier: “I’ve Made A Lot Of Sacrifices”\n\
11 Times Joanne The Scammer Gave Us Petty Goals\n\
Britney Spears Pranked Jimmy Kimmel And It Is Goals AF\n\
We Answered Some Period Questions And No, There Is No Band-Aid\n\
We Need To Talk About The Musical Talents Of The Kids From Stranger Things\n\
17 Wedding Night Confessions\n\
11 Times Joanne The Scammer Gave Us Petty Goals\n\
Can You Solve This Murder?\n\
This Teacher Gave His Student A Heartwarming Pep Talk We All Need To Hear\n\
Guys Try Vintage Swimsuits\n\
Do You Know Your Fast Food Fry Brands?\n\
Natural Hair Vs. The Perm\n\
People Try The “Human Flesh” Patty\n\
People Try Alcoholic Pizza\n\
We Know What Food You're Craving Right Now\n\
11 Faces Anyone Whose Been Drunk Will Recognize\n\
Women Take An Astronaut Stress Test From 1959\n\
What Is Going On In Venezuela?\n\
We Gave Moms Swimsuit Makeovers And It Was Kind Of Amazing\n\
Can You Get Through This Multitasking Test?\n\
17 Wedding Night Confessions\n\
Everyday Items Vs Acid\n\
We Tried Different In-N-Out Hacks And They Were Interesting\n\
Someone Edited Every Spell In The Harry Potter Films And It's Awesome\n\
Someone Got Shot In The Throat By A Flaming Arrow On America's Got Talent\n\
If You Spoke To Your Co-Workers Like You Speak To Your Kids\n\
We Need To Talk About The Musical Talents Of The Kids From Stranger Things\n\
Hot Mess Vs. Organized\n\
Mass Hysteria Is A Very Real, VERY Mysterious Thing\n\
Guys Try Vintage Swimsuits\n\
When You Suck At Being Latina\n\
This Teacher Gave His Student A Heartwarming Pep Talk We All Need To Hear\n\
How Well Do You Know New York Gun Control Laws?\n\
How You Know You're Nailing Your New Marriage\n\
Can You Solve This Murder?\n\
Watch Anna Faris In Air New Zealand’s Hilarious In-Flight Safety Video\n\
Oddly Satisfying Food Blending In Reverse\n\
Here is One Woman's Journey On Discovering Why Being Single Is Not The Worst\n\
Weird Things New Parents Google\n\
We Answered Some Period Questions And No, There Is No Band-Aid\n\
These People Tried Foods Made Out Of Bugs!\n\
8 Slightly Odd Things Every Cat Person Has Done\n\
People Try The Ramen Challenge\n\
When You And Your BFF Can Communicate With Just A Look\n\
You Know You're Latino When...\n\
How Getting Fired Is Like Getting Dumped\n\
The Best And Worst Parts Of Having Kids (According To A Wine Mom)\n\
These Kids Learned How To Stack Cups And Were Actually Good At It\n\
We Know Your Favorite Disney Lady Based On Your Favorite Color\n\
Can You Finish These Iconic Joey Tribbiani Quotes From “Friends”?\n\
Can You Name The NASCAR Driver By Their Number?\n\
Which All That Skit Are You?\n\
Can We Guess Your Exact Age Based On Your McDonald's Order?\n\
Can You Identify These '90s Cartoon Characters From Their Color Schemes?\n\
Do You Also Call Your Dog These Random Nicknames?\n\
Can You Guess Which Instagram-Famous Dog Has The Most Followers?\n\
Is Your Taste In Dessert The Same As Everyone Else's?\n\
The 12 Hardest Dessert “Would You Rather” Questions Ever\n\
Which Olympic Sport Matches Your Zodiac?\n\
Can You Match The Game Of Thrones Character To Their Last Words?\n\
How Well Do You Know The Lyrics To Before He Cheats By Carrie Underwood?\n\
Can You Pick Which Celebrity Man Is The Tallest?\n\
Which Of These Packets Contains The Most Crisps?\n\
Which Bachelor In Paradise Contestant Will You Leave With?\n\
Your Favorite Type Of Cake Will Determine The Sex Of Your Firstborn\n\
This Quiz Will Tell You The Exact Age You’ll Get Married\n\
How Good Are Your Disney Opinions?\n\
Is This A Baby Bird Or A Puppy?\n\
Can You Pick The KFC Item With The Most Calories?\n\
Do You Know When Your Favorite Disney Movies Were Originally Released?\n\
Can You Spot The Oldest Paul Rudd In A Sea Of Paul Rudds?\n\
How Well Do You Remember Joey Potter's Life On Dawson's Creek?\n\
Which Of These Things Actually Happened In Harry Potter And The Cursed Child?\n\
What Kind Of Dog Person Are You Based On Your Zodiac Sign?\n\
How Popular Are Your Game Of Thrones Opinions?\n\
Can You Guess The Inside-Out Pop-Tart Flavor?\n\
Can You Guess The California City By Its Skyline?\n\
Can You Guess Which Bra Is Actually From Target?\n\
What Fictional Camp Should You Go To Based On Your Zodiac Sign?\n\
The 12 Hardest Rounds Of  Which Cheesy Food Must Go You'll Ever Play\n\
Do You Know What The Hell These As Seen On TV Products Are Called?\n\
We Know The Kind Of Man You'll End Up With Based On The Coffee You Drink\n\
How Good Are You To Live With?\n\
Can You Figure Out Which One Of These Celebrities Is A Teen?\n\
What Summer Shoes Should You Get?\n\
How Many Of These CrossFit WODs Do You Actually Know\n\
Only A Studio Ghibli Expert Can Get More Than 70% In This Food Quiz\n\
I Bet You Can't Get Through This Would You Rather Quiz\n\
Are Your Physical Traits Mostly Dominant Or Recessive?\n\
We Know Your Exact Age Based On Your Taste In French Fries\n\
Can You Pick The Drink That'll Actually Wake You Up?\n\
You’re Only Allowed To Have Sex If You Can Pass This Quiz\n\
Which Pint Of Ben & Jerry's Has The Most Calories?\n\
Your Taste In Pizza Will Reveal Your Taste In Men\n\
This Visual Test Will Determine What Your Type Is\n\
Which Pokémon Go Team Is Right For You?\n\
Can You Spot The Chicken Sandwich With The Most Calories?\n\
Can We Guess Your Exact Age Based On Your McDonald's Order?\n\
Fuck Basic Cheese Toasties, These Are The Only Toasties You Need In Your Life\n\
The 12 Hardest Dessert “Would You Rather” Questions Ever\n\
23 Pictures That Will Instantly Comfort Midwesterners\n\
17 People Who Have No Idea What The Hell They're Talking About\n\
Can You Pick The Movie Theater Candy With The Most Calories?\n\
18 Sandwiches You Must Try If You Live In Los Angeles\n\
Which Cereal Would You Rather Eat?\n\
Is Your Taste In Dessert The Same As Everyone Else's?\n\
12 Common Cooking Mistakes You Might Be Making\n\
19 Tweets Anyone Addicted To Diet Coke Will Completely Relate To\n\
21 Things That Make Wine Moms Say, “Same\n\
21 Struggles You'll Only Understand If You're Broke And Trying To Be Healthy\n\
What’s Your IQ, Based Only On Your Opinions About Food?\n\
Get Ready For The Olympics Opening Ceremony With These Authentic Brazilian Chicken Croquettes\n\
28 Underrated Desserts You Must Eat In NYC\n\
We Know The Kind Of Man You'll End Up With Based On The Coffee You Drink\n\
11 Secrets Pizza Lovers Won't Tell You\n\
Can You Pick The KFC Item With The Most Calories?\n\
Can You Guess The Inside-Out Pop-Tart Flavor?\n\
The 12 Hardest Rounds Of  Which Cheesy Food Must Go You'll Ever Play\n\
22 Ways To Make Everyone Who Works At Dunkin' Donuts Hate You\n\
Starbucks Executive Promises Frustrated Baristas Consistent And Reliable Hours\n\
Make These Absolutely Adorable Chili Dog Cups With Your Kiddo\n\
25 Things People Definitely Weren't Supposed To Eat\n\
24 Things Every Hardcore Starbucks Addict Knows To Be True\n\
19 Photos You'll Understand If You're Deeply Obsessed With Ketchup\n\
21 Things You Can Actually Eat On A Plane\n\
18 Impossible Food Choices That Will Make Your Mouth Water\n\
Here's How To Watch The Olympics If You Don't Own A TV\n\
This Sponge Bed Might Actually Make You Want To Wash Your Dishes\n\
Do You Know What The Hell These As Seen On TV Products Are Called?\n\
This Website Shows You Hundreds Of Things You Can Ask Siri\n\
21 Awesome Products From Amazon To Put On Your Wish List\n\
23 Things That Will Make You Feel Like An Adult\n\
Instagram's New Feature Is Basically Snapchat But Here’s How To Use It Anyway\n\
Can You Make It Through This Post Without Buying A Bizarre Kitchen Gadget?\n\
12 Mobile Games That Will Calm You The Hell Down\n\
Get Organized With The BuzzFeed DIY Newsletter\n\
21 Amazon Echo Hacks You Should Definitely Know About\n\
Here’s What People Are Buying On Amazon Right Now\n\
5 Incredibly Clever DIYs That You'll Actually Want To Try\n\
27 Products That Will Trick People Into Thinking You're A Superhero\n\
7 Ridiculously Easy Tricks That Will Make You So Much More Organized\n\
Can You Get Through This Post Without Spending $50\n\
31 Insane Sales To Shop This Weekend\n\
21 Instagram Cleaning Hacks That Are Borderline Genius\n\
42 Brilliant Ideas To Make Your Home Really Freaking Organized\n\
21 Secrets Your Kindle Really Wants You To Know\n\
21 Awesome Products From Amazon To Put On Your Wish List\n\
5 Insanely Clever DIYs That You'll Actually Want To Try\n\
Here’s What People Are Buying On Amazon Right Now\n\
13 Things That'll Help You Take Better Photos With Your Phone\n\
Can You Get Through This Post Without Spending $50?\n\
26 Insane Sales To Shop This Weekend\n\
Here's How You Can Instantly Improve Your Office\n\
Here’s What Gadgets People Are Buying On Amazon Right Now\n\
Hack Your Whole Life With The BuzzFeed DIY Newsletter!\n\
A Stray Dog Ran With A Marathoner For 20 Miles And Now They Have An Incredible Bond\n\
Thousands Of Angry Bees Have Made This Family Afraid To Go Outside\n\
This Couple's Dog Got In Their Maternity Picture And The Internet Is Obsessed With It\n\
17 Tweets Every Cat Person Needs To See\n\
This Fashion Designer Couple Have Been Adopting All The Puppies And Kittens Nobody Cares About\n\
Can You Guess Which Instagram-Famous Dog Has The Most Followers?\n\
This Dog Was SO HAPPY To See Her Family After Surviving 10 Days In The Woods\n\
There's A New Nat Geo Nature Show On YouTube And It's Friggin' Awesome\n\
21 Small Animals That Deserve More Internet Love\n\
Do You Also Call Your Dog These Random Nicknames?\n\
Literally Just A Bunch Of Ridiculously Cute Akita Puppies\n\
19 Of The Prettiest Ladies On The Planet\n\
19 Dogs Who Are Like “So You Gonna Finish All That, Or…”\n\
This Patient Brit Is The World’s Most Charming Animal Rescuer\n\
OMFG, This Teen Makes Tiny Pancakes For Her Pet Chickens\n\
Is This A Baby Bird Or A Puppy?\n\
15 Animals That Will Make You Say, Not Today, Satan”\n\
This Bear Was Filmed Taking A Ride On Top Of A Garbage Truck\n\
This Teen Fed A Deer Some Crackers And Now They’re Best Friends\n\
This Confused Baby Puffin Thought An Ice Cream Van Was Its Burrow\n\
Take Just 13 Seconds From Your Day To Watch This Adorable Puppy Enjoying A Pupsicle\n\
Netflix Held A Photo Shoot Of Their Dog Stars And It’s Too Much\n\
This Gigantic Whale's Gigantic Mouth Got REALLY Uncomfortably Close To A Boat\n\
A Man Captured His Mail Carrier Stopping To Play With Their Dog Every Day\n\
Who Has More Instagram Followers: This Dog Or This Celebrity?\n\
We'll Tell You Which Terrifying Sea Creature You Are\n\
21 Puppies So Cute You Will Literally Gasp And Then Probably Cry\n\
Look At This Dog Jump With Joy After Getting Prosthetic Legs\n\
Some Puppies Poked Their Heads Through A Wall And Made A Lot Of People Happy\n\
Another Round, Episode 64: Live In Philly\n\
Another Round, Episode 63: Heben's Husband (with Jaime Camil)\n\
Another Round, Episode 62: Put Your Mask On First\n\
Another Round, Episode 61: The Greatest\n\
Another Round, Episode 60: Down With Sporks\n\
Another Round, Episode 59: May She Forever Reign\n\
Another Round, Ep. 58: The Job Of Pettiness\n\
I Was A Thirsty Male Feminist For A Day And It Was Exhausting\n\
16 Books We Fell In Love With As Young Black Girls\n\
What Happens When You Try To Follow The Rules™ In Real Life?\n\
F@*K, Marry, Kill: Woke Men, Republican Candidates, And White Baes\n\
Melissa Harris-Perry On Her Split With MSNBC: I Am Not A Civil Rights Case\n\
14 Things You Never Knew About Hamilton's Lin-Manuel Miranda\n\
This Is What Lin-Manuel Miranda Said To Kanye When He Saw Hamilton\n\
Another Round, Episode 44: Mommy's Side Piece\n\
Another Round, Episode 43: A Gumbo Of Afrofuturism\n\
Here's How W. Kamau Bell Talks About Race With His Kids\n\
Someone Appears To Have Stolen This Woman's Photos And Is Using Them To Troll People\n\
Another Round, Episode 41: To Be Young, Gifted, And Black\n\
Listen To BuzzFeed's New Podcast The Tell Show!\n\
7 Reasons To Listen To BuzzFeed's New Podcast The Tell Show\n\
Another Round, Episode 40: Blacker History Month\n\
The Mystery Of Michael Jackson And Sonic The Hedgehog\n\
Another Round, Episode 39: The Betrayer Of The Patriarchy\n\
Another Round Episode 27: No New Friends, My Squirrel Dude\n\
Listen To BuzzFeed's Interview With Obama's Senior Advisor\n\
How A Gay Porn Star And Rapper Became Vine Famous And Then Liveblogged His Arrest On Facebook\n\
Another Round, Episode 36: U Mad?\n\
Everyone Is Convinced The Brother And Sister From This Folgers Ad Are Hooking Up\n\
How An 1891 Mass Lynching Tried To Make America Great Again\n\
How Sulcata Tortoises Became America's Most Adorable Mistake\n\
We Found These Qaddafi Henchmen Wanted For Stealing Millions Living In Britain\n\
Where Did Drake’s “Jamaican” Accent Come From?\n\
How Donald Trump Broke The Conservative Movement (And My Heart)\n\
The Biggest Stories You Can't Miss This Week\n\
“That’s How We Survive: When Police Brutality Turns Mothers Into Activists\n\
How Tessa Thompson Became A Modern Marvel\n\
Meet The Workers Who Sewed Donald Trump Clothing For A Few Dollars A Day\n\
Stop Conflating Activists With Assassins, Black Leaders Tell Police\n\
Inside The Fraternity Of Haters And Losers Who Drove Donald Trump To The GOP Nomination\n\
7 Things You Need To Know About Ghostbusters\n\
The Most Marvelous Stories You Can't Miss This Week\n\
This Is What It Was Like Inside CNN Turk The Night Of The Attempted Coup\n\
The Worst Part Of Schizophrenia Isn’t What You Think It Is\n\
The Playlist Professionals At Apple, Spotify, And Google\n\
Documents Raise Disturbing Questions About Detainee Abuse Under Obama\n\
How The World's Greatest Gymnast Became Inevitable\n\
Here's Why Afghan Refugees Are Finding Europe So Unwelcoming\n\
Meet North Korea's Number One Fan In The United States\n\
How Many Black People Can You Mourn In One Week?\n\
Who Benefits From The Tiny House Revolution?\n\
The Most Captivating Stories You Can't Miss This Week\n\
Revealed: The Lavish Spending That Brought Down Britain's Only LGBT Domestic Abuse Charity\n\
This Student Says Her University And A Prosecutor Mishandled Her Sexual Assault Report\n\
This Is How Queer People In Orlando Are Mourning After The Pulse Shooting\n\
He Thinks He’s Untouchable”: Sexual Harassment Case Exposes Renowned Ebola Scientist\n\
The Most Insightful Stories You Can't Miss This Week\n\
Blowing Up The Glass Ceiling: The Untold Story Of The Military's First Female Bomb Technician\n\
A Beating At Bellevue, Then Months Of Silence\n\
Istanbul Airport Bombing Shows Turkey Has Become A Battlefield For Middle East’s Wars\n\
What Do You Do After Surviving Your Own Lynching?\n\
How Much Uber Drivers Actually Make Per Hour\n\
How “Star Trek” Created, Lost, And Won Back Pop Culture’s Most Devoted Fandom\n\
The Most Shocking Stories You Can't Miss This Week\n\
The Most Explosive Stories You Can't Miss This Week\n\
Tories’ Biggest Donor Lycamobile Raided In Criminal Money-Laundering Probe\n\
The Gay Bathhouse Fire Of 1977\n\
Meet The Matriarch Of The Arm-Everyone Movement\n\
Olympics Updates: Opening Ceremonies Kick Off Friday\n\
Watch The Video Of Deadly Encounter Between Chicago Police And Unarmed Teenager\n\
FBI Spy Planes Filmed Protests In Baltimore, Raising Privacy Concerns\n\
Northern Virginia Mayor Arrested For Allegedly Distributing Meth In Exchange For Sex With Men\n\
FDA Approves Mutant Mosquito Experiment In Florida Keys\n\
19 Times Tumblr Understood The Struggle Of Being A Writer\n\
Poem: Aubade With Sage And Lemon By Tarfia Faizullah\n\
Um, Eddie Redmayne’s Favorite “Harry Potter” Book And Movie Choices Are Pretty Surprising\n\
5 Great Books To Read In August\n\
Poll: So How Are You Really Feeling About Harry Potter And The Cursed Child?\n\
Which Of These Things Actually Happened In Harry Potter And The Cursed Child?\n\
J.K. Rowling Had The Perfect Response To Scientists Questioning The Purpose Of The Female Orgasm\n\
Here's What Happens To Your Body When You Hike The Appalachian Trail\n\
23 Things Anyone Who's Slightly Obsessed With Stationery Has Secretly Done\n\
What The Hell Is A Panju? And Other Questions I, A Brown Potterhead, Have For J.K. Rowling\n\
21 Book Pins For Bookworms\n\
27 Of The Funniest Harry Potter And The Cursed Child Tumblr Posts\n\
18 Cursed Child Moments Which Honestly Make No Sense\n\
27 Lock Screen Photos For Every Harry Potter Fan\n\
24 Beautiful Sketches From The Little Prince Movie\n\
People Can't Believe Moaning Myrtle's Real Name Is Myrtle Elizabeth Warren, Like The Senator\n\
Hagrid's Probably Psyched About This Fantastic Beasts Sequel\n\
Only A True Potterhead Will Get 20/20 On This Books And Movies Quiz\n\
27 Incredible Photos Of Harry Potter And The Cursed Child Release Parties\n\
A Restaurant Inspired By The Twits Is Coming To London\n\
How Philadelphia Destroyed The Greatest Skate Spot Ever Made\n\
Someone Edited Every Spell In The Harry Potter Films And It's Awesome\n\
I Rewatched Game Of Thrones Season 1, Episode 5 And Had Some Thoughts\n\
96 Thoughts I Had While Reading Harry Potter And The Cursed Child\n\
Piecing Together My Abusive Ex-Boyfriend's Final Summer\n\
Can You Spot The Actor Who Plays George Weasley?\n\
17 Corny Grammar Jokes That Are Really Great And Really Corny\n\
This Game Of MASH Will Determine What Your Game Of Thrones Life Would Be Like\n\
This Is The Book Oprah Wants You To Read Next\n\
One Florida University Employs 350 Telemarketers, Lawsuit Claims\n\
The Department Of Labor Is Taking On Big Chicken\n\
Starbucks Executive Promises Frustrated Baristas Consistent And Reliable Hours\n\
These Super Sketchy Zika Products Are Facing Government Scrutiny\n\
9 Bullshit Labels You'll Often See On Food\n\
Comcast Accused Of Pattern Of Deceptive Practices In $100-Million Lawsuit\n\
Zara Workers Unionize For First Time In US\n\
Struggling For-Profit College Will Cut Enrollments In Half\n\
Amazon Profit Rises 831%, Hits Record High For Third Straight Quarter\n\
Debt Collectors Could Be Restrained By New Rules\n\
Something's Gone Wrong At Starbucks, According To Baristas\n\
Apple's Business Is Declining And Wildly Profitable\n\
Despite Difficult Earnings Report, Twitter Sees Big Money In Premium Live Streams\n\
The Democratic Party Wants To Change How Tipping Works\n\
McDonald's Looks For New Ideas As Peak Breakfast Approaches\n\
Iconic FAO Schwarz Toy Store Will Become Giant Under Armour Flagship\n\
Tens Of Thousands Of People Can Cancel Their Student Loans, But Don't Know It\n\
Yelp's Warning: This Dentist Might Sue You For Posting A Negative Review\n\
Zenefits Settles With Tennessee Regulators Over Insurance Violations\n\
Starbucks Is Now Letting Baristas Wear Fedoras\n\
Nintendo Shares Crash As It Calls Pokémon's Effect On Business Limited\n\
Verizon Will Buy Yahoo For $4.8 Billion\n\
The Burrito Crisis Continues At Chipotle\n\
Confidential Document Shows How Peter Thiel Really Feels About Palantir\n\
eBay Is Raking In The Hamilton Dollars\n\
Starbucks' Surprise Pay Raise Comes With A Catch\n\
Sometimes Saks Fifth Avenue Is Cheaper Than The Outlet\n\
Nintendo's Value Up $20 Billion Since Pokémon — Now Worth More Than Sony\n\
The Great American Netflix Boom Is Slowing Down\n\
Poll: So How Are You Really Feeling About Harry Potter And The Cursed Child?\n\
8 Popular TV Shows Reviewed By Donald Trump\n\
Britney Spears Discovering Ryan Seacrest Isn't Gay Is All Of Us\n\
30 Things You Never Knew About Andy Cohen\n\
A Stray Dog Ran With A Marathoner For 20 Miles And Now They Have An Incredible Bond\n\
We Know Your Favorite Disney Lady Based On Your Favorite Color\n\
23 Pictures That Will Instantly Comfort Midwesterners\n\
19 Pizza Delivery Fails That'll Make You Say Enough\n\
22 Times Debbie Thornberry Made You Say Me As A Teenager\n\
The Fan Art For Stranger Things Is Absolutely Stunning\n\
19 Gorgeous Items Every Spirited Away Fan Needs In Their Life\n\
15 Perfect Products For Anyone Who Takes Their Lunch To Work\n\
Olympics Updates: Opening Ceremonies Kick Off Friday\n\
37 Thoughts Everyone Had While Watching Stranger Things\n\
Which All That Skit Are You?\n\
Can You Guess Which Instagram-Famous Dog Has The Most Followers?\n\
There's A New Nat Geo Nature Show On YouTube And It's Friggin' Awesome\n\
Can You Name The NASCAR Driver By Their Number?\n\
Have You Ever Seen The Northern Lights?\n\
Can You Identify These '90s Cartoon Characters From Their Color Schemes?\n\
21 Small Animals That Deserve More Internet Love\n\
What's Your Favorite Drake Meme?\n\
18 Reminders That Your Summer Vacation Could Be A Lot Worse\n\
Do You Also Call Your Dog These Random Nicknames?\n\
Literally Just A Bunch Of Ridiculously Cute Akita Puppies\n\
How Well Do You Know The Lyrics To Before He Cheats By Carrie Underwood?\n\
Fuck, Marry, Kill: Olympic Men Edition\n\
Reminder That Nathan Adrian Is Actually The Hottest Olympic Swimmer\n\
People Can't Get Enough Of This Facebook Post About A Trans Person's Positive TSA Experience\n\
19 Of The Prettiest Ladies On The Planet\n\
Which Member Of The US Women's Gymnastics Team Should Be Your Bff?\n\
19 Dogs Who Are Like “So You Gonna Finish All That, Or…”\n\
What's The Best Advice You've Ever Gotten From A Book?\n\
19 Times Kate McKinnon Really Ruled At Existing As A Human\n\
13 Celebrity #TBT Photos You May Have Missed This Week\n\
The 24 Greatest Facebook Burns In All Of Human History\n\
This Is, Hands Down, The Most Awful Kiss You'll Ever Witness In Your Damn Life\n\
23 Arthur Memes That Just Went Too Far\n\
15 Refreshing Iced Teas Guaranteed To Quench Your Thirst\n\
In Case You Haven't Noticed, 2016 Is Basically The '90s\n\
Can We Guess Which Disney Channel Era You Belong To?\n\
Which Hogwarts Professor Would Definitely Hate You?\n\
Can You Guess The Disney Movie By These Emojis?\n\
Which Harry Potter Home Should You Live In?\n\
Which Ryan Reynolds Character Matches Your Favorite Color?\n\
Britney Spears Discovering Ryan Seacrest Isn't Gay Is All Of Us\n\
30 Things You Never Knew About Andy Cohen\n\
Fuck, Marry, Kill: Olympic Men Edition\n\
Reminder That Nathan Adrian Is Actually The Hottest Olympic Swimmer\n\
19 Times Kate McKinnon Really Ruled At Existing As A Human\n\
Kylie Jenner Snapchatted Her Mom's Closet And Hold Up, Lemme Get A Birkin\n\
Try Not To Cry As You Read Michelle Obama's Post For The President's Birthday\n\
This “Friends” News Will Make You Even Sadder For David The Scientist\n\
JoJo And Jordan Are Already Snapchatting Each Other Like Crazy\n\
Reese Witherspoon's Little Hiss-Laugh Is Completely Mesmerizing\n\
12 Photos That Prove Actor Harry Styles Is The Hottest Harry Styles\n\
Mark Ruffalo's Still The Cutest Dad On Instagram\n\
It Turns Out There IS Something Serena Williams Can't Do\n\
Riley Curry Dancing To Drake's One Dance Will Make Your Day\n\
Don't Worry, Carmelo Anthony Actually Does Like Vanessa Carlton's A Thousand Miles\n\
Can You Spot The Oldest Paul Rudd In A Sea Of Paul Rudds?\n\
25 Times Kim Kardashian Was Almost Too Kim Kardashian\n\
Jason Momoa Surprising Henry Cavill With Some Bear Hugs Is Pretty Damn Delightful\n\
Can You Figure Out Which One Of These Celebrities Is A Teen?\n\
Michael Phelps And His Fiancé Set The Relationship Bar Seriously High\n\
Margot Robbie And Cara Delevingne Just Formed A Brand New Squad\n\
15 People You Might Have Forgotten Were On Dancing With The Stars\n\
J.K. Rowling Had The Perfect Response To Scientists Questioning The Purpose Of The Female Orgasm\n\
Anne Hathaway Shared The Perfect Message To Celebrate 15 Years Of Princess Diaries\n\
Everyone Is Losing It Over Jared Leto's Outfit\n\
Taylor Called Karlie At Sunset On Her Birthday But It's Actually Even Cuter Than You First Thought\n\
Britney Spears Pranked Jimmy Kimmel And It Is Goals AF\n\
Model Ashley Graham Wrote The Most Badass Essay About Body-Shaming\n\
Looks Like Chad From The Bachelorette And Spencer Pratt Might Become Friends\n\
Can You Finish These Iconic Joey Tribbiani Quotes From “Friends”?\n\
16 TV Characters That Were Cooler Than Their Shows' Protagonists\n\
Can You Match The Game Of Thrones Character To Their Last Words?\n\
JoJo And Jordan Are Already Snapchatting Each Other Like Crazy\n\
This “Friends” News Will Make You Even Sadder For David The Scientist\n\
Matt Damon Starring In The Great Wall Is Pretty Neat, According To Chinese People\n\
How Well Do You Remember Joey Potter's Life On Dawson's Creek?\n\
Let's Talk About Steve's Hair In Stranger Things Because Why Not\n\
How Good Are Your Disney Opinions?\n\
Jason Momoa Surprising Henry Cavill With Some Bear Hugs Is Pretty Damn Delightful\n\
Anne Hathaway Shared The Perfect Message To Celebrate 15 Years Of Princess Diaries\n\
Do You Know When Your Favorite Disney Movies Were Originally Released?\n\
Looks Like Chad From The Bachelorette And Spencer Pratt Might Become Friends\n\
Only A True Potterhead Will Get 20/20 On This Books And Movies Quiz\n\
There's A TV Show Featuring Grannies Getting High Because It's 2016\n\
24 Beautiful Sketches From The Little Prince Movie\n\
Which Of The 2016 Ghostbusters Are You?\n\
Would You Survive In Stranger Things?\n\
Hagrid's Probably Psyched About This Fantastic Beasts Sequel\n\
Here's Why Lucas From Stranger Things Is The Friend Every Group Needs\n\
How Well Do You Remember Newsies?\n\
Someone Edited Every Spell In The Harry Potter Films And It's Awesome\n\
How Well Do You Remember Chandler Bing's Lines On Friends?\n\
An iCarly Cast Member Just Approved This Amazing Fan Theory\n\
Um, Does This Photo Mean Rory Or Lorelai Is Pregnant?\n\
Here's What Modern Movies Would Look Like As VHS Tapes\n\
The Actor Who Plays Chief Hopper Is Haunted By Barb's Fate On Stranger Things\n\
Can We Guess Your Exact Age Based On Which Pixar Movies You Love?\n\
25 Hilarious Moments That Every Fan Of “The Office” Remembers\n\
Tell Us Your Coffee Order And We'll Tell You Which Gilmore Girls Character You Are\n\
This Bad-Ass Woman Is Cosplaying Her Way Through Cancer Treatment\n\
How One Of The Biggest Fall Shows Is Breaking Down Plus-Size Stereotypes\n\
You Probably Missed This Cute Detail In Lilo & Stitch\n\
The Teacher, Mr. Clarke, Is The True Unsung Hero Of Stranger Things\n\
18 Times Dany Targaryen Lit Your Soul On Fire\n\
18 Little Details That Will Make You Love Stranger Things Even More\n\
How Suicide Squad Uses And Abuses Harley Quinn\n\
Literally Just 21 Perfect Tweets About Last Night's Bachelorette\n\
Jimmy Fallon Was Shook As Hell After Receiving A Gift From The Joker\n\
How “Star Trek” Created, Lost, And Won Back Pop Culture’s Most Devoted Fandom\n\
This Award-Winning Short Will Make You Cry And Laugh And Cry Again\n\
How One Of The Biggest Fall Shows Is Breaking Down Plus-Size Stereotypes\n\
How Suicide Squad Uses And Abuses Harley Quinn\n\
Charlie Puth's We Don't Talk Anymore Video Might Make You Text Your Ex Or Something\n\
30 Things You Never Knew About Andy Cohen\n\
Anna Kendrick Is The Queen Of Ghosting\n\
Amber Rose's Badass Advice Is All You'll Ever Need\n\
25 Songs You Haven't Thought About In 5 Years\n\
21 Times Rihanna Was The Fucking Best Person On Twitter\n\
We Can't Let One More Second Go By Without Talking About This Picture Of Dolly Parton\n\
Someone Sat Front And Center At A Beyoncé Concert And Played Pokémon Go\n\
Mark Ruffalo's Still The Cutest Dad On Instagram\n\
Let's Talk About Steve's Hair In Stranger Things Because Why Not\n\
Which Of These Things Actually Happened In Harry Potter And The Cursed Child?\n\
Only A Studio Ghibli Expert Can Get More Than 70% In This Food Quiz\n\
27 Of The Funniest Harry Potter And The Cursed Child Tumblr Posts\n\
18 Cursed Child Moments Which Honestly Make No Sense\n\
Would You Survive In Stranger Things?\n\
People Can't Believe Moaning Myrtle's Real Name Is Myrtle Elizabeth Warren, Like The Senator\n\
Hagrid's Probably Psyched About This Fantastic Beasts Sequel\n\
Someone Made Metallica Sing The Pokémon Theme Because Of Course They Did\n\
Which Of The 2016 Ghostbusters Are You?\n\
Only A True Potterhead Will Get 20/20 On This Books And Movies Quiz\n\
Text Your Parents And Ask Them Name A Pokémon\n\
21 Book Pins For Bookworms\n\
Here's What Modern Movies Would Look Like As VHS Tapes\n\
12 Mobile Games That Will Calm You The Hell Down\n\
This Artist Reimagined Iconic Nintendo Characters As Beautiful Mayan Paintings\n\
This Bad-Ass Woman Is Cosplaying Her Way Through Cancer Treatment\n\
29 Ways Pokémon Go Has Changed Lives\n\
96 Thoughts I Had While Reading Harry Potter And The Cursed Child\n\
Mr Clarke Is The Most Underrated Character In Stranger Things\n\
18 Times Dany Targaryen Lit Your Soul On Fire\n\
Literally Just 24 Really Funny Tumblr Posts About Pokémon\n\
17 Reasons Holtzmann From Ghostbusters Is The Hero We All Need\n\
27 Pictures Of The Stranger Things Cast Hanging Out And Being The Best Of Friends IRL\n\
The Director Of The New Thor Movie Made Hiring Aboriginal People A Priority\n\
Everyone's Saying The Same Thing About Cursed Child Being Fanfic\n\
We Need To Talk About The Trolley Witch In Harry Potter And The Cursed Child\n\
This Town Successfully Had PokéStops Closed After Thousands Of Pokémon Go Players Swarmed A Park\n\
23 Things That Sound Fake To People With ADHD\n\
18 Things People With Autoimmune Diseases Want You To Know\n\
21 Struggles You'll Only Understand If You're Broke And Trying To Be Healthy\n\
How Many Of These CrossFit WODs Do You Actually Know\n\
Model Ashley Graham Wrote The Most Badass Essay About Body-Shaming\n\
What You Should Know About Zika If You're Going To The Olympics\n\
25 Things People Definitely Weren't Supposed To Eat\n\
15 Ways To Make Your Brazilian Wax Suck Less\n\
These Super Sketchy Zika Products Are Facing Government Scrutiny\n\
Here's What Happens To Your Body When You Hike The Appalachian Trail\n\
This Bad-Ass Woman Is Cosplaying Her Way Through Cancer Treatment\n\
9 Bullshit Labels You'll Often See On Food\n\
Government Should Help Pay For Birth Control Because Of Zika Threat, CDC Says\n\
How Much Do You Love Trendy Health Food?\n\
Holy Shit Guys, Pokémon Go Is So Good For Your Mental Health\n\
This Woman's Doctor Told Her She Would Be Committing A Crime If She Had An Abortion\n\
7 Easy And Healthy Breakfasts To Try This Week\n\
8 Health Risks To Actually Worry About If You’re Going To The Olympics\n\
Are Your Physical Traits Mostly Dominant Or Recessive?\n\
High Court Rules That The HIV Prevention Drug Can Be Made Available On The NHS\n\
Here's What You Need To Know About The Five-Second Rule\n\
What Kind Of Fingerprint Do You Have?\n\
Why Track-And-Field Stars Don’t Set World Records Like They Used To (But Swimmers Do)\n\
10 Things Anxious People Do So Well They Deserve A Freaking Medal\n\
These People Like To Chill At 200 Degrees Below Zero\n\
10 Foods You Should Eat More Of If Your Memory Sucks\n\
What Do Queer People Wish They Knew About Sex Before They Had It?\n\
Scientists Are Fighting Over Whether Egg Donors Should Be Paid\n\
10 Facts About Blacking Out That Actually Make So Much Sense\n\
17 People Who Are Mad They Trusted Frank Ocean, Again\n\
Police Raid Uganda Pride During Transgender Pageant\n\
People Can't Get Enough Of This Facebook Post About A Trans Person's Positive TSA Experience\n\
Federal Court Dismisses Alabama Chief Justice's Civil Rights Lawsuit\n\
Supreme Court Halts Order Allowing Transgender Student To Use Restroom Of His Gender Identity\n\
Will Frank Ocean's Album Actually Come Out Friday?\n\
Opponents Have Given Up Arguing Against Same-Sex Marriage, Says Lead Campaigner\n\
These Stunning Transgender Dancers Were Draped In Saris By Indian Designers\n\
Trump Spokesperson In 2012: Gay Is Not Normal, Accept That\n\
Here's The Conservative Case For Marriage Equality\n\
Joe Biden Officiates Same-Sex Wedding For Two White House Staffers\n\
High Court Rules That The HIV Prevention Drug Can Be Made Available On The NHS\n\
17 Reasons Holtzmann From Ghostbusters Is The Hero We All Need\n\
Federal Judge Refuses To Allow Mississippi To Enforce Anti-LGBT Law During Appeal\n\
After A Cancellation, Cleveland's LGBT Advocates Are Taking Pride Into Their Own Hands\n\
Judge Appears Skeptical Of Need For North Carolina's Anti-Transgender Law\n\
Just Some Dapper AF Women You Should Be Following On Instagram\n\
What Do Queer People Wish They Knew About Sex Before They Had It?\n\
A Bar Told This Trans Woman She Could Only Use The Men's Bathroom\n\
These People Took Part In An HIV Prevention Pill Study But Now The NHS Says They Can't Have It\n\
Here's What You Need To Know About The Male G-Spot\n\
Federal Appeals Court Rejects Protections For Gay People Under Existing Civil Rights Law\n\
Karl Stefanovic Just Threw Around Anti-Trans Slurs Like It's No Big Deal\n\
Justice Department, Allies Back Transgender Protections In Federal Court In Texas\n\
Which Summer Butt Is Your Soulmate?\n\
The Letter Q Was Kept Off Democratic Party's LGBT Platform\n\
Kristen Stewart Opens Up About Her Girlfriend In Elle UK\n\
12 States Will Support Obama’s Transgender Policies In Court, Bucking Texas And Others\n\
Just A Bunch Of Tweets About Preferred Pronouns That Are Way Too Real\n\
25 Insane Sales To Shop This Weekend\n\
Here's How To Watch The Olympics If You Don't Own A TV\n\
23 Things That Sound Fake To People With ADHD\n\
Can We Guess Your Exact Age Based On Your McDonald's Order?\n\
17 People Who Have No Idea What The Hell They're Talking About\n\
Can You Pick The Movie Theater Candy With The Most Calories?\n\
18 Sandwiches You Must Try If You Live In Los Angeles\n\
Which Cereal Would You Rather Eat?\n\
18 Things People With Autoimmune Diseases Want You To Know\n\
Is Your Taste In Dessert The Same As Everyone Else's?\n\
23 Things You Should Be Buying From The Men's Section\n\
This Sponge Bed Might Actually Make You Want To Wash Your Dishes\n\
19 Tweets Anyone Addicted To Diet Coke Will Completely Relate To\n\
A Toddler Melted Down On Live TV And It Was A Hilarious Trainwreck\n\
If These Penis And Vagina Highlighters Don’t Give You A Beauty Boner, Nothing Will\n\
This 17-Year-Old Girl Gave Her Dad A Makeover And He Looked So Freakin' Fierce\n\
This Quiz Will Tell You The Exact Age You’ll Get Married\n\
Your Favorite Type Of Cake Will Determine The Sex Of Your Firstborn\n\
21 Struggles You'll Only Understand If You're Broke And Trying To Be Healthy\n\
Can You Pick The KFC Item With The Most Calories?\n\
17 Fashion And Beauty Documentaries To Binge-Watch Online\n\
15 Hilariously Awkward Back-To-School Fails\n\
Can You Guess The Inside-Out Pop-Tart Flavor?\n\
The 12 Hardest Rounds Of  Which Cheesy Food Must Go You'll Ever Play\n\
Do You Know What The Hell These As Seen On TV Products Are Called?\n\
22 Ways To Make Everyone Who Works At Dunkin' Donuts Hate You\n\
What Summer Shoes Should You Get?\n\
How Many Of These CrossFit WODs Do You Actually Know\n\
21 Things That Make Wine Moms Say, “Same\n\
17 Gorgeous Natural Hairstyles That Are Easy To Do On Short Hair\n\
We Gave Moms Swimsuit Makeovers And It Was Kind Of Amazing\n\
What You Should Know About Zika If You're Going To The Olympics\n\
24 Things Every Hardcore Starbucks Addict Knows To Be True\n\
This Website Shows You Hundreds Of Things You Can Ask Siri\n\
Which Red Lipstick Is Right For You?\n\
19 Photos You'll Understand If You're Deeply Obsessed With Ketchup\n\
28 Underrated Desserts You Must Eat In NYC\n\
21 Things You Can Actually Eat On A Plane\n\
18 Impossible Food Choices That Will Make Your Mouth Water\n\
17 People Who Are Mad They Trusted Frank Ocean, Again\n\
12 Photos That Prove Actor Harry Styles Is The Hottest Harry Styles\n\
R&B Needs The Old Usher Back\n\
Someone Made Metallica Sing The Pokémon Theme Because Of Course They Did\n\
Poll: Which Taylor Swift Song Is The Most Underrated?\n\
21 Times Rihanna Was The Fucking Best Person On Twitter\n\
Taylor Swift Running Sideways To Her Car Is The Weirdest And Funniest Thing\n\
24 Bangers From 2009 You Definitely Danced To At Your School Formal\n\
This Is What Matisyahu Looks Like Now\n\
Will Frank Ocean's Album Actually Come Out Friday?\n\
Can We Guess Your Exact Age Based On Your Taste In Hip-Hop\n\
This Kanye West, Drake Collab Album Might Really Be Happening\n\
How Normal Is Your Taste In Pop Music?\n\
Can You Identify The 2006 Hit Song By Its Lyrics?\n\
You Guys, Remember When The Spice Girls Performed At The 2012 Olympics?\n\
We Know How You Like Sex Based Off Your Favorite Britney Single\n\
Miley And Liam Singing In The Car Together Is So Damn Cute\n\
The Hair Evolution Of The Band Perry\n\
Scary Spice's Abs Are So Perfect They Could End Sporty Spice's Career\n\
Which Disney Song Are You Based On Your Birth Month?\n\
Kesha Drops Sex Assault Case Against Dr. Luke To Focus On Music Fight\n\
Charlie Puth's We Don't Talk Anymore Video Might Make You Text Your Ex Or Something\n\
Ariana Grande Cut A Hole In A Hat For Her Ponytail And It's Honestly Very Impressive\n\
A Reminder That Keke Palmer And Lucy Hale Competed Together On American Juniors\n\
Drake And Rihanna Performed Too Good Together For The First Time And It Was Glorious\n\
The LAPD Is Reportedly Investigating If Beyoncé Fans Hacked Rachel Roy's Email Account\n\
People Are Sick And Tired Of Frank Ocean's Lies\n\
29 Songs That Will Take You Back To Your 2001 Formal\n\
The Internet Continues To Be Obsessed With This Tabla Guy; This Time It's  Sia's Cheap Thrills\n\
A Toddler Melted Down On Live TV And It Was A Hilarious Trainwreck\n\
What A Black Woman Wishes Her Adoptive White Parents Knew\n\
This 17-Year-Old Girl Gave Her Dad A Makeover And He Looked So Freakin' Fierce\n\
Try Not To Cry As You Read Michelle Obama's Post For The President's Birthday\n\
Your Favorite Type Of Cake Will Determine The Sex Of Your Firstborn\n\
15 Hilariously Awkward Back-To-School Fails\n\
This Couple's Dog Got In Their Maternity Picture And The Internet Is Obsessed With It\n\
21 Things That Make Wine Moms Say, “Same\n\
We Gave Moms Swimsuit Makeovers And It Was Kind Of Amazing\n\
23 Photos From The '80s You Will Feel Like You Lived\n\
19 Moments All Moms Who Are Cheap AF Will Relate To\n\
17 Times Parents Nailed It When Shopping With Kids\n\
17 Back To School Products You And Your Kids Will Love\n\
31 Insane Sales To Shop This Weekend\n\
Here's What You Need To Know About The Five-Second Rule\n\
16 Totally Mom Things You Are Always Guilty Of Doing\n\
11 Amazing Olympians On Team USA Who Are Also Parents\n\
These Kids Learned How To Stack Cups And Were Actually Good At It\n\
Horrifying Situation: This Woman Accidentally Got Sent Her Mom's Sexts\n\
29 Unusually Funny Ways Kids Thought People Got Pregnant\n\
If Toddlers Had Instagram\n\
Mila Kunis Says Her That '70s Show Character Would Make The Worst Mom Ever\n\
21 Instagram Cleaning Hacks That Are Borderline Genius\n\
This Side-By-Side Comparison Of Saint And North West Proves They're Actually Twins\n\
27 Dad Jokes That Will Make You Laugh Until You Groan\n\
Mila Kunis, Kristen Bell, And The Cast Of Bad Moms Play A Hilarious Round Of Would You Rather\n\
People Are Sharing Pics Of Their Grandmas Celebrating Hillary Clinton’s Nomination\n\
Bless This Couple's Hilariously Adorable Pregnancy Photo Shoot\n\
We Know If You're Ready To Have A Kid With Just One Question\n\
Gov. Paul LePage: I Told Trump He Needs To Be More Disciplined\n\
Harry Reid Tells Democrats To Not Get Overconfident\n\
Trump Declines To Name Women He'd Put In His Cabinet Besides Daughter Ivanka\n\
Rudy Giuliani: Trump Shouldn't Attack Ryan, McCain, Or The Khans\n\
Appeals Court Denies North Carolina Request To Put Voting Rights Decision On Hold\n\
Trump Tells Story About His Own Running Mate Asking Permission To Endorse Paul Ryan\n\
Koch Group Goes Back On Air In Wisconsin, Citing Polling Changes\n\
GOP Congressman: Trump Has “Thoughts In His Head That Should Just Stay There”\n\
Federal Court Dismisses Alabama Chief Justice's Civil Rights Lawsuit\n\
An 11-Year-Old Kid Just Asked Mike Pence If His Role Was To Soften Trump's Words\n\
You Won't Believe This But Tim Kaine Doesn't Like Talking About Himself\n\
Trump: Reported Intervention Just A Lie Put Out By The Media\n\
Scott Walker: Frustrating That Trump Attacking Khan Family Instead Of Clinton\n\
Ben Carson: Of Course It Would Be Better If GOP Nominee Was A Role Model For Kids\n\
The Trump Hispanic Engagement Effort Is Sputtering\n\
Trump Isn't Going To Change And Republicans Know That\n\
Missouri's Public Defender Orders The Governor To Legally Represent A Criminal Defendant\n\
Get Ready For The Trump Campaign’s Black Outreach Effort\n\
Tim Kaine Voted To Ban Semi-Nude Lap-Dancing As Mayor Of Richmond\n\
Republican Donors Panic As Trump Melts Down\n\
Supreme Court Halts Order Allowing Transgender Student To Use Restroom Of His Gender Identity\n\
Pat Toomey: US Payment To Iran Puts A Price On All Americans\n\
Trump Super PAC Head: Trump Watches Too Much TV, Is Easily Distracted\n\
Close Ally Newt Gingrich Says Trump Is Being Self-Destructive\n\
Mike Pence Breaks Away From Trump And Endorses Paul Ryan\n\
Obama Commutes Sentences Of More Than 200 People Serving Federal Sentences\n\
Homeland Security Chief Concerned Hackers Could Infiltrate Voting System\n\
Trump Surrogate Jan Brewer: Trump Should Tone It Down, Lets Himself Get Baited\n\
Trump Defends His Rigged Election Claim: I Just Hear Things, And I Just Feel It\n\
Who Is Your Lord Of The Rings Alter Ego?\n\
Today's BuzzFeed Crossword, 7/19\n\
Can You Solve The Toughest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 7/14\n\
Today's BuzzFeed Crossword, 7/13\n\
Today's BuzzFeed Crossword, 7/12\n\
Can You Finish The Hardest BuzzFeed Crossword Of The Week?\n\
Can You Figure Out The Theme Of Today's Topical BuzzFeed Crossword?\n\
Today's BuzzFeed Crossword, 6/29\n\
Today's BuzzFeed Crossword, 6/28\n\
Today's BuzzFeed Crossword, 6/27\n\
Can You Solve The Hardest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 6/23\n\
Today's BuzzFeed Crossword, 6/22\n\
Today's BuzzFeed Crossword, 6/21\n\
Today's BuzzFeed Crossword, 6/20\n\
Can You Solve The Hardest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 6/16\n\
Today's BuzzFeed Crossword, 6/15\n\
Today's BuzzFeed Crossword, 6/14\n\
Today's BuzzFeed Crossword, 6/13\n\
Can You Solve The Hardest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 6/9/16\n\
Today's BuzzFeed Crossword, 6/8/16\n\
Today's BuzzFeed Crossword, 6/7/16\n\
Today's BuzzFeed Crossword, 6/6/16\n\
How Much Of The Hardest BuzzFeed Crossword Of The Week Can You Finish?\n\
Can You Figure Out The Theme To Today's BuzzFeed Crossword?\n\
Today's BuzzFeed Crossword, 5/31/16\n\
What A Black Woman Wishes Her Adoptive White Parents Knew\n\
R&B Needs The Old Usher Back\n\
This Is What It’s Like To Watch Hate And Fear Grow After The Attack In Nice\n\
Poem: Aubade With Sage And Lemon By Tarfia Faizullah\n\
Here's What Happens To Your Body When You Hike The Appalachian Trail\n\
The Triumph And Will Of The Young Female Gymnast\n\
What A British Woman Learned About America During The Conventions\n\
How Philadelphia Destroyed The Greatest Skate Spot Ever Made\n\
These Women Prove That Behaving-Badly Comedies Aren't Just For Bros\n\
The DNC Is Almost Over But Are We Convinced?\n\
Where Did Drake’s “Jamaican” Accent Come From?\n\
Our Favorite Salesman Bill Clinton Wants To Sell You On Hillary\n\
Splitting The Vote Or Finding Compromise At The DNC\n\
Three New Poems By Nick Flynn\n\
What I've Learned From Having A Trans Partner\n\
“That’s How We Survive: When Police Brutality Turns Mothers Into Activists\n\
Donald Trump's Scary Allure\n\
A Flowchart For People Who Get Defensive When Talking About Racism\n\
In Which A British Woman Considers The American Flag\n\
How Tessa Thompson Became A Modern Marvel\n\
At The Republican National Convention, We're Black And We're Here\n\
Chris Christie: Sad Meme, Charming Man\n\
Poem: Fairy Tale By Sam Sax\n\
The Intersectional Woman's Reading List\n\
RNC Day 1: Commerce Over Politics At The T-Shirt Table\n\
When I Lost My Father, I Lost His Voice Too\n\
The Playlist Professionals At Apple, Spotify, And Google\n\
Poem: Family Portrait As Denoument By Traci Brimhall\n\
This Comic About A Chicken Will Make You Cry\n\
21 Things Kim Kardashian Did In 2008 That She'd Never Do Now\n\
The Fan Art For Stranger Things Is Absolutely Stunning\n\
19 Gorgeous Items Every Spirited Away Fan Needs In Their Life\n\
The Definitive Ranking Of Iconic TV And Movie Prom Dresses\n\
Can You Pick The Movie Theater Candy With The Most Calories?\n\
Which Celebrity Should Be Your High School Formal Date?\n\
How Well Do You Know The Lyrics To Before He Cheats By Carrie Underwood?\n\
13 Celebrity #TBT Photos You May Have Missed This Week\n\
In Case You Haven't Noticed, 2016 Is Basically The '90s\n\
23 Arthur Memes That Just Went Too Far\n\
Let's Take A Moment To Talk About The Men's Olympic Swimsuits\n\
This “Friends” News Will Make You Even Sadder For David The Scientist\n\
21 Things That Definitely Happened At Every Formal After-Party\n\
R&B Needs The Old Usher Back\n\
Let's Talk About Steve's Hair In Stranger Things Because Why Not\n\
Which '90s Pop Star Are You In The Streets Vs. In The Sheets?\n\
Only A Studio Ghibli Expert Can Get More Than 70% In This Food Quiz\n\
Do You Know When Your Favorite Disney Movies Were Originally Released?\n\
Anne Hathaway Shared The Perfect Message To Celebrate 15 Years Of Princess Diaries\n\
16 Times Kermit The Frog Was A Goddamn Gift To The Internet\n\
How Good Are Your Disney Opinions?\n\
What Fictional Camp Should You Go To Based On Your Zodiac Sign?\n\
23 Tweets About Mexican Food That Are Too Real\n\
24 Bangers From 2009 You Definitely Danced To At Your School Formal\n\
How Well Do You Remember Joey Potter's Life On Dawson's Creek?\n\
27 Of The Funniest Harry Potter And The Cursed Child Tumblr Posts\n\
Can You Pick The Beanie Baby That's Worth A Ton Of Money?\n\
Everyone Needs To Know That Chad Michael Murray Is Still Really Hot\n\
Would You Survive In Stranger Things?\n\
FBI Spy Planes Filmed Protests In Baltimore, Raising Privacy Concerns\n\
FDA Approves Mutant Mosquito Experiment In Florida Keys\n\
18 Jokes That Are Way Too Real For Women In Science\n\
These Sketchy Zika Products Are Under Government Scrutiny For False Advertising\n\
A Company Just Got Permission To Land On The Moon\n\
Government Should Help Pay For Birth Control Because Of Zika Threat, CDC Says\n\
Can You Pass This Sudden-Death GCSE Maths Test?\n\
High Court Rules That The HIV Prevention Drug Can Be Made Available On The NHS\n\
Alphabet Wants To Fight Disease By Altering Your Body’s Electricity\n\
Government Spy Planes Circled Over The Democratic Convention More Intensely Than GOP Event\n\
Miami Now Has 14 Cases Of Zika From Local Mosquitoes\n\
What You Don’t Know About Your Medical Records Could Hurt You\n\
People Are Saying This Gap Advert Is Sexist\n\
Scientists Are Fighting Over Whether Egg Donors Should Be Paid\n\
8 Health Risks To Actually Worry About If You’re Going To The Olympics\n\
Why Track-And-Field Stars Don’t Set World Records Like They Used To (But Swimmers Do)\n\
These People Like To Chill At 200 Degrees Below Zero\n\
We Saw The Corpse Flower In Bloom And It Was Disgustingly Beautiful\n\
This Could Have Been The First Poop Pill To Hit The Market, But It Failed Clinical Trials\n\
The Meatless Burgers Of The Future Have Arrived\n\
Mosquito Bites Are Giving People Zika In Florida\n\
Now There Are 4 Zika Cases That May Have Come From Florida Mosquitoes\n\
Scientists Are Really Using Fitbits To Study Health\n\
Why UK Scientists Are Signing A Petition To Keep Access To European Projects\n\
Why That Drug That Halts Alzheimer's Story Is Probably Not True\n\
Race — Not Gender — Influences Whether Top Medical Researchers Get Funding, Study Says\n\
Charges Dropped Against Anti-Abortion Activists Who Made Secret Videos\n\
How The Cures For Cancer Snuck Up On Us\n\
17 Brain Tweets That Will Make You Laugh And Then Think\n\
Olympics Updates: Opening Ceremonies Kick Off Friday\n\
Can You Name The NASCAR Driver By Their Number?\n\
Which Member Of The US Women's Gymnastics Team Should Be Your Bff?\n\
Please Never Forget This Bonkers Moment From The 2012 Olympics\n\
34 Olympians You Should Be Following On Snapchat\n\
17 Memes That Will Make Any Track Athlete Laugh\n\
Surfing, Skateboarding, Climbing, Karate, Baseball, And Softball Will Be At The 2020 Olympics\n\
How Much Do You Actually Know About Olympic Sports?\n\
This Picture Shows The Huge Difference In Heights Between Olympic Athletes\n\
18 Black Women Olympians Who Have Kicked Ass On Team USA\n\
23 Things You Probably Forgot About From The 2012 Olympics\n\
How Much Do You Actually Know About The Olympics?\n\
Can You Name These 90s NFL Players?\n\
17 Photos That Prove That Synchronized Swimming Is Kind Of Insane\n\
Can You Name The Members Of The Original Dream Team?\n\
This Is The Hardest Olympic Mascot Quiz You'll Ever Take\n\
You Have To See This Hurdler's Reaction To Setting A New World Record\n\
Michael Jordan Says He Can No Longer Stay Silent, Speaks Out On Police Shootings\n\
NFL Rookie Ezekiel Elliott Accused Of Assaulting His Girlfriend\n\
This Goalkeeper Threw The Ball Into His Own Team's Goal, It’s Fine\n\
NBA Pulls 2017 All-Star Game From North Carolina Over Anti-LGBT Law\n\
Anti-Doping Agency Reinstates Rio Lab In Time For Olympics\n\
St. Louis Cardinals Executive Who Hacked Houston Astros Sentenced To 46 Months In Prison\n\
14 Times Cristiano Ronaldo Has Been Us\n\
Our Long National Deflategate Nightmare Is Finally Over\n\
Tour De France Cyclist Begins Running Up Mountain After Losing Bike In Collision\n\
NBA Players Delivered A Powerful Message About Gun Violence And Racial Justice\n\
All Of The Looks On The 2016 ESPY Awards Red Carpet\n\
Caitlyn Jenner Looks Incredible At This Year's ESPY Awards\n\
25 Insane Sales To Shop This Weekend\n\
23 Things You Should Be Buying From The Men's Section\n\
What Summer Shoes Should You Get?\n\
This 17-Year-Old Girl Gave Her Dad A Makeover And He Looked So Freakin' Fierce\n\
17 Fashion And Beauty Documentaries To Binge-Watch Online\n\
If These Penis And Vagina Highlighters Don’t Give You A Beauty Boner, Nothing Will\n\
17 Gorgeous Natural Hairstyles That Are Easy To Do On Short Hair\n\
Which Red Lipstick Is Right For You?\n\
This 26-Year-Old Got Paid $7,000 To Roll Elaborate Custom Joints And My Life Is A Joke\n\
9 Affordable Places To Buy Stylish Glasses Other Than Warby Parker\n\
25 Thoughts You Have When You Shop For A Bikini\n\
28 Summer Dresses For People Who Love To Wear Black\n\
How Much Do You Actually Know About Nail Polish?\n\
Swim God Ryan Lochte Just Dyed His Hair And He's Basically Already Won The Olympics\n\
We Bet You Can't Find The Most Expensive Panties\n\
17 Ways To Dress Exactly Like Your Favorite Food\n\
Can You Get 9/9 On This Kylie Lip Kit Quiz?\n\
I Tried To Look As Tall As Humanly Possible For A Week\n\
7 Ridiculously Easy Makeup Tips That You'll Actually Want To Try\n\
Here's What Everyone Wore To The 2016 Teen Choice Awards\n\
I Tried To Cure My Resting Niceface With Makeup\n\
We Tried Popular Pinterest Fashion Hacks And This Is What Happened\n\
Can You Guess The Iconic Telenovela By The Outfit?\n\
I Tried Out Self-Tanners And Became Orange So That You Don't Have To\n\
We Bet You Can't Choose The Most Expensive Panties\n\
You'll Never Pass This Urban Decay Naked Palettes Quiz\n\
34 Awesome Things You Should Buy On H&M Right Now\n\
Pick A Bra And We’ll Reveal What You’re Really Like In Bed\n\
18 Things People Who Love To Shop Know To Be True\n\
We Asked Tech Industry People How To Solve The Millennial Lack Of Sex\n\
Facebook's Testing A Main Screen That Looks A Whole Lot Like Snapchat's\n\
Eight Hours In The Desert With Tesla's Biggest Fans\n\
Apple’s First-Ever Bug Bounty Will Pay Hackers To Find iOS Flaws\n\
Designers Back Apple In Its Supreme Court Fight With Samsung\n\
Is This An Ad? Nick Jonas & Lyft Edition\n\
Smartphones Are Key To Banking In The Developing World\n\
Like The Rest Of Silicon Valley, Apple Is Getting More Diverse — Slowly\n\
Instagram's New Feature Is Basically Snapchat But Here’s How To Use It Anyway\n\
Former US Labor Secretary Robert Reich Says The Gig Economy Can Be A “Nightmare\n\
Twitter Will Let You Temporarily Follow Olympics Tweets For 17 Straight Days\n\
Instagram Adds Disappearing Stories To Encourage More Casual Posts\n\
Twitter's Communications Boss Leaves Company\n\
Apple Will Swap Out The Pistol Emoji For A Squirt Gun\n\
Sex Offenders Are Now Banned From Using Pokémon Go In New York\n\
21 Amazon Echo Hacks You Should Definitely Know About\n\
Alphabet Wants To Fight Disease By Altering Your Body’s Electricity\n\
Redesigned iOS Emojis Show Women Playing Sports And Men Pampering Themselves\n\
What You Don’t Know About Your Medical Records Could Hurt You\n\
The Meatless Burgers Of The Future Have Arrived\n\
Apple CEO Tim Cook To Host Hillary Clinton Fundraiser\n\
Scientists Are Really Using Fitbits To Study Health\n\
Zuckerberg Says Video Will Soon Be The Heart Of Facebook\n\
An LA Woman Is Suing Uber For Negligence After Her Driver Was Convicted of Sexual Battery\n\
Congressional Leaders Call On Obama To Declassify And Release DNC Hack Info\n\
Yik Yak Gets Less Anonymous With Profiles\n\
People Are Mad Hillary Was Left Off Some Front Pages After Making History\n\
Despite Difficult Earnings Report, Twitter Sees Big Money In Premium Live Streams\n\
Here's How That Donald Trump Reddit AMA Came Together\n\
Can You Guess The California City By Its Skyline?\n\
Which Climate Perfectly Matches Your Zodiac Sign?\n\
28 Underrated Desserts You Must Eat In NYC\n\
22 London Breakfasts That Are Tasty As Fuck\n\
21 Things You Can Actually Eat On A Plane\n\
What's The Most Insane International Fast Food Item You've Ever Seen?\n\
The Most Annoyingly Difficult Flag Quiz You Will Ever Take\n\
Here's What Happens To Your Body When You Hike The Appalachian Trail\n\
Where Should You Live Based On Your Romantic Preferences?\n\
This Is The Weirdest Thing About Australia\n\
What's The Most Insane Burger In America?\n\
Just 25 Really Funny Tweets About L.A.\n\
This Game Of Would You Rather Will Determine Which US City Is Best\n\
Watch Anna Faris In Air New Zealand’s Hilarious In-Flight Safety Video\n\
21 British Food Experts Who Will Transform How You Eat\n\
We Saw The Corpse Flower In Bloom And It Was Disgustingly Beautiful\n\
How Philadelphia Destroyed The Greatest Skate Spot Ever Made\n\
What Do You Call People From Your State?\n\
21 Things You’ll Only Know If You’re From Northern Illinois\n\
14 Brazilian Dishes To Try While You're Visiting\n\
25 Truths Only People Who Grew Up In Rhode Island Understand\n\
25 Tasty Buffets For When You Want A Little Bit Of Everything\n\
Literally Just 24 Beautiful Photos Of Costa Rica\n\
Here Are All The Coolest Things Happening In Edinburgh This August\n\
If We're Insisting Domestic Violence Is A Family Matter, At Least Talk To Your Family About It\n\
Forget About Paris, Bordeaux Is The Best French City\n\
7 Reasons Roman Food Is The Only Food You Ever Need To Eat\n\
I Went To A Nude Beach And Hated Every Minute Of It\n\
23 Of The Most Majestic Locations People Have Caught Pokémon\n\
This Quiz Will Tell You The Exact Age You’ll Get Married\n\
27 Hilariously Real Tweets About Going To Weddings\n\
27 Highly Rated Wedding Gifts You Can Buy On Amazon\n\
23 DIY Wedding Lessons From People Who've Already Done It\n\
These Grandparents Had A Photo Shoot To Celebrate Being Together For 63 Years\n\
17 Classy Fuckin' Board Games That Would Make Great Wedding Gifts\n\
We Watched Super Fancy Wedding Cakes Get Made And It Was Awesome\n\
Just 23 Hilarious Tweets About The First Year Of Marriage\n\
People Are Freaking Out Over This Disney Love Scandal\n\
19 Stunning Stacked Wedding Ring Sets You'll Say Yes To\n\
Here's How To Plan An Unforgettable Honeymoon\n\
These Are The Most Popular Wedding Songs Of 2016, According To Spotify\n\
Can We Accurately Guess How Many Weddings You're Going To This Summer?\n\
Just Try To Look At These Nude Photos Of A Couple In Their Seventies Without Getting The Feels\n\
Ciara and Russell Wilson Just Tied The Knot And They Both Look Amazing\n\
16 Style Charts Every Groom Should See Before The Wedding\n\
People Think This Guy's Game Developer Barbie Hack For His Wife Is Amazing\n\
6 Brides Whose Babies Just Needed To Eat\n\
10 Charts To Help Anyone Write A Best Man Speech\n\
19 Ridiculous Ikea Fights That Will Make You Want To Be Single Forever\n\
17 Flawless Brides Rocking Their Natural Hair\n\
23 Insanely Romantic Quotes You'll Want To Include In Your Wedding Vows\n\
Holy Crap, This Guy Got Bitten By A Rattlesnake During His Wedding Photos\n\
Can You Get Through This Post Without Saying Awwww?\n\
This 9-Year-Old Wedding Photographer's Skills Will Give You Hope For The Future\n\
This Couple's Pirate-Themed Wedding Is Crazy Beautiful\n\
Tell Us About The Dumbest Fight You And Your S.O. Have Had In Ikea\n\
OK, These Toilet Paper Wedding Dresses Are Actually, Like, Really Pretty\n\
The Internet Is In Love With This Bride And Her Bridesmaids Flaunting Their Natural Hair\n\
The Olympics Actually Played Niger's National Anthem Instead Of Nigeria's By Mistake\n\
UK Could Be Left With A €25 Billion Bill As It Leaves The EU\n\
Donald Trump Now Admits He Never Saw A Video Of The US Sending Money To Iran\n\
These Photos Show What Rebuilding Your Life After An ISIS Massacre Is Really Like\n\
Black Lives Matter Protest Blocks Heathrow Motorway On Day Of Nationwide Demonstrations\n\
Police Raid Uganda Pride During Transgender Pageant\n\
Matt Damon Starring In The Great Wall Is Pretty Neat, According To Chinese People\n\
This Is What It’s Like To Watch Hate And Fear Grow After The Attack In Nice\n\
This Indian Acid Attack Survivor Is Heading To New York Fashion Week\n\
People Can't Stop Talking About This Hot Olympic Swimmer\n\
This Hostel In Slovakia Refuses To Let Turkish Guests Stay\n\
Parents Are Worried That Schools Will Now Ask What Country Their Child Was Born In\n\
Rise In Anti-Semitic Hate Incidents Reported In Build-Up To Brexit Vote\n\
American Woman Killed In Central London Stabbing Attack Identified\n\
Indian Government Introduces Transgender Rights Bill\n\
European Politicians Are Being More Smug Than Usual About The US Presidential Election\n\
A News Station Just Reported That Video Game Cheat Codes Were Secret Revolutionary Messages\n\
Foreign Office Accused Of “Covering Up” Bahrain Torture Allegations\n\
The Most Annoyingly Difficult Flag Quiz You Will Ever Take\n\
The Australians Have Had Such A Horrible Time At The Olympics It's Almost Impressive\n\
Muslim Women Are Responding To Trump Using The #CanYouHearUsNow Hashtag\n\
Video Shows Dramatic Evacuation Before Dubai Passenger Jet Bursts Into Flames\n\
8 Things We Learned From A Report Into Atrocious Conditions In Nauru\n\
The World Is Failing To Get Syrian Refugee Children Into School, Warns Report\n\
Italy's Prime Minister Just Slammed The Turkish President On Twitter\n\
Hackers Behind Leaked DNC Emails Are Still Trying To Hack Democratic Party Members\n\
Here's Why Gringos At The Olympics Need To Be Very Careful About Saying Sugarloaf Mountain In Portuguese\n\
Government Should Help Pay For Birth Control Because Of Zika Threat, CDC Says\n\
This Guy Did A Photoshoot In A Swamp And Now It's A Huge Meme\n\
Can We Guess Your Relationship Status Based On Your Opinions About “Gilmore Girls”?\n\
10 Bizarre Fast Food “Would You Rather” Questions That Are Impossible To Answer\n\
Can You Pick The Actor Who Never Appeared In Harry Potter?\n\
Can You Spot The Real Old English Curse Word From The Fake?\n\
Can We Guess Your Boyfriend's Name In Only 3 Questions?\n\
Which Emily Gilmore Hairstyle Are You?\n\
Can You Name The BTS Song Based On These Emojis?\n\
Can You Guess The Pop Music Video From A Blurred Screenshot?\n\
How Painfully Awkward Of A Person Are You?\n\
Can You Pick The Decade These Barbies Are From?\n\
We Know If You Actually Like To Eat Turkey\n\
Where In France Should You Move To In 2017?\n\
The Deadliest Would You Rather Game For Harry Potter Lovers\n\
Which Thanksgiving Foods Gotta Go?\n\
Which Badass Female Character Are You Based On Your Food Choices?\n\
Which Fantastic Beasts Character Are You?\n\
How Well Do You Remember The Words To The Education Connection Commercial?\n\
How Many Of These Books Have You Lied About Reading?\n\
Do You Actually Prefer Eating Or Sleeping?\n\
Only A True Genius Will Ace This Jeopardy-Style Quiz\n\
Do You Actually Know Which Doctor Does What?\n\
How Ethical Are You?\n\
Who Said It: Hermione Granger Or Jane Austen?\n\
What % Draco Malfoy Are You?\n\
How Well Do You Remember The Simpsons Episode Bart Vs. Thanksgiving?\n\
What Hogwarts Houses Do The “One Tree Hill” Characters Belong In?\n\
Can You Find Newt Scamander?\n\
We Know Your Birth Month And Last Person You Texted From Disney Channel Questions\n\
We Know Your Fave Makeup Brand Based On Your Fave Harry Potter Character\n\
Which Celebrity Queer Couple Are You And Your Girlfriend?\n\
How Well Do You Know The NSYNC Holiday Album?\n\
We Know How Many Times You Watched Porn Last Week\n\
Could You Pass Your Harry Potter Herbology O.W.L.?\n\
We Know Your Age And Location Based On Your Taco Bell Order\n\
We Bet We Can Guess Your Favorite Thanksgiving Food\n\
Which Celebrity Should You Bring To Thanksgiving?\n\
9 Questions Every Gilmore Girls Fan Should Be Able To Answer Immediately\n\
Can You Recognize These Foods Without Color?\n\
What's Your Pothead Percentage?\n\
Pick An Outfit And We'll Guess Your Exact Age And Height\n\
Can We Guess Your Eye And Hair Color With This Food Test?\n\
If You Get 15/20 In This Test, You Must Be A Medical Student\n\
This Weird Food Test Will Tell Us Your Age And Location\n\
Can You Identify These Fruits And Vegetables From A Close-Up?\n\
This Tattoo Test Will Determine Your Age And Favorite Fast-Food Restaurant\n\
Only People With Intense Color Vision Can See This Purple Leaf\n\
15 Would You Rather Questions You Won't Be Able To Answer\n\
Your Chocolate Preferences Will Determine How Many Kids You'll Have\n\
好きな食べ物を4つ選ぶと年齢がバレる診断\n\
Which Badass Female Character Are You Based On Your Food Choices?\n\
We Know If You Actually Like To Eat Turkey\n\
29 Tweets That Are Way Too Real For Sriracha Lovers\n\
Make This Slow Cooker Steak And Veggies Meal For The Easiest Dinner Ever\n\
Send A Secret Message In A Fortune Cookie At This Museum\n\
17 Foods That Prove Spam Is Delicious And Totally Fine To Eat\n\
This Office Etiquette Question Will Tell You If You're Terrible\n\
We Know Your Least Favorite Food Based On The Word That Makes You Cringe\n\
Garlic And Herb Mashed Cauliflower\n\
Trump Fans Are Making A Statement To Starbucks By Ordering With Trump's Name\n\
12 Delicious Crumbles, Crisps, And Cobblers To Eat This Winter\n\
Here's Four Incredible Appetizers You Need To Make For Thanksgiving\n\
15 Mouthwatering Thanksgiving Desserts That Aren't Pumpkin Pie\n\
We Tried $100 Sneakers And $25,000 Sneakers To See If It’s Worth The Price\n\
Which Thanksgiving Foods Gotta Go?\n\
How To Make A Delicious Turkey This Thanksgiving\n\
This Turkey-Stuffed Acorn Squash Is A Delicious Way To Use Your Thanksgiving Leftovers\n\
23 Pictures Of Doughnuts That Will Sexually Awaken You\n\
We Tried Thanksgiving-Flavored Ice Cream And It Blew Our Minds\n\
23 Hot Drinks To Make You Feel Christmassy AF\n\
15 Insanely Delicious Fall Desserts You Can Totally Make For Thanksgiving\n\
28 Perfect Gifts For Tea Lovers\n\
17 Vegetarian BBQ Recipes Even Meat Eaters Will Love\n\
15 Fancy Ways To Get Shamelessly Drunk On Thanksgiving\n\
Can You Recognize These Foods Without Color?\n\
We Bet We Can Guess Your Favorite Thanksgiving Food\n\
29 Gifts For People Who Won't Hang With You Unless There's Food\n\
If You Get A Perfect Score On This Quiz, You're A Food Network Scholar\n\
Your Chocolate Preferences Will Determine How Many Kids You'll Have\n\
Here’s What People Are Buying On Amazon Right Now\n\
All The Best Deals On The Internet Today\n\
36 Things All Hopeless Romantics Will Instantly Fall For\n\
39 Adorable Gifts You'll Want To Cuddle With Right Now\n\
18 Gifts Literally Nobody Asked For\n\
31 Awesome And Inexpensive Things You Need For Your Home\n\
This DIY Sofa Table Adds Much-Needed Storage Behind A Couch\n\
33 Products That Any Miyazaki Lover Will Obsess Over\n\
21 Gifts You Should Probably Just Keep For Yourself\n\
Where Do You Stand On The Great Bed-Making Debate?\n\
Grow Herbs Indoors And Out With This Stylish Pipe Garden\n\
30 Awesome Products Every Scrapbooking Addict Needs\n\
18 Gifts For The Laziest Person In Your Life\n\
28 Products That Are So Punny It Hurts\n\
Keep Your Stuff Stowed Neatly With This Lay-Flat Storage Mat\n\
All The Best Deals On The Internet This Weekend\n\
31 Amazing Advent Calendars You'll Want To Check Out Before December\n\
35 Products That Every Movie Lover Will Appreciate\n\
31 Subscription Boxes That Take The Stress Out Of Gift-Giving\n\
Save Every Bit Of Bar Soap With This Clever Sponge Soap Dish\n\
All The Best Deals On The Internet Today\n\
29 Gorgeous Gold Things That Are Fancy AF\n\
27 Products To Make Any Horse Girl's Dreams Comes True\n\
25 Pretty Pink Things That Will Make You Smile\n\
21 Products From Amazon That’ll Make Perfect Gifts\n\
35 Things To Buy Your Favorite Slytherin\n\
This Adjustable Peg Shelf Offers Stylish Storage In Any Room\n\
All The Best Deals On The Internet Today\n\
21 Awesome Products From Amazon To Put On Your Wishlist\n\
9 Happy Little Things To Make You Smile This Week\n\
This Baby Puggle Proves Nifflers Actually Exist\n\
17 Dogs Who Are Stoked To See You\n\
16 Basset Hounds Who Need A Hug Right Now\n\
18 Sneaky Spies Who Should Totally Be In The CIA\n\
This Little Japanese Chin And Her Big Saint Bernard Brother Are Adorable Best Friends\n\
This Teen's Mom Just Realized What Their Dogs Were Doing All Day And Freaked Out\n\
Just 21 Really Great Dog Pictures\n\
27 Gift Ideas For Your Friend Who Really, Really Loves Animals\n\
24 Gifts That People Who Love Dachshunds Will Long For\n\
17 Dogs Who Are Carefully Bending Their Human's Rules\n\
19 Tiny Dogs Wearing Even Tinier Shoes\n\
People Are Losing It Over This Chinese Pheasant That Looks Just Like Donald Trump\n\
17 Reasons Australian Shepherds Are The World's Best Dogs\n\
This Video Of A Man And His Pony Dancing To Sia Is Everything The World Needs Right Now\n\
22 Pictures That Prove Pitbulls Are The Scariest Dogs Alive\n\
This Family Dog Is Now A Straight-Up Llama\n\
These Pets Just Won The Mannequin Challenge\n\
21 Pictures That Prove Dogs Are Actually Completely Perfect\n\
What Should These Dogs Be Named?\n\
This Harry Potter Test Will Determine If You're A Cat Or Dog Person\n\
How One Man’s Swim In Antarctic Waters Convinced The Russians To Save The Whales\n\
23 Heartbreaking Doodles That'll Make You Laugh, Cry, Or Probably Both\n\
A Guy Posted A Bunch Of Fake Fliers At The Dallas Zoo And They're Hilarious\n\
Here's An Uplifting Quote Based On Your Favorite Dog\n\
If You're Sad, Watch These Sea Lions Trying The Mannequin Challenge\n\
15 Cats That Are Definitely Planning To Sleep Through The Next Four Years\n\
17 Extremely Good Boys\n\
16 Samoyeds That Will Calm You To Your Very Core\n\
How Michigan Muslims Voted\n\
Listen To Four American Muslims Talk About Trump's Victory\n\
Book Recommendations That Will Get You Through The Next Few Weeks\n\
10 Ways To Start Living Your Best Life Right Now\n\
Another Round, Episode 64: Live In Philly\n\
Another Round, Episode 63: Heben's Husband (with Jaime Camil)\n\
Another Round, Episode 62: Put Your Mask On First\n\
Another Round, Episode 61: The Greatest\n\
Melissa Harris-Perry On Her Split With MSNBC: I Am Not A Civil Rights Case\n\
Another Round, Episode 59: May She Forever Reign\n\
Another Round, Ep. 58: The Job Of Pettiness\n\
I Was A Thirsty Male Feminist For A Day And It Was Exhausting\n\
16 Books We Fell In Love With As Young Black Girls\n\
What Happens When You Try To Follow The Rules™ In Real Life?\n\
F@*K, Marry, Kill: Woke Men, Republican Candidates, And White Baes\n\
Another Round, Episode 60: Down With Sporks\n\
14 Things You Never Knew About Hamilton's Lin-Manuel Miranda\n\
This Is What Lin-Manuel Miranda Said To Kanye When He Saw Hamilton\n\
Another Round, Episode 44: Mommy's Side Piece\n\
Another Round, Episode 43: A Gumbo Of Afrofuturism\n\
Here's How W. Kamau Bell Talks About Race With His Kids\n\
Someone Appears To Have Stolen This Woman's Photos And Is Using Them To Troll People\n\
Another Round, Episode 41: To Be Young, Gifted, And Black\n\
Listen To BuzzFeed's New Podcast The Tell Show!\n\
7 Reasons To Listen To BuzzFeed's New Podcast The Tell Show\n\
Another Round, Episode 40: Blacker History Month\n\
The Mystery Of Michael Jackson And Sonic The Hedgehog\n\
Another Round, Episode 39: The Betrayer Of The Patriarchy\n\
Another Round Episode 27: No New Friends, My Squirrel Dude\n\
Michael Chabon Is An Underdog On Top Of The World\n\
The Little-Known Law That Put A Man Behind Bars Twice For The Same Shooting\n\
The New Breed Of Sci-Fi That's Saving Hollywood From Itself\n\
A Year After The Photo That Changed Devin Allen's Life, He's Trying To Line Up His Next Shot\n\
The Slow Fade Of Tom Hanks\n\
Hyperpartisan Facebook Pages Are Publishing False And Misleading Information At An Alarming Rate\n\
Polls, Damn Polls, And Statistics\n\
Inside The Bloody Drive Toward Mosul\n\
Inside The Strange, Paranoid World Of Julian Assange\n\
Meet Fancy Bear, The Russian Group Hacking The US Election\n\
How Santeria Brings Hope To The New Yorkers Who Need It Most\n\
An Exclusive And Completely Factual Snapshot Of Donald Trump's Speech Notes\n\
Meet The Charming, Terrifying Face Of The Anti-Islam Lobby\n\
Would You Give This Man $100 Million?\n\
Meet The Muslim YouTuber Who's Proving Modesty Can Be Fashionable\n\
Sheldon Johnson Wants to Go Straight, But The Past Won’t Let Go\n\
Killer Robots Are Coming And These People Are Trying To Stop Them\n\
The Most Mysterious Stories You Can't Miss This Week\n\
Dee Dee Wanted Her Daughter To Be Sick, Gypsy Wanted Her Mom Murdered\n\
How A 125-Year-Old Mass Lynching Tried To Make America Great Again\n\
The Stories We're Digging This Week\n\
The Most Dramatic Stories You Can't Miss This Week\n\
Law Vs. Order: How An Albuquerque DA Took On Her Own Police Department And Lost Everything\n\
How Sulcata Tortoises Became America's Most Adorable Mistake\n\
We Found These Qaddafi Henchmen Wanted For Stealing Millions Living In Britain\n\
Where Did Drake’s “Jamaican” Accent Come From?\n\
How Donald Trump Broke The Conservative Movement (And My Heart)\n\
The Biggest Stories You Can't Miss This Week\n\
“That’s How We Survive: When Police Brutality Turns Mothers Into Activists\n\
How Tessa Thompson Became A Modern Marvel\n\
Meet The Workers Who Sewed Donald Trump Clothing For A Few Dollars A Day\n\
Stop Conflating Activists With Assassins, Black Leaders Tell Police\n\
Inside The Fraternity Of Haters And Losers Who Drove Donald Trump To The GOP Nomination\n\
7 Things You Need To Know About Ghostbusters\n\
The Most Marvelous Stories You Can't Miss This Week\n\
This Is What It Was Like Inside CNN Turk The Night Of The Attempted Coup\n\
The Worst Part Of Schizophrenia Isn’t What You Think It Is\n\
The Playlist Professionals At Apple, Spotify, And Google\n\
Documents Raise Disturbing Questions About Detainee Abuse Under Obama\n\
How The World's Greatest Gymnast Became Inevitable\n\
Kanye West Reportedly Hospitalized After Canceling Tour\n\
Dennis Rodman Charged With Hit-And-Run, Faces Up To Two Years In Jail\n\
Trump Announces Plans For His First 100 Days In Office\n\
This Restaurant Apologized For Hosting Tila Tequila And A Bunch Of White Nationalists\n\
At Least 6 Children Killed After School Bus Crashes In Tennessee\n\
29 YA Books About Mental Health That Actually Nail It\n\
9 Incredible Women Who Spent Their Lives Fighting To Change America\n\
Which Fantastic Beasts Character Are You?\n\
13 Truly Terrible Sex Scenes From Fiction Books This Year\n\
7 Things Fantastic Beasts Taught Us About The Wizarding World\n\
Michael Chabon Is An Underdog On Top Of The World\n\
Read This Excerpt From Michael Chabon's New Novel Moonglow\n\
18 Things Everyone Who's Addicted To Buying Books Will Understand\n\
If You Can Identify 15/20 Books By Just A Quote, You’re Probably A Genius\n\
Here Is Your Ultimate YA Book Gift Guide For 2016\n\
How Many Of These Books Have You Lied About Reading?\n\
The Harry Potter Fandom Is At A Crossroads\n\
39 Questions We Have About Health At Hogwarts\n\
Here Are The 2016 National Book Award Winners\n\
Anna Kendrick's Hilarious Life Advice Is All You'll Ever Need\n\
Beautiful Double-Exposures Reveal Long-Standing Trauma\n\
The Cast Of Fantastic Beasts Play Who's Most Likely To...\n\
19 People Who Are Still Not Over The Travesty That Were Padma And Parvati's Yule Ball Outfits\n\
19 Harry Potter” Pins Every Fan Will Want To Buy Immediately\n\
21 Things To Do When You Get Stuck During NaNoWriMo\n\
We Tried The Butterbeers At The Wizarding World Of Harry Potter And Wow\n\
The Full Trailer For A Series Of Unfortunate Events Is Finally Here\n\
8 Questions All Harry Potter Fans Should Find Super Easy To Answer\n\
35 Things To Buy Your Favorite Slytherin\n\
What Per Cent Hufflepuff Are You?\n\
27 Things You Need To Have A Classy AF Harry Potter Wedding\n\
18 Funny Tweets About Hogwarts That'll Really Make You Think\n\
This 22-Year-Old Draws The Most Brutally Honest Cartoons About Mental Health\n\
29 Magical Pictures From The 2001 Premiere Of Harry Potter\n\
Trump's Search For Education Secretary Narrows To Two Candidates\n\
Zenefits Failed To Pay Overtime To Sales Reps, Lawsuit Claims\n\
A New Way To Take Down Online Criticism: Sue A Fake Person\n\
A Year Before The Election, Unions Saw Trump Winning Over Their Members\n\
McDonald's Will Start Offering Table Service\n\
Palantir Has A Well Placed Friend In Trumpland\n\
Preparing For The End Of Obamacare\n\
United's New 'Basic Economy' Ticket Is An Insult To Human Dignity\n\
Krispy Kreme Has Been Lying To Us, Lawsuit Claims\n\
Competition Among Airlines Is Now Low Enough That Warren Buffett Will Invest In Them\n\
Here's How Much Trump's Tax Cuts Would Save You\n\
Here's What President Trump Means For Your Student Loans\n\
The Sriracha Big Mac Is The Latest In The Big Mac Renaissance\n\
The Global Capital Of Everything Cheap Knew Where The US Election Was Heading\n\
This Guy Got In An Uber And Discovered His Driver Was A US Senator\n\
A Wary Labor Movement Reckons With Trump's Next Moves\n\
President-Elect Trump Vows To Deport 2–3 Million Undocumented Immigrants\n\
The President-Elect Is Feuding Again With A Newspaper On Twitter\n\
Trump's Favorite Big Bank Is Doing Great After His Surprise Win\n\
The TPP Is Dead\n\
Trump Presidency Could Boost Pharma, Construction, Prisons, And Banks\n\
Wall Street Has Convinced Itself That Trump Won't Be Bad (For Now)\n\
Here's How Labor Activists Are Reacting To A Trump Presidency\n\
Private Prisons Are Clear Beneficiaries Of Trump Presidency\n\
Stocks Are Jittery And Falling Following Trump’s Win\n\
Minimum Wage Increases Won Everywhere They Were On The Ballot\n\
A Tech Mogul Said He'd Push For California To Secede If Trump Won\n\
There's A Huge Loophole In A Ballot Initiative To Cap Interest Rates\n\
Stocks Love Hillary, And FBI's Comey\n\
21 Photos That Will Determine How Much Of A Perv You Are\n\
Billy Eichner Told Random People That Seth Rogen Had Died While Seth Rogen Watched From A Foot Away\n\
Sorry But Chris Pratt And Anna Faris Are The Cutest Football Fans Ever\n\
Can We Guess Your Boyfriend's Name In Only 3 Questions?\n\
16 Tweets That Are Too Real For Anyone Who Drank Tampico As A Kid\n\
That Viral Photo Of A Young, Gay Mike Pence Is Definitely Fake\n\
Can You Spot The Real Old English Curse Word From The Fake?\n\
Tell Us Your Horror Stories About Working Retail On Black Friday\n\
30 Things You Should Know About Boris Kodjoe\n\
J.K. Rowling Just Revealed Something Major About The Fantastic Beasts Timeline\n\
19 Magical Gifts For People Who Love Harry Potter\n\
What Do You Think Should Be 2016's Word Of The Year?\n\
Here's Yet Another Reason To Love Kristaps Porzingis\n\
Can We Guess Your Relationship Status Based On Your Opinions About “Gilmore Girls”?\n\
Can We Talk About Drake's AMAs Look For A Minute?\n\
Here Are All The Looks Gigi Hadid Wore At The AMAs\n\
Can You Name The BTS Song Based On These Emojis?\n\
Taylor Swift Freaking Out Over Selena Gomez's AMAs Win Is So Damn Adorable\n\
Can You Guess The Pop Music Video From A Blurred Screenshot?\n\
Only A True Genius Will Ace This Jeopardy-Style Quiz\n\
12 Decadent Triple Chocolate Desserts That Will Make You Drool\n\
Do You Actually Prefer Eating Or Sleeping?\n\
We Know If You Actually Like To Eat Turkey\n\
21 Dank Memes For People Who Love Dank Memes\n\
Which Badass Female Character Are You Based On Your Food Choices?\n\
17 Text Pranks That Are Way Funnier Than They Should Be\n\
The Hardest Game Of Who Would Win In A Fight You'll Ever Play\n\
This Color Test Will Predict How Many Kids You'll Have\n\
The 6 Stages Of Getting A Zit\n\
16 Basset Hounds Who Need A Hug Right Now\n\
How Well Do You Remember The Words To The Education Connection Commercial?\n\
Which TV Parents Are Your Parents Actually?\n\
16 Classic Thanksgiving Episodes Of TV Shows That Aren't Friends\n\
People Are Divided About Gigi Hadid's Melania Trump Impression\n\
17 Harry Potter Memes That Are So Dumb They're Great\n\
All The Looks On The American Music Awards Red Carpet\n\
Kanye West Tour Canceled After Announcing He Would've Voted For Trump\n\
15 Gloriously Simple Christmas DIYs You Can Make This Winter\n\
Tyga Celebrated His 27th Birthday With Guns, Diamonds, And Cake\n\
Can We Guess Which Disney Channel Era You Belong To?\n\
Which Hogwarts Professor Would Definitely Hate You?\n\
Can You Guess The Disney Movie By These Emojis?\n\
Which Harry Potter Home Should You Live In?\n\
Which Ryan Reynolds Character Matches Your Favorite Color?\n\
Kristen Wiig Celebrates Food Puns In This Delightfully Weird Cut SNL Sketch\n\
Sorry But Chris Pratt And Anna Faris Are The Cutest Football Fans Ever\n\
Billy Eichner Told Random People That Seth Rogen Had Died While Seth Rogen Watched From A Foot Away\n\
We Surprised Priyanka Chopra With Puppies And Then She Adopted One\n\
Taylor Swift Freaking Out Over Selena Gomez's AMAs Win Is So Damn Adorable\n\
Joe Sugg And Caspar Lee Compete In Hilarious US-Themed Challenges\n\
30 Things You Should Know About Boris Kodjoe\n\
Chrissy Teigen Shut Down Trolls Who Complained About Her Swearing\n\
Can We Talk About Drake's AMAs Look For A Minute?\n\
Everything Is Terrible And Great When You’re 17\n\
Here Are All The Looks Gigi Hadid Wore At The AMAs\n\
This Makeup Artist Is Accusing Kylie Jenner Of Stealing Her Ideas\n\
Does Drake Lip-Synching To Taylor Swift's Bad Blood Mean They're Actually Dating?\n\
People Are Divided About Gigi Hadid's Melania Trump Impression\n\
Watch Snoop Dogg As He Hilariously Despairs Through Kanye's Latest Concert Rant\n\
Selena Gomez Opened Up About Her Recovery From Mental Illness At The AMAs\n\
People Are Trying To Buy Adele Tickets And It's An Absolute Shitshow\n\
All The Looks On The American Music Awards Red Carpet\n\
Kanye West Tour Canceled After Announcing He Would've Voted For Trump\n\
Tyga Celebrated His 27th Birthday With Guns, Diamonds, And Cake\n\
Sarah Hyland And Boyce Avenue's New Dont' Wanna Know Cover Is Perfection\n\
17 Funny-But-True Tweets From The #KanyeIsOverParty\n\
The Queen And Prince Philip Are Celebrating 69 Years Of Marriage\n\
The Rock Says He Doesn't Regret Calling Some Of His Fast Costars Candy Asses\n\
Which Celebrity Queer Couple Are You And Your Girlfriend?\n\
Amy Schumer Posted A Hilarious Tribute To Her BF\n\
Which Celebrity Should You Bring To Thanksgiving?\n\
Eddie Redmayne's Childhood Headshot Proves He Hasn't Changed At All\n\
Just A Bunch Of Really Glam Photos From The Gilmore Girls Premiere\n\
Kristen Wiig Celebrates Food Puns In This Delightfully Weird Cut SNL Sketch\n\
J.K. Rowling Just Revealed Something Major About The Fantastic Beasts Timeline\n\
Which Emily Gilmore Hairstyle Are You?\n\
Only A True Genius Will Ace This Jeopardy-Style Quiz\n\
Everything Is Terrible And Great When You’re 17\n\
9 Questions Every Gilmore Girls Fan Should Be Able To Answer Immediately\n\
37 Facts You Didn't Know About Fantastic Beasts And Where To Find Them\n\
67 Of The Best Real Housewives Quotes Of All Time\n\
Eddie Redmayne's Childhood Headshot Proves He Hasn't Changed At All\n\
Just A Bunch Of Really Glam Photos From The Gilmore Girls Premiere\n\
There's A New Gilmore Girls Trailer, And Coffee Is Definitely In It\n\
The Unexpected Love Interest In “The Edge Of Seventeen”\n\
How A Music Festival Turned Political In The Wake Of Trump\n\
Mike Pence Is Not The Only One From Trump's Inner Circle To Have Seen Hamilton\n\
Anna Kendrick's Hilarious Life Advice Is All You'll Ever Need\n\
Which Fantastic Beasts Character Are You?\n\
58 Oprah Quotes To Empower, Delight, And Inspire\n\
James Corden Embarrassed The Crap Out Eddie Redmayne With An Old Video\n\
7 Things Fantastic Beasts Taught Us About The Wizarding World\n\
No, You're Not Going To Get $100,000 If You Find The Big Guardians Of The Galaxy Easter Egg\n\
We'll Tell You What To Netflix Based On Your Thanksgiving Preferences\n\
Nicole Kidman Calls Out Jimmy Fallon Once Again For Never Asking Her Out\n\
21 Tweets About Weird Family Members That'll Make You Laugh\n\
Laverne Cox Dreams Of A World Where Trans People Aren't Killed For Being Themselves\n\
The Little Mermaid Is 27 Years Old And Eric Is Still Hot AF\n\
The Cast Of Fantastic Beasts Play Who's Most Likely To...\n\
19 People Who Are Still Not Over The Travesty That Were Padma And Parvati's Yule Ball Outfits\n\
People Are Shook After The How To Get Away With Murder Mid-Season Finale\n\
Ruby Rose Directed The Veronicas' Latest Video And It's An Emotional Rollercoaster\n\
19 Movies Hilariously Summed Up In Five Words\n\
Only A True Friends Fan Will Be Able To Ace This Thanksgiving Episodes Quiz\n\
The Cast Of Fantastic Beasts Makes Pumpkin Pasties\n\
This Is What Disneyland's Opening Day Looked Like In 1955\n\
19 Magical Fantastic Beasts Products You'll Want To Buy Immediately\n\
24 Of The Funniest Jokes About The Latest Season Of American Horror Story\n\
The Full Trailer For A Series Of Unfortunate Events Is Finally Here\n\
8 Questions All Harry Potter Fans Should Find Super Easy To Answer\n\
23 Things Everyone Who's In Love With Westworld Will Appreciate\n\
This Guy Re-Created Ross’s Epic Thanksgiving Sandwich From “Friends\n\
The New Breed Of Sci-Fi That's Saving Hollywood From Itself\n\
The Unexpected Love Interest In “The Edge Of Seventeen”\n\
Netflix's New Star Doesn't Know She's Famous Yet\n\
Harry Potter (And Walt Disney) And The Age Of Trump Anxiety\n\
We Surprised Priyanka Chopra With Puppies And Then She Adopted One\n\
Anna Kendrick's Hilarious Life Advice Is All You'll Ever Need\n\
The Cast Of Fantastic Beasts Makes Pumpkin Pasties\n\
Simone Biles' Favorite Moment Of 2016 Will Make Your Heart Melt\n\
Let's All Just Accept That 2007 Was The Best Year For Dance Music\n\
Kylie Jenner Says She's Not The Singer Of Terror Jr.\n\
27 Brilliant Songs You Need In Your November Playlist\n\
Robbie Williams Plays A Hilarious Game Of Never Have I Ever\n\
31 Times Dragon Ball Z Horrified The Fuck Out Of You\n\
18 Killer Death Note Items That Are To Die For\n\
10 Video Game Characters That Will Definitely Get You Pregnant\n\
16 Things Only Dragon Ball Z Fans Will Understand\n\
An NFL Player Dressed As Harry Potter For A Press Conference And It Was Perfect\n\
Stop What You're Doing And Look At This Hot Harry Potter Boudoir Shoot\n\
19 Posts About Student Loans That Are Too Fucking Real\n\
15 Painfully Real Pictures Only Students Will Understand\n\
16 Ingenious References You Probably Missed In Luke Cage\n\
What To Do If Comcast Caps Your Internet Data\n\
15 Ridiculously Easy Pokemon Halloween Costumes You Can Make For $30\n\
18 Drawing Tips That Will Inspire You To Pick Up A Pen\n\
People With Disabilities Say What They Want To See In Comics\n\
Rebecca Sugar Has Some Amazing Advice For Aspiring Animators And Artists\n\
The Ultimate Final Fantasy Poll\n\
11 Pokémon Rice Balls That Are Too Cute To Actually Eat\n\
OMG Luke Cage Is The Most Beautiful Thing You'll Ever See In Your Life\n\
Adult Swim Executive's Reddit Account Responds To Report On Lack Of Women Creators\n\
18 Times Tumblr Was Way Too Real For People Who Hate People\n\
How Crap Are Your Disney/Pixar Opinions?\n\
19 Tumblr Posts That Are Way Too Real If You Cry Easily\n\
Mario Is Way Younger Than You Thought\n\
Show Us Your Best Game Of Thrones Halloween Costumes\n\
Which Badass Female Geniuses Do You Most Admire?\n\
Can You Get More Than 10/15 On This DC Comics Quiz?\n\
If You Can Get A 15/20 On This Test, You Are A TRUE Harry Potter Fan\n\
The Full Fantastic Beasts Trailer Is Here And It Is Magical\n\
Are You A Wizard Or A Muggle?\n\
18 Tumblr Posts That'll Make You Realize Some Shit About Lion King\n\
Do You Actually Know Which Doctor Does What?\n\
29 YA Books About Mental Health That Actually Nail It\n\
9 Ways To Enjoy The Weekend And Not Let Sunday Ruin Your Life\n\
My Daughter Was Born With A Cleft Palate, And We're OK\n\
This Turkey-Stuffed Acorn Squash Is A Delicious Way To Use Your Thanksgiving Leftovers\n\
7 Self-Care Tips You Should Try Out\n\
Make This Slow Cooker Steak And Veggies Meal For The Easiest Dinner Ever\n\
39 Questions We Have About Health At Hogwarts\n\
We Need To Talk About Alcohol Blankets\n\
28 Reasons People Really Use Birth Control\n\
17 Jokes That Are Way Too Real For People Who Get UTIs\n\
You're Only Allowed To Drink Coffee If You Can Pass This Quiz\n\
Mom Sues Her Trans Teen Over Medical Transition\n\
19 Jokes About Being Single That Will Make You Laugh Then Cry\n\
12 Reminders To Indigenous Youth That You Matter And You Are Loved\n\
The Tribe That’s Suing The US Government To Keep Its Promises\n\
Get In The Mood For Fall With This Slow Cooker Butternut Squash Soup\n\
How Normal Are Your Body Hair Opinions?\n\
This 22-Year-Old Draws The Most Brutally Honest Cartoons About Mental Health\n\
16 Things Only People With Crohn's Disease Know\n\
Why Do You Use Birth Control?\n\
This Is What It's Like To Go Through Menopause At 25\n\
8 Ways To Challenge Your Anxious Thoughts And Actually Feel Better\n\
Women Are Using Laughing Gas To Take The Edge Off Childbirth Pains\n\
These Dark Chocolate Peanut Butter Banana Bites Are Everything\n\
These Tech Companies Have The Most Generous Fertility Benefits, Poll Says\n\
Poem: Partial Hospitalization By Donika Kelly\n\
21 Jokes About Seasonal Depression That Might Make You Smile\n\
39 Things You Can Do Today To Make Someone Feel A Little Less Alone\n\
That Viral Photo Of A Young, Gay Mike Pence Is Definitely Fake\n\
We Asked Canada's New LGBTQ2 Advisor What He'll Actually Be Doing\n\
This Trans Artist Wrote A Book About Breaking Gender Stereotypes By Wearing A Bindi\n\
Laverne Cox Dreams Of A World Where Trans People Aren't Killed For Being Themselves\n\
Ruby Rose Directed The Veronicas' Latest Video And It's An Emotional Rollercoaster\n\
This Teen Had The Best Response To Someone Saying Gay People Should Be Jailed For Having Sex In Their Homes\n\
Mom Sues Her Trans Teen Over Medical Transition\n\
Lead Plaintiff In US Marriage Equality Decision Says Blocking Plebiscite The Right Call\n\
Salvos Come Out In Support Of Safe Schools Program\n\
Church Leader Blames Homosexuality, Marriage Equality For New Zealand Earthquakes\n\
Tech Companies Prepare To Fight Anti-LGBT Bills In 2017\n\
Jim Obergefell Doesn't Trust That Trump Sees Marriage Equality As Settled\n\
This Is What Canada's New LGBTQ2 Special Adviser Is Facing In His New Role\n\
What Scared Young LGBT People Need To Hear Right Now\n\
People Are Moved By A Photo Of Two Women Kissing In The Middle Of A Trump Protest\n\
President-Elect Trump Says He's Fine With Supreme Court's Marriage Equality Ruling\n\
The Australian PM Has So Many Gay Party Invites He Doesn't Need Mardi Gras\n\
Conservative Chinese Australians Will Take To The Streets Over Safe Schools\n\
These Are The LGBT Rights Trump Could Start Reversing On Day One\n\
A Queer Couple Decided To Get Married Right After They Found Out Trump Won The Election\n\
After Trump Win, Suicide Hotlines Flooded With Calls\n\
Anti-Marriage Equality Groups Says Trump Win Means Aussie Polls Are Wrong\n\
57 Thoughts Every Lesbian Has When They See Another Lesbian\n\
The ACLU Couldn't Keep Up With Everyone Trying To Donate After Trump Won\n\
Transgender People Are Connecting With Lawyers On Twitter Using #TransLawHelp\n\
This Is Why Human Rights As We Know Them Could End Under Trump\n\
Lots Of LGBT People Are Horrified At The Prospect Of A Trump Presidency\n\
People Are Getting Emotional Over This Amazon Review For A Pair Of Rainbow Suspenders\n\
City Of Orlando Will Buy Pulse Nightclub And Turn It Into A Memorial\n\
Here’s What People Are Buying On Amazon Right Now\n\
We Went Behind The Gates Of The Jim Henson Company And It Was Freaking Awesome\n\
All The Best Deals On The Internet Today\n\
A Company Invented Shoes That Are The Answer To Every High Heel Problem Ever\n\
36 Things All Hopeless Romantics Will Instantly Fall For\n\
39 Adorable Gifts You'll Want To Cuddle With Right Now\n\
18 Gifts Literally Nobody Asked For\n\
31 Awesome And Inexpensive Things You Need For Your Home\n\
14 Charts Anyone Who Sucks At Hair Will Appreciate\n\
14 Tweets That Will Remind You Why You Love And Hate Hotels\n\
15 Fancy Ways To Get Shamelessly Drunk On Thanksgiving\n\
Do You Actually Know Which Doctor Does What?\n\
This DIY Sofa Table Adds Much-Needed Storage Behind A Couch\n\
17 Foods That Prove Spam Is Delicious And Totally Fine To Eat\n\
24 Gifts For People Who Only Wear Black\n\
33 Products That Any Miyazaki Lover Will Obsess Over\n\
Can You Recognize These Foods Without Color?\n\
19 Mesmerizing Photos Of Rice Terraces That Speak For Themselves\n\
29 YA Books About Mental Health That Actually Nail It\n\
21 Gifts You Should Probably Just Keep For Yourself\n\
9 Ways To Enjoy The Weekend And Not Let Sunday Ruin Your Life\n\
Where Do You Stand On The Great Bed-Making Debate?\n\
We Bet We Can Guess Your Favorite Thanksgiving Food\n\
Grow Herbs Indoors And Out With This Stylish Pipe Garden\n\
30 Awesome Products Every Scrapbooking Addict Needs\n\
18 Gifts For The Laziest Person In Your Life\n\
29 Gifts For People Who Won't Hang With You Unless There's Food\n\
28 Products That Are So Punny It Hurts\n\
15 Mortifying Social Media Horror Stories That'll Have You Cringing For Days\n\
39 Questions We Have About Health At Hogwarts\n\
If You Get A Perfect Score On This Quiz, You're A Food Network Scholar\n\
16 Seriously Disgusting Things You Did As A Kid\n\
Keep Your Stuff Stowed Neatly With This Lay-Flat Storage Mat\n\
All The Best Deals On The Internet This Weekend\n\
Your Chocolate Preferences Will Determine How Many Kids You'll Have\n\
Send A Secret Message In A Fortune Cookie At This Museum\n\
31 Amazing Advent Calendars You'll Want To Check Out Before December\n\
35 Products That Every Movie Lover Will Appreciate\n\
31 Subscription Boxes That Take The Stress Out Of Gift-Giving\n\
Watch Snoop Dogg As He Hilariously Despairs Through Kanye's Latest Concert Rant\n\
It's Time To Accept That 2007 Was The Last Great Year In Music\n\
Selena Gomez Opened Up About Her Recovery From Mental Illness At The AMAs\n\
All The Looks On The American Music Awards Red Carpet\n\
Sarah Hyland And Boyce Avenue's New Dont' Wanna Know Cover Is Perfection\n\
How Well Do You Know The NSYNC Holiday Album?\n\
The 25 Most Magical (And WTF) Things That Happened At Coldplay's Concert In Mumbai\n\
How A Music Festival Turned Political In The Wake Of Trump\n\
Chris Martin Picked Up The Words Of Maa Tujhe Salaam While Performing Live With A.R. Rahman\n\
Britney Spears' New Slumber Party Music Video Is So Unbelievably Stunning\n\
16 Times Slumber Party Made Me Question My Homosexuality\n\
Kylie Jenner Says She's Not The Singer Of Terror Jr.\n\
Well Fuck, Britney Spears Just Released Her Best Music Video In 10 Years\n\
Kanye Just Confessed That He Would've Voted For Trump\n\
This Is How Much Money Taylor Swift Made Per Day Last Year\n\
Obama Is Honoring A Bunch Of Your Favorite Celebs With The Presidential Medal Of Freedom\n\
This Throwback Clip Of The Spice Girls Slamming Sexist Men Is Iconic\n\
You Need To See Adele Panicking At The Sight Of A Bat In One Of Her Concerts\n\
People Are Obsessed With This Rapper's Song And Now It's A Huge Meme\n\
21 Songs Guaranteed To Make You Happy\n\
If You Can't Pass This Drake Trivia Quiz It's Too Late To Call Yourself A Real Fan\n\
How Well Do You Remember The Lyrics To Double Trouble” From Harry Potter?\n\
Nicki Minaj Called Out Trump In Her New Song And The Internet Is Loving It\n\
30 Things You Need To Know About Little Mix\n\
How Normal Are Your Red Hot Chili Peppers Opinions?\n\
25 Songs That You'll Be Cranking All Summer Long\n\
People Are Getting Really Emotional Over This Guy's Cover Of Black Beatles\n\
Leonard Cohen Reading In Flanders Fields Is What We All Need Today\n\
Shia LaBeouf Just Killed A Freestyle And No One Knows How To Feel About It\n\
We Went Behind The Gates Of The Jim Henson Company And It Was Freaking Awesome\n\
My Daughter Was Born With A Cleft Palate, And We're OK\n\
This DIY All-Purpose Cleaner Will Clean All The Things\n\
19 Delicious Thanksgiving Treats That Will Blow Your Kids' Minds\n\
16 Seriously Disgusting Things You Did As A Kid\n\
8 People Your Kid Doesn't HAVE To Hug\n\
How Normal Are Your Thanksgiving Dinner Opinions?\n\
15 Magical Ideas For Throwing The Perfect Harry Potter-Themed Baby Shower\n\
This Is Why You Should Never Give Your Baby Water\n\
37 Of The Most Obscure Harry Potter Baby Names\n\
Here's An Insanely Easy Cleaning Hack To Clean Your Microwave\n\
21 Products Under $10 Every New Parent Needs To Know About\n\
27 Magical Gifts For Future Harry Potter Fans\n\
19 Pictures That Prove Pregnancy Brain Is A Force That Cannot Be Defeated\n\
17 Moms Who Are Really, Really, Really Mean\n\
Surprise: Pink Is Pregnant With Her Second Child And She Has A Bump To Prove It\n\
Here's How Parents Explained The Election To Their Kids\n\
19 Things All Sisters Who Steal Clothes Will Relate To\n\
What Our Immigrant Parents Texted Us On Election Night\n\
23 Memes All True Wine Moms Will Love\n\
19 Dads Who Really DGAF What You Think\n\
17 Photos That Prove The World Isn't A Completely Terrible Place\n\
Rob Kardashian And Blac Chyna Had Their Daughter\n\
Here’s What I’m Telling My Brown Son About Trump’s America\n\
A Mom Ran Into Hillary Clinton Walking Her Dog In The Woods And It Made A Lot Of People Happy\n\
I Will Teach My Children To Survive The New America\n\
17 Dads Who Are Way Funnier Than You'll Ever Be\n\
People Are Wondering How They Will Explain The Trump Victory To Kids\n\
People Are Tweeting About Getting IUDs While They're Still Covered\n\
Alabama Probably Won't Be Trying A Never-Before-Used Single-Drug Lethal Injection\n\
Conservative Lawyers Take Up The Unexpected Opportunity Of Trump's Win\n\
You Are Amazing! Donald Trump Wrote To Harry Reid In 2010\n\
After Trump Win, The Alt-Right Prepares For An Unexpected Future\n\
Non-Muslims Are Saying They Would Add Their Names To A Muslim Registry In Solidarity\n\
Ivanka Trump, Expected To Run Father's Business, Also Met With Japanese Prime Minister\n\
White House: We Don't Have The Authority To Pardon DREAMers\n\
Director Of National Intelligence Jim Clapper Resigns\n\
Anti-Trump Protesters Post Personal Information Of Electoral College Members\n\
Bernie Sanders Is Demanding Trump Fire Racist Steve Bannon\n\
Georgia Executes Man For Killing His Ex-Girlfriend\n\
Black And Latino Democrats: It’s Time For New Leadership\n\
Democrats Focus On Their Trouble With White, Working-Class Voters\n\
Harry Reid Blames Trump For Climate Of Fear And Racism\n\
Steve Bannon Who? Washington Republicans Say They Don't Know Trump Strategist\n\
Trump Picks Reince Priebus As Chief Of Staff, Steve Bannon As Chief Strategist\n\
With Faith In Omarosa, Black Republicans Gear For Place In 'Most Diverse' White House\n\
Reports: Clinton Places Some Of The Blame For Her Loss On FBI Director Comey\n\
Chimamanda Adichie Clapped Back At A Man Who Said Trump Isn't Racist\n\
Women Are Going To March On Washington The Day After Trump Takes Office\n\
Trump Calls Clinton Very Strong And Very Smart In 60 Minutes Interview\n\
Despite Promises, Trump May Not Repeal Obamacare After All\n\
Trump's Revenge\n\
Harry Reid: Trump’s Election “Emboldened The Forces Of Hate And Bigotry In America”\n\
Latinos Say Kids Are Already Being Bullied At School In The Two Days Since Trump Won\n\
Undocumented Immigrants Fear Mass Deportation Under President Trump\n\
Former GOP Rep. Aaron Schock Indicted On Spending Allegations\n\
Alabama Offers To Execute Inmate With Never-Before-Used, Single-Drug Injection\n\
Democratic Congressman: It's Not A Race Issue. It's A Class Issue.\n\
Do You Know Which Celebs Are, Like, Probably Scientologists?\n\
Can You Pick The House With The Best Halloween Candy?\n\
We Know Your Age Based On Your Taste In Pop Music\n\
Can You Solve The Huge, Final BuzzFeed Crossword?\n\
Who Is Your Lord Of The Rings Alter Ego?\n\
Today's BuzzFeed Crossword, 7/19\n\
Can You Solve The Toughest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 7/14\n\
Today's BuzzFeed Crossword, 7/13\n\
Today's BuzzFeed Crossword, 7/12\n\
Can You Finish The Hardest BuzzFeed Crossword Of The Week?\n\
Can You Figure Out The Theme Of Today's Topical BuzzFeed Crossword?\n\
Today's BuzzFeed Crossword, 6/29\n\
Today's BuzzFeed Crossword, 6/28\n\
Today's BuzzFeed Crossword, 6/27\n\
Can You Solve The Hardest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 6/23\n\
Today's BuzzFeed Crossword, 6/22\n\
Today's BuzzFeed Crossword, 6/21\n\
Today's BuzzFeed Crossword, 6/20\n\
Can You Solve The Hardest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 6/16\n\
Today's BuzzFeed Crossword, 6/15\n\
Today's BuzzFeed Crossword, 6/14\n\
Today's BuzzFeed Crossword, 6/13\n\
Can You Solve The Hardest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 6/9/16\n\
Today's BuzzFeed Crossword, 6/8/16\n\
Today's BuzzFeed Crossword, 6/7/16\n\
9 Incredible Women Who Spent Their Lives Fighting To Change America\n\
Here Are The 2016 National Book Award Winners\n\
Michael Chabon Is An Underdog On Top Of The World\n\
What Scared Young LGBT People Need To Hear Right Now\n\
Read This Excerpt From Michael Chabon's New Novel Moonglow\n\
Poem: Partial Hospitalization By Donika Kelly\n\
17 Essays And Stories On How We Ended Up In Trump's America\n\
Why “The Walking Dead” Has Become Fanfiction’s Muse\n\
He Became A Citizen To Vote. Now He Fears A Bigot In Power\n\
Here's How Parents Explained The Election To Their Kids\n\
How People Magazine Came Home To The Minivan Majority\n\
What Women Who Condemned Trump's Sexism Do Now\n\
We Will Get Through A Trump Presidency Together\n\
Here’s What I’m Telling My Brown Son About Trump’s America\n\
The Day After The Election, I Told My Daughter The Truth\n\
I Will Teach My Children To Survive The New America\n\
George R.R. Martin Responds To Trump Win, Says Winter Is Coming\n\
Poem: You're Dead, America By Danez Smith\n\
Anti-Semitism Has Emerged From The Shadows, And It's Not Going Back\n\
17 Things To Read And Watch To Get You Through This Day\n\
Here's How Famous Writers Are Reacting To Trump Being Elected\n\
What Is America So Afraid Of?\n\
Meet The Ivanka Voter\n\
This Is How Much America Hates Women\n\
17 Poems To Read When The World Is Too Much\n\
Don’t Cry For Ivanka — Fear Her\n\
How The Biggest Movies Have Aligned Themselves As Politically Important\n\
The New Evangelical Woman Vs. Trump\n\
Waiting For This Election To End Might Kill Me\n\
How Well Do You Remember The Words To The Education Connection Commercial?\n\
16 Classic Thanksgiving Episodes Of TV Shows That Aren't Friends\n\
The Harry Potter Fandom Is At A Crossroads\n\
How Well Do You Remember The Simpsons Episode Bart Vs. Thanksgiving?\n\
11 Times Negan And Lucille Were Relationship Goals\n\
We Know Your Birth Month And Last Person You Texted From Disney Channel Questions\n\
Can You Pick The Decade These Barbies Are From?\n\
9 Questions Every Gilmore Girls Fan Should Be Able To Answer Immediately\n\
Just A Bunch Of Really Glam Photos From The Gilmore Girls Premiere\n\
Eddie Redmayne's Childhood Headshot Proves He Hasn't Changed At All\n\
67 Of The Best Real Housewives Quotes Of All Time\n\
12 Disney Movies That Have Horrifying Origin Stories\n\
There's A New Gilmore Girls Trailer, And Coffee Is Definitely In It\n\
Which Despised Harry Potter Character Do You Resemble?\n\
What % Draco Malfoy Are You?\n\
11 Practically Impossible Questions For '90s Kids\n\
We Know Which Continent You Live On Based On This Harry Potter Quiz\n\
How Old Were These Actors When They Played Teens?\n\
Can You Guess The Harry Potter Term From Just A Few Letters?\n\
Can You Remember These Harry Potter Acronyms?\n\
19 Pictures That Prove Asos Is Conspiring To Turn Everyone Into Paris Hilton\n\
The Little Mermaid Is 27 Years Old And Eric Is Still Hot AF\n\
This Is What Disneyland's Opening Day Looked Like In 1955\n\
32 Pictures Every Guy Between The Ages Of 22 And 29 Will Definitely Recognize\n\
19 People Who Are Still Not Over The Travesty That Were Padma And Parvati's Yule Ball Outfits\n\
We Know Which Aussie Reality Show You Should Go On\n\
22 Things That Made 2006 Different From 2016\n\
Which Harry Potter Villain Should You Bang?\n\
Can You Pick The Harry Potter Movie With The Lowest IMDb Rating?\n\
Arctic Sea Ice Is Freakishly Low Right Now\n\
WHO: Zika No Longer A Public Health Emergency Of International Concern\n\
17 Jokes That Are Way Too Real For People Who Get UTIs\n\
The Tribe That’s Suing The US Government To Keep Its Promises\n\
28 Reasons People Really Use Birth Control\n\
Mom Sues Her Trans Teen Over Medical Transition\n\
This Anti-Abortion Activist Denies His Secret Videotapes Sparked Clinic Shootings\n\
Drugs Are Getting Into Our Rivers, And That's Bad News For The Fight Against Antibiotic Resistance\n\
These Tech Companies Have The Most Generous Fertility Benefits, Poll Says\n\
Is This Man Smart Enough To Face The Death Penalty?\n\
The Supermoon Is A Lie\n\
A Supermoon Graced The Skies Overnight But Australians Are Massively Underwhelmed\n\
17 Facts About Toenails That Make You Go Oooh And Ew\n\
Meet The Immigrant Scientists Spooked By A Looming Trump Presidency\n\
How One Man’s Swim In Antarctic Waters Convinced The Russians To Save The Whales\n\
What Trump’s Not Saying About His Infrastructure Plan: It Includes Oil Pipelines\n\
After Trump Win, Suicide Hotlines Flooded With Calls\n\
Even Washington State Couldn’t Pass A Carbon Tax\n\
Trump And Nuclear Weapons: Here’s What’s At Stake\n\
Human Leprosy From The Middle Ages Has Been Found In British Red Squirrels\n\
Get Used To High Drug Prices As Big Pharma Emerges From Election Stronger Than Ever\n\
Here Are The Leading Theories On Why The Polls Went So Wrong\n\
Soda Taxes Pass In Four Cities, Dealing Blow To Big Soda\n\
Under President Trump, What Will Happen To Climate Policy?\n\
People Are Tweeting About Getting IUDs While They're Still Covered\n\
Scientists And Doctors Are Freaking Out About A President Trump\n\
This Is Where The Sky Is Dark Enough To See The Milky Way In The UK\n\
Here's What Everyone Got Wrong About That Male Birth Control Study\n\
Almost Half Of Medical Trials Are Never Published And It's Hurting Patients\n\
Here's Yet Another Reason To Love Kristaps Porzingis\n\
People Tried Stabbing An Olympic Fencer And Pretty Much Got Owned\n\
The Story Behind The Chicago Cubs Curse\n\
People Joked About What The World Was Like The Last Time The Cubs Won A World Series\n\
We Know If The Cubs Are Going To Win Tonight\n\
Cubs Clobber Indians, Forcing A Do-Or-Die Game 7 Of The World Series\n\
Can We Guess Your Favorite NBA Team With 10 Questions?\n\
Non-Athletes Tried Olympic High Diving And Things Didn't Go Well\n\
How Trash Is Your Understanding Of Football?\n\
An NFL Player Dressed As Harry Potter For A Press Conference And It Was Perfect\n\
Usain Bolt Challenged BuzzFeed Employees To Try And Beat His Fastest Time\n\
This NFL Player's Harambe Shoes Are Iconic\n\
Aaron Rodgers Wore The Lebowski Sweater Last Night And People Loved It\n\
Indians Pitcher Forced To Leave ALCS Game After His Finger Starts Bleeding Profusely\n\
LA Dodgers' Adrian Gonzalez Refused To Stay With Team At A Trump Hotel\n\
We Pranked Regular People Into Playing Paintball With Professionals And It Was Terrifying\n\
Maria Sharapova's Doping Ban Cut From Two Years To 15 Months\n\
Baseball Broadcast Legend Vin Scully Has Announced His Last Game\n\
Serena Williams Says She Won't Be Silent About Police Killings Of Black Men\n\
Jose Fernandez's Teammate Hit The Most Heartbreaking Home Run Ever\n\
Golfer Arnold Palmer Dies At Age 87\n\
Miami Marlins Pitcher José Fernández Dies In Boating Accident\n\
Marshawn Lynch Would Rather See Kaepernick Take A Knee Than Stand Up And Get Murdered\n\
This NFL Announcer Describing A Dude Running On The Field Is Seriously Hilarious\n\
Cleveland Browns' Andrew Hawkins Says Kaepernick's Protest Is Super Courageous\n\
These 1500-Meter Paralympian Runners Were So Fast That Their Fourth-Place Time Would Have Won Gold At The Rio Olympics\n\
Hello Everyone, Jimmy Garoppolo Is Hotter Than Tom Brady\n\
We Need To Talk About Aaron Rodgers\n\
Football Fans Threw Stuffed Animals To Sick Children Sitting Below Them At A Game\n\
A Company Invented Shoes That Are The Answer To Every High Heel Problem Ever\n\
14 Charts Anyone Who Sucks At Hair Will Appreciate\n\
24 Gifts For People Who Only Wear Black\n\
15 Mortifying Social Media Horror Stories That'll Have You Cringing For Days\n\
Watch 100 Years Of French Beauty In Under 2 Minutes\n\
Someone Figured Out A Hack To Make Super-Cool Disney Princess Eyeshadow Palettes\n\
The Clothing Line For Spirited Away Is As Magical As It Sounds\n\
As A Woman Who Hated My Cellulite, I Went On A Mission To Learn To Love It\n\
Apple Brought The Peach Butt Emoji Back, Thank God\n\
28 Best Friend Tattoos That Will Make You Want To Call Your Bros\n\
Barbie Just Made An Ashley Graham Doll That Matches Her Measurements\n\
You Need To See This New Amazing Hologram Lip Trend\n\
How To Get Your Fine Or Thick Hair Into An Afro Puff\n\
34 Gifts For People Who Love Air Jordans\n\
15 Reasons Jealous Best Friends Are Actually Better Than Your Other Friends\n\
27 Inexpensive Boots You'll Want To Wear All Winter\n\
27 Men's Style Charts That'll Help Every Man Look Good AF\n\
27 Reasons Why You Need To Check Out Sephora's VIB Sale Right Now\n\
28 Gifts For Anyone Obsessed With Chokers\n\
18 Holy-Grail Beauty Products These Gorgeous Makeup Gurus Swear By\n\
Sorry, This Is The Hardest Game Of Facial Hair Would You Rather You'll Ever Play\n\
30 Highly Rated Forever 21 Items That People Actually Swear By\n\
Here’s Proof That Getting Your Eyebrows Done Makes A Big Difference\n\
We Know How Many People You've Slept With And Your Relationship Status Based On Your Favorite Color\n\
17 Photos Might Help You Feel A Little Better About The World Today\n\
31 Unexpected Engagement Rings That Are Perfect For The Holidays\n\
Hillary Clinton Just Posted Her Own #MannequinChallenge On A Plane\n\
19 Pantsuits That Will Make You Feel Powerful\n\
Here’s The Deal With The Magical Peeling Face Gel Everyone Loves\n\
Here's How Much Uber Drivers Make, According To A New Uber Report\n\
This Is What Happens When Millions Of People Suddenly Get The Internet\n\
Now You Can Post Live Video On Instagram\n\
These Are The Most Retweeted Tweets Of The Election\n\
You Can Now Book Guided Tours And Local Meetups On Airbnb, Too\n\
The Anti-Defamation League Has New Demands For Twitter And Facebook\n\
Adult Swim Talent Want The Network To Cancel Its Alt-Right Comedy Show\n\
Promoted Tweet For Nazi Site Highlights Twitter's Opaque Enforcement Policies\n\
This Analysis Shows How Fake Election News Stories Outperformed Real News On Facebook\n\
Twitter Cracks Down, Banning Prominent Alt-Right Accounts\n\
Tech Diversity Advocates: Self-Segregation Happens Offline, Too\n\
Google's New PhotoScan App Might Make Your #TBTs Better\n\
Former Comms Lead For Schmidt, Zuckerberg And Musk Pledges To Fight Trumpism\n\
These Tech Companies Have The Most Generous Fertility Benefits, Poll Says\n\
Twitter Rolls Out New And Long-Awaited Anti-Harassment Tools\n\
Lyft Kills The Pink Mustache And Launches National Ad Campaign Against Uber\n\
Trump Digital Director: Twitter Killed Ad Buy Critical Of Hillary Clinton\n\
The Future Of Organized Labor Could Be This Artificially Intelligent Bot\n\
Facebook Survey Is Asking Users About Fake Information Problem\n\
Trump Fundraiser: Facebook Employee Was Our MVP\n\
Trump-Supporting CEO Kicked Out Of Y Combinator Startup Incubator\n\
Do You Know What Happened In Tech The Week Of The Election?\n\
Facebook Acquires Key Software Tool Used To Keep It Accountable\n\
Donald Trump’s Phone Could Be A National Security Crisis\n\
A Ton Of People Are Now Listed As Dead On Facebook\n\
Mark Zuckerberg Says Fake News On Facebook Didn’t Change The Election\n\
Facebook And Twitter Didn’t Fail Us This Election\n\
After Trump’s Election, Women Are More Worried About Diversity In Tech\n\
GrubHub CEO Suggests That Employees Who Agree With Trump's Rhetoric Should Resign\n\
14 Magically Cosy Hideaways You Won't Believe Are In Scotland\n\
14 Tweets That Will Remind You Why You Love And Hate Hotels\n\
19 Mesmerizing Photos Of Rice Terraces That Speak For Themselves\n\
This Quiz Will Prove If You're Actually From Minnesota\n\
Which State With Legalized Weed Should You Take A Vacation In?\n\
Can We Guess Your Age And Birth Order From Your Dream Vacation?\n\
Where Should You Travel Next Based On Your Zodiac Sign?\n\
21 Reasons Everyone Should Move To Scotland Immediately\n\
25 Amazing And Affordable Treehouses You'll Want To Rent For Your Next Vacay\n\
26 Reasons Why Sweden Rules At Winter\n\
28 Haunting Photos That Prove Scotland Is Even More Beautiful At Night\n\
29 Instagram-Worthy Places To Travel\n\
38 Photos That'll Make You Want To Book A Trip To Thailand Right Now\n\
19 Road Trip Games That'll Make Car Rides So Much More Fun\n\
23 Squad Travel Pics That Will Make You Pack Your Bags\n\
26 Things Only Washington, DC Area Natives Will Relate To\n\
16 Reasons To Believe In Believeland\n\
16 Places That Prove Chile Is Too Good For This World\n\
33 Reasons To Stay The Hell Out Of Quebec\n\
17 Things To Do In San Francisco If You're In A Rut\n\
17 Scenic Orchards To Go Apple Picking Around NYC\n\
These 100-Year-Old Colour Portraits Of New York Immigrants Reveal Incredible Outfits\n\
The Northern Lights In Iceland Were Extra Amazing When Street Lights Were Switched Off\n\
24 NYC Foods That Just Taste Better In Fall\n\
Look At These Surfing Dogs Enjoying Their Best Goddamn Lives\n\
17 Products That Will Help You Finally Get Your Shit Together\n\
21 Of The Most Important Photos This Week\n\
25 Incredible Pictures That Will Change Your View Of History\n\
Can You Get 15/20 In This Flag Or Not A Flag Quiz?\n\
Ryan Reynolds' Story About Realising That Blake Was The One Will Destroy You\n\
17 Of The Greatest Love Stories Ever Told\n\
I'm All About Gender Equality, And I Wanted My Wedding To Be Too\n\
Ryan Seacrest's Sister Got Married And He Was The Man Of Honor\n\
33 Unbelievably Gross Confessions About Relationships\n\
J.Crew Is Getting Rid Of Its Bridal Collection And Everything Is On Sale Now\n\
Here Are The First Pics From Michael Phelps' Wedding\n\
This Flower Grandpa Is The Cutest Thing You Will See Today\n\
A Metal Band Crashed A Couple's Engagement Shoot And It's So Perfect\n\
People Are Obsessed With This Insanely Stylish 86-Year-Old Bride\n\
This Couple Hilariously Recreated Their Wedding Photos At Target\n\
17 Quirky Wedding Photos That Will Make You Feel Things\n\
This Guy Made A Harry Potter Pensieve As A Wedding Gift For His Wife\n\
How Many Words Can You Make From The Letters In “Wedding”?\n\
23 Mouth-Wateringly Delicious Food Ideas That'll Change The Wedding Game\n\
Now You Can Get Married In Disney World's Magic Kingdom At Night\n\
27 Ridiculously Pretty Wedding Dresses That'll Make You Forget All Your Worries\n\
These Disney Princess Engagement Photos Are What Dreams Are Made Of\n\
The Luckiest Couple Ever Got Photobombed By Tom Hanks At Their Wedding\n\
I'm A Bride Whose Hair Is A Jerk, And I Found 3 Hairstyles Even I Couldn't Ruin\n\
27 Vintage Wedding Photos That'll Hit You Right In The Feels\n\
What Celebrity Couple Are You And Your Significant Other?\n\
We Know How Many Times You'll Be A Bridesmaid Before You Get Married\n\
17 Underrated Honeymoon Destinations You'll Want To Stay At Forever\n\
Angela Bassett And Courtney B. Vance Have BEEN Relationship Goals\n\
Beyoncé Arranged A Flawless Onstage Proposal For One Of Her Backup Dancers\n\
This Airbrushed Wedding Dress Is Going To Take Over Your Pinterest Feed\n\
This Couple Married 57 Years Did A Photo Shoot Inspired By The Notebook\n\
Which Version Of Say Yes To The Dress Should You Be On?\n\
Tsunami Warning Canceled After Powerful Earthquake Hits Japan\n\
A Trump Adviser Was Photographed Holding A Plan To Question Immigrants About Sharia Law\n\
Argentine Presidential Spokesperson: Trump Did Not Bring Up Tower Project In Call\n\
Meet The New Favorite To Become The Next President Of France\n\
Twitter Saved This Guy From Accidentally Eating A Super Poisonous Fish\n\
This Is What It's Like Being The Only Medico In An Isolated Syrian Town\n\
Nicolas Sarkozy Will Not Be The Next French President After A Bruising Primary Loss\n\
This Is What Happens When Millions Of People Suddenly Get The Internet\n\
All Remaining Hospitals In Eastern Aleppo Have Been Destroyed By Airstrikes\n\
How Nicolas Sarkozy Went From Fierce Putin Critic To Ardent Admirer\n\
This Is How Ground Troops In Mosul Are Calling US Airstrikes On ISIS\n\
Facebook Has A Team Looking Into Getting Fake News Off Your News Feed\n\
Another Controversial Trump Pick Gets Mixed Reviews From The National Security World\n\
German Spies Are Alarmed Over Threat To Election From Fake News And Russians\n\
79 Countries That Have Already Had Their First Female Leader\n\
Man Who Went Missing In Asia Found Casually Playing Bongos In Thailand\n\
These Striking Images Show Indian Women Shaving Their Heads In The Name Of Religion\n\
Deadly Irukandji Jellyfish Probably Killed French Tourists, Says Doctor\n\
Lawmakers Want To Halt Changes That Would Allow Trump Wider Hacking Abilities\n\
What We Know — And Don't — About A Trump Adviser's Ties With Turkey\n\
Rudy Giuliani Was Paid Millions To Make Mexico City Safer And It May Not Have Worked\n\
Director Of National Intelligence Jim Clapper Resigns\n\
Trump Will Work Very Closely With Theresa May, Says Former Campaign Manager\n\
This Experiment By Redditors Proves You Shouldn't Believe Anything Sent On Your Family WhatsApp Group\n\
Everything You Need To Know About The Blazing Dumpster Fire That Is French Politics\n\
This Is How Facebook Is Radicalizing You\n\
A British Woman Who Reported She Was Raped In Dubai Is Facing Criminal Charges\n\
Australia Cold-Called Donald Trump By Getting His Number From A Famous Golfer\n\
New Zealand's Earthquake Literally Lifted The Sea Floor 2 Metres Into The Air\n\
11 Smart Meal-Prep Tips That Pro Chefs Want You To Know\n\
Sorry, But Whataburger Is Better Than In-N-Out And Shake Shack\n\
Which French Fry Must Go?\n\
You Haven't Lived Until You've Tried Fluff\n\
24 Tips That Will Make You A Better Chef\n\
22 Kind Of Fascinating Pictures Of Fruit And Vegetables\n\
15 Delicious Soups To Keep You Warm And Cozy This Winter\n\
Which Vegetable Must Go?\n\
Do You Actually Know More Than 4 Middle Eastern Foods?\n\
We Got Drunk At A Game Of Thrones Bar And Didn't Die\n\
16 Incredibly Easy One-Pot Chicken Dinners You Need To Eat\n\
What Kind Of Bread Are You Based On Your Zodiac Sign?\n\
10 Vegetarian Tacos That Will Change Your Life\n\
This Food Quiz Will Reveal When Your Period Will Start\n\
Taco Bell Is Releasing Fried Chicken Shell Tacos And They Are Breathtaking\n\
Watching These Cookies Being Iced Is Immensely Soothing\n\
12 Salads Even Your Lazy Ass Can Make In 2017\n\
12 Brilliant Uses For Ice Cube Trays\n\
We Know How Many Kids You'll Have Based On Your Food Choices\n\
16 Mouthwatering Ways To Make Great Indian Food At Home\n\
12 Waffles That Are Too Beautiful To Believe\n\
28 Insanely Sweet Things For Sugar Addicts\n\
11 Gluten-Free Desserts That Taste Like A Million Bucks\n\
Create A Sandwich And We'll Reveal A Deep Truth About You\n\
Can We Guess Your Age And Location Based On Your Starbucks Drink Order?\n\
12 Insanely Delicious Pizzas That Are Better Than Takeout\n\
These Are The Food Trends You Should Try In 2017, According To Pinterest\n\
21 Things That'll Make You Say, Damn I'm Hungry\n\
A Dude Tried To Troll This Supermarket's Twitter Account And Things Got Weird Fast\n\
23 Ways To Trick People Into Thinking You Hired An Interior Decorator\n\
22 Surprising Products You Won't Believe Actually Work\n\
23 Clever Products That'll Save You Money In The Long Run\n\
Can You Get Through This Post Without Spending $50?\n\
30 Disney Decorations That Are Straight-Up Magical\n\
A Woman Built A House For Her Kids Using YouTube Tutorials And It's Pretty Amazing\n\
11 Ways Your Broke Ass Can Actually Save Money In 2017\n\
27 Cheap Ways To Upgrade Your Home\n\
All The Best Deals On The Internet This Weekend\n\
All The Best Deals On The Internet Today\n\
21 Easy Ways To Save Money This Month\n\
20 Awesome Products From Amazon To Put On Your Wish List\n\
All The Best Deals On The Internet Today\n\
42 Products On Amazon Our Readers Are Loving Right Now\n\
All The Best Deals On The Internet Today\n\
Here’s What People Are Buying On Amazon Right Now\n\
21 Things That'll Make You Say, Damn I'm Hungry\n\
28 Bedding Sets That Are Almost Too Cool To Sleep On\n\
All The Best Deals On The Internet Today\n\
32 Things That'll Make Even The Tiniest Apartment Feel Roomy\n\
What Kind Of Countertops Should Your Dream Home Have?\n\
8 Life-Changing Things To Try In January\n\
28 Secrets For Shopping Online That Will Blow Your Mind\n\
19 Natural Home Cleaners People Actually Swear By\n\
23 Genius Solutions To Issues Every Car Owner Faces\n\
13 Ways To Not Kill Your Indoor Plants\n\
33 Minimalist Home Products That'll Soothe Your Soul\n\
29 Impossibly Satisfying Products That Actually Exist\n\
37 Seriously Amazing Tips Every Clean Freak Needs To Know\n\
This Dog Quiz Will Reveal A Deep Truth About You\n\
How Well Can You Identify Commonly Confused Dog Breeds?\n\
23 Afghan Hounds That Are More Glam Than You\n\
19 Reasons Kangaroos Should Be Your Ride Or Die\n\
A Wonderful Thing Happened On Tumblr And Now People Are Making Their Lizards Tiny Hats\n\
People Have Giant Cats Living In Their Houses And Oh My Goodness\n\
Sorority Girls Just Realized They Pose Exactly Like Meerkats And It's Too Good\n\
17 Batshit Things That Have Already Happened In Australia In 2017\n\
This Mom Kicked Out Her Son After He Brought Home A Puppy\n\
Our Animal Newsletters Will Improve Your Life In 2017\n\
Which Madagascar Character Are You Based On Your Zodiac Sign?\n\
People Love This College Student Who Smuggled His Dog Back To School\n\
People Just Realized What Owls Look Like Without Feathers And OMG\n\
Which Disney Horse Are You Based On Your Zodiac Sign?\n\
Scientists On Twitter Made An Important List Of Animals That Fart And Puke\n\
23 Tattoos For People Who Just Fucking Love Animals\n\
A Shelter Held An Ugly Sweater Party For Animals And It'll Warm Your Cold Heart\n\
18 Things Only True Cat Lovers Know To Be True\n\
18 Dogs On Tumblr Who Are Almost Too Perfect To Be Real\n\
21 Incredibly Dickish Things Cats Really Seem To Enjoy Doing\n\
13 Happy Little Things To Make You Smile This Week\n\
18 Pictures Of Samoyeds Just Being Their Perfect Selves\n\
14 Moments You'll Only Get If You Have A Small Dog\n\
22 Pictures That Will Make You Say Damn Nature, You Scary\n\
19 Wiener Pics You’d Actually Like To Receive\n\
This Inconsolable Horse Was Beside Itself At Its Owner's Funeral\n\
Move Over Hello Kitty, Sanrio Just Created Its Greatest Character Yet\n\
23 Pictures That Prove Lizards Are Very Good Boys\n\
Someone Tried To Mail Snakes And Nope You Can't Do That\n\
11 Ways To Kick Butt In 2017\n\
Read The Full Transcript Of BuzzFeed's Interview With Susan Rice\n\
12 Gifts Of Hair Wisdom To Help You Glow\n\
9 Beyoncé Would You Rather Questions That Will End You\n\
11 Life Lessons We Learned From Janet Mock\n\
13 Times Representation Mattered In Books\n\
11 Things To Know About Native Resistance To #DAPL\n\
How Michigan Muslims Voted\n\
Listen To Four American Muslims Talk About Trump's Victory\n\
Book Recommendations That Will Get You Through The Next Few Weeks\n\
10 Ways To Start Living Your Best Life Right Now\n\
Another Round, Episode 64: Live In Philly\n\
Another Round, Episode 63: Heben's Husband (with Jaime Camil)\n\
Another Round, Episode 62: Put Your Mask On First\n\
Another Round, Episode 61: The Greatest\n\
Another Round, Episode 60: Down With Sporks\n\
Another Round, Episode 59: May She Forever Reign\n\
Another Round, Ep. 58: The Job Of Pettiness\n\
I Was A Thirsty Male Feminist For A Day And It Was Exhausting\n\
16 Books We Fell In Love With As Young Black Girls\n\
What Happens When You Try To Follow The Rules™ In Real Life?\n\
F@*K, Marry, Kill: Woke Men, Republican Candidates, And White Baes\n\
Melissa Harris-Perry On Her Split With MSNBC: I Am Not A Civil Rights Case\n\
14 Things You Never Knew About Hamilton's Lin-Manuel Miranda\n\
This Is What Lin-Manuel Miranda Said To Kanye When He Saw Hamilton\n\
Another Round, Episode 44: Mommy's Side Piece\n\
Another Round, Episode 43: A Gumbo Of Afrofuturism\n\
Here's How W. Kamau Bell Talks About Race With His Kids\n\
Someone Appears To Have Stolen This Woman's Photos And Is Using Them To Troll People\n\
This Controversial Company Wants To Disrupt The Birth World\n\
The People You Needed To Read About In 2016\n\
Ivan Wilzig's God Complex\n\
The Ballerina Who Accused Her Instructor Of Sexual Assault\n\
The LAPD Says It Won’t Work With Feds On Deportations, But It Already Does\n\
The Murder Case That Could Foreshadow The Future Of Abortion Under Trump\n\
How Simple Is That?: At Home With Ina Garten\n\
Michael Chabon Is An Underdog On Top Of The World\n\
The Little-Known Law That Put A Man Behind Bars Twice For The Same Shooting\n\
The New Breed Of Sci-Fi That's Saving Hollywood From Itself\n\
A Year After The Photo That Changed Devin Allen's Life, He's Trying To Line Up His Next Shot\n\
The Slow Fade Of Tom Hanks\n\
Hyperpartisan Facebook Pages Are Publishing False And Misleading Information At An Alarming Rate\n\
Polls, Damn Polls, And Statistics\n\
Inside The Bloody Drive Toward Mosul\n\
Inside The Strange, Paranoid World Of Julian Assange\n\
Meet Fancy Bear, The Russian Group Hacking The US Election\n\
How Santeria Brings Hope To The New Yorkers Who Need It Most\n\
An Exclusive And Completely Factual Snapshot Of Donald Trump's Speech Notes\n\
Meet The Charming, Terrifying Face Of The Anti-Islam Lobby\n\
Would You Give This Man $100 Million?\n\
Meet The Muslim YouTuber Who's Proving Modesty Can Be Fashionable\n\
Sheldon Johnson Wants to Go Straight, But The Past Won’t Let Go\n\
Killer Robots Are Coming And These People Are Trying To Stop Them\n\
The Most Mysterious Stories You Can't Miss This Week\n\
Dee Dee Wanted Her Daughter To Be Sick, Gypsy Wanted Her Mom Murdered\n\
How A 125-Year-Old Mass Lynching Tried To Make America Great Again\n\
The Stories We're Digging This Week\n\
The Most Dramatic Stories You Can't Miss This Week\n\
Law Vs. Order: How An Albuquerque DA Took On Her Own Police Department And Lost Everything\n\
How Sulcata Tortoises Became America's Most Adorable Mistake\n\
We Found These Qaddafi Henchmen Wanted For Stealing Millions Living In Britain\n\
Where Did Drake’s “Jamaican” Accent Come From?\n\
How Donald Trump Broke The Conservative Movement (And My Heart)\n\
The Biggest Stories You Can't Miss This Week\n\
“That’s How We Survive: When Police Brutality Turns Mothers Into Activists\n\
How Tessa Thompson Became A Modern Marvel\n\
Meet The Workers Who Sewed Donald Trump Clothing For A Few Dollars A Day\n\
Stop Conflating Activists With Assassins, Black Leaders Tell Police\n\
Democrats Grilled The FBI Director On Clinton And Weiner Investigations\n\
Ringling Bros. Circus Is Shutting Down After 146 Years\n\
Here's What One Cancer Survivor Wants You To Know About Obamacare\n\
Here's Everything And Everyone Trump Has Attacked On Twitter Since The Election\n\
Jenna Bush Hager Shared Some Photos Of The Obama Girls' First White House Visit\n\
Which Of These Harry Potter Things Has To Go?\n\
Can You Identify A Writer By Reading One Random Paragraph?\n\
16 Tips To Make 2017 Your Best Year Ever Using Just A Pencil And A Notebook\n\
27 Books Every Woman In America Should Read\n\
21 Hilarious Tweets About Books Guaranteed To Make You Laugh\n\
To Understand The Rust Belt, We Need To See Beyond Whiteness\n\
The 32 Most Exciting Books Coming In 2017\n\
This 4-Year-Old Has Read More Than 1,000 Books, So You Should Just Go Home Now\n\
A Woman Built A House For Her Kids Using YouTube Tutorials And It's Pretty Amazing\n\
The First Episode Of A Series Of Unfortunate Events Has A Surprise Ending\n\
16 Things You Don't Know About Netflix's A Series Of Unfortunate Events\n\
11 Indigenous Authors You Should Be Reading Instead Of Joseph Boyden\n\
18 Things You Need To Know Before Watching Netflix's A Series Of Unfortunate Events\n\
Poem: Barbershop By Phillip B. Williams\n\
25 Amazingly Clever Ways To Display Books In Your Home\n\
15 Literary Baby Names That’ll Make You Want To Have Children\n\
What's The Best Book To Read While Travelling?\n\
How Obsessed With Books Are You Actually?\n\
George R.R. Martin Thinks Winds Of Winter Will Be Out In 2017\n\
Which Harry Potter Character Must Go?\n\
This Professor Bought A Book That She’d Previously Owned Years Ago\n\
OMG, The First Trailer For The Handmaid's Tale Couldn't Be Creepier\n\
19 Medieval Doctors Who Need To Explain Themselves\n\
Which Marvel Character Must Go?\n\
6 Gorgeous New Covers For Russian Literary Classics\n\
Here Are The TV Shows Based On Books Premiering In 2017\n\
The True Story Of My Teenage Dirtbag Fight Club\n\
Can You Go 30 For 30 On This Insanely Difficult Spelling Test?\n\
Most Women In Publishing Don’t Have The Luxury Of Being Unlikable\n\
A Legal Fight In New York Could Cause Big Headaches For Uber\n\
Amazon And FreshDirect Will Start Accepting Food Stamps\n\
Loss-Making Zenefits Plans A Paid Software Tier\n\
Here's What Happened To Workers In The Obama Era\n\
Fiat Chrysler Accused Of Cheating On Emissions Rules\n\
Here's What Will Happen To The Trump Organization After Jan. 20\n\
This Is Where All Your Online Shopping Returns End Up\n\
Backpage Takes Down Adult Ads Section, Citing Government Censorship\n\
Hundreds Of College Programs Could Be Shut Down For Breaking Student Debt Rules\n\
Theranos Has Cut 70% Of Staff In The Last Three Months\n\
Facebook's New Head Of News Has Close Ties To Conservative Politics\n\
Here's All The Places Getting Minimum Wage Increases In 2017\n\
Macy's Will Close 68 Stores And Cut More Than 10,000 Jobs\n\
Donald Trump Is Already Causing An Economic Bloodbath In Mexico\n\
This Controversial Company Wants To Disrupt The Birth World\n\
Uber Driver Beat Up Rider Who Asked To Go To New Jersey, Lawsuit Alleges\n\
Ford CEO Says He Wants Close Ties To Mexico Despite Trump Call\n\
College Will Be Free In New York Under New Plan\n\
Ford Cancels $1.6 Billion Plan To Build New Factory In Mexico\n\
The Force Behind Minimum Wage Protests Is Slashing Its Spending\n\
First It Was A Typo In Congress — Now It Will Cost Real Jobs\n\
Meet Silicon Valley's Favorite Magician\n\
US Sanctions Mean Paying For Cuban Sandwiches On Venmo Is Complicated\n\
Blac Chyna Is Promoting A Shady Student Loan Ripoff On Instagram\n\
Ikea Reaches $50 Million Settlement After Deaths Of Three Toddlers\n\
Trump Vineyard Seeks More Foreign Workers\n\
Big Pharma Is Coming For Your Facebook And Twitter Feeds\n\
Should Trump Protect Manufacturing Jobs From Automation? We Asked His Supporters\n\
Whenever Oprah Loses Weight Investors Buy More Weight Watchers Stock\n\
Let's Play A Hot Celeb Version Of One Must Go\n\
Which One-Hit Wonder Must Go?\n\
21 Delicious Ways To Transform Any Boring Old Granola Breakfast\n\
Which Of These Harry Potter Things Has To Go?\n\
Which Disney Show Must Go?\n\
12 Tumblr Posts That Prove Just How Incredible Girls Are\n\
This Dog Quiz Will Reveal A Deep Truth About You\n\
Which Fast Food Chain Must Go?\n\
11 Things You Need To Stop Saying To The Token Black Girl At Work\n\
How Do Your Star Wars Opinions Stack Up With Everyone Else's?\n\
Which Chocolate Dessert Must Go?\n\
12 Times Miss Grotke From Recess Was Progressive As Fuck\n\
Admit It, Brendon Urie Is The Sexiest Man Alive\n\
Which Bread Must Go?\n\
15 Things Every Simpsons Fan Will LOL At\n\
Marry, Fuck, Kill: The Guess Who Edition\n\
15 Posts About Black Hair Salons That Are Too Damn Real\n\
18 Funny Posts About Depression That Are Too Fucking Real\n\
14 Impossible Would You Rather Questions For People Obsessed With Sugar\n\
Is This A Bath & Body Works Scent Or My Little Pony?\n\
Can You Match The Simpsons Character To The Quote?\n\
We Know Which Zodiac Sign You Were In A Past Life\n\
How Well Can You Identify Commonly Confused Dog Breeds?\n\
The Hardest Game Of Which Nickelodeon Show Must Go You'll Ever Play\n\
Can You Identify A Writer By Reading One Random Paragraph?\n\
16 Tips To Make 2017 Your Best Year Ever Using Just A Pencil And A Notebook\n\
This 4-Year-Old Has Read More Than 1,000 Books, So You Should Just Go Home Now\n\
Ryan Gosling Watched Footage Of Himself Dancing As A Kid And It Will Melt Your Heart\n\
Yup, These 17 TV Shows Are Turning 20 This Year\n\
24 Things That Nobody Seems To Be Able To Agree On\n\
22 Of The Most Powerful Photos Of This Week\n\
8 Incredible Photo Stories You Absolutely Can’t Miss\n\
17 Celebrity Instagrams You Missed This Week\n\
Which Tasty Recipe Should You Make Based On Your Food Network Preferences?\n\
Which Female Pop Star Is Your Soulmate?\n\
Shocker: Miley Cyrus And Liam Hemsworth Continue To Be The Cutest Couple On The Planet\n\
Seriously DO NOT Look At This If You Hate Joe Jonas Wearing Only Underwear\n\
Build A Burger And We'll Tell You Where You'll Meet The Love Of Your Life\n\
Can You Pick The TV Show With The Longest Title Sequence?\n\
The Best Essays, Poems, And Advice Are In BuzzFeed Reader’s Newsletter!\n\
Can We Guess Which Disney Channel Era You Belong To?\n\
Which Hogwarts Professor Would Definitely Hate You?\n\
Can You Guess The Disney Movie By These Emojis?\n\
Which Harry Potter Home Should You Live In?\n\
Which Ryan Reynolds Character Matches Your Favorite Color?\n\
Let's Play A Hot Celeb Version Of One Must Go\n\
Admit It, Brendon Urie Is The Sexiest Man Alive\n\
Vin Diesel Practically Confirmed That Deepika And Ranveer Are, In Fact, In A Relationship\n\
Ryan Gosling Watched Footage Of Himself Dancing As A Kid And It Will Melt Your Heart\n\
17 Celebrity Instagrams You Missed This Week\n\
Shocker: Miley Cyrus And Liam Hemsworth Continue To Be The Cutest Couple On The Planet\n\
Seriously DO NOT Look At This If You Hate Joe Jonas Wearing Only Underwear\n\
Which Female Pop Star Is Your Soulmate?\n\
SZA Unveiled Her First Single In Almost Three Years And We Are All Blessed\n\
Here's What A Day In The Life Of Ed Sheeran Looks Like\n\
Here's Who's Performing At Trump's Inauguration Concert\n\
The First Episode Of A Series Of Unfortunate Events Has A Surprise Ending\n\
Diego Boneta Ripped His Pants From Droppin' It Low And Blessed Us All\n\
17 Things Celebrities Did This Week\n\
23 Products Every Dangerous Woman Needs In Their Life\n\
Kim Kardashian Fucking Slayed In Her First Official Appearance Since The Robbery\n\
Yara Shahidi Paying Homage To Sade Is Absolutely Delightful\n\
That Controversial Comedy Featuring Joseph Fiennes As Michael Jackson Has Been Pulled\n\
Deepika Padukone Helped Vin Diesel Put On A Veshti, And He Kinda Loved It\n\
Khloé Shut Down This Question About Kim Kardashian's Robbery\n\
Here's How Much The Kardashians Have Changed In 10 Years\n\
The 7 Stages Of Ashlee Simpson Realizing She's Being Photographed In Front Of A Wall Of Cigarettes\n\
One's Gotta Go: The Kardashian Edition\n\
We May Have Figured Out Where Kim's Instagrams Are Coming From\n\
Michelle Obama Surprised A Bunch Of People On Jimmy Fallon And Things Got Emotional\n\
Natalie Portman Was Paid A Third Of What Ashton Kutcher Made For Their 2011 Movie\n\
Which Member Of The British Royal Family Are You?\n\
Billie Lourd Instagrammed Another Beautiful Tribute To Carrie Fisher\n\
Selena Gomez Posed Kinda Nude And It's Pretty Hot\n\
Ryan Gosling Watched Footage Of Himself Dancing As A Kid And It Will Melt Your Heart\n\
18 Hilariously Funny Moments From Whose Line Is It Anyway?\n\
17 Celebrity Instagrams You Missed This Week\n\
The First Episode Of A Series Of Unfortunate Events Has A Surprise Ending\n\
Shocker: Miley Cyrus And Liam Hemsworth Continue To Be The Cutest Couple On The Planet\n\
SZA Unveiled Her First Single In Almost Three Years And We Are All Blessed\n\
Tom Cruise And Katie Holmes Are Not The Inspiration For E!'s New TV Show\n\
16 Things You Don't Know About Netflix's A Series Of Unfortunate Events\n\
Here's How Much The Kardashians Have Changed In 10 Years\n\
Here's Who's Performing At Trump's Inauguration Concert\n\
18 Things You Need To Know Before Watching Netflix's A Series Of Unfortunate Events\n\
Someone Found An Old TV Show With A Con Man Named Trump Who Wanted To Build A Wall\n\
Patriots Day Is The First Movie Of Trump's America\n\
That Controversial Comedy Featuring Joseph Fiennes As Michael Jackson Has Been Pulled\n\
4 Things That Have Changed Since 1998 And 1 Thing That Has Not\n\
The Theme Song For A Series Of Unfortunate Events Is Creepy And Perfect\n\
We May Have Figured Out Where Kim's Instagrams Are Coming From\n\
What It's Like To Suddenly Have The Most Relevant Show On TV\n\
Natalie Portman Was Paid A Third Of What Ashton Kutcher Made For Their 2011 Movie\n\
16 British TV Shows That Would Confuse The Fuck Out Of Americans\n\
Khloe Kardashian Ate A Fish Eye Because James Corden Asked Her If OJ Did It\n\
OMG Guys, Ariana Grande And John Legend Are Recording A Song For Beauty And The Beast\n\
Gus Fring Is Fucking Back In A Los Pollos Hermanos Commercial\n\
Tracee Ellis Ross Won A Golden Globe 44 Years After Her Mom, Diana Ross\n\
Ryan Gosling Is A Star After His Time\n\
Andrew Garfield Explained Why He Made Out With Ryan Reynolds By Making Out With Stephen Colbert\n\
Here's Why Chance The Rapper Doesn't Think You Should Fear Trump\n\
Tom Brady Impersonated The Rock To Let Him Know That He Sent Him Pajamas\n\
George R.R. Martin Thinks Winds Of Winter Will Be Out In 2017\n\
Undressed Is The New Dating Show You Never Knew You Needed To Watch\n\
You Will Not Be The Same After Seeing Joseph Fiennes As Michael Jackson\n\
34 Photos Of The This Is Us Cast Hanging Out In Real Life\n\
The Bachelor” Episode 2: Hold My Boobs\n\
The Perfect Double Feature About Faith For The Trump Era\n\
24 Examples Of Corinne Being The Greatest Bachelor Villain Yet\n\
OMG Beyoncé Interviewed Solange And It's As Good As You Hoped It Would Be\n\
James Corden And Neil Patrick Harris Sang Show Tunes Competetively, And It Was Perfect\n\
Soon You'll Be Able To Scream-Sing Along To Moana In Theaters\n\
Shonda Rhimes Says Scandal Season 6 Isn't Affected By The Election Results\n\
Everything You Need To Know About TV And Movies In 2017\n\
16 Things You Didn't Know About Netflix's Unfortunate Events\n\
Tom Cruise And Katie Holmes Are Not The Inspiration For E!'s New TV Show\n\
Here's Who's Performing At Trump's Inauguration Concert\n\
Here's What A Day In The Life Of Ed Sheeran Looks Like\n\
Neil DeGrasse Tyson Shares Five Mind-Blowing Facts About The Universe\n\
19 Moments From The 2017 Golden Globes That You Should Know About\n\
17 Celebrity Instagrams You Need To See This Week\n\
39 Albums That Will Turn 20 In 2017\n\
Here's What A Day In The Life Of Ed Sheeran Looks Like\n\
OMG Beyoncé Interviewed Solange And It's As Good As You Hoped It Would Be\n\
Fifth Harmony Just Made Camila's Exit Official With A New Group Photo\n\
12 New Anime Series From 2016 To Binge-Watch This Weekend\n\
How Popular Are Your Pokémon Starter Opinions?\n\
Only A Star Wars Expert Can Name All Of These Obscure Toys\n\
Artists Who Love HBO's Westworld Are Making Incredible Fan Art\n\
18 Reasons You Should Be Watching Yuri!!! On Ice\n\
31 Times Dragon Ball Z Horrified The Fuck Out Of You\n\
18 Killer Death Note Items That Are To Die For\n\
10 Video Game Characters That Will Definitely Get You Pregnant\n\
16 Things Only Dragon Ball Z Fans Will Understand\n\
An NFL Player Dressed As Harry Potter For A Press Conference And It Was Perfect\n\
Stop What You're Doing And Look At This Hot Harry Potter Boudoir Shoot\n\
19 Posts About Student Loans That Are Too Fucking Real\n\
15 Painfully Real Pictures Only Students Will Understand\n\
16 Ingenious References You Probably Missed In Luke Cage\n\
What To Do If Comcast Caps Your Internet Data\n\
15 Ridiculously Easy Pokemon Halloween Costumes You Can Make For $30\n\
18 Drawing Tips That Will Inspire You To Pick Up A Pen\n\
People With Disabilities Say What They Want To See In Comics\n\
Rebecca Sugar Has Some Amazing Advice For Aspiring Animators And Artists\n\
The Ultimate Final Fantasy Poll\n\
11 Pokémon Rice Balls That Are Too Cute To Actually Eat\n\
OMG Luke Cage Is The Most Beautiful Thing You'll Ever See In Your Life\n\
Adult Swim Executive's Reddit Account Responds To Report On Lack Of Women Creators\n\
18 Times Tumblr Was Way Too Real For People Who Hate People\n\
How Crap Are Your Disney/Pixar Opinions?\n\
19 Tumblr Posts That Are Way Too Real If You Cry Easily\n\
Mario Is Way Younger Than You Thought\n\
Show Us Your Best Game Of Thrones Halloween Costumes\n\
Which Badass Female Geniuses Do You Most Admire?\n\
19 Things Every New Runner Can Expect\n\
28 Actually Helpful Tips For Dealing With Skin-Picking\n\
If You Score 15/15 On This Quiz You Might Be A Nutritionist\n\
18 Jokes You'll Only Get If You're A Big Ol' Loner\n\
35 Things People With ADHD Want Everyone Else To Know\n\
Here's Why Cancer Experts Want You To Get The HPV Vaccine\n\
Here’s How Obamacare Repeal Could Hurt Native Americans\n\
I Got Botox In My Vagina And It Changed My Life\n\
Woman Charged With Murder For Attempted Coat Hanger Abortion Is Released From Jail Under Plea Deal\n\
13 Things All Unfit Girls Trying To Get Fit Will Understand\n\
22 Cleanses That Will Help You Start 2017 Off Right\n\
Republican Cancer Survivor Tells Paul Ryan He Would Be Dead Without Obama\n\
Trump’s Would-Be Vaccine Commissioner Rallies Anti-Vaccine Groups\n\
17 Texts You Should Send To Anyone Who Gets Migraines\n\
Tell Us About Your Abortion\n\
Sign Up To Take BuzzFeed's 2017 30-Day Get Fit Challenge!\n\
Trump Moves To Challenge Vaccine Science\n\
Here's How To Take The Best Nap Of Your Life\n\
23 Surprising Weight-Loss Tips That Are Actually Doable\n\
22 Helpful Tips For Anyone Who Wants To Sleep Better\n\
A 10-Year-Old Grew Out His Hair For Two Years To Make A Wig For His Friend With Alopecia\n\
Here’s How Big Pharma Plans To Clean Up After Martin Shkreli\n\
Here's Why Your Boobs Aren't Perfectly Symmetrical\n\
Alabama’s Supreme Court Is Letting A Woman Sue Her Doctor For Wrongful Death After A Miscarriage\n\
Workplaces Are Tracking Their Employees' Sleep\n\
How Do You Deal With Hair-Pulling And Skin-Picking Compulsions?\n\
7 Practical Ways To Eat Healthier In The New Year\n\
Halsey Shared This Powerful Message After Surgery For Endometriosis\n\
This Controversial Company Wants To Disrupt The Birth World\n\
This Pregnant Lesbian YouTuber Shut Down Hateful Comments With One Instagram Post\n\
Poem: Barbershop By Phillip B. Williams\n\
Deaths From The Drug GHB More Than Doubled In One Year\n\
Here's Why Cancer Experts Want You To Get The HPV Vaccine\n\
Court Process For Trans Teens Is Inhumane, Says Judge\n\
Gen. Mattis Says He Has No Plans To Repeal LGBT Military Service\n\
The Gay Couple Who Adopted My Baby Are Exactly The Parents I Wanted Him To Have\n\
Chelsea Manning Can't See The FBI's Files About Her, Judge Rules\n\
Jeff Sessions Deflects Questions About His Anti-LGBT Record\n\
Here's What India Thinks Of The Transgender Community\n\
The White House LGBT Liaison Is Worried Trump Will Scrap The Position\n\
20 Times Women Rocked The Red Carpet In Dapper Suits\n\
These Photos Of Older LGBTI Women Celebrate Breaking Beauty Norms\n\
People Are Obsessed With This High Schooler Who Made A Fierce Statement With His T-Shirt\n\
Obama Administration Takes A Last Stand To Protect Transgender Bathroom Rights\n\
Moonlight Director Explains The Importance Of Diverse Storytelling\n\
People Are Telling Trump’s Education Nominee To Protect Rape Survivors\n\
We Tried A Gender Neutral Online Personal Shopper\n\
21 Tweets That Are Just Too Funny If You're The Only Queer Person In The Family\n\
Pauline Hanson Dumps One Nation Party Candidate Over Anti-Gay Comments\n\
Texas And Kentucky File Bills To Restrict Transgender Bathroom Access\n\
Queer Parents: How Did You Come Out To Your Kids?\n\
A Judge Just Suspended Obamacare's Transgender Protections — Here's What That Means\n\
17 People Who Are Determined To Be Even Gayer In 2017\n\
What A Gay College Student's Murder Can Teach Us About Hate In America Today\n\
29 More Of The Gayest Pictures Of LGBT People As Kids\n\
Ellen DeGeneres Confirms Kim Burrell Will Not Be Appearing On Her Show This Week\n\
These Christians Want To Apologise To LGBTI People For The Harm Caused By The Church\n\
11 Smart Meal-Prep Tips That Pro Chefs Want You To Know\n\
This Woman Wants To Change How The World Thinks About Disability\n\
19 Things Every New Runner Can Expect\n\
28 Actually Helpful Tips For Dealing With Skin-Picking\n\
Sorry, But Whataburger Is Better Than In-N-Out And Shake Shack\n\
23 Ways To Trick People Into Thinking You Hired An Interior Decorator\n\
22 Surprising Products You Won't Believe Actually Work\n\
Which French Fry Must Go?\n\
You Haven't Lived Until You've Tried Fluff\n\
27 Of The Best Hostels In Europe, According To Our Readers\n\
This Is The One Question Kids Will Want To Ask Amazon's Alexa\n\
23 Clever Products That'll Save You Money In The Long Run\n\
If You Score 15/15 On This Quiz You Might Be A Nutritionist\n\
Can You Get Through This Post Without Spending $50?\n\
30 Disney Decorations That Are Straight-Up Magical\n\
24 Tips That Will Make You A Better Chef\n\
A Woman Built A House For Her Kids Using YouTube Tutorials And It's Pretty Amazing\n\
11 Ways Your Broke Ass Can Actually Save Money In 2017\n\
18 Jokes You'll Only Get If You're A Big Ol' Loner\n\
15 Life-Changing Laundry Tips You Wish You Knew About Sooner\n\
23 Products Every Dangerous Woman Needs In Their Life\n\
27 Cheap Ways To Upgrade Your Home\n\
33 Beauty Products Under $10 That Are Actually Worth Your Money\n\
All The Best Deals On The Internet This Weekend\n\
35 Things People With ADHD Want Everyone Else To Know\n\
Here's Why Cancer Experts Want You To Get The HPV Vaccine\n\
29 Beautiful Pieces Of Luggage That Only Look Expensive\n\
The New Anastasia Beverly Hills Lip Palette Basically Turns You Into A Lip Artist\n\
Woman Charged With Murder For Attempted Coat Hanger Abortion Is Released From Jail Under Plea Deal\n\
This Food Quiz Will Reveal When Your Period Will Start\n\
Get Ready Because MAC Is Making Lipsticks With Your Fave Makeup Addicts\n\
33 Cute Accessories That'll Melt Even The Coldest Heart\n\
Here's A Look At What Beauty Standards Looked Like Around The World In The 1980s\n\
Quick! Answer These Three Questions And We Will Tell You If You've Ever Been Pregnant\n\
All The Best Deals On The Internet Today\n\
31 Gorgeous Non-Diamond Engagement Rings You'll Totally Fall For\n\
Here's What It's Like To Be A Plus-Size Athlete\n\
21 Easy Ways To Save Money This Month\n\
20 Awesome Products From Amazon To Put On Your Wish List\n\
We Bet Only A Music Major Can Get A 15/20 On This Quiz\n\
SZA Unveiled Her First Single In Almost Three Years And We Are All Blessed\n\
17 Celebrity Instagrams You Missed This Week\n\
Which Early '00s Song Must Go?\n\
23 Products Every Dangerous Woman Needs In Their Life\n\
Here's What A Day In The Life Of Ed Sheeran Looks Like\n\
Here's Who's Performing At Trump's Inauguration Concert\n\
Which Female Pop Star Is Your Soulmate?\n\
Yara Shahidi Paying Homage To Sade Is Absolutely Delightful\n\
Which Throwback R&B Song Must Go\n\
We May Have Figured Out Where Kim's Instagrams Are Coming From\n\
20 OPM Songs That'll Make You Feel Old\n\
Are You More Castle On The Hill Or Shape Of You By Ed Sheeran Based On Your Zodiac Sign?\n\
Here's Why Chance The Rapper Doesn't Think You Should Fear Trump\n\
According To These Pics Of Selena Gomez And The Weeknd Kissing, They Are Dating\n\
26 Brilliant Songs You Need In Your January Playlist\n\
OMG Beyoncé Interviewed Solange And It's As Good As You Hoped It Would Be\n\
The Killers Demand Free Panda Express For Life After Finding Their Lyrics In A Fortune Cookie\n\
Soon You'll Be Able To Scream-Sing Along To Moana In Theaters\n\
19 Hilarious Possibilities For Who Should Be Fifth Harmony's Newest Member\n\
PSA: Calvin Harris Is Brilliantly Bonkers On Snapchat\n\
What Songs Did You Never Realise Were Actually About Sex?\n\
This Drag King's David Bowie Looks Are Incredible\n\
This Music Video Perfectly Captures The Struggles Of Being A Redhead\n\
Donald Glover Says There's No Better Song To Have Sex To Than Bad And Boujee\n\
How Well Do You Know Green Day?\n\
Halsey Shared This Powerful Message After Surgery For Endometriosis\n\
Can You Match The Twenty One Pilots Song To The Blurred Image?\n\
Only A Music Genius Can Score More That 14/16 On This Quiz\n\
A Woman Built A House For Her Kids Using YouTube Tutorials And It's Pretty Amazing\n\
This Is The One Question Kids Will Want To Ask Amazon's Alexa\n\
15 Movies Your Kids Are Definitely Going To Want To See In 2017\n\
This Pregnant Lesbian YouTuber Shut Down Hateful Comments With One Instagram Post\n\
This 4-Year-Old Has Read More Than 1,000 Books, So You Should Just Go Home Now\n\
35 Things People With ADHD Want Everyone Else To Know\n\
Quick! Answer These Three Questions And We Will Tell You If You've Ever Been Pregnant\n\
This Woman Wrote A Powerful Open Letter About Being A Childcare Worker And People Are Loving It\n\
Lauren Conrad Just Posted The Most Adorable Photo Of Her Baby Bump\n\
Unequivocal Proof That Kim Kardashian Makes The Most Adorable Babies On The Planet\n\
The Gay Couple Who Adopted My Baby Are Exactly The Parents I Wanted Him To Have\n\
This Is How Much It Now Costs To Raise A Child\n\
15 Literary Baby Names That’ll Make You Want To Have Children\n\
Soon You'll Be Able To Scream-Sing Along To Moana In Theaters\n\
21 Hilariously Weird Things Overtired Moms Have Done\n\
17 New Parenting Products That Are Impressively Clever\n\
Which '00s Disney Channel Parent Are You?\n\
What's The Funniest Way You've Ever Embarrassed Your Kid?\n\
People Really Think This Beauty And The Beast Doll Looks Like Justin Bieber\n\
15 Things Pregnant Women Are So Damn Tired Of Hearing\n\
This Dad Says He Was Fired For Missing Work To Attend Son's Birth\n\
Queer Parents: How Did You Come Out To Your Kids?\n\
A 10-Year-Old Grew Out His Hair For Two Years To Make A Wig For His Friend With Alopecia\n\
Feeding Your Infant Peanuts May Prevent Peanut Allergies, Science Says\n\
We Covered Random Food In Butter And Marshmallow And Made People Guess What It Was\n\
People Are Totally Trolling This New Spin Bike For Kids\n\
This Controversial Company Wants To Disrupt The Birth World\n\
Reminder That Chrissy Teigen And John Legend Have The Cutest Baby Of All Time\n\
People Are Horrified At This Video Of A Toddler Rescuing His Twin From A Fallen Dresser\n\
More Black Lawmakers Are Considering Boycotting Trump’s Inauguration\n\
Democrats Grilled The FBI Director On Clinton And Weiner Investigations\n\
Congress Is Taking That Anti-Police Painting Down, A Republican Says\n\
David Brock Wants To Build His Own Koch Donor Network\n\
FBI Director's Actions Surrounding Election Face Independent Review\n\
Trump’s Would-Be Vaccine Commissioner Rallies Anti-Vaccine Groups\n\
Marco Rubio Deeply Skeptical of Trump's Secretary of State Nominee\n\
Trump Nominee Says Exxon Didn’t Lobby Against Russia Sanctions, Evidence Suggests It Did\n\
Trump's Top Ally In Congress Wants Investigation Into Dossier Leaker\n\
Chelsea Manning Can't See The FBI's Files About Her, Judge Rules\n\
Ben Carson's Top Adviser Offers To Pay Historical Black College's Way To Inauguration\n\
Fact-Checking Trump's Claim That He Has Very Little Debt\n\
A Key Republican Now Says Senate Will Investigate Election Campaign Links With Russians\n\
US Ebola Czar Calls Trump Badly Misguided On Diseases\n\
Trump, Ryan And McConnell All Offer Different Messages On Obamacare Repeal\n\
Police Worry Radical Trump Backers Will Bring Guns To Inauguration\n\
5 Things To Watch During Rex Tillerson's Confirmation Hearing\n\
Yet Another Congressman Removes Controversial Painting From Capitol Walls\n\
House GOP Group Launches $1 Million Plus Ad Campaign For Obamacare Plan\n\
Trump's Inauguration Will Have Soft Sensuality, Poetic Cadence\n\
Conservative Lawyer Who Fought For Marriage Equality Backs Jeff Sessions\n\
Hispanic Leaders Push Trump Team For A Latino Cabinet Pick In Private Meeting\n\
Jeff Sessions Denies Racism Allegations\n\
Jeff Sessions Says He Would Not Ban Muslim Immigrants Based On Religion\n\
Sessions Says He'll Recuse Himself From Any Investigation Into Hillary Clinton's Emails\n\
The Supreme Court Will Lean Conservative Again\n\
Four Things To Watch For During Jeff Sessions' Confirmation Hearing\n\
Republican Chairman Will Continue Clinton Investigation\n\
Trump Officially Names Son-In-Law Jared Kushner As Senior White House Adviser\n\
Do You Know Which Celebs Are, Like, Probably Scientologists?\n\
Can You Pick The House With The Best Halloween Candy?\n\
We Know Your Age Based On Your Taste In Pop Music\n\
Can You Solve The Huge, Final BuzzFeed Crossword?\n\
Who Is Your Lord Of The Rings Alter Ego?\n\
Today's BuzzFeed Crossword, 7/19\n\
Can You Solve The Toughest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 7/14\n\
Today's BuzzFeed Crossword, 7/13\n\
Today's BuzzFeed Crossword, 7/12\n\
Can You Finish The Hardest BuzzFeed Crossword Of The Week?\n\
Can You Figure Out The Theme Of Today's Topical BuzzFeed Crossword?\n\
Today's BuzzFeed Crossword, 6/29\n\
Today's BuzzFeed Crossword, 6/28\n\
Today's BuzzFeed Crossword, 6/27\n\
Can You Solve The Hardest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 6/23\n\
Today's BuzzFeed Crossword, 6/22\n\
Today's BuzzFeed Crossword, 6/21\n\
Today's BuzzFeed Crossword, 6/20\n\
Can You Solve The Hardest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 6/16\n\
Today's BuzzFeed Crossword, 6/15\n\
Today's BuzzFeed Crossword, 6/14\n\
Today's BuzzFeed Crossword, 6/13\n\
Can You Solve The Hardest BuzzFeed Crossword Of The Week?\n\
Today's BuzzFeed Crossword, 6/9/16\n\
Today's BuzzFeed Crossword, 6/8/16\n\
Today's BuzzFeed Crossword, 6/7/16\n\
Dylann Roof Is An American Problem\n\
The Best Essays, Poems, And Advice Are In BuzzFeed Reader’s Newsletter!\n\
27 Books Every Woman In America Should Read\n\
Poem: Barbershop By Phillip B. Williams\n\
Patriots Day Is The First Movie Of Trump's America\n\
The Gay Couple Who Adopted My Baby Are Exactly The Parents I Wanted Him To Have\n\
The 32 Most Exciting Books Coming In 2017\n\
To Understand The Rust Belt, We Need To See Beyond Whiteness\n\
Ryan Gosling Is A Star After His Time\n\
This Is Us Is The Weepy Melodrama America Needs Right Now\n\
The True Story Of My Teenage Dirtbag Fight Club\n\
Living In The Beautiful Bubble Of The Not-Quite Internet\n\
Indian Parents Aren't Raising Their Sons Right, And It's Endangering India's Women\n\
Donald Trump Showed His Hand In 1999, But No One Was Looking\n\
Most Women In Publishing Don’t Have The Luxury Of Being Unlikable\n\
This Controversial Company Wants To Disrupt The Birth World\n\
How Pop Culture Made Me Love My Fat Self\n\
“A Series Of Unfortunate Events” Helped Me Feel Better About Expecting The Worst\n\
What A Gay College Student's Murder Can Teach Us About Hate In America Today\n\
Poem: Record By Danniel Schoonebeek\n\
1999 Was The Last Time Everything Was Fine\n\
Debbie Reynolds' Legendary Gossip Game\n\
17 Essays About TV, Music And Film You Should Read Right Now\n\
The 19 Best Literary Debuts Of 2016\n\
11 Great Essays About Celebrities You Should Read\n\
The Manufactured Intimacy Of Online Self-Care\n\
11 Essays From Around The World You Needed To Read In 2016\n\
Our Favorite Illustrations Of 2016\n\
The Most Moving Personal Essays You Needed To Read In 2016\n\
12 Times Miss Grotke From Recess Was Progressive As Fuck\n\
Which Disney Show Must Go?\n\
Marry, Fuck, Kill: The Guess Who Edition\n\
15 Things Every Simpsons Fan Will LOL At\n\
Yup, These 17 TV Shows Are Turning 20 This Year\n\
24 Things That Nobody Seems To Be Able To Agree On\n\
The Hardest Game Of Which Nickelodeon Show Must Go You'll Ever Play\n\
18 Genius Lines From The Mighty Boosh You Need To Relive\n\
16 Things You Don't Know About Netflix's A Series Of Unfortunate Events\n\
Here's How Much The Kardashians Have Changed In 10 Years\n\
We Know If You Have Resting Bitch Face Based On Your '00s Choices\n\
21 Hilarious Tweets About Books Guaranteed To Make You Laugh\n\
Which Pixar Movie Must Go?\n\
You're A True '90s Kid If You Can Pass This Spelling Quiz\n\
16 Times Kelly Kapoor Made You Say, Me, Definitely Me\n\
We Know How Many Kids You'll Have Based On Your Favorite Disney Princess\n\
OMG Guys, Ariana Grande And John Legend Are Recording A Song For Beauty And The Beast\n\
One's Gotta Go: The Kardashian Edition\n\
Which Bad Movie Must Go?\n\
If You Get 11/14 On This Quiz, You're Probably A Playstation 3 Junkie\n\
22 Emo Trends From 2007 That Need To Come Back In 2017\n\
This Theory About Disney Will Change Your Childhood Forever\n\
29 Moments And Things That Happened In 2002\n\
Which Bob Ross Painting Are You?\n\
Which Disney Prince Should Be Your Side Dick?\n\
16 British TV Shows That Would Confuse The Fuck Out Of Americans\n\
Which Harry Potter Character Must Go?\n\
ER IS THE GREATEST MEDICAL SHOW EVER, SO WHY ISN’T IT STREAMING ANYWHERE?!\n\
21 Songs Every '90s Girl Still Knows By Heart\n\
Here’s How Obamacare Repeal Could Hurt Native Americans\n\
Trump’s Would-Be Vaccine Commissioner Rallies Anti-Vaccine Groups\n\
Obama Administration Makes Last-Ditch Move To Protect Scientists From Political Attacks\n\
US Ebola Czar Calls Trump Badly Misguided On Diseases\n\
Trump Moves To Challenge Vaccine Science\n\
Here’s How Big Pharma Plans To Clean Up After Martin Shkreli\n\
Here's How To Take The Best Nap Of Your Life\n\
Trump's Health Secretary Nominee Sought Special Treatment For Industry Donors\n\
Do 1 In 4 People Really Have A Mental Illness Right Now?\n\
We Asked 10 Scientists What They're Most Scared Of In 2017\n\
Trump’s SEC Nominee Told Firms To Admit Climate Change Risks\n\
Climate Change Is The Biggest Killer Of Polar Bears\n\
Alabama’s Supreme Court Is Letting A Woman Sue Her Doctor For Wrongful Death After A Miscarriage\n\
Conservation Groups Are Worried That Congress Will Give Away Public Lands\n\
A Judge Just Suspended Obamacare's Transgender Protections — Here's What That Means\n\
Can You Pass This Basic Probability Test?\n\
Here Are Some Horrifying Facts About The Fear Of Clusters Of Holes\n\
No, RBS Can't Read Your Mind And Tell You If You Ought To Work In Banking\n\
19 Things You Should Have Learned In Sex Ed But Didn't\n\
We Asked Scientists What They're Looking Forward To In 2017\n\
The Absolute Best Roundup Of 2016 Science Roundups\n\
Here's The Strange Story Of The Lonely Serial Killer\n\
First It Was A Typo In Congress — Now It Will Cost Real Jobs\n\
27 Of The Most Amazing Science Photos Of 2016\n\
16 Depressing AF Science And Health Stories From 2016\n\
World's Oldest Living Gorilla Turns 60\n\
33 Facts We Didn't Know At The Start Of 2016\n\
27 Photos That Show How The Climate Changed The World In 2016\n\
North Pole Hits Melting Point With Temperatures 40 Degrees Above Normal\n\
Suspicious Tennis Matches Up 20% Last Year\n\
Aaron Rodgers Is Really Freaking Good At Football\n\
Clemson Stuns Alabama To Win National Championship\n\
A Swim Team Practiced In The Snow In Nothing But Speedos After Their Meet Was Canceled\n\
University Of Minnesota Football Players End Boycott Over Sex Assault Suspensions\n\
The Best Sports Photography Of 2016\n\
Do You Know What City These NFL Teams' Stadiums Are In?\n\
34 Detained In Spanish Match-Fixing Investigation\n\
These Fans Tossed 24,000 Teddy Bears Onto The Ice\n\
This Soccer Player Is Having A Terrible, Horrible, No Good, Very Bad Day\n\
Someone Made A LeBron James Musical Based On His Career And It's Hilarious\n\
Here's Yet Another Reason To Love Kristaps Porzingis\n\
People Tried Stabbing An Olympic Fencer And Pretty Much Got Owned\n\
The Story Behind The Chicago Cubs Curse\n\
People Joked About What The World Was Like The Last Time The Cubs Won A World Series\n\
We Know If The Cubs Are Going To Win Tonight\n\
Cubs Clobber Indians, Forcing A Do-Or-Die Game 7 Of The World Series\n\
Can We Guess Your Favorite NBA Team With 10 Questions?\n\
Non-Athletes Tried Olympic High Diving And Things Didn't Go Well\n\
How Trash Is Your Understanding Of Football?\n\
An NFL Player Dressed As Harry Potter For A Press Conference And It Was Perfect\n\
Usain Bolt Challenged BuzzFeed Employees To Try And Beat His Fastest Time\n\
This NFL Player's Harambe Shoes Are Iconic\n\
Aaron Rodgers Wore The Lebowski Sweater Last Night And People Loved It\n\
Indians Pitcher Forced To Leave ALCS Game After His Finger Starts Bleeding Profusely\n\
LA Dodgers' Adrian Gonzalez Refused To Stay With Team At A Trump Hotel\n\
We Pranked Regular People Into Playing Paintball With Professionals And It Was Terrifying\n\
Maria Sharapova's Doping Ban Cut From Two Years To 15 Months\n\
Baseball Broadcast Legend Vin Scully Has Announced His Last Game\n\
This Woman Wants To Change How The World Thinks About Disability\n\
15 Life-Changing Laundry Tips You Wish You Knew About Sooner\n\
23 Products Every Dangerous Woman Needs In Their Life\n\
33 Beauty Products Under $10 That Are Actually Worth Your Money\n\
29 Beautiful Pieces Of Luggage That Only Look Expensive\n\
The New Anastasia Beverly Hills Lip Palette Basically Turns You Into A Lip Artist\n\
Get Ready Because MAC Is Making Lipsticks With Your Fave Makeup Addicts\n\
33 Cute Accessories That'll Melt Even The Coldest Heart\n\
Here's A Look At What Beauty Standards Looked Like Around The World In The 1980s\n\
31 Gorgeous Non-Diamond Engagement Rings You'll Totally Fall For\n\
Here's What It's Like To Be A Plus-Size Athlete\n\
Meet The Modeling Agency That's Fighting Racial Discrimination In Mexico's Fashion Industry\n\
This Sparkly Silicone Beauty Blender Is About To Change The Makeup Game\n\
16 Of The Most Stressful Would You Rather Beauty Questions Ever\n\
21 Of The Best Snow Boots You Can Get On Amazon\n\
OK, So Who Wore It Better: Golden Globes Edition\n\
25 Guys Who Looked Fine As Hell At The Golden Globes\n\
34 Irresistible Pieces Of Inexpensive Jewelry\n\
26 Of The Best Beauty Products You Can Subscribe To On Amazon\n\
27 Inexpensive Shoes That Look Like A Million Bucks\n\
17 Of The Most Anticipated Sneakers Of 2017\n\
9 People Pose Nude To Show What Body Diversity Really Looks Like\n\
This Beautiful Rose Highlighter Will Blow Your Mind\n\
16 Things Everyone Should Know Before Buying An Engagement Ring\n\
This Line Of Plus-Size Bikinis And More Is Too Damn Good\n\
12 Amazing Places To Buy Used Clothes Online\n\
Can We Guess Your Natural Hair Color?\n\
These Pretty Pinterest Braids Will Make It Look Like You Know How To Do Hair\n\
Maybelline Just Hired A Guy To Be The Face Of Its New Mascara\n\
Facebook Is Expanding Its Program To Fight Fake News Into Germany\n\
Hyperpartisan Sites And Facebook Pages Are Publishing False Stories And Conspiracy Theories About Angela Merkel\n\
Boosted's Latest Electric Board Is Recalled For Smoking Battery\n\
Trump's Potential FDA Pick Attended McAfee For President Fundraiser\n\
A Guy On 4chan Has Completed His Disgusting Mission To A My Little Pony\n\
Apple Might Soon Start Producing Original TV Shows Like Netflix\n\
How Encrypted Chat Apps Like Signal Risk Ratting Out Whistleblowers\n\
This Is What Trump's CIA Pick Thinks About Encrypted Messaging Apps\n\
Here’s What The First iPhone Almost Looked Like\n\
Why You’re Seeing Tweets From People You Don’t Follow In Your Timeline\n\
This Man's Bank Wanted To Read All His Emails To Approve A Credit Card\n\
WeWork Has Officially Entered The Indian Market\n\
Monopoly Is Letting You Pick Its New Playing Pieces\n\
Marissa Mayer To Exit Yahoo Board Along With Co-Founder David Filo\n\
Twitter Reinstates Woman Who Tweeted Screenshots Of Her Trolls' Abuse\n\
6 Things To Know About The Future Of Transportation\n\
Martin Shkreli And The Case For Twitter Transparency\n\
Google's Self-Driving Car Company Has Been Quietly Building Its Own Hardware\n\
Uber Launches Tool To Analyze Traffic Patterns\n\
Lyft Co-Founder John Zimmer Drives And Dishes On Automation, Car Subscriptions, And Cash\n\
Hackers Tried To Break Into DNC Computers Right Before New Year’s Eve\n\
You Can Now Watch 520 Hours Of Trump Speeches In One Place\n\
What Note7 Recall? Samsung's Profits Are The Best They've Been In Years\n\
DNA-Testing Startup Counsyl Lays Off 5% Of Its Workforce\n\
Medium’s “Renewed Focus” Left Some Publishers In The Dark\n\
Here’s What The White House Will Do With Everything Obama Tweeted\n\
Workplaces Are Tracking Their Employees' Sleep\n\
Uber Driver Beat Up Rider Who Asked To Go To New Jersey, Lawsuit Alleges\n\
Senator Slams Apple For Removing New York Times App From China App Store\n\
27 Of The Best Hostels In Europe, According To Our Readers\n\
We Got Drunk At A Game Of Thrones Bar And Didn't Die\n\
19 Batshit Desserts That Everyone Is Going Crazy For In Scotland\n\
12 New England Inns That Are Total Gilmore Goals\n\
17 Life-Changing Things Everyone Must Do In Scotland In 2017\n\
Japanese 7-Elevens Will Make You Believe In Magic Again\n\
36 Photos That Showcase The Unique Beauty Of Barcelona\n\
21 Things That Are Way Too Real For People Who Grew Up In Minnesota\n\
26 Fucking Batshit Things That Happened In Scotland In 2016\n\
The Top 20 Worldwide Instagram Spots Of 2016\n\
There Is A Bar That Lets You Get Drunk While You Get Your Nails Done\n\
21 Cosy Winter Comfort Foods Everyone Must Eat In Scotland\n\
Life In Japan Vs. Life In Britain\n\
These 5 Questions Will Tell You Where You Should Go On Vacation Next\n\
14 Dreamlike, Snug, And Romantic Winter Hideaways In Scotland\n\
14 Funny Tweets That Will Remind You Why You Love And Hate Hotels\n\
19 Photos Of Rice Terraces Guaranteed To Take Your Breath Away\n\
This Quiz Will Prove If You're Actually From Minnesota\n\
Which State With Legalized Weed Should You Take A Vacation In?\n\
Can We Guess Your Age And Birth Order From Your Dream Vacation?\n\
Where Should You Travel Next Based On Your Zodiac Sign?\n\
21 Reasons Everyone Should Move To Scotland Immediately\n\
25 Amazing And Affordable Treehouses You'll Want To Rent For Your Next Vacay\n\
26 Reasons Why Sweden Rules At Winter\n\
28 Haunting Photos That Prove Scotland Is Even More Beautiful At Night\n\
29 Instagram-Worthy Places To Travel\n\
38 Photos That'll Make You Want To Book A Trip To Thailand Right Now\n\
19 Road Trip Games That'll Make Car Rides So Much More Fun\n\
23 Squad Travel Pics That Will Make You Pack Your Bags\n\
25 Incredible Wedding Photos That'll Leave You Speechless\n\
These Are The Best Wedding Photos Of 2016 And They're Stunning\n\
8 Creative Hobbies To Take Up In 2017\n\
23 Moments That Basically Every Bridesmaid Has Experienced\n\
Serena Williams Engaged To Reddit Founder Alexis Ohanian\n\
38 Celebrity Weddings You Missed In 2016\n\
21 Amazing Wedding Miracles That'll Make You So Happy\n\
14 Things No One Tells You About Wedding Dress Shopping\n\
This Couple Waited 70 Years To Take Their Wedding Photos\n\
15 Heartwarming Love Stories That Made 2016 A Little Bit Better\n\
24 Stunning Wedding Cakes That Won 2016\n\
Ryan Reynolds' Story About Realising That Blake Was The One Will Destroy You\n\
17 Of The Greatest Love Stories Ever Told\n\
I'm All About Gender Equality, And I Wanted My Wedding To Be Too\n\
Ryan Seacrest's Sister Got Married And He Was The Man Of Honor\n\
33 Unbelievably Gross Confessions About Relationships\n\
J.Crew Is Getting Rid Of Its Bridal Collection And Everything Is On Sale Now\n\
Here Are The First Pics From Michael Phelps' Wedding\n\
This Flower Grandpa Is The Cutest Thing You Will See Today\n\
A Metal Band Crashed A Couple's Engagement Shoot And It's So Perfect\n\
People Are Obsessed With This Insanely Stylish 86-Year-Old Bride\n\
This Couple Hilariously Recreated Their Wedding Photos At Target\n\
17 Quirky Wedding Photos That Will Make You Feel Things\n\
This Guy Made A Harry Potter Pensieve As A Wedding Gift For His Wife\n\
How Many Words Can You Make From The Letters In “Wedding”?\n\
23 Mouth-Wateringly Delicious Food Ideas That'll Change The Wedding Game\n\
Now You Can Get Married In Disney World's Magic Kingdom At Night\n\
27 Ridiculously Pretty Wedding Dresses That'll Make You Forget All Your Worries\n\
These Disney Princess Engagement Photos Are What Dreams Are Made Of\n\
How To Use Facebook And Fake News To Get People To Murder Each Other\n\
Facebook Is Expanding Its Program To Fight Fake News Into Germany\n\
Watch This Diver Impale A Shark With A Speargun Just As It's About To Bite Him\n\
Hyperpartisan Sites And Facebook Pages Are Publishing False Stories And Conspiracy Theories About Angela Merkel\n\
Here's Why Trump's Great Wall On The US-Mexico Border Is Basically A Pipe Dream\n\
Spy Agencies Around The World Are Digging Into Trump’s Moscow Ties\n\
A Refugee Is Taking Facebook To Court In Germany Over Fake News\n\
There Are Now Questions About Whether The Secret Trump Dossier Is Classified\n\
A Hungarian Beauty Queen Said That Trump Invited Her To His Moscow Hotel Room\n\
22 Of The Most Powerful Photos Of This Week\n\
8 Incredible Photo Stories You Absolutely Can’t Miss\n\
This Flight 666 Destined For HEL Is Metal AF\n\
Spanish Supermarket Says Mega Viral Story It Was Attacked By A Man Shouting Allahu Akbar Is False\n\
Someone Cut Out A Fox That Was Frozen In River Ice Because Why Not?\n\
This 74-Year-Old Former President Is Trump's Main Twitter Nemesis\n\
These Refugees Are Suffering Through Freezing Conditions In Serbia\n\
US Military Officials Worry Trump Could Halt Major NATO Deployment\n\
C-SPAN Says Online Feed Was Not Hacked By Kremlin-Funded RT\n\
Suspects Charged In Kim Kardashian West Armed Robbery In Paris\n\
Trump Shut Down A Journalist And A Repressive President Praised Him\n\
French Far-Right Leader Marine Le Pen Spotted At Trump Tower\n\
CIA Nominee Believes The Russian Government Worked To Elect Trump\n\
Mattis Wants To Be Tough On Russia Even Though Trump Is His Boss\n\
Trump's Top Ally In Congress Wants Investigation Into Dossier Leaker\n\
What You Need To Know About The Secret Trump Dossier\n\
A Key Republican Now Says Senate Will Investigate Election Campaign Links With Russians\n\
Alt-Right Trolls Are Trying To Trick People Into Thinking Trump Dossier Was A 4chan Prank\n\
Kremlin Says Trump Claims Are Fake While Trump Slams Political Witch Hunt\n\
These Reports Allege Trump Has Deep Ties To Russia\n\
\n\
";

},{}]},{},[1]);
