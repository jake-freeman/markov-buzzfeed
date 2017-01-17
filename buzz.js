'use strict';

var MarkovChain = require('markovchain'),
    $           = require('jquery'),
    titles      = require('./titles.js');

var title_chain = new MarkovChain(titles);

var title_states = {
    good: '',
    bad_start: 'bad-start'
};

function main() {
    $(document).ready(function() {
        add_jquery_plugins();
        register_form_components();
        display_title(generate_title());
    });
}

function generate_title(start) {
    var generated_title = '',
        state = title_states.good;
    title_chain = title_chain.end(15);
    if (!start) {
        title_chain = new MarkovChain(titles);
    }
    else {
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
                error_timeout_handler = null;
            }, error_duration);
        }
    });

    $(gen_button_selector).click(function() {
        display_title(generate_title($(gen_start_selector).val()));
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
