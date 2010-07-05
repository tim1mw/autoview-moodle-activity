<?php
/**
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence
**/

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
 if (testPeclHttp()==false)
 {
  die(get_string("pecl_http_warn", "autoview"));
 }

 $convertdata=convertPresentationFile($swf, $pdf, $jpg, $CFG->autoview_conversionkey,
  $CFG->autoview_conversionurl, $CFG->dataroot.'/'.$course->id.'/'.$url);

 $vresource=$CFG->wwwroot.'/mod/autoview/vresource/';

 if ($convertdata->headers["Content-Type"]=="text/plain")
 {
  $params= array(
   'vresource' => $vresource,
   'message' => get_string("conversionfailed", "autoview").'. '.$convertdata->body,
   'fname' => '',
   'slidecount' => '0',
   'swf' => '',
   'pdf' => '',
   'jpg' => '');
  echo process_xsl($CFG->dirroot."/mod/autoview/avedit/convert.xml", $CFG->dirroot."/mod/autoview/avedit/convert.xsl", $params);
 }
 else
 {
  $fname=stripFileExtension($url);
  $newfile=$CFG->dataroot.'/'.$course->id.'/'.$fname.'.zip';

  extactConvertorZip($convertdata, $newfile);
  //die(get_string("convertsavefailed", "autoview"));

  $params=array(
   'vresource' => $vresource,
   'message' => get_string("conversiondone", "autoview"),
   'fname' => $fname,
   'swf' => $swf,
   'pdf' => $pdf,
   'jpg' => $jpg);

  $xmlFile=$CFG->dataroot.'/'.$course->id.'/'.$fname.'.xml';
  if (!file_exists($xmlFile))
   echo process_xsl($CFG->dirroot."/mod/autoview/avedit/convert.xml", $CFG->dirroot."/mod/autoview/avedit/convert.xsl", $params);
  else
  {
   echo process_xsl($xmlFile, $CFG->dirroot."/mod/autoview/avedit/convert.xsl", $params);
   unlink($xmlFile);
  }
 }
?>