<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

$string['pluginname'] = 'AutoView';
$string['pluginadministration'] = 'AutoView Settings';
$string['alwaysflashstream']='Always use Lecture Capture Live streaming server for flash videos';
$string['alwaysflashstream2']='Force the use of the Lecture Capture Live streaming server for all new presentions with flash videos.';
$string['autoviewtext'] = 'AutoView Name';
$string['autoviewsummary'] = 'Summary';
$string['autoview_website'] = 'AutoView Website';
$string['chooseconfig'] = 'Set config file';
$string['configfile'] = 'Configuratraion file';
$string['convertsavefailed'] = 'Could not save converted file';
$string['editbutton'] = 'Switch on editing mode';
$string['editoff'] = 'Switch off editing mode';
$string['modulename'] = 'AutoView';
$string['modulenameplural'] = 'AutoView Presentations';
$string['xmlsavefailed'] = 'Configuration file save failed';
$string['conversiondone'] = 'The document has been converted.';
$string['conversionfailed'] = 'Conversion failed';
$string['conversionfailed_noerror'] = 'No error message was returned by the document converter.\nIt may not be running, or has been wrongly configured.';
$string['addtext'] = 'Add slide source(s) for the converted document to the presentation';
$string['closetext'] ='Close this window';
$string['file_not_found'] = 'The file selected for conversion does not exist.';
$string['xmlhelp']= 'In most cases you will want to use the default configuration file. This will be created for you automatically in the course home directory using the resource name as a file name. However, if you have copied an AutoView presentation from another location, uncheck the box and select the .avx configuration file for that presentation here. You may also uncheck the box and enter an unused file name here with the .avx file extension if you want to specify the name and location of the AutoView configuration file manually.';
$string['xmlnote'] = 'Note : If you choose a configuration file name here that does not already exist then a blank configuration will be created automatically.';
$string['nojsmessage'] = 'You need javascript enabled to view this presentation.';
$string['noxsl'] = 'Warning : No suitable XSL parser has been found. Please update your PHP installation with XSL support enabled. Please see the ReadMe file in the autoview module directory for more information on how to do this.';
$string['pecl_http_warn'] = 'Warning : You do not have either the curl or pecl_http PHP extensions is not installed on your server. You will need one of these extensions to be able to integrate with a document conversion service. If you do not intend to use a document conversion service this warning can be ignored.';
$string['createnew'] = 'Use default AutoView configuration file (reccomended)';
$string['usedir'] = 'Create separate folder for AutoView files and configuration';

$string['config_storage_type'] = 'AutoView File Storage Location';
$string['config_storage_type2'] = "This setting determines the default storage method for files used by the AutoView module. Changing this setting will not move any existing files, it only affects new presentations. Ideally this setting should not be changed after the initial module setup is completed.<br /><br />If you choose <b>Internal - Course Files</b>, then all files will be held in the course files area repository plugin. This is currently the only available choice.";
$string['internal_storage'] = 'Internal - Course Files';

$string['hidenav'] = 'Hide Moodle Navigation Bar';

$string['autoview:addinstance']='Can add Autoview modules';
$string['autoview:canedit']='Can edit presentations';
$string['autoview:canconvertdocument']='Can use online document conversion service';
$string['autoview:viewpresentation']='Can view AutoView presentations';

$string['storagetitle'] = 'File Storage Area';

$string['convertnotallowed']='You are not authorised to access the document conversion service';

$string['waitermessage'] = "Please wait : If the editor functions do not appear here when the presentation on the right has finished loading, click the button below.";
$string['starteditor'] = 'Start Editor';

$string['not_allowed']='You do not have permission to view this presentation.';
$string['no_edit_permission']= 'You do not have permission to do this.';
$string['pres_saved'] ='Presentation Saved';

$string['advanced_config']='Advanced Configuration';
$string['js_extras'] = 'JavaScript Calls';
$string['js_extras2'] = 'The JavaScript Calls option enables you to insert a platform wide javascript call after the initial config parameters are setup without needing to patch the AutoView code directly. This allows you to change the default behaviour of AutoView on your system. Please use with care, underlying API methods may change from time to time.';

$string['no_repofileman'] = 'The Repository File Manager block has not been installed. This is required to use AutoView in Moodle 2.x with internal file storage.';
$string['no_coursefilearea'] = 'The Course File Area repository has not been installed. This is required to use AutoView in Moodle 2.x with internal file storage.';

$string['content_update'] = 'AutoView Content Update';
$string['content_update_note'] = 'AutoView for Moodle 3.5 and later has undergone significant changes to remove redundant plugin types and'.
    ' provide better support for modern streaming formats. The content update tool will help you to remove old video types and where possible'.
    ' convert videos to more more modern formats. Click the link below to open the update tool.';
$string['content_update_link'] = 'Open Content Update Tool';

$string['not_authorised'] = 'You are not authorised to run the content update tool.';

$string['ffmpeg'] = 'FFMPEG Binary Location';
$string['ffmpeg2'] = 'The content update tool requires FFMPEG to convert legacy file types into modern formats. If you wish to use this, enter the location of the FFMPEG binary on your server here.';
$string['convertcourseinfo'] = 'AutoView presentations have been found in the following courses. Please select the courses you wish to process. Please note, conversion using FFMPEG can be slow, so it is not reccomended to convert large numbers of courses or presentations at once.';
$string['urltrans'] = 'URL path translation';
$string['course_required'] = 'You must select a course.';
$string['removelegacy'] = 'Remove Legacy video sources';
$string['removemodem'] = 'Remove Dial-up modem videos';
$string['removeredundant'] = 'Remove redundant video files from storage';
$string['createhtml5'] = 'Create HTML 5 video';
$string['createformat_no'] = 'No';
$string['createformat_mp4'] = 'MP4 Format';
$string['createformat_hls'] = 'HLS Format';
$string['createformat_dash'] = 'DASH Format';
$string['replacehtml5'] = 'Replace existing HTML 5 videos';
$string['flashvideos'] = 'Flash Videos';
$string['noflash'] = 'No Flash videos found.';
$string['hasflash'] = 'Contains Flash videos.';
$string['legacyvideos'] = 'Legacy Videos';
$string['nolegacy'] = 'No legacy videos found.';
$string['haslegacy'] = 'Contains legacy videos.';
$string['modemvideos'] = 'Dial-up modem speed videos';
$string['nomodem'] = 'No dial-up modem speed videos found.';
$string['hasmodem'] = 'Contains dial-up modem speed videos.';
$string['html5videos'] = 'HTML 5 videos';
$string['nohtml5'] = 'No HTML 5 videos found.';
$string['hashtml5'] = 'Contains HTML 5 videos.';
$string['hlsdashvideos'] = 'Streamable HTML 5';
$string['nohlsdash'] = 'No Streamable HTML 5 videos found (HLS or DASH).';
$string['hashlsdash'] = 'Contains streamable html 5 format video (HLS or DASH).';
$string['processvideo'] = 'Process presentation';
$string['encodevideo'] = 'Video to re-encode';
$string['videobitrate'] = 'Re-encoded video bitrate in Kbps';
$string['audiobitrate'] = 'Re-encoded audio bitrate in Kbps';
?>
