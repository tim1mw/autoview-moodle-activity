<?PHP 
    //This php script contains all the stuff to backup/restore
    //autoview mods

    //This is the "graphical" structure of the AutoView mod:
    //
    //                       AutoView
    //                     (CL,pk->id)
    //
    // Meaning: pk->primary key field of the table
    //          fk->foreign key to link with parent
    //          nt->nested field (recursive data)
    //          CL->course level info
    //          UL->user level info
    //          files->table may have files)
    //
    //-----------------------------------------------------------

    //This function executes all the backup procedure about this mod
    function autoview_backup_mods($bf,$preferences)
    {
        global $CFG;

        $status = true; 

        ////Iterate over autoview table
        if ($autoviews = get_records ("autoview","course", $preferences->backup_course,"id"))
        {
            foreach ($autoviews as $autoview)
            {
                if (backup_mod_selected($preferences,'autoview',$autoview->id))
                {
                    $status = autoview_backup_one_mod($bf,$preferences,$autoview);
                }
            }
        }
        return $status;
    }

    function autoview_backup_one_mod($bf,$preferences,$autoview)
    {
        global $CFG;
    
        if (is_numeric($autoview))
        {
            $autoview = get_record('autoview','id',$autoview);
        }
    
        $status = true;

        //autoview mod
        fwrite ($bf,start_tag("MOD",3,true));
        //Print assignment data
        fwrite ($bf,full_tag("ID",4,false,$autoview->id));
        fwrite ($bf,full_tag("MODTYPE",4,false,"autoview"));
        fwrite ($bf,full_tag("NAME",4,false,$autoview->name));
        fwrite ($bf,full_tag("CONTENT",4,false,$autoview->content));
        fwrite ($bf,full_tag("TIMEMODIFIED",4,false,$autoview->timemodified));
        fwrite ($bf,full_tag("CONFIGFILE",4,false,$autoview->configfile));
        fwrite ($bf,full_tag("NOFRAME",4,false,$autoview->noframe));
        fwrite ($bf,full_tag("SUMMARY",4,false,$autoview->summary));
        //End mod
        $status = fwrite ($bf,end_tag("MOD",3,true));

        return $status;
    }
   
    ////Return an array of info (name,value)
    function autoview_check_backup_mods($course,$user_data=false,$backup_unique_code,$instances=null)
    {
        if (!empty($instances) && is_array($instances) && count($instances))
        {
            $info = array();
            foreach ($instances as $id => $instance)
            {
                $info += autoview_check_backup_mods_instances($instance,$backup_unique_code);
            }
            return $info;
        }

         //First the course data
         $info[0][0] = get_string("modulenameplural","autoview");
         $info[0][1] = count_records("autoview", "course", "$course");
         return $info;
    } 

    ////Return an array of info (name,value)
    function autoview_check_backup_mods_instances($instance,$backup_unique_code)
    {
         //First the course data
        $info[$instance->id.'0'][0] = '<b>'.$instance->name.'</b>';
        $info[$instance->id.'0'][1] = '';
        return $info;
    }

?>
