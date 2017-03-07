'use strict';

var MarkovChain = require('markovchain'),
    //$           = require('jquery'),
    titles      = require('./titles.js');

var title_chain = new MarkovChain(titles);

var title_states = {
    good: '',
    bad_start: 'bad-start',
    bad_whole: 'bad-whole'
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
        options = options ? options : {},
        start = options.start,
        contains = options.contains;

    function reset_chain(mod) {
        mod = mod ? mod : 0;
        title_chain = new MarkovChain(titles);
        // with a -1 because for some reason we need that
        title_chain = title_chain.end(+title_length_slider.slider('getValue') + mod - 1);
    }

    reset_chain();

    if (start) {
        start = capitalizeFirstLetter(start).trim();
        title_chain = title_chain.start(start);
        generated_title = title_chain.process();
    }
    else if (contains) {
        let success = false,
            regex = '';
        for (let i = 0; i < 1000; i++) {
            generated_title = title_chain.process();
            regex = '\\b';
            regex += escapeRegExp(generated_title);
            regex += '\\b';
            if (new RegExp(regex, "i").test(contains.toLowerCase())) {
                success = true;
                break;
            }
        }
        if (!success) {
            state = title_states.bad_whole;
        }
    }
    else {
        generated_title = title_chain.process();
    }

    if (start && generated_title.length === start.length) {
        reset_chain(-1);
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
        var wrap_level = options.state === title_states.bad_start ? 1 : -1;
        title_obj.wrapStart(wrap_level, word_wrapper_class);
        $('.' + word_wrapper_class).addClass(options.state);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function escapeRegExp(string){
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
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
                       return this.nodeType == 3
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
