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

function autoview_add_instance($autoview) {
/// Given an object containing all the necessary data, 
/// (defined by the form in mod.html) this function 
/// will create a new instance and return the id number 
/// of the new instance.

    global $CFG, $DB;

    $mainrecord = new stdClass;
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
    if (property_exists($autoview, 'noframe') && $autoview->noframe=="1")
     $mainrecord->noframe=1;
    else
     $mainrecord->noframe=0;
    //$mainrecord->storage=mdl21_getconfigparam("autoview", "storage_type");

    $av_config=get_config("autoview");
    $avs=autoview_get_file_storage($av_config->storage_type);
    $avs->check_course_dir($mainrecord->course);
    
    if (isset($autoview->configfile) && strlen($autoview->configfile)>0)
     $mainrecord->configfile=$autoview->configfile;
    else
    {
     $fname=clean_filename(str_replace(' ', '_', trim($mainrecord->name)));

     if ($autoview->usedir)
     {
      $fileloc=$CFG->dataroot.'/'.$mainrecord->course.'/'.$fname;
      if (!file_exists($fileloc))
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

    $mainrecord=new stdClass;
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
    if (property_exists($autoview, 'noframe') && $autoview->noframe=="1")
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
 $av_config=get_config("autoview");

 if ($av_config->flashsecurity=="randomkey")
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

function autoview_has_dependencies($rm=false)
{
 global $DB;
 $ok=true;
 $m="";

 $br=$DB->get_record("block", array("name"=>"repo_filemanager"));
 if (!$br)
 {
  $m.="<div class=\"errorbox\" style=\"color:#ff0000\"><p style=\"warning\">".get_string("no_repofileman", "autoview")."</p></div>\n";
  $ok=false;
 }

 $rr=$DB->get_record("repository", array("type"=>"coursefilearea"));
 if (!$rr)
 {
  $m.="<div class=\"errorbox\" style=\"color:#ff0000\"><p style=\"warning\">".get_string("no_coursefilearea", "autoview")."</p></div>\n";
  $ok=false;
 }
 
 if ($rm)
  return $m;

 echo $m;
 return $ok;
}

/**
 * @uses FEATURE_GROUPS
 * @uses FEATURE_GROUPINGS
 * @uses FEATURE_GROUPMEMBERSONLY
 * @uses FEATURE_MOD_INTRO
 * @uses FEATURE_COMPLETION_TRACKS_VIEWS
 * @uses FEATURE_GRADE_HAS_GRADE
 * @uses FEATURE_GRADE_OUTCOMES
 * @param string $feature FEATURE_xx constant for requested feature
 * @return mixed True if module supports feature, false if not, null if doesn't know
 */
function autoview_supports($feature)
{
    switch($feature)
    {
        case FEATURE_GROUPS:                  return false;
        case FEATURE_GROUPINGS:               return false;
        case FEATURE_GROUPMEMBERSONLY:        return false;
        case FEATURE_MOD_INTRO:               return false;
        case FEATURE_COMPLETION_TRACKS_VIEWS: return false;
        case FEATURE_GRADE_HAS_GRADE:         return false;
        case FEATURE_GRADE_OUTCOMES:          return false;
        case FEATURE_BACKUP_MOODLE2:          return true;
        default: return null;
    }
}

function autoview_get_coursefilesarea_id($context)
{
    global $CFG;
    require_once('../../repository/lib.php');

    $params = array(
        'context'=>array($context, context_system::instance()),
        'currentcontext'=>$context,
        'onlyvisible'=>true,
        'type'=>"coursefilearea");

     $repolist = repository::get_instances($params);

     if (current($repolist))
        return current($repolist)->id;
     else
        return -1;
}

function autoview_get_context_instance($id)
{
    return context_module::instance($id);
}

function autoview_get_course_context_instance($id)
{
    return context_course::instance($id);
}

function autoview_add_to_log($course, $mod, $text, $link='', $info='', $cmid=0, $uid=0)
{
 global $CFG;
 if ($CFG->version >= 2014051200)
 {
  /** This needs to be re-written to use the events system for Moodle 2.7 and greater**/
  /** For now use the code from deprecated lib **/
  $manager = get_log_manager();
  if (method_exists($manager, 'legacy_add_to_log')) {
   $manager->legacy_add_to_log($course, $mod, $text, $link, $info, $cmid, $uid);
  }
 }
 else
  add_to_log($course, $mod, $text, $link, $info, $cmid, $uid);
}

?>
