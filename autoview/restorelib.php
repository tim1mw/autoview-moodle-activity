<?PHP 
    //This php script contains all the stuff to backup/restore
    //autoview mods

    //This is the "graphical" structure of the autoview mod:   
    //
    //                       autoview 
    //                    (CL,pk->id)
    //
    // Meaning: pk->primary key field of the table
    //          fk->foreign key to link with parent
    //          nt->nested field (recursive data)
    //          CL->course level info
    //          UL->user level info
    //          files->table may have files)
    //
    //-----------------------------------------------------------

    //This function executes all the restore procedure about this mod
    function autoview_restore_mods($mod,$restore) {

        global $CFG;

        $status = true;

        //Get record from backup_ids
        $data = backup_getid($restore->backup_unique_code,$mod->modtype,$mod->id);

        if ($data) {
            //Now get completed xmlized object
            $info = $data->info;
            //traverse_xmlize($info);                                                                     //Debug
            //print_object ($GLOBALS['traverse_array']);                                                  //Debug
            //$GLOBALS['traverse_array']="";                                                              //Debug
          
            //Now, build the autoview record structure
            $autoview->course = $restore->course_id;
            $autoview->name = backup_todb($info['MOD']['#']['NAME']['0']['#']);
            $autoview->content = backup_todb($info['MOD']['#']['CONTENT']['0']['#']);
            $autoview->timemodified = $info['MOD']['#']['TIMEMODIFIED']['0']['#'];
            $autoview->configfile = $info['MOD']['#']['CONFIGFILE']['0']['#'];
            $autoview->noframe = $info['MOD']['#']['NOFRAME']['0']['#'];
            $autoview->summary = $info['MOD']['#']['SUMMARY']['0']['#'];

            //The structure is equal to the db, so insert the autoview
            $newid = insert_record ("autoview",$autoview);

            //Do some output     
            if (!defined('RESTORE_SILENTLY')) {
                echo "<li>".get_string("modulename","autoview")." \"".format_string(stripslashes($autoview->name),true)."\"</li>";
            }
            backup_flush(300);

            if ($newid) {
                //We have the newid, update backup_ids
                backup_putid($restore->backup_unique_code,$mod->modtype,
                             $mod->id, $newid);
   
            } else {
                $status = false;
            }
        } else {
            $status = false;
        }

        return $status;
    }

    //This function returns a log record with all the necessay transformations
    //done. It's used by restore_log_module() to restore modules log.
    function autoview_restore_logs($restore,$log) {
                    
        $status = false;
                    
        //Depending of the action, we recode different things
        switch ($log->action) {
        case "add":
            if ($log->cmid) {
                //Get the new_id of the module (to recode the info field)
                $mod = backup_getid($restore->backup_unique_code,$log->module,$log->info);
                if ($mod) {
                    $log->url = "view.php?id=".$log->cmid;
                    $log->info = $mod->new_id;
                    $status = true;
                }
            }
            break;
        case "update":
            if ($log->cmid) {
                //Get the new_id of the module (to recode the info field)
                $mod = backup_getid($restore->backup_unique_code,$log->module,$log->info);
                if ($mod) {
                    $log->url = "view.php?id=".$log->cmid;
                    $log->info = $mod->new_id;
                    $status = true;
                }
            }
            break;
        default:
            echo "action (".$log->module."-".$log->action.") unknow. Not restored<br>";                 //Debug
            break;
        }

        if ($status) {
            $status = $log;
        }
        return $status;
    }
?>
