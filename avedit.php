<?php
/**
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence
**/

    require_once("../../config.php");
    require_once("lib.php");

    $l = required_param('l', PARAM_INT);
    if (! $autoview = get_record("autoview", "id", $l))
     error("Course module is incorrect");

    if (! $course = get_record("course", "id", $autoview->course))
     error("Course is misconfigured");

    if (! $cm = get_coursemodule_from_instance('autoview', $autoview->id, $course->id))
     error('Course Module ID was incorrect');

    require_course_login($course, true, $cm);
    $context = get_context_instance(CONTEXT_MODULE, $cm->id);

    if (!has_capability('mod/autoview:canedit', $context))
    {
     echo get_string("no_edit_permission", "mod_autoview");
     die;
    }

    /*****Read config params*****/
    $flashdir="";
    if (isset($CFG->autoview_flashdir))
        $flashdir=$CFG->autoview_flashdir;
    $conversionurl="";
    if (isset($CFG->autoview_conversionurl))
        $conversionurl=$CFG->autoview_conversionurl;
    $alwaysflashstream="false";
    if (isset($CFG->autoview_alwaysflashstream) && $CFG->autoview_alwaysflashstream==true)
        $alwaysflashstream="true";

    /*****Constuct base parameters*****/
    $parameters = array(
     'vresource' => $CFG->wwwroot."/mod/autoview/vresource/", 
     'xmlSendURL' => $CFG->wwwroot."/mod/autoview/recieveXML.php", 
     'xmlID' => $autoview->id,
     'xmlFile' => $autoview->configfile,
     'fileBrowser' => $CFG->wwwroot."/files/index.php?id=".$course->id."&amp;choose=form.url",
     'waiterMessageStr' => get_string('waitermessage', 'autoview'),
     'startEditorStr' => get_string('starteditor', 'autoview'),
     'flashDir' => $flashdir,
     'alwaysflashstream'=> $alwaysflashstream);

    /*****If there is no conversion service, send a blank URL*****/
    if (count($conversionurl)>0 && has_capability('mod/autoview:canconvertdocument', $context))
     $parameters['conversionURL']=$CFG->wwwroot."/mod/autoview/convert.php";
    else
     $parameters['conversionURL']="";

    echo process_xsl($CFG->dirroot."/mod/autoview/avedit/avedit.xml", $CFG->dirroot."/mod/autoview/avedit/avedit.xsl", $parameters);
?>
