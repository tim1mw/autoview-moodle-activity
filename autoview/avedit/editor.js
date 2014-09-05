/*************************************************************************

   Copyright: EuroMotor-AutoTrain LLP 2007

   License: GPLv2 + Commercial

   Authors: Tim Williams (tmw@autotrain.org)

*************************************************************************/

var loaded=false;
var tid;

var DISPLAY_COMPONENTS=0;
var DISPLAY_SUBTITLES=1;
var DISPLAY_TIMESTITLES=2;
var DISPLAY_OPTIONS=3;

var currentDisplay, liveCaptureInstalled=false;

/*****Startup mechanism*****/ 
function startEditor()
{
 if (!loaded)
 {
  if (parent.videoframe.flashRecord || parent.videoframe.flashBroadcast)
   liveCaptureInstalled=true;

  //if (parent.videoframe.browser!=parent.videoframe.MOZILLA && parent.videoframe.browser!=parent.videoframe.MSIE)
  // showMessage(getString("e_editmodesupport"));

  setElementHTML("editor",
     " <div id=\"topbar\"></div>\n"+
     " <div id=\"main\"></div>\n"+
     " <div id=\"bottombar\"></div>\n"+
     " <iframe height=\"0\" width=\"0\" frameborder=\"0\" name=\"usefulIframe\" marginwidth=\"0\""+
     "  marginheight=\"0\"></iframe>");

  topBar();
  componentsDisplay();
  bottomBar();
  loaded=true;
  window.onbeforeunload=function() {saveAll();}

  if (parent.videoframe.slideSet==false && parent.videoframe.videoSet==false && parent.videoframe.subtitleSet==false)
  {
   var st=getString("e_use_quick_start")+
    "\n\n"+getString("e_use_quick_start_ie");
   if (confirm(st))
    quickStart();
  }
 }
}

/*****Language handling*****/
/*****Language strings for the editor are merged into the autoview core, so pick them up from there*****/

function getString(id)
{
 return parent.videoframe.getString(id);
}

/*****Error handling*****/

function showMessage(mes)
{
 parent.videoframe.showMessage(mes);
}

/*****Interface Methods*****/

function topBar()
{
 var data="<table width=\"100%\"><tr>\n"+
  " <td width=\"50%\"><a href=\"javascript:componentsDisplay();\" class=\"linkbutton\" style=\"display:block;text-align:center;\"\n"+
  "  title=\""+getString("e_sources_title")+"\" id=\"sourcebutton\">"+getString("e_sources")+"</a></td>\n"+
  " <td width=\"50%\"><a href=\"javascript:timesTitlesDisplay();\" class=\"linkbutton\" style=\"display:block;text-align:center;\"\n"+
  "  title=\""+getString("e_timestitles_title")+"\" id=\"timetitlebutton\">"+getString("e_timestitles")+"</a></td>\n"+
  "</tr><tr>\n"+
  " <td width=\"50%\"><a href=\"javascript:subtitlesDisplay();\" class=\"linkbuttongrey\" style=\"display:block;text-align:center;\"\n"+
  "  title=\""+getString("e_subtitlesbutton_title")+"\" id=\"subtitlebutton\">"+getString("e_subtitlesbutton")+"</a></td>\n"+
  " <td width=\"50%\"><a href=\"javascript:optionsDisplay()\" class=\"linkbutton\" style=\"display:block;text-align:center;\"\n"+
  "  title=\""+getString("e_options_title")+"\" id=\"optionbutton\">"+getString("e_options")+"</a></td>\n"+
  "</tr></table><hr />\n";
  setElementHTML("topbar", data);
}

function setButtonStyles(source, tt, sub, opt)
{
 if (source)
  document.getElementById("sourcebutton").className='linkbuttonselected';
 else
  document.getElementById("sourcebutton").className='linkbutton';

 if (tt)
  document.getElementById("timetitlebutton").className='linkbuttonselected';
 else
  document.getElementById("timetitlebutton").className='linkbutton';

 if (sub)
  document.getElementById("subtitlebutton").className='linkbuttonselected';
 else
  document.getElementById("subtitlebutton").className='linkbutton';

 if (opt)
  document.getElementById("optionbutton").className='linkbuttonselected';
 else
  document.getElementById("optionbutton").className='linkbutton';
}

function bottomBar()
{
 var data="<hr />\n"+
  "<table width=\"100%\"><tr><td>\n"+
  " <a href=\"javascript:parent.videoframe.popupSlides()\" class=\"linkbutton\" style=\"display:block;text-align:center;\"\n"+
  "  title=\""+getString("e_popslides_title")+"\">"+getString("e_popslides")+"</a>\n"+
  "</td></tr><tr><td>\n"+
  " <a href=\"javascript:saveAll()\" class=\"linkbutton\" style=\"display:block;text-align:center;\"\n"+
  "  title=\""+getString("e_save_title")+"\">"+getString("e_save")+"</a>";

 if (parent.videoframe.slideSet==false && parent.videoframe.videoSet==false && parent.videoframe.subtitleSet==false)
 {
  data=data+" </td></tr><tr><td><a href=\"javascript:quickStart()\" class=\"linkbutton\" style=\"display:block;text-align:center;\">"+
   getString("e_quick_button")+"</a>";
 }

 if (parent.videoframe.browser!=parent.videoframe.MOZILLA && parent.videoframe.browser!=parent.videoframe.MSIE)
 {
  data=data+" </td></tr><tr><td style=\"font-size:x-small;\"><hr />"+getString("e_editmodesupport")+"</a>";
 }

 data=data+"</td></tr></table>\n";
 setElementHTML("bottombar", data);
}

function optionsDisplay()
{
 currentDisplay=DISPLAY_OPTIONS;
 setButtonStyles(false, false, false, true);
 var data="<h1 align=\"center\">Presentation options</h1><br />\n"+
  "<table>\n";

 data=data+getOptionItem("showthumbs", parent.videoframe.thumbnailsActiveDefault);
 data=data+getOptionItem("showsubtitles", parent.videoframe.subtitlesActiveDefault);
 data=data+getOptionItem("autostart", parent.videoframe.autoStartDefault);
 data=data+getOptionItem("videoright", parent.videoframe.videoPosition);
 data=data+getOptionItem("pauseafterslide", parent.videoframe.pauseAfterSlide);
 var wide=false;
 if (parent.videoframe.videoAspect==0.5625)
  wide=true;
 data=data+getOptionItem("widescreenvideo", wide);
 data=data+getOptionItem("downloadbutton", parent.videoframe.downloadButton);

 data=data+"</table>\n"+
  "<hr />\n"+
  "<h1 align=\"center\">Control options</h1><br />\n"+
  "<table>\n";

 data=data+getOptionItem("videos", parent.videoframe.showVideoControls);
 data=data+getOptionItem("slides", parent.videoframe.showSlideControls);
 data=data+getOptionItem("subtitles", parent.videoframe.showSubtitleControls);
 data=data+getOptionItem("language", parent.videoframe.showLanguageControls);
 data=data+getOptionItem("position", parent.videoframe.showPositionControls);
 data=data+getOptionItem("slideMenu", parent.videoframe.showSlideMenu);
 data=data+getOptionItem("thumbnail", parent.videoframe.showThumbnailControls);
 data=data+getOptionItem("other", parent.videoframe.showOtherControls);
 data=data+getOptionItem("exithide", parent.videoframe.alwaysHideExit);

 setElementHTML("main", data);
}

function getOptionItem(name, select)
{
 var c="";
 if (select)
  c=" checked";

 return " <tr>\n"+
  "  <td valign=\"top\">\n"+
  "   <form action=\"\" name=\"option_"+name+"\" style=\"margin:0px;padding:0px;\">\n"+
  "    <input type=\"checkbox\" name=\"box\""+c+" onClick=\"updateOption(document.option_"+name+".box, '"+name+"');\" />\n"+
  "   </form>\n"+
  "  </td>\n"+
  "  <td valign=\"top\">"+getString("e_"+name)+"</td>\n"+
  " </tr>\n";
}

function subtitlesDisplay()
{
 currentDisplay=DISPLAY_SUBTITLES;
 setButtonStyles(false, false, true, false);
 var data="<h1 align=\"center\">"+getString("e_subtitle_sources")+"</h1><br />\n";
  data=data+"<table>\n";

 var langsFound=new Array();
 for (var lang in parent.videoframe.subtitleSrc)
 {
   data=data+"<tr>\n"+
   "<td valign=\"top\">\n"+
   " <a href=\"javascript:deleteSubtitleSrc('"+lang+"');\""+
   "  class=\"linkbutton\" title=\""+getString("e_delete_subtitle_source")+"\">X</a>&nbsp;"+
   "<a href=\"javascript:editSubtitleSrc('"+lang+"');\" class=\"linkbutton\" title=\""+getString("e_edit_subtitle_source")+"\">E</a>"+
   "</td><td>\n"+
   " "+parent.videoframe.getLangString(lang,"langname")+" ("+lang+")\n"+
   "</td>\n"+
   "</tr>\n";
  langsFound.push(lang);
 }

 data=data+"</table><br />\n";

 var hasSources=false;
 var dataB=" <h1>"+getString("e_new_sub_source")+"</h1>\n"+
  "<form action=\"javascript:editSubtitleSrc(document.forms.newsubs.lang.value);\" name=\"newsubs\">\n"+
  " <select name=\"lang\">\n";

 for (var l in parent.videoframe.lang)
  if (parent.videoframe.arrayContains(langsFound, l)==false)
  {
   hasSources=true;
   dataB=dataB+"  <option value=\""+l+"\">"+parent.videoframe.getLangString(l,"langname")+" ("+l+")</option>\n";
  }
 dataB=dataB+" </select>\n"+
  " <input type=\"submit\" value=\""+getString("e_add")+"\" />\n"+
  "</form>";

 if (hasSources)
  data=data+dataB;

  data=data+"<hr />\n"+
   "<h1 align=\"center\">"+getString("e_subediting")+"</h1><br />\n";

 if (parent.videoframe.subtitlesActive==false)
  data=data+"<p>"+getString("e_sub_not_active")+"</p>";
 else
  data=data+"<table width=\"100%\"><tr>\n"+
   " <td><a href=\"javascript:addSubtitleBefore();\" class=\"linkbutton\" title=\""+getString("e_addsubbeforetitle")+"\" "+
   "style=\"display:block;text-align:center;\">"+getString("e_addsubbefore")+"</a></td>\n"+
   " <td><a href=\"javascript:addSubtitleAfter();\" class=\"linkbutton\" title=\""+getString("e_addsubaftertitle")+"\" "+
   "style=\"display:block;text-align:center;\">"+getString("e_addsubafter")+"</a></td>\n"+
   "</tr><tr>\n"+
   " <td colspan=\"2\"><a href=\"javascript:editSubtitle();\" class=\"linkbutton\" title=\""+getString("e_editsubtitle")+"\" "+
   "style=\"display:block;text-align:center;\">"+getString("e_editsub")+"</a></td>\n"+
   "</tr><tr>\n"+
   " <td colspan=\"2\"><a href=\"javascript:deleteSubtitle();\" class=\"linkbutton\" title=\""+getString("e_deletesubtitle")+"\""+
   "style=\"display:block;text-align:center;\">"+getString("e_deletesub")+"</a></td>\n"+
   "</tr></table><br />\n"+
   "<div id=\"subtitlesummary\"></div><br />\n";

 setElementHTML("main", data);
 fillSubtitleSummary();
}

function fillSubtitleSummary()
{
 if (parent.videoframe.subtitleSet==false || parent.videoframe.subtitlesActive==false)
 {
  setElementHTML("subtitlesummary", "");
  return;
 }

 var data="<h1>"+getString("e_subtitlesummary")+"</h1><br />\n"+
  "<form action=\"\" name=\"subtitlesummary\">\n"+
  "<select name=\"item\" "+
  "onchange=\"parent.videoframe.setSubtitle(parseInt(this.options[this.selectedIndex].value), true)\">\n";

 for (var loop=1; loop<parent.videoframe.subtitles.length; loop++)
 {
  var select="";
  if (loop==parent.videoframe.currentSubtitle)
   select=" selected";

  data=data+"<option value=\""+loop+"\""+select+" title=\""+htmlEscape(parent.videoframe.subtitles[loop])+"\">"+loop+" : "+
   htmlEscape(parent.videoframe.subtitles[loop].substring(0,20))+"</option>\n";
 }
 data=data+"</select>\n"+
  "</form>\n";

 setElementHTML("subtitlesummary", data);
}

function componentsDisplay()
{
 currentDisplay=DISPLAY_COMPONENTS;
 setButtonStyles(true, false, false, false);
 var data=componentEditor("Video", parent.videoframe.avSrc);
 data=data+"<hr />\n";
 data=data+componentEditor("Slide", parent.videoframe.allSlideSrc);
 setElementHTML("main", data);
}

function componentEditor(type, sources)
{
 var data="<h1 align=\"center\">"+getString("e_"+type+"_sources")+"</h1><br />\n";

 var langs=parent.videoframe.findValidLangs(sources);
 for (var loop=0; loop<langs.length; loop++)
 {
  data=data+" <h2>"+parent.videoframe.getLangString(langs[loop],"langname")+" ("+langs[loop]+")</h2>\n"+
   "<table>\n";

  for (var vLoop=0; vLoop<sources[langs[loop]].length; vLoop++)
   data=data+"<tr>\n"+
    "<td valign=\"top\">\n"+
    " <a href=\"javascript:delete"+type+"Src('"+langs[loop]+"',"+vLoop+");\""+
    "  class=\"linkbutton\" title=\""+getString("e_delete_"+type+"_source")+"\">X</a>&nbsp;"+
    "<a href=\"javascript:edit"+type+"Src('"+langs[loop]+"',"+vLoop+");\" class=\"linkbutton\" "+
    "  title=\""+getString("e_edit_"+type+"_source")+"\">E</a>"+
    "</td><td>\n"+
    sources[langs[loop]][vLoop].label()+""+
    "</td>\n"+
    "</tr>\n";

  data=data+"</table>\n";

  if (type=="Slide")
  {
   data=data+"<form action=\"javascript:setNumSlidesValue('"+langs[loop]+"', document.numslideform_"+langs[loop]+".size.value);\"\n"+
    "  name=\"numslideform_"+langs[loop]+"\"><table><tr>\n"+
    " <td><h3>"+getString("e_numslides")+"</h3></td>\n"+
    " <td><input type=\"text\" size=\"2\" value=\""+parent.videoframe.titles[langs[loop]].length+"\" name=\"size\" class=\"small\" /></td>\n"+
    " <td><input type=\"submit\" value=\""+getString("e_set")+"\" /></td>\n"+
    "</tr></table></form>\n";
  }

 }

 var l="en";
 if (typeof(parent.videoframe.selectedLang)!="undefined")
  l=parent.videoframe.selectedLang;

 data=data+"<table style=\"margin-bottom:4px;margin-top:4px;\" width=\"100%\">"+
  "<tr><td colspan=\"2\">"+
  "<a href=\"javascript:edit"+type+"Src('"+l+"', -1);\" title=\""+getString("e_add_"+type+"_source_title")+"\" class=\"linkbutton\"\n"+
  " style=\"display:block;text-align:center;\">"+getString("e_add_"+type+"_source")+"</a></td></tr>\n";
 if (type=="Slide")
 {
  var cl="linkbuttongrey";
  if (conversionURL.length>0)
   cl="linkbutton";
  data=data+"<tr><td colspan=\"2\"><a href=\"javascript:convertSlides();\"\n"+
   " title=\""+getString("e_convert_title")+"\" class=\""+cl+"\"\n"+
   " style=\"display:block;text-align:center;\">"+getString("e_convert_button")+"</a></td></tr>\n";
 }
 else
 if (type=="Video")
 {
  var cl="linkbuttongrey";
  if (liveCaptureInstalled && parent.videoframe.flashRecord==true)
   cl="linkbutton";
  data=data+"<tr>\n"+
   "<td width=\"50%\" ><a href=\"javascript:useLiveCapture();\"\n"+
   " title=\""+getString("e_livecapture_title")+"\" class=\""+cl+"\"\n"+
   " style=\"display:block;text-align:center;margin-top:0px;\">"+getString("e_livecapture_button")+"</a></td>\n";

  cl="linkbuttongrey";
  if (liveCaptureInstalled && parent.videoframe.flashBroadcast==true)
   cl="linkbutton";
   data=data+"<td width=\"50%\"><a href=\"javascript:useLiveBroadcast();\"\n"+
   " title=\""+getString("e_livebroadcast_title")+"\" class=\""+cl+"\"\n"+
   " style=\"display:block;text-align:center;margin-top:0px;\">"+getString("e_livebroadcast_button")+"</a></td>\n"+
   "</tr>\n";
 }
 data=data+"</table>\n";

 return data;
}

function timesTitlesDisplay()
{
 currentDisplay=DISPLAY_TIMESTITLES;
 clearInterval(tid);
 setButtonStyles(false, true, false, false);
 var data="";

 if (parent.videoframe.slideSet==true)
 {
  var currentTitle=parent.videoframe.titles[parent.videoframe.slideLang][parent.videoframe.currentSlide-1];
  data=data+"<h1 align=\"center\">"+getString("e_set_title")+"<h1><br />\n"+
   " <form action=\"javascript:setTitle()\" name=\"titleform\" style=\"margin:2px;padding:0px;\">\n"+
   "  <table><tr>\n"+
   "   <td><input type=\"text\" size=\"18\" name=\"title\" value=\""+currentTitle+"\"/></td>\n"+
   "   <td align=\"right\"><input type=\"submit\" value=\""+getString("e_set")+"\" /></td>\n"+
   " </tr></table>\n"+
   " </form>\n"+
   "<hr />\n";
 }

 data=data+"<h1 align=\"center\">"+getString("e_set_times")+"</h1><br />\n"+
  "<table><tr>\n"+
  " <td colspan=\"2\"><div id=\"videotime\">"+getString("e_videopos")+"&nbsp;:&nbsp;0:0.0</div></td>\n"+
  "</tr></table>\n";

 if (parent.videoframe.slideSet==true && parent.videoframe.subtitleSet==true && parent.videoframe.subtitlesActive==true)
 {
  data=data+"<table cellspacing=\"0\" cellpadding=\"0\" align=\"center\" width=\"100%\"><tr>\n"+
   " <td align=\"center\" style=\"border-right:1px solid #000000;\">"+getSubtitleTimesList()+"</td>\n"+
   " <td align=\"center\">"+getSlideTimesList()+"</td>\n"+
   "</tr></table>\n";
 }
 else
 if (parent.videoframe.slideSet==true)
  data=data+"<div align=\"center\">"+getSlideTimesList()+"</div>";
 else
 if (parent.videoframe.subtitleSet==true && parent.videoframe.subtitlesActive==true)
  data=data+"<div align=\"center\">"+getSubtitleTimesList()+"</div>";
 else
  data=data+"<div align=\"center\">"+getString("e_no_slides_or_subs")+"<br /><br /></div>";

 setElementHTML("main", data);
 if (parent.videoframe.subtitleSet)
  fillSubtitleTimesList();
 if (parent.videoframe.slideSet)
  fillSlideTimesList();
 tid=setInterval('updateTimeDisplay()', 500);
}

function getSlideTimesList()
{
 return "<table width=\"100%\"><tr>\n"+
  " <td><h1 align=\"center\">"+getString("e_slide_plural")+"</h1></td>\n"+
  "</tr><tr>\n"+
  " <td><a href=\"javascript:updateSlideTime()\" class=\"linkbutton\" style=\"display:block;text-align:center;\""+
  "  title=\""+getString("e_set_slidetime_title")+"\">"+getString("e_set_time_button")+"</a></td>\n"+
  "</tr><tr>\n"+
  " <td><a href=\"javascript:updateSlideTimeAndMove()\" class=\"linkbutton\" style=\"display:block;text-align:center;\""+
  "  title=\""+getString("e_slidemoveset_title")+"\">"+
  getString("e_moveset_button")+"</a></td>\n"+
  "</tr></table>\n"+
  "<div style=\"width:100px;height:200px;overflow:auto;\" id=\"slidetimesdiv\"></div>\n"+
  "<a href=\"javascript:clearSlideTimes()\" class=\"linkbutton\" style=\"display:block;text-align:center;margin:2px;\""+
  "  title=\""+getString("e_cleartimes_title")+"\">"+
  getString("e_cleartimes_button")+"</a>";
}

function getSubtitleTimesList()
{
  return "<table width=\"100%\"><tr>\n"+
   " <td><h1 align=\"center\">"+getString("e_sub_plural")+"</h1></td>\n"+
   "</tr><tr>\n"+
   " <td><a href=\"javascript:updateSubtitleTime()\" class=\"linkbutton\" style=\"display:block;text-align:center;\""+
   "  title=\""+getString("e_set_subtime_title")+"\">"+getString("e_set_time_button")+"</a></td>\n"+
   "</tr><tr>\n"+
   " <td><a href=\"javascript:updateSubtitleTimeAndMove()\" class=\"linkbutton\" style=\"display:block;text-align:center;\""+
   "  title=\""+getString("e_submoveset_title")+"\">"+
   getString("e_moveset_button")+"</a></td>\n"+
   "</tr></table>\n"+
   "<div style=\"width:100px;height:200px;overflow:auto;\" id=\"subtimesdiv\"></div>\n"+
   "<a href=\"javascript:clearSubtitleTimes()\" class=\"linkbutton\" style=\"display:block;text-align:center;margin:2px;\""+
   "  title=\""+getString("e_cleartimes_title")+"\">"+
   getString("e_cleartimes_button")+"</a>";
}

function fillSubtitleTimesList()
{
 var data=getTimeList(parent.videoframe.subTimes[parent.videoframe.subtitleLang], parent.videoframe.subtitles.length-1, "Subtitle", parent.videoframe.currentSubtitle-1);

 setElementHTML("subtimesdiv", data);
 setActiveTimeElement("Subtitle", parent.videoframe.currentSubtitle, -1);
}

function fillSlideTimesList()
{
 var timesLength=parent.videoframe.titles[parent.videoframe.avLang].length;
 if (parent.videoframe.times[parent.videoframe.avLang].length>timesLength)
  timesLength=parent.videoframe.times[parent.videoframe.avLang].length;

 var data=getTimeList(parent.videoframe.times[parent.videoframe.avLang], timesLength,
  "Slide", parent.videoframe.currentSlide-1);

 setElementHTML("slidetimesdiv", data);
 setActiveTimeElement("Slide", parent.editframe.currentSlide, -1);
}

function getTimeList(times, number, type, selected)
{
 var data="<table cellpadding=\"1\" cellspacing=\"0\">\n"+
  " <tr>\n"+
  "  <td style=\"font-size:small;\"><a href=\"javascript:parent.videoframe.set"+type+"(1, true)\">1</a>:</td>\n"+
  "  <td style=\"font-size:small;\" id=\"timeindex"+type+"0\">0:0.0</td>\n"+
  " </tr>\n";

 for (var loop=1; loop<number; loop++)
 {
  var t="";
  if (typeof(times[loop])!="undefined")
  {
   t=getTimeString(times[loop], true);
  }

  data=data+" <tr>\n"+
   "  <td valign=\"middle\" style=\"font-size:small;\"><a href=\"javascript:parent.videoframe.set"+type+"("+(loop+1)+", true)\">"+(loop+1)+"</a>"+
   "</td>\n"+
   "  <td valign=\"middle\">\n"+
   "   <form style=\"margin:0px;padding:0px;\""+
   "    action=\"javascript:set"+type+"Time("+loop+", document.forms.timeindexForm"+type+loop+".time.value);\" name=\"timeindexForm"+type+loop+"\">\n"+
   "    <input type=\"text\" size=\"6\" value=\""+t+"\" name=\"time\" id=\"timeindex"+type+loop+"\" style=\"font-size:x-small;\" "+
   "     onChange=\"javascript:set"+type+"Time("+loop+", document.forms.timeindexForm"+type+loop+".time.value);\" />\n"+
   "   </form>\n"+
   "  </td>\n"+
   " </tr>\n";
 }

 data=data+"</table>\n"+
  "</td></tr></table>\n";
 return data;
}

function setActiveTimeElement(type, index, last)
{
 if (typeof(index)!="number")
  index=1;
 if (typeof(last)!="number")
  last=1;

 index--;
 last--;

 if (last>-1)
 {
  var element=document.getElementById("timeindex"+type+last);
  if (element!=null)
  {
   element.style.borderColor="";
   element.style.color="#000000";
  }
 }

 if (index>-1)
 {
  var element=document.getElementById("timeindex"+type+index);
  if (element!=null)
  {
   element.style.borderColor="#ff0000";
   element.style.color="#ff0000";
  }
 }

 var div="slidetimesdiv";
 if (type=="Subtitle")
  div="subtimesdiv";

 var element=document.getElementById(div);
 if (element!=null)
 {
  var pos=(index-4)*23;
  if (pos<0)
   pos=0;
 
  element.scrollTop=pos;
 }
}

function clearTimeElementsStyles(type)
{
 var loop=1;
 while(true)
 {
  var element=document.getElementById("timeindex"+type+loop);
  if (element==null)
   break;
  element.style.borderColor="";
  element.style.color="#000000";
  loop++;
 }
}

function updateTimeDisplay()
{
 if (parent.videoframe.videoSet==true && parent.videoframe.selectedAVSource.type<30)
  setElementHTML("videotime", getString("e_videopos")+"&nbsp;:&nbsp;"+getTimeString(parent.videoframe.selectedAVSource.getPosition(), false));
 else
  setElementHTML("videotime", "&nbsp;");
}

function setElementHTML(name, html)
{
 var element=document.getElementById(name);
 if (element!=null)
  element.innerHTML=html;
}

/*****Slide/Subtitle time methods*****/

function setSlideTime(index, pos)
{
 var pos=processTimeString(pos);
 var r=parent.videoframe.setSlideTime(index, pos);
 if (r>0)
 {
  var element=document.getElementById("timeindexSlide"+index);
  element.value=getTimeString(parent.videoframe.times[parent.videoframe.avLang][index], false);
  if (r==1)
   showMessage(getString("e_slide_time_warn_prev"));
  else
   showMessage(getString("e_slide_time_warn_next"));
 }
}

function updateSlideTimeAndMove()
{
 parent.videoframe.setSlideSync(false);
 var cs=parent.videoframe.currentSlide;
 parent.videoframe.nextSlide();
 if (parent.videoframe.currentSlide!=cs)
  updateSlideTime();
}

function updateSlideTime()
{
 var r=parent.videoframe.setSlideTimeToCurrent();
 if (r>0)
 {
  if (r==1)
   showMessage(getString("e_slide_time_warn_prev"));
  else
  if (r==2)
   showMessage(getString("e_slide_time_warn_next"));
 }
 else
 {
  var element=document.getElementById("timeindexSlide"+(parent.videoframe.currentSlide-1));
  element.value=getTimeString(parent.videoframe.times[parent.videoframe.avLang][parent.videoframe.currentSlide-1], false);
 }
}

function setSubtitleTime(index, pos)
{
 var pos=processTimeString(pos);
 var r=parent.videoframe.setSubtitleTime(index, pos);
 if (r>0)
 {
  var element=document.getElementById("timeindexSubtitle"+index);
  element.value=getTimeString(parent.videoframe.subTimes[parent.videoframe.avLang][index],false);
  if (r==1)
   showMessage(getString("e_sub_time_warn_prev"));
  else
  if (r==2)
   showMessage(getString("e_sub_time_warn_next"));
 }
}

function updateSubtitleTimeAndMove()
{
 parent.videoframe.setSubSync(false);
 var cs=parent.videoframe.currentSubtitle;
 parent.videoframe.nextSubtitle();
 if (parent.videoframe.currentSubtitle!=cs)
  updateSubtitleTime();
}

function updateSubtitleTime()
{
 var r=parent.videoframe.setSubtitleTimeToCurrent();
 if (r>0)
 {
  if (r==1)
   showMessage(getString("e_sub_time_warn_prev"));
  else
  if (r==2)
   showMessage(getString("e_sub_time_warn_next"));
 }
 else
 {
  var element=document.getElementById("timeindexSubtitle"+(parent.videoframe.currentSubtitle-1));
  element.value=getTimeString(parent.videoframe.subTimes[parent.videoframe.subtitleLang][parent.videoframe.currentSubtitle-1], false);
 }
}

function getTimeString(millis, incSlide)
{
 if (millis<0)
  return "";

 var lTotalTenths=millis/100;

 var m=parseInt(lTotalTenths/600);
 var remainder=parseInt(lTotalTenths-(m*600));
 var s=parseInt(remainder/10);
 var t=parseInt(remainder-(s*10));

 if (s.length==1)
  $s="0".$s;

 var sn="";
 var ttvd=parent.videoframe.getDecimalAsInt(millis);
 if (ttvd>-1 && incSlide)
  sn=";"+ttvd;

 return m+":"+s+"."+t+sn;
}

function processTimeString(data)
{
 if (data.length<3)
  return -100;

 var colon=data.indexOf(":");
 if (colon<0)
  return -100;

 var dot=data.indexOf(".");
 var semi=data.indexOf(";");
 var m=parseInt(data.substring(0,colon));
 if (dot<colon)
  dot=data.length;
 var s=parseInt(data.substring(colon+1, dot));

 var t=0;
 if (dot<data.length)
 {
  var end=data.length;
  if (semi>dot)
   end=semi;
  t=parseInt(data.substring(dot+1, end));
 }

 var ss=0;
 if (semi>dot)
 {
  ss="."+data.substring(semi+1, data.length);
 }

 return (((m*600)+(s*10)+t)*100)+ss;
}

function clearSlideTimes()
{
 if (confirm(getString("e_clearslidetimes")))
  parent.videoframe.clearSlideTimes();

 fillSlideTimesList();
}

function clearSubtitleTimes()
{
 if (confirm(getString("e_clearsubtimes")))
  parent.videoframe.clearSubtitleTimes();

 fillSubtitleTimesList();
}

/*****Titles methods*****/

function setTitle()
{
 parent.videoframe.setCurrentSlideTitle(document.titleform.title.value);
 saveXMLConfig();
}

/*****Source edit methods methods*****/

function setNumSlidesValue(lang, num)
{
 parent.videoframe.setNumSlides(lang, num);
 eval("document.numslideform_"+lang+".size.value=num");
 saveXMLConfig();
}

function deleteVideoSrc(lang, num)
{
 var ok=confirm(getString("e_delete_source"));
 if (ok)
 {
  parent.videoframe.deleteAVSrc(lang, num);
  componentsDisplay();
  saveXMLConfig();
 }
}

function editVideoSrc(lang, num)
{
 var source;
 if (typeof(parent.videoframe.avSrc[lang])!="undefined" && typeof(parent.videoframe.avSrc[lang][num])!="undefined")
  source=parent.videoframe.avSrc[lang][num];
 else
  source=new parent.videoframe.FlashVideo("", parent.videoframe.SPEED_NONE);

 var data="<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\""+
  "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n"+
  "<html>\n"+
  "<head>\n"+
  " <title>"+getString("e_edit_Video_source")+"</title>\n"+
  " <link type=\"text/css\" rel=\"stylesheet\" href=\""+parent.videoframe.avEditDir+"popup.css\" />\n"+
  " <script language=\"javascript\" type=\"text/javascript\">\n"+
  "  var lang=\""+lang+"\";\n"+
  "  var num="+num+";\n"+
  " </script>\n"+
  "</head>\n"+
  "<body>\n"+
  "<form action=\"javascript:submitVidSource();\" name=\"form\">\n";

 data=data+"<h1 align=\"center\">"+getString("e_edit_Video_source")+"</h1><br />\n"+
  " <table align=\"center\">\n"+
  "  <tr>\n"+
  "   <td>Language</td>\n"+
  "   <td>\n"+
  getLangOptions()+
  "   </td>\n"+
  "  </tr><tr>\n"+
  "   <td>Video Type</td>\n"+
  "   <td>\n"+
 getVideoSelection(source.type, " onChange=\"updateDisplay();\" ")+
  "    <a href=\"javascript:detectType()\" title=\""+getString("e_detect_video_type_title")+"\" class=\"linkbutton\">"+getString("e_detect_video_type")+"</a>\n"+
  "   </td>\n"+
  "  </tr>\n"+
  "  <tr>\n"+
  "   <td><div id=\"urllabel\">"+getString("e_video_url")+"</div></td>\n"+
  "   <td><div id=\"urlbox\"><input type=\"textfield\" size=\"50\" name=\"url\" value=\""+source.url+"\" />"+
  "&nbsp;<input type=\"button\" value=\"Select\" onClick=\"window.open('"+fileBrowser+"', '_blank', 'width=750,height=480,status=no,toolbar=no,menubar=no,scrollbars=yes,resizable=1')\" /></div></td>\n"+
  "  </tr><tr>\n"+
  "   <td><div id=\"bandlabel\">"+getString("e_bandwidth")+"</div></td>\n"+
  "   <td>\n"+
  "    <div id=\"bandbox\">"+getBandwidthSelection(source.speed)+"</div>\n"+
  "   </td>\n"+
  " </tr><tr>\n"+
  "  <td><div id=\"eventlabel\">"+getString("e_event_triggers")+"</div></td>\n"+
  "  <td><div id=\"eventcheck\"><input type=\"checkbox\" name=\"triggers\"";

 var um=source.useMonitor;
 if (typeof(um)=="undefined")
  um=source.useTimeMonitor();
 if (!um)
  data=data+" checked";

 data=data+" /></div></td>\n"+
  " </tr><tr>\n"+
  "  <td colspan=\"2\"><div id=\"eventnote\"><font size=\"-1\">("+getString("e_eventnote")+")</font></div></td>\n"+
  " </tr>\n"+
  "</table>\n"+
  "<p align=\"center\"><input type=\"submit\" value=\""+getString("e_update")+"\" /></p>\n"+
  "</form>\n"+
  "<!-- The defer attribute below is needed to stop IE crashing and using 100% of the processor time. Don't ask me why this works, but it does -->\n"+
  "<script language=\"javascript\" type=\"text/javascript\" src=\"avedit/videosrc.js\" defer></script>\n"+
  "</body>\n"+
  "</html>\n";

 popupWindow(data);
}

function getVideoSelection(type,extra)
{
 var data="    <select name=\"type\""+extra+">\n";

 data=data+formOption(type, parent.videoframe.VIDEO_FLASH, getString("flashvideo"));
 data=data+formOption(type, parent.videoframe.VIDEO_FLASHBROADCAST, getString("flashvideobroadcast"));
 data=data+formOption(type, parent.videoframe.VIDEO_JAVAAUDIO, getString("javaaudio"));
 data=data+formOption(type, parent.videoframe.VIDEO_FLASHLIVE, getString("livecaptureflash"));
 //data=data+formOption(type, parent.videoframe.VIDEO_JAVALIVE, getString("livecapture"));
 data=data+formOption(type, parent.videoframe.VIDEO_NONE, getString("novideoplayer"));
 data=data+formOption(type, parent.videoframe.VIDEO_QUICKTIME, getString("quicktime"));
 data=data+formOption(type, parent.videoframe.VIDEO_REALPLAYER, getString("realplayer"));
 data=data+formOption(type, parent.videoframe.VIDEO_SILVERLIGHT, getString("silverlightvideo"));
 data=data+formOption(type, parent.videoframe.VIDEO_WINDOWSMEDIA, getString("windowsmedia"));
 data=data+formOption(type, parent.videoframe.VIDEO_VLC, getString("vlcvideo"));
 if (parent.videoframe.enableHTML5)
  data=data+formOption(type, parent.videoframe.VIDEO_HTML5, getString("html5video"));

 data=data+"    </select>\n";
 return data;
}

function getBandwidthSelection(speed)
{
 var data="<select name=\"speed\">\n";

 data=data+formOption(speed, parent.videoframe.SPEED_NONE, getString("e_none"));
 data=data+formOption(speed, parent.videoframe.SPEED_MODEM, getString("speed"+parent.videoframe.SPEED_MODEM));
 data=data+formOption(speed, parent.videoframe.SPEED_BROAD, getString("speed"+parent.videoframe.SPEED_BROAD));
 data=data+formOption(speed, parent.videoframe.SPEED_STREAM, getString("speed"+parent.videoframe.SPEED_STREAM));

 data=data+"    </select>";
 return data;
}

function formOption(toTest, type, name)
{
 if (toTest==type)
  return "    <option value=\""+type+"\" selected>"+name+"</option>\n";
 else
  return "    <option value=\""+type+"\">"+name+"</option>\n";
}

function getLangOptions(selectedLang)
{
 data="    <select name=\"lang\">\n";

 var langList=parent.videoframe.findValidLangs(parent.videoframe.lang);
 for (var loop=0; loop<langList.length; loop++)
  data=data+formOption(selectedLang, langList[loop], parent.videoframe.getLangString(langList[loop], "langname")+" ("+langList[loop]+")");

 data=data+"    </select>\n";

 return data;
}

function addUpdateVideoSrc(lang, num, newlang, type, url, speed, monitor)
{
 parent.videoframe.addUpdateAVSrc(lang, num, newlang, type, url, speed, monitor);
 componentsDisplay();
 saveXMLConfig();
 //*****Real player & FlashVideo don't pick up a changed URL without a page reload*****/
 if ( (type==parent.videoframe.VIDEO_REALPLAYER || type==parent.videoframe.VIDEO_FLASH) && num>-1)
 {
  parent.videoframe.presentationLoaded=false;
  setTimeout("parent.videoframe.location.reload()", 1500);
 }
}

function deleteSlideSrc(lang, num)
{
 var ok=confirm(getString("e_delete_source"));
 if (ok)
 {
  var oldSlideSet=parent.videoframe.slideSet;
  parent.videoframe.deleteSlideSrc(lang, num);
  componentsDisplay();
  saveXMLConfig();
  if (oldSlideSet!=parent.videoframe.slideSet)
  {
   parent.videoframe.presentationLoaded=false;
   setTimeout("parent.videoframe.location.reload()", 1500);
  }
 }
}

function editSlideSrc(lang, num)
{
 if (typeof(parent.videoframe.allSlideSrc[lang])!="undefined" && typeof(parent.videoframe.allSlideSrc[lang][num])!="undefined")
  editSlideSrcWindow(lang, num, parent.videoframe.allSlideSrc[lang][num]);
 else
  editSlideSrcWindow(lang, -1, new parent.videoframe.OOFlashSlide(""));
}

function editSlideSrcWindow(lang, num, source)
{
 var data="<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\""+
  "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n"+
  "<html>\n"+
  "<head>\n"+
  " <title>"+getString("e_edit_Slide_source")+"</title>\n"+
  " <link type=\"text/css\" rel=\"stylesheet\" href=\""+parent.videoframe.avEditDir+"popup.css\" />\n"+
  "</head>\n"+
  " <script language=\"javascript\" type=\"text/javascript\">\n"+
  "  var lang=\""+lang+"\";\n"+
  "  var num="+num+";\n"+
  " </script>\n"+
  "<body>\n"+
  "<form action=\"javascript:submitSlideSource();\" name=\"form\" >\n"+
  "<h1 align=\"center\">"+getString("e_edit_Slide_source")+"</h1><br />\n"+
  " <table align=\"center\">\n"+
  "  <tr>\n"+
  "   <td>Language</td>\n"+
  "   <td>\n"+
  getLangOptions(lang)+
  "   </td>\n"+
  "  </tr><tr>\n"+
  "   <td>Slide Type</td>\n"+
  "   <td>\n"+
  getSlideSelection(source.type, " onChange=\"updateDisplay();\" ")+
  "    <a href=\"javascript:opener.convertSlides();window.close();\" title=\""+getString("e_convert_slides")+" (.ppt, .odp, .sxi, .pdf) \""+
  "     class=\"linkbutton\">"+getString("e_convert_button")+"</a>\n"+
  "   </td>\n"+
  "  </tr>\n"+
  "  <tr>\n"+
  "   <td><div id=\"urllabel\">"+getString("e_slide_url")+"</div></td>\n"+
  "   <td><div id=\"urlbox\"><input type=\"textfield\" size=\"50\" name=\"url\" value=\""+source.url+"\" onChange=\"checkURL();\" />"+
  "&nbsp;<input type=\"button\" value=\"Select\" onClick=\"window.open('"+fileBrowser+"', '_blank', 'width=750,height=480,status=no,toolbar=no,menubar=no,scrollbars=yes,resizable=1')\" /></div></td>\n"+
  "  </tr>\n"+
  "  <tr>\n"+
  "   <td><div id=\"typelabel\">"+getString("e_image_type")+"</div></td>\n"+
  "   <td>\n"+
  "    <div id=\"typebox\">"+getSlideTypeSelection(source.slideType)+" ("+getString("e_image_only")+")</div>\n"+
  "</td>\n"+
  "  </tr>\n"+
  "</table>\n"+
  " <p align=\"center\"><input type=\"submit\" value=\""+getString("e_update")+"\" /></p>\n"+
  "</form>\n"+
  "<!-- The defer attribute below is needed to stop IE crashing and using 100% of the processor time. Don't ask me why this works, but it does -->\n"+
  "<script language=\"javascript\" type=\"text/javascript\" src=\"avedit/slidesrc.js\" defer></script>\n"+
  "</body>\n"+
  "</html>\n";

 popupWindow(data);
}

function getSlideSelection(type, extra)
{
 var data="    <select name=\"type\""+extra+">\n";

 data=data+formOption(type, parent.videoframe.SLIDE_OOFLASH, getString("flashslides")+" ("+getString("e_openoffice")+")");
 data=data+formOption(type, parent.videoframe.SLIDE_AVFLASH, getString("flashslides")+" ("+getString("e_avconvert")+")");
 data=data+formOption(type, parent.videoframe.SLIDE_SEPFLASH, getString("flashslides")+" ("+getString("e_sepflash")+")");
 data=data+formOption(type, parent.videoframe.SLIDE_IMAGE_PRELOAD, getString("preloadimage"));
 data=data+formOption(type, parent.videoframe.SLIDE_IMAGE, getString("imageslides"));
 data=data+formOption(type, parent.videoframe.SLIDE_PDF, getString("pdfslides")+" ("+getString("e_print_only")+")");
 data=data+formOption(type, parent.videoframe.SLIDE_NONE, getString("noslides"));

 data=data+"    </select>\n";
 return data;
}

function getSlideTypeSelection(slideType)
{
 var data="<select name=\"slideType\">\n";

 data=data+formOption(slideType, "", "None");
 data=data+formOption(slideType, ".jpg", "JPEG");
 data=data+formOption(slideType, ".png", "PNG");
 data=data+formOption(slideType, ".gif", "GIF");

 data=data+"     </select>";
 return data;
}

function addUpdateSlideSrc(lang, num, newlang, type, url, slideType, noUpdate)
{
 if (typeof(noUpdate)=="undefined")
  noUpdate=false;

 var oldSlideSet=parent.videoframe.slideSet;
 parent.videoframe.addUpdateSlideSrc(lang, num, newlang, type, url, slideType);
 componentsDisplay();

 if (oldSlideSet!=parent.videoframe.slideSet && noUpdate==false)
 {
  saveXMLConfig();
  parent.videoframe.presentationLoaded=false;
  setTimeout("parent.videoframe.location.reload()", 1500);
 }
}


function deleteSubtitleSrc(lang)
{
 var ok=confirm(getString("e_delete_source"));
 if (ok)
 {
  parent.videoframe.deleteSubtitleSrc(lang);
  subtitlesDisplay();
  saveXMLConfig();
 }
}

function editSubtitleSrc(lang)
{
 if (typeof(lang)=="undefined")
 {
  alert("No language specified.");
  return;
 }

 var url="";
 if (typeof(parent.videoframe.subtitleSrc[lang])!="undefined")
  url=parent.videoframe.subtitleSrc[lang];

 var data="<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\""+
  "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n"+
  "<html>\n"+
  "<head>\n"+
  " <link type=\"text/css\" rel=\"stylesheet\" href=\""+parent.videoframe.avEditDir+"popup.css\" />\n"+
  " <title>"+getString("e_edit_subtitle_source")+"</title>\n"+
  "</head>\n"+
  "<body>\n"+
  "<form action=\"javascript:submitForm();\" name=\"form\">\n"+
  "<input type=\"hidden\" name=\"lang\" value=\""+lang+"\" />\n"+
  "<h1 align=\"center\">"+getString("e_edit_subtitle_source")+"</h1><br />\n"+
  " <table align=\"center\">\n"+
  "  <tr>\n"+
  "   <td>"+getString("e_subtitle_source_type")+"</td>\n"+
  "   <td>\n"+
  "    <select name=\"type\" onchange=\"updateDisplay();\">\n"+
  "     <option value=\"jsavs\">"+getString("e_subtype_jsavsfile")+"</option>\n";

  if (url.length==0)
    data=data+"     <option value=\"blank\">"+getString("e_subtype_blank")+"</option>\n"+
    "     <!--<option value=\"textfile\">"+getString("e_subtype_textfile")+"</option>-->\n"+
    "     <option value=\"textbox\">"+getString("e_subtype_textbox")+"</option>\n";

  data=data+    "    </select>\n"+
  "   </td>\n"+
  "  </tr>\n"+
  "  <tr>\n"+
  "   <td><div id=\"urllabel\">"+getString("e_subtitle_url")+"</div></td>\n"+
  "   <td><div id=\"urlbox\"><input type=\"textfield\" size=\"50\" name=\"url\" value=\""+url+"\" />&nbsp;"+
  "<input type=\"button\" value=\"Select\" onClick=\"window.open('"+fileBrowser+"', '_blank', "+
  "'width=750,height=280,status=no,toolbar=no,menubar=no,scrollbars=yes,resizable=1')\" /></div></td>\n"+
  "  </tr><tr>\n"+
  "   <td valign=\"top\"><div id=\"boxlabel\" style=\"display:none;\">"+getString("e_subtitle_boxname")+"</div></td>\n"+
  "   <td><div id=\"subbox\" style=\"display:none;\"><textarea name=\"subtitles\" cols=\"55\" rows=\"25\"></textarea></div></td>\n"+
  "  </tr>\n"+
  "</table>\n"+
  " <p align=\"center\"><input type=\"submit\" value=\""+getString("e_update")+"\" /></p>\n"+
  "</form><br />\n"+
  "<!-- The defer attribute below is needed to stop IE crashing and using 100% of the processor time. Don't ask me why this works, but it does -->\n"+
  "<script language=\"javascript\" type=\"text/javascript\" src=\"avedit/subtitlesrc.js\" defer></script>\n"+
  "</body>\n"+
  "</html>";

 popupWindow(data);
}

function getSlideSrcForm()
{

}

function addUpdateSubtitleSrc(lang, type, data)
{
 if (type=="jsavs")
  parent.videoframe.addUpdateSubtitleSrc(lang, data);
 else
 if (type=="blank")
 {
  parent.videoframe.subtitleLang=lang;
  var subtitles=new Array();
  subtitles[1]="";
  var file=getNewSubtitleFileName(lang);
  saveSubtitles(subtitles, lang, file);
  parent.videoframe.addUpdateSubtitleSrc(lang, file);
 }
 else
 if (type=="textfile")
 {
  alert("Not implemented");
 }
 else
 if (type=="textbox")
 {
  var subtitles=processSubtitles(data);
  var file=getNewSubtitleFileName(lang);
  saveSubtitles(subtitles, lang, getNewSubtitleFileName(lang));
  parent.videoframe.addUpdateSubtitleSrc(lang, file);
 }

 subtitlesDisplay();
 saveXMLConfig();
}

function getNewSubtitleFileName(lang)
{
 var dot=xmlFile.lastIndexOf(".");
 var strippedName=xmlFile.substring(0,dot);
 return strippedName+"-"+lang+".avs";
}

/*****These methods processs a subtitle transcript into useable subtitles*****/

function processSubtitles(subdata)
{
 var split=subdata.split("\n");
 var splitData=false, splitQuestion=false;
 var subtitles=new Array();
 subtitles[0]="";

 for (var loop=0; loop<split.length; loop++)
 {
  //split[loop]=split[loop].trim();

  if (splitQuestion==false && split[loop].length>210)
  {
   splitQuestion=true;
   splitData=confirm(getString("e_sub_split"));
  }

  if (split[loop].length>210 && splitData==true)
   splitSubtitle(split[loop], subtitles);
  else
   if (split[loop].length>0)
    subtitles.push(trimString(split[loop]));
 }

 /**
 var data="";
 for (var loop=0; loop<subtitles.length; loop++)
  data=data+"<p>"+loop+": "+subtitles[loop]+"</p>\n";

 popupWindow(data);
 **/

 return subtitles;
}

function splitSubtitle(toSplit, subtitles)
{
 var testChars=new Array(".", "?", "!", ";", ":", ",");
 var right;

 for (var charNum=0; charNum<testChars.length; charNum++)
 {
  var pos=toSplit.indexOf(testChars[charNum]);
  while(isDecimal(toSplit, pos))
   pos=toSplit.indexOf(testChars[charNum], pos+1);

  if (pos<211 && pos>-1)
  {
   var newPos=toSplit.indexOf(testChars[charNum], pos+1);
   while(isDecimal(toSplit, newPos))
    newPos=toSplit.indexOf(testChars[charNum], newPos+1);

   if (pos<60 || toSplit.length-pos<60 || newPos-pos<60)
   {
    if (newPos<211 && newPos>-1)
     pos=newPos;
   }

   if (pos>29)
   {
    var left=toSplit.substring(0, pos+1);
    subtitles.push(trimString(left));
    right=toSplit.substring(pos+1);
    break;
   }
  }
 }

 if (typeof(right)=="undefined")
 {
  var length=211;
  if (toSplit.length<420)
   length=toSplit.length/2;
 
  var fullStop=toSplit.indexOf(".");
  if (fullStop<420)
   length=fullStop/2;

  var space=toSplit.substring(0,length).lastIndexOf(" ");
  if (space<211 && space>-1)
  {
   var left=toSplit.substring(0, space+1);
   subtitles.push(trimString(left));
   right=toSplit.substring(space+1);
  }
  else
  {
   subtitles.push(trimString(toSplit));
   return;
  }
 }

 if (right.length>210)
  return splitSubtitle(right, subtitles);
 else
  if (right.length>0)
   subtitles.push(trimString(right));
}

function trimString(value)
{
 var re = /\s*((\S+\s*)*)/;
 value=value.replace(re, "$1"); 
 re = /((\s*\S+)*)\s*/;
 value=value.replace(re, "$1"); 
 return value;  
}

function isDecimal(toSplit, pos)
{
 if (toSplit.charAt(pos)=="." || toSplit.charAt(pos)==",")
  if (pos-1>-1 && isNumber(toSplit.charAt(pos-1)))
   if (pos+1<toSplit.length && isNumber(toSplit.charAt(pos+1)))
    return true;

 return false;
}

function isNumber(char)
{
 if (char=="0" || char=="1" || char=="2" || char=="3" || char=="4" || char=="5" || char=="6" || char=="7" || char=="8" || char=="9")
  return true;

 return false;
}

/*****Subtitle editing methods*****/

function addSubtitleBefore()
{
 if (typeof(parent.videoframe.subtitles)!="undefined")
 {
  parent.videoframe.addSubtitleBefore();
  fillSubtitleSummary();
  saveCurrentSubtitles();
 }
}

function addSubtitleAfter()
{
 if (typeof(parent.videoframe.subtitles)!="undefined")
 {
  parent.videoframe.addSubtitleAfter();
  fillSubtitleSummary();
  saveCurrentSubtitles();
 }
}

function editSubtitle()
{
 if (typeof(parent.videoframe.subtitles)!="undefined")
  parent.videoframe.editSubtitle();
}

function deleteSubtitle()
{
 if (typeof(parent.videoframe.subtitles)!="undefined")
 {
  parent.videoframe.deleteSubtitle();
  fillSubtitleSummary()
  saveCurrentSubtitles();
 }
}

function addSubtitleAtEnd(time, text)
{
 if (typeof(parent.videoframe.subtitleLang)=="undefined")
  parent.videoframe.subtitleLang=parent.videoframe.preferedLang;

 if(typeof(parent.videoframe.subtitleSrc[parent.videoframe.subtitleLang])=="undefined")
 {
  var subtitles=new Array();
  subtitles[1]="Chat Session Transcript";
  var file=getNewSubtitleFileName(parent.videoframe.subtitleLang);
  saveSubtitles(subtitles, parent.videoframe.subtitleLang, file);
  parent.videoframe.addUpdateSubtitleSrc(parent.videoframe.subtitleLang, file);
  parent.videoframe.subtitles=subtitles;
  var tms=new Array();
  tms[0]=0;
  parent.videoframe.subTimes[parent.videoframe.subtitleLang]=tms;
  saveXMLConfig();
  //parent.videoframe.addSubtitleAtEnd(0, "Chat Session Transcript");
 }
 //alert(parent.videoframe.subtitles.length);
 //if (parent.videoframe.subtitles.length==0)
 //{
  //parent.videoframe.subtitles[1]="Chat Session Transcript";
  //parent.videoframe.subTimes[parent.videoframe.subtitleLang][0]=0;
  //parent.videoframe.addSubtitleAtEnd(0, "Chat Session Transcript");
 //}

 //alert(time+" "+text);

 parent.videoframe.addSubtitleAtEnd(time, text);
 saveCurrentSubtitles();
}

/*****For popup windows*****/

function popupWindow(data)
{
 var exwin=window.open("","_blank",
  "width=750,height=300,toolbar=no,menubar=no,scrollbars=yes,resizable=yes");
 exwin.document.open("text/html");
 exwin.document.writeln(data);
 exwin.document.close();
 return exwin;
}

/*****Handle options/controls*****/

function updateOption(check, option)
{
 if (option=="videos")
 {
  parent.videoframe.showVideoControls=check.checked;
  parent.videoframe.setVideoControls();
 }
 else
 if (option=="slides")
 {
  parent.videoframe.showSlideControls=check.checked;
  parent.videoframe.setSlideControls();
 }
 else
 if (option=="subtitles")
 {
  parent.videoframe.showSubtitleControls=check.checked;
  parent.videoframe.setSubtitleControls();
 }
 else
 if(option=="language")
 {
  parent.videoframe.showLanguageControls=check.checked;
  parent.videoframe.setLanguageHTML();
 }
 if (option=="position")
 {
  parent.videoframe.showPositionControls=check.checked;
  parent.videoframe.setPositionControl();
 }
 else
 if (option=="slideMenu")
 {
  parent.videoframe.showSlideMenu=check.checked;
  parent.videoframe.setSlideMenu();
 }
 else
 if (option=="thumbnail")
 {
  parent.videoframe.showThumbnailControls=check.checked;
  parent.videoframe.setThumbnailControl();
 }
 else
 if (option=="other")
 {
  parent.videoframe.showOtherControls=check.checked;
  parent.videoframe.setExtraButtonsHTML();
 }
 else
 if (option=="exithide")
 {
  parent.videoframe.alwaysHideExit=check.checked;
  parent.videoframe.setExtraButtonsHTML();
 }
 else
 if (option=="showthumbs")
 {
  parent.videoframe.setThumbnailsActive(check.checked);
  parent.videoframe.setThumbnails(check.checked);
 }
 else
 if (option=="showsubtitles")
 {
  parent.videoframe.setSubtitlesActive(check.checked);
  parent.videoframe.setSubtitles(check.checked);
 }
 else
 if (option=="autostart")
 {
  parent.videoframe.setAutoStart(check.checked);
 }
 else
 if (option=="videoright")
 {
  if (check.checked)
   parent.videoframe.setVideoPosition(parent.videoframe.VIDEORIGHT);
  else
   parent.videoframe.setVideoPosition(parent.videoframe.VIDEOLEFT);

  parent.videoframe.presentationLoaded=false;
  setTimeout("parent.videoframe.location.reload()", 1500);
 }
 else
 if (option=="pauseafterslide")
 {
  parent.videoframe.setPauseAfterSlide(check.checked);
 }
 else
 if (option=="widescreenvideo")
 {
  if (check.checked)
   parent.videoframe.setVideoAspect(0.5625);
  else
   parent.videoframe.setVideoAspect(0.75);

  parent.videoframe.presentationLoaded=false;
  setTimeout("parent.videoframe.location.reload()", 1500);
 }
 else
 if (option=="downloadbutton")
 {
  parent.videoframe.setDownloadButton(check.checked);
 }
 else
 saveXMLConfig();
}

/****Save presentation****/

function saveAll()
{
 var data=getSaveConfigInputs();
 if (parent.videoframe.subtitleSet)
  data=data+"\n"+getSaveSubtitleInputs(parent.videoframe.subtitles,
   parent.videoframe.subtitleLang, parent.videoframe.subtitleSrc[parent.videoframe.subtitleLang])

 saveViaIframe(data);
}

function saveXMLConfig()
{
 saveViaIframe(getSaveConfigInputs());
}

function getSaveConfigInputs()
{
 var data=doBase64(parent.videoframe.exportXMLConfig(""));

 return " <input type=\"hidden\" name=\"xmldata\" value=\""+data+"\" />"+
  " <input type=\"hidden\" name=\"xmlid\" value=\""+xmlID+"\" />\n";
}

function checkIFrame()
{
 /***The Iframe used for saving occasionally seems to vanish, so check for it and re-create if necessary***/
 if (typeof(window.usefulIframe)=="undefined")
 {
  //alert("IFrame was null, recreated");
  var element=document.getElementById("editor");
  element.innerHTML=element.innerHTML+"\n<iframe height=\"0\" width=\"0\" frameborder=\"0\" name=\"usefulIframe\" marginwidth=\"0\""+
  "  marginheight=\"0\"></iframe>";
 }
}

function saveCurrentSubtitles()
{
 saveSubtitles(parent.videoframe.subtitles, parent.videoframe.subtitleLang, parent.videoframe.subtitleSrc[parent.videoframe.subtitleLang]);
}

function saveSubtitles(subtitles, subtitleLang, file)
{
 var fileChange=false;
 if (file.indexOf(".js")>0)
 {
  if (confirm(getString("e_subtitlefileformat")))
  {
   file=getNewSubtitleFileName(subtitleLang);
   fileChange=true;
  }
  else
   return;
 }

 saveViaIframe(getSaveSubtitleInputs(subtitles, subtitleLang, file));

 if (fileChange)
  parent.videoframe.addUpdateSubtitleSrc(subtitleLang, file);
}

function getSaveSubtitleInputs(subtitles, subtitleLang, file)
{
 var data="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"+
  "<avsubtitles>\n"+
  " <version>"+parent.videoframe.VERSION+"</version>\n"+
  " <lang>"+subtitleLang+"</lang>\n"+
  " <subdata>\n";

 for (var loop=1; loop<subtitles.length; loop++)
  data=data+"  <subtitle pos=\""+loop+"\">"+parent.videoframe.jsEscape(subtitles[loop])+"</subtitle>\n";

 data=data+" </subdata>\n"+
  "</avsubtitles>\n";

 data=doBase64(data);

 return " <input type=\"hidden\" name=\"subdata\" value=\""+data+"\" />"+
  " <input type=\"hidden\" name=\"xmlid\" value=\""+xmlID+"\" />\n"+
  " <input type=\"hidden\" name=\"subtitlefile\" value=\""+file+"\" />\n";
}

function doBase64(data)
{
 if (typeof(btoa)=="undefined")
  return encodeBase64(data);
 else
  return btoa(data);
}

function saveViaIframe(inputFields)
{
 checkIFrame();
 window.usefulIframe.document.open("text/html");
 window.usefulIframe.document.writeln("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\""+
  "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">"+
  "<html><head><title>XML Config</title></head>\n"+
  "<body onload=\"startEditor()\">\n"+
  "<form style=\"display:none;\" action=\""+xmlSendURL+"\" method=\"post\" type=\"multipart/form-data\" name=\"formdata\">\n"+
  inputFields+
  " <input type=\"submit\" value=\"Submit Subtitle XML\" /><br />\n"+
  "</form>\n"+
  "<script type=\"text/javascript\">\n"+
  " function startEditor()\n"+
  " {\n"+
  "  document.location=\""+document.location+"\";\n"+
  " }\n"+
  "</script>\n"+
  "</body>\n"+
  "</html>\n");

 window.usefulIframe.document.forms.formdata.submit();
 window.usefulIframe.document.close();
}


/*****PPT Converter code*****/

function convertSlides()
{
 if (conversionURL.length>0)
 {
  var data="<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\""+
   "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n"+
   "<html>\n"+
   "<head>\n"+
   " <title>"+getString("e_convert_heading")+"</title>\n"+
   " <link type=\"text/css\" rel=\"stylesheet\" href=\""+parent.videoframe.avEditDir+"popup.css\" />\n"+
   "</head>\n"+
   "<body><div id=\"converter\"></div>\n"+
   "<script language=\"javascript\" type=\"text/javascript\" src=\""+parent.videoframe.avEditDir+"convertsrc.js\" defer=\"defer\"></script>\n"+
   "</body>\n"+
   "</html>";

  var wn=popupWindow(data);
  wn.focus();
 }
 else
  parent.videoframe.showMessage(getString("e_convertmessage"));
}

/*****Quick access to Live Capture*****/

function useLiveCapture()
{
 if (parent.videoframe.flashRecord==false)
 {
  parent.videoframe.showMessage(getString("e_livecapturenotallowed"));
  return;
 }

 if (parent.videoframe.hasLiveCapture(true))
  return;

 var ln="en";
 if (typeof(parent.videoframe.selectedLang)!="undefined")
  ln=parent.videoframe.selectedLang;

 if (parent.videoframe.flashCapture.length>0 && parent.videoframe.liveCaptureURL.length>0)
 {
  //We have both types of capture available
  if (confirm(getString("e_livecapturechoice")))
   parent.videoframe.addUpdateAVSrc(null, -1, ln, parent.videoframe.VIDEO_JAVALIVE, null, null, null);
  else
   parent.videoframe.addUpdateAVSrc(null, -1, ln, parent.videoframe.VIDEO_FLASHLIVE, null, null, null);
 }
 else
 if (parent.videoframe.flashCapture.length>0)
  parent.videoframe.addUpdateAVSrc(null, -1, ln, parent.videoframe.VIDEO_FLASHLIVE, null, null, null);
 else
 if (parent.videoframe.liveCaptureURL.length>0)
  parent.videoframe.addUpdateAVSrc(null, -1, ln, parent.videoframe.VIDEO_JAVALIVE, null, null, null);

 componentsDisplay();
 saveXMLConfig();
}

/*****Access live broadcast mode*****/

function useLiveBroadcast()
{
  if (parent.videoframe.flashBroadcast==false)
   parent.videoframe.showMessage(getString("e_livebroadnotallowed"));
  else
  if (parent.videoframe.flashServer.length==0)
   setElementHTML("main", '<p>'+getString("e_noflashserver")+'</p>');
  else
  if (parent.videoframe.flashCapture.length==0)
   setElementHTML("main", '<p>'+getString("e_noflashcapture")+'</p>');
  else
  {
   var name=setLiveBroadcastClient();
   //setTimeout(setLiveBroadcastHTML(name), 1000);
   setLiveBroadcastHTML(name);
  }
}

function setLiveBroadcastClient()
{
 var name=parent.videoframe.liveBroadcastUrl();
 if (name==null)
 {
  //There is no reciever configured, so add one with a default name
  var ln="en";
  name=getLiveBroadcastName();
  if (typeof(parent.videoframe.selectedLang)!="undefined")
   ln=parent.videoframe.selectedLang;
  parent.videoframe.addUpdateAVSrc(null, -1, ln, parent.videoframe.VIDEO_FLASHBROADCAST,"$flashserver/"+name, null, null);
 }
 else
  if (name.indexOf("$flashserver")==0)
   name=name.substring(13);
  else
   name=name.substring(parent.videoframe.flashServer.length+1);

 saveXMLConfig();

 return name;
}

function setLiveBroadcastHTML(name)
{
 var playerHeight=395;
 var playerWidth=240;

 var data='type="application/x-shockwave-flash" data="'+parent.videoframe.flashCapture+'/avbroadcast.swf"\n';
 if (parent.videoframe.browser==parent.videoframe.MSIE)
  data='classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"\n'+     
  'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"';

 var cfg="maxKbps="+broadcastMaxKbps+"&server="+parent.videoframe.flashServer+
  "&stream="+name+"&host="+parent.videoframe.flashHost;

 if (parent.videoframe.slideSet)
 {
  cfg=cfg+"&slidecount="+parent.videoframe.titles[parent.videoframe.slideLang].length+"&slides=";
  for (var loop=0; loop<parent.videoframe.titles[parent.videoframe.slideLang].length; loop++)
  {
   cfg=cfg+cleanTitleForFlash(parent.videoframe.titles[parent.videoframe.slideLang][loop])+"{^}";
  }
 }
 else
   cfg=cfg+"&slidecount=----------";

 var s='<object '+data+
  ' width="'+playerWidth+'" height="'+playerHeight+'" id="autoviewBroadcast">\n'+
  ' <param name="movie" value="'+parent.videoframe.flashCapture+'/avbroadcast.swf" />\n'+ 
  ' <param name="flashvars" value="'+cfg+'" />\n'+
  ' <param name="allowScriptAccess" value="always" />\n'+
  '<\/object>\n';

 setElementHTML("main", s);
}

function cleanTitleForFlash(prep)
{
 if (typeof(prep)=="undefined")
  return "";

 for (var pos=0; pos<prep.length; pos++)
 {
  var c=prep.charCodeAt(pos);
  if (c>127 || c==34 || c==60 || c==62 || c==38 || c==39 || c==45 || c==10 || c==13)
  {
   var first=prep.substring(0,pos)+" ";
   prep=first+prep.substring(pos+1);
   pos=first.length-1;
  }
 }
 return prep;
}

function getLiveBroadcastName()
{
 var name=xmlFile.substring(0, xmlFile.length-4);
 if (name.indexOf("config")==name.length-6)
  return name.substring(0, name.length-6)+"broadcast-video";

 return name+"-"+xmlID;
}

/*****New presentation wizard*****/

function quickStart()
{
 var data="<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\""+
  "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n"+
  "<html>\n"+
  "<head>\n"+
  " <title>"+getString("eq_title")+"</title>\n"+
  " <link type=\"text/css\" rel=\"stylesheet\" href=\""+parent.videoframe.avEditDir+"popup.css\" />\n"+
  "</head>\n"+
  "<body><div id=\"questions\"></div>\n"+
  "<script language=\"javascript\" type=\"text/javascript\" src=\""+parent.videoframe.avEditDir+"quicksrc.js\" defer=\"defer\"></script>\n"+
  "</body>\n"+
  "</html>";

 popupWindow(data);
}

/*****Pause Method*****/

function pause(millis) 
{
 var date = new Date();
 var curDate = null;
 
 do { curDate = new Date(); } 
 while(curDate-date < millis);
}

/*****Escape text for HTML*****/

function htmlEscape(prep)
{
 if (typeof(prep)=="undefined")
  return "";

 for (var pos=0; pos<prep.length; pos++)
 {
  var c=prep.charCodeAt(pos);
  if (c>127 || c==34 || c==61 || c==62 || c==38 || c==39 || c==60 || c==62 || c==45)
  {
   var first=prep.substring(0,pos)+"&#"+c+";";
   prep=first+prep.substring(pos+1);
   pos=first.length-1;
  }
 }
 return prep;
}
