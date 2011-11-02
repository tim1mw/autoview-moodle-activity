<?php
/**
*
* This page translates the AutoView subtitles file using an XSL style sheet
*
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence
**/

 require_once("../../config.php");
 require_once("lib.php");

 $l = required_param('l',PARAM_INT);
 $subfile = required_param('subfile', PARAM_TEXT);

 global $DB;

 if (! $autoview = $DB->get_record("autoview", array("id"=>$l)))
  error("Course module is incorrect");

 if (! $course = $DB->get_record("course", array("id"=>$autoview->course)))
  error("Course is misconfigured");

 if (! $cm = get_coursemodule_from_instance("autoview", $autoview->id, $course->id))
  error("Course Module ID was incorrect");

 require_login($course->id);

 $avs=autoview_get_file_storage($autoview->storage);

 echo process_xsl($avs->get_file_path($subfile, $course->id), $CFG->dirroot.'/mod/autoview/templates/subtitles.xsl',array());
?>
