var $body = $('body');

$body.on('click', '.btn-utility', function () {
    $('.aircraft-details').toggleClass('open');
});

function getLimit() {
    var val = parseInt($('#passengers').val(), 10);
    return (val >= 1 && val <= 5) ? val : 1;
}

function enforceLimit() {
    var limit = getLimit();
    var checked = $('input.seat-check:checkbox:checked').length;
    var atLimit = checked >= limit;
    $('input.seat-check:checkbox').not(':checked').prop('disabled', atLimit);
}

// Enforce on every checkbox change
$body.on('change', 'input.seat-check:checkbox', function () {
    enforceLimit();
});

// Re-enforce whenever the passenger count changes
$body.on('change', '#passengers', function () {
    // Uncheck extras if new limit is lower than current selection
    var limit = getLimit();
    var $checked = $('input.seat-check:checkbox:checked');
    if ($checked.length > limit) {
        $checked.slice(limit).prop('checked', false);
    }
    enforceLimit();
});

// Initialise on page load
$(document).ready(function () {
    enforceLimit();
});
