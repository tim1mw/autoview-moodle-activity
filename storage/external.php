<?php

class av_external_file_storage
{

 /**
 * Gets the path of the a file in the storage area
 **/

 function get_file_path($file, $courseid)
 {
  global $CFG;
  if (strlen($CFG->autoview_external_fileloc)>0)
   return $CFG->autoview_external_fileloc."/".$courseid."/".$file;
  else
   return $CFG->autoview_flashcapture."/getfile.jsp?secret=".$CFG->autoview_external_filekey.
    "&host=".$CFG->wwwroot."&file=".$courseid."/".$file;
 }

 /**
 * Check that the file storage for this course has been set up
 * @param $courseid The course ID
 **/

 function check_course_dir($courseid)
 {
  admin_func("action=checkcoursedir&courseid=".$courseid);
 }

 /*
 * Check that there is a config file for this presentation and create a new blank one if necessary
 * @param $file The config file name
 * @param $courseid The course ID
 **/

 function check_configfile($file, $courseid)
 {
  admin_func("action=checkconfigfile&courseid=".$courseid."&file=".$file);
 }

 /**
 * Check to see if the presentation file is blank
 * @param $file The config file name
 * @param $courseid The course ID
 **/

 function pres_is_empty($file, $courseid)
 {
  $r=admin_func("action=presisempty&courseid=".$courseid."&file=".$file);
  if ($r=="true")
   return true;

  return false;
 }

 /**
 * Reads the URL
 **/

 private function admin_func($params)
 {
  global $CFG;
  $handle = fopen($CFG->autoview_flashcapture."/adminaction.jsp?&host=".$CFG->wwwroot."&secret=".$CFG->autoview_external_filekey."&".$params, "rb");
  $contents = '';
  while (!feof($handle))
   $contents .= fread($handle, 8192);
  fclose($handle);
  return $contents;
 }

 /**
 * Gets the HTML base reference for the specified course
 * @param $courseid The course ID
 **/

 function get_htmlbase($courseid)
 {
  global $CFG;
  return $CFG->autoview_flashcapture."/restricted/".base64_encode($CFG->wwwroot)."/".$courseid;
 }

 /**
 * Gets the file broswer URL for the specified course
 * @param $courseid The course ID
 */

 function get_filebrowser_url($courseid)
 {
  global $CFG;
  return $CFG->autoview_flashcapture."/filebrowser.jsp?host=".$CFG->wwwroot."&id=".$courseid."&amp;choose=form.url";
 }

 /**
 * Gets the URL used to send XML data to the server
 **/

 function get_xmlsend_url()
 {
  global $CFG;
  return $CFG->autoview_flashcapture."/recieveXML.jsp";
 }

}

?>
