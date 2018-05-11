<?php

require_once("$CFG->libdir/formslib.php");
require_once("lib.php");

class autoview_update_courseselect extends moodleform {

    function __construct($courses) {
        $this->courses = $courses;
        parent::__construct();
    }

    //Add elements to form
    public function definition() {
        $mform = $this->_form; 

        $mform->addElement('static', 'description', '',
            get_string('convertcourseinfo', 'autoview'));

        $select = $mform->addElement('select', 'courses', get_string('courses'), $this->courses);
        $mform->setType('courses', PARAM_INT);
        $select->setMultiple(true);
        $mform->addRule('courses', get_string('course_required', 'autoview'), 'required', '', 'client');

        $mform->addElement('textarea', 'urltrans', get_string("urltrans", "autoview"), 'wrap="virtual" rows="8" cols="50"');
        $mform->setType('urltrans', PARAM_RAW);

        $mform->addElement('hidden', 'stage', 'avselect');
        $mform->setType('stage', PARAM_ALPHANUM);

        $this->add_action_buttons(false, get_string('continue'));
    }

}


class autoview_update_autoviewselect extends moodleform {

    function __construct($data, $urltrans) {
        $this->data = $data;
        $this->urltrans = $urltrans;
        parent::__construct();
    }

    //Add elements to form
    public function definition() {
        $mform = $this->_form; 

        $mform->addElement('checkbox', 'removelegacy', get_string('removelegacy', 'autoview'));
        $mform->setType('removelegacy', PARAM_BOOL);
        $mform->setDefault('removelegacy', true);

        $mform->addElement('checkbox', 'removemodem', get_string('removemodem', 'autoview'));
        $mform->setType('removemodem', PARAM_BOOL);
        $mform->setDefault('removemodem', true);

        $mform->addElement('checkbox', 'removeredundant', get_string('removeredundant', 'autoview'));
        $mform->setType('removeredundant', PARAM_BOOL);
        $mform->setDefault('removeredundant', true);

        // Disabling DASH option for now, it's not needed, HLS works fine. Leave in place for possible future use.
        $processopts = array(
            // 'mpd' => get_string('createformat_dash', 'autoview'), 
            'hls' => get_string('createformat_hls', 'autoview'), 
            'mp4' => get_string('createformat_mp4', 'autoview'), 
            'no' => get_string('createformat_no', 'autoview'));
        $mform->addElement('select', 'processopt', get_string('createhtml5', 'autoview'), $processopts);

        $mform->addElement('checkbox', 'replacehtml5', get_string('replacehtml5', 'autoview'));
        $mform->setType('replacehtml5', PARAM_BOOL);
        $mform->setDefault('replacehtml5', true);
        $mform->disabledIf('replacehtml5', 'processopt', 'eq', 'no');

        $mform->addElement('hidden', 'urltrans', $this->urltrans);
        $mform->setType('urltrans', PARAM_RAW);

        $courseids = array();
        $avids = array();

        foreach ($this->data as $course) {
            $courseids[] = $course->courseid;
            $mform->addElement('html', '<h3>'.$course->fullname.'</h3>');

            foreach ($course->autoviews as $av) {
                $avids[] = $av->id;
                $this->show_autoview($mform, $av);
            }
        }

        $mform->addElement('hidden', 'stage', 'process');
        $mform->setType('stage', PARAM_ALPHANUM);

        $mform->addElement('hidden', 'avids', implode(',', $avids));
        $mform->setType('avids', PARAM_SEQUENCE);

        $this->add_action_buttons(false, get_string('continue'));
    }

    private function show_autoview($mform, $av) {
        $mform->addElement('html', '<h5>'.$av->name.'</h5>');

        if ($av->haslegacy) {
            $mform->addElement('static', 'legacyvideos'.$av->id, get_string('legacyvideos', 'autoview'),
                get_string('haslegacy', 'autoview'));
        } else {
            $mform->addElement('static', 'legacyvideos'.$av->id, get_string('legacyvideos', 'autoview'),
                get_string('nolegacy', 'autoview'));
        }

        if ($av->hasmodem) {
            $mform->addElement('static', 'modelvideos'.$av->id, get_string('modemvideos', 'autoview'),
                get_string('hasmodem', 'autoview'));
        } else {
            $mform->addElement('static', 'modemvideos'.$av->id, get_string('modemvideos', 'autoview'),
               get_string('nomodem', 'autoview'));
        }

        if ($av->hasflash) {
            $mform->addElement('static', 'flashvideos'.$av->id, get_string('flashvideos', 'autoview'),
                get_string('hasflash', 'autoview'));
        } else {
            $mform->addElement('static', 'flashvideos'.$av->id, get_string('flashvideos', 'autoview'),
                get_string('noflash', 'autoview'));
        }

        if ($av->hashtml5) {
            $mform->addElement('static', 'html5videos'.$av->id, get_string('html5videos', 'autoview'),
                get_string('hashtml5', 'autoview'));
        } else {
            $mform->addElement('static', 'html5videos'.$av->id, get_string('html5videos', 'autoview'),
                get_string('nohtml5', 'autoview'));
        }

        if ($av->hashlsordash) {
            $mform->addElement('static', 'hlsdashvideos'.$av->id, get_string('hlsdashvideos', 'autoview'),
                get_string('hashlsdash', 'autoview'));
        } else {
           $mform->addElement('static', 'hlsdashvideos'.$av->id, get_string('hlsdashvideos', 'autoview'),
                get_string('nohlsdash', 'autoview'));
        }

        $pn = 'process_'.$av->id;
        $mform->addElement('checkbox', $pn, get_string('processvideo', 'autoview'));
        $mform->setType('process_'.$av->id, PARAM_BOOL);
        $mform->setDefault('process_'.$av->id, !$av->hashlsordash);

        $videoopts = array();
        $largestsize = 0;
        $largestindex = 0;
        foreach ($av->validvideofiles as $langcode=>$filelist) {
            foreach ($filelist as $index=>$vf) {
                if ($vf->ext != "rv" ) {
                    $videoopts[$index] = $vf->file.' ('.round($vf->size/1048576, 2).'MB)';
                    if ($vf->ext != "wmv" && $vf->size > $largestsize) {
                        $largestsize = $vf->size;
                        $largestindex = $index;
                    }
                }
            }
            $n = 'encode_vid_'.$langcode.'_'.$av->id;
            $mform->addElement('select', $n, get_string('encodevideo', 'autoview').' ('.$langcode.')', $videoopts);
            $mform->disabledIf($n, $pn);
            $mform->setDefault($n, $largestindex);

            $nvb = 'encode_vid_vb_'.$langcode.'_'.$av->id;
            $mform->addElement('text', $nvb, get_string('videobitrate', 'autoview').' ('.$langcode.')');
            $mform->disabledIf($nvb, $pn);
            $mform->setDefault($nvb, "256");

            $nab = 'encode_vid_ab_'.$langcode.'_'.$av->id;
            $mform->addElement('text', $nab, get_string('audiobitrate', 'autoview').' ('.$langcode.')');
            $mform->disabledIf($nab, $pn);
            $mform->setDefault($nab, "64");
        }
    }

}