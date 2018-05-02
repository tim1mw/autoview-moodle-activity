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
     global $CFG, $DB;
     $field->set_attributes(XMLDB_TYPE_INTEGER, '1', true, true, false, "0", 'summary');
     $DB->get_manager()->add_field($table, $field);
 }

 if ($oldversion < 2014090501)
 {
     global $DB;
     $rec=$DB->get_record("capabilities", array("name"=>"mod/autoview:viewpresentation"));
     if ($rec->captype=='write')
     {
         $rec->captype='read';
         $DB->update_record("capabilities", $rec);
     }

 }

 /** Everything below this point is Moodle 2.6+ only **/

 if ($oldversion < 2015080502)
 {
     /** Move the plugin settings to mdl_config_plugins **/
     /** Insert into plugins config **/
     set_config("storage_type", $CFG->autoview_storage_type, "autoview");
     set_config("external_filekey", $CFG->autoview_external_filekey, "autoview");
     set_config("external_fileloc", $CFG->autoview_external_fileloc, "autoview");
     set_config("flashcapture", $CFG->autoview_flashcapture, "autoview");
     set_config("flashserver", $CFG->autoview_flashserver, "autoview");
     set_config("flashsecurity", $CFG->autoview_flashsecurity, "autoview");
     set_config("alwaysflashstream", $CFG->autoview_alwaysflashstream, "autoview");
     set_config("max_broadcast_kbps", $CFG->autoview_max_broadcast_kbps, "autoview");
     set_config("max_record_kbps", $CFG->autoview_max_record_kbps, "autoview");
     set_config("conversionurl", $CFG->autoview_conversionurl, "autoview");
     set_config("conversionkey", $CFG->autoview_conversionkey, "autoview");
     set_config("js_extras", $CFG->autoview_js_extras, "autoview");

     /** Remove the old values **/
     unset_config("autoview_storage_type");
     unset_config("autoview_external_filekey");
     unset_config("autoview_external_fileloc");
     unset_config("autoview_flashcapture");
     unset_config("autoview_flashserver");
     unset_config("autoview_flashsecurity");
     unset_config("autoview_alwaysflashstream");
     unset_config("autoview_max_broadcast_kbps");
     unset_config("autoview_max_record_kbps");
     unset_config("autoview_conversionurl");
     unset_config("autoview_conversionkey");
     unset_config("autoview_js_extras");
 }

 if ($oldversion < 2018050202)
 {
     unset_config("external_filekey", "autoview");
     unset_config("external_fileloc", "autoview");
     set_config("max_broadcast_kbps", "autoview");
     set_config("max_record_kbps", "autoview");
 }

 return true;
}

?>
