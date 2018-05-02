<?php
/**
* @package mod
* @subpackage autoview
* @copyright 2011 onwards Tim Williams (tmw@autotrain.org), AutoTrain e-Learning
* @licence GNU GPL v2 or later
**/

defined('MOODLE_INTERNAL') || die;

class backup_autoview_activity_structure_step extends backup_activity_structure_step
{

 protected function define_structure()
 {

  // Define each element separated
 
  $autoview = new backup_nested_element('autoview', array('id'),
   array('course', 'name', 'content', 'timemodified', 'configfile', 'noframe', 'summary'));
 
  //***We do not need to backup the keys table***

  // Build the tree
 
  // Define sources

  $autoview->set_source_table('autoview', array('id' => backup::VAR_ACTIVITYID));
 
  // Define id annotations
 
  // Define file annotations
  $autoview->annotate_files('mod_autoview', 'intro', null);

  // Return the root element (choice), wrapped into standard activity structure
  return $this->prepare_activity_structure($autoview);
 }
}
?>
