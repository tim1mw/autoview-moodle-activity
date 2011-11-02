<?php

require_once($CFG->dirroot.'/mod/autoview/lib.php');

$xsl="";
if (testXSL()==false)
{
 $xsl='<p class="warning">'.get_string('noxsl', 'autoview').'</p>';
}

$dep=autoview_has_dependencies(true);

$settings->add(new admin_setting_heading('autoview_main_heading', "",
                   '<p>'.get_string("confignote", "autoview").
                   ' <a href="http://autoview.autotrain.org/" title="'.get_string("confignote4", "autoview").'">'.
                   get_string("confignote2", "autoview").'</a> '.
                   get_string("confignote3", "autoview").'</p>'.$xsl.$dep));


$settings->add(new admin_setting_heading('autoview_storage_heading', get_string("storagetitle", "autoview"),""));

//$storage=array(AUTOVIEW_STORAGE_INTERNAL=>get_string('internal_storage', 'autoview'), AUTOVIEW_STORAGE_EXTERNAL=>get_string('external_storage', 'autoview'));
$storage=array(AUTOVIEW_STORAGE_INTERNAL=>get_string('internal_storage', 'autoview'));

$settings->add(new admin_setting_configselect('autoview_storage_type', get_string('config_storage_type', 'autoview'),
                   get_string('config_storage_type2', 'autoview'), AUTOVIEW_STORAGE_INTERNAL, $storage));

$settings->add(new admin_setting_configtext('autoview_external_filekey', get_string("configexternalfilekey", "autoview"),
                   get_string("configexternalfilekey2", "autoview"), "", PARAM_TEXT));

$settings->add(new admin_setting_configtext('autoview_external_fileloc', get_string("configexternalfileloc", "autoview"),
                   get_string("configexternalfileloc2", "autoview"), "", PARAM_TEXT));


$settings->add(new admin_setting_heading('autoview_lecture_capture_heading', get_string("flashcapturetitle", "autoview"),
                   ""));

$settings->add(new admin_setting_configtext('autoview_flashcapture', get_string("configflashcapture", "autoview"),
                   "<p>".get_string("configflashcapture2", "autoview").
                   " <a onclick=\"this.target='_blank'\" href=\"http://autoview.autotrain.org\">".get_string("autoview_website", "autoview")."</a>.</p>", "", PARAM_URL));

$settings->add(new admin_setting_configtext('autoview_flashserver', get_string("configflashserver", "autoview"),
                   get_string("configflashserver2", "autoview"), "", PARAM_TEXT));

$options = array("randomkey"=>get_string('randomkey', 'autoview'));
$settings->add(new admin_setting_configselect('autoview_flashsecurity', get_string('configflashsecurity', 'autoview'),
                   get_string('configflashsecurity2', 'autoview'), "randomkey", $options));

$settings->add(new admin_setting_configselect('autoview_flashsecurity', get_string('configflashsecurity', 'autoview'),
                   get_string('configflashsecurity2', 'autoview'), "randomkey", $options));

$always_stream=array(0=>get_string("no"), 1=>get_string("yes"));
$settings->add(new admin_setting_configselect('autoview_alwaysflashstream', get_string('alwaysflashstream', 'autoview'),
                   '', 0, $always_stream));

$spds=array("768"=>768, "512"=>512, "256"=>256, "128"=>128, "96"=>96, "64"=>64, "48"=>48, "32"=>32, "24"=>24,
    "20"=>20, "16"=>16, "12"=>12);
$settings->add(new admin_setting_configselect('autoview_max_broadcast_kbps', get_string('configmax_broadcast_kbps', 'autoview'),
                   get_string('configmax_broadcast_kbps2', 'autoview'), 768, $spds));

$settings->add(new admin_setting_configselect('autoview_max_record_kbps', get_string('configmax_record_kbps', 'autoview'),
                   get_string('configmax_record_kbps2', 'autoview'), 768, $spds));

$settings->add(new admin_setting_heading('autoview_doc_convert_heading', get_string("converttitle", "autoview"),""));

$pecl="";
if (testDocConv()==false)
    $pecl='<p class="warning">'.get_string('pecl_http_warn', 'autoview').'</p>';

$settings->add(new admin_setting_configtext('autoview_conversionurl', get_string("configconversionurl", "autoview"),
                   "<p>".get_string("configconversionurl2", "autoview").
                   " <a onclick=\"this.target='_blank'\" href=\"http://autoview.autotrain.org\">".get_string("autoview_website", "autoview")."</a>.</p>".
                   $pecl, "", PARAM_URL));

$settings->add(new admin_setting_configtext('autoview_conversionkey', get_string("configconversionkey", "autoview"),
                   get_string("configconversionkey2", "autoview"), "", PARAM_TEXT));

$settings->add(new admin_setting_heading('autoview_advanced', get_string("advanced_config", "autoview"),
                   ""));

$settings->add(new admin_setting_configtextarea('autoview_js_extras', get_string("js_extras", "autoview"),
                   get_string("js_extras2", "autoview"), "", PARAM_RAW));

?>
