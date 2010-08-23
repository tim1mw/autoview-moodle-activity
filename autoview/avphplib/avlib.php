<?php

/**
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence
**/

/***This is where all of the generic PHP code which can be re-used for other PHP implementations should be placed***/

include_once('refmovie.inc.php' );

function sendQTRefMovie($qturl)
{
 $RefMovie=new QTRefMovie();
 $DataReference=new QTDataReference($qturl);
 $MovieDescriptor=new QTRefMovieDescriptor();
 $MovieDescriptor->addChunk($DataReference);
 $RefMovie->addChunk($MovieDescriptor);
 $Movie=new QTMovie();
 $Movie->addChunk($RefMovie);

 header("Content-type: video/quicktime");
 echo $Movie->toString();
}

function process_xsl($datafile, $stylesheetfile, $parameters)
{
 if (class_exists('XSLTProcessor'))
 {
  /****PHP 5 Style XSL processor****/
  $doc = new DOMDocument();
  $xsltproc = new XSLTProcessor();
  $doc->load($stylesheetfile);
  $xsltproc->importStyleSheet($doc);
  $doc->load($datafile);
  foreach ($parameters as $key => $value)
   $xsltproc->setParameter('', $key, $value);

  return $xsltproc->transformToXML($doc);
 }
 else
 if (function_exists('xslt_create'))
 {
  /****PHP 4 Sablot Style XSL processor****/
  $xsltproc = xslt_create();

  $html=xslt_process($xsltproc, $datafile, $stylesheetfile, NULL, NULL, $parameters);
 
  if (empty($html))
  {
   die('XSLT processing error: '. xslt_error($xsltproc));
  }
  xslt_free($xsltproc);
  return $html;
 }
 else
 if (function_exists('domxml_xslt_stylesheet_file'))
 {
  /****PHP 4 DOM Style XSL processor****/
  $datadoc=domxml_open_file($datafile);
  $stylesheet = domxml_xslt_stylesheet_file($stylesheetfile);
  $htmldoc=$stylesheet->process($datadoc, $parameters);
  return $htmldoc->html_dump_mem();
 }
 else
  return '<p>'.get_string('noxsl', 'autoview').'</p>';
}

function testXSL()
{
 if (method_exists('XSLTProcessor', 'setParameter') || function_exists('domxml_xslt_stylesheet_file(') ||
     function_exists('xslt_create'))
  return true;

 return false;
}

function testPeclHttp()
{
 if (function_exists('http_post_fields') && function_exists('http_parse_message'))
  return true;
 else
  return false;
}

function autoview_convert_js_escapes($text, $decode=true)
{
 /*****Replace all hard spaces with normal spaces*****/
 $text=str_replace("\u00a0", " ", $text);

 /*****PHP Can't read the javascript \u escapes used by autoview directly, so convert to HTML escape sequences and then decode****/
 /*****There might be some magic regex expression that can do this in a more simple fasion, but I haven't worked this out yet*****/
 $final="";
 $pos=strpos($text, '\u', 0);
 $last=0;
 while ($pos>-1)
 {
  $final.=substr($text, $last, $pos-$last)."&#x".substr($text, $pos+2, 4).";";
  $pos=$pos+6;
  $last=$pos;
  $pos=strpos($text, '\u', $pos);
 }
 $final.=substr($text, $last);

 /*****Decode the HTML escapes and return*****/
 if ($decode)
  return htmlspecialchars_decode($final);
 else
  return $final;
}

function convertPresentationFile($swf, $pdf, $jpg, $convertKey, $convertURL, $convertFile)
{
 /***Check submitted parameters***/
 $types="";
 if ($swf=="true")
  $types=$types."swf,";
 if ($pdf=="true")
  $types=$types."pdf,";
 if ($jpg=="true")
  $types=$types."jpg";

 /***Setup parameters for convertor***/
 $data=array(
  'types' => $types,
  'key' => $convertKey);

 $mimetype="application/vnd.ms-powerpoint";

 $files = array(
  array(
   'name' => 'file',
   'type' => $mimetype,
   'file' => $convertFile
  )
 );

 $http_response=http_post_fields($convertURL, $data, $files);
 return http_parse_message($http_response);
}

function extactConvertorZip($convertdata, $newfile)
{
 $fh = fopen($newfile, 'w');
 fwrite($fh,$convertdata->body);
 fclose($fh);

 unzip_file($newfile, '', false);
 unlink($newfile);
 return true;
}

function stripFileExtension($url)
{
  $index=strrpos($url, '.');

  if ($index<1)
   $index=strlen($url);
  return substr($url,0,$index);
}

?>