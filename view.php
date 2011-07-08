<?PHP 
/**
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence
**/

    require_once("../../config.php");
    require_once("lib.php");

    $id = optional_param('id',0,PARAM_INT);    // Course Module ID, or
    $l = optional_param('l',0,PARAM_INT);     // Autoview ID

    if ($id) {
        //if (! $cm = get_record("course_modules", "id", $id)) {
        if (! $cm = get_coursemodule_from_id("autoview", $id)) {
            error("Course Module ID was incorrect");
        }
    
        if (! $course = get_record("course", "id", $cm->course)) {
            error("Course is misconfigured");
        }
    
        if (! $autoview = get_record("autoview", "id", $cm->instance)) {
            error("Course module is incorrect");
        }

    } else {
        if (! $autoview = get_record("autoview", "id", $l)) {
            error("Course module is incorrect");
        }
        if (! $course = get_record("course", "id", $autoview->course)) {
            error("Course is misconfigured");
        }
        if (! $cm = get_coursemodule_from_instance("autoview", $autoview->id, $course->id)) {
            error("Course Module ID was incorrect");
        }
    }

    require_course_login($course, true, $cm);

    global $CFG, $THEME;

    $frameset = optional_param( 'frameset','' );
    $editval = optional_param( 'edit',false, PARAM_BOOL );
    $context = get_context_instance(CONTEXT_MODULE, $cm->id);

    if (has_capability('mod/autoview:canedit', $context) && $editval==false)
    {
        $avs=autoview_get_file_storage($autoview->storage);
        $editval=$avs->pres_is_empty($autoview->configfile, $autoview->course);
    }

    if (empty($frameset))
    {
        $e='';
        add_to_log($course->id, "autoview", "view", "view.php?id=$cm->id", $autoview->name, $cm->id);
        $encoding = current_charset();
        @header('Content-Type: text/html; charset='.$encoding);

        echo "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Frameset//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd\">\n".
             "<html dir=\"ltr\">\n".
             "<head>\n".
             "<meta http-equiv=\"content-type\" content=\"text/html; charset=".$encoding."\" />\n".
             "<title>{$course->shortname}: ".strip_tags(format_string($autoview->name,true))."</title></head>\n";

        if ($autoview->noframe && $editval==false)
            echo "<frameset rows=\"0,*\" border=\"0\">\n";
        else
            echo "<frameset rows=\"$CFG->resource_framesize,*\">\n";

        echo "<frame src=\"view.php?id={$cm->id}&amp;frameset=false&amp;edit=".$editval."\" name=\"headerframe\" />\n";

        if ($editval==true && has_capability('mod/autoview:canedit', $context))
           echo "<frameset cols=\"250,*\">\n".
                "<frame src=\"avedit.php?l=".$autoview->id."\" name=\"editframe\" />\n";

        //****Use this line to process XSLT in the backend*****
        echo "<frame src=\"autoview.php?l=".$autoview->id.$e."&amp;edit=".$editval."\" name=\"videoframe\" />\n";
        //****Use this line to fire the XML file straight at the web browser*****
        //echo "<frame src=\"".$CFG->wwwroot."/file.php/".$course->id."/".$autoview->configfile."\" name=\"videoframe\" />\n";

        if ($editval==true)
           echo "</frameset>";
        echo "</frameset>\n".
             "</html>";
    }
    else
    {
       $buttontext="";
       if (has_capability('mod/autoview:canedit', $context))
       {
          $buttontext="<form action=\"view.php\" method=\"get\" onsubmit=\"this.target='_top'; return true;\"><div>";
          if ($editval==true)
          {
             $buttontext=$buttontext."<input type=\"submit\" value=\"".get_string("editoff", "autoview")."\" />";
          }
          else
          {
             $buttontext=$buttontext."<input type=\"submit\" value=\"".get_string("editbutton", "autoview")."\" />".
              "<input type=\"hidden\" name=\"edit\" value=\"true\" />";
          }

          $buttontext=$buttontext."<input type=\"hidden\" name=\"id\" value=\"".$cm->id."\" />".
           "</div></form>";

          $buttontext=$buttontext.update_module_button($cm->id, $course->id, get_string("modulename", "autoview"));
       }

        if ($course->id == 1){
            if (! function_exists('build_navigation')){
                $navigation = "<a href=\"index.php?id=$course->id\" target=\"_top\">". 
                get_string('modulenameplural', 'autoview')."</a> ->".format_string($autoview->name);
            } else {
                $navigation = build_navigation('', $cm);
            }
          
            print_header(format_string($autoview->name), $course->fullname,
                $navigation,
                '', '', true, $buttontext, navmenu($course, $cm, 'parent'));
       } else {
            if (! function_exists('build_navigation')){
                $navigation = "<a target=\"{$CFG->framename}\"".
                    " href=\"$CFG->wwwroot/course/view.php?id={$course->id}\">{$course->shortname}</a> -> ".
                    "<a target=\"{$CFG->framename}\" href=\"index.php?id={$course->id}\">".
                    get_string('modulenameplural', 'autoview')."</a> ->".format_string($autoview->name);
            } else {
                $navigation = build_navigation('', $cm);
            }
          
            print_header(@$pagetitle, $course->fullname, $navigation, '', '', true, $buttontext, navmenu($course, $cm, 'parent'));
       }

       echo "    </div>\n</div>\n".
        " <script type=\"text/javascript\"><!--\n".
        "  if (typeof(parent.videoframe.importTheme)!=\"undefined\" && typeof(parent.videoframe.importTheme)!=\"unknown\")\n".
        "   parent.videoframe.importTheme();\n".
        " // --></script>".
        "</body>\n</html>";
   }

?>

