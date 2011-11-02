<?php
/**
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPL v3 Licence
**/

require_once("avphplib/avlib.php");
require_once("../../config.php");
require_once("lib.php");

$l = optional_param('l',0,PARAM_INT);     // Autoview ID
$qturl= required_param('qturl', PARAM_TEXT);

global $DB;

if (! $autoview = $DB->get_record("autoview", array("id"=>$l)))
 error("Course module is incorrect");

if (! $course = $DB->get_record("course", array("id"=>$autoview->course)))
 error("Course is misconfigured");

if (! $cm = get_coursemodule_from_instance("autoview", $autoview->id, $course->id))
 error("Course Module ID was incorrect");

require_login($course->id);

sendQTRefMovie($qturl);

?>
