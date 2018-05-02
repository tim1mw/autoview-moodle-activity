<?php

global $CFG;
require_once($CFG->dirroot.'/mod/autoview/lib.php');

$xsl="";
if (testXSL()==false)
{
 $xsl='<p class="warning">'.get_string('noxsl', 'autoview').'</p>';
}

$dep=autoview_has_dependencies(true);

$settings->add(new admin_setting_heading('autoview/main_heading', "",
                   '<p>'.get_string("confignote", "autoview").
                   ' <a href="http://autoview.autotrain.org/" title="'.get_string("confignote4", "autoview").'">'.
                   get_string("confignote2", "autoview").'</a> '.
                   get_string("confignote3", "autoview").'</p>'.$xsl.$dep));


$settings->add(new admin_setting_heading('autoview/storage_heading', get_string("storagetitle", "autoview"),""));

$storage=array(AUTOVIEW_STORAGE_INTERNAL=>get_string('internal_storage', 'autoview'));

$settings->add(new admin_setting_configselect('autoview/storage_type', get_string('config_storage_type', 'autoview'),
                   get_string('config_storage_type2', 'autoview'), AUTOVIEW_STORAGE_INTERNAL, $storage));


$settings->add(new admin_setting_heading('autoview/lecture_capture_heading', get_string("flashcapturetitle", "autoview"),
                   ""));

$settings->add(new admin_setting_configtext('autoview/flashcapture', get_string("configflashcapture", "autoview"),
                   "<p>".get_string("configflashcapture2", "autoview").
                   " <a onclick=\"this.target='_blank'\" href=\"http://autoview.autotrain.org\">".get_string("autoview_website", "autoview")."</a>.</p>", "", PARAM_URL));

$settings->add(new admin_setting_configtext('autoview/flashserver', get_string("configflashserver", "autoview"),
                   get_string("configflashserver2", "autoview"), "", PARAM_TEXT));

$options = array("randomkey"=>get_string('randomkey', 'autoview'));
$settings->add(new admin_setting_configselect('autoview/flashsecurity', get_string('configflashsecurity', 'autoview'),
                   get_string('configflashsecurity2', 'autoview'), "randomkey", $options));

$settings->add(new admin_setting_configselect('autoview/flashsecurity', get_string('configflashsecurity', 'autoview'),
                   get_string('configflashsecurity2', 'autoview'), "randomkey", $options));

$always_stream=array(0=>get_string("no"), 1=>get_string("yes"));
$settings->add(new admin_setting_configselect('autoview/alwaysflashstream', get_string('alwaysflashstream', 'autoview'),
                   '', 0, $always_stream));

$settings->add(new admin_setting_heading('autoview/doc_convert_heading', get_string("converttitle", "autoview"),""));

$pecl="";
if (testDocConv()==false)
    $pecl='<p class="warning">'.get_string('pecl_http_warn', 'autoview').'</p>';

$settings->add(new admin_setting_configtext('autoview/conversionurl', get_string("configconversionurl", "autoview"),
                   "<p>".get_string("configconversionurl2", "autoview").
                   " <a onclick=\"this.target='_blank'\" href=\"http://autoview.autotrain.org\">".get_string("autoview_website", "autoview")."</a>.</p>".
                   $pecl, "", PARAM_URL));

$settings->add(new admin_setting_configtext('autoview/conversionkey', get_string("configconversionkey", "autoview"),
                   get_string("configconversionkey2", "autoview"), "", PARAM_TEXT));

$settings->add(new admin_setting_heading('autoview/advanced', get_string("advanced_config", "autoview"),
                   ""));

$settings->add(new admin_setting_configtextarea('autoview/js_extras', get_string("js_extras", "autoview"),
                   get_string("js_extras2", "autoview"), "", PARAM_RAW));

?>
