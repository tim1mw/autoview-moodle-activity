<?php

class av_generic_file_storage
{

 /**
 * Gets the path of the AVX config file
 **/

 function get_file_path($file, $courseid)
 {
  return "";
 }

 /**
 * Check that the file storage for this course has been set up
 * @param $courseid The course ID
 **/

 function check_course_dir($courseid)
 {

 }

 /*
 * Check that there is a config file for this presentation and create a new blank one if necessary
 * @param $file The config file name
 * @param $courseid The course ID
 **/

 function check_configfile($file, $courseid)
 {

 }

 /**
 * Check to see if the presentation file is blank
 * @param $file The config file name
 * @param $courseid The course ID
 **/

 function pres_is_empty($file, $courseid)
 {
  return false;
 }

 /**
 * Gets the HTML base reference for the specified course
 * @param $courseid The course ID
 **/

 function get_htmlbase($file, $courseid)
 {
  return "";
 }

 /**
 * Gets the file broswer URL for the specified course
 * @param $courseid The course ID
 */

 function get_filebrowser_url($courseid)
 {
  return "";
 }

 /**
 * Gets the URL used to send XML data to the server
 **/

 function get_xmlsend_url()
 {
  return "";
 }

}

?>
