<?PHP

/////////////////////////////////////////////////////////////////////////////////
///  Code fragment to define the version of start
///  This fragment is called by moodle_needs_upgrading() and /admin/index.php
/////////////////////////////////////////////////////////////////////////////////

$module->version  = 2012070501;  // The current module version (Date: YYYYMMDDXX)
if ($CFG->version>=2010000000)
    $module->requires = 2010112400;
else
    $module->requires = 2007101570;  // Requires this Moodle version
$module->cron     = 300;           // Period for cron to check this module (secs)

$module->release = $module->version;
$module->maturity = MATURITY_STABLE;

?>
