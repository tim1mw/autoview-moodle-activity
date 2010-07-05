/*************************************************************************

   Copyright: EuroMotor-AutoTrain LLP 2007

   License: GPLv2 + Commercial

   Authors: Tim Williams (tmw@autotrain.org)

*************************************************************************/

/*****Server defaults*****/
var REALPLAYER_SERVER="http://video.autotrain.org.uk/ramgen/";
var WINDOWSMEDIA_SERVER="http://video.autotrain.org.uk/asxgen/";
var MPEG4_SERVER="http://darwin.autotrain.org.uk";

/*****Video types*****/

var VIDEO_NONE=0;
var VIDEO_REALPLAYER=1;
var VIDEO_QUICKTIME=2;
var VIDEO_JAVAAUDIO=3;
var VIDEO_WINDOWSMEDIA=4;
var VIDEO_VLC=5;
var VIDEO_FLASH=6;
var VIDEO_SILVERLIGHT=7;
var VIDEO_FLASHBROADCAST=8;
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
var LINUX=1, WINDOWS=2, SUNOS=3, APPLEMAC=4;
var MOZILLA=1, MSIE=2, OPERA=3, KONQUEROR=4, SAFARI=5, CHROME=6;

/*****Some Standard Variables*****/

var VERSION="3.18";

var VIDEOLEFT=false;
var VIDEORIGHT=true;

var videoPosition=VIDEOLEFT;
var pauseAfterSlide=false;

var message="<h1 align=\"center\"><a href=\"http://www.autotrain.org/services/autoview.shtml\" target=\"_blank\">"+
 "AutoView "+VERSION+"</a></h1>";
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
var qtRefURL="";
var xmlSubtitle="";
var baseRef="";
var baseRefSet=false;

var flashServer="", flashHost="", flashCapture="";
var preferedLang="en";
var user="";

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
var thumbImageWidth, thumbImageHeight, subtitileWidth;
var fullLangOptions=false, fullVideoOptions=false, fullSlideOptions=false, subtitlesActive=false, slideSync=true, subSync=true; thumbnailsActive=false;
var thumbnailsActiveDefault=false, noSuitableSlides=false, noSuitableThumbnails=true, subtitlesActiveDefault=false;
var langList;
var videoSet=false, slideSet=false, subtitleSet=false;
var monitor;
var mozpluggerBreaksReal=false, hasMozPlugger=false;
var hideVideo=false;
var blockReal=false;

var showVideoControls=true, showSlideControls=true, showSubtitleControls=true, showLanguageControls=true, showPositionControls=true,
    showSlideMenu=true, showOtherControls=true, showThumbnailControls=true, alwaysHideExit=false;

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

  document.writeln("  <div align=\"center\"><table class=\"display-noslides\" summary=\"Layout table\"><tr>\n"+
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
   "   <td align=\"center\" valign=\"top\" colspan=\"3\">&nbsp;</td>\n"+
   "  </tr><tr>\n"+
   "   <td align=\"center\" valign=\"top\" colspan=\"3\"><div id=\"subtitles\"></div></td>\n"+
   "  </tr></table></div>\n");
 }
 else
 {
  document.writeln("<div align=\"center\"><table class=\"display-noslides\" summary=\"Layout table\"><tr>\n");
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

function printExtraHTML()
{
 document.writeln("  <!-- Legacy event method for Autoview 2 encoded RealPlayer files -->\n"+
  "  <iframe class=\"hiddenframe\" name=\"video\" src=\""+vresourcePath+"real.html\" id=\"video\">\n"+
  "  </iframe>\n"+
  "  <!-- End of legacy support -->\n"+
  "  <iframe class=\"hiddenframe\" name=\"jsFileLoader\"></iframe>\n");
}

/*****Methods for changing default parameters*****/

function findBaseRef()
{
 var docURL=document.URL;

 /**IE uses \ instead of / if we are running on the local file system, which mucks things up.
    so convert all the \'s to / **/
 if (document.URL.indexOf("file:/")>-1 && browser==MSIE)
 {
  var nDocURL=docURL.replace("\\", "/");;
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

function setQTRefURL(qt)
{
 qtRefURL=qt;
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

function setUser(u)
{
 user=u;
}

function setPreferedLang(pfl)
{
 preferedLang=pfl;
}

function setBlockReal(br)
{
 blockReal=br;
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
   times[lang]=new Array();
 }
}

function addAVSource(lang, source)
{
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

 if (blockReal)
 {
  if (hasRealPlayer || findPlugin("realplayer"))
  {
   document.writeln("<p>Browsers with Real Player installed are not allowed to view this presentation because of the presence of the "+
    "'Download this Video' function in Real Player. "+
    "In order to access this presentation, please disable the Real Player plugin in your browser.</p>"+
    "<p><b>Firefox</b> users can disable the Real Player plugin without having to remove it completely by clicking on the Tools>Add-ons "+
    "menu option, selecting the plugins option and then by disabling the various Real Player plugins listed on the resulting page.</p>"+
    "<p><b>Internet Exploere</b> users should click the Tools>Internet Options menu, select the Programs tab and the click the Manage Add-ons button. "+
    "You should then be able to select and disable the Real Player G2 control from the plugins list. You may need to show all add-ons for "+
    " the control to be shown on the add-ons list.</p>"+
    "<p>You can remove Real Player from your computer completely by following the instructions on "+
    "<a target='_blank' href='http://www.bbc.co.uk/radio/help/faq/uninstall_realplayer.shtml'>http://www.bbc.co.uk/radio/help/faq/uninstall_realplayer.shtml</a>.</p>");
   return;
  }
 }

 calculateFrameSize();

 /*****If there are no slides, increase the video size*****/
 if (slideSet==false && videoWidth<1)
  setStandaloneVideoSize();

 subtitleSettings();
 detectBrowser();
 if (baseRefSet==false)
  baseRef=findBaseRef();

 calculateDisplaySize();

 if (printHTML)
 {
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
 if( typeof( window.innerWidth ) == 'number' )
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
}

function calculateDisplaySize()
{
 /*****If less than 1, then we have a need to calculate video size based on a proportion of screen size*****/
 if (videoWidth>1)
 {
  avWidth=videoWidth;
  avHeight=videoHeight;
 }
 else
 {
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

 setElementHTML("thumbnails", "<iframe name=\"thumbnailsframe\" width=\""+thumbWidth+"\" height=\""+thumbHeight+"\" marginheight=\"0\" "+
  " frameborder=\"0\" marginwidth=\"0\" ></iframe>\n");

 /****Thumbnails occasionally aren't set in mozilla, things are probably happening to quickly, so set a small timeout*****/
 if (browser==MOZILLA)
  setTimeout("getThumbnailsFrame().document.writeln(selectedSlides.getAllThumbnails());", 1000);
 else
  getThumbnailsFrame().document.writeln(selectedSlides.getAllThumbnails());
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
 if (videoSet==false || avSrc[avLang].length<2 || showVideoControls==false)
 {
  setElementHTML("videocontrols", "");
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
   "<a href=\"javascript:setHideVideo(false);\" class=\"linkbutton\">"+getString("showvideo")+"</a></td>\n"+
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
   str="<table class=\"menulayout\"><tr><td class=\"menulayoutcell\">"+getSlideSizeCode()+"</td></tr></table>";
  else 
   str="<table class=\"menulayout\"><tr><td class=\"menulayoutcell\"><h2><a href=\"javascript:showFullSlide(true);\""+
    " class=\"linkbutton\" title=\""+getString("showslideopts")+"\">+</a>"+
    "&nbsp;"+getString("slideopts")+"</h2></td></tr></table>";
 }

 setElementHTML("slidecontrols", str);
}

function getSlideSizeCode()
{
 return " <tr><td class=\"menulayoutcell\">\n"+
    "  <h3 align=\"left\">&nbsp;"+getString("slidesize")+"</h3>\n"+
    " </td><td class=\"menulayoutcell\" width=\"50%\">\n"+
    "  <a href=\"javascript:increaseSlideSize();\" class=\"linkbutton\" title=\""+getString("incslidesize")+"\">+</a>&nbsp;"+
    "<a href=\"javascript:decreaseSlideSize();\" class=\"linkbutton\" title=\""+getString("decslidesize")+"\">-</a>\n"+
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
  str=str+"<a href=\""+exitURL+"\" class=\"linkbutton\" title=\""+getString("exittitle")+"\">"
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
  str=str+" <option>"+(loop+1)+" : "+titles[slideLang][loop]+"</option>\n";

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

 /*****If this is a mac browser, look for quicktime by preference*****/
 if (ostype==APPLEMAC)
 {
  for (var loop=0; loop<avSrc[avLang].length; loop++)
   if (avSrc[avLang][loop].isValid() && avSrc[avLang][loop].type==VIDEO_QUICKTIME)
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

 /*****VLC Source Substitution*****/
 if (hasVLC && !editing)
  for (var loop=0; loop<avSrc[avLang].length; loop++)
  {
   if (avSrc[avLang][loop].type==VIDEO_QUICKTIME || avSrc[avLang][loop].type==VIDEO_WINDOWSMEDIA || avSrc[avLang][loop].type==VIDEO_FLASH)
   {
     var source=new VLCVideo(avSrc[avLang][loop].url, avSrc[avLang][loop].speed);
     addAVSource(avLang, source);
     if (typeof(selectedAVSource)=="undefined")
      selectedAVSource=source;
   }
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
 setSlide(currentSlide+1, true);
}

function previousSlide()
{
 setSlide(currentSlide-1, true);
}

function setSlide(pos, moveVideo)
{
 var last=currentSlide;
 if (slideSet==false)
  return;

 if (pos>titles[slideLang].length)
  pos=titles[slideLang].length;

 if (pos<1)
  pos=1;

 if (currentSlide==pos)
  return;

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
  selectedAVSource.setPosition(times[avLang][currentSlide-1]+1);

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
 if (selectedAVSource.type==VIDEO_WINDOWSMEDIA)
  setSlide(currentSlide+1, true);
 else
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
 if (selectedAVSource.type==VIDEO_WINDOWSMEDIA && browser==MSIE)
  pos=currentVideoTime;
 setCookie("autoview3_position", pos, null);
 setPositionControl();
}

function loadAVPosition()
{
 var positionCookie=getCookie("autoview3_position");
 if (positionCookie!=null)
  selectedAVSource.setPosition(positionCookie);
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

 //if (selectedAVSource.type==VIDEO_JAVAAUDIO && subtitlesActive==true)
 // showMessage(getString("javaaudiosubtitles"));

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

var hasQuicktime=false, hasRealPlayer=false, hasJavaPlugin=false, hasFlash=false, hasAcrobat=false, hasWindowsMedia=false, vbDetectOK=false,
hasVLC=false, hasSilverlight=false;
var qtVersion, realVersion, wmVersion=0;

function detectPlugins()
{
 if (vbDetectOK==false) 
 {
  hasMozPlugger=findPlugin("mozplugger");
  hasRealPlayer=findPlugin("realplayer");
  hasQuicktime=findPlugin("quicktime");
  hasJavaPlugin=findPlugin("java");
  hasFlash=findPlugin("shockwave flash");
  hasSilverlight=findPlugin("silverlight");
  hasVLC=findPlugin("vlc multimedia");
  hasAcrobat=findPlugin("adobe acrobat");
  if (hasAcrobat==false)
   hasAcrobat=findPlugin("adobe reader");
  if (hasAcrobat==false)
   hasAcrobat=findPlugin("nppdf.so");
 }
 else
  wmVersion=parseInt(wmVersion);

 if ( (browser==MSIE || browser==KONQUEROR || browser==OPERA || browser==CHROME) && hasJavaPlugin==false)
   hasJavaPlugin=navigator.javaEnabled();

 /*****Disable plugins for browsers where they are known not to work*****/

 if (ostype==LINUX || ostype==SUNOS)
 {
  /*****Make sure we have a recent version of the unix real player. Older ones don't work properly*****/
  if (findPlugin("Helix DNA") || findPlugin("RealPlayer(tm) G2 LiveConnect-Enabled Plug-In (32-bit)"))
   hasRealPlayer=true;
  else
   hasRealPlayer=false;

  /*****Real Player fails in Opera/Konqueror on unix*****/
  if (browser==OPERA || browser==KONQUEROR)
   hasRealPlayer=false;
 }

 /*****Check slide interaction controls for non-ie browsers*****/
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
   hasFlash=false;
  else
  {
   /*****Note : GotoFrame check dosn't seem to work in opera or FF3, so ignore*****/
   if (browser!=OPERA && (browser!=MOZILLA && browserVersion<3) && typeof(window.document.flashtest.GotoFrame)=="undefined")
    hasFlash=false;
  }
 }

 /*****Find Plugin Versions*****/
 for (var loop=0; loop<navigator.plugins.length; loop++)
 {
  /*****This works for the windows plugin*****/
  if (navigator.plugins[loop].name.indexOf("RealPlayer Version Plugin")>-1)
   realVersion=navigator.plugins[loop].description;
  else
  if (navigator.plugins[loop].name.indexOf("Helix DNA Plugin:")>-1)
  {
   var i=navigator.plugins[loop].description.indexOf("version ");
   var j=navigator.plugins[loop].description.indexOf(" built with");
   realVersion=navigator.plugins[loop].description.substring(i+8,j);
  }
  else
  if (navigator.plugins[loop].name.indexOf("QuickTime")>-1)
  {
   var i=navigator.plugins[loop].name.lastIndexOf("Plug-in ")+8;
   qtVersion=navigator.plugins[loop].name.substring(i);
   var index=qtVersion.indexOf(".");
   while(index>0)
   {
    qtVersion=qtVersion.substring(0,index)+qtVersion.substring(index+1);
    index=qtVersion.indexOf(".");
   }
   i=qtVersion.indexOf(" ");
   if (i>0)
    qtVersion=qtVersion.substring(0,i);
   qtVersion=parseInt(qtVersion);
   if (qtVersion<10)
    qtVersion=qtVersion*100;
   if (qtVersion<100)
    qtVersion=qtVersion*10;
   qtVersion=qtVersion*10000;
  }
 }

 if (typeof(qtVersion)=="string")
  qtVersion=parseInt(qtVersion);

 /*****Check for mozplugger*****/
 
 if (ostype==LINUX && hasMozPlugger && hasRealPlayer)
 {
  for (var loop=0; loop<navigator.mimeTypes.length; loop++)
  {
   if (navigator.mimeTypes.item(loop).type=="audio/x-pn-realaudio-plugin")
   {
    if (navigator.mimeTypes.item(loop).enabledPlugin.name.indexOf("RealPlayer")>-1)
     break;
    if (navigator.mimeTypes.item(loop).enabledPlugin.name.indexOf("MozPlugger")>-1)
    {
     mozpluggerBreaksReal=true;
     break;
    }
   }
  }
 }
}

function findPlugin(toFind)
{
 toFind=toFind.toLowerCase();
 for (var loop=0; loop<navigator.plugins.length; loop++)
 {
  //alert(navigator.plugins[loop].name);
  if (navigator.plugins[loop].name.toLowerCase().indexOf(toFind)>-1)
   return true;
 }

 return false;
}

/******Browser detection routine*****/

function detectBrowser()
{
 var userAgent=navigator.userAgent.toLowerCase();

 if (userAgent.indexOf("linux")>-1)
  ostype=LINUX;
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

  if (slide>-1 && slide!=monPosSlide && slideSync==true)
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

  if (selectedAVSource.type==VIDEO_VLC)
   selectedAVSource.updateTimeDisplay();
  }
  catch (e)
  {
   Components.utils.reportError("Error in monitoring thread "+e);
  }
}

function findCurrent(pos, data)
{
 if (typeof(data)=="undefined")
  return -1;

 for (var loop=data.length; loop>0; loop--)
 {
  var f=data[loop-1];
  if (typeof(f)=="undefined")
   f=90000000000;
  var s=data[loop];
  if (typeof(s)=="undefined")
   s=90000000000;
  if (pos>=f && pos<s)
   return loop;
 }

 return 0;
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
  var str = str+'<img src="' + slideSrcName + 
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
  window.document.slideImage.src = cacheImages[slide].src;
 }

 this.getHTML=getHTML;
 function getHTML()
 {
  if (this.preLoadDone)
   return '<img src="' + cacheImages[currentSlide].src + 
   '" name="slideImage" width="' + widths[slideScale-1] + '" height="' + heights[slideScale-1] + 
   '" border="0" alt="Slide Display">\n';

  var str="<br /><h3 align=\"center\">"+getString("preloadmessage1")+"</h3><br />\n"+
   "<h3 align=\"center\">("+getString("preloadmessage2")+")</h3><br />\n"+
   "<h3><span id=\"slidenum\"></span></h3>\n";

  str=str+" <p align=\"center\"><img src=\""+vresourcePath+"images/transparent.gif\" name=\"preload\""+
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
    if (langRTL[selectedLang]==true)
     setElementHTML("slidenum", times[avLang].length+" "+getString("preloadmessage4")+"&nbsp;"+preLoadCount+"&nbsp;"+getString("preloadmessage3")+"</h3>\n");
    else
     setElementHTML("slidenum", getString("preloadmessage3")+"&nbsp;"+preLoadCount+"&nbsp;"+getString("preloadmessage4")+" "+titles[slideLang].length+"</h3>\n");
   }
   else
    cacheImages[preLoadCount].src=getSlideFileName(preLoadCount, slideScale);

   setTimeInterval(50); 
  }
  else
  {
   this.preLoadDone=true;
   setElementHTML("slides", '<img src="' + cacheImages[currentSlide].src + 
    '" name="slideImage" width="' + widths[slideScale-1] + '" height="' + heights[slideScale-1] + 
    '" border="0" alt="Slide Display">\n');
   preLoadCount=0;
   slideLoadFinished(); 
  }
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
  if (typeof(s)=="undefined" || typeof(s.GotoFrame)=="undefined")
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
  var data='type="application/x-shockwave-flash" data="'+this.url+'"\n';
  if (browser==MSIE)
   data='classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"\n'+     
   'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"';

  return '<object '+data+
   ' width="'+w+'" height="'+h+'" id="flashSlides">\n'+
   ' <param name="movie" value="'+this.url+'" />\n'+ 
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
  if (typeof(s)=="undefined" || typeof(s.GotoFrame)=="undefined")
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
  var str="<div id=\"slidePreload\">\n"+
          "<h3 align=\"center\">"+getString("preloadmessage1")+"</h3>\n"+
          "<p align=\"center\">"+getString("preloadmessage2")+"</p>\n"+
          "<table align=\"center\" style=\"width:"+slideWidth+"px;\"><tr><td><span id=\"slidenum\"></span></td></tr></table>\n";

  str=str+"<br />\n"+
   "<div id=\"preloader\" style=\"margin-left:auto;margin-right:auto;\">"+pluginCode(slideWidth/2, slideHeight/2, getSlideFileName(1), 1)+"</div>\n"+
   "</div>\n";

  //for (loop=1; loop<titles[slideLang].length+1; loop++)
  // str=str+"\n<div id='singleFlashSlide"+loop+"' style='width:"+slideWidth+"px;height:"+slideHeight+"px;display:none;'>"+
  //  pluginCode(slideWidth, slideHeight, getSlideFileName(loop), loop)+"</div>";

  str=str+"\n<div id='singleFlashSlide' style='width:"+slideWidth+"px;height:"+slideHeight+"px;display:none;'></div>";

  setTimeInterval(250);
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
   var elementB=document.getElementById("singleFlashSlide1");
   elementB.style.display="block";
   return;
  }

  var e=document.getElementById("flashSlide"+this.preLoadSlide);
  var percentage=100;
  if (typeof(e)!="undefined" && typeof(e.PercentLoaded)!="undefined")
   percentage=e.PercentLoaded();

  if (percentage>99)
   this.preLoadSlide++;

  if (langRTL[selectedLang]==true)
   setElementHTML("slidenum", times[avLang].length+" "+getString("preloadmessage4")+"&nbsp;"+this.preLoadSlide+"&nbsp;"+getString("preloadmessage3")+"</h3>\n");
  else
   setElementHTML("slidenum", getString("preloadmessage3")+"&nbsp;"+this.preLoadSlide+"&nbsp;"+getString("preloadmessage4")+" "+titles[slideLang].length+"</h3>\n");

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
  return hasFlash;
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
 if (autoStart && editing==false)
 {
  //selectedAVSource.startPlayer();
  setTimeout("selectedAVSource.startPlayer();", 1000);
  autoStart=false;
 }
 else
  setTimeout("selectedAVSource.stopPlayer();", 1000);
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

/*****RealPlayer control class*****/

function RealPlayerVideo(url,speed,useMonitor)
{
 this.url=url;
 if (typeof(speed)=="undefined")
  this.speed=SPEED_NONE;
 else
  this.speed=speed;

 if (typeof(useMonitor)=="undefined")
  this.useMonitor=false;
 else
  this.useMonitor=useMonitor;

 this.type=VIDEO_REALPLAYER;
 this.nosyncwarn=false;

 this.getHTML=getHTML;
 function getHTML()
 {
  var playerHeight=avHeight;
  var playerWidth=avWidth;

  var auto="false";
  if (autoStart && slideSet==false)
   auto="true";

  /**For some reason Mozilla/Firefox crashes horribly with RealPlayer if we use object tags
     so use an embed tag here to fix this. Sorry standards fans**/
  if (browser==MOZILLA && ostype!=WINDOWS)
   return "<table class=\"rplayer\">\n" + 
    " <tr>\n" + 
    "  <td class=\"playerPanel\" id=\"playCell\" align=\"center\">\n"+ 
    "   <embed src=\""+this.url+"\" type=\"audio/x-pn-realaudio-plugin\" name=\"rplayer\" id=\"playObj\" \n"+
    "    controls=\"ImageWindow\" width=\""+playerWidth+"\" height=\""+playerHeight+"\" console=\"one\""+
    "    pluginspage=\"http://www.real.com/\">\n"+
    "  </td>\n"+
    " </tr><tr>\n"+ 
    "  <td class=\"playerPanel\" align=\"center\">\n"+
    "   <embed src=\""+this.url+"\" type=\"audio/x-pn-realaudio-plugin\"\n"+
    "    controls=\"ControlPanel\" width=\""+playerWidth+"\" height=\"36\" console=\"one\">\n"+
    "   <br />\n"+
    "   <embed src=\""+this.url+"\" type=\"audio/x-pn-realaudio-plugin\"\n"+
    "    controls=\"PositionField\" width=\""+playerWidth+"\" height=\"26\" console=\"one\">\n"+
    "  </td>\n"+
    " </tr>\n"+
    "</table>";  

  var data=' type="audio/x-pn-realaudio-plugin" data="'+url+'"';
  if (browser==MSIE)
   data='classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA"';

  return "<table class=\"rplayer\">\n" + 
   " <tr>\n" + 
   "  <td class=\"playerPanel\" id=\"playCell\" align=\"center\">\n" + 
   "   <object id=\"rplayer\" "+data+" controls=\"ImageWindow\" console=\"one\" \n"+
   "    width=\""+playerWidth+"\" height=\""+playerHeight+"\">\n"+
   "    <param name=\"src\" value=\""+this.url+"\" />\n"+
   "    <param name=\"controls\" value=\"ImageWindow\" />\n"+
   "    <param name=\"autostart\" value=\""+auto+"\" />\n"+
   "    <param name=\"console\" value=\"one\" />\n"+
   "   </object>\n"+
   "  </td>\n"+
   " </tr><tr>\n"+ 
   "  <td class=\"playerPanel\" align=\"center\">\n"+
   "   <object id=\"rvocx\" "+data+" controls=\"ControlPanel\" console=\"one\"\n"+
   "    width=\""+playerWidth+"\" height=\"36\">\n"+
   "    <param name=\"controls\" value=\"ControlPanel\" />\n"+
   "    <param name=\"console\" value=\"one\" />\n"+
   "   </object>\n"+
   "   <br />\n"+
   "   <object id=\"rvocx\" "+data+" controls=\"PositionField\" console=\"one\"\n" +
   "    width=\""+playerWidth+"\" height=\"26\">\n"+
   "    <param name=\"controls\" value=\"PositionField\" />\n"+
   "    <param name=\"console\" value=\"one\" />\n"+
   "   </object>\n"+
   "  </td>\n"+
   " </tr>\n"+
   "</table>";
 }

 this.getPlayer=getPlayer;
 function getPlayer()
 {
  return window.document.rplayer;
 }

 this.setPosition=setPosition;
 function setPosition(pos)
 {
  var player = this.getPlayer();
  if (!player)
   return;

  if (typeof(player.CanPlay)!="undefined")
  {
   //var paused=false;
   //if (player.GetPlayState()==0  || player.GetPlayState()==4)
   //{
    //player.DoPlay();
    //paused=true;
   //}
   player.SetPosition(pos);
   //if (paused)
   // player.DoPause();
  }
  else
   if (this.nosyncwarn==false)
   {
    this.nosyncwarn=true;
    showMessage(getString("realsyncproblem"));
   }
 }

 this.getPosition=getPosition;
 function getPosition()
 {
  var player = this.getPlayer();
  return player.GetPosition();
 }

 this.stopPlayer=stopPlayer;
 function stopPlayer()
 {
  var player = this.getPlayer();
  if (typeof(player)!="undefined" && player.CanPause())
   player.DoPause();
 }

 this.startPlayer=startPlayer;
 function startPlayer()
 {
  var player = this.getPlayer();
  if (typeof(player)!="undefined" && player.CanPlay())
   player.DoPlay();
 }

 this.label=label;
 function label()
 {
  return getString("realplayer")+getVideoSpeed(this.speed);
 }

 this.controllable=controllable;
 function controllable()
 {
  return true;
 }

 this.isValid=isValid;
 function isValid()
 {
  if (hasRealPlayer && mozpluggerBreaksReal)
   return false;

  return hasRealPlayer;
 }

 this.useTimeMonitor=useTimeMonitor;
 function useTimeMonitor()
 {
  if (browser==SAFARI || browser==CHROME)
   return true;

  if (realVersion==null)
   return this.useMonitor;

  var index=realVersion.lastIndexOf(".");
  var realMajorVersion=realVersion.substring(0,index);
  var realMinorVersion=parseInt(realVersion.substring(index+1));

  if (this.useMonitor==false && realMajorVersion>="0.4.0" && realMinorVersion>=581
      && (ostype==LINUX || ostype==SUNOS || ostype==OTHER))
   return true;

  return this.useMonitor;
 }

 this.disableMessage=disableMessage;
 function disableMessage()
 {
  if (hasRealPlayer && mozpluggerBreaksReal)
   return getString("mozplugger");

  return getString("pluginnotfound");
 }
}

/*****Quicktime control class*****/

function QuicktimeVideo(url,speed, useMonitor)
{
 this.url=url;
 if (typeof(speed)=="undefined")
  this.speed=SPEED_NONE;
 else
  this.speed=speed;

 if (typeof(useMonitor)=="undefined")
  this.useMonitor=false;
 else
  this.useMonitor=useMonitor;

 this.type=VIDEO_QUICKTIME;

 this.getHTML=getHTML;
 function getHTML()
 {
  var width=avWidth;
  var height=avHeight+16;

  var auto="false";
  if (autoStart && slideSet==false)
   auto="true";

  var ref=this.url;
  if (this.url.indexOf("rtsp://")==0)
  {
   if (qtRefURL.length>0)
    ref=qtRefURL+ref;
   else
    showMessage(getString("qtrefmissing"));
  }
  //****Quicktime 7.6.4 has a bug which kills the video when streaming***/
  if (qtVersion==7640000)
   alert(getString("qt764bug"));

  var data='type="video/quicktime" data="'+ref+'"';
  if (browser==MSIE)
   data='classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" '+
    'codebase="http://www.apple.com/qtactivex/qtplugin.cab"';

  return '\n<object name="qtmovie" align="center" '+data+' width="'+width+'" height="'+height+'" class="plugintag">\n'+
   ' <param name="src" value="'+ref+'" />\n'+
   ' <param name="autoplay" value="'+auto+'" />\n'+
   ' <param name="controller" value="true" />\n'+
   ' <param name="scale" value="tofit" />\n'+
   ' <param name="EnableJavaScript" value="true" />\n'+
   '</object>\n';
 }

 this.getPlayer=getPlayer;
 function getPlayer()
 {
  return window.document.qtmovie;
 }

 this.setPosition=setPosition;
 function setPosition(pos)
 {
  if (pos<0)
   pos=0;

  var player=this.getPlayer();
  var rate=player.GetRate();
  if (rate!=0)
   player.Stop();

  player.SetTime((pos/1000)*player.GetTimeScale());

  if (rate!=0)
   player.Play();
 }

 this.getPosition=getPosition;
 function getPosition()
 {
  var player=this.getPlayer();
  if (typeof(player)!="undefined")
   return (player.GetTime()/player.GetTimeScale())*1000;
  else
   return -1;
 }

 this.stopPlayer=stopPlayer;
 function stopPlayer()
 {
  var player=this.getPlayer();
  if (player)
   player.Stop();
 }

 this.startPlayer=startPlayer;
 function startPlayer()
 {
  var player=this.getPlayer();
  if (player)
   player.Play();
 }

 this.label=label;
 function label()
 {
  return getString("quicktime")+getVideoSpeed(this.speed);
 }

 this.controllable=controllable;
 function controllable()
 {
  if (ostype==LINUX)
   return false;

  return true;
 }

 this.isValid=isValid;
 function isValid()
 {
  //Quicktime on linux is probably using crossover, this dosn't work with the time monitor, so disable plugin in these cases
  if (hasQuicktime && ostype==LINUX && this.useTimeMonitor && slideSet)
   return false;

  return hasQuicktime;
 }

 this.useTimeMonitor=useTimeMonitor;
 function useTimeMonitor()
 {
  //Fix the QT sync bug in 7.1.5 and greater by always using the time monitor
  if (qtVersion>=7150000 && this.useMonitor==false)
   this.useMonitor=true;

  return this.useMonitor;
 }

 this.disableMessage=disableMessage;
 function disableMessage()
 {
  if (hasQuicktime && ostype==LINUX && this.useTimeMonitor && slideSet &&!hasMozPlugger)
   return getString("qtlinux");
  else
   return getString("pluginnotfound");
 }
}

/*****JavaAudio control class*****/

function JavaAudio(url,speed)
{
 this.url=url;
 this.positionMessage=false;

 if (typeof(speed)=="undefined")
  this.speed=SPEED_NONE;
 else
  this.speed=speed;

 this.type=VIDEO_JAVAAUDIO;

 this.getHTML=getHTML;
 function getHTML()
 {
  var timesList="0,";
  if (typeof(times[slideLang])!="undefined" && times[slideLang].length!=0)
   for (var loop=1; loop<times[slideLang].length; loop++)
    timesList=timesList+(times[slideLang][loop]+',');

  var subTimesList="0,";
  if (typeof(subTimes[subtitleLang])!="undefined" && subTimes[subtitleLang].length!=0)
   for (var loop=1; loop<subTimes[subtitleLang].length; loop++)
    subTimesList=subTimesList+(subTimes[subtitleLang][loop]+',');

  if (browser==MSIE)
  {
   return '<object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93"\n'
    +' width="125" height="34" type="application/x-java-applet;jpi-version=1.4.0"\n'
    +' codebase="http://java.sun.com/products/plugin/autodl/jinstall-1_4-windows-i586.cab#Version=1,4,0,0">\n'
    +'<param name="archive" value="'+vresourcePath+'audio.jar , '+vresourcePath+'jogg-0.0.7.jar, '+vresourcePath+'jorbis-0.0.15.jar" />\n'
    +'<param name="java_code" value="AudioPresentation.class" />\n'
    +'<param name="audioSource" value="'+this.url+'" />\n'
    +'<param name="times" value="'+timesList+'" />\n'
    +'<param name="subtimes" value="'+subTimesList+'" />\n'
    +'<param name="type" value="application/x-java-applet;version=1.4.0" />\n'
    +'<param name="mayscript" value="true" />\n'
    +'</object>';
  }
  else
  {
   var x='<object width="125" height="34" classid="java:AudioPresentation.class" type="application/x-java-applet" \n'
    +'archive="'+vresourcePath+'audio.jar,'+vresourcePath+'jogg-0.0.7.jar,'+vresourcePath+'jorbis-0.0.15.jar"\n'
    +' mayscript>\n'
    +'<param name="archive" value="'+vresourcePath+'audio.jar , '+vresourcePath+'jogg-0.0.7.jar, '+vresourcePath+'jorbis-0.0.15.jar" />\n'
    +'<param name="audioSource" value="'+this.url+'" />\n'
    +'<param name="times" value="'+timesList+'" />\n'
    +'<param name="subtimes" value="'+subTimesList+'" />\n'
    +'<param name="mayscript" value="true" />\n'
    +'</object>';
   alert (x);
   return x;
  }
 }

 this.getPlayer=getPlayer;
 function getPlayer()
 {
  return "";
 }

 this.setPosition=setPosition;
 function setPosition(pos)
 {
  if (this.positionMessage==false)
  {
   this.positionMessage=true;
   showMessage(getString("javaaudiopositon"));
  }
 }

 this.getPosition=getPosition;
 function getPosition()
 {
  return 0;
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
  return getString("javaaudio")+getVideoSpeed(this.speed);
 }

 this.controllable=controllable;
 function controllable()
 {
  return false;
 }

 this.isValid=isValid;
 function isValid()
 {
  return hasJavaPlugin;
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

/*****Windows Media control class*****/

function WindowsMediaVideo(url,speed,useMonitor)
{
 this.url=url;

 if (typeof(speed)=="undefined")
  this.speed=SPEED_NONE;
 else
  this.speed=speed;

 if (typeof(useMonitor)=="undefined")
  this.useMonitor=false;
 else
  this.useMonitor=useMonitor;

 this.type=VIDEO_WINDOWSMEDIA;

 this.getHTML=getHTML;
 function getHTML()
 {
  if (wmVersion<7 && browser==MSIE)
   showMessage(getString("oldwindowsmedia"));

  var width=avWidth;
  var height=avHeight+70;

  /***The hidden frame below stops new windows from being opened if the video stream was created by MS Producer***/

  if (browser==MSIE)
   return '<script for="mediaPlayer" event="ScriptCommand(bstrType, bstrParam)" language="Jscript" type="text/javascript">\n'
    +' if (bstrType=="slideAdvance")\n'
    +'  setSlide(bstrParam,false);\n'
    +' if (bstrType=="subtitleAdvance")\n'
    +'  setSubtitle(bstrParam, false);\n'
    +'</script>\n'
    +'<object id="mediaPlayer" width="'+width+'" height="'+height+'"\n'
    +'classid="clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6"\n'
    +'standby="Loading Windows Media Player components..."\n'
    +'type="application/x-oleobject">\n'
    +' <param name="url" value="'+this.url+'" />\n'
    +' <param name="autoStart" value="False" />\n'
    +' <param name="uiMode" value="full" />\n'
    +'</object><iframe name="hiddenFrame" id="hiddenFrame" src="about:blank" style="visibility:hidden" width="0" height="0"></frame>\n';
  else
  {
   showMessage(getString("windowsmediaieonly"));
   return '<script for="mediaPlayer" event="ScriptCommand(bstrType, bstrParam)" language="Jscript" type="text/javascript">\n'
    +' if (bstrType=="slideAdvance")\n'
    +'  setSlide(bstrParam,false);\n'
    +' if (bstrType=="subtitleAdvance")\n'
    +'  setSubtitle(bstrParam, false);\n'
    +'</script>\n'
    +'<object type="application/x-mplayer2" id="mediaPlayer" height="'+height+'" width="'+width+'">\n'
    +' <param name="src" value="'+this.url+'" />\n'
    +' <param name="autoStart" value="False" />\n'
    +' <param name="uiMode" value="full" />\n'
    +'</object>\n';
  }
 }

 this.getPlayer=getPlayer;
 function getPlayer()
 {
  return document.mediaPlayer;
 }

 this.setPosition=setPosition;
 function setPosition(pos)
 {
  this.getPlayer().Controls.CurrentPosition=pos/1000;
 }

 this.getPosition=getPosition;
 function getPosition()
 {
  if (typeof(this.getPlayer())!="undefined")
   return this.getPlayer().Controls.CurrentPosition*1000;
  else
   return -1;
 }

 this.stopPlayer=stopPlayer;
 function stopPlayer()
 {
  var player=this.getPlayer();
  if (typeof(player)!="undefined")
   player.Controls.Pause();
 }

 this.startPlayer=startPlayer;
 function startPlayer()
 {
  var player=this.getPlayer();
  if (typeof(player)!="undefined")
   player.Controls.Play();
 }

 this.label=label;
 function label()
 {
  return getString("windowsmedia")+getVideoSpeed(this.speed);
 }

 this.controllable=controllable;
 function controllable()
 {
  return true;
 }

 this.isValid=isValid;
 function isValid()
 {
  if (hasWindowsMedia && wmVersion>=7)
   return true;
  else
   return false;
 }

 this.useTimeMonitor=useTimeMonitor;
 function useTimeMonitor()
 {
  return this.useMonitor;
 }

 this.disableMessage=disableMessage;
 function disableMessage()
 {
  return getString("pluginnotfound");
 }
}

/*****VLC control class*****/

function VLCVideo(url,speed)
{
 this.url=url;
 this.positionMessage=false;

 if (typeof(speed)=="undefined")
  this.speed=SPEED_NONE;
 else
  this.speed=speed;

 this.type=VIDEO_VLC;

 this.getHTML=getHTML;
 function getHTML()
 {
  var data=" type=\"application/x-vlc-plugin\" data=\""+this.url+"\" ";
  if (browser==MSIE)
   data="classid=\"clsid:E23FE9C6-778E-49D4-B537-38FCDE4887D8\" type=\"application/x-vlc-plugin\"\n"+
    " codebase=\"http://downloads.videolan.org/pub/videolan/vlc/latest/win32/axvlc.cab\"\n";

  var x="<table class=\"rplayer\"><tr><td class=\"playerPanel\">\n"+
   "<object "+data+" width=\""+avWidth+"\" height=\""+avHeight+"\" id=\"vlcvideo\">\n"+
   " <param name=\"Src\" value=\""+this.url+"\" />\n"+
   " <param name=\"ShowDisplay\" value=\"True\" />\n"+
   " <param name=\"AutoLoop\" value=\"False\" />\n"+
   " <param name=\"AutoPlay\" value=\"False\" />\n"+
   " <param name=\"version\" value=\"VideoLAN.VLCPlugin.2\" />\n"+
   "</object>\n"+
   "</td></tr><tr><td colspan=\"3\">\n"+
   " <a class=\"linkbutton\" href=\"javascript:;\" onclick='document.vlcvideo.playlist.play();'>"+getString("play")+"</a>&nbsp;\n"+
   " <a class=\"linkbutton\" href=\"javascript:;\" onclick='document.vlcvideo.playlist.togglePause();'>"+getString("pause")+"</a>&nbsp;\n"+
   " <a class=\"linkbutton\" href=\"javascript:;\" onclick='document.vlcvideo.playlist.stop();'>"+getString("stop")+"</a>\n"+
   "</td></tr><tr><td align=\"center\">\n"+
   " <table><tr>\n"+
   "  <td>\n"+
   "   <a class=\"linkbutton\" href=\"javascript:;\" onclick='document.vlcvideo.input.time=document.vlcvideo.input.time-60000;'>&lt;&lt;</a>&nbsp;"+
   "<a class=\"linkbutton\" href=\"javascript:;\" onclick='document.vlcvideo.input.time=document.vlcvideo.input.time-5000;'>&lt;</a>&nbsp;\n"+
   "  </td>\n"+
   "  <td style=\"margin-right:0px;padding-right:0px;\"><span id=\"vlctime\">0:00</span></td>\n"+
   "  <td style=\"margin-right:0px;padding-right:0px;margin-left:0px;padding-left:0px;\">/</td>\n"+
   "  <td style=\"margin-left:0px;padding-left:0px;\"><span id=\"vlclength\">0:00</span></td>\n"+
   "  <td>\n"+
   "   <a class=\"linkbutton\" href=\"javascript:;\" onclick='document.vlcvideo.input.time=document.vlcvideo.input.time+5000;'>&gt;</a>&nbsp;"+
   "<a class=\"linkbutton\" href=\"javascript:;\" onclick='document.vlcvideo.input.time=document.vlcvideo.input.time+60000;'>&gt;&gt;</a>\n"+
   "  </td>"+
   " </tr></table>\n"+
   "</td><tr></table>\n";

  if (browser==MSIE)
   showMessage(getString("vlc_notsupported"));

  return x;
 }

 this.updateTimeDisplay=updateTimeDisplay;
 function updateTimeDisplay()
 {
  setElementHTML("vlctime", processTime(getPlayer().input.time));
  setElementHTML("vlclength", processTime(getPlayer().input.length));
 }

 function processTime(t)
 {
  if (t<1000)
   return "0:00";
  t=parseInt(t/1000);
  var h=parseInt(t/60);
  var m=t-(h*60);
  if (m<10)
   m="0"+m
  return h+":"+m;
 }

 this.getPlayer=getPlayer;
 function getPlayer()
 {
  return document.vlcvideo;
 }

 this.setPosition=setPosition;
 function setPosition(pos)
 {
  getPlayer().input.time=pos;
 }

 this.getPosition=getPosition;
 function getPosition()
 {
  if (typeof(getPlayer())!="undefined")
   return getPlayer().input.time;
  else
   return -1;
 }

 this.stopPlayer=stopPlayer;
 function stopPlayer()
 {
  if (getPlayer().playlist.isPlaying)
   getPlayer().playlist.togglePause();
 }

 this.startPlayer=startPlayer;
 function startPlayer()
 {
  getPlayer().playlist.play();
 }

 this.label=label;
 function label()
 {
  return getString("vlcvideo")+getVideoSpeed(this.speed);
 }

 this.controllable=controllable;
 function controllable()
 {
  return true;
 }

 this.isValid=isValid;
 function isValid()
 {
  return hasVLC;
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
   urlToUse=baseRef+this.url;

  var x=this.getFlowPlayerHTML(urlToUse);
  //var x=this.getOVPHTML(urlToUse);

  return x;
 }

 this.getOVPHTML=getOVPHTML;
 function getOVPHTML(urlToUse)
 {
  var width=avWidth;
  var height=avHeight+22;

  var data='type="application/x-shockwave-flash" data="'+vresourcePath+'OVP.swf"\n';
  if (browser==MSIE)
   data='classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"\n'+     
   'codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"';

  if (this.url.indexOf("rtmp://")>-1)
   urlToUse=urlToUse+"?"+getFlashAuth();

  return '<object '+data+' width="'+width+'" height="'+height+'" id="ovpPlayer">\n'+
   ' <param name="movie" value="'+vresourcePath+'OVP.swf" />\n'+ 
   ' <param name="quality" value="high" />\n'+
   ' <param name="scale" value="noScale" />\n'+
   ' <param name="allowScriptAccess" value="always" />\n'+
   ' <param name="flashvars" value="showstatistics=false&playlistoverlay=false&muted=false&playlistoverlay=false&stretchmode=Fit&'+
   'stretchmodefullscreen=Fit&showchapters=false&mediasource='+urlToUse+'" />\n'+
   '<\/object>\n';
 }

 this.getFlowPlayerHTML=getFlowPlayerHTML;
 function getFlowPlayerHTML(urlToUse)
 {
  var width=avWidth;
  var height=avHeight+22;

  var data='type="application/x-shockwave-flash" data="'+vresourcePath+'FlowPlayer.swf"\n';
  if (browser==MSIE)
   data='classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"\n'+     
   'codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"';

  var cfg="loop:false, autoPlay: false, initialScale: 'fit'";

  if (this.url.indexOf("rtmp://")>-1)
  {
   var i=0;
   for (l=0; l<4 && i>-1; l++)
    i=urlToUse.indexOf("/", i+1);
   var file=urlToUse.substring(i+1);
   var server=urlToUse.substring(0,i);
   /*****Check if this is an AutoView Live capture recording and append access parameters*****/
   if (server.indexOf(flashServer)>-1)
    server=server+"?"+flashHost+"?"+getFlashAuth();

   cfg=cfg+", live: false, streamingServer: 'fms', streamingServerURL: '"+server+"', videoFile: '"+file+"'";
  }
  else
   cfg=cfg+", videoFile: '"+urlToUse+"'";

  if (slideSet)
   cfg=cfg+", showMenu:false";

  return '<object '+data+' width="'+width+'" height="'+height+'" id="flowPlayer">\n'+
   ' <param name="movie" value="'+vresourcePath+'FlowPlayer.swf" />\n'+ 
   ' <param name="quality" value="high" />\n'+
   ' <param name="scale" value="noScale" />\n'+
   ' <param name="allowScriptAccess" value="always" />\n'+
   ' <param name="flashvars" value="config={'+cfg+'}" />\n'+
   '<\/object>\n';
 }

 this.getFlowPlayer3HTML=getFlowPlayer3HTML;
 function getFlowPlayer3HTML(urlToUse)
 {
  if (this.jsLoaded==false)
  {
   var e = document.createElement("script");
   e.src = vresourcePath+"flowplayer/flowplayer-3.1.4.min.js";
   e.type="text/javascript";
   document.getElementsByTagName("head")[0].appendChild(e);
   this.jsLoaded=true;
  }

  var width=avWidth;
  var height=avHeight+18;

  var data='type="application/x-shockwave-flash" data="'+vresourcePath+'flowplayer/flowplayer-3.1.5.swf"\n';
  if (browser==MSIE)
   data='classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"\n'+     
   'codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"';

  var cfg="";
  var controls="controls:{fullscreen:'false', height:'18'}";

  if (this.url.indexOf("rtmp://")>-1)
  {
   var i=0;
   for (l=0; l<4 && i>-1; l++)
    i=urlToUse.indexOf("/", i+1);
   var file=urlToUse.substring(i+1);
   var server=urlToUse.substring(0,i);
   /*****Check if this is an AutoView Live capture recording and append access parameters*****/
   if (server.indexOf(flashServer)>-1)
    server=server+"?"+flashHost+"?"+getFlashAuth();

   cfg="plugins: { "+
        " rtmp: { "+
        "  url:'"+vresourcePath+"flowplayer/flowplayer.rtmp-3.1.3.swf', "+
        "  netConnectionUrl:'"+server+"', "+
        "  durationFunc:'getStreamLength' "+
        " }, "+
        controls+
        "},"+
        "clip: {"+ 
        " provider:'rtmp',"+
        " autoPlay:false, "+
        " url:'"+file+"' "+
        "}";
  }
  else
   cfg="clip:{autoPlay:false, scaling:'fit', url:'"+urlToUse+"'}";
  alert(cfg);
  setTimeout("flowplayer('flowPlayer', '"+vresourcePath+"flowplayer/flowplayer-3.1.5.swf', {"+cfg+"});", 500);

  return "<div id='flowPlayer' style='width:"+width+"px;height:"+height+"px;'></div>\n";;

  /*
  var x='<object '+data+' width="'+width+'" height="'+height+'" id="flowPlayer">\n'+
   ' <param name="movie" value="'+vresourcePath+'flowplayer/flowplayer-3.1.5.swf" />\n'+ 
   ' <param name="quality" value="high" />\n'+
   ' <param name="scale" value="noScale" />\n'+
   ' <param name="allowScriptAccess" value="always" />\n'+
   ' <param name="flashvars" value="config={'+cfg+'}" />\n'+
   '<\/object>\n';

  <object id="player2_api" data="/player/flowplayer-3.1.5.swf" type="application/x-shockwave-flash"
  height="100%" width="100%"><param name="allowfullscreen" value="true">
   <param name="allowscriptaccess" value="always">
   <param name="quality" value="high">
   <param name="cachebusting" value="false">
   <param name="bgcolor" value="#000000">
   <param name="flashvars" value="config={&quot;clip&quot;:{&quot;autoPlay&quot;:true,&quot;autoBuffering&quot;:true,&quot;url&quot;:&quot;/player/vle.flv&quot;},&quot;plugins&quot;:{&quot;controls&quot;:{&quot;fullscreen&quot;:false}},&quot;playerId&quot;:&quot;player2&quot;,&quot;playlist&quot;:[{&quot;autoPlay&quot;:true,&quot;autoBuffering&quot;:true,&quot;url&quot;:&quot;/player/vle.flv&quot;}]}">
  </object>
  */
 }

 this.getPlayer=getPlayer;
 function getPlayer()
 {
  return document.flowPlayer;
  //return $f("flowPlayer");
 }

 this.setPosition=setPosition;
 function setPosition(pos)
 {
  getPlayer().Seek(pos/1000);
  //getPlayer().seek(pos/1000);
 }

 this.getPosition=getPosition;
 function getPosition()
 {
  if (typeof(getPlayer())!="undefined")
  {
   return getPlayer().getTime()*1000;
  }
  else
   return -1;
 }

 this.stopPlayer=stopPlayer;
 function stopPlayer()
 {
  getPlayer().Pause();
  //getPlayer().pause();
 }

 this.startPlayer=startPlayer;
 function startPlayer()
 {
  getPlayer().DoPlay();
  //getPlayer().play();
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
  return hasFlash;
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

/*****Silverlight Video control class*****/

function SilverlightVideo(url,speed)
{
 this.url=url;

 if (typeof(speed)=="undefined")
  this.speed=SPEED_NONE;
 else
  this.speed=speed;

 this.type=VIDEO_SILVERLIGHT;

 this.getHTML=getHTML;
 function getHTML()
 {
  var width=avWidth;
  var height=avHeight*1.1;

  var urlToUse;
  if (this.url.indexOf("http://")>-1 || this.url.indexOf("https://")>-1 || this.url.indexOf("rtsp://")>-1 || this.url.indexOf("mms://")>-1)
   urlToUse=this.url;
  else
   urlToUse=baseRef+this.url;
  
  var x='<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" width="'+width+'" height="'+height+'" id="silverPlayer" >\n'+
   '<param name="source" value="'+vresourcePath+'OVP.xap"/>\n'+
   '<param name="minRuntimeVersion" value="2.0.30923.0" />\n'+
   '<param name="onerror" value="onSilverlightError" />\n'+
   '<param name="background" value="black" />\n'+
   '<param name="MaxFrameRate" value="30" />\n'+
   '<param name="initparams" value="showstatistics=false, playlistoverlay=false, muted=false, playlistoverlay=false, stretchmode=Fit,'+
   ' stretchmodefullscreen=Fit, showchapters=false, mediasource='+urlToUse+'"/>\n'+
   ' <a href="http://go.microsoft.com/fwlink/?LinkId=124807" style="text-decoration: none;">'+
   getString("silverlight2")+'</a>\n'+
   '</object>\n';

  return x;
 }

 this.getPlayer=getPlayer;
 function getPlayer()
 {
  return document.getElementById("silverPlayer").Content.OpenVideoPlayerControl;
 }

 this.setPosition=setPosition;
 function setPosition(pos)
 {
  getPlayer().PlaybackPositionValue=pos;
 }

 this.getPosition=getPosition;
 function getPosition()
 {
  if (typeof(getPlayer())!="undefined")
   return getPlayer().PlaybackPositionValue;
  else
   return -1;
 }

 this.stopPlayer=stopPlayer;
 function stopPlayer()
 {
  getPlayer().Pause();
 }

 this.startPlayer=startPlayer;
 function startPlayer()
 {
  getPlayer().Play();
 }

 this.label=label;
 function label()
 {
  var p=document.getElementById("silverPlayer");
  return getString("silverlightvideo")+getVideoSpeed(this.speed);
 }

 this.controllable=controllable;
 function controllable()
 {
  return true;
 }

 this.isValid=isValid;
 function isValid()
 {
  return hasSilverlight;
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

/*****Flash Video control class for live broadcasts*****/

function FlashVideoBroadcast(url)
{
 this.url=url;
 this.speed=SPEED_NONE;
 this.type=VIDEO_FLASHBROADCAST;

 this.getHTML=getHTML;
 function getHTML()
 {
  var width=avWidth;
  var height=avHeight*1.95;

  if (height>frameHeight)
  {
   height=frameHeight*0.9;
   width=(height*0.51)/videoAspect;
  }

  var swfFile=flashCapture+'/avreceive.swf';

  var data='type="application/x-shockwave-flash" data="'+swfFile+'"\n';
  if (browser==MSIE)
   data='classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"\n'+     
   'codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"';

  var i=0;
  for (l=0; l<4 && i>-1; l++)
   i=url.indexOf("/", i+1);
  var file=url.substring(i+1);
  var server=url.substring(0,i);


  var cfg="server="+server+"&stream="+file+"&flashHost="+flashHost+"&editing="+editing+"&user="+user;

  var x='<object '+data+
   ' width="'+width+'" height="'+height+'" id="liveFlashPlayer">\n'+
   ' <param name="movie" value="'+swfFile+'" />\n'+ 
   ' <param name="quality" value="high" />\n'+
   ' <param name="allowScriptAccess" value="always" />\n'+
   ' <param name="scale" value="exactfit" />\n'+
   ' <param name="allowFullScreen" value="true" />\n'+
   ' <param name="flashvars" value="'+cfg+'" />\n'+
   '<\/object>\n';

  return x;
 }

 this.getPlayer=getPlayer;
 function getPlayer()
 {
  return document.liveFlashPlayer;
 }

 this.setPosition=setPosition;
 function setPosition(pos)
 {
  // Not possible for live broadcast
 }

 this.getPosition=getPosition;
 function getPosition()
 {
  return -1;
 }

 this.stopPlayer=stopPlayer;
 function stopPlayer()
 {
  getPlayer().disClick();
 }

 this.startPlayer=startPlayer;
 function startPlayer()
 {
  getPlayer().conClick();
 }

 this.label=label;
 function label()
 {
  return getString("flashvideobroadcast");
 }

 this.controllable=controllable;
 function controllable()
 {
  return false;
 }

 this.isValid=isValid;
 function isValid()
 {
  return hasFlash;
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

/****This video wrapper uses the HTML 5 video tag to play videos*****/
function HTML5Video(url, speed)
{
 this.url=url;

 if (typeof(speed)=="undefined")
  this.speed=SPEED_NONE;
 else
  this.speed=speed;

 this.type=VIDEO_HTML5;

 this.getHTML=getHTML;
 function getHTML()
 {
  var x="<iframe class=\"video\" style=\"width:"+avWidth+"px;height:"+avHeight+"px;\" name=\"html5vid\" />";
  setTimeout("html5vid.document.writeln(\""+this.getIFrameHTML()+"\");", 200);
  return x;
 }

 this.getIFrameHTML=getIFrameHTML;
 function getIFrameHTML()
 {
  var x="<!DOCTYPE html>"+
   "<html>"+
   "<head><title>HTML 5 video</title></head>"+
   "<body style='margin:0px;padding:0px;'>"+
   "<video style='margin-left:auto;margin-right:auto;' src='"+this.url+"' "+
   "controls='controls' id='html5player' width='"+avWidth+"' height='"+avHeight+"'>"+
   getString("nohtml5")+"</video>"+
   "</body>"+
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
  this.getPlayer().currentTime=pos/1000;
 }

 this.getPosition=getPosition;
 function getPosition()
 {
  return this.getPlayer().currentTime*1000;
 }

 this.stopPlayer=stopPlayer;
 function stopPlayer()
 {
  this.getPlayer().pause();
 }

 this.startPlayer=startPlayer;
 function startPlayer()
 {
  getPlayer().play();
 }

 this.label=label;
 function label()
 {
  return getString("html5video");
 }

 this.controllable=controllable;
 function controllable()
 {
  return true;
 }

 this.isValid=isValid;
 function isValid()
 {
  var u=this.url.toLowerCase();

  if (u.indexOf(".ogg")>-1 || u.indexOf(".ogv")>-1 || u.indexOf(".ogm")>-1)
  {
   /***We have an ogg/theora file***/
   if (browser==MOZILLA && browserVersion>=3.5)
    return true;
   if (browser==OPERA && browserVersion>=10.5)
    return true;
   if (browser==CHROME && browserVersion>=3)
    return true;
  }

  if (u.indexOf(".mp4")>-1)
  {
   /***We have an h264 file***/
   if (browser==SAFARI && browserVersion>=3)
    return true;
   if (browser==CHROME && browserVersion>=3)
    return true;
  }
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

 xmlDoc.open("GET", document.location+"&flashauthonly=1", false);
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
