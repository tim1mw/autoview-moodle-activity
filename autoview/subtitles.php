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

 if (! $autoview = get_record("autoview", "id", $l))
  error("Course module is incorrect");

 if (! $course = get_record("course", "id", $autoview->course))
  error("Course is misconfigured");

 if (! $cm = get_coursemodule_from_instance("autoview", $autoview->id, $course->id))
  error("Course Module ID was incorrect");

 require_login($course->id);

 echo process_xsl($CFG->dataroot.'/'.$course->id.'/'.$subfile, $CFG->dirroot.'/mod/autoview/templates/subtitles.xsl',array());
?>
