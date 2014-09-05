<?php

/**
* This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv3 Licence
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

  /***Read file seperatly so that we can cope with non-local file systems***/
  $handle = fopen($datafile, "rb");
  $contents = '';
  while (!feof($handle))
   $contents .= fread($handle, 8192);
  fclose($handle);

  /***Process the document***/
  $doc = new DOMDocument();
  $xsltproc = new XSLTProcessor();
  $doc->load($stylesheetfile);
  $xsltproc->importStyleSheet($doc);
  $doc->loadXML($contents);
  foreach ($parameters as $key => $value)
   $xsltproc->setParameter('', $key, autoview_js_escape($value));

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

function testDocConv()
{
 if (testPeclHttp() || testCurl())
  return true;
 else
  return false;
}

function testPeclHttp()
{
 if (function_exists('http_post_fields') && function_exists('http_parse_message'))
  return true;
 else
  return false;
}

function testCurl()
{
 if (function_exists('curl_init') && function_exists('curl_setopt'))
  return true;
 else
  return false;
}

function autoview_js_escape($prep)
{
 for ($pos=0; $pos<strlen($prep); $pos++)
 {
  $c=ord($prep{$pos});
  if ($c!=45)
   if ($c>127 || $c==34 || $c==60 || $c==62 || $c==38 || $c==39 || $c==45)
   {
    $hex=dechex($c);
    while(strlen($hex)<4)
     $hex="0".$hex;
    $first=substr($prep, 0, $pos)."\\u".$hex;
    $prep=$first.substr($prep, $pos+1);
    $pos=strlen($first)-1;
   }
 }

 return $prep;
}

function autoview_convert_js_escapes($text, $decode=true)
{
 /*****Replace all hard spaces with normal spaces*****/
 $text=str_replace("\u00a0", " ", $text);

 /*****PHP Can't read the javascript \u escapes used by autoview directly, so convert to HTML escape sequences and then decode****/
 /*****There might be some magic regex expression that can do this in a more simple fashion, but I haven't worked this out yet*****/
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
 if (!file_exists($convertFile) || is_dir($convertFile))
  return false;

 /***Check submitted parameters***/
 $types="";
 if ($swf=="true")
  $types=$types."swf,";
 if ($pdf=="true")
  $types=$types."pdf,";
 if ($jpg=="true")
  $types=$types."jpg";

 /***Use curl by default, it is less likely to fail with out of memory problems***/
 $file="";
 if (testCurl())
  $file=convertPresentationFile_curl($types, $convertKey, $convertURL, $convertFile);
 else
 if (testPeclHttp())
  $file=convertPresentationFile_peclhttp($types, $convertKey, $convertURL, $convertFile);
 else
  return false;

 if (strpos($file, ".zip")>-1)
 {
  unzip_file($file, '', false);
  unlink($file);
  return stripFileExtension($convertFile).".xml";
 }

 return $file;
}

function convertPresentationFile_curl($types, $convertKey, $convertURL, $convertFile)
{
 set_time_limit(0);

 $filename=stripFileExtension($convertFile).".zip";

 $ch = curl_init();
 $fp = fopen ($filename, 'w');
 curl_setopt($ch, CURLOPT_URL, $convertURL);
 curl_setopt($ch, CURLOPT_TIMEOUT, 500);
 curl_setopt($ch, CURLOPT_FILE, $fp);
 curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
 curl_setopt($ch, CURLOPT_HEADER, 0);
 curl_setopt($ch, CURLOPT_VERBOSE, 0);
 curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; curl;)");
 curl_setopt($ch, CURLOPT_POST, true);

 $post = array(
  "types" => $types,
  "key" => $convertKey,
  "file"=> "@$convertFile"
 );

 curl_setopt($ch, CURLOPT_POSTFIELDS, $post); 
 curl_exec($ch);
 $mime_type=curl_getinfo ($ch, CURLINFO_CONTENT_TYPE);
 curl_close($ch);
 fclose($fp);

 if (filesize($filename)==0)
 {
  unlink($filename);
  return false;
 }

 if ($mime_type=="text/plain")
 {
  $txtfile=stripFileExtension($convertFile).".txt";
  rename($filename, $txtfile);
  $filename=$txtfile;
 }

 return $filename;
}

function convertPresentationFile_peclhttp($types, $convertKey, $convertURL, $convertFile)
{
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

 $messagedata=http_parse_message(http_post_fields($convertURL, $data, $files));
 if (!$messagedata)
  return false;

 $filename=stripFileExtension($convertFile).".zip";
 if ($convertdata->headers["Content-Type"]=="text/plain")
  $filename=stripFileExtension($convertFile).".txt";

 $fh = fopen($filename, 'w');
 fwrite($fh, $messagedata->body);
 fclose($fh);

 return $filename;
}

function stripFileExtension($url)
{
  $index=strrpos($url, '.');

  if ($index<1)
   $index=strlen($url);
  return substr($url,0,$index);
}

?>
