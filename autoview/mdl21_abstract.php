<?php

/**
* Moodle 2 DB methods compatability object for Moodle 1
* @author Tim Williams
* @licence GNU GPLv2 or later
**/

$DB=new mdl21_db_abstract();

/**
* This class maps the method pattern of the Moodle 2.x database object methods back to Moodle 1.x function calls
**/

class mdl21_db_abstract
{
 public function get_record($table, $params)
 {
  return eval("return get_record('".$table."'".$this->process_params($params).");");
 }

 public function get_records($table, $params)
 {
  return eval("return get_records('".$table."'".$this->process_params($params).");");
 }

 public function get_records_sql($sql, $a=null, $start=null, $size=null)
 {
  /**$a is ignored since it isn't being used***/
  return get_records_sql($sql, $start, $size);
 }

 public function insert_record($a, $b)
 {
  return insert_record($a, $b);
 }

 public function delete_records($table, $params)
 {
  return eval("return delete_records('".$table."'".$this->process_params($params).");");
 }

 public function delete_records_select($t, $sql)
 {
  return delete_records_select($t, $sql);
 }

 public function update_record($t, $params)
 {
  return update_record($t, $params);
 }

 public function count_records($t, $params)
 {
  return eval("return count_records('".$t."'".$this->process_params($params).");");
 }

 private function process_params($params)
 {
  $e="";
  foreach($params as $k=>$p)
   $e.=", '".$k."', '".$params[$k]."'";

  return $e;
 }

}

/**
* Moodle 2 PAGE object compatibility for Moodle 1
**/

$PAGE=new mdl21_page_abstract();
class mdl21_page_abstract
{
 var $navbar;

 function __construct()
 {
  $this->navbar=new mdl21_navbar_abstract();
  $this->blocks=new mdl21_blocks_abstract();
 }

 public function set_url($url, $params)
 {}

 public function set_context($context)
 {}

 public function set_course($course)
 {}

 public function set_title($title)
 {}

 public function set_heading($heading)
 {}
}

/**
* Moodle 2 Navigation object comaptibility for Moodle 1
**/

class mdl21_navbar_abstract
{
 public function add()
 {}
}

/**
* Moodle 2 Block object comaptibility for Moodle 1
**/

class mdl21_blocks_abstract
{
 public function show_only_fake_blocks()
 {}
}

/**
* Moodle 2 OUTPUT object compatibility for Moodle 1
**/

$OUTPUT=new mdl21_output_abstract();

class mdl21_output_abstract
{

 public function heading($h)
 {
  print_heading($h);
 }

 public function footer()
 {
  print_footer();
 }

 public function pix_icon($icon, $str)
 {
  global $CFG;
  return '<img alt="'.$str.'" class="smallicon" title="'.$str.'" src="'.$CFG->pixpath.'/'.$icon.'.gif" />';
 }

 public function pix_url($icon)
 {
  global $CFG;
  return $CFG->pixpath.'/'.$icon.'.gif';
 }

 public function help_icon($identifier, $component = 'moodle', $linktext = '')
 {
  return helpbutton($identifier, $linktext, $component, "both", $linktext,'', true);
 }
}

/**
* Methods to help with the changes to config param structure
**/

function mdl21_getconfigparam($m, $v)
{
 global $CFG;
 return eval('return $CFG->'.$m.'_'.$v.';');
}

function mdl21_configparamisset($m, $v)
{
 global $CFG;
 return eval('return isset($CFG->'.$m.'_'.$v.');');
}

/**
* These methods exists to solve a global varaible scoping problem in PHP,
* sometimes the $DB/$OUTPUT/$PAGE objects contstructed above just can't be referenced 
* from the referencing page
**/

function mdl21_get_output()
{
 return new mdl21_output_abstract();
}

function mdl21_get_DB()
{
 return new mdl21_db_abstract();
}
?>
