<?php

    /**
    * displays information about autoview instances in course
    * 
    * @package mod-autoview
    * @category mod
    * @author Tim William (EuroMotor - Autotrain) 
    * @license This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPL Licence
    **/
    require_once("../../config.php");

    $id = required_param( 'id', PARAM_INT ); // course

    if (!empty($CFG->forcelogin)) {
        require_login();
    }

    if (! $course = get_record('course', 'id', $id)) {
        error("Course ID is incorrect");
    }

    $strautoview = get_string('modulename', 'autoview');
    $strautoviews = get_string('modulenameplural', 'autoview');
    $strweek = get_string('week');
    $strtopic = get_string('topic');
    $strname = get_string('name');
    $strsummary = get_string('summary');
    $strlastmodified = get_string('lastmodified');

    if (!function_exists('build_navigation')){
        if ($course->category) {
            require_login($course->id);
        }
        $navigation = "$strautoviews";
    } else {
        $navlinks = array();
        $navlinks[] = array('name' => $strautoviews, 'link' => "index.php?id={$course->id}", 'type' => 'activity');    
        $navigation = build_navigation($navlinks);
    }

    add_to_log($course->id, 'autoview', 'view all', "index.php?id={$course->id}", "");


    print_header_simple($strautoview, '', $navigation, '', '', true, '', navmenu($course));

    if (! $autoviews = get_all_instances_in_course("autoview", $course)) {
        notice("There are no autoview", "../../course/view.php?id=$course->id");
        exit;
    }

    if ($course->format == "weeks") {
        $table->head  = array ($strweek, $strname, $strsummary);
        $table->align = array ("center", "left", "left");
    } else if ($course->format == "topics") {
        $table->head  = array ($strtopic, $strname, $strsummary);
        $table->align = array ("center", "left", "left");
    } else {
        $table->head  = array ($strlastmodified, $strname, $strsummary);
        $table->align = array ("left", "left", "left");
    }

    $currentsection = "";
    $options->para = false;
    foreach ($autoviews as $autoview) {
        if ($course->format == "weeks" or $course->format == "topics") {
            $printsection = "";
            if ($autoview->section !== $currentsection) {
                if ($autoview->section) {
                    $printsection = $autoview->section;
                }
                if ($currentsection !== "") {
                    $table->data[] = 'hr';
                }
                $currentsection = $autoview->section;
            }
        } else {
            $printsection = '<span class="smallinfo">'.userdate($autoview->timemodified)."</span>";
        }
        if (!empty($autoview->extra)) {
            $extra = urldecode($autoview->extra);
        } else {
            $extra = "";
        }
        if (!$autoview->visible) {      // Show dimmed if the mod is hidden
            $table->data[] = array ($printsection, 
                    "<a class=\"dimmed\" $extra href=\"view.php?id=$autoview->coursemodule\">".format_string($autoview->name,true)."</a>",
                    format_text($autoview->summary, FORMAT_MOODLE, $options) );

        } else {                        //Show normal if the mod is visible
            $table->data[] = array ($printsection, 
                    "<a $extra href=\"view.php?id=$autoview->coursemodule\">".format_string($autoview->name,true)."</a>",
                    format_text($autoview->summary, FORMAT_MOODLE, $options) );
        }
    }

    echo "<br />";

    print_table($table);

    print_footer($course);
 
?>

