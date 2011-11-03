<?php

function xmldb_autoview_upgrade($oldversion=0)
{

 if ($oldversion < 2008030310)
 {
     $table = new XMLDBTable('autoview');
     $field = new XMLDBField('noframe');
     $field->setAttributes(XMLDB_TYPE_INTEGER, '1', true, true, false, false, null, "0", 'configfile');
     if (!add_field($table, $field))
         return false;
 }

 if ($oldversion < 2008060606)
 {
     $table = new XMLDBTable('autoview_keys');

     $id = new XMLDBField('id');
     $id->setAttributes(XMLDB_TYPE_INTEGER, '10', true, true, false, false, null, "0");
     $table->addField($id);

     $key = new XMLDBField('accesskey');
     $key->setAttributes(XMLDB_TYPE_CHAR, '30', true, true, false, false, null, "", 'id');
     $table->addField($key);

     $ip = new XMLDBField('ip');
     $ip->setAttributes(XMLDB_TYPE_CHAR, '15', true, true, false, false, null, "", 'accesskey');
     $table->addField($ip);

     $userid = new XMLDBField('userid');
     $userid->setAttributes(XMLDB_TYPE_INTEGER, '10', true, true, false, false, null, "0", 'ip');
     $table->addField($userid);

     $cmid = new XMLDBField('cmid');
     $cmid->setAttributes(XMLDB_TYPE_INTEGER, '10', true, true, false, false, null, "0", 'userid');
     $table->addField($cmid);

     $time = new XMLDBField('time');
     $time->setAttributes(XMLDB_TYPE_INTEGER, '10', true, true, false, false, null, "0", 'cmid');
     $table->addField($time);

     $dbkey=new XMLDBKey('id');
     $dbkey->setAttributes(XMLDB_KEY_PRIMARY, array('id'));
     $table->addKey($dbkey);

     if (!create_table($table))
         return false;
 }

 if ($oldversion < 2008052202)
 {
     $table = new XMLDBTable('autoview');
     $field = new XMLDBField('summary');
     $field->setAttributes(XMLDB_TYPE_CHAR, '255', true, true, false, false, null, "", 'noframe');
     if (!add_field($table, $field))
         return false;
 }

 /***Stuff above this line shouldn't need to support Moodle 2.x***/

 if ($oldversion < 2011052501)
 {
     $table = new XMLDBTable('autoview');
     $field = new XMLDBField('storage');
     global $CFG;
     if ($CFG->version>=2010000000)
     {
         global $DB;
         $field->set_attributes(XMLDB_TYPE_INTEGER, '1', true, true, false, "0", 'summary');
         $DB->get_manager()->add_field($table, $field);
     }
     else
     {
         $field->setAttributes(XMLDB_TYPE_INTEGER, '1', true, true, false, false, null, "0", 'summary');
         if (!add_field($table, $field))
             return false;
     }
 }

 global $CFG;
 if ($CFG->version<2010000000)
 {
  //Need to check the log display entries in Moodle 1.9x
  autoview_check_log_table_entries();
 }

 return true;
}

 /**
 * Checks that all the log table entries are correct
 **/

 function autoview_check_log_table_entries()
 {
     autoview_check_log_table_entry("add");
     autoview_check_log_table_entry("edit");
     autoview_check_log_table_entry("flash play");
     autoview_check_log_table_entry("flash play and rec");
     autoview_check_log_table_entry("update");
     autoview_check_log_table_entry("view");
     autoview_check_log_table_entry("view all");
 }

 /**
 * Check a single log table entry and adds it if it is missing. Only needs to work in Moodle 1.9x
 * @param string $e The table to check
 **/

 function autoview_check_log_table_entry($e)
 {
     $r=get_record("log_display", "action", $e, "module", "autoview");
     if (!$r)
     {
         $r=new stdclass;
         $r->module="autoview";
         $r->action=$e;
         $r->mtable="autoview";
         $r->field="name";
         insert_record("log_display", $r);
     }
 }

?>
