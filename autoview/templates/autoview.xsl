<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv2 Licence -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="xml"
    media-type="text/html" 
    doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
    doctype-system="DTD/xhtml1-strict.dtd"
    omit-xml-declaration="yes"
    indent="yes" />

<xsl:param name="htmlbase"/>
<xsl:param name="vresource"/>
<xsl:param name="extension"/>
<xsl:param name="qtrefurl"/>
<xsl:param name="xmlsubtitle"/>
<xsl:param name="aveditdir"/>
<xsl:param name="flashserver"/>
<xsl:param name="flashcapture"/>
<xsl:param name="flashhost"/>
<xsl:param name="flashpath"/>
<xsl:param name="flashrecord"/>
<xsl:param name="flashbroadcast"/>
<xsl:param name="user"/>
<xsl:param name="exitURL"/>
<xsl:param name="title"/>
<xsl:param name="preferedLang"/>
<xsl:param name="nojsMessage"/>
<xsl:param name="jsExtras"/>
<xsl:param name="recordMaxKbps"/>
<xsl:param name="bodyStyle"/>
<xsl:param name="themeimport"/>

<xsl:template match="/">
<html>
 <head>
  <xsl:if test="string-length($htmlbase) &gt; 0">
   <base href="{$htmlbase}" />
  </xsl:if>
  <link type="text/css" rel="stylesheet" href="{$vresource}style.css"/>
  <link type="text/css" rel="stylesheet" href="{$vresource}divs-table.css"/>
  <title><xsl:value-of select="$title" /></title>

  <script type="text/javascript" src="{$themeimport}">//</script>
  <script type="text/javascript" src="{$vresource}autoview.js">//</script>
  <xsl:if test="string-length($extension) &gt; 0">
   <script type="text/javascript" src="{$extension}">//</script>
  </xsl:if>

  <xsl:apply-templates select="autoview/languages" />

  <script type="text/vbscript" src="{$vresource}plugin-detect.vbs">//</script>

  <script type="text/javascript">
  <xsl:comment>
  <xsl:if test="string-length($htmlbase) &gt; 0">
  setBaseRef("<xsl:value-of select="$htmlbase" />");
  </xsl:if>
  setVresourcePath("<xsl:value-of select="$vresource" />");
  setQTRefURL("<xsl:value-of select="$qtrefurl" />");
  setXMLSubtitle("<xsl:value-of select="$xmlsubtitle" />");
  <xsl:if test="string-length($exitURL) &gt; 0">
  setExitURL("<xsl:value-of select="$exitURL" />");
  </xsl:if>
  <xsl:if test="string-length($flashserver) &gt; 0">
  setFlashParams("<xsl:value-of select="$flashserver" />", "<xsl:value-of select="$flashhost" />", "<xsl:value-of select="$flashcapture" />");
  </xsl:if>
  <xsl:if test="string-length($aveditdir) &gt; 0">
  setAVEditDir("<xsl:value-of select="$aveditdir" />");
  </xsl:if>
  <xsl:if test="string-length($flashrecord) &gt; 0">
  setFlashConnectionParams("<xsl:value-of select="$flashpath" />", <xsl:value-of select="$flashrecord" />, <xsl:value-of select="$flashbroadcast" />);
  </xsl:if>
  <xsl:if test="string-length($user) &gt; 0">
  setUser("<xsl:value-of select="$user" />");
  </xsl:if>
  <xsl:if test="string-length($recordMaxKbps) &gt; 0">
  setRecordMaxKbps(<xsl:value-of select="$recordMaxKbps" />);
  </xsl:if>
  setPreferedLang('<xsl:value-of select="$preferedLang"/>');
  initLang();
  <xsl:apply-templates select="autoview/videos" />
  <xsl:apply-templates select="autoview/slides" />

  <xsl:apply-templates select="autoview/subtitles" />

  <xsl:apply-templates select="autoview/options" />
  <xsl:apply-templates select="autoview/controls" />
  <xsl:if test="string-length($jsExtras) &gt; 0">
  <xsl:value-of select="$jsExtras" />
  </xsl:if>
   //</xsl:comment>
  </script>
 </head>
 <body onload="if (browser==MSIE) restartMonitor();" style="{$bodystyle}">

  <script type="text/javascript">
  <xsl:comment>
   initPresentation();
   if (editing)
    setTimeout("parent.editframe.startEditor()", 1000);
   if (typeof(importTheme())!="undefined")
    importTheme();
   </xsl:comment>
  </script>
  <noscript>
   <pre><xsl:value-of select="$nojsMessage" /></pre>
  </noscript>
 </body>
</html>
</xsl:template>

<xsl:template match="languages">
  <script type="text/javascript" src="{$vresource}lang/en.js">//</script>
 <xsl:if test="string-length($extension) &gt; 0">
  <!-- *****Add new languages for the delivery platform to this section of code***** -->
  <script type="text/javascript" src="{$vresource}lang/fr.js">//</script>
  <script type="text/javascript" src="{$vresource}lang/es.js">//</script>
  <script type="text/javascript" src="{$vresource}lang/de.js">//</script>
  <script type="text/javascript" src="{$vresource}lang/it.js">//</script>
  <script type="text/javascript" src="{$vresource}lang/pt.js">//</script>
  <script type="text/javascript" src="{$vresource}lang/sk.js">//</script>
  <!-- *****End of delivery platform languages***** -->

  <!-- *****Add new languages for the editor to this section of code***** -->
  <script type="text/javascript" src="{$aveditdir}lang/en.js">//</script>
  <script type="text/javascript" src="{$aveditdir}lang/fr.js">//</script>
  <script type="text/javascript" src="{$aveditdir}lang/pt.js">//</script>
  <!-- *****End of editor languages***** -->
 </xsl:if>
 <xsl:if test="string-length($extension)=0">
 <xsl:for-each select="lang[node()!='en']">
  <script type="text/javascript" src="{$vresource}lang/{node()}.js">//</script>
 </xsl:for-each>
 </xsl:if>
</xsl:template>

<xsl:template match="version">
</xsl:template>

<xsl:template match="videos">
 <xsl:for-each select="avlang">
  <xsl:variable name="langname"><xsl:value-of select="@name" /></xsl:variable>
  <xsl:variable name="varname">avLang_<xsl:value-of select="$langname" /></xsl:variable>
  var <xsl:value-of select="$varname" />=new Array();
  <xsl:for-each select="times/index">
   <xsl:if test="node()">
    <xsl:value-of select="$varname" />[<xsl:value-of select="@pos" />]=<xsl:value-of select="." />;
   </xsl:if>
  </xsl:for-each>
  addAVLang("<xsl:value-of select="$langname" />", <xsl:value-of select="$varname" />);
  <xsl:for-each select="avsrc">
  <xsl:variable name="avType"><xsl:value-of select="type" /></xsl:variable>
  <xsl:if test="$avType='JavaLiveCapture'">
  if (editing)</xsl:if>
  <xsl:if test="$avType='FlashLiveCapture'">
  if (editing)</xsl:if>
  addAVSource("<xsl:value-of select="$langname" />", new <xsl:value-of select="$avType" />("<xsl:value-of select="url" />", <xsl:value-of select="speed" />, <xsl:value-of select="monitor" />));</xsl:for-each>
 </xsl:for-each>
</xsl:template>

<xsl:template match="slides">
 <xsl:for-each select="slidelang">
  <xsl:variable name="langname"><xsl:value-of select="@name" /></xsl:variable>
  <xsl:variable name="varname">slideLang_<xsl:value-of select="$langname" /></xsl:variable>
  var <xsl:value-of select="$varname" />=new Array();
  <xsl:for-each select="titles/title">
   <xsl:value-of select="$varname" />[<xsl:value-of select="@pos" />]="<xsl:value-of select="." />";
  </xsl:for-each>
  addSlideLang("<xsl:value-of select="$langname" />", <xsl:value-of select="$varname" />);
  <xsl:for-each select="slidesrc">
  addSlideSource("<xsl:value-of select="$langname" />", new <xsl:value-of select="type" />("<xsl:value-of select="url" />", "<xsl:value-of select="imgtype" />"));</xsl:for-each>
 </xsl:for-each>
</xsl:template>

<xsl:template match="subtitles">
 <xsl:for-each select="sublang">
  <xsl:variable name="langname"><xsl:value-of select="@name" /></xsl:variable>
  <xsl:variable name="varname">subLang_<xsl:value-of select="$langname" /></xsl:variable>
  var <xsl:value-of select="$varname" />=new Array();
  <xsl:for-each select="times/index">
   <xsl:if test="node()">
    <xsl:value-of select="$varname" />[<xsl:value-of select="@pos" />]=<xsl:value-of select="." />;
   </xsl:if>
  </xsl:for-each>
  <xsl:variable name="varnamelink">subLangLink_<xsl:value-of select="$langname" /></xsl:variable>
  var <xsl:value-of select="$varnamelink" />=new Array();
  <xsl:for-each select="slidelink/index">
   <xsl:if test="node()">
    <xsl:value-of select="$varnamelink" />[<xsl:value-of select="@pos" />]=<xsl:value-of select="." />;
   </xsl:if>
  </xsl:for-each>
  addSubtitleSource("<xsl:value-of select="$langname" />", "<xsl:value-of select="url" />", <xsl:value-of select="$varname" />, <xsl:value-of select="$varnamelink" />);
 </xsl:for-each>
</xsl:template>

<xsl:template match="options">
  setAutoStart(<xsl:value-of select="autostart" />);
  setVideoPosition(<xsl:value-of select="videoposition" />);
  setThumbnailsActive(<xsl:value-of select="thumbnailsactive" />);
  <xsl:variable name="subact"><xsl:value-of select="subtitlesactive" /></xsl:variable>
  <xsl:if test="string-length($subact) &gt; 0">
  setSubtitlesActive(<xsl:value-of select="subtitlesactive" />);
  </xsl:if>
  <xsl:variable name="pas"><xsl:value-of select="pauseafterslide" /></xsl:variable>
  <xsl:if test="string-length($pas) &gt; 0">
  setPauseAfterSlide(<xsl:value-of select="pauseafterslide" />);
  </xsl:if>
  <xsl:variable name="aspect"><xsl:value-of select="videoaspect" /></xsl:variable>
  <xsl:if test="string-length($aspect) &gt; 0">
  setVideoAspect(<xsl:value-of select="videoaspect" />);
  </xsl:if>
  <xsl:variable name="dwnBtn"><xsl:value-of select="downloadbutton" /></xsl:variable>
  <xsl:if test="string-length($dwnBtn) &gt; 0">
  setDownloadButton(<xsl:value-of select="$dwnBtn" />);
  </xsl:if>
</xsl:template>

<xsl:template match="controls">
  setControlVisibility(<xsl:value-of select="video" />, <xsl:value-of select="slide" />, <xsl:value-of select="subtitle" />, <xsl:value-of select="lang" />, <xsl:value-of select="position" />, <xsl:value-of select="slidemenu" />, <xsl:value-of select="thumbnail" />, <xsl:value-of select="other" />,
   <xsl:choose><xsl:when test="string-length(exit) &gt; 0"><xsl:value-of select="exit" /></xsl:when><xsl:otherwise>false</xsl:otherwise></xsl:choose>);
</xsl:template>

</xsl:stylesheet>

