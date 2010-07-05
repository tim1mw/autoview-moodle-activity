<?PHP
/**
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence
**/

/// Library of functions and constants for module AutoView

define("AUTOVIEW_MAX_NAME_LENGTH", 50);
require_once("avphplib/avlib.php");


function autoview_add_instance($autoview) {
/// Given an object containing all the necessary data, 
/// (defined by the form in mod.html) this function 
/// will create a new instance and return the id number 
/// of the new instance.

    $mainrecord->name = strip_tags($autoview->content);
    if (strlen($mainrecord->name) > AUTOVIEW_MAX_NAME_LENGTH)
        $mainrecord->name = substr($mainrecord->name, 0, AUTOVIEW_MAX_NAME_LENGTH)."...";
    else
    if (strlen($mainrecord->name) == 0)
        $mainrecord->name = "AutoView ".time();

    $mainrecord->timemodified = time();
    $mainrecord->course=$autoview->course;
    $mainrecord->content=$autoview->content;
    $mainrecord->summary=$autoview->summary;
    if ($autoview->noframe=="1")
     $mainrecord->noframe=1;
    else
     $mainrecord->noframe=0; 

    autoview_check_course_dir($mainrecord->course);

    if (isset($autoview->configfile) && strlen($autoview->configfile)>0)
     $mainrecord->configfile=$autoview->configfile;
    else
    {
     $fname=clean_filename(str_replace(' ', '_', trim($mainrecord->name)));
     //echo $autoview->usedir;
     if ($autoview->usedir=="true")
     {
      global $CFG;
      $fileloc=$CFG->dataroot.'/'.$mainrecord->course.'/'.$fname;
      mkdir($fileloc, $CFG->directorypermissions);
      $mainrecord->configfile=$fname.'/config.avx';
     }
     else
      $mainrecord->configfile=$fname.'.avx';
    }
    $instance_id=insert_record("autoview", $mainrecord);
    autoview_check_course_dir($mainrecord->course);
    autoview_check_configfile($mainrecord->configfile, $mainrecord->course);
    return $instance_id;
}


function autoview_update_instance($autoview) {
/// Given an object containing all the necessary data, 
/// (defined by the form in mod.html) this function 
/// will update an existing instance with new data.

    $mainrecord->name = strip_tags($autoview->content);
    if (strlen($mainrecord->name) > AUTOVIEW_MAX_NAME_LENGTH) {
        $mainrecord->name = substr($mainrecord->name, 0, AUTOVIEW_MAX_NAME_LENGTH)."...";
    }

    $mainrecord->id=$autoview->instance;
    $mainrecord->timemodified = time();
    $mainrecord->course=$autoview->course;
    $mainrecord->content=$autoview->content;
    $mainrecord->summary=$autoview->summary;
    $mainrecord->configfile=$autoview->configfile;
    if ($autoview->noframe=="1")
     $mainrecord->noframe=1;
    else
     $mainrecord->noframe=0;    

    $ret=update_record("autoview", $mainrecord);
    autoview_check_course_dir($mainrecord->course);
    autoview_check_configfile($mainrecord->configfile, $mainrecord->course);
    return $ret;
}

function autoview_delete_instance($id) {
/// Given an ID of an instance of this module, 
/// this function will permanently delete the instance 
/// and any data that depends on it.  

    if (! $autoview = get_record("autoview", "id", $id)) {
        return false;
    }

    $result = true;

    if (!delete_records("autoview", "id", $autoview->id)) {
        $result = false;
    }

    return $result;
}


function autoview_get_participants($autoviewid) {
//Returns the users with data in one resource
//(NONE, but must exist on EVERY mod !!)

    return false;
}

function autoview_get_coursemodule_info($coursemodule) {
/// Given a course_module object, this function returns any 
/// "extra" information that may be needed when printing
/// this activity in a course listing.
///
/// See get_array_of_activities() in course/lib.php

   return false;
}

function autoview_cron()
{
 global $CFG;
 $t=gettimeofday();
 $sql=" `time` < ".($t['sec']-$CFG->sessiontimeout);
 delete_records_select("autoview_keys", $sql);
 return true;
}

/***End of Moodle specific functions***/

function autoview_check_course_dir($courseid)
{
    global $CFG;
    $fileloc=$CFG->dataroot.'/'.$courseid;
    // Check the directory exists and create if necessary
    if (!file_exists($fileloc))
        mkdir($fileloc, $CFG->directorypermissions);
}

function autoview_check_configfile($file, $courseid) {
    global $CFG;
    $fileloc=$CFG->dataroot.'/'.$courseid.'/'.$file;
    if (!file_exists($fileloc))
        copy($CFG->dirroot.'/mod/autoview/avedit/blank.avx', $fileloc);
}

//If the config file is the same size as the blank template, it is assumed that this is an unedited blank presentation
function autoview_pres_is_empty($autoview)
{
   global $CFG;
   $configfile=$CFG->dataroot.'/'.$autoview->course.'/'.$autoview->configfile;
   $template=$CFG->dirroot.'/mod/autoview/avedit/blank.avx';
   if (filesize($configfile)==filesize($template))
    return true;

   return false;
}

/***Prepares the authorisation for AV Live callbacks***/

function autoview_prepare_auth($course, $USER, $autoview, $cm)
{
 global $CFG;

 $data="c:".$course->id.";x:".$cm->id;

 if ($CFG->autoview_flashsecurity=="randomkey")
 {
  $skey=rand(1000000,9999999)."".rand(1000000,9999999)."".rand(1000000,9999999);
  $data=$data.";k:".$skey;

  $record->accesskey=$skey;
  $record->ip=$_SERVER['REMOTE_ADDR'];
  $record->userid=$USER->id;
  $record->cmid=$cm->id;
  $record->time = time();

  insert_record("autoview_keys", $record);
 }

 return base64_encode($data);
}

?>
