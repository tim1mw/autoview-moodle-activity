<?php

    /**
    * displays information about autoview instances in course
    * 
    * @package mod-autoview
    * @category mod
    * @author Tim William (EuroMotor - Autotrain) 
    * @license This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPL v3 Licence
    **/
    require_once("../../config.php");
    require_once("lib.php");

    $id = required_param( 'id', PARAM_INT ); // course

    if (!empty($CFG->forcelogin)) {
        require_login();
    }

    global $DB, $CFG;

    if (! $course = $DB->get_record('course', array('id'=>$id))) {
        print_error("Course ID is incorrect");
    }

    require_course_login($course);

    $strautoview = get_string('modulename', 'autoview');
    $strautoviews = get_string('modulenameplural', 'autoview');
    $strweek = get_string('week');
    $strtopic = get_string('topic');
    $strname = get_string('name');
    $strsummary = get_string('summary');
    $strlastmodified = get_string('lastmodified');
    $strsectionname  = get_string('sectionname', 'format_'.$course->format);

    autoview_add_to_log($course->id, 'autoview', 'view all', "index.php?id={$course->id}", "");

    global $PAGE, $OUTPUT;
    $PAGE->set_title($strautoview);
    $PAGE->set_heading($strautoview);
    $PAGE->set_pagelayout('base');
    $PAGE->blocks->show_only_fake_blocks();
    $PAGE->set_url($CFG->wwwroot."/mod/autoview/index.php?id=".$id);

    echo $OUTPUT->header();

    if (! $autoviews = get_all_instances_in_course("autoview", $course)) {
        notice("There are no autoview", "../../course/view.php?id=$course->id");
        exit;
    }

    $usesections = course_format_uses_sections($course->format);

    $table = new html_table();
    $table->attributes['class'] = 'generaltable mod_index';

    if ($usesections) {
        $table->head  = array ($strsectionname, $strname);
        $table->align = array ("center", "left");
    } else {
        $table->head  = array ($strname);
    }

    foreach ($autoviews as $autoview) {
    if (!$autoview->visible) {
        //Show dimmed if the mod is hidden
        $link = "<a class=\"dimmed\" href=\"view.php?id=$autoview->coursemodule\">$autoview->name</a>";
    } else {
        //Show normal if the mod is visible
        $link = "<a href=\"view.php?id=$autoview->coursemodule\">$autoview->name</a>";
    }

    if ($usesections) {
        $table->data[] = array (get_section_name($course, $autoview->section), $link);
    } else {
        $table->data[] = array ($link);
    }
}

    echo "<br />";

    echo html_writer::table($table);

    echo $OUTPUT->footer();
 
?>

