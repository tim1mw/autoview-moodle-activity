<?php
if (!function_exists("mdl21_getconfigparam"))
 require_once("mdl21_abstract.php");

function autoview_has_dependencies($rm=false)
{
 return '';
}

function autoview_get_coursefilesarea_id($context)
{
 return -1;
}

function autoview_get_context_instance($id)
{
 return get_context_instance(CONTEXT_MODULE, $id);
}

function autoview_get_course_context_instance($id)
{
 return get_context_instance(CONTEXT_COURSE, $id);
}

function autoview_add_to_log($course, $mod, $text, $link='', $info='', $cmid=0, $uid=0)
{
 add_to_log($course, $mod, $text, $link, $info, $cmid, $uid);
}


?>
