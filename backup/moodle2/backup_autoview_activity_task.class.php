<?php
/**
* @package mod
* @subpackage autoview
* @copyright 2011 onwards Tim Williams (tmw@autotrain.org), AutoTrain e-Learning
* @licence GNU GPL v2 or later
**/

defined('MOODLE_INTERNAL') || die;

require_once($CFG->dirroot . '/mod/autoview/backup/moodle2/backup_autoview_stepslib.php');

class backup_autoview_activity_task extends backup_activity_task 
{

 protected function define_my_settings()
 {

 }

 protected function define_my_steps()
 {
  $this->add_step(new backup_autoview_activity_structure_step('autoview_structure', 'autoview.xml'));
 }

 static public function encode_content_links($content)
 {
  return $content;
 }

}

?>
