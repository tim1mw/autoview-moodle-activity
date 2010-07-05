<?PHP // $Id: autoview.php,v 1.2 2003/11/18 07:28:46 moodler Exp $ 
      // autoview.php - created with Moodle 1.2 development (2003111400)

$string['alwaysflashstream']='Always use streaming server for flash videos';
$string['autoviewtext'] = 'AutoView Name';
$string['autoviewsummary'] = 'Summary';
$string['chooseconfig'] = 'Choose config file';
$string['configfile'] = 'Configuratraion file';
$string['convertsavefailed'] = 'Could not save converted file';
$string['editbutton'] = 'Switch on editing mode';
$string['editoff'] = 'Switch off editing mode';
$string['modulename'] = 'AutoView';
$string['modulenameplural'] = 'AutoView Presentations';
$string['xmlsavefailed'] = 'Configuration file save failed';
$string['configconversionurl'] = 'Document conversion service URL';
$string['configconversionkey'] = 'Document conversion service access key';
$string['conversiondone'] = 'The document has been converted.';
$string['conversionfailed'] = 'Conversion failed';
$string['xmlhelp']= 'In most cases you will want to use the default configuration file. This will be created for you automatically in the course home directory '.
 'using the resource name as a file name. However, if you have copied an AutoView presentation from another'.
 ' location, uncheck the box and select the .avx configuration file for that presentation here. You may also uncheck the box and enter'.
 ' an unused file name here with the .avx file extension if you want to specify the name and location of the AutoView configuration file manually.';
$string['xmlnote'] = 'Note : If you choose a configuration file name here that does not already exist then a blank configuration will be created automatically.';
$string['nojsmessage'] = 'You need javascript enabled to view this presentation.';
$string['noxsl'] = 'Warning : No suitable XSL parser has been found. Please update your PHP with XSL support enabled. Please see the ReadMe file in the autoview module'.
 ' directory for more information on how to do this';
$string['pecl_http_warn'] = 'Warning : The pecl_http PHP extension is not installed on your server. You will need this to use the '.
 'document conversion service. The module can be downloaded from http://pecl.php.net/package/pecl_http/ . If you do not intend to use '.
 'a document conversion service this warning can be ignored.';
$string['createnew'] = 'Use default AutoView configuration file (reccomended)';
$string['usedir'] = 'Create seperate folder for AutoView files and configuration';

$string['configlivecapture']= 'Live capture java applet URL';
$string['configflashserver']= 'Flash/Red5 communication server URL';
$string['configflashcapture']= 'Flash based live capture URL';
$string['configflashkey']='Flash server secret key';
$string['configflashdir']='Subdirectory for captured flash files in course';
$string['configflashsecurity'] = 'Flash/Red 5 server integration security method';
$string['secretkey'] = 'Secret Key';
$string['randomkey'] = 'Random Key';
$string['encryptedkey'] = 'Encrypted Random Key';

$string['confignote'] = 'These parameters are used to configure';
$string['confignote2'] = 'add-on services';
$string['confignote3'] = 'for AutoView. Leave them blank if you are not using any add-on services, they are not needed for normal usage.';
$string['confignote4'] = 'See the AutoView website for more details.';
$string['hidenav'] = 'Hide Moodle Navigation Bar';

$string['autoview:canedit']='Can edit presentations';
$string['autoview:canrecordflash']='Can record videos using flash Live Capture';
$string['autoview:canbroadcastflash']='Can broadcast videos using Live Lecture';
$string['autoview:canconvertdocument']='Can use online document conversion service';
$string['autoview:viewpresentation']='Can view AutoView presentations';

$string['converttitle'] = 'Document conversion web service';
$string['flashcapturetitle'] = 'Flash based live capture system';
$string['javacapturetitle'] = 'Java applet based live capture system';

$string['convertnotallowed']='You are not authorised to access the document conversion service';

$string['waitermessage'] = 'Please wait : If the editor functions don\'t appear here when the frame on the right has finished loading, click the button below';
$string['starteditor'] = 'Start Editor';

$string['not_allowed']='You do not have permission to view this presentation.';
$string['no_edit_permission']= 'You do not have permission to do this.';

$string['advanced_config']='Advanced Configuration';
$string['js_extras'] = 'JavaScript Calls';
$string['js_extras2'] = 'The JavaScript Calls option enables you to insert a platform wide javascript after the initial config parameters are setup'.
 ' without needing to patch the AutoView code directly. This allows you to change the default behaviour of AutoView on your system. '.
 'Please use with care, underlying API methods may change from time to time.';
?>
