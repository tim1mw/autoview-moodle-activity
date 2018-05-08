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
                   '<p>'.$xsl.$dep.'</p>'));


$settings->add(new admin_setting_heading('autoview/storage_heading', get_string("storagetitle", "autoview"),""));

$storage=array(AUTOVIEW_STORAGE_INTERNAL=>get_string('internal_storage', 'autoview'));

$settings->add(new admin_setting_configselect('autoview/storage_type', get_string('config_storage_type', 'autoview'),
                   get_string('config_storage_type2', 'autoview'), AUTOVIEW_STORAGE_INTERNAL, $storage));

$settings->add(new admin_setting_heading('autoview/advanced', get_string("advanced_config", "autoview"),
                   ""));

$settings->add(new admin_setting_configtextarea('autoview/js_extras', get_string("js_extras", "autoview"),
                   get_string("js_extras2", "autoview"), "", PARAM_RAW));

$settings->add(new admin_setting_heading('autoview/migration', get_string("content_update", "autoview"),
                   '<p>'.get_string("content_update_note", "autoview").'</p>'.
                   '<p><a href="'.$CFG->wwwroot.'/mod/autoview/updatetool.php">'.get_string("content_update_link", "autoview").'</a></p>'));

?>
