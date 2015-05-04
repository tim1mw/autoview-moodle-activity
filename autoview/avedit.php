<?php
/**
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv3 Licence
**/

    require_once("../../config.php");
    require_once("lib.php");

    global $DB;

    $l = required_param('l', PARAM_INT);
    if (! $autoview = $DB->get_record("autoview", array("id"=>$l)))
     error("Course module is incorrect");

    if (! $course = $DB->get_record("course", array("id"=>$autoview->course)))
     error("Course is misconfigured");

    if (! $cm = get_coursemodule_from_instance('autoview', $autoview->id, $course->id))
     error('Course Module ID was incorrect');

    require_course_login($course, true, $cm);
    $context = autoview_get_context_instance($cm->id);

    if (!has_capability('mod/autoview:canedit', $context))
    {
     echo get_string("no_edit_permission", "mod_autoview");
     die;
    }

    autoview_add_to_log($course->id, "autoview", "edit", "view.php?id=$cm->id", $autoview->name, $cm->id);

    $avs=autoview_get_file_storage($autoview->storage);

    autoview_add_to_log($course->id, "autoview", "edit", "view.php?id=$cm->id", $autoview->name, $cm->id);

    /*****Read config params*****/
    $flashdir="";
    if (mdl21_configparamisset("autoview", "flashdir"))
        $flashdir=mdl21_getconfigparam("autoview", "flashdir");
    $conversionurl="";
    if (mdl21_configparamisset("autoview", "conversionurl"))
        $conversionurl=mdl21_getconfigparam("autoview", "conversionurl");
    $alwaysflashstream="false";
    if (mdl21_configparamisset("autoview", "alwaysflashstream") && mdl21_getconfigparam("autoview", "alwaysflashstream"))
        $alwaysflashstream="true";
    $broadcastMaxKbps=256;
    if (mdl21_configparamisset("autoview", "max_broadcast_kbps"))
        $broadcastMaxKbps=mdl21_getconfigparam("autoview", "max_broadcast_kbps");

    if ($CFG->version>=2010000000)
    {
        $filebrowser=$CFG->wwwroot."/blocks/repo_filemanager/index.php?repoid=".autoview_get_coursefilesarea_id($context).
         "&hiderepolist=1&id=".$course->id."&amp;choose=form.url&amp;shortpath=1";
    }
    else
        $filebrowser=$CFG->wwwroot."/files/index.php?id=".$course->id."&amp;choose=form.url";

    /*****Constuct base parameters*****/
    $parameters = array(
     'vresource' => $CFG->wwwroot."/mod/autoview/vresource/", 
     'xmlSendURL' => $avs->get_xmlsend_url(), 
     'xmlID' => $autoview->id,
     'xmlFile' => $autoview->configfile,
     'fileBrowser' => $filebrowser,
     'waiterMessageStr' => get_string('waitermessage', 'autoview'),
     'startEditorStr' => get_string('starteditor', 'autoview'),
     'flashDir' => $flashdir,
     'alwaysflashstream'=> $alwaysflashstream,
     'broadcastMaxKbps' => $broadcastMaxKbps);

    /*****If there is no conversion service, send a blank URL*****/
    if (strlen($conversionurl)>0 && has_capability('mod/autoview:canconvertdocument', $context))
     $parameters['conversionURL']=$CFG->wwwroot."/mod/autoview/convert.php";
    else
     $parameters['conversionURL']="";

    echo process_xsl($CFG->dirroot."/mod/autoview/avedit/avedit.xml", $CFG->dirroot."/mod/autoview/avedit/avedit.xsl", $parameters);
?>
