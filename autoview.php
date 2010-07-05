<?php
/**
*
* This page translates the AutoView config file into HTML for browser display using the XSL style sheet
*
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence
**/

 require_once("../../config.php");
 require_once $CFG->dirroot.'/mnet/lib.php';
 require_once("lib.php");

 $l = optional_param('l',0,PARAM_INT);
 $editval = optional_param('edit',false,PARAM_BOOL);
 $flashauthonly = optional_param('flashauthonly', false, PARAM_BOOL);

 if (! $autoview = get_record("autoview", "id", $l))
  error("Course module is incorrect");

 if (! $course = get_record("course", "id", $autoview->course))
  error("Course is misconfigured");

 if (! $cm = get_coursemodule_from_instance("autoview", $autoview->id, $course->id))
  error("Course Module ID was incorrect");

 require_course_login($course, true, $cm);
 $context = get_context_instance(CONTEXT_MODULE, $cm->id);

 if (!has_capability('mod/autoview:viewpresentation', $context))
 {
  error(get_string("not_allowed", "autoview"));
  die;
 }

 /***Check other permissions***/
 $canedit=false;
 $canrecordflash=false;
 $canbroadcastflash=false;

 /***Only set these values if we are editing***/
 if ($editval)
 {
  $canedit=has_capability('mod/autoview:canedit', $context);
  /***Can only be true if this user is allowed to edit***/
  if ($canedit)
  {
   $canrecordflash=has_capability('mod/autoview:canrecordflash', $context);
   $canbroadcastflash=has_capability('mod/autoview:canbroadcastflash', $context);
  }
 }

 /***If this is just an auth request, deal with it and exit***/
 if ($flashauthonly)
 {
  echo autoview_prepare_auth($course, $USER, $autoview, $cm);
  die();
 }

 $htmlbase=$CFG->wwwroot.'/file.php/'.$course->id.'/';

 $exitURL="";
 if ($autoview->noframe && $editval==false)
  $exitURL=$CFG->wwwroot."/course/view.php?id=".$course->id;

 $preferedLang=substr(current_language(), 0, strpos(current_language(), "_"));
 $avxfile=$CFG->dataroot.'/'.$course->id.'/'.$autoview->configfile;
 $titles=autoview_convert_js_escapes(process_xsl($avxfile, $CFG->dirroot.'/mod/autoview/templates/pre-titles.xsl', array()));

 $parameters = array(
  'vresource' => $CFG->wwwroot.'/mod/autoview/vresource/',
  'htmlbase' => $htmlbase,
  'qtrefurl' => $CFG->wwwroot.'/mod/autoview/qtref.php?l='.$l.'&qturl=',
  'xmlsubtitle' => $CFG->wwwroot.'/mod/autoview/subtitles.php?l='.$l.'&subfile=',
  'exitURL' => $exitURL,
  'title' => $autoview->name,
  'preferedLang' => $preferedLang,
  'nojsMessage' => get_string('nojsmessage', 'autoview')."\n\n".$autoview->name."\n".$titles);

 /***If this person can edit, set the generic editor parameters***/
 if ($canedit)
 {
  $parameters['aveditdir']=$CFG->wwwroot.'/mod/autoview/avedit/';
  $parameters['extension']=$CFG->wwwroot.'/mod/autoview/avedit/extension.js';
 }

 /***This server has flash based live capture*****/
 if (strlen(trim($CFG->autoview_flashserver))>0 && strlen(trim($CFG->autoview_flashcapture))>0)
 {
  /***Common parameters for anybody using the flash system***/
  $parameters['flashhost']=$CFG->wwwroot;
  $parameters['flashcapture']=$CFG->autoview_flashcapture;
  $parameters['flashserver']=$CFG->autoview_flashserver;
  $parameters['user']=$USER->firstname." ".$USER->lastname;

  /***Permissions for flash usage***/
  if ($canrecordflash || $canbroadcastflash)
  {
   $parameters['flashrecord']=$canrecordflash;
   $parameters['flashbroadcast']=$canbroadcastflash;
   $parameters['flashpath']=dirname($autoview->configfile);
  }
 }

 /***Advanced stuff***/
 if (strlen(trim($CFG->autoview_js_extras))>0)
  $parameters['jsExtras']=$CFG->autoview_js_extras;

 echo process_xsl($avxfile, $CFG->dirroot.'/mod/autoview/templates/autoview.xsl', $parameters);
?>
