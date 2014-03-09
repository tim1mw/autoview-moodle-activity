<?PHP
/**
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv3 Licence
**/

/// Library of functions and constants for module AutoView

define("AUTOVIEW_MAX_NAME_LENGTH", 50);
define("AUTOVIEW_STORAGE_INTERNAL", 0);
define("AUTOVIEW_STORAGE_EXTERNAL", 1);
require_once("avphplib/avlib.php");

global $CFG;
if ($CFG->version>=2010000000)
 require_once($CFG->dirroot."/mod/autoview/lib-mdl2.php");
else
 require_once($CFG->dirroot."/mod/autoview/lib-mdl1.php");


function autoview_add_instance($autoview) {
/// Given an object containing all the necessary data, 
/// (defined by the form in mod.html) this function 
/// will create a new instance and return the id number 
/// of the new instance.

    global $CFG, $DB;

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
    //$mainrecord->storage=mdl21_getconfigparam("autoview", "storage_type");

    $avs=autoview_get_file_storage($CFG->autoview_storage_type);
    $avs->check_course_dir($mainrecord->course);
    
    if (isset($autoview->configfile) && strlen($autoview->configfile)>0)
     $mainrecord->configfile=$autoview->configfile;
    else
    {
     $fname=clean_filename(str_replace(' ', '_', trim($mainrecord->name)));

     if ($autoview->usedir)
     {
      $fileloc=$CFG->dataroot.'/'.$mainrecord->course.'/'.$fname;
      mkdir($fileloc, $CFG->directorypermissions);
      $mainrecord->configfile=$fname.'/config.avx';
     }
     else
      $mainrecord->configfile=$fname.'.avx';
    }
    $instance_id=$DB->insert_record("autoview", $mainrecord);

    $avs->check_configfile($mainrecord->configfile, $mainrecord->course);

    return $instance_id;
}


function autoview_update_instance($autoview) {
/// Given an object containing all the necessary data, 
/// (defined by the form in mod.html) this function 
/// will update an existing instance with new data.

    global $DB;

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

    $ret=$DB->update_record("autoview", $mainrecord);

    $avrec = $DB->get_record("autoview", array("id"=>$mainrecord->id));
    $avs=autoview_get_file_storage($avrec->storage);
    $avs->check_course_dir($mainrecord->course);
    $avs->check_configfile($mainrecord->configfile, $mainrecord->course);

    return $ret;
}

function autoview_delete_instance($id) {
/// Given an ID of an instance of this module, 
/// this function will permanently delete the instance 
/// and any data that depends on it.  

    global $DB;

    /**For some reason the $DB object keeps getting set to null here when deleting
       in mdl1. This fixes the problem.***/
    if ($DB==null && $CFG->version<=2010000000)
    {
        $DB=new mdl21_db_abstract();
    }

    if (! $autoview = $DB->get_record("autoview", array("id"=>$id))) {
        return false;
    }

    $result = true;

    if (!$DB->delete_records("autoview", array("id"=>$autoview->id))) {
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
 global $CFG, $DB;
 $t=time();
 $sql=" `time` < ".($t-($CFG->sessiontimeout));
 $DB->delete_records_select("autoview_keys", $sql);
 return true;
}

/***File storage handlers***/

function autoview_get_file_storage($type)
{
 if ($type==AUTOVIEW_STORAGE_INTERNAL)
 {
  include_once("storage/internal.php");
  return new av_internal_file_storage();
 }

 /*
 if ($type==AUTOVIEW_STORAGE_EXTERNAL)
 {
  include_once("storage/external.php");
  return new av_external_file_storage();
 }
 */

 include_once("storage/generic.php");
 return new av_generic_file_storage();
}

/***End of Moodle specific functions***/



/***Prepares the authorisation for AV Live callbacks***/

function autoview_prepare_auth($course, $USER, $autoview, $cm)
{
 global $CFG, $DB;

 $data="c:".$course->id.";x:".$cm->id;

 if (mdl21_getconfigparam("autoview", "flashsecurity")=="randomkey")
 {
  $skey=rand(1000000,9999999)."".rand(1000000,9999999)."".rand(1000000,9999999);
  $data=$data.";k:".$skey;

  $record=new stdclass;
  $record->accesskey=$skey;
  $record->ip=$_SERVER['REMOTE_ADDR'];
  $record->userid=$USER->id;
  $record->cmid=$cm->id;
  $record->time = time();
  $DB->insert_record("autoview_keys", $record);
 }

 return base64_encode($data);
}

?>
