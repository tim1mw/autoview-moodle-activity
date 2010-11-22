<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "DTD/xhtml1-frameset.dtd">
<html>
 <head>
  <title>AutoView Resource Test Page</title>  
 </head>
 <body>
 <h2>XSL Support</h2>
 <pre><?php

 $found=false;

 if (class_exists('XSLTProcessor'))
 {
  $found=true;
  echo "PHP5 libxslt XSLTProcessor Found\n"; 

  if (method_exists('XSLTProcessor', 'importStyleSheet'))
   echo "\tXSLTProcessor->importStyleSheet() OK\n";
  else
   echo "\tXSLTProcessor->importStyleSheet() not found\n";

  if (method_exists('XSLTProcessor', 'setParameter'))
   echo "\tXSLTProcessor->setParameter() OK\n";
  else
   echo "\tXSLTProcessor->setParameter() not found\n";

  if (method_exists('XSLTProcessor', 'transformToXML'))
   echo "\tXSLTProcessor->transformToXML() OK\n";
  else
   echo "\tXSLTProcessor->transformToXML() not found\n";

  if (class_exists('DOMDocument'))
   echo "\tDOMDocument OK\n";
  else
   echo "\tDOMDocument not found\n";

  if (method_exists('DOMDocument', 'load'))
   echo "\tDOMDocument->load() OK\n";
  else
   echo "\tDOMDocument->load() not found\n";
 }

 if (function_exists('xslt_create'))
 {
  $found=true;
  echo "\nPHP4 Sablot XSLT Found\n".
   "\txslt_create() OK\n";

  if (function_exists('xslt_process'))
   echo "\txslt_process() OK\n";
  else
   echo "\txslt_process() not found\n";

  if (function_exists('xslt_free'))
   echo "\txslt_free() OK\n";
  else
   echo "\txslt_free() not found\n";
 }

 if (function_exists('domxml_xslt_stylesheet_file'))
 {
  $found=true;
  echo "\nPHP4 libxslt methods found\n".
   "\tdomxml_xslt_stylesheet_file OK\n";

  if (function_exists('domxml_open_file'))
   echo "\tdomxml_open_file OK\n";
  else
   echo "\tdomxml_open_file not found\n";
 }
 ?></pre>
 <?php
 if ($found==false)
  echo "<p style=\"color:#ff0000;\">Warning : No XSLT Processors have been found</p>";
 else
  echo "<p>You have a suitable XSL converter</p>";
 ?>

 <h2>Document conversion service</h2>

 <pre><?php

 $found=false;
 if (function_exists('http_post_fields') && function_exists('http_parse_message'))
 {
  $found=true;
  echo "\npecl_http extension found\n";
 }
 else
 {
  echo "\npecl_http extension not found\n";
 }


 if (function_exists('curl_init') && function_exists('curl_setopt'))
 {
  $found=true;
  echo "\ncurl extension found\n";
 }
 else
 {
  echo "\ncurl extension not found\n";
 }

 ?></pre>

 <?php
 if ($found==false)
  echo "<p style=\"color:#ff0000;\">Warning : You do not have curl or pecl_http support on this server, you need at least one of these ".
   "extensions to communicate with a document converter service.</p>";
 else
  echo "<p>You have the necessary extensions to communicate with a document conversion service.</p>";
 ?>

 <h2>Check all module files :</h2>

 <table>
 <?php
  $filename = $fileloc.'filelist.txt';
  $handle = fopen($filename, "r");
  $contents = fread($handle, filesize($filename));
  fclose($handle);

  $tok = strtok($contents, " \n\t");
 
  while ($tok !== false)
  {
   if (is_readable($fileloc.$tok))
    echo "<tr><td>".$tok."</td><td>OK</td></tr>\n";
   else
   if (file_exists($fileloc.$tok))
    echo "<tr><td bgcolor='#ff0000'>".$tok."</td><td bgcolor='#ff0000'>Unreadable</td>";
   else
    echo "<tr><td bgcolor='#ff0000'>".$tok."</td><td bgcolor='#ff0000'>Not Found</td>";

   $tok = strtok("\n\r");
  }


 ?>
 </table>
</body>
</html>
