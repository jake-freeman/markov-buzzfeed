var MarkovChain = require('markovchain'),
    $           = require('jquery'),
    titles      = require('./titles.js');

console.log("Is this working!?");
var title_chain = new MarkovChain(titles);

var error_timeout_handler = null;

function main() {
    $(document).ready(function() {
        register_form_components();
        display_title(generate_title());
    });
}

function generate_title(start) {
    var generated_title = '';
    title_chain = title_chain.end(15);
    if (!start) {
        title_chain = new MarkovChain(titles);
    }
    else {
        title_chain = title_chain.start(start.trim());
    }
    generated_title = title_chain.process();
    console.log(generated_title);
    return generated_title;
}

function display_title(title) {
    $('.gen-title').text(title);
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
            if (error_timeout_handler) {
                clearTimeout(error_timeout_handler);
            }
            error_timeout_handler = setTimeout(function() {
                current_element.removeClass('highlight-error');
                error_timeout_handler = null;
            }, error_duration);
        }
    });

    $(gen_button_selector).click(function() {
        console.log($(gen_start_selector).val());
        display_title(generate_title($(gen_start_selector).val()));
    });
}

main();
