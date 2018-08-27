$(document).ready(function () {
//floating labels
$('.floating-label .form-control').on('focus blur', function (e) {
$(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
}).trigger('blur');
$('.floating-label .form-control').focus(function () {
$(this).data('placeholder', $(this).attr('placeholder'))
.attr('placeholder', '');
}).blur(function () {
$(this).attr('placeholder', $(this).data('placeholder'));
});
});