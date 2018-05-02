<?php
/**
* @package mod
* @subpackage autoview
* @copyright 2011 onwards Tim Williams (tmw@autotrain.org), AutoTrain e-Learning
* @licence GNU GPL v2 or later
**/


defined('MOODLE_INTERNAL') || die();

require_once('restore_autoview_stepslib.php');

class restore_autoview_activity_task extends restore_activity_task 
{

 protected function define_my_settings()
 {
 }

 protected function define_my_steps()
 {
  $this->add_step(new restore_autoview_activity_structure_step('autoview_structure', 'autoview.xml'));
 }

 static public function define_decode_contents()
 {
  return array();
 }

 static public function define_decode_rules()
 {
  return array();
 }

 static public function define_restore_log_rules()
 {
  $rules=array();

  $rules[] = new restore_log_rule('autoview', 'add', 'view.php?id={course_module}', '{autoview}');
  $rules[] = new restore_log_rule('autoview', 'update', 'view.php?id={course_module}', '{autoview}');
  $rules[] = new restore_log_rule('autoview', 'view', 'view.php?id={course_module}', '{autoview}');
  $rules[] = new restore_log_rule('autoview', 'flash play & rec', 'view.php?id={course_module}', '{autoview}');
  $rules[] = new restore_log_rule('autoview', 'flash play', 'view.php?id={course_module}', '{autoview}');

  return $rules;
 }

 static public function define_restore_log_rules_for_course()
 {
  $rules=array();
  $rules[] = new restore_log_rule('autoview', 'view all', 'index.php?id={course}', null);

  return $rules;
 }
}
?>
