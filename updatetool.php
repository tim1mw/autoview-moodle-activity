<?php
/**
* Content update tool
* @author     Tim Williams (tmw@autotrain.org)
* @package    mod
* @subpackage autoview
* @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
**/

require_once('../../config.php');
require_once($CFG->libdir.'/adminlib.php');
//require_once($CFG->libdir.'/tablelib.php');
//require_once($CFG->dirroot.'/course/lib.php');
require_once('updatetool_forms.php');

/**Not having this causes a fatal crash, even though it's not needed here**/
//require_once($CFG->dirroot.'/enrol/imsenterprise/locallib.php'); 

global $OUTPUT, $PAGE;
require_login();

$context = context_system::instance();
$PAGE->set_context($context);
$PAGE->set_url($CFG->wwwroot."/mod/autoview/updatetool.php");

admin_externalpage_setup('managemodules');
echo $OUTPUT->header();

if (!has_capability('moodle/site:config', $context))
{
    echo "<div class='errorbox'><p class='error'>".get_string("not_authorised", "mod_autoview")."</p></div>";
}
else
{
    $process=optional_param("stage", "courseselect", PARAM_ALPHANUM);
    switch ($process) {
        case 'courseselect':
            // Select the courses to process.
            show_course_selection();
            break;
        case 'avselect':
            // Select the AutoViews to process.
            show_av_selection();
            break;
        case 'process':
            // Select the AutoViews to process.
            process_av_selection();
            break;
    }
}
/**All Done**/
echo $OUTPUT->footer();

/*********************************************************************************************************************/

function get_legacy_types() {
    return array("SilverlightVideo", "VLCVideo", "QuicktimeVideo", "JavaAudio", "WindowsMediaVideo",
        "RealPlayerVideo", "FlashVideoBroadcast", "JavaLiveCapture", "FlashLiveCapture", "LegacyVideoContainer");
}

/**
* Process the AutoViews
**/

function process_av_selection() {
    global $DB;
    // This is going to be slow, so turn off the process time limit.
    set_time_limit(0);
    echo "<pre>";

    $removelegacy=optional_param('removelegacy', false, PARAM_BOOL);
    $removemodem=optional_param('removemodem', false, PARAM_BOOL);
    $removeredundant=optional_param('removeredundant', false, PARAM_BOOL);
    $processopt=required_param('processopt', PARAM_ALPHANUM);
    $replacehtml5=optional_param('replacehtml5', false, PARAM_BOOL);
    $avids=explode(',', required_param('avids', PARAM_SEQUENCE));

    $urltrans_orig = required_param('urltrans', PARAM_RAW);
    $urltrans = get_urltrans($urltrans_orig);

    $autoviewinstanceid = $DB->get_record('modules', array('name' => 'autoview'), 'id')->id;

    foreach ($avids as $avid) {
        $avinst = $DB->get_record('autoview', array('id' => $avid), 'name,configfile,storage');

        $processvideo = optional_param('process_'.$avid, false, PARAM_BOOL);
        if (!$processvideo) {
            echo "\n\n--------------------------------------------------------------------------------\n".
                 "Skipping: ".$avinst->name."\n\n";
            continue;
        }

        $avmod = $DB->get_record('course_modules', array('module' => $autoviewinstanceid, 'instance' => $avid));
        echo "\n\n--------------------------------------------------------------------------------\n".
             "Processing: ".$avinst->name."\n\n";

        $avs=autoview_get_file_storage($avinst->storage);
        $xml = get_avx_file($avinst, $avmod->course, $avs);
        $xml->formatOutput = true;
        $xml->preserveWhiteSpace = false;

        if ($processopt != "no") {
            $validvideofiles = get_valid_video_files($avinst, $avmod->course, $xml, $urltrans);
            $presdir = get_avx_dir($avinst, $avmod->course, $avs);
            $encodedfiles = encodefiles($avid, $validvideofiles, $processopt, $presdir);

            $abort = false;
            foreach ($encodedfiles as $lang => $encodedfile) {
                if (!file_exists($encodedfile)) {
                    echo "ERROR: File ".$encodedfile." was not created, aborting processing this presentation.\n\n";
                    $abort = true;
                    break;
                }
            }
            if ($abort) {
                continue;
            }

            if ($replacehtml5) {
                echo "Remove old HTML 5 video sources\n";
                remove_av_source($xml, 'type', array("HTML5Video"), $removeredundant, $avs, $avmod->course);
            }
            foreach ($encodedfiles as $lang => $encodedfile) {
                add_av_source($xml, $lang, array(
                    'type' => 'HTML5Video', 
                    'url' => get_storage_path_fragment($avinst,  $encodedfile, $avmod->course, $avs),
                    'speed' => 'SPEED_STREAM',
                    'monitor' => 'true'));
            }
        }

        if ($removelegacy) {
            echo "Remove legacy video sources\n";
            remove_av_source($xml, 'type', get_legacy_types(), $removeredundant, $avs, $avmod->course);
        }

        if ($removemodem) {
            echo "Remove modem video sources\n";
            remove_av_source($xml, 'speed', array("SPEED_MODEM"), $removeredundant, $avs, $avmod->course);
        }


        save_avx_file($avinst, $avmod->course, $avs, $xml);
        echo "Finished.\n";
    }

    echo "</pre>";
}

function add_av_source(&$xml, $lang, $params) {
    $avlangs = $xml->getElementsByTagName('avlang');
    $avlangtag = false;
    $first = false;
    // Find the avlang tag, this should always exists because we must have had a source video to encode if we got here.
    foreach ($avlangs as $avlang) {
        $langcode = $avlang->attributes->getNamedItem("name")->nodeValue;
        if ($langcode == $lang) {
            $avlangtag = $avlang;
            $avsrcs = $avlangtag->getElementsByTagName('avsrc');
            $first = $avsrcs->item(0);
            break;
        }
    }

    $avsrc = new DOMElement("avsrc");
    // Put the modern streaming format first in the list of choices.
    $avsrc = $avlangtag->insertBefore($avsrc, $first);
    foreach ($params as $paramname => $paramvalue) {
        $element = new DOMElement($paramname, $paramvalue);
        $avsrc->appendChild($element);
    }

}

function encodefiles($avid, $validvideofiles, $processopt, $outdir) {
    $encodedfiles = array();
    foreach ($validvideofiles as $videolang => $videofiles) {
        $index = required_param('encode_vid_'.$videolang.'_'.$avid, PARAM_INT);
        $vb = required_param('encode_vid_vb_'.$videolang.'_'.$avid, PARAM_INT);
        $ab = required_param('encode_vid_ab_'.$videolang.'_'.$avid, PARAM_INT);
        $encodedfiles[$videolang] = encodefile($videofiles[$index]->file, $outdir, $processopt, $vb, $ab);
    }
    return $encodedfiles;
}

function encodefile($infile, $outdir, $processopt, $vb, $ab) {
    global $CFG;
    $ffmpegcom = get_config('autoview')->ffmpeg.' -loglevel fatal -hide_banner -i '.$infile.' -strict -2 '.
        ' -acodec aac -vcodec h264 -ar 48000 -ab '.$ab.'k -vb '.$vb.'k ';
    $outpath = $outdir."/";
    $date = date("Y-m-d");
    $fname = pathinfo($infile, PATHINFO_FILENAME);
    switch ($processopt) {
        case 'mpd':
            // Note DASH output is untested.
            $outpath .= $fname."_".$date;
            mkdir($outpath);
            $outpath .= "/stream.mpd";
            $ffmpegcom .= "-frag_duration 15 ".$outpath;
            break;
        case 'hls':
            $outpath .= $fname."_".$date;
            mkdir($outpath);
            $outpath .= "/stream.m3u8";
            /*
            * The ffmpeg manual says hls_list_size 0 will write all segments to the file, however some older
            * ffmpegs have a bug meanign this write NO segments, so set to 5400 (6 hours) which should be plenty!
            */
            $ffmpegcom .= " -hls_time 15  -hls_list_size 5400  ".$outpath;
            break;
        case 'mp4':
            $outpath .= $fname."_".$date.".mp4";
            $ffmpegcom .= $outpath;
            break;
    }

    echo "Encoding: ".$infile."\nto: ".$outpath."\nvideo bit rate=".$vb."Kbps, audio bit rate=".$ab."Kbps\n";
    ob_flush();
    flush();

    $ffmpegcom."\n";

    $output = array();
    exec($ffmpegcom, $output);
    foreach ($output as $out) {
        echo $out."\n";
    }
    echo "\n";

    return $outpath;
}

/**
* Performs the content migration
**/

function show_av_selection() {
    global $DB;
    $autoviewinstanceid = $DB->get_record('modules', array('name' => 'autoview'))->id;
    $courseslist = required_param_array('courses', PARAM_INT);
    $urltrans_orig = required_param('urltrans', PARAM_RAW);
    $urltrans_final = get_urltrans($urltrans_orig);

    $coursesdata = array();

    foreach ($courseslist as $courseid) {
        $data = new stdclass();
        $data->courseid = $courseid;
        $data->fullname = $DB->get_record('course', array('id' => $courseid), 'fullname')->fullname;
        $avscms = $DB->get_records('course_modules', array('course' => $courseid, 'module' => $autoviewinstanceid));
        $data->autoviews = array();

        foreach ($avscms as $avscm) {
            $data->autoviews[] = read_autoview($avscm, $courseid, $urltrans_final);
        }

        $coursedata[] = $data;
    }

    $form = new autoview_update_autoviewselect($coursedata, $urltrans_orig);
    echo $form->render();
}

function get_urltrans($urltrans) {
    $urltrans = explode(';', $urltrans);
    $urltrans_final = array($urltrans);
    foreach ($urltrans as $urltran) {
        $item = explode(",", $urltran);
        if (count($item) == 2 && strlen($item[0]) > 0 && strlen($item[1]) > 0) {
            $urltrans_final[] = $item;
        }
    }
    return $urltrans_final;
}

function read_autoview($avscm, $courseid, $urltrans) {
    global $DB;

    $avinst = $DB->get_record('autoview', array('id' => $avscm->instance), 'name,configfile,storage');
    $xml = get_avx_file($avinst, $courseid);

    $av = new stdclass();
    $av->id = $avscm->instance;
    $av->name = $avinst->name;

    $av->hasflash = has_av_source_property($xml, 'type', array("FlashVideo"));
    $av->haslegacy = has_av_source_property($xml,'type', get_legacy_types());
    $av->hasmodem = has_av_source_property($xml, 'speed', array("SPEED_MODEM"));
    $av->hashtml5 = has_av_source_property($xml, 'type', array("HTML5Video"));
    //No point in checking this if we don't have HTML5
    if ($av->hashtml5) {
        $av->hashlsordash = has_dash_or_hls($xml);
    } else {
        $av->hashlsordash = false;
    }

    $av->validvideofiles = get_valid_video_files($avinst, $courseid, $xml, $urltrans);

    return $av;
}

function has_av_source_property($xml, $name, $match) {

    $avsrcs = $xml->getElementsByTagName('avsrc');
    foreach ($avsrcs as $avsrc) {
        foreach($avsrc->childNodes as $avsrctag) {
            if ($avsrctag->nodeName === $name && in_array($avsrctag->textContent, $match)) {
                return true;
            }
        }
    }

    return false;
}

function remove_av_source(&$xml, $name, $match, $removeredundant, $avs, $courseid) {

    $avsrcs = $xml->getElementsByTagName('avsrc');
    // Note, removing the elements we don't want inside the iterator loop really messes up the iterator.
    // So remove the elements seperatly.
    $toremove = array();
    foreach ($avsrcs as $avsrc) {
        foreach($avsrc->childNodes as $avsrctag) {
            if ($avsrctag->nodeName == $name && in_array($avsrctag->textContent, $match)) {
                $toremove[] = $avsrc;
            }
        }
    }

    foreach ($toremove as $n) {
        $url = get_child_node($n, 'url')->textContent;
        $path = process_file_path($url, $avs, $courseid);
        if ($removeredundant && file_exists($path)) {
            echo "Deleting file: ".$path."\n";
            unlink($path);
            $ext = pathinfo($path, PATHINFO_EXTENSION);
            if ($ext == "flv") {
                // Get rid of the .meta file as well
                $metapath = $path.".meta";
                if (file_exists($metapath)) {
                    echo "Deleting file: ".$metapath."\n";
                    unlink($metapath);
                }
            }
        }
        $n->parentNode->removeChild($n);
    }
}

function has_dash_or_hls($xml) {

    $avsrcs = $xml->getElementsByTagName('avsrc');
    foreach ($avsrcs as $avsrc) {
        $html5 = false;
        $stream = false;

        foreach($avsrc->childNodes as $avsrctag) {
            if ($avsrctag->nodeName === "type" && $avsrctag->textContent === "HTML5Video") {
                $html5 = true;
            }

            if ($avsrctag->nodeName == "url") {
                $fileext = pathinfo($avsrctag->textContent, PATHINFO_EXTENSION);
                if ($fileext === 'hls' || $fileext === 'mpd') {
                    $stream = true;
                }
            }
        }

        if ($html5 && $stream) {
            return true;
        }
    }

    return false;
}

function get_valid_video_files($avinst, $courseid, $xml, $urltrans) {
    $avs=autoview_get_file_storage($avinst->storage);

    $files = array();

    $avlangs = $xml->getElementsByTagName('avlang');
    foreach ($avlangs as $avlang) {
        $langcode = $avlang->attributes->getNamedItem("name")->nodeValue;
        $files[$langcode] = array();

        foreach($avlang->childNodes as $avsrc) {
            if ($avsrc->nodeName != "avsrc") {
                continue;
            }

            $url = trim(get_child_node($avsrc, 'url')->textContent);

            if (strlen($url) == 0) {
                continue;
            }

            $filepath = process_file_path($url, $avs, $courseid);

            if (file_exists($filepath)) {
                $files[$langcode][] = get_video_properties($filepath);
                continue;
            }

            foreach ($urltrans as $urltran) {
                if (strlen($urltran[0]) && strpos($url, $urltran[0]) === 0) {
                    $url = $urltran[1].substr($url, strlen($urltran[0]));
                }
            }

            if (strpos($url, "://")=== false && file_exists($url)) {
                $files[$langcode][] = get_video_properties($url);
            }


        }
    }

    return $files;
}

function process_file_path($url, $avs, $courseid) {
    if (strpos($url, '$flashserver') === 0) {
        $url = substr($url, 13);
    }

    $filepath=$avs->get_file_path($url, $courseid);
    return $filepath;
}

function get_child_node($parentnode, $nodename) {
    if (!$parentnode->hasChildNodes()) {
        return false;
    }

    foreach($parentnode->childNodes as $node) {
        if ($node->nodeName == $nodename) {
            return $node;
        }
    }
    return false;
}

function get_video_properties($file) {
    $props = new stdclass();

    $props->file = $file;
    $props->ext = pathinfo($file, PATHINFO_EXTENSION);
    $props->size = filesize($file);

    return $props;
}


function get_avx_file($avinst, $courseid, $avs = false) {
    if (!$avs) {
        $avs=autoview_get_file_storage($avinst->storage);
    }
    $avxfile=$avs->get_file_path($avinst->configfile, $courseid);

    $xml = new DOMDocument();
    $xml->loadXML(file_get_contents($avxfile)); 
    return $xml;
}

function get_avx_dir($avinst, $courseid, $avs = false) {
    if (!$avs) {
        $avs=autoview_get_file_storage($avinst->storage);
    }
    $avxfile=$avs->get_file_path($avinst->configfile, $courseid);
    return pathinfo($avxfile, PATHINFO_DIRNAME);
}

function get_storage_path_fragment($avinst, $path, $courseid, $avs = false) {
    if (!$avs) {
        $avs=autoview_get_file_storage($avinst->storage);
    }

    $basepath=$avs->get_base_path('.', $courseid);
    return substr($path, strlen($basepath)+1);
}


function save_avx_file($avinst, $courseid, $avs, $xml) {
    $avxfile=$avs->get_file_path($avinst->configfile, $courseid);
    $xml->formatOutput = true;
    file_put_contents($avxfile, $xml->saveXML());
}

/**
* Prints the content migration form
**/

function show_course_selection()
{
    global $PAGE, $DB, $CFG;

    $autoviewinstanceid = $DB->get_record('modules', array('name' => 'autoview'))->id;
    $autoviews = $DB->get_records_menu('course_modules', array('module' => $autoviewinstanceid), 'course', 'id,course');

    // Consoidate the list of courses
    $courses = array();
    foreach ($autoviews as $autoviewid => $courseid) {
        if (!array_key_exists($courseid, $courses)) {
            $course = $DB->get_record('course', array('id' => $courseid), 'id, fullname');
            $courses[$course->id] = $course->fullname;
        }
    }

    $courseform = new autoview_update_courseselect($courses);
    echo $courseform->render();
}
