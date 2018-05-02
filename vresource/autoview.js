/*************************************************************************

   Copyright: EuroMotor-AutoTrain LLP 2007 onwards

   License: GPLv3

   Authors: Tim Williams (tmw@autotrain.org)

*************************************************************************/

/*****Video types*****/

var VIDEO_NONE=0;
var VIDEO_FLASH=6;
var VIDEO_HTML5=9;

var SPEED_NONE=0;
var SPEED_MODEM=1;
var SPEED_BROAD=2;
var SPEED_STREAM=3;

/*****Slide types*****/

var SLIDE_NONE=0;
var SLIDE_IMAGE=1;
var SLIDE_IMAGE_PRELOAD=2;
var SLIDE_OOFLASH=3;
var SLIDE_PDF=4;
var SLIDE_AVFLASH=5;
var SLIDE_SEPFLASH=6;

/*****Browser detection vars*****/
var ieSpoof=false;
var browser, browserVersion=-1, ostype;

var OTHER=0;
var LINUX=1, WINDOWS=2, SUNOS=3, APPLEMAC=4, SYMBIAN=5, ANDROID=6, IOS=7;
var MOZILLA=1, MSIE=2, OPERA=3, KONQUEROR=4, SAFARI=5, CHROME=6;

var mobileDevice=false;
var tabletDevice=false;

/*****Some Standard Variables*****/

var VERSION="3.3";

var VIDEOLEFT=false;
var VIDEORIGHT=true;

var videoPosition=VIDEOLEFT;
var pauseAfterSlide=false;

var message="<h1 style=\"text-align:center\"><a href=\"http://www.autotrain.org\" target=\"_blank\">"+
 "AutoView</a></h1>";
var vresourcePath="../vresource/";

var videoWidth=0.22;
var videoHeight=1;
var videoAspect=0.75;

var slideAspect=0.75;
// Widths of all slide images provided
var widths = new Array(160,512,640,800);
// Heights of all slide images provided
var heights = new Array(120,384,480,600);
var thumbProportion=0.12;

var subtitleHeight=70;
var exitURL="";
var autoStart=true, autoStartDefault=true;
var editing=false;
var xmlSubtitle="";
var baseRef="";
var baseRefSet=false;
var saveCookieID="";

var flashServer="", flashHost="", flashCapture="", flashAuthUrl=document.URL;;
var preferedLang="en";
var user="";
var presentationLoaded=false;

/*****Internal variables*****/

var avSrc=new Array();
var allSlideSrc=new Array();
var times=new Array();
var subTimes=new Array();
var titles=new Array();
var subtitleSrc=new Array();
var subtitleSlideLink=new Array();
var subtitles=new Array();
var lang=new Array();
var langRTL=new Array();

var selectedAVSource, selectedSlides;
var currentSlide=1, currentSubtitle=1;
var frameWidth, frameHeight;
var selectedLang, avLang, slideLang, subtitleLang;
var avWidth, avHeight, slideWidth, slideHeight, slideScale, slideAreaWidth, controlHeight, thumbWidth, thumbHeight;
var thumbImageWidth, thumbImageHeight, subtitleWidth, subtitleHeight;
var fullLangOptions=false, fullVideoOptions=false, fullSlideOptions=false, subtitlesActive=false, slideSync=true, subSync=true; thumbnailsActive=false;
var thumbnailsActiveDefault=false, noSuitableSlides=false, noSuitableThumbnails=true, subtitlesActiveDefault=false;
var langList;
var videoSet=false, slideSet=false, subtitleSet=false;
var monitor;
var flashInteract=false;
var hideVideo=false;
var popupSlideWindow;
var fixPos=false;

var showVideoControls=true, showSlideControls=true, showSubtitleControls=true, showLanguageControls=true, showPositionControls=true,
    showSlideMenu=true, showOtherControls=true, showThumbnailControls=true, alwaysHideExit=false, downloadButton=false;

/*****The standard HTML layouts*****/

function printFullHTML()
{
 printExtraHTML();

 var messageBox="    <td class=\"messagebox\"><div id=\"message\"></div></td>\n";

 var controlBar="    <td class=\"controlbarbox\">\n"+
  "     <table cellspacing=\"0\" cellpadding=\"0\" class=\"controlbarcontainer\"><tr>\n"+
  "      <td><div id=\"extrabuttons\"></div></td>\n"+
  "      <td align=\"center\"><div id=\"messageblock\"></div></td>\n"+
  "      <td align=\"right\"><div id=\"slidemenu\"></div></td>\n"+
  "     </tr></table>\n"+
  "    </td>\n";

 var videoColumn="    <td class=\"videocolumn\" align=\"center\" style=\"height:"+slideHeight+"\">\n"+
  "     <table><tr><td align=\"left\">\n"+
  "      <div id=\"videoplayer\"></div>\n"+
  "      <div id=\"controldiv\" style=\"overflow:auto;width:"+avWidth+"px;min-height:80px;max-height:"+controlHeight+"px;overflow-x:hidden;\" >\n"+
  "       <div id=\"thumbnailcontrol\"></div>\n"+
  "       <div id=\"subtitlecontrols\"></div>\n"+
  "       <div id=\"positioncontrol\"></div>\n"+
  "       <div id=\"language\"></div>\n"+
  "       <div id=\"videocontrols\"></div>\n"+
  "       <div id=\"slidecontrols\"></div>\n"+
  "      </div>\n"+
  "     </td></tr></table>\n"+
  "    </td>\n";

 var thumbs="      <td valign=\"top\"><div id=\"thumbnails\"></div></td>\n";

 var slidesSubtitles="    <td class=\"slides_subtitles\">\n"+
  "     <table cellspacing=\"1\" cellpadding=\"0\" align=\"center\" width=\"100%\"><tr>\n";
 if (videoPosition==VIDEORIGHT)
  slidesSubtitles=slidesSubtitles+thumbs;
 slidesSubtitles=slidesSubtitles+"      <td valign=\"top\"><div id=\"slides\"></div></td>\n";
 if (videoPosition==VIDEOLEFT)
  slidesSubtitles=slidesSubtitles+thumbs;
 slidesSubtitles=slidesSubtitles+
  "     </tr><tr>\n"+
  "      <td colspan=\"2\"><div id=\"subtitles\"></div></td>\n"+
  "     </tr></table>\n"+
  "    </td>\n";

 document.writeln("  <table summary=\"structure\" class=\"display\">\n");

 if (videoPosition==VIDEOLEFT)
  document.writeln("   <tr>\n"+messageBox+controlBar+"   </tr>\n"+
   "   <tr>\n"+videoColumn+slidesSubtitles+"   </tr>\n");
 else
  document.writeln("   <tr>\n"+controlBar+messageBox+"   </tr>\n"+
   "   <tr>\n"+ slidesSubtitles+videoColumn+"   </tr>\n");

 document.writeln("  </table>");
}

function printStandaloneHTML()
{
 printExtraHTML();

 if (subtitleSet)
 {
  if (browser==SAFARI)
   document.writeln("<br />");

  document.writeln("  <div align=\"center\" style=\"min-height:"+avHeight+"px;\">\n"+
   "  <table class=\"display-noslides\" summary=\"Layout table\"><tr>\n"+
   "   <td valign=\"top\" align=\"center\" width=\"210\"><div id=\"message\"></div></td>\n"+
   "   <td align=\"center\" rowspan=\"2\"><div id=\"videoplayer\"></div></td>\n"+
   "   <td valign=\"top\" align=\"left\" width=\"210\">\n"+
   "    <div id=\"extrabuttons\"></div>\n"+
   "    <div id=\"positioncontrol\"></div>\n"+
   "    <div id=\"subtitlecontrols\"></div>\n"+
   "    <div id=\"language\"></div>\n"+
   "    <div id=\"videocontrols\"></div>\n"+
   "   </td>\n"+
   "  </tr><tr>\n"+
   "   <td align=\"center\" valign=\"top\">&nbsp;</td>\n"+
   "   <td align=\"center\" valign=\"top\">&nbsp;</td>\n"+
   "  </tr><tr>\n"+
   "   <td align=\"center\" valign=\"top\" colspan=\"3\"><div id=\"subtitles\"></div></td>\n"+
   "  </tr></table></div>\n");
 }
 else
 {
  document.writeln("<div align=\"center\" style=\"min-height:"+avHeight+"px;\">\n"+
   "<table class=\"display-noslides\" summary=\"Layout table\"><tr>\n");
  if (videoPosition==VIDEOLEFT)
    document.writeln("   <td align=\"center\"><div id=\"videoplayer\"></div></td>\n");

  document.writeln("   <td valign=\"top\" align=\"left\">\n"+
   "    <div id=\"message\"></div><br />\n"+
   "    <div id=\"extrabuttons\" align=\"center\"></div>\n"+
   "    <div id=\"positioncontrol\"></div>\n"+
   "    <div id=\"subtitlecontrols\"></div>\n"+
   "    <div id=\"language\"></div>\n"+
   "    <div id=\"videocontrols\"></div>\n"+
   "   </td>\n");

  if (videoPosition==VIDEORIGHT)
    document.writeln("   <td align=\"center\"><div id=\"videoplayer\"></div></td>\n");

  document.writeln("  </tr>\n"+
   " </table></div>\n");
 }
}

function printMobileHMTL()
{
 printExtraHTML();
 if (frameWidth<frameHeight)
 {
  document.writeln(
   "<table class=\"display-noslides\"><tr>\n"+
   " <td>\n"+
   "  <div id=\"message\"></div>"+
   " </td>\n"+
   "</tr><tr>\n"+
   " <td style=\"text-align:right\">\n"+
   "  <div id=\"extrabuttons\"></div>\n"+
   " </td>\n"+
   "</tr><tr>\n"+
   " <td>\n"+
   "  <div id=\"videoplayer\"></div>\n"+
   " </td>\n"+
   "</tr><tr>\n");

  if (slideSet)
   document.writeln(
    " <td>\n"+
    "  <div id=\"slides\"></div>\n"+
    "  <div id=\"slidemenu\"></div>\n"+
    " </td>\n"+
    "</tr><tr>\n");

  document.writeln(" <td>\n"+
   "  <div id=\"language\"></div>\n"+
   "  <div id=\"videocontrols\"></div>\n"+
   " </td>\n"+
   "</tr></table><br />");
 }
 else
 {
  if (slideSet)
   document.writeln(
    "<table class=\"display-noslides\"><tr>\n"+
    " <td>\n"+
    "  <div id=\"message\"></div>\n"+
    " </td><td>\n"+
    "  <div id=\"extrabuttons\"></div>\n"+
    " </td><td>\n"+
    "  <div id=\"slidemenu\"></div>\n"+
    " </td>\n"+
    "</tr><tr>\n"+
    " <td colspan=\"2\">\n"+
    "  <div id=\"videoplayer\"></div>\n"+
    " </td>\n"+
    " <td>\n"+
    "  <div id=\"slides\"></div>\n"+
    " </td>\n"+
    "</tr><tr>\n"+
    " <td>\n"+
    "  <div id=\"language\"></div>\n"+
    "  <div id=\"videocontrols\"></div>\n"+
    " </td>\n"+
    "</tr></table><br />");
  else
   document.writeln(
    "<table class=\"display-noslides\"><tr>\n"+
    "<tr>\n"+
    " <td rowspan=\"3\">\n"+
    "  <div id=\"videoplayer\"></div>\n"+
    " </td>\n"+
    " <td style=\"height:10%;\">\n"+
    "  <div id=\"message\"></div><br />"+
    " </td>\n"+
    "</tr><tr>\n"+
    " <td style=\"height:10%;text-align:center;\">\n"+
    "  <div id=\"extrabuttons\"></div>\n"+
    " </td>\n"+
    "</tr><tr>\n"+
    " <td>\n"+
    "  <div id=\"language\"></div>\n"+
    "  <div id=\"videocontrols\"></div><br />&nbsp;\n"+
    " </td>\n"+
    "</tr></table><br />");
 }
}

function printExtraHTML()
{
 document.writeln("<iframe class=\"hiddenframe\" name=\"jsFileLoader\"></iframe>\n");
}

/*****Methods for popup slides window*****/

function popupSlides()
{
 if (popupSlideWindow!=null)
  popupSlideWindow.close();

 popupSlideWindow=window.open(vresourcePath+"popupslides.html", "_blank", 
  "width=800,height=600,toolbar=no,menubar=yes,scrollbars=no,resizable=yes,status=no,location=no");
}

/*****Methods for changing default parameters*****/

function findBaseRef()
{
 var docURL=document.URL;

 /**IE uses \ instead of / if we are running on the local file system, which mucks things up.
    so convert all the \'s to / **/
 if (document.URL.indexOf("file:/")>-1 && browser==MSIE)
 {
  var nDocURL=docURL.replace("\\", "/");
  while(docURL!=nDocURL)
  {
   docURL=nDocURL;
   nDocURL=docURL.replace("\\", "/");
  }
 }

 var i=docURL.lastIndexOf("/");
 if (i>0)
  return docURL.substring(0, i+1);

 return "";
}

function setBaseRef(b)
{
 baseRef=b;
 baseRefSet=true;
}

function setVresourcePath(v)
{
 vresourcePath=v;
}

function setVideoPosition(p)
{
 videoPosition=p;
}

function setVideoSize(w,h)
{
 videoWidth=w;
 videoHeight=h;
}

function setVideoAspect(a)
{
 videoAspect=a;
}

function setSlideAspect(a)
{
 slideAspect=a;
}

function setDownloadButton(a)
{
 downloadButton=a;
}

function useLegacySlideSizes()
{
 //****Legacy slide sizes for old presentations*****
 widths = new Array(400, 480, 512, 600, 640, 768, 800, 960);
 heights = new Array(300, 360, 384, 450, 480, 576, 600, 768);
}

function setSlideSizes(w,h)
{
 widths=w;
 heights=h;
}

function setSubtitleHeight(h)
{
 subtitleHeight=h;
}

function setExitURL(e)
{
 exitURL=e;
}

function setAutoStart(a)
{
 autoStartDefault=a;
 autoStart=a;
}

function setPauseAfterSlide(p)
{
 pauseAfterSlide=p;
}

/**Do I need to take this out?**/
function setMessage(m)
{
 message=m;
}

function setControlVisibility(video, slides, subtitles, language, position, slideMenu, thumbnail, other, exit)
{
 showVideoControls=video;
 showSlideControls=slides;
 showSubtitleControls=subtitles;
 showLanguageControls=language;
 showPositionControls=position;
 showSlideMenu=slideMenu;
 showThumbnailControls=thumbnail;
 showOtherControls=other;
 alwaysHideExit=exit;
}

function setThumbnailsActive(t)
{
 thumbnailsActiveDefault=t;
 thumbnailsActive=t;
}

function setThumbProportion(p)
{
 thumbProportion=p;
}

function setSubtitlesActive(t)
{
 if (typeof(t)=="undefined")
  t=false;
 subtitlesActiveDefault=t;
 subtitlesActive=t;
}

function setXMLSubtitle(xsub)
{
 xmlSubtitle=xsub;
}

function setFlashParams(fs, fh, fc)
{
 flashHost=fh;
 flashServer=fs;
 flashCapture=fc;
}

function setFlashAuthUrl(au)
{
 flashAuthUrl=au;
}

function setUser(u)
{
 user=u;
}

function setPreferedLang(pfl)
{
 preferedLang=pfl;
}

function setSaveCookieID(scid)
{
 saveCookieID=scid;
}

/*****Initial language set up*****/

function initLang()
{
 langList=findValidLangs(lang);
 if (langList.length==0)
  showMessage("No languages have been configured.");

 chooseLanguage();
}

/*****Config setup*****/

function addAVLang(lang, tm)
{
 if (testLang(lang, "avlangerror"))
 {
  avSrc[lang]=new Array();
  if (typeof(tm)!="undefined" && tm!=null)
   times[lang]=tm;
  else
  {
   if (typeof(times[lang])=="undefined")
    times[lang]=new Array();
  }
 }
}

function addAVSource(lang, source)
{
 if (typeof(source.url)=="undefined")
 {
  // If this is missing, the source is deprecated
  return -1;
 }

 if (typeof(avSrc[lang])=="undefined")
 {
  showMessage(getString("averror")+"\n\n'"+lang+"' "+getString("novideolang"));
  return -1;
 }
 else
 {
  videoSet=true;
  return avSrc[lang].push(source)-1;
 }
}

function addSubtitleSource(lang, source, st, slideLink)
{
 if (testLang(lang, "suberror"))
 {
  subtitleSrc[lang]=source;
  subtitleSet=true;

  if (typeof(st)=="undefined")
   subTimes[lang]=new Array();
  else
   subTimes[lang]=st;

  if (typeof(slideLink)=="undefined")
   subtitleSlideLink[lang]=new Array();
  else
   subtitleSlideLink[lang]=slideLink;
 }
}

function addSlideLang(lang, tt)
{
 if (testLang(lang, "slidelangerror"))
 {
  allSlideSrc[lang]=new Array();
  titles[lang]=tt;
 }
}

function addSlideSource(lang, source)
{
 if (typeof(allSlideSrc[lang])=="undefined")
 {
  showMessage(getString("slideerror")+"\n\n'"+lang+"' "+getString("noslidelang"));
  return -1;
 }
 else
 {
  slideSet=true;
  if (source.type==SLIDE_IMAGE_PRELOAD || source.type==SLIDE_IMAGE)
   noSuitableThumbnails=false;

  return allSlideSrc[lang].push(source)-1;
 }
}

function getSyncSlides(lang)
{
 var x=new Array();
 for (var n in allSlideSrc[lang])
 {
  var source=allSlideSrc[lang][n];
  if(source.synchronisable)
   x.push(source);
 }
 return x;
}

function getPrintableSlides(lang)
{
 var x=new Array();
 for (var n in allSlideSrc[lang])
 {
  var source=allSlideSrc[lang][n];
  if(source.printable)
   x.push(source);
 }
 return x;
}

function testLang(lang, messageKey)
{
 var v=validLang(lang);
 if (v==false)
  showMessage(getString(messageKey)+"\n\n"+getString("language")+" '"+lang+"' "+
   getString("notavailable"));
 return v;
}

/*****Init Code*****/

function initPresentation(printHTML)
{
 if (typeof(printHTML)=="undefined")
  printHTML=true;

 detectBrowser();
 calculateFrameSize();

 /*****If there are no slides, increase the video size*****/
 if (slideSet==false && videoWidth<1)
  setStandaloneVideoSize();

 subtitleSettings();
 thumbnailSettings();

 if (baseRefSet==false)
  baseRef=findBaseRef();

 calculateDisplaySize();

 if (printHTML)
 {
  if (mobileDevice)
   printMobileHMTL();
  else
  if (slideSet==false)
   printStandaloneHTML();
  else
   printFullHTML();
 }

 /*****Check what we got*****/
 detectPlugins();

 /*****Check language settings for data sources*****/
 checkLanguage();

 /*****Start everything up*****/
 chooseVideo();
 chooseSlides();

 allHTML();
 window.document.close();

 startMonitor();

 /*****Seems to be a bug in later versions of firefox which upsets subtitle loading if*****/
 /*****we don't do an initial subtitle load during the startup phase*****/
 if(typeof(subtitleSrc[subtitleLang])!="undefined")
  setTimeout("loadSubtitles()", 500);

 /*****If there are no slides, then trigger the slideLoadFinished method here to make sure autostart works*****/
 if (slideSet==false)
  slideLoadFinished();

 presentationLoaded=true;
}

function setStandaloneVideoSize()
{
 if (frameWidth>600)
  videoWidth=600;
 else
 if (frameWidth<160)
  videoWidth=160;
 else
  videoWidth=frameWidth-200;

 videoHeight=videoWidth*videoAspect;

 if (videoHeight>frameHeight-80)
 {
  videoWidth=frameHeight-80;
  videoHeight=videoWidth*videoAspect;
 }
}

/*****Subtitle settings*****/

function subtitleSettings()
{
 var subtitleCookie=getCookie("autoview3_subtitles");
 if (subtitleCookie!=null && findValidLangs(subtitleSrc).length>0)
  if (subtitleCookie=="true")
   subtitlesActive=true;
  else
   subtitlesActive=false;
}

/*****Subtitle settings*****/

function thumbnailSettings()
{
 var thumbCookie=getCookie("autoview3_thumbs");
 if (noSuitableThumbnails==false)
  if (thumbCookie=="true")
   thumbnailsActive=true;
  else
   thumbnailsActive=false;
}

/*****Language functions*****/

function chooseLanguage()
{
 /*****Use selection in cookie by default*****/
 //var playerCookie=getCookie("autoview3_lang");
 //if (playerCookie!=null && setLang(playerCookie))
 // return;

 /*****See if the containing platform has specified a prefered language*****/
 if (preferedLang.length>0 && setLang(preferedLang))
  return;

 /*****Try browser language*****/
 var languageinfo=navigator.language? navigator.language : navigator.userLanguage;

 if (setLang(navigator.language+" "+navigator.userLanguage))
  return;

 /*****Try again without dialect codes*****/
 var p=languageinfo.indexOf("-");
 if (p==-1)
  p=languageinfo.indexOf("_");
 if (p>-1)
 {
  var sl=languageinfo.substring(0,p);
  if (setLang(sl))
   return;
 }

 /*****Everything else has failed, so use the first language in the list*****/
 selectedLang=langList[0];
}

function setLang(l)
{
 for (var loop=0; loop<langList.length; loop++)
  if (langList[loop]==l)
  {
   selectedLang=langList[loop];
   return true;
  }

 return false;
}

function checkLanguage()
{
 if (typeof(avSrc[selectedLang])=="undefined")
  avLang=findValidLangs(avSrc)[0];
 else
  avLang=selectedLang;

 if (typeof(allSlideSrc[selectedLang])=="undefined")
  slideLang=findValidLangs(allSlideSrc)[0];
 else
  slideLang=selectedLang;

 if (typeof(subtitleSrc[selectedLang])=="undefined")
  subtitleLang=findValidLangs(subtitleSrc)[0];
 else
  subtitleLang=selectedLang;
}

function getString(id)
{
 return getLangString(selectedLang, id);
}

function getLangString(s, id)
{
 if (typeof(lang[s][id])!="undefined")
  return lang[s][id];

 for (var loop=0; loop<langList.length; loop++)
  if (typeof(lang[langList[loop]][id])!="undefined")
   return lang[langList[loop]][id];

 return s+":"+id+" not found";
}

function validLang(toTest)
{
 for (var loop=0; loop<langList.length; loop++)
  if (langList[loop]==toTest)
   return true;

 return false;
}

function findValidLangs(toCheck)
{
 var validLangs=new Array();
 for (var n in toCheck)
  validLangs.push(n);

 return validLangs;
}

/*****Element sizes*****/

function calculateSizes()
{
 calculateFrameSize();
 calculateDisplaySize();
}

function calculateFrameSize()
{
 /*****Get correct inner window size. IE works both differently and inconsistently compared to other browsers*****/
 if (mobileDevice)
 {
  frameWidth=screen.width;
  frameHeight=screen.height;
 }
 else if( typeof( window.innerWidth ) == 'number' )
 {
  //Non-IE
  frameWidth = window.innerWidth;
  frameHeight = window.innerHeight;
 }
 else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
 {
  //IE 6+ in 'standards compliant mode'
  frameWidth = document.documentElement.clientWidth;
  frameHeight = document.documentElement.clientHeight;
 }
 else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) )
 {
  //IE 4 compatible
  frameWidth = document.body.clientWidth;
  frameHeight = document.body.clientHeight;
 }

 //alert(frameWidth+" "+frameHeight);
}

function calculateDisplaySize()
{
 if (mobileDevice)
 {
  if (frameWidth<frameHeight)
  {
   avWidth=parseInt(frameWidth*0.92);
   avHeight=parseInt(avWidth*videoAspect);
   slideWidth=avWidth;
   slideHeight = parseInt(slideWidth * slideAspect);
   slideScale=2;
  }
  else
  {
   if (slideSet)
   {
    avWidth=parseInt(frameWidth*0.45);
    avHeight=parseInt(avWidth*videoAspect);
    slideHeight = avHeight+22;
    slideWidth=parseInt(slideHeight/slideAspect);
    slideScale=2;
   }
   else
   {
    avHeight=parseInt(frameHeight*0.92);
    avWidth=parseInt(avHeight/videoAspect);
   }
  }
  return;
 }

 if (videoWidth>1)
 {
  avWidth=videoWidth;
  avHeight=videoHeight;
 }
 else
 {
  /*****Calculate video size based on a proportion of screen size*****/
  avWidth=parseInt(frameWidth*videoWidth);
  avHeight=parseInt(avWidth*videoAspect);
 }

 var availableWidth = parseInt((frameWidth-avWidth)/1.08);
 var availableHeight = parseInt(frameHeight/1.13);
 slideAreaWidth=availableWidth;

 if (subtitlesActive)
  availableHeight=availableHeight-subtitleHeight;

 subtitleWidth=availableWidth;
 if (slideSet==false)
 {
  subtitleWidth=avWidth+420;
  if (subtitleWidth>frameWidth-40)
   subtitleWidth=frameWidth-40;
 }

 if (thumbnailsActive)
 {
  thumbWidth=parseInt(availableWidth*thumbProportion);
  thumbImageWidth=thumbWidth-26;
  thumbImageHeight=thumbImageWidth*0.75;
  availableWidth=availableWidth-thumbWidth;
 }

 if ((availableWidth * slideAspect) < availableHeight)
 {
  slideWidth = availableWidth;
  slideHeight = parseInt(availableWidth * slideAspect);
  setSlideScale(slideWidth, true);
 }
 else
 {
  slideHeight = availableHeight;
  if (browser==MSIE && subtitlesActive)
   slideHeight=slideHeight-4;
  slideWidth = parseInt(availableHeight / slideAspect);
  setSlideScale(slideHeight, false);
 }

 if (subtitlesActive)
  controlHeight=(slideHeight+subtitleHeight)-(avHeight+50);
 else
  controlHeight=slideHeight-(avHeight+50);

 thumbHeight=slideHeight;

 if (hideVideo)
  avHeight=0;  
}

function setSlideScale(dim, isWidth)
{
 var i = 1;
 if (isWidth)
 {
  while (i < widths.length && dim > widths[i])
   i++;
 }
 else
 {
  while (i < heights.length && dim > heights[i])
   i++;
 }

 slideScale = i;
}

/*****HTML Printing code*****/

function allHTML()
{
 setSlideHTML();
 setVideoHTML();
 setThumbnailHTML();
 almostAllHTML();
}

function almostAllHTML()
{
 setMessage();
 setPositionControl();
 setVideoControls();
 setSubtitleControls();
 setLanguageHTML();
 setExtraButtonsHTML();
 setSlideMenu();
 setSlideControls();
 setThumbnailControl();
 setSubtitleHTML();
}

function sizeChangeHTML()
{
 calculateSizes();
 var cd=document.getElementById("controldiv");
 if (cd!=null)
 {
  cd.style.width=avWidth+"px";
  cd.style.height=controlHeight+"px";
 }
 setSlideHTML();
 setVideoHTML();
 setThumbnailHTML();
 setSubtitleHTML();
}

function setThumbnailHTML()
{
 if (!thumbnailsActive || !showThumbnailControls)
 {
  setElementHTML("thumbnails", "");
  return;
 }

 /****Thumbnails occasionally aren't set in mozilla, things are probably happening to quickly, so set a small timeout*****/
 var thumbHTML=selectedSlides.getAllThumbnails();
 if (thumbHTML)
 {
  setElementHTML("thumbnails", "<iframe name=\"thumbnailsframe\" width=\""+thumbWidth+"\" height=\""+thumbHeight+"\" marginheight=\"0\" "+
  " frameborder=\"0\" marginwidth=\"0\" ></iframe>\n");
  //if (browser==MOZILLA)
  // setTimeout("getThumbnailsFrame().document.writeln(selectedSlides.getAllThumbnails());", 1000);
  //else
  getThumbnailsFrame().document.writeln(thumbHTML);
 }
 else
  setThumbnails(false);
}

function getThumbnailsFrame()
{
 /**Mozilla browsers seem to have a bug which causes the window.thumbnailsframe.document var to have no properties
    if an iframe is created after the initial startup.**/
 if (browser==MOZILLA)
 {
  for (var loop=0; loop<window.frames.length; loop++)
   if(window.frames[loop].name=="thumbnailsframe")
    return window.frames[loop];
 }
 else
 {
  return window.thumbnailsframe;
 }
}

function setVideoHTML()
{
 setElementHTML("videoplayer", selectedAVSource.getHTML());
}

function setLanguageHTML()
{
 if (langList.length<2 || showLanguageControls==false)
 {
  setElementHTML("language", "");
  return;
 }

 if (fullLangOptions)
 {
  var str="<table width=\"100%\" class=\"menulayout\"><tr>\n"+
   " <td colspan=\"3\" class=\"menulayoutcell\">"+
   "  <h2 align=\"left\"><a href=\"javascript:showFullLang(false);\" class=\"linkbuttonselected\""+
   " title=\""+getString("hidelangopts")+"\">-&nbsp;</a>&nbsp;"+
      getString("language")+"</h2>\n"+
   " </td>\n";

  str=str+getOptionForm(langList, "intlang", selectedLang, "langList", "setIntLanguage");
  var avl=findValidLangs(avSrc);
  if (avl.length>1)
   str=str+getOptionForm(avl, "avlang", avLang, "avlangList", "setAVLanguage");

  var sl=findValidLangs(allSlideSrc);
  if (sl.length>1)
   str=str+getOptionForm(sl, "slidelang", slideLang, "slidelangList", "setSlideLanguage");

  var subl=findValidLangs(subtitleSrc);
  if (subl.length>1)
   str=str+getOptionForm(subl, "sublang", subtitleLang, "subtitlelangList", "setSubtitleLanguage");

  str=str+"</tr></table>\n";

  setElementHTML("language", str);
 }
 else
 {
  var str="<table width=\"100%\" class=\"menulayout\">\n"+
   "<tr>\n"+
   " <td class=\"menulayoutcell\" width=\"50%\"><h2 align=\"left\"><a href=\"javascript:showFullLang(true);\" class=\"linkbutton\""+
   " title=\""+getString("showlangopts")+"\">+</a>&nbsp;"+
   getString("language")+"</h2></td>\n<td class=\"menulayoutcell\">"+
   getOptionForm2(langList, selectedLang, "langList", "setAllLanguages", "")+"\n"+
   "</td></tr></table>\n";

  setElementHTML("language", str);
 }
}

function getOptionForm(vLangs, message, chosen, formName, method)
{
 var str="";
 if (vLangs.length>0)
 {
  str=str+"</tr><tr>"+
   " <td class=\"menulayoutcell\"></td>\n"+
   " <td class=\"menulayoutcell\"><h3>"+getString(message)+"</h3></td>\n"+
   " <td class=\"menulayoutcell\" width=\"50%\">\n"+
   getOptionForm2(vLangs, chosen, formName, method);
   " </td>\n";
 }
 return str;
}

function getOptionForm2(vLangs, chosen, formName, method)
{
 var str="  <form name=\""+formName+"\" style=\"padding:0px;margin:0px;\">\n"+
   "   <select name=\"list\" class=\"langlisting\" onChange=\"javascript:"+method+"(this.options[this.selectedIndex].value);\">\n";

 for (var loop=0; loop<vLangs.length; loop++)
 {
  var selected="";
  if (vLangs[loop]==chosen)
   selected=" selected";
  str=str+"    <option value=\""+vLangs[loop]+"\""+selected+">"+getLangString(vLangs[loop],"langname")+"</option>\n";
 }

 str=str+"   </select>\n"+
  "  </form>\n";

 return str;
}

function setMessage()
{
 setElementHTML("message", message);
}

function setPositionControl()
{
 if (selectedAVSource.controllable()==false || showPositionControls==false)
 {
  setElementHTML("positioncontrol", "");
  return;
 }

 var positionCookie=getCookie("autoview3_position");
 var load="linkbutton";
 if (positionCookie==null)
  load="linkbuttongrey";

 var str="<table width=\"100%\" class=\"menulayout\"><tr>\n"+
  " <td align=\"left\" class=\"menulayoutcell\" width=\"50%\">\n"+
  "  <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+getString("savepostitle")+"</h2></td>\n"+
  " <td class=\"menulayoutcell\"><a class=\"linkbutton\" href=\"javascript:saveAVPosition();\""+
  "  title=\""+getString("savepositiontitle")+"\">"+getString("savepos")+"</a>&nbsp;"+
  "<a class=\""+load+"\" href=\"javascript:loadAVPosition();\""+
  "  title=\""+getString("loadpositiontitle")+"\">"+getString("loadpos")+"</a></td>\n"+
  "</tr></table>\n";

 setElementHTML("positioncontrol", str);
}

function setVideoControls()
{
 var dwnBtn="";
 if (downloadButton)
 {
  avurl=selectedAVSource.url;
  if (avurl.indexOf("$flashserver")<0 && avurl.indexOf("rtmp://")<0 && avurl.indexOf("rtsp://")<0)
   dwnBtn="<br/><span style=\"text-align:center;\"><a href=\""+selectedAVSource.url+"\" class=\"linkbutton\">"+getString("downloadbutton")+"</a></span>";
 }

 if (videoSet==false || avSrc[avLang].length<2 || showVideoControls==false)
 {
  setElementHTML("videocontrols", dwnBtn);
  return;
 }

 var str;
 if (fullVideoOptions)
 {
  var str="<table width=\"100%\" class=\"menulayout\"><tr>\n"+
   " <td colspan=\"2\" class=\"menulayoutcell\">"+
   "  <h2 align=\"left\"><a href=\"javascript:showFullVideo(false);\" title=\""+getString("hidevideoopts")+"\""+
   "   class=\"linkbuttonselected\">-&nbsp;</a>&nbsp;"+getString("video")+"</h2>\n"+
   " </td></tr>\n"+
   " <tr><td class=\"menulayoutcell\"><ul class=\"chooser\">\n";

  for (var loop=0; loop<avSrc[avLang].length; loop++)
  {
   str=str+" <li class=\"";

   if (avSrc[avLang][loop]==selectedAVSource)
    str=str+"chooserselected";
   else
    str=str+"chooserunselected";

   str=str+"\"><a href=\"javascript:setVideoSource("+loop+");\" class=";

   if (avSrc[avLang][loop].isValid())
    str=str+"\"valid\"";
   else
    str=str+"\"invalid\" title=\""+avSrc[avLang][loop].disableMessage()+"\"";

   str=str+">"+avSrc[avLang][loop].label()+"</a></li>\n";
  }
  str=str+" </ul></td>\n"+
   "</tr><tr>\n"+
   "<td><a href=\"javascript:setHideVideo(true);\" class=\"linkbutton\">"+getString("hidevideo")+"</a>&nbsp;"+
   "<a href=\"javascript:setHideVideo(false);\" class=\"linkbutton\">"+getString("showvideo")+"</a>"+dwnBtn+
   "</td>\n"+
   "</table>\n";
 }
 else
 {
  str="<table class=\"menulayout\"><tr><td class=\"menulayoutcell\"><h2><a href=\"javascript:showFullVideo(true);\""+
   " class=\"linkbutton\" title=\""+getString("showvideoopts")+"\">+</a>"+
   "&nbsp;"+getString("video")+"</h2></td></tr></table>";
 }

 setElementHTML("videocontrols", str);
}

function setSlideControls()
{
 var slideSrc=getSyncSlides(slideLang);

 if (slideSet==false || showSlideControls==false || (slideSrc.length<2 && videoWidth>1))
 {
  setElementHTML("slidecontrols", "");
  return;
 }

 var str;
 if(fullSlideOptions)
 {
  str="<table width=\"100%\" class=\"menulayout\">\n"+
   " <tr><td class=\"menulayoutcell\" colspan=\"2\">"+
   "  <h2 align=\"left\">"+
   "  <a href=\"javascript:showFullSlide(false);\" class=\"linkbuttonselected\""+
   " title=\""+getString("hideslideopts")+"\">-&nbsp;</a>&nbsp;"+
      getString("slideopts")+"</h2>\n"+
   " </td></tr>";

  if (slideSrc.length>1)
  {
   str=str+" <tr><td class=\"menulayoutcell\" colspan=\"2\"><ul class=\"chooser\">\n";

   for (var loop=0; loop<slideSrc.length; loop++)
   {
    str=str+" <li class=\"";

    if (slideSrc[loop]==selectedSlides)
     str=str+"chooserselected";
    else
     str=str+"chooserunselected";

    str=str+"\"><a href=\"javascript:setSlideSource("+loop+");\" class=";

    if (slideSrc[loop].isValid())
     str=str+"\"valid\"";
    else
     str=str+"\"invalid\" title=\""+getString("pluginnotfound")+"\"";

    str=str+">"+slideSrc[loop].label()+"</a></li>\n";
   }

   str=str+" </ul></td></tr>\n";
  }

  if (videoWidth<1)
   str=str+getSlideSizeCode();

   str=str+"</table>\n";
 }
 else
 {
  if (slideSrc.length==1)
   str="<table class=\"menulayout\" width=\"100%\">"+getSlideSizeCode()+"</table>";
  else 
   str="<table class=\"menulayout\"><tr><td class=\"menulayoutcell\"><h2><a href=\"javascript:showFullSlide(true);\""+
    " class=\"linkbutton\" title=\""+getString("showslideopts")+"\">+</a>"+
    "&nbsp;"+getString("slideopts")+"</h2></td></tr></table>";
 }

 setElementHTML("slidecontrols", str);
}

function getSlideSizeCode()
{
 return " <tr><td class=\"menulayoutcell\" width=\"50%\">\n"+
    "  <h2 align=\"left\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+getString("slidesize")+"</h2>\n"+
    " </td><td class=\"menulayoutcell\">\n"+
    "  <a href=\"javascript:increaseSlideSize();\" class=\"linkbutton\" title=\""+getString("incslidesize")+"\">+</a>&nbsp;"+
    "  <a href=\"javascript:decreaseSlideSize();\" class=\"linkbutton\" title=\""+getString("decslidesize")+"\">-</a>\n"+
    " </td></tr>\n";
}

function setThumbnailControl()
{
 if (showThumbnailControls==false)
 {
  setElementHTML("thumbnailcontrol", "");
  return;
 }

 if (!noSuitableThumbnails)
 {
  var ton="linkbutton";
  var toff="linkbuttonselected";
  if(thumbnailsActive)
  {
   toff="linkbutton";
   ton="linkbuttonselected";
  }

  var str="<table width=\"100%\" class=\"menulayout\"><tr><td class=\"menulayoutcell\" width=\"50%\" align=\"left\">\n"+
   "  <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+getString("thumbnails")+"</h2>\n"+
   " </td><td class=\"menulayoutcell\">\n"+
   "  <a href=\"javascript:setThumbnails(true);\" class=\""+ton+"\""+
   " title=\""+getString("thumbontitle")+"\">"+getString("on")+"</a>&nbsp;"+
   "<a href=\"javascript:setThumbnails(false);\" class=\""+toff+"\""+
   " title=\""+getString("thumbofftitle")+"\">"+getString("off")+"</a>\n"+
   " </td></tr></table>\n";

  setElementHTML("thumbnailcontrol", str);
 }
}

function setSubtitleControls()
{
 if (findValidLangs(subtitleSrc).length==0 || showSubtitleControls==false)
 {
  setElementHTML("subtitlecontrols", "");
  return;
 }

 var str="<table width=\"100%\" class=\"menulayout\"><tr>\n"+
  "<td align=\"left\" class=\"menulayoutcell\" width=\"50%\">\n"+
  " <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+getString("subtitle")+"</h2></td>\n"+
  "<td class=\"subtitlecontrolcell\">\n"+
  addSubtitleOption(subtitlesActive, "on", true)+
  "&nbsp;"+
  addSubtitleOption(!subtitlesActive, "off", false)+
  "</td></tr><tr><td class=\"menulayoutcell\"></td><td class=\"menulayoutcell\">"+
  "<a href=\"javascript:subtitleTranscript();\" class=\"linkbutton\""+
  " title=\""+getString("transcripttitle")+"\">"+getString("transcript")+"</a>\n"+
  "</td></tr></table>\n";

 setElementHTML("subtitlecontrols", str);
}

function addSubtitleOption(on, message, value)
{
 var c="linkbutton";
 if (on)
  c="linkbuttonselected";

 return "<a href=\"javascript:setSubtitlesOn("+value+");\" class=\""+c+"\" "+
 "title=\""+getString("sub"+message)+"\">"+getString(message)+"</a>";
}

function setSlideHTML()
{
 setElementHTML("slides", selectedSlides.getHTML());
}

function setExtraButtonsHTML()
{
 if (showOtherControls==false)
 {
  setElementHTML("extrabuttons", "");
  return;
 }

 var str="";
 if (exitURL.length>0 && alwaysHideExit==false)
  str=str+"<a href=\""+exitURL+"\" target=\"_top\" class=\"linkbutton\" title=\""+getString("exittitle")+"\">"
   +getString("exitpres")+"</a>&nbsp;";

 str=str+"<a href=\""+vresourcePath+"help/"+getString("helpurl")+"/index.html\" class=\"linkbutton\" "+
  "target=\"_blank\" title=\""+getString("helptitle")+"\">"+getString("help")+"</a>";

 setElementHTML("extrabuttons", str);
}

function setSlideMenu()
{
 if (slideSet==false || showSlideMenu==false)
 {
  setElementHTML("slidemenu", "");
  return;
 }

 var syncText=getString("slidesyncon");
 var syncTextTitle=getString("slidesyncontitle");
 if (slideSync==false || subSync==false)
 {
  syncText=getString("slidesyncoff");
  syncTextTitle=getString("slidesyncofftitle");

  if (slideSync!=subSync)
   syncText=syncText+"*";

 }
 var str="<table class=\"menulayout\"><tr>"+
  "<td valign=\"middle\" class=\"menulayoutcell\">\n"+
  "<a href=\"javascript:changeSync()\" class=\"linkbutton\" title=\""+syncTextTitle+"\">\n"+syncText+"</a>\n";

 var printSlideSrc=getPrintableSlides(slideLang);

 if (printSlideSrc.length>0)
  str=str+"<a href=\"javascript:allSlides();\" class=\"linkbutton\""+
   " title=\""+getString("allslidestitle")+"\">"+getString("allslides")+"</a>\n";

 str=str+"<a href=\"javascript:previousSlide();\" class=\"linkbutton\" title=\""+getString("prevtitle")+"\">&lt;</a>"+
  "</td><td valign=\"middle\" class=\"menulayoutcell\">\n"+
  "<form name=\"slideList\" style=\"padding:0px;margin:0px;\">\n"+
  "<select name=\"list\" class=\"slidelisting\" onChange=\"javascript:setSlide(this.selectedIndex+1,true);\">";

 for (var loop=0; loop<titles[slideLang].length; loop++)
 {
  var title=titles[slideLang][loop];
  if (mobileDevice)
   title=title.substring(0,11);
  str=str+" <option>"+(loop+1)+" : "+title+"</option>\n";
 }
 str=str+"</select>\n"+
  "</form>\n"+
  "</td><td valign=\"middle\" class=\"menulayoutcell\">\n"+
  "<a href=\"javascript:nextSlide();\" class=\"linkbutton\" title=\""+getString("nexttitle")+"\">&gt;</a>"+
  "</td></tr></table>\n";

 setElementHTML("slidemenu", str);
 if (typeof(window.document.slideList)!="undefined")
  window.document.slideList.list.selectedIndex=currentSlide-1;
}

function setSubtitleHTML()
{
 if (subtitlesActive==false || subtitleSet==false)
 {
  setElementHTML("subtitles", "");
  return;
 }

 var align="left";
 if (langRTL[subtitleLang]==true)
  align="right";

 var str="<div align=\"center\">"+
  "<table style=\"width:"+subtitleWidth+"px;height:"+subtitleHeight+"px;\" class=\"subtitletable\" summary=\"Subtitles\">"+
  " <tr>\n"+
  "  <td align=\"left\" width=\"25\">\n"+
  "   <a href=\"javascript:previousSubtitle();\" class=\"linkbutton\" title=\""+getString("prevsubtitle")+"\">&lt;</a>"+
  "  </td>\n"+
  "  <td align=\"center\" rowspan=\"3\">\n"+
  "   <table cellspacing=\"0\" cellpadding=\"2\"><tr><td align=\""+align+"\">\n"+
  "    <span id=\"subtitledisplay\" style=\"max-height:"+(subtitleHeight-8)+"px;max-width:"+(subtitleWidth-50)+"px;overflow:auto;\"></span>"+
  "   </td></tr></table>"+
  "  </td>\n"+
  "  <td align=\"right\" width=\"25\">\n"+
  "   <a href=\"javascript:nextSubtitle();\" class=\"linkbutton\" title=\""+getString("nextsubtitle")+"\">&gt;</a>"+
  "  </td>\n"+
  " </tr>\n"+
  "</table></div>";

 setElementHTML("subtitles", str);
 if (typeof(subtitles)!="undefined" && typeof(subtitles[currentSubtitle])!="undefined")
  setElementHTML("subtitledisplay", subtitles[currentSubtitle]);
}

function setElementHTML(name, html)
{
 var element=document.getElementById(name);
 if (element!=null)
 {
  if (typeof(html)!="undefined")
   if (html.length>0)
    element.style.display="block";
   else
    element.style.display="none";

  element.innerHTML=html;
 }
}

/*****Summary page code*****/

function allSlides()
{
 var found;
 var printSlideSrc=getPrintableSlides(slideLang);

 for (var loop=0; loop<printSlideSrc.length; loop++)
  if (printSlideSrc[loop].isValid())
  {
   found=printSlideSrc[loop];
   break;
  }

 if (typeof(found)!="undefined")
 {
  var exwin;
  exwin=window.open("","all_slides","width=700,height=500,status=yes,toolbar=yes,menubar=yes,scrollbars=yes,resizable=1");
  exwin.focus();
  found.getAllSlides(exwin);
  exwin.document.close();
 }
 else
  showMessage(getString("noprint"));
}

/*****Source choosing code*****/

function chooseVideo()
{
 if (videoSet==false)
 {
  selectedAVSource=new NoVideo();
  return;
 }

 /******Check to see if the user has a player preference and use if possible*****/
 var playerCookie=getCookie("autoview3_player");
 var speedCookie=getCookie("autoview3_speed");

 if (playerCookie!=null)
 {
  /*****Look for a matching AV and speed source*****/
  if (speedCookie!=null && speedCookie!=SPEED_NONE)
   for (var loop=0; loop<avSrc[avLang].length; loop++)
    if (avSrc[avLang][loop].isValid() && avSrc[avLang][loop].type==playerCookie && avSrc[avLang][loop].speed==speedCookie)
    {
     selectedAVSource=avSrc[avLang][loop];
     return;
    }

  /*****Look for a matching AV source*****/
  for (var loop=0; loop<avSrc[avLang].length; loop++)
   if (avSrc[avLang][loop].isValid() && avSrc[avLang][loop].type==playerCookie)
   {
    selectedAVSource=avSrc[avLang][loop];
    return;
   }
 }

 /*****Otherwise return the first valid source*****/
 for (var loop=0; loop<avSrc[avLang].length; loop++)
  if (avSrc[avLang][loop].isValid())
  {
   selectedAVSource=avSrc[avLang][loop];
   return;
  }

 if (typeof(selectedAVSource)=="undefined")
 {
  showMessage(getString("novideosource"));
  selectedAVSource=avSrc[avLang][0];
 }
}

function findSourcesByType(list,type)
{
 for (var loop=0; loop<avSrc[avLang].length; loop++)
 {
  if (avSrc[avLang][loop].type==type && avSrc[loop].valid())
   return avSrc[avLang][loop];
 }

 return null;
}

function chooseSlides()
{
 if (slideSet==false)
 {
  selectedSlides=new NoSlide();
  return;
 }
 var slideSrc=getSyncSlides(slideLang);
 var slideCookie=getCookie("autoview3_slides");
 if (slideCookie!=null)
  for (var loop=0; loop<slideSrc.length; loop++)
   if (slideSrc[loop].isValid() && slideSrc[loop].type==slideCookie)
   {
    selectedSlides=slideSrc[loop];
    return;
   }

 for (var loop=0; loop<slideSrc.length; loop++)
  if (slideSrc[loop].isValid())
  {
   selectedSlides=slideSrc[loop];
   return;
  }

 selectedSlides=slideSrc[0];
 noSuitableSlides=true;
 showMessage(getString("noslidesource"));
}

/*****Call this method if a slide format fails for some reason and is disabled*****/

function reChooseSlides()
{
 if (noSuitableSlides)
  return;

 chooseSlides();
 setSlideHTML();
 setSlideMenu();
 setCookie("autoview3_slides", selectedSlides.type, null);
}

/*****Subtitle Stuff*****/

function setSubtitleStrings(s)
{
 var last=currentSubtitle;
 subtitles=s;
 jsFileLoader.document.close();
 setElementHTML("subtitledisplay", subtitles[currentSubtitle]);
 if (editing)
  subtitleChanged(last);
}

function setSubtitleIfSync(pos, moveSlide)
{
 if (subSync==false)
  return;

 setSubtitle(pos, moveSlide);
}

function setSubtitle(pos, moveSlide)
{
 if (!subtitlesActive)
  return;

 var last=currentSubtitle;
 if (pos>=subtitles.length)
  pos=subtitles.length-1;

 if (pos<1)
  pos=1;

 if (currentSubtitle==pos)
  return;

 currentSubtitle=pos;
 setElementHTML("subtitledisplay", subtitles[pos]);

 if (moveSlide && subtitleSlideLink[subtitleLang].length!=0 && currentSubtitle-1<subtitleSlideLink[subtitleLang].length)
  setSlide(subtitleSlideLink[subtitleLang][currentSubtitle-1], false);

 if (moveSlide && subSync && subTimes[subtitleLang].length!=0 && currentSubtitle-1<subTimes[subtitleLang].length && 
   selectedAVSource.useTimeMonitor()==true)
 {
  var ss=slideSync;
  slideSync=false;
  if (currentSubtitle==1)
   selectedAVSource.setPosition(1);
  else
   selectedAVSource.setPosition(subTimes[subtitleLang][currentSubtitle-1]);
  slideSync=ss;
 }

 if (editing)
  subtitleChanged(last);
}

function loadSubtitles()
{
 if (subtitleSrc[subtitleLang].indexOf(".js")>0)
 {
  jsFileLoader.document.open();
  jsFileLoader.document.writeln("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" "+   
   "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
  jsFileLoader.document.writeln("<html><head>");
  jsFileLoader.document.writeln("<script language=\"JavaScript\"");
  jsFileLoader.document.writeln(" src=\""+baseRef+subtitleSrc[subtitleLang]+"\" type=\"text\/javascript\">");
  jsFileLoader.document.writeln("<\/script><\/head><body><\/body><\/html>");
 }
 else
 if (subtitleSrc[subtitleLang].indexOf(".avs")>0)
 {
  jsFileLoader.location.assign(xmlSubtitle+subtitleSrc[subtitleLang]);
 }
 else
 if (subtitleSrc[subtitleLang].indexOf(".html")>0)
 {
  jsFileLoader.location.assign(subtitleSrc[subtitleLang]);
 }
}

function subtitleTranscript()
{
 if (typeof(subtitles)=="undefined")
  showMessage("No subtitles found");

 var exwin=window.open("","av_transcript","width=750,height=550,status=yes,toolbar=no,menubar=no,scrollbars=yes,resizable=1");
 exwin.focus();

 exwin.document.writeln("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" "+   
  "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");

 exwin.document.writeln("<html>\n"+
  "<head>\n"+
  "<link type=\"text/css\" rel=\"stylesheet\" href=\""+vresourcePath+"transcript.css\" />"+
  "<title>"+getString("transcript")+"<\/title>\n"+
  "<\/head>\n"+
  "<body>\n"+
  "<h1 align=\"center\">"+document.title+"<\/h1>\n");

 if (selectedSlides.type!=SLIDE_NONE)
 {

  exwin.document.writeln(getTranscriptSlideHeader(1));

  var lastSlide=1;
  for (var loop=1; loop<subtitles.length; loop++)
  {
   var pos=subTimes[subtitleLang][loop-1];
   if (typeof(pos)=="undefined")
    pos=0;
   var nextpos=subTimes[subtitleLang][loop];
   if (typeof(nextpos)!="undefined")
   {
     var lengthFract=(nextpos-pos)/3;
     pos=pos+parseInt(lengthFract);
   }
   else
    pos=pos+1000;

   var slide=findCurrent(pos, times[avLang])
   if (slide>0 && slide!=lastSlide)
   {
    for (var loop2=lastSlide+1; loop2<slide+1; loop2++)
     exwin.document.writeln("</div><br />\n\n"+getTranscriptSlideHeader(loop2));
    lastSlide=slide;
   }
   exwin.document.writeln("<p class=\"subtitle\">"+subtitles[loop]+"<\/p>");
  }

  for (loop2=lastSlide+1; loop2<titles[slideLang].length+1; loop2++)
   exwin.document.writeln("</div><br />\n\n"+getTranscriptSlideHeader(loop2));

  exwin.document.writeln("</div>\n");
 }
 else
  for (var loop=1; loop<subtitles.length; loop++)
   exwin.document.writeln("<p>"+subtitles[loop]+"<\/p>");

 exwin.document.writeln("<br />\n"+
  "<div align=\"right\">\n"+
  "<form action=\"javascript:print()\">\n"+
  "<input type=\"submit\" value=\""+getString("print")+"\" />\n"+
  "</form>\n"+
  "<\/body>\n<\/html>");
 exwin.document.close();
}

function getTranscriptSlideHeader(slide)
{
 var slideName=selectedSlides.getSlideFileName(slide, 1);
 var heightStyle="";
 if (browser==MSIE && browserVersion==6)
  heightStyle="style=\"height:126px;\"";

 if (slideName.length>0)
  return "<div class=\"subblock\" "+heightStyle+">\n"+
   "<img src=\""+selectedSlides.getSlideFileName(slide, 1)+"\" title=\""+getString("slide")+" "+slide+"\" "+
   "alt=\""+getString("slide")+" "+slide+"\" class=\"thumbnail\" align=\"left\" />";
 else
  return "<div class=\"subblock\" "+heightStyle+">\n"+
   "<p><b>"+getString("slide")+" "+slide+"</b></p>\n";
}

/*****Code to recieve events from video stream*****/

function setPosition(slide, subtitle)
{
 if (slideSync)
  setSlide(slide, false);

 if (subtitlesActive && subSync && subtitle>-1)
  setSubtitle(subtitle, false);
}

/*****Interface controls*****/

function nextSubtitle()
{
 setSubtitle(currentSubtitle+1, true);
}

function previousSubtitle()
{
 setSubtitle(currentSubtitle-1, true);
}

function nextSlide()
{
 fixPos=true;
 setSlide(currentSlide+1, true);
}

function previousSlide()
{
 fixPos=true;
 setSlide(currentSlide-1, true);
}

function setSlide(pos, moveVideo)
{
 var last=currentSlide;
 if (slideSet==false)
  return;

 if (pos<1)
  pos=1;

 if (pos>titles[slideLang].length)
  pos=titles[slideLang].length;

 if (currentSlide==pos)
  return;

 if (popupSlideWindow!=null && !popupSlideWindow.closed)
  popupSlideWindow.selectedSlides.showSlide(pos);

 if (moveVideo==false && videoSet && isPaused==false && pauseAfterSlide && times[avLang][currentSlide]>100)
 {
  selectedAVSource.stopPlayer();
  showPauseMessage();
  return;
 }

 selectedSlides.showSlide(pos);
 if (showSlideMenu && window.document.slideList.list.selectedIndex!=pos-1)
  window.document.slideList.list.selectedIndex=pos-1;

 if (thumbnailsActive)
  setActiveThumbnail(pos)

 currentSlide=pos;

 if(moveVideo && slideSync && videoSet)
 {
  if (currentSlide==1)
   selectedAVSource.setPosition(1);
  else
  {
   selectedAVSource.setPosition(parseInt(times[avLang][currentSlide-1]+1));
  }
 }

 if (moveVideo && typeof(subtitleSlideLink[subtitleLang])!="undefined")
 {
  var count=0;
  while(count<subtitleSlideLink[subtitleLang].length)
   if (subtitleSlideLink[subtitleLang][count]==currentSlide)
   {
    setSubtitle(count+1, false);
    break;
   }
   else
    count++;
 }

 if (editing)
  slideChanged(last);
}

function showPauseMessage()
{
 setElementHTML("messageblock", "<a href=\"javascript:endPause();\" class=\"linkbutton\">"+getString("pausemessage")+"</a>");
}

function endPause()
{
 setElementHTML("messageblock", "");
 selectedAVSource.startPlayer();
 setSlide(currentSlide+1, false);
}

function setActiveThumbnail(pos)
{
 var thumbFrame=getThumbnailsFrame();

 var frameHeight=thumbFrame.innerHeight;
 if (typeof(thumbFrame.innerHeight)=="undefined")
  frameHeight=thumbFrame.document.documentElement.clientHeight;

 var num=pos-parseInt((frameHeight/(thumbImageHeight+4))/2);

 var y=(thumbImageHeight+3)*num;
 y=parseInt(y+(num/1.5));
 if (y<0)
  y=0;

 thumbFrame.scrollTo(0,y);

 img=thumbFrame.document.getElementById("tm"+currentSlide);
 if (img!=null)
  img.className="thumbnail";

 var img=thumbFrame.document.getElementById("tm"+pos);
 if (img!=null)
  img.className="thumbnailhighlight";
}

function saveAVPosition()
{
 var pos=selectedAVSource.getPosition();
 setCookie("autoview3_position"+saveCookieID, pos, null);
 setPositionControl();
}

function loadAVPosition()
{
 var positionCookie=getCookie("autoview3_position"+saveCookieID);
 // Cope with cookies set before the ID was introduced
 if (positionCookie==null)
  positionCookie=getCookie("autoview3_position");

 if (positionCookie!=null)
  selectedAVSource.setPosition(parseInt(positionCookie));
}

function showFullVideo(i)
{
 fullVideoOptions=i;
 setVideoControls();
}

function showFullSlide(i)
{
 fullSlideOptions=i;
 setSlideControls();
}

function setVideoSource(num)
{
 stopMonitor();

 selectedAVSource=avSrc[avLang][num];
 setCookie("autoview3_player", selectedAVSource.type, null);
 setCookie("autoview3_speed", selectedAVSource.speed, null);
 setVideoHTML();
 setVideoControls();
 setPositionControl();

 startMonitor();
}

function changeSync()
{
 if (slideSync)
  slideSync=false;
 else
  slideSync=true;

 subSync=slideSync;

 setSlideMenu();
}

function setSlideSync(x)
{
 slideSync=x;
 setSlideMenu();
}

function setSubSync(x)
{
 subSync=x;
 setSlideMenu();
}

function setSlideSource(num)
{
 clearInterval(tid);
 selectedSlides=getSyncSlides(slideLang)[num];
 setCookie("autoview3_slides", selectedSlides.type, null);
 setSlideHTML();
 setSlideControls();
}

function setAllLanguages(l)
{
 var last=currentSlide;
 selectedLang=l;
 var oldSlideLang=slideLang;
 var oldAVLang=avLang;
 checkLanguage();
 setCookie("autoview3_lang", selectedLang, null);
 if (subtitlesActive)
  loadSubtitles();

 almostAllHTML();
 if (slideLang!=oldSlideLang)
 {
  chooseSlides();
  setSlideHTML();
 }
 if (avLang!=oldAVLang)
 {
  chooseVideo();
  setVideoHTML();
 }

 if (editing)
  slideChanged(last);
}

function showFullLang(i)
{
 fullLangOptions=i;
 setLanguageHTML();
}

function setIntLanguage(l)
{
 selectedLang=l;
 setCookie("autoview3_lang", selectedLang, null);
 almostAllHTML();
 setElementHTML("subtitledisplay", subtitles[currentSubtitle]);
}

function setSlideLanguage(l)
{
 var last=currentSlide;
 slideLang=l;
 chooseSlides();
 setSlideHTML();
 setSlideMenu();
 setSlideControls();
 if (editing)
  slideChanged(last);
}

function setAVLanguage(l)
{
 avLang=l;
 chooseVideo();
 setVideoHTML();
 setVideoControls();
}

function setSubtitleLanguage(l)
{
 subtitleLang=l;
 if (subtitlesActive)
  loadSubtitles();

 setSubtitleHTML();
}

function setSubtitlesOn(o)
{
 var last=currentSubtitle;
 subtitlesActive=o;
 setCookie("autoview3_subtitles", subtitlesActive, null);
 if (subtitlesActive)
  loadSubtitles();

 calculateSizes();
 setSubtitleControls();
 setSubtitleHTML();
 setSlideHTML();
 setThumbnailHTML();

 if (editing)
  subtitleChanged(last);
}

function increaseSlideSize()
{
 videoWidth=videoWidth-0.05;
 if (videoWidth<0.17)
  videoWidth=0.17;

 sizeChangeHTML();
}

function decreaseSlideSize()
{
 videoWidth=videoWidth+0.05;
 if (videoWidth>0.37)
  videoWidth=0.37;

 sizeChangeHTML();
}

function setThumbnails(t)
{
 thumbnailsActive=t;
 setCookie("autoview3_thumbs", thumbnailsActive, null);
 calculateSizes();
 setThumbnailHTML();
 setSlideHTML();
 setSubtitleHTML();
 setThumbnailControl();
}

function setHideVideo(x)
{
 hideVideo=x;
 sizeChangeHTML();
}

/*****Plugin Detection Code********/

// Variables used for plugin detection

var hasFlash=false, hasAcrobat=false, vbDetectOK=false;

function detectPlugins()
{
 if (vbDetectOK==false) 
 {
  hasAcrobat=findPlugin("adobe acrobat");
  if (hasAcrobat==false)
   hasAcrobat=findPlugin("adobe reader");
  if (hasAcrobat==false)
   hasAcrobat=findPlugin("nppdf.so");
 }

 /*****Check slide interaction controls for non-ie browsers*****/
 flashInteract=hasFlash;
 if (findValidLangs(allSlideSrc).length>0 && browser!=MSIE)
 {
  /*****Check that interaction with the flash plugin works properly and if not disable*****/
  var str="<object data=\""+vresourcePath+"test.swf\" quality=\"high\" bgcolor=\"#ffffff\" width=\"5\" height=\"5\""+
   " name=\"flashtest\" id=\"flashtest\" type=\"application/x-shockwave-flash\""+
   " mayscript>"+
   " <param name=\"src\" value=\""+vresourcePath+"test.swf\" />"+
   "</object>";
  setElementHTML("slides", str);

  if (typeof(window.document.flashtest)=="undefined")
   flashInteract=false;
  else
  {
   /*****Note : GotoFrame check dosn't seem to work in opera or FF3, so ignore*****/
   if (browser!=OPERA && (browser!=MOZILLA && browserVersion<3) && typeof(window.document.flashtest.GotoFrame)=="undefined")
    flashInteract=false;
  }
 }
}

function findPlugin(toFind)
{
 toFind=toFind.toLowerCase();
 for (var loop=0; loop<navigator.plugins.length; loop++)
 {
  if (navigator.plugins[loop].name.toLowerCase().indexOf(toFind)>-1)
   return true;
 }

 return false;
}

/******Browser detection routine*****/

function detectBrowser()
{
 var userAgent=navigator.userAgent.toLowerCase();

 if (userAgent.indexOf("android")>-1)
 {
  ostype=ANDROID;
  if (userAgent.indexOf("mobile")>-1)
   mobileDevice=true;
 }
 else
 if (userAgent.indexOf("linux")>-1)
  ostype=LINUX;
 else
 if (userAgent.indexOf("iphone")>-1 || userAgent.indexOf("ipod")>-1)
 {
  mobileDevice=true;
  ostype=IOS;
 }
 else
 if (userAgent.indexOf("ipad")>-1)
 {
  tabletDevice=true;
  ostype=IOS;
 }
 else
 if (userAgent.indexOf("mac")>-1)
  ostype=APPLEMAC;
 else
 if (userAgent.indexOf("sunos")>-1)
  ostype=SUNOS;
 else
 if (userAgent.indexOf("windows")>-1)
  ostype=WINDOWS;
 else
 if (userAgent.indexOf("symbianos")>-1)
 {
  mobileDevice=true;
  ostype=SYMBIAN;
 }
 else
  ostype=OTHER;

 if (userAgent.indexOf("konqueror")>-1)
 {
  browser=KONQUEROR;
  readBrowserVersion(userAgent, "khtml/", " ");
 }
 else
 if (userAgent.indexOf("chrome")>-1)
 {
  browser=CHROME;
  readBrowserVersion(userAgent, "chrome/", " ");
 }
 else
 if (userAgent.indexOf("safari")>-1)
 {
  browser=SAFARI;
  readBrowserVersion(userAgent, "version/", " ");
 }
 else
 if (userAgent.indexOf("opera")>-1)
 {
  browser=OPERA;
  readBrowserVersion(userAgent, "version/", "");
 }
 else
 if (userAgent.indexOf("firefox")>-1)
 {
  browser=MOZILLA;
  readBrowserVersion(userAgent, "firefox/", " ");
 }
 else
 if (userAgent.indexOf("seamonkey")>-1)
 {
  browser=MOZILLA;
  readBrowserVersion(userAgent, "seamonkey/", "");
  //***SeaMonkey 2 is functionaly equlvalent to FireFox 3.5, so increment the browser version***
  browserVersion=browserVersion+1.5;
 }
 else
 if (userAgent.indexOf("gecko")>-1 || userAgent.indexOf("netscape")>-1)
  browser=MOZILLA;
 else
 if (userAgent.indexOf("msie")>-1)
 {
  browser=MSIE;
  readBrowserVersion(userAgent, "msie ", ";");
 }
 else
  browser=OTHER;

 /*****Cope with browsers that Spoof IE (Assume Opera 8)*****/
 if (ostype==WINDOWS && browser==MSIE && vbDetectOK==false)
 {
  ieSpoof=true;
  browser=OPERA;
  browserVersion=8;
 }
}

function readBrowserVersion(userAgent, keyA, keyB)
{
 var indexA=userAgent.indexOf(keyA)+keyA.length;
 if (keyB.length>0)
 {
  var indexB=userAgent.indexOf(keyB, indexA);
  browserVersion=parseFloat(userAgent.substring(indexA, indexB));
 }
 else
  browserVersion=parseFloat(userAgent.substring(indexA));
}

/*****Cookie Methods*****/

function getCookie(Name)
{
 var search = Name + "="
 if (document.cookie.length > 0)
 {
  offset = document.cookie.indexOf(search) 
  if (offset != -1)
  {
   offset += search.length 
   end = document.cookie.indexOf(";", offset) 
   if (end == -1) 
    end = document.cookie.length
   return unescape(document.cookie.substring(offset, end))
  }

 }
 return null;
}

function setCookie(name, value, expire)
{
 if (expire==null)
 {
  var futdate = new Date();
  var expdate = futdate.getTime();
  expdate += ((3600*1000)*24)*365;
  futdate.setTime(expdate);
  expire=futdate;
 }

 document.cookie = name + "=" + escape(value) +" ; path=/ "
  + ((expire == null) ? "" : ("; expires=" + expire.toGMTString()))
}

/******This code can be called to monitor position of video streams which don't have event triggers*****/

var monPosSlide=1;
var monPosSub=1;
var currentVideoTime=0;
var isPaused=true;

function restartMonitor()
{
 stopMonitor();
 startMonitor();
}

function startMonitor()
{
 if (selectedAVSource.useTimeMonitor()==true)
  monitor=setInterval('monitorPosition()', 500);
}

function stopMonitor()
{
 if (typeof(monitor)!="undefined")
  clearInterval(monitor);
}

function monitorPosition()
{
 try
 {
  var newVideoTime=selectedAVSource.getPosition();
/*
  if (fixPos)
  {
   var diff=newVideoTime-currentVideoTime;
   if (diff!=0)
   {
    fixPos=false;
    return;
   }
  }
*/
  if (pauseAfterSlide)
  {
   var diff=newVideoTime-currentVideoTime;
   if (newVideoTime==currentVideoTime || diff>2000 || diff<-2000)
    isPaused=true;
   else
    isPaused=false;

   if (diff>2000 || diff<-2000)
    setElementHTML("messageblock", "");
  }

  currentVideoTime=newVideoTime;
  var slide=findCurrent(currentVideoTime, times[avLang]);

  if (slide>-1 && slide!=monPosSlide && slideSync==true && fixPos==false)
  {
   monPosSlide=slide;
   setSlide(slide,false);
  }

  var sub=findCurrent(currentVideoTime, subTimes[subtitleLang]);

  if (sub>-1 && sub!=monPosSub)
  {
   monPosSub=sub;
   setSubtitleIfSync(sub,false);
  }
 }
 catch (e)
 {
  if (typeof("Components")!="undefined" && browser!=MSIE)
   Components.utils.reportError("Error in video position monitoring thread: "+e);
  else
   alert("Error in video position monitoring thread\n\n"+e.description);
  clearInterval(monitor);
 }
}

function findCurrent(pos, data, alwaysLoop)
{
 if (typeof(data)=="undefined")
  return -1;

 if (typeof(alwaysLoop)=="undefined")
  alwaysLoop=false;

 for (var loop=data.length; loop>0; loop--)
 {
  var f=data[loop-1];
  if (typeof(f)=="undefined")
   f=90000000000;

  var s=data[loop];
  if (typeof(s)=="undefined")
   s=90000000000;

  if (pos>=f && pos<s)
  {
   var d=getDecimalAsInt(data[loop-1])
   if (d>-1 && alwaysLoop==false)
    return d;
   else
    return loop;
  }
 }

 return 0;
}

function getDecimalAsInt(number)
{
 if (typeof(number)=="undefined")
  return -1;

 var ns=number.toString();
 var np=ns.indexOf(".");
 if (np>0)
  return parseInt(ns.substring(np+1));

 return -1;
}


/**********************************/
/*****Slide handling classes*******/
/**********************************/

/*****No Slides********************/

function NoSlide()
{
 this.url="";
 this.type=SLIDE_NONE;
 this.printable=false;
 this.synchronisable=true;

 this.showSlide=showSlide;
 function showSlide (slide)
 {

 }

 this.getHTML=getHTML;
 function getHTML()
 {
  return "<table width=\""+slideWidth+"\" style=\"height:"+slideHeight+"px\"><tr><td align=\"center\">"
   +getString("noslides")+"</td></tr></table>";
 }

 this.isValid=isValid;
 function isValid()
 {
  return true;
 }

 this.label=label;
 function label()
 {
  return getString("noslides");
 }

 this.getAllSlides=getAllSlides;
 function getAllSlides(exwin)
 {
  exwin.document.writeln( "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\""+ 
   "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n"+
   "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n"+
   " <head>\n"+
   "  <meta content=\"text/html; charset=ISO-8859-1\" http-equiv=\"Content-Type\"/>\n"+
   "  <title></title>\n"+
   "  <link type=\"text/css\" rel=\"stylesheet\" href=\""+vresourcePath+"style.css\"/>\n"+
   " </head>\n"+
   " <body>\n"+
   "  <p>These are no slides to print !</p>"+
   " </body>\n"+
   " </html>");
 }

 this.getAllThumbnails=getAllThumbnails;
 function getAllThumbnails()
 {
  return "";
 }
}

/*****Image Slides****************/

function ImageSlide(url, slideType)
{
 this.url=url;
 this.type=SLIDE_IMAGE;
 this.slideType=slideType;
 this.printable=true;
 this.synchronisable=true;
 var cacheImage=new Image();

 this.showSlide=showSlide;
 function showSlide(slide)
 {
  var slideSrcName = getSlideFileName(slide, slideScale);
  window.document.slideImage.src = slideSrcName;
  preloadImage(currentSlide+1);
 }

 this.getHTML=getHTML;
 function getHTML()
 {
  var str = '\n';

  var slideSrcName = getSlideFileName(currentSlide, slideScale);
  var str="";
  if (mobileDevice)
   str = str+'<img src="' + slideSrcName + 
     '" name="slideImage" width="' + slideWidth + '" height="' + slideHeight + 
   '" border="0" alt="Slide Display" title="">\n';
  else
   str = str+'<img src="' + slideSrcName + 
    '" name="slideImage" width="' + widths[slideScale-1] + '" height="' + heights[slideScale-1] + 
    '" border="0" alt="Slide Display" title="">\n';

  preloadImage(currentSlide+1);

  return str;
 }

 function preloadImage(number)
 {
  if (number > 0 && number <= titles[slideLang].length)
   cacheImage.src = getSlideFileName(number, slideScale);
 }

 this.isValid=isValid;
 function isValid()
 {
  return true;
 }

 this.label=label;
 function label()
 {
  return getString("imageslides");
 }

 this.getSlideFileName=getSlideFileName;
 function getSlideFileName(num,ss)
 {
  if (typeof(ss)=="undefined")
   ss=slideScale;
  return baseRef+url+"/"+getImageFilename(num, ss, slideType);
 }

 this.getAllSlides=getAllSlides;
 function getAllSlides(exwin)
 {
  exwin.document.writeln(allImageSlides(this));
 }

 this.getAllThumbnails=getAllThumbnails;
 function getAllThumbnails()
 {
  return allImageThumbnails(this);
 }
}

/*****Preloaded Image Slides*******/

function PreloadImageSlide(url,slideType)
{
 this.url=url;
 this.type=SLIDE_IMAGE_PRELOAD;
 this.printable=true;
 this.synchronisable=true;
 this.slideType=slideType;
 this.preLoadDone=false;

 var preLoadCount=0;
 var cacheImages=new Array();

 this.showSlide=showSlide;
 function showSlide(slide)
 {
  if (mobileDevice)
   setElementHTML("slides", getImgTag(slide));
  else
   window.document.slideImage.src = cacheImages[slide].src;
 }

 this.getHTML=getHTML;
 function getHTML()
 {
  if (this.preLoadDone)
   return getImgTag(currentSlide);

  var extra="";
  if (mobileDevice)
   extra="width:"+slideWidth+"px;";

  var str="<br /><h3 style=\"text-align:center;"+extra+"\">"+getString("preloadmessage1")+"</h3>\n"+
   "<p style=\"font-size:small;text-align:center;"+extra+"\">("+getString("preloadmessage2")+")</p>\n"+
   "<p style=\"text-align:center;"+extra+"\"><span id=\"slidenum\"></span></p>\n";

  str=str+" <p style=\"text-align:center\"><img src=\""+vresourcePath+"images/transparent.gif\" name=\"preload\""+
   " width=\""+slideWidth/2+"\" height=\""+slideHeight/2+"\" border=\"1\" title=\"\"></p>\n";

  setTimeInterval(50);

  return str;
 }

 this.preLoadNextImage=preLoadNextImage;
 function preLoadNextImage()
 {
  preLoadCount++;

  if (preLoadCount<titles[slideLang].length+1)
  {
   cacheImages[preLoadCount]=new Image();
   if (typeof(document.preload)!="undefined")
   {
    document.preload.src=getSlideFileName(preLoadCount, slideScale);

    cacheImages[preLoadCount].src=document.preload.src;

    //IE now seems to consider this call a security problem and it is blocked
    if (browser!=MSIE)
    {
     if (langRTL[selectedLang]==true)
      setElementHTML("slidenum", times[avLang].length+" "+getString("preloadmessage4")+"&nbsp;"+preLoadCount+"&nbsp;"+getString("preloadmessage3")+"</h3>\n");
     else
      setElementHTML("slidenum", getString("preloadmessage3")+"&nbsp;"+preLoadCount+"&nbsp;"+getString("preloadmessage4")+" "+titles[slideLang].length+"</h3>\n");
    }
   }
   else
    cacheImages[preLoadCount].src=getSlideFileName(preLoadCount, slideScale);

   setTimeInterval(50); 
  }
  else
  {
   this.preLoadDone=true;
   setElementHTML("slides", getImgTag(currentSlide));
   preLoadCount=0;
   slideLoadFinished(); 
  }
 }

 this.getImgTag=getImgTag;
 function getImgTag(slide)
 {
  if(mobileDevice)
  {
   return '<img src="' + cacheImages[slide].src + 
    '" name="slideImage" width="' + slideWidth + '" height="' + slideHeight + 
    '" border="0" alt="Slide Display">\n';
  }
  else
   return '<img src="' + cacheImages[slide].src + 
    '" name="slideImage" width="' + widths[slideScale-1] + '" height="' + heights[slideScale-1] + 
    '" border="0" alt="Slide Display">\n';
 }

 this.timeInterval=timeInterval;
 function timeInterval()
 {
  if (typeof(cacheImages[preLoadCount])=="undefined" || cacheImages[preLoadCount].complete==true)
  {
   clearInterval(tid);
   preLoadNextImage();
  }
 }

 this.isValid=isValid;
 function isValid()
 {
  return true;
 }

 this.label=label;
 function label()
 {
  return getString("preloadimage");
 }

 this.getSlideFileName=getSlideFileName;
 function getSlideFileName(num, ss)
 {
  if (typeof(ss)=="undefined")
   ss=slideScale;
  var n=baseRef+url+"/"+getImageFilename(num, ss, slideType);
  return n;
 }

 this.getAllSlides=getAllSlides;
 function getAllSlides(exwin)
 {
  exwin.document.writeln(allImageSlides(this));
 }

 this.getAllThumbnails=getAllThumbnails;
 function getAllThumbnails()
 {
  return allImageThumbnails(this);
 }
}

/*****Open Office Flash Slides*****/

function OOFlashSlide(url)
{
 this.url=url;
 this.type=SLIDE_OOFLASH;
 this.flashFailMessage=false;
 this.printable=false;
 this.synchronisable=true;
 this.preLoadDone=false;
 this.backUpImages;

 this.showSlide=showSlide;
 function showSlide(slide)
 {
  var s=document.getElementById("flashSlides");
  //if (typeof(s)=="undefined" || typeof(s.GotoFrame)=="undefined")
  if (flashInteract==false)
  {
   if (this.flashFailMessage==false && noSuitableSlides==false)
   {
    this.flashFailMessage=true;
    hasFlash=false;
    if (confirm(getString("flashfailed")))
     reChooseSlides();
   }
  }
  else
  {
   if (slide<currentSlide)
    s.Rewind(); 

   if (slide==1)
    setElementHTML("slides", this.pluginCode(slideWidth, slideHeight));
   if (typeof(s.GotoFrame)!="undefined")
    s.GotoFrame((slide*2)-1);
  }
 }

 this.getHTML=getHTML;
 function getHTML()
 {
  if (this.preLoadDone)
  {
   setTimeInterval(1500);
   return this.pluginCode(slideWidth, slideHeight);
  }

  var str="<h3 align=\"center\">"+getString("preloadmessage1")+"</h3>\n"+
    "<p align=\"center\">"+getString("preloadmessage2")+"</p>\n";

  if (langRTL[selectedLang]==true)
   str=str+"<table align=\"center\"><tr><td>"+getString("preloadmessage5")+"</td><td><span id=\"percentage\">0%</span></td></tr></table>\n";
  else
   str=str+"<table align=\"center\"><tr><td><span id=\"percentage\">0%</span></td><td>"+getString("preloadmessage5")+"</td></tr></table>\n";

  str=str+this.pluginCode(slideWidth/2, slideHeight/2);
  setTimeInterval(50);
  return str;
 }

 this.pluginCode=pluginCode;
 function pluginCode(w,h)
 {
  var urlToUse=this.url;
  if (this.url.indexOf("http://")<0 && this.url.indexOf("https://"))
   urlToUse=baseRef+this.url;

  var data='type="application/x-shockwave-flash" data="'+urlToUse+'"\n';
  if (browser==MSIE)
   data='classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"\n'+     
   'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"';

  return '<object '+data+
   ' width="'+w+'" height="'+h+'" id="flashSlides">\n'+
   ' <param name="movie" value="'+urlToUse+'" />\n'+ 
   ' <param name="quality" value="best" />\n'+
   ' <param name="wmode" value="transparent" />\n'+
   '<\/object>\n';
 }

 this.timeInterval=timeInterval;
 function timeInterval()
 {
  if (this.preLoadDone)
  {
   clearInterval(tid);
   if (currentSlide!=1)
    this.showSlide(currentSlide);
   return;
  }

  var s=document.flashSlides;
  if (typeof(s)=="undefined" || typeof(s.PercentLoaded)=="undefined" || s.PercentLoaded()>99)
  {
   clearInterval(tid);
   this.preLoadDone=true;
   setElementHTML("percentage", "100%");
   setElementHTML("slides", this.pluginCode(slideWidth, slideHeight));
   slideLoadFinished();
  }
  else
   setElementHTML("percentage", s.PercentLoaded()+"%");
 }

 this.isValid=isValid;
 function isValid()
 {
  return hasFlash;
 }

 this.label=label;
 function label()
 {
  return getString("flashslides");
 }

 this.getAllSlides=getAllSlides;
 function getAllSlides(exwin)
 {
  exwin.document.writeln("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\""+ 
   "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n"+
   "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n"+
   " <head>\n"+
   "  <meta content=\"text/html; charset=ISO-8859-1\" http-equiv=\"Content-Type\"/>\n"+
   "  <title></title>\n"+
   "  <link type=\"text/css\" rel=\"stylesheet\" href=\""+vresourcePath+"style.css\"/>\n"+
   " </head>\n"+
   " <body>\n"+
   "  <p>These slides cannot be printed</p>"+
   " </body>\n"+
   " </html>");
 }

 this.getSlideFileName=getSlideFileName;
 function getSlideFileName(num,ss)
 {
  if (typeof(ss)=="undefined")
   ss=slideScale;
  setBackupImages();
  if (setBackupImages())
   return backUpImages.getSlideFileName(num, ss);
  else
   return "";
 }

 this.getAllThumbnails=getAllThumbnails;
 function getAllThumbnails()
 {
  if (setBackupImages())
   return allImageThumbnails(this);
  else
   return "";
 }

 this.setBackupImages=setBackupImages;
 function setBackupImages()
 {
  if (typeof(this.backUpImages)!="undefined")
   return true;

  var slideSrc=getSyncSlides(slideLang);
  for (var loop=0; loop<slideSrc.length; loop++)
  {
   if (slideSrc[loop].type==SLIDE_IMAGE_PRELOAD || slideSrc[loop].type==SLIDE_IMAGE)
   {
    backUpImages=slideSrc[loop];
    return true;
   }
  }
  return false;
 }
}

/*****AutoView Slide convertor source*****/

function AVFlashSlide(url)
{
 this.inheritFrom=OOFlashSlide;
 this.inheritFrom();

 this.url=url;
 this.type=SLIDE_AVFLASH;

 this.showSlide=showSlide;
 function showSlide(slide)
 {
  var s=window.document.flashSlides;
  //if (typeof(s)=="undefined" || typeof(s.GotoFrame)=="undefined")
  if (flashInteract==false)
  {
   if (this.flashFailMessage==false && noSuitableSlides==false)
   {
    this.flashFailMessage=true;
    hasFlash=false;
    if (confirm(getString("flashfailed")))
     reChooseSlides();
   }
  }
  else
  {
   if (typeof(s.GotoFrame)!="undefined")
    s.GotoFrame(slide-1);
  }
 }
}

/*****PDF Slides******/

function PDFSlide(url)
{
 this.url=url;
 this.type=SLIDE_PDF;
 this.printable=true;
 this.synchronisable=false;

 this.showSlide=showSlide;
 function showSlide (slide)
 {

 }

 this.getHTML=getHTML;
 function getHTML()
 {
  var data="";
  if (browser==MSIE)
   data="classid=\"clsid:CA8A9780-280D-11CF-A24D-444553540000\"";

  return "<object id=\"pdfslides\" "+data+
   " width=\""+slideWidth+"\" height=\""+slideHeight+"\" type=\"application/pdf\" data=\""+this.url+"\">\n"+
   " <param name=\"src\" value=\""+this.url+"\" />\n"+
   "</object>\n";
 }

 this.isValid=isValid;
 function isValid()
 {
  return hasAcrobat;
 }

 this.label=label;
 function label()
 {
  return getString("pdfslides");
 }

 this.getAllSlides=getAllSlides;
 function getAllSlides(exwin)
 {
  if (browser==MSIE)
  {
   var urlToUse=this.url;
   if (this.url.indexOf("http://")==-1 && this.url.indexOf("https://")==-1)
    urlToUse=baseRef+this.url;
   exwin.document.writeln("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"DTD/xhtml1-strict.dtd\">\n"+
    "<html><head><title></title></head><body style=\"background-color:#eeeeee;\">\n"+
    "<div style=\"text-align:center\">\n"+
    "<object id=\"pdfslides\" classid=\"clsid:CA8A9780-280D-11CF-A24D-444553540000\""+
    " width=\"665\" height=\"480\" type=\"application/pdf\" data=\""+urlToUse+"\">\n"+
    " <param name=\"src\" value=\""+urlToUse+"\" />\n"+
    "</object>\n"+
    "</div>\n"+
    "</body></html>");
  }
  else
   exwin.document.location=this.url;
 }

 this.getAllThumbnails=getAllThumbnails;
 function getAllThumbnails()
 {
  return "";
 }
}

/*****Separate Flash Slides*****/

function SeparateFlashSlide(url)
{
 this.url=url;
 this.type=SLIDE_SEPFLASH;
 this.printable=false;
 this.synchronisable=true;
 this.preloadDone=false;
 this.preLoadSlide=1;

 this.showSlide=showSlide;
 function showSlide(slide)
 {
  var slideSrcName = getSlideFileName(slide);
  setElementHTML("singleFlashSlide", pluginCode(slideWidth, slideHeight, slideSrcName));
  //var old=document.getElementById("singleFlashSlide"+currentSlide);
  //var element=document.getElementById("singleFlashSlide"+slide);

  //old.style.display="none";
  //element.style.display="block";
 }

 this.getHTML=getHTML;
 function getHTML()
 {
  var str="";

  if (this.preLoadDone)
  {
   str=str+"\n<div id='singleFlashSlide' style='text-align:center;width:100%;height:"+slideHeight+"px;'>"+
           this.pluginCode(slideWidth, slideHeight, getSlideFileName(currentSlide), currentSlide)+
           "</div>";
  }
  else
  {
   str=str+"<div id=\"slidePreload\">\n"+
           "<h3 align=\"center\">"+getString("preloadmessage1")+"</h3>\n"+
           "<p align=\"center\">"+getString("preloadmessage2")+"</p>\n"+
           "<table align=\"center\" style=\"width:"+slideWidth+"px;\"><tr><td><span id=\"slidenum\"></span></td></tr></table>\n"+
           "<br />\n"+
           "<div id=\"preloader\" style=\"margin-left:auto;margin-right:auto;\">"+pluginCode(slideWidth/2, slideHeight/2, getSlideFileName(1), 1)+"</div>\n"+
           "</div>\n"+
           "<div id='singleFlashSlide' style='text-align:center;width:100%;height:"+slideHeight+"px;display:none;'></div>";

   setTimeInterval(250);
  }

  return str;
 }

 this.pluginCode=pluginCode;
 function pluginCode(w,h,slideName,num)
 {
  var data='type="application/x-shockwave-flash" data="'+slideName+'"\n';
  if (browser==MSIE)
   data='classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"\n'+     
   'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"';

  return '<object '+data+
   ' width="'+w+'" height="'+h+'" id="flashSlide'+num+'">\n'+
   ' <param name="movie" value="'+slideName+'" />\n'+ 
   ' <param name="quality" value="best" />\n'+
   ' <param name="wmode" value="transparent" />\n'+
   '<\/object>\n';
 }

 this.timeInterval=timeInterval;
 function timeInterval()
 {
  if (this.preLoadDone)
  {
   clearInterval(tid);
   var element=document.getElementById("slidePreload");
   element.style.display="none";
   var elementB=document.getElementById("singleFlashSlide");
   elementB.style.display="block";
   return;
  }

  var e=document.getElementById("flashSlide"+this.preLoadSlide);
  var percentage=100;
  if (typeof(e)!="undefined" && typeof(e.PercentLoaded)!="undefined")
   percentage=e.PercentLoaded();

  if (percentage>99)
   this.preLoadSlide++;

  if (browser!=MSIE)
  {
   if (langRTL[selectedLang]==true)
    setElementHTML("slidenum", times[avLang].length+" "+getString("preloadmessage4")+"&nbsp;"+this.preLoadSlide+"&nbsp;"+getString("preloadmessage3")+"</h3>\n");
   else
    setElementHTML("slidenum", getString("preloadmessage3")+"&nbsp;"+this.preLoadSlide+"&nbsp;"+getString("preloadmessage4")+" "+titles[slideLang].length+"</h3>\n");
  }

  if (this.preLoadSlide==titles[slideLang].length+1)
  {
   clearInterval(tid);
   this.preLoadDone=true;

   var element=document.getElementById("slidePreload");
   element.style.display="none";
   var elementB=document.getElementById("singleFlashSlide");
   elementB.style.display="block";
   showSlide(1);

   slideLoadFinished();
  }
  else
   setElementHTML("preloader", pluginCode(slideWidth/2, slideHeight/2, getSlideFileName(this.preLoadSlide), this.preLoadSlide));
 }

 this.isValid=isValid;
 function isValid()
 {
  if (hasFlash)
   return true;

  return false;
 }

 this.label=label;
 function label()
 {
  return getString("flashslides");
 }

 this.getSlideFileName=getSlideFileName;
 function getSlideFileName(num)
 {
  return baseRef+url+"/slide"+num+".swf";
 }

 this.getAllSlides=getAllSlides;
 function getAllSlides(exwin)
 {
  
 }

 this.getAllThumbnails=getAllThumbnails;
 function getAllThumbnails()
 {
  return "";
 }
}

/*****Slide utility methods*****/

var tid;

function setTimeInterval(duration)
{
 tid = setInterval('timeIntervalCall()', duration);
}

function timeIntervalCall()
{
 if (typeof(selectedSlides)!="undefined")
  if (typeof(selectedSlides.timeInterval)!="undefined")
   selectedSlides.timeInterval();
}

function getImageFilename(slideNumber, slideScale, slideType)
{
 var fname = "img";

 if (slideNumber < 10)
  fname += "0";
 if (slideNumber < 100)
  fname += "0";
  
 fname += slideNumber + "_" + slideScale + slideType;

 return fname;
}

function allImageSlides(slides)
{
 var str="<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\""+ 
  "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n"+
  "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n"+
  " <head>\n"+
  "  <meta content=\"text/html; charset=ISO-8859-1\" http-equiv=\"Content-Type\"/>\n"+
  "  <title></title>\n"+
  "  <link type=\"text/css\" rel=\"stylesheet\" href=\""+vresourcePath+"style.css\"/>\n"+
  " </head>\n"+
  " <body>\n"+
  "  <h4 align=\"center\">"+window.document.title+"</h4>";

 if (slides==null)
  str=str+getString("noprintslides");
 else
 {
  for (loop=1; loop<titles[slideLang].length+1; loop++)
  {
   str=str+"<p style=\"page-break-after: always\" align=\"center\">"+
    "<b>"+getString("slide")+" "+loop+" : "+titles[slideLang][loop-1]+"</b><br/><br/>\n"+
    "<img src=\""+slides.getSlideFileName(loop,widths.length)+"\" border=\"1\" width=\"480\" height=\"360\"><br/><br/><br/>";

   loop++;
   if (loop<titles[slideLang].length+1)
    str=str+"<b>"+getString("slide")+" "+loop+" : "+titles[slideLang][loop-1]+"</b><br/><br/>\n"+
     "<img src=\""+slides.getSlideFileName(loop,widths.length)+"\" border=\"1\" width=\"480\" height=\"360\"><br/><br/><br/>";

   str=str+"</p>\n";
  }
 }
 str=str+"</body>\n</html>";
 return str;
}

function allImageThumbnails(slides)
{
 var str="<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\""+ 
  "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n"+
  "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n"+
  " <head>\n"+
  "  <meta content=\"text/html; charset=ISO-8859-1\" http-equiv=\"Content-Type\"/>\n"+
  "  <title></title>\n"+
  "  <link type=\"text/css\" rel=\"stylesheet\" href=\""+vresourcePath+"style-thumbnails.css\"/>\n"+
  "  <style type=\"text/css\">\n"+
  "   div.container{width:"+(thumbImageWidth+2)+"px;}\n"+
  "  </style>\n"+
  " </head>\n"+
  " <body><div class=\"container\">\n";

 if (slides!=null)
 {
  for (loop=1; loop<titles[slideLang].length+1; loop++)
  {
   var st="thumbnail";
   var loadTrigger="";
   if (loop==currentSlide)
   {
    st="thumbnailhighlight";
    loadTrigger="onload=\"parent.setActiveThumbnail("+currentSlide+");\" ";
   }
   str=str+"<a href=\"javascript:parent.setSlide("+loop+", true)\" name=\"s"+(loop+1)+"\">"+
    "<img src=\""+slides.getSlideFileName(loop, 1)+"\" width=\""+thumbImageWidth+"\" height=\""+thumbImageHeight+"\""+
    " id=\"tm"+loop+"\" "+loadTrigger+
    "alt=\""+loop+" : "+titles[slideLang][loop-1]+"\" title=\""+loop+" : "+titles[slideLang][loop-1]+"\" class=\""+st+"\" /></a><br />";
  }
 }
 str=str+"</div></body></html>\n";

 return str;
}

function slideLoadFinished()
{
 if (selectedAVSource!=null)
 {
  if (autoStart && editing==false)
  {
   //selectedAVSource.startPlayer();
   setTimeout("selectedAVSource.startPlayer();", 1000);
   autoStart=false;
  }
  else
   setTimeout("selectedAVSource.stopPlayer();", 1000);
 }
}


function loadSlideSizeFile(url)
{
 jsFileLoader.document.open();
 jsFileLoader.document.writeln("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" "+   
  "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
 jsFileLoader.document.writeln("<html><head>");
 jsFileLoader.document.writeln("<script language=\"JavaScript\"");
 jsFileLoader.document.writeln(" src=\""+baseRef+url+"\" type=\"text\/javascript\">");
 jsFileLoader.document.writeln("<\/script><\/head><body><\/body><\/html>");
}

function copySlideSource(toCopy)
{
 if (toCopy.type==SLIDE_IMAGE || toCopy.type==SLIDE_IMAGE_PRELOAD)
  return new ImageSlide(toCopy.url, toCopy.slideType);

 //if (toCopy.type==SLIDE_IMAGE_PRELOAD)
 // return new PreloadImageSlide(toCopy.url, toCopy.slideType);

 if (toCopy.type==SLIDE_OOFLASH)
  return new OOFlashSlide(toCopy.url);

 if (toCopy.type==SLIDE_PDF)
  return new PDFSlide(toCopy.url)

 if (toCopy.type==SLIDE_AVFLASH)
  return new AVFlashSlide(toCopy.url);

 if (toCopy.type==SLIDE_SEPFLASH)
  return new SeparateFlashSlide(toCopy.url);

  return new NoSlide();
}

/**********************************/
/*****Video player classes*********/
/**********************************/

/*****NoVideo control class*****/

function NoVideo()
{
 this.url="";
 this.speed=SPEED_NONE;
 this.type=VIDEO_NONE;

 this.getHTML=getHTML;
 function getHTML()
 {
  return "<p align=\"center\">"+label()+"</p>";
 }

 this.getPlayer=getPlayer;
 function getPlayer()
 {
  return "";
 }

 this.setPosition=setPosition;
 function setPosition(pos)
 {
 }

 this.getPosition=getPosition;
 function getPosition()
 {
  return -1;
 }

 this.stopPlayer=stopPlayer;
 function stopPlayer()
 {

 }

 this.startPlayer=startPlayer;
 function startPlayer()
 {

 }

 this.label=label;
 function label()
 {
  return getString("novideoplayer");
 }

 this.isValid=isValid;
 function isValid()
 {
  return true;
 }

 this.controllable=controllable;
 function controllable()
 {
  return false;
 }

 this.useTimeMonitor=useTimeMonitor;
 function useTimeMonitor()
 {
  return false;
 }

 this.disableMessage=disableMessage;
 function disableMessage()
 {
  return getString("pluginnotfound");
 }
}


/*****Flash Video control class*****/

function FlashVideo(url,speed)
{
 this.jsLoaded=false;
 this.url=url;

 if (typeof(speed)=="undefined")
  this.speed=SPEED_NONE;
 else
  this.speed=speed;

 this.type=VIDEO_FLASH;

 this.getHTML=getHTML;
 function getHTML()
 {
  var urlToUse;
  if (this.url.indexOf("http://")>-1 || this.url.indexOf("https://")>-1 || this.url.indexOf("rtmp://")>-1)
   urlToUse=url;
  else
  if (this.url.indexOf("$flashserver/")==0)
   urlToUse=flashServer+this.url.substring(12);
  else
   urlToUse=baseRef+this.url;

  return this.getFlowPlayer3HTML(urlToUse);
 }

 this.getFlowPlayer3HTML=getFlowPlayer3HTML;
 function getFlowPlayer3HTML(urlToUse)
 {
  if (this.jsLoaded==false)
  {
   var e = document.createElement("script");
   e.src = vresourcePath+"flowplayer/flowplayer.min.js";
   e.type="text/javascript";
   document.getElementsByTagName("head")[0].appendChild(e);
   this.jsLoaded=true;
  }

  var width=avWidth;
  var height=avHeight+18;

  var data='type="application/x-shockwave-flash" data="'+vresourcePath+'flowplayer/flowplayer.swf"\n';
  if (browser==MSIE)
   data='classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"\n'+     
   'codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"';

  var cfg="";
  var controls="controls:{fullscreen:'false', height:'18'}";

  if (urlToUse.indexOf("rtmp://")>-1)
  {
   var i=0;
   for (l=0; l<4 && i>-1; l++)
    i=urlToUse.indexOf("/", i+1);
   var file=urlToUse.substring(i+1);
   var server=urlToUse.substring(0,i);
   /*****Check if this is an AutoView Live capture recording and append access parameters*****/
   if (server.indexOf(flashServer)>-1)
    server=server+"?"+flashHost+"?"+getFlashAuth();

   cfg=cfg+" plugins: { "+
        " rtmp: { "+
        "  url:'"+vresourcePath+"flowplayer/flowplayer.rtmp.swf', "+
        "  netConnectionUrl:'"+server+"', "+
        "  durationFunc:'getStreamLength'"+
        " }, "+
        controls+
        "},"+
        "clip: {"+ 
        " provider:'rtmp',"+
        " autoPlay:false, "+
        " url:'"+file+"' "+
        "}";
/***This code is a test to try to talk to the helix server***
   cfg=cfg+"clip: {"+
       "url: '"+urlToUse+"',"+
       "provider: 'strm',"+
       "autoPlay: false"+
       "},"+
       "plugins: {"+
       "strm: {"+
       "url: '"+vresourcePath+"flowplayer/flowplayer.rtmp.swf',"+
       "netConnectionUrl: '"+urlToUse+"',"+
       "objectEncoding: 0"+
       "}}";
*/
  }
  else
   cfg=cfg+"clip: {autoPlay:false, scaling:'fit', url:'"+urlToUse+"'}";

  //alert(cfg);

  setTimeout("flowplayer('flowPlayer', '"+vresourcePath+"flowplayer/flowplayer.swf', {"+cfg+"});", 500);
  return "<div id='flowPlayer' style='width:"+width+"px;height:"+height+"px;'></div>\n";
 }

 this.getPlayer=getPlayer;
 function getPlayer()
 {
  return $f("flowPlayer");
 }

 this.setPosition=setPosition;
 function setPosition(pos)
 {

  /***Adjust so that we always go to the key frame ahead of the specified position***/
  pos=pos+1500;

  getPlayer().seek(pos/1000);
 }

 this.getPosition=getPosition;
 function getPosition()
 {
  if (typeof(getPlayer())!="undefined" && getPlayer()!=null)
  {
   return parseInt(getPlayer().getTime()*1000);
  }
  else
   return -1;
 }

 this.stopPlayer=stopPlayer;
 function stopPlayer()
 {
  getPlayer().pause();
 }

 this.startPlayer=startPlayer;
 function startPlayer()
 {
  getPlayer().play();
 }

 this.label=label;
 function label()
 {
  return getString("flashvideo")+getVideoSpeed(this.speed);
 }

 this.controllable=controllable;
 function controllable()
 {
   return true;
 }

 this.isValid=isValid;
 function isValid()
 {
  if (hasFlash)
   return true;
  else
   return false;
 }

 this.useTimeMonitor=useTimeMonitor;
 function useTimeMonitor()
 {
   return true;
 }

 this.disableMessage=disableMessage;
 function disableMessage()
 {
  return getString("pluginnotfound");
 }
}

/****This video wrapper uses the HTML 5 video tag to play videos*****/
function HTML5Video(url, speed)
{
 this.url=url;

 if (typeof(speed)=="undefined")
  this.speed=SPEED_NONE;
 else
  this.speed=speed;

 this.type=VIDEO_HTML5;

 this.subtype="???";
 this.mimetype="video/unknown";
 var u=this.url.toLowerCase();
 if (u.indexOf(".webm")>-1)
 {
  this.subtype="WEBM";
  this.mimetype="video/webm";
 }
 else
 if ( u.indexOf(".ogv")>-1 || u.indexOf(".ogm")>-1)
 {
  this.subtype="OGV";
  this.mimetype="video/ogg";
 }
 else
 if (u.indexOf(".mp4")>-1 || u.indexOf(".mpeg4")>-1)
 {
  this.subtype="MPEG4";
  this.mimetype="video/mp4";
 }
 else
 if (u.indexOf(".mp3")>-1)
 {
  this.subtype="MP3";
  this.mimetype="audio/mpeg";
 }
 else
 if (u.indexOf(".ogg")>-1 || u.indexOf(".oga")>-1)
 {
  this.subtype="OGA";
  this.mimetype="audio/ogg";
 }
 else
 if (u.indexOf(".mpd")>-1)
 {
  this.subtype="DASH";
  this.mimetype="application/dash+xml";
 }

 this.getHTML=getHTML;
 function getHTML()
 {
  var x="<iframe class=\"video\" style=\"width:"+avWidth+"px;height:"+(avHeight+10)+"px;margin-bottom:-4px;padding:0px;\" name=\"html5vid\" />";
  setTimeout("html5vid.document.writeln(\""+this.getIFrameHTML()+"\");", 800);
  return x;
 }

 this.getIFrameHTML=getIFrameHTML;
 function getIFrameHTML()
 {
  var urlToUse;
  if (this.url.indexOf("http://")>-1 || this.url.indexOf("https://")>-1)
   urlToUse=this.url;
  else
   urlToUse=baseRef+this.url;

  var tagType="video";
  if (this.subtype=="MP3" || this.subtype=="OGA")
   tagType="audio";

  var x="<!DOCTYPE html>"+
   "<html>"+
   "<head>"+
   "<title>HTML 5 video/audio</title>";

   if (this.subtype=="DASH")
       x=x+"<script  type='text/javascript' src='"+vresourcePath+"dash.all.js'></script>";

   x=x+"</head>"+
   "<body style='margin:0px;padding:0px;'";

   x=x+">"+
   "<"+tagType+" style='background-color:#000000;background-image:url("+vresourcePath+"images/video-placehold.jpg);"+
   " background-repeat:no-repeat;background-size:100%;margin-left:auto;margin-right:auto;margin-top:0px;"+
   " width:"+avWidth+"px;height:"+avHeight+"px;'";

   if (this.subtype=="DASH")
       x=x+" class='dashjs-player' preload='none'";
   else
       x=x+" preload='preload'";

   x=x+" controls='controls' id='html5player' width='"+avWidth+"' height='"+avHeight+"' >"+
   "<source src='"+urlToUse+"' type='"+this.mimetype+"' />"+
   "<p style='color:#ffffff;text-align:center;'>"+getString("nohtml5")+"</p>"+
   "</"+tagType+">";

   if (this.subtype=="DASH")
    x=x+"<script type='text/javascript'>Dash.createAll();</script>";

   x=x+"</body>"+
   "</html>";

  return x;
 }

 this.getPlayer=getPlayer;
 function getPlayer()
 {
  return html5vid.document.getElementById("html5player");
 }

 this.setPosition=setPosition;
 function setPosition(pos)
 {
  var player=this.getPlayer()
  if (typeof(player)!="undefined" && typeof(player.currentTime)!="undefined")
   player.currentTime=pos/1000;
 }

 this.getPosition=getPosition;
 function getPosition()
 {
  var player=this.getPlayer();
  /***IE persistently throws errors when doing the typeof checks here, so they need to 
   be suppressed in order to avoid killing the position monitor thread***/
  try
  {
   if (typeof(player)!="undefined")
    if (typeof(player.currentTime)!="undefined")
     if (player.currentTime!=null)
      return parseInt(player.currentTime*1000);
  }
  catch (e)
  {}

  return -1;
 }

 this.stopPlayer=stopPlayer;
 function stopPlayer()
 {
  var player=this.getPlayer()
  if (typeof(player)!="undefined")
   player.pause();
 }

 this.startPlayer=startPlayer;
 function startPlayer()
 {
  var player=this.getPlayer()
  if (typeof(player)!="undefined")
   player.play();
 }

 this.label=label;
 function label()
 {
  return getString("html5video")+" (HTML5/"+this.subtype+")";
 }

 this.controllable=controllable;
 function controllable()
 {
  return true;
 }

 this.isValid=isValid;
 function isValid()
 {
  var v = document.createElement("video");
  var u=this.url.toLowerCase();

  if (ostype==IOS && this.subtype=="MPEG4")
  {
   return true;
  }

  if (typeof(v.canPlayType)!="function")
   return false;

  if (this.subtype=="DASH")
  {
   window.MediaSource = window.MediaSource || window.WebKitMediaSource;
   return window.MediaSource;
  }

  if (v.canPlayType(this.mimetype+";"))
   return true;

  var a = document.createElement("audio");
  if (a.canPlayType(this.mimetype+";"))
   return true;

  return false;
 }

 this.useTimeMonitor=useTimeMonitor;
 function useTimeMonitor()
 {
  return true;
 }

 this.disableMessage=disableMessage;
 function disableMessage()
 {
  return getString("nohtml5");
 }
}

/*****Gets the video speed*****/

function getVideoSpeed(s)
{
 if (s==SPEED_NONE)
  return "";
 else
  return " ("+getString("speed"+s)+")";
}

/**Gets a flash auth token**/

function getFlashAuth()
{
 var xmlDoc=null;

 if (typeof window.ActiveXObject != 'undefined' )
  xmlDoc = new ActiveXObject("Microsoft.XMLHTTP");
 else
  xmlDoc = new XMLHttpRequest();

 var loc=flashAuthUrl;
 if (loc.indexOf("?")<0)
  loc=loc+"?";
 else
  loc=loc+"&";

 loc=loc+"flashauthonly=1";
 xmlDoc.open("GET", loc , false);
 xmlDoc.send( null );
 return xmlDoc.responseText;
}

/*****Error/Message handling*****/

function showMessage(x)
{
 for (var loop=60; loop<x.length; loop=loop+60)
  for (var innerLoop=loop; innerLoop<x.length; innerLoop++)
  {
   if (x.charAt(innerLoop)==' ')
   {
    x=x.substring(0, innerLoop)+"\n"+x.substring(innerLoop+1);
    break;
   }
   if (x.charAt(innerLoop)=='\n' || x.charAt(innerLoop)=='\r')
    break;
  }

 alert(x);
}

/******Legacy event methods*****/

function goToSlide(num)
{
 setPosition(num, 0);
}

function setSlideIfSync(num)
{
 setPosition(num, 0);
}

/*****Some debug code*****/

function inspect(obj, maxLevels, level)
{
  var str = '', type, msg;

    // Start Input Validations
    // Don't touch, we start iterating at level zero
    if(level == null)  level = 0;

    // At least you want to show the first level
    if(maxLevels == null) maxLevels = 1;
    if(maxLevels < 1)     
        return '<font color="red">Error: Levels number must be > 0</font>\n';

    // We start with a non null object
    if(obj == null)
    return '<font color="red">Error: Object <b>NULL</b></font>\n';
    // End Input Validations

    // Each Iteration must be indented
    str += '<ul>\n';

    // Start iterations for all objects in obj
    for(property in obj)
    {
      try
      {
          // Show "property" and "type property"
          type =  typeof(obj[property]);
          str += '<li>(' + type + ') ' + property + 
                 ( (obj[property]==null)?(': <b>null</b>'):('')) + '</li>\n';

          // We keep iterating if this property is an Object, non null
          // and we are inside the required number of levels
          if((type == 'object') && (obj[property] != null) && (level+1 < maxLevels))
          str += inspect(obj[property], maxLevels, level+1);
      }
      catch(err)
      {
        // Is there some properties in obj we can't access? Print it red.
        if(typeof(err) == 'string') msg = err;
        else if(err.message)        msg = err.message;
        else if(err.description)    msg = err.description;
        else                        msg = 'Unknown';

        str += '<li><font color="red">(Error) ' + property + ': ' + msg +'</font></li>\n';
      }
    }

      // Close indent
      str += '</ul>\n';

    return str;
}




// **********************************************
// ***********Deprecated video types*************


/*****Silverlight Video control class*****/
function SilverlightVideo(url,speed)
{
}

/*****VLC control class*****/
function VLCVideo(url,speed)
{
}

/*****Quicktime control class*****/
function QuicktimeVideo(url,speed, useMonitor)
{
}

/*****JavaAudio control class*****/
function JavaAudio(url,speed)
{
}

/*****Windows Media control class*****/
function WindowsMediaVideo(url,speed,useMonitor)
{
}

/*****RealPlayer control class*****/
function RealPlayerVideo(url,speed,useMonitor)
{
}

/*****Flash Video control class for live broadcasts*****/
function FlashVideoBroadcast(url)
{
}

// Redundant config methods.

function setFlowPlayerVersion(fpv)
{
}

function setEnableHTML5(h)
{
}