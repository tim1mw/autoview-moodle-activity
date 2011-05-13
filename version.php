<?PHP

/////////////////////////////////////////////////////////////////////////////////
///  Code fragment to define the version of start
///  This fragment is called by moodle_needs_upgrading() and /admin/index.php
/////////////////////////////////////////////////////////////////////////////////

$module->version  = 2011051301;  // The current module version (Date: YYYYMMDDXX)
$module->requires = 2007101570;  // Requires this Moodle version
$module->cron     = 300;           // Period for cron to check this module (secs)

?>
