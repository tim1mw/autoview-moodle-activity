<?PHP

/////////////////////////////////////////////////////////////////////////////////
///  Code fragment to define the version of start
///  This fragment is called by moodle_needs_upgrading() and /admin/index.php
/////////////////////////////////////////////////////////////////////////////////

global $CFG;

$module->version  = 2015080503;  // The current module version (Date: YYYYMMDDXX)
$module->requires = 2013111800;
$module->cron     = 300;           // Period for cron to check this module (secs)

$module->release = $module->version;
$module->maturity = MATURITY_STABLE;

$module->component = 'mod_autoview';

?>
