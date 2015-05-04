<?php

if (!function_exists("mdl21_getconfigparam"))
 require_once("mdl2_generic.php");

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
