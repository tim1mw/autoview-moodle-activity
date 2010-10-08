<?php

require_once($CFG->dirroot.'/mod/autoview/lib.php');

$xsl="";
if (testXSL()==false)
{
 $xsl='<p class="warning">'.get_string('noxsl', 'autoview').'</p>';
}

$settings->add(new admin_setting_heading('autoview_main_heading', "",
                   get_string("confignote", "autoview").
                   ' <a href="http://autoview.autotrain.org/" title="'.get_string("confignote4", "autoview").'">'.
                   get_string("confignote2", "autoview").'</a> '.
                   get_string("confignote3", "autoview").'</p>'.$xsl));


$settings->add(new admin_setting_heading('autoview_lecture_capture_heading', get_string("flashcapturetitle", "autoview"),
                   ""));

$settings->add(new admin_setting_configtext('autoview_flashcapture', get_string("configflashcapture", "autoview"),
                   '<p>'.get_string("configflashcapture2", "autoview").
                   ' <a target="_blank" href="http://autoview.autotrain.org">'.get_string("autoview_website", "autoview").'</a>.</p>', "", PARAM_URL));

$settings->add(new admin_setting_configtext('autoview_flashserver', get_string("configflashserver", "autoview"),
                   get_string("configflashserver2", "autoview"), "", PARAM_TEXT));

$options = array("randomkey"=>get_string('randomkey', 'autoview'));
$settings->add(new admin_setting_configselect('autoview_flashsecurity', get_string('configflashsecurity', 'autoview'),
                   get_string('configflashsecurity2', 'autoview'), "randomkey", $options));

$settings->add(new admin_setting_configcheckbox('autoview_alwaysflashstream', get_string('alwaysflashstream', 'autoview'),
                   get_string('alwaysflashstream2', 'autoview'), 0));

$settings->add(new admin_setting_heading('autoview_doc_convert_heading', get_string("converttitle", "autoview"),""));

$pecl="";
if (testPeclHttp()==false)
    $pecl='<p class="warning">'.get_string('pecl_http_warn', 'autoview').'</p>';

$settings->add(new admin_setting_configtext('autoview_conversionurl', get_string("configconversionurl", "autoview"),
                   '<p>'.get_string("configconversionurl2", "autoview").
                   ' <a target="_blank" href="http://autoview.autotrain.org">'.get_string("autoview_website", "autoview").'</a>.</p>'.
                   $pecl, "", PARAM_URL));

$settings->add(new admin_setting_configtext('autoview_conversionkey', get_string("configconversionkey", "autoview"),
                   get_string("configconversionkey2", "autoview"), "", PARAM_TEXT));

$settings->add(new admin_setting_heading('autoview_advanced', get_string("advanced_config", "autoview"),
                   ""));

$settings->add(new admin_setting_configtextarea('autoview_js_extras', get_string("js_extras", "autoview"),
                   get_string("js_extras2", "autoview"), "", PARAM_RAW));

?>