<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">
<html>
<head>
 <title>Document save message</title>
</head>
<body>
 <p>
<?php
/**
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence
**/

    require_once("../../config.php");
    require_once("lib.php");
    require_once("$CFG->libdir/rsslib.php");

    $xmldata=base64_decode(required_param('xmldata', PARAM_RAW));
    $l = required_param('xmlid',PARAM_INT);

    if (! $autoview = get_record("autoview", "id", $l))
     error("Course module is incorrect");

    if (! $course = get_record("course", "id", $autoview->course))
     error("Course is misconfigured");

    if (! $cm = get_coursemodule_from_instance("autoview", $autoview->id, $course->id))
     error("Course Module ID was incorrect");

    require_login($course->id);
    $context = get_context_instance(CONTEXT_MODULE, $cm->id);

    if (has_capability('mod/autoview:canedit', $context))
    {
     $file="";
     $subtitlefile=optional_param('subtitlefile','', PARAM_PATH);

     if (strlen($subtitlefile)>0)
      $file=$CFG->dataroot.'/'.$course->id.'/'.$subtitlefile;
     else
      $file=$CFG->dataroot.'/'.$course->id.'/'.$autoview->configfile;

     $fh = fopen($file, 'w') or die(get_string("xmlsavefailed", "autoview"));
     fwrite($fh, $xmldata);
     fclose($fh);
     echo "OK\n";
    }
    else
     echo get_string("no_edit_permission", "mod_autoview");
?>
 </p>
</body>
</html>