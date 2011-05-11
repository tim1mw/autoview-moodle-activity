<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<!-- This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence -->
<xsl:output method="xml"
    media-type="text/html" 
    doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
    doctype-system="DTD/xhtml1-strict.dtd"
    omit-xml-declaration="yes"
    indent="yes" />

<xsl:param name="vresource"/>
<xsl:param name="xmlSendURL"/>
<xsl:param name="xmlID"/>
<xsl:param name="xmlFile"/>
<xsl:param name="fileBrowser"/>
<xsl:param name="conversionURL"/>
<xsl:param name="waiterMessageStr"/>
<xsl:param name="startEditorStr"/>
<xsl:param name="flashDir"/>
<xsl:param name="alwaysflashstream"/>
<xsl:param name="broadcastMaxKbps"/>

<xsl:template match="/">
<html>
  <head>
    <title>AutoView Editor</title>
    <link type="text/css" rel="stylesheet" href="{$vresource}style.css" />
    <script type="text/javascript">
    <xsl:comment>
     var xmlSendURL="<xsl:value-of select="$xmlSendURL" />";
     var xmlID="<xsl:value-of select="$xmlID" />";
     var xmlFile="<xsl:value-of select="$xmlFile" />";
     var fileBrowser="<xsl:value-of select="$fileBrowser" />";
     var conversionURL="<xsl:value-of select="$conversionURL" />";
     var flashDir="<xsl:value-of select="$flashDir" />";
     var alwaysFlashStream=<xsl:value-of select="$alwaysflashstream" />;
     var broadcastMaxKbps=<xsl:value-of select="$broadcastMaxKbps" />;
    //</xsl:comment>
    </script>
    <style type="text/css">
     html
     {
      overflow-x:hidden;
     }
    </style>
  </head>
  <body onunload="saveAll();if(parent.videoframe.browser==parent.videoframe.MSIE) pause(2000);">
    <div id="editor">
     <p><xsl:value-of select="$waiterMessageStr" /></p>
     <p style="text-align:center;"><a href="javascript:startEditor();" class="linkbutton"><xsl:value-of select="$startEditorStr"/></a></p>
    </div>
    <script type="text/javascript" src="avedit/editor.js">//</script>
    <script type="text/javascript" src="avedit/base64.js">//</script>
  </body>
</html>
</xsl:template>

</xsl:stylesheet>
