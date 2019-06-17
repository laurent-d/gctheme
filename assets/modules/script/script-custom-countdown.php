<?php header("content-type: application/x-javascript");
$id = '';

if(isset($_GET['id']))
{
	$id = $_GET['id'];
}
?>
var dataDate = jQuery('#<?php echo esc_js($id); ?>').attr('data-date');

jQuery('#<?php echo esc_js($id); ?>').countdown(dataDate, function(event) {
  var clock = jQuery(this).html(event.strftime(''
    + '<div class="clock_bg"><div class="clock_counter">%w</div><div class="clock_label"><?php esc_html_e('weeks', 'grandconference' ); ?></div></div>'
    + '<div class="clock_bg"><div class="clock_counter">%d</div><div class="clock_label"><?php esc_html_e('days', 'grandconference' ); ?></div></div>'
    + '<div class="clock_bg"><div class="clock_counter">%H</div><div class="clock_label"><?php esc_html_e('hours', 'grandconference' ); ?></div></div>'
    + '<div class="clock_bg"><div class="clock_counter">%M</div><div class="clock_label"><?php esc_html_e('minutes', 'grandconference' ); ?></div></div>'
    + '<div class="clock_bg"><div class="clock_counter">%S</div><div class="clock_label"><?php esc_html_e('seconds', 'grandconference' ); ?></div></div>'));
});