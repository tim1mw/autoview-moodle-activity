<?php

/////////////////////////////////////////////////////////////////////////////////
///  Code fragment to define the version of start
///  This fragment is called by moodle_needs_upgrading() and /admin/index.php
/////////////////////////////////////////////////////////////////////////////////

$plugin->version  = 2018053102;  // The current module version (Date: YYYYMMDDXX)
$plugin->requires = 2018042700;
$plugin->cron     = 300;           // Period for cron to check this module (secs)

$plugin->release = $plugin->version;
$plugin->maturity = MATURITY_STABLE;

$plugin->component = 'mod_autoview';

$plugin->dependencies = array(
    'block_repo_filemanager' => 2018053101,
    'repository_coursefilearea' => 2018053101
);

?>
