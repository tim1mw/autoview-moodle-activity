<?php

include_once("generic.php");

class av_internal_file_storage extends av_generic_file_storage
{

 function get_base_path($courseid) {
  global $CFG;
  return $CFG->dataroot.'/'.$courseid;
 }

 function get_file_path($file, $courseid)
 {
  global $CFG;
  return $CFG->dataroot.'/'.$courseid.'/'.$file;
 }

 function check_course_dir($courseid)
 {
  global $CFG;
  $fileloc=$CFG->dataroot.'/'.$courseid;
  // Check the directory exists and create if necessary
  if (!file_exists($fileloc))
   mkdir($fileloc, $CFG->directorypermissions);
 }

 function check_configfile($file, $courseid)
 {
  global $CFG;
  $fileloc=$CFG->dataroot.'/'.$courseid.'/'.$file;
  if (!file_exists($fileloc))
   copy($CFG->dirroot.'/mod/autoview/avedit/blank.avx', $fileloc);
 }

 //If the config file is the same size as the blank template, it is assumed that this is an unedited blank presentation
 function pres_is_empty($file, $courseid)
 {
  global $CFG;
  $configfile=$CFG->dataroot.'/'.$courseid.'/'.$file;
  $template=$CFG->dirroot.'/mod/autoview/avedit/blank.avx';
  if (!file_exists($configfile))
  {
   copy($template, $configfile);
   return true;
  }

  if (filesize($configfile)==filesize($template))
   return true;

  return false;
 }

 /**
 * Gets the HTML base reference for the specified course
 * @param $courseid The course ID
 **/

 function get_htmlbase($courseid)
 {
  global $CFG;

  $htmlbase=$CFG->wwwroot.'/repository/coursefilearea/file.php';
 
  if ($CFG->slasharguments)
   $htmlbase.='/'.$courseid.'/';
  else
   $htmlbase.='?file=/'.$courseid.'/';

  return $htmlbase;
 }

 /**
 * Gets the file broswer URL for the specified course
 * @param $courseid The course ID
 */

 function get_filebrowser_url($courseid)
 {
  global $CFG;
  return $CFG->wwwroot."/files/index.php?id=".$courseid."&amp;choose=form.url";
 }

 /**
 * Gets the URL used to send XML data to the server
 **/

 function get_xmlsend_url()
 {
  global $CFG;
  return $CFG->wwwroot."/mod/autoview/recieveXML.php";
 }
}

?>
