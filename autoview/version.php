<?php

/////////////////////////////////////////////////////////////////////////////////
///  Code fragment to define the version of start
///  This fragment is called by moodle_needs_upgrading() and /admin/index.php
/////////////////////////////////////////////////////////////////////////////////

global $CFG;

$plugin->version  = 2015111001;  // The current module version (Date: YYYYMMDDXX)
$plugin->requires = 2013111800;
$plugin->cron     = 300;           // Period for cron to check this module (secs)

$plugin->release = $module->version;
$plugin->maturity = MATURITY_STABLE;

$plugin->component = 'mod_autoview';

?>
