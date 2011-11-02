<?php
/**
 * Log events for AutoView
 *
 * @package    mod
 * @subpackage autoview
 * @copyright  2011 AutoTrain e-Learning, Tim Williams (tmw@autotrain.org)
 * @license    GNU GPL v2 or later
 */

defined('MOODLE_INTERNAL') || die();

$logs = array(
    array('module'=>'autoview', 'action'=>'view', 'mtable'=>'autoview', 'field'=>'name'),
    array('module'=>'autoview', 'action'=>'view all', 'mtable'=>'autoview', 'field'=>'name'),
    array('module'=>'autoview', 'action'=>'update', 'mtable'=>'autoview', 'field'=>'name'),
    array('module'=>'autoview', 'action'=>'add', 'mtable'=>'autoview', 'field'=>'name'),
    array('module'=>'autoview', 'action'=>'edit', 'mtable'=>'autoview', 'field'=>'name'),
    array('module'=>'autoview', 'action'=>'flash play', 'mtable'=>'autoview', 'field'=>'name'),
    array('module'=>'autoview', 'action'=>'flash play and rec', 'mtable'=>'autoview', 'field'=>'name'),
);
?>
