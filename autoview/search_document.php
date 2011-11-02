<?php
/**
* Global Search Engine for Moodle
*
* @package autoview
* @category contrib
* @author Valery Fremaux [valery.fremaux@club-internet.fr] > 1.9. Modified for AutoView by Tim Williams (tmw@autotrain.org)
* @date 2009/2/11
* @license http://www.gnu.org/copyleft/gpl.html GNU Public License v3
*
* document handling for all resources
* This file contains the mapping between a resource and it's indexable counterpart,
*
* Functions for iterating and retrieving the necessary records are now also included
* in this file, rather than mod/resource/lib.php
*/

define('X_SEARCH_TYPE_AUTOVIEW', 'autoview');

/**
* requires and includes
*/
require_once("$CFG->dirroot/search/documents/document.php");
require_once("$CFG->dirroot/mod/resource/lib.php");
require_once("$CFG->dirroot/mod/autoview/lib.php");
require_once("$CFG->dirroot/search/documents/physical_pdf.php");
require_once("$CFG->dirroot/search/documents/physical_swf.php");

/* *
* a class for representing searchable information
* 
*/
class AutoViewSearchDocument extends SearchDocument {
    public function __construct(&$autoview, $context_id) {

        // generic information; required
        $doc->docid     = $autoview['id'];
        $doc->documenttype = X_SEARCH_TYPE_AUTOVIEW;
        $doc->itemtype     = 'autoview';
        $doc->contextid    = $context_id;

        $doc->title     = strip_tags($autoview['name']);
        $doc->date      = $autoview['timemodified'];
        $doc->author    = '';
        $doc->contents  = autoview_get_content($autoview);
        $doc->url       = autoview_make_link($autoview['id']);
        
        // module specific information; optional
        $data = array();
        
        // construct the parent class
        parent::__construct($doc, $data, $autoview['course'], 0, 0, 'mod/'.X_SEARCH_TYPE_AUTOVIEW);
    } //constructor
}

function autoview_get_content($autoview)
{
    global $CFG;

    /*****Get the slide titles*****/
    $text=autoview_convert_js_escapes(process_xsl($CFG->dataroot.'/'.$autoview['course'].'/'.$autoview['configfile'],
        $CFG->dirroot.'/mod/autoview/templates/search-titles.xsl', array()));

    /*****Get the subtitles*****/
    $doc = new DOMDocument();
    $doc->load($CFG->dataroot.'/'.$autoview['course'].'/'.$autoview['configfile']);
    $sublangs=$doc->getElementsByTagName('sublang');
    for ($loop=0; $loop<$sublangs->length; $loop++)
    {
        $url=$sublangs->item($loop)->getElementsByTagName('url');
        $text.=autoview_convert_js_escapes(process_xsl($CFG->dataroot.'/'.$autoview['course'].'/'.$url->item(0)->nodeValue,
        $CFG->dirroot.'/mod/autoview/templates/search-subtitles.xsl', array()));
    }

    /*****Get the slide text from the PDF or SWF sources if they exist*****/
    $slidetext=autoview_get_pdf_slide_text($doc, $autoview);
    if (strlen($slidetext)==0)
        $slidetext=autoview_get_swf_slide_text($doc, $autoview);
    $text.=$slidetext;

    return $text;
}

function autoview_get_pdf_slide_text($doc, $autoview)
{
    $slidesrcs=$doc->getElementsByTagName('slidesrc');
    $text="";

    for ($loop=0; $loop<$slidesrcs->length; $loop++)
    {
        $type=$slidesrcs->item($loop)->getElementsByTagName('type')->item(0)->nodeValue;
        if ($type=="PDFSlide")
        {
            $url=$slidesrcs->item($loop)->getElementsByTagName('url');
            $pdffile=$autoview['course'].'/'.$url->item(0)->nodeValue;
            $text.="<pre>".get_text_for_indexing_pdf($autoview, $pdffile)."</pre>";
        }
    }

    return $text;
}

function autoview_get_swf_slide_text($doc, $autoview)
{
    $slidesrcs=$doc->getElementsByTagName('slidesrc');
    $text="";

    for ($loop=0; $loop<$slidesrcs->length; $loop++)
    {
        $type=$slidesrcs->item($loop)->getElementsByTagName('type')->item(0)->nodeValue;
        if ($type=="AVFlashSlide" || $type=="OOFlashSlide")
        {
            $url=$slidesrcs->item($loop)->getElementsByTagName('url');
            $swffile=$autoview['course'].'/'.$url->item(0)->nodeValue;
            $text.="<pre>".get_text_for_indexing_swf($autoview, $swffile)."</pre>";
        }
    }

    return $text;
}

/**
* constructs valid access links to information
* @param resourceId the of the resource 
* @return a full featured link element as a string
*/
function autoview_make_link($id) {
    global $CFG;
    return $CFG->wwwroot.'/mod/autoview/view.php?l='.$id;
}

/**
* part of standard API
*
*/
function autoview_iterator() {
    //trick to leave search indexer functionality intact, but allow
    //this document to only use the below function to return info
    //to be searched
    $autoviews = get_records('autoview');
    return $autoviews;
}

/**
* part of standard API
* this function does not need a content iterator, returns all the info
* itself;
* @param notneeded to comply API, remember to fake the iterator array though
* @uses CFG
* @return an array of searchable documents
*/
function autoview_get_content_for_index(&$autoview) {
    global $CFG;

    // starting with Moodle native resources
    $documents = array();

    $coursemodule = get_field('modules', 'id', 'name', 'autoview');
    $cm = get_record('course_modules', 'course', $autoview->course, 'module', $coursemodule, 'instance', $autoview->id);
    $context = get_context_instance(CONTEXT_MODULE, $cm->id);

    $documents[] = new AutoViewSearchDocument(get_object_vars($autoview), $context->id);

    mtrace("finished autoview {$autoview->id}");
    return $documents;
}

/**
* part of standard API.
* returns a single resource search document based on a autoview id
* @param id the id of the accessible document
* @return a searchable object or null if failure
*/
function autoview_single_document($id, $itemtype) {
    global $CFG;
    
    $autoview = get_record('autoview', 'id', $id);

    if ($autoview){
        $coursemodule = get_field('modules', 'id', 'name', 'autoview');
        $cm = get_record('course_modules', 'id', $autoview->id);
        $context = get_context_instance(CONTEXT_MODULE, $cm->id);
        return new AutoViewSearchDocument(get_object_vars($autoview), $context->id);
    }
    return null;
}

/**
* dummy delete function that aggregates id with itemtype.
* this was here for a reason, but I can't remember it at the moment.
*
*/
function autoview_delete($info, $itemtype) {
    $object->id = $info;
    $object->itemtype = $itemtype;
    return $object;
} //resource_delete

/**
* returns the var names needed to build a sql query for addition/deletions
*
*/
function autoview_db_names() {
    //[primary id], [table name], [time created field name], [time modified field name], [docsubtype], [additional where conditions for sql]
    return array(array('id', 'autoview', 'timemodified', 'timemodified', 'autoview', ''));
}

/**
* this function handles the access policy to contents indexed as searchable documents. If this 
* function does not exist, the search engine assumes access is allowed.
* @param path the access path to the module script code
* @param itemtype the information subclassing (usefull for complex modules, defaults to 'standard')
* @param this_id the item id within the information class denoted by itemtype. In resources, this id 
* points to the resource record and not to the module that shows it.
* @param user the user record denoting the user who searches
* @param group_id the current group used by the user when searching
* @return true if access is allowed, false elsewhere
*/
function autoview_check_text_access($path, $itemtype, $this_id, $user, $group_id, $context_id){
    global $CFG;
    
    // include_once("{$CFG->dirroot}/{$path}/lib.php");
    
    $r = get_record('autoview', 'id', $this_id);
    $module_context = get_record('context', 'id', $context_id);
    $cm = get_record('course_modules', 'id', $module_context->instanceid);
    $course_context = get_context_instance(CONTEXT_COURSE, $r->course);

    //check if englobing course is visible
    if (!has_capability('moodle/course:view', $course_context)){
        return false;
    }

    //check if found course module is visible
    if (!$cm->visible and !has_capability('moodle/course:viewhiddenactivities', $module_context)){
        return false;
    }
    
    return true;
}

/**
* post processes the url for cleaner output.
* @param string $title
*/
function autoview_link_post_processing($title){
    global $CFG;

    if ($CFG->block_search_utf8dir){
        return mb_convert_encoding($title, 'UTF-8', 'auto');
    }
    return mb_convert_encoding($title, 'auto', 'UTF-8');
}
?>
