<?php

global $CFG;
require_once($CFG->dirroot.'/mod/autoview/lib.php');

$xsl="";
if (testXSL()==false)
{
 $xsl='<p class="warning">'.get_string('noxsl', 'autoview').'</p>';
}

$dep=autoview_has_dependencies(true);

$settings->add(new admin_setting_heading('autoview/storage_heading', get_string("storagetitle", "autoview"),""));

$storage=array(AUTOVIEW_STORAGE_INTERNAL=>get_string('internal_storage', 'autoview'));

$settings->add(new admin_setting_configselect('autoview/storage_type', get_string('config_storage_type', 'autoview'),
                   get_string('config_storage_type2', 'autoview'), AUTOVIEW_STORAGE_INTERNAL, $storage));

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
