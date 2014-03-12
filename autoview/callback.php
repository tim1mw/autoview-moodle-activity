<?php

/**
*
* This page provides a callback authemtication service for the LiveCapture/Broadcast system
*
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv3 Licence
**/

 global $CFG;

 require_once("../../config.php");
 require_once $CFG->dirroot.'/mnet/lib.php';
 require_once("lib.php");

 header('Content-type: text/plain');

 global $DB;

 $versionCheck=optional_param('version', false, PARAM_BOOL);
 if ($versionCheck)
 {
  $av=$DB->get_record("modules", array("name"=>"autoview"));
  if ($av->version)
   echo $av->version;
  else
  {
   echo get_config('mod_autoview', 'version');
   //The version field has been removed in Moodle 2.6, this compensates
   //require_once("version.php");
   //echo $module->version;
  }
  return;
 }

 $clientType=optional_param('type', 'play', PARAM_RAW);
 $s = required_param('data',PARAM_RAW);

 if (mdl21_getconfigparam("autoview", "flashsecurity")=="randomkey")
 {
  $data=$DB->get_record("autoview_keys", array("accesskey"=>$s));
  if (empty($data))
  {
   echo "bad key fail - no record (".$clientType.")";
   die();
  }

  //*** Need to set the global user variable, Guest users auth may fail without it***
  $USER=$DB->get_record("user", array("id"=>$data->userid));

  //*****Get other info we need*****
  $context = get_context_instance(CONTEXT_MODULE, $data->cmid);
  $cm=$DB->get_record("course_modules", array("id"=>$data->cmid));
  $autoview=$DB->get_record("autoview", array("id"=>$cm->instance));

  //*****Check the time, the key shouldn't be more than 1 minute old*****
  $diff=time()-$data->time;

  if ($diff<120)
  {
   if (has_capability('mod/autoview:canrecordflash', $context, $data->userid) && $clientType=="avlivecapture" )
   {
    //*****This is a one-shot key, so delete from database*****
    $DB->delete_records('autoview_keys', array('id'=>$data->id));
    add_to_log($cm->course, "autoview", "flash play and rec", "view.php?id=$cm->id", $autoview->name, $cm->id, $data->userid);
    echo $data->ip."\nokrec\n";
    die();
   }

   if (has_capability('mod/autoview:canbroadcastflash', $context, $data->userid) && $clientType=="avbroadcaster" )
   {
    //*****This is a one-shot key, so delete from database*****
    $DB->delete_records('autoview_keys', array('id'=>$data->id));
    add_to_log($cm->course, "autoview", "flash play and rec", "view.php?id=$cm->id", $autoview->name, $cm->id, $data->userid);
    echo $data->ip."\nokrec\n";
    die();
   }

   if (has_capability('mod/autoview:viewpresentation', $context, $data->userid) && 
    ($clientType=="avreciever" || $clientType=="play"))
   {
    //*****Note playback keys are allowed to persist for non-custom clients which can't re-authenticate internally*****
    if ($clientType!="play")
        $DB->delete_records('autoview_keys', array('id'=>$data->id));

    add_to_log($cm->course, "autoview", "flash play", "view.php?id=$cm->id", $autoview->name, $cm->id, $data->userid);
    echo $data->ip."\nokplay\n";
    die();
   }

   //****Auth failed, delete the key just in case****
   $DB->delete_records('autoview_keys', array('id'=>$data->id));
   echo "not authorised fail (".$clientType.")";
  }
  else
  {
   $DB->delete_records('autoview_keys', array('id'=>$data->id));
   echo "fail timeout ".$diff;
   die();
  }
 }
 else
  echo "fail badkey (".$clientType.")";
?>
