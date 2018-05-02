<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<!-- This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence -->
<xsl:output method="xml"
    media-type="text/html" 
    doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
    doctype-system="DTD/xhtml1-strict.dtd"
    omit-xml-declaration="yes"
    indent="yes" />

<xsl:param name="aveditdir"/>
<xsl:param name="message"/>
<xsl:param name="message2"/>
<xsl:param name="fname" />
<xsl:param name="error" />
<xsl:param name="buttontext" />

<xsl:param name="swf" />
<xsl:param name="pdf" />
<xsl:param name="jpg" />

<xsl:template match="/">

<html>
<head>
<title>Slide Converter</title>
<link type="text/css" rel="stylesheet" href="{$aveditdir}popup.css"/>
</head>
<body>

 <xsl:if test="$error='true'">
 <h1 style="text-align:center;margin-bottom:30px;"><xsl:value-of select="$message" /></h1>
 <form action="javascript:window.close();">
 <pre><xsl:value-of select="$message2" /></pre>
 <p style="text-align:center;margin-top:30px;">
 <input type="submit" value="{$buttontext}" />
 </p>
 </form>
 </xsl:if>

 <xsl:if test="$error='false'">
 <h1 style="text-align:center;">
 <xsl:value-of select="$message" /></h1>
 <script type="text/javascript">
 <xsl:comment>
  function addSources()
  {
   <xsl:if test="$swf='true'">
   opener.addUpdateSlideSrc(null, -1, document.addsources.lang.value, window.opener.parent.videoframe.SLIDE_AVFLASH,
    "<xsl:value-of select="$fname" />.swf", "none", true, false);
   </xsl:if>
   <xsl:if test="$pdf='true'">
   opener.addUpdateSlideSrc(null, -1, document.addsources.lang.value, window.opener.parent.videoframe.SLIDE_PDF,
    "<xsl:value-of select="$fname" />.pdf", "none", true, false);
   </xsl:if>
   <xsl:if test="$jpg='true'">
   opener.addUpdateSlideSrc(null, -1, document.addsources.lang.value, window.opener.parent.videoframe.SLIDE_IMAGE_PRELOAD,
    "<xsl:value-of select="$fname" />", ".jpg", true, false);
   </xsl:if>

   <xsl:apply-templates select="convert/titles" />
   opener.setNumSlidesValue(document.addsources.lang.value, parseInt(document.addsources.numslides.value));

   opener.saveXMLConfig();
   opener.setTimeout("parent.videoframe.location.reload()", 1500);
   window.close();
  }
 //</xsl:comment>
 </script>
 <br />
 <form action="javascript:addSources();" name="addsources">
  <table align="center">
   <tr>
    <td>Language</td>
    <td>
     <script language="javascript" type="text/javascript"><xsl:comment>
      var l="en";
      if (typeof(opener.parent.videoframe.selectedLang)!="undefined")
       l=opener.parent.videoframe.selectedLang;
      document.writeln(opener.getLangOptions(l));
     //</xsl:comment></script>
    </td>
   </tr><tr>
    <td>Number of Slides</td>
    <td><xsl:apply-templates select="convert/numslides" /></td>
   </tr><tr>
    <td colspan="2" align="center"><br /><input type="submit" value="{$buttontext}" /></td>
  </tr>
 </table>
 </form>
 </xsl:if>

</body>
</html>

</xsl:template>

<xsl:template match="numslides">
<input type="text" name="numslides" value="{.}" size="4" />
</xsl:template>

<xsl:template match="titles">
   var t=new Array();
 <xsl:for-each select="title">
   t[<xsl:value-of select="@num" />]="<xsl:value-of select="." />";
 </xsl:for-each>
   opener.parent.videoframe.setSlideTitles(t, document.addsources.lang.value);
</xsl:template>

</xsl:stylesheet>
