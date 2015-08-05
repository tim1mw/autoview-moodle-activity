<?php
/**
* @package mod
* @subpackage autoview
* @copyright 2011 onwards Tim Williams (tmw@autotrain.org), AutoTrain e-Learning
* @licence GNU GPL v2 or later
**/

class restore_autoview_activity_structure_step extends restore_activity_structure_step
{
 protected function define_structure()
 {
  $paths = array();
  $paths[] = new restore_path_element('autoview', '/activity/autoview');
  return $this->prepare_activity_structure($paths);
 }

 protected function process_autoview($data)
 {
  global $DB;

  $data = (object)$data;
  $oldid = $data->id;

  
  $data->course = $this->get_courseid();
  $data->timemodified = $this->apply_date_offset($data->timemodified);
  
  $newitemid = $DB->insert_record('autoview', $data);
  $this->apply_activity_instance($newitemid);
 }

 protected function after_execute()
 {
  $this->add_related_files('mod_autoview', 'intro', null);
 }
}
?>
