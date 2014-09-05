<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="xml"
    media-type="text/html" 
    doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
    doctype-system="DTD/xhtml1-strict.dtd"
    omit-xml-declaration="yes"
    indent="yes" />

<xsl:param name="flashserver"/>
<xsl:param name="flashhost"/>
<xsl:param name="flashauth"/>

<xsl:template match="/">
<html>
 <head>
  <title></title>
  <script type="text/javascript">
  <xsl:comment>

  parent.setFlashAuth("<xsl:value-of select="$flashserver" />", "<xsl:value-of select="$flashhost" />", "<xsl:value-of select="$flashauth" />");
   //</xsl:comment>
  </script>
 </head>
 <body>
 </body>
</html>
</xsl:template>

</xsl:stylesheet>

