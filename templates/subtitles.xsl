<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv3 Licence -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="xml"
    media-type="text/html" 
    doctype-system="about:legacy-compat"
    omit-xml-declaration="yes"
    indent="yes" />

<xsl:template match="/">
<html>
 <head>
  <title>AutoView Subtitles</title>
  <script type="text/javascript">
  <xsl:comment>
     var subtitles=new Array();
   <xsl:apply-templates select="avsubtitles/subdata" />

     parent.setSubtitleStrings(subtitles);
     //</xsl:comment>
  </script>
 </head>
 <body>
 </body>
</html>
</xsl:template>

<xsl:template match="subdata">
 <xsl:for-each select="subtitle">
     subtitles[<xsl:value-of select="@pos" />]="<xsl:value-of select="." />";</xsl:for-each>
</xsl:template>

</xsl:stylesheet>
