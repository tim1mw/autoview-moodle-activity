<?php 
require_once ($CFG->dirroot.'/course/moodleform_mod.php');

class mod_autoview_mod_form extends moodleform_mod {

    function definition() {
	global $add, $CFG, $COURSE;

        $mform    =& $this->_form;

        $mform->addElement('text', 'content', get_string("autoviewtext", "autoview"), 'size="47"');
        if (!empty($CFG->formatstringstriptags)) {
            $mform->setType('content', PARAM_TEXT);
        } else {
            $mform->setType('content', PARAM_CLEAN);
        }
        $mform->addRule('content', null, 'required', null, 'client');

        $mform->addElement('htmleditor', 'summary', get_string("autoviewsummary", "autoview"), array('size'=>'64'));
        $mform->setType('summary', PARAM_RAW);
        $mform->setHelpButton('summary', array('questions', 'richtext'), false, 'editorhelpbutton');

        $mform->addElement('checkbox', 'noframe', '', get_string("hidenav", "autoview"));
        $mform->setDefault('noframe', false);

        if ($add)
        {
            $mform->addElement('checkbox', 'usedir', '', get_string("usedir", "autoview"));
            $mform->setDefault('usedir', true);

            $mform->addElement('checkbox', 'createnew', '', get_string("createnew", "autoview"));
            $mform->setDefault('createnew', true);
        }

        $opts=array('courseid'=>$COURSE->id, 'height'=>500, 'width'=>750, 'options'=>'none'); 
        $mform->addElement('choosecoursefile', 'configfile', get_string("chooseconfig", "autoview"), $opts);

        //$mform->addElement('filepicker', 'configfile', get_string("chooseconfig", "autoview"), $opts);
        //$mform->addElement('text', 'configfile', get_string("chooseconfig", "autoview"), 'size="47"');
        //$mform->setType('configfile', PARAM_FILE);

        if ($add)
        {
            $mform->disabledIf('configfile', 'createnew', 'checked');
            $mform->disabledIf('usedir', 'createnew');
        }

        $features = array('groups'=>false, 'groupings'=>false, 'groupmembersonly'=>true,
                          'outcomes'=>false, 'gradecat'=>false, 'idnumber'=>false);
        $this->standard_coursemodule_elements($features);

//-------------------------------------------------------------------------------
// buttons
        $this->add_action_buttons(true, null, null);
global $CONTEXT;
        if (has_capability('mod/autoview:canedit', $CONTEXT) && !$add)
        {
            $mform->addElement('html', "\n<br />\n".
             "<div style=\"text-align:center\">\n".
             "<a href=\"".$CFG->wwwroot."/mod/autoview/view.php?edit=true&id=".$this->_cm->id."\">".get_string("editbutton", "autoview")."</a>\n".
             "</div>\n");
        }
    }

}
?>
