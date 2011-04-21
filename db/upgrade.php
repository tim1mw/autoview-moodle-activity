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

    return true;
}

?>
