<?php
/**
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence
**/


 register_shutdown_function('fatalErrorShutdownHandler');
 
 function fatalErrorShutdownHandler()
 {
  $last_error = error_get_last();
  if ($last_error['type'] === E_ERROR) {
    echo "<pre>Fatal error:\n\n".$last_error['message']."\n".$last_error['file']."\n".$last_error['line']."</pre>";
  }
 }

 require_once("../../config.php");
 require_once("lib.php");

 $l=required_param('id',PARAM_INT);
 $url=required_param('url',PARAM_PATH);
 $swf=optional_param('swf', 'false', PARAM_TEXT);
 $pdf=optional_param('pdf', 'false', PARAM_TEXT);
 $jpg=optional_param('jpg', 'false', PARAM_TEXT);

 if (! $autoview = get_record("autoview", "id", $l))
  error("Course module is incorrect");

 if (! $course = get_record("course", "id", $autoview->course))
  error("Course is misconfigured");

 if (! $cm = get_coursemodule_from_instance("autoview", $autoview->id, $course->id))
  error("Course Module ID was incorrect");

 require_login($course->id);

 /***Check permissions***/
 $context = get_context_instance(CONTEXT_MODULE, $cm->id);

 if (!has_capability('mod/autoview:canconvertdocument', $context))
 {
  die(get_string("convertnotallowed", "autoview"));
 }

 /***Check this server is capable of commuinicating with the convertor***/
 if (testDocConv()==false)
 {
  die(get_string("pecl_http_warn", "autoview"));
 }

 $convertfile=convertPresentationFile($swf, $pdf, $jpg, $CFG->autoview_conversionkey,
  $CFG->autoview_conversionurl, $CFG->dataroot.'/'.$course->id.'/'.$url);

 $aveditdir=$CFG->wwwroot.'/mod/autoview/avedit/';

 if ($convertfile==false)
 {
  $params= array(
   'aveditdir' => $aveditdir,
   'message' => get_string("file_not_found", "autoview"),
   'fname' => '',
   'error' => 'true',
   'buttontext' => get_string("closetext", "autoview"),
   'slidecount' => '0',
   'swf' => '',
   'pdf' => '',
   'jpg' => '');
  echo process_xsl($CFG->dirroot."/mod/autoview/avedit/convert.xml", $CFG->dirroot."/mod/autoview/avedit/convert.xsl", $params);
 }
 else
 if (strpos($convertfile, ".txt")>0)
 {
  $params= array(
   'aveditdir' => $aveditdir,
   'message' => get_string("conversionfailed", "autoview"),
   'message2' => file_get_contents($convertfile),
   'fname' => '',
   'error' => 'true',
   'buttontext' => get_string("closetext", "autoview"),
   'slidecount' => '0',
   'swf' => '',
   'pdf' => '',
   'jpg' => '');
  echo process_xsl($CFG->dirroot."/mod/autoview/avedit/convert.xml", $CFG->dirroot."/mod/autoview/avedit/convert.xsl", $params);
  unlink($convertfile);
 }
 else
 if (strpos($convertfile, ".xml")>0)
 {
  if (!file_exists($convertfile))
  {
   $params=array(
    'aveditdir' => $aveditdir,
    'message' => get_string("conversionfailed", "autoview"),
    'message2' => get_string("conversionfailed_noerror", "autoview"),
    'fname' => '',
    'error' => 'true',
    'buttontext' => get_string("closetext", "autoview"),
    'swf' => $swf,
    'pdf' => $pdf,
    'jpg' => $jpg);

   echo process_xsl($CFG->dirroot."/mod/autoview/avedit/convert.xml", $CFG->dirroot."/mod/autoview/avedit/convert.xsl", $params);
  }
  else
  {
   $params=array(
    'aveditdir' => $aveditdir,
    'message' => get_string("conversiondone", "autoview"),
    'fname' => stripFileExtension($url),
    'error' => 'false',
    'buttontext' => get_string("addtext", "autoview"),
    'swf' => $swf,
    'pdf' => $pdf,
    'jpg' => $jpg);

   echo process_xsl($convertfile, $CFG->dirroot."/mod/autoview/avedit/convert.xsl", $params);
   unlink($convertfile);
  }
 }
?>
