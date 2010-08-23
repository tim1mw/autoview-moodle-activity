<?php

require_once($CFG->dirroot.'/mod/forum/lib.php');

$settings->add(new admin_setting_configtext('autoview_conversionurl', get_string("configconversionurl", "autoview"),
                   get_string("configconversionurl2", "autoview"), "", PARAM_URL));

$settings->add(new admin_setting_configtext('autoview_conversionkey', get_string("configconversionkey", "autoview"),
                   get_string("configconversionkey2", "autoview"), "", PARAM_TEXT));

$settings->add(new admin_setting_configtext('autoview_flashcapture', get_string("configflashcapture", "autoview"),
                   get_string("configflashcapture2", "autoview"), "", PARAM_URL));

$settings->add(new admin_setting_configtext('autoview_flashserver', get_string("configflashserver", "autoview"),
                   get_string("configflashserver2", "autoview"), "", PARAM_TEXT));

$options = array("randomkey"=>get_string('randomkey', 'autoview'));
$settings->add(new admin_setting_configselect('autoview_flashsecurity', get_string('configflashsecurity', 'autoview'),
                   get_string('configflashsecurity2', 'autoview'), "randomkey", $options));

$settings->add(new admin_setting_configcheckbox('autoview_alwaysflashstream', get_string('alwaysflashstream', 'autoview'),
                   get_string('alwaysflashstream2', 'autoview'), 0));


$settings->add(new admin_setting_configtextarea('autoview_js_extras', get_string("js_extras", "autoview"),
                   get_string("js_extras2", "autoview"), "", PARAM_RAW));

?>