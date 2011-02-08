<?php

/**
*
* This page provides a callback authemtication service for the LiveCapture/Broadcast system
*
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence
**/

 require_once("../../config.php");
 require_once $CFG->dirroot.'/mnet/lib.php';
 require_once("lib.php");

 global $CFG;

 header('Content-type: text/plain');

 $versionCheck=optional_param('version', false, PARAM_BOOL);
 if ($versionCheck)
 {
  $av=get_record("modules", "name", "autoview");
  echo $av->version;
  return;
 }

 $clientType=optional_param('type', 'play', PARAM_RAW);
 $s = required_param('data',PARAM_RAW);

 if ($CFG->autoview_flashsecurity="randomkey")
 {
  $data=get_record("autoview_keys", "accesskey", $s);
  if (empty($data))
  {
   echo "bad key fail - no record (".$clientType.")";
   die();
  }

  //*** Need to set the global user variable, Guest users auth may fail without it***
  $USER=get_record("user", "id", $data->userid);

  //*****Get other info we need*****
  $context = get_context_instance(CONTEXT_MODULE, $data->cmid);
  $cm=get_record("course_modules", "id", $data->cmid);
  $autoview=get_record("autoview", "id", $cm->instance);

  //*****Check the time, the key shouldn't be more than 1 minute old*****
  $diff=time()-$data->time;

  if ($diff<60)
  {
   if (has_capability('mod/autoview:canrecordflash', $context, $data->userid) && $clientType=="avlivecapture" )
   {
    //*****This is a one-shot key, so delete from database*****
    delete_records('autoview_keys', 'id', $data->id);
    add_to_log($cm->course, "autoview", "flash play & rec", "view.php?id=$cm->id", $autoview->name, $cm->id, $data->userid);
    echo $data->ip."\nokrec\n";
    die();
   }

   if (has_capability('mod/autoview:canbroadcastflash', $context, $data->userid) && $clientType=="avbroadcaster" )
   {
    //*****This is a one-shot key, so delete from database*****
    delete_records('autoview_keys', 'id', $data->id);
    add_to_log($cm->course, "autoview", "flash play & rec", "view.php?id=$cm->id", $autoview->name, $cm->id, $data->userid);
    echo $data->ip."\nokrec\n";
    die();
   }

   if (has_capability('mod/autoview:viewpresentation', $context, $data->userid) && 
    ($clientType=="avreciever" || $clientType=="play"))
   {
    //*****Note playback keys are allowed to persist for non-custom clients which can't re-authenticate internally*****
    if ($clientType!="play")
        delete_records('autoview_keys', 'id', $data->id);

    add_to_log($cm->course, "autoview", "flash play", "view.php?id=$cm->id", $autoview->name, $cm->id, $data->userid);
    echo $data->ip."\nokplay\n";
    die();
   }

   //****Auth failed, delete the key just in case****
   delete_records('autoview_keys', 'id', $data->id);
   echo "not authorised fail (".$clientType.")";
  }
  else
  {
   delete_records('autoview_keys', 'id', $data->id);
   echo "fail timeout".$t['sec']." ".$diff;
   die();
  }
 }
 else
  echo "fail badkey (".$clientType.")";
?>
