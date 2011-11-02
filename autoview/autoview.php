<?php
/**
*
* This page translates the AutoView config file into HTML for browser display using the XSL style sheet
*
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv3 Licence
**/

 require_once("../../config.php");
 require_once $CFG->dirroot.'/mnet/lib.php';
 require_once("lib.php");

 $l = optional_param('l',0,PARAM_INT);
 $editval = optional_param('edit',false,PARAM_BOOL);
 $flashauthonly = optional_param('flashauthonly', false, PARAM_BOOL);

 global $DB;

 if (! $autoview = $DB->get_record("autoview", array("id"=>$l)))
  error("Course module is incorrect");

 if (! $course = $DB->get_record("course", array("id"=>$autoview->course)))
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

 $avs=autoview_get_file_storage($autoview->storage);

 $exitURL="";
 if ($autoview->noframe && $editval==false)
  $exitURL=$CFG->wwwroot."/course/view.php?id=".$course->id;

 $pflp=strpos(current_language(), "_");
 if ($pflp>0)
  $preferedLang=substr(current_language(), 0, strpos(current_language(), "_"));
 else
  $preferedLang=current_language();

 $avxfile=$avs->get_file_path($autoview->configfile, $course->id);
 $titles=autoview_convert_js_escapes(process_xsl($avxfile, $CFG->dirroot.'/mod/autoview/templates/pre-titles.xsl', array()));

 $parameters = array(
  'vresource' => $CFG->wwwroot.'/mod/autoview/vresource/',
  'htmlbase' => $avs->get_htmlbase($course->id),
  'qtrefurl' => $CFG->wwwroot.'/mod/autoview/qtref.php?l='.$l.'&qturl=',
  'xmlsubtitle' => $CFG->wwwroot.'/mod/autoview/subtitles.php?l='.$l.'&subfile=',
  'exitURL' => $exitURL,
  'title' => $autoview->name,
  'preferedLang' => $preferedLang,
  'bodystyle' => 'margin-left:0px;margin-right:0px;',
  'nojsMessage' => get_string('nojsmessage', 'autoview')."\n\n".$autoview->name."\n".$titles);

 if ($CFG->version>=2010000000)
   $parameters['themeimport']=$CFG->wwwroot.'/mod/autoview/import-theme2.js';
 else
   $parameters['themeimport']=$CFG->wwwroot.'/mod/autoview/import-theme.js';

 /***If this person can edit, set the generic editor parameters***/
 if ($canedit)
 {
  $parameters['aveditdir']=$CFG->wwwroot.'/mod/autoview/avedit/';
  $parameters['extension']=$CFG->wwwroot.'/mod/autoview/avedit/extension.js';
 }

 /***This server has flash based live capture*****/
 if (strlen(trim(mdl21_getconfigparam("autoview", "flashserver")))>0 && strlen(trim(mdl21_getconfigparam("autoview", "flashcapture")))>0)
 {
  /***Common parameters for anybody using the flash system***/
  $parameters['flashhost']=$CFG->wwwroot;
  $parameters['flashcapture']=mdl21_getconfigparam("autoview", "flashcapture");;
  $parameters['flashserver']=mdl21_getconfigparam("autoview", "flashserver");
  $parameters['user']=$USER->firstname." ".$USER->lastname;

  /***Permissions for flash usage***/
  if ($canrecordflash || $canbroadcastflash)
  {
   $parameters['flashrecord']=$canrecordflash;
   $parameters['flashbroadcast']=$canbroadcastflash;
   if (mdl21_configparamisset("autoview", "max_record_kbps"))
    $parameters['recordMaxKbps']=mdl21_getconfigparam("autoview", "max_record_kbps");
   $fp=dirname($autoview->configfile);
   if ($fp==".")
    $parameters['flashpath']="";
   else
    $parameters['flashpath']=$fp;
  }
 }

 /***Advanced stuff***/
 if (strlen(trim(mdl21_getconfigparam("autoview", "js_extras")))>0)
  $parameters['jsExtras']=mdl21_getconfigparam("autoview", "js_extras");

 echo process_xsl($avxfile, $CFG->dirroot.'/mod/autoview/templates/autoview.xsl', $parameters);
?>
