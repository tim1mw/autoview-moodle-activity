<?php 
require_once ($CFG->dirroot.'/course/moodleform_mod.php');

class mod_autoview_mod_form extends moodleform_mod {

    function definition() {
	global $add;

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
            $mform->disabledIf('configfile', 'createnew', 'checked');

        $features = array('groups'=>false, 'groupings'=>false, 'groupmembersonly'=>true,
                          'outcomes'=>false, 'gradecat'=>false, 'idnumber'=>false);
        $this->standard_coursemodule_elements($features);

//-------------------------------------------------------------------------------
// buttons
        $this->add_action_buttons(true, null, null);

        if (has_capability('mod/autoview:canedit', $context) && !$add)
        {
            $mform->addElement('html',
              "<br /><form action=\"".$CFG->wwwroot."/mod/autoview/view.php\" method=\"get\" onsubmit=\"this.target='_top'; return true;\">".
              "<div style=\"text-align:center\">".
              "<input type=\"submit\" value=\"".get_string("editbutton", "autoview")."\" />".
              "<input type=\"hidden\" name=\"edit\" value=\"true\" />".
              "<input type=\"hidden\" name=\"id\" value=\"".$form->coursemodule."\" />".
              "</div></form>");
        }
    }

}
?>
