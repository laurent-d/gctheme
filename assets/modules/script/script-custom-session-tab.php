<?php header("content-type: application/x-javascript");
$id = '';

if(isset($_GET['id']))
{
	$id = $_GET['id'];
}
?>
jQuery('#<?php echo esc_js($id); ?> ul.scheduleday_wrapper li.scheduleday_title').on( 'click', function(e) {
	jQuery('#<?php echo esc_js($id); ?> ul.scheduleday_wrapper li.scheduleday_title').removeClass('active');
	jQuery(this).addClass('active');
	
	var targetTab = jQuery(this).attr('data-tab');
	jQuery('#<?php echo esc_js($id); ?> ul.scheduleday_wrapper.tab_content').addClass('hide');
	jQuery('#<?php echo esc_js($id); ?> ul#'+targetTab).removeClass('hide');
});

jQuery('#<?php echo esc_js($id); ?> li .session_content_wrapper.expandable').on( 'click', function(e) {
	var targetID = jQuery(this).attr('data-expandid');
	
	jQuery('#'+targetID).toggleClass('hide');
	jQuery(this).toggleClass('active');
});
<?php
if(isset($_GET['filter']) && $_GET['filter'] == 'yes')
{
?>
jQuery('#session_filter_<?php echo esc_js($id); ?> li a').on( 'click', function(e) {
	var targetFilter = jQuery(this).attr('data-filter');
	
	jQuery('#session_filter_<?php echo esc_js($id); ?> li a').removeClass('active');
	jQuery(this).addClass('active');
	
	if(targetFilter != '')
	{
		jQuery('#<?php echo esc_js($id); ?> ul.scheduleday_wrapper li').removeClass('hide');
		
		jQuery('#<?php echo esc_js($id); ?> ul.scheduleday_wrapper li').each(function(){
			if(!jQuery(this).hasClass(targetFilter) && !jQuery(this).hasClass('scheduleday_title'))
			{
				jQuery(this).addClass('hide');
			}
		});
	}
	else
	{
		jQuery('#<?php echo esc_js($id); ?> ul.scheduleday_wrapper li').removeClass('hide');
	}
});

jQuery('#session_expand_<?php echo esc_js($id); ?>').on( 'click', function(e) {
	jQuery('#<?php echo esc_js($id); ?> ul.scheduleday_wrapper li .session_content_wrapper.expandable').trigger('click');
	
	if(jQuery(this).hasClass('do_expand'))
	{
		jQuery(this).removeClass('do_expand');
		jQuery(this).addClass('do_collapse');
		
		jQuery(this).html('<?php echo esc_html__('Collapse All -', 'grandconference' ); ?>');
	}
	else
	{
		jQuery(this).addClass('do_expand');
		jQuery(this).removeClass('do_collapse');
		
		jQuery(this).html('<?php echo esc_html__('Expand All +', 'grandconference' ); ?>');
	}
});
<?php
}
?>