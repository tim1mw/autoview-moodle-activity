<?PHP 
/**
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv3 Licence
**/

    require_once("../../config.php");
    require_once("lib.php");

    $id = optional_param('id',0,PARAM_INT);    // Course Module ID, or
    $l = optional_param('l',0,PARAM_INT);     // Autoview ID

    global $DB;

    if ($id) {
        if (! $cm = get_coursemodule_from_id("autoview", $id)) {
            error("Course Module ID was incorrect");
        }
    
        if (! $course = $DB->get_record("course", array("id"=>$cm->course))) {
            error("Course is misconfigured");
        }
    
        if (! $autoview = $DB->get_record("autoview", array("id"=>$cm->instance))) {
            error("Course module is incorrect");
        }

    } else {
        if (! $autoview = $DB->get_record("autoview", array("id"=>$l))) {
            error("Course module is incorrect");
        }
        if (! $course = $DB->get_record("course", array("id"=>$autoview->course))) {
            error("Course is misconfigured");
        }
        if (! $cm = get_coursemodule_from_instance("autoview", $autoview->id, $course->id)) {
            error("Course Module ID was incorrect");
        }
    }

    require_course_login($course, true, $cm);

    global $CFG, $THEME;

    $frameset = optional_param('frameset',1, PARAM_BOOL);
    $editval = optional_param('edit',0, PARAM_BOOL);
    $context = autoview_get_context_instance($cm->id);
    $r_config = get_config("resource");

    if (!has_capability('mod/autoview:viewpresentation', $context))
    {
        error(get_string("not_allowed", "autoview"));
        die;
    }

    if (has_capability('mod/autoview:canedit', $context) && $editval==false)
    {
        $avs=autoview_get_file_storage($autoview->storage);
        $editval=$avs->pres_is_empty($autoview->configfile, $autoview->course);
    }

    if ($frameset==true)
    {
        $e='';
        autoview_add_to_log($course->id, "autoview", "view", "view.php?id=$cm->id", $autoview->name, $cm->id);

        global $PAGE, $OUTPUT;
        $PAGE->set_title($autoview->name);
        $PAGE->set_heading($autoview->name);
        $PAGE->set_pagelayout('base');
        $PAGE->blocks->show_only_fake_blocks();
        $PAGE->set_url($CFG->wwwroot."/mod/autoview/view.php?id=".$cm->id);

        if (!$autoview->noframe)
            autoview_show_navigation($course, $context, $cm, $editval);
        else
        {
        ?>
         <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
         <html>
         <head><title><?php echo $autoview->name;?></title>
         <?php
        }

        if (!autoview_has_dependencies())
        {
            echo $OUTPUT->footer();
            exit();
        }
 
        $avurl="autoview.php?l=".$autoview->id."&amp;edit=".$editval;
        $avediturl="avedit.php?l=".$autoview->id;
 
        //Make sure the iframe gets all the available space
        ?>
        <style type="text/css">
            #page-content #region-main
            {
             padding:0px;
            }
        </style>

        <?php
        if ($autoview->noframe)
            echo "</head><body>";
        ?>

        <script type="text/javascript">
        //<!--
            var frameHeight=600;
            var frameWidth="100%";
            var userAgent=navigator.userAgent.toLowerCase();
            if (userAgent.indexOf("android")>-1 ||
                userAgent.indexOf("iphone")>-1  ||
                userAgent.indexOf("ipod")>-1    ||
                userAgent.indexOf("symbianos")>-1)
            {
             frameHeight=screen.height*1.1;
             frameWidth=screen.width+"px";
            }
            else
            {
             if( typeof( window.innerWidth ) == 'number' )
             {
              //Non-IE
              frameHeight = window.outerHeight;
             }
             else if( document.documentElement && document.documentElement.clientHeight)
             {
              //IE 6+ in 'standards compliant mode'
              frameHeight = document.documentElement.clientHeight;
             }
 
             frameHeight=frameHeight-<?php echo $r_config->framesize*1.58; ?>;
            }
 
            <?php if ($editval==true && has_capability('mod/autoview:canedit', $context)) { ?>
 
            document.writeln("<table style=\"width:"+frameWidth+";\"><tr><td style=\"width:250px;\">"+
                "<iframe src=\"<?php echo $avediturl;?>\" name=\"editframe\" "+
                "style=\"width:250px;height:"+frameHeight+"px;border:1px solid #aaaaaa;\"></iframe>\n"+
                "</td><td>");            
 
            <?php
        }
        ?>
 
        var ir="<iframe src=\"<?php echo $avurl; ?>\" name=\"videoframe\""+
            " style=\"width:"+frameWidth+";height:"+frameHeight+"px;padding:0px;margin:0px;border:0px;\" ></iframe>\n";
 
        document.writeln(ir);
 
        <?php if ($editval==true && has_capability('mod/autoview:canedit', $context)) { ?>
 
        document.writeln("</td></tr></table>");
 
        <?php } ?>
 
        //-->
        </script>
        <?php
        if (!$autoview->noframe)
            echo $OUTPUT->footer();
        else
            echo "</body></html>";
    }
    else
    {
       autoview_show_navigation($course, $context, $cm, $editval);

       echo "    </div>\n</div>\n".
        " <script type=\"text/javascript\"><!--\n".
        "  if (typeof(parent.videoframe.importTheme)!=\"undefined\" && typeof(parent.videoframe.importTheme)!=\"unknown\")\n".
        "   parent.videoframe.importTheme();\n".
        " // --></script>".
        "</body>\n</html>";
   }

   function autoview_show_navigation($course, $context, $cm, $editval)
   {
       global $CFG, $OUTPUT;
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
           "</div></form>&nbsp;";

          $url = new moodle_url("$CFG->wwwroot/course/mod.php", array('update' => $cm->id, 'return' => true, 'sesskey' => sesskey()));
          $buttontext=$buttontext.$OUTPUT->single_button($url, get_string('updatethis', '', get_string("modulename", "autoview")));
       }

        if ($course->id == 1){
            if (! function_exists('build_navigation') || $CFG->version>=2015050100.00){
                $navigation = "<a href=\"index.php?id=$course->id\" target=\"_top\">". 
                get_string('modulenameplural', 'autoview')."</a> ->".format_string($autoview->name);
            } else {
                $navigation = build_navigation('', $cm);
            }
          
            global $CFG, $OUTPUT, $PAGE;
            $PAGE->set_button($buttontext);
            echo $OUTPUT->header();
       } else {
            global $OUTPUT, $PAGE;
            $PAGE->set_button($buttontext);
            echo $OUTPUT->header();
       }
   }

?>

