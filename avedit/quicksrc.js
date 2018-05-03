/*************************************************************************

   Copyright: EuroMotor-AutoTrain LLP 2009

   License: GPLv3 + Commercial

   Authors: Tim Williams (tmw@autotrain.org)

*************************************************************************/

var hasSlides=false;
var preVideo=false;

showVideoSelect();

/**Select pre-recorded video**/

function showVideoSelect()
{
 setElementHTML("questions", "<div></div>");

 var data="<h1 style=\"text-align:center;\">"+opener.getString("eq_maintitle")+"</h1><br />\n"+
  "<table align=\"center\"><tr><td>\n"+
  "<h2>"+opener.getString("eq_video_select")+"</h2>\n"+
  "<p><form action=\"javascript:videoSelect();\" name=\"form\">\n"+
  " <table><tr>\n"+
  "   <td><div id=\"urllabel\">"+opener.getString("e_video_url")+"</div></td>\n"+
  "   <td><div id=\"urlbox\"><input type=\"textfield\" size=\"50\" name=\"url\" value=\"\" id=\"urlboxfield\" />"+
  "&nbsp;<input type=\"button\" value=\"Select\" onClick=\"window.open('"+opener.fileBrowser+"', '_blank', 'width=800,height=480,status=no,toolbar=no,menubar=no,scrollbars=yes,resizable=1');\" /></div></td>\n"+
  " </tr></table>\n"+
  " <p align=\"center\"><input type=\"submit\" value=\""+opener.getString("eq_continue")+"\" /></p>\n"+
  "</form></p>\n"+
  "</td></tr></table>";
 setElementHTML("questions", data);
}

function videoSelect()
{
 var url=document.form.url.value.toLowerCase();
 var type=getTypeFromExtension();

 opener.addUpdateVideoSrc(opener.parent.videoframe.preferedLang, -1, opener.parent.videoframe.preferedLang, type, document.form.url.value,     
   opener.parent.videoframe.SPEED_NONE, true);
 focusWindow();
 showSlideQuestion();
}

function getTypeFromExtension()
{
 var url=document.form.url.value.toLowerCase();

 if (url.indexOf(".flv")>-1  || url.indexOf("rtmp://")>-1 || (url.indexOf(".mp3")>-1 && url.indexOf("rtsp://")<0) )
  return opener.parent.videoframe.VIDEO_FLASH;
 else
  if (url.indexOf(".ogg")>-1 || url.indexOf(".ogv")>-1 || url.indexOf(".ogm")>-1 || url.indexOf(".mp4")>-1  || url.indexOf(".mp3")>-1)
   return opener.parent.videoframe.VIDEO_HTML5;

 return opener.parent.videoframe.VIDEO_NONE;
}


/**Do we have slides ?**/

function showSlideQuestion()
{
 var data="<h1 style=\"text-align:center;\">"+opener.getString("eq_maintitle")+"</h1><br />\n"+
  "<table align=\"center\"><tr><td>\n"+
  "<form action=\"javascript:slideQuestion();\" name=\"form\">\n"+
  "<h2>"+opener.getString("eq_slides")+"</h2>\n"+
  " <p><input type=\"radio\" name=\"slide\" value=\"yes\" checked=\"checked\" id=\"slideyes\" />"+opener.getString("eq_yes")+"<br />\n"+
  " <input type=\"radio\" name=\"slide\" value=\"no\" id=\"slideno\" />"+opener.getString("eq_no")+"</p>\n"+
  " <p align=\"center\"><input type=\"submit\" value=\""+opener.getString("eq_continue")+"\" /></p>\n"+
  "</form>"+
  "</td></tr></table>\n";

 setElementHTML("questions", data);
}

function slideQuestion()
{
 var data="";

 if (document.getElementById("slideyes").checked)
 {
  hasSlides=true;
  showSlideQuestion2();
 }
 else
  allDone();
}

/**Use convertor or pre-processed slides**/

function showSlideQuestion2()
{
 var dis="";
 if (opener.conversionURL.length==0)
  dis=" disabled=\"disabled\"";

  var data="<h1 style=\"text-align:center;\">"+opener.getString("eq_maintitle")+"</h1><br />\n"+
  "<table align=\"center\"><tr><td>\n"+
  "<h2>"+opener.getString("eq_slideq2")+"</h2>\n"+
  "<form action=\"javascript:slideQuestion2();\" name=\"form\">\n"+
  " <p><input type=\"radio\" name=\"slideq2\" value=\"yes\" checked=\"checked\" id=\"procyes\" />"+opener.getString("eq_yes")+"<br />\n"+
  " <input type=\"radio\" name=\"slideq2\" value=\"no\" id=\"procno\""+dis+" />"+opener.getString("eq_no")+"<br />\n";
 if (opener.conversionURL.length==0)
  data=data+"<p>"+opener.getString("e_convertmessage")+"</p>";
  data=data+" <p align=\"center\"><input type=\"submit\" value=\""+opener.getString("eq_continue")+"\" /></p>\n"+
  "</form>\n"+
  "</td></tr></table>\n";

 if (opener.conversionURL.length>0)
  data=data+"\n<br /><p>"+opener.getString("eq_quick_iepopup")+"</p>";

 setElementHTML("questions", data);
}

function slideQuestion2()
{
 if (document.getElementById("procyes").checked)
  showSlideSrcForm();
 else
 {
  opener.convertSlides();
  window.close();
 }
}

/**Add slide source**/

function showSlideSrcForm()
{
  var data="<h1 style=\"text-align:center;\">"+opener.getString("eq_maintitle")+"</h1><br />\n"+
  "<table align=\"center\"><tr><td>\n"+
  "<form action=\"javascript:processSlideSrcForm()\" name=\"form\" >\n"+
  "<h2>"+opener.getString("eq_slidesrc")+"</h2>\n"+
  " <p><table>\n"+
  "  <tr>\n"+
  "   <td><div id=\"urllabel\">"+opener.getString("e_slide_url")+"</div></td>\n"+
  "   <td><div id=\"urlbox\"><input type=\"textfield\" size=\"50\" name=\"url\" onChange=\"checkURL();\" id=\"urlboxfield\" />"+
  "&nbsp;<input type=\"button\" value=\"Select\" onClick=\"window.open('"+opener.fileBrowser+"', '_blank', 'width=800,height=480,status=no,toolbar=no,menubar=no,scrollbars=yes,resizable=1');\" /></div></td>\n"+
  "  </tr>\n"+
  "</table></p>\n"+
  " <p align=\"center\"><input type=\"submit\" value=\""+opener.getString("eq_continue")+"\" /></p>\n"+
  "</form>\n"+
  "</td></tr></table>";

 setElementHTML("questions", data);
}

function processSlideSrcForm()
{
 var url=document.form.url.value;
 var ext="";
 var type=opener.parent.videoframe.SLIDE_NONE;
 
 var index=url.indexOf(".swf");
 if (index>-1)
 {
  if (confirm(opener.getString("eq_ooslide")))
   type=opener.parent.videoframe.SLIDE_OOFLASH;
  else
   type=opener.parent.videoframe.SLIDE_AVFLASH;
 }
 else
 {
  var index=url.indexOf(".jpg");
  if (index>-1)
  {
   ext=".jpg";
   type=opener.parent.videoframe.SLIDE_IMAGE_PRELOAD;
  }
  else
  {
   index=url.indexOf(".gif");
   if (index>-1)
   {
    ext=".gif";
    type=opener.parent.videoframe.SLIDE_IMAGE_PRELOAD;
   }
   else
   {
    index=url.indexOf(".png");
    if (index>-1)
    {
     ext=".png";
     type=opener.parent.videoframe.SLIDE_IMAGE_PRELOAD;
    }
   }
  }
 }

 if (type==opener.parent.videoframe.SLIDE_IMAGE_PRELOAD)
 {
  var pos=url.lastIndexOf("/");
  document.form.url.value=url.substring(0,pos);
 }

 if (type==opener.parent.videoframe.SLIDE_NONE)
 {
  focusWindow();
  alert(opener.getString("eq_badslide"));
  allDone();
 }
 else
 {
  opener.addUpdateSlideSrc(opener.parent.videoframe.preferedLang, -1, opener.parent.videoframe.preferedLang,
   type, document.form.url.value, ext);
  focusWindow();
  numSlideQuestion();
 }
}

/**Number of slides**/

function numSlideQuestion()
{
 if (!waitFor("numSlideQuestion()"))
  return;

 var data="<h1 style=\"text-align:center;\">"+opener.getString("eq_maintitle")+"</h1><br />\n"+
  "<table align=\"center\"><tr><td>\n"+
  "<h2>"+opener.getString("eq_numslide1")+"</h2>\n"+
  "<form action=\"javascript:numSlides();\" name=\"form\">\n"+
  " <p>"+opener.getString("eq_numslide2")+" <input type=\"text\" name=\"num\" value=\"\" /></p>"+
  " <p align=\"center\"><input type=\"submit\" value=\""+opener.getString("eq_continue")+"\" /></p>\n"+
  "</form>\n"+
  "</td></tr></table>\n";

 setElementHTML("questions", data);
}

var scount=0;

function numSlides()
{
 opener.setNumSlidesValue(opener.parent.videoframe.preferedLang, document.form.num.value);
 allDone();
}

/**Finished**/

function allDone()
{
 var data="<h1 style=\"text-align:center;\">"+opener.getString("eq_maintitle")+"</h1><br />\n"+
  "<table align=\"center\"><tr><td>\n"+
  "<h2>"+opener.getString("eq_finished")+"</h2>\n"+
  "<p>"+opener.getString("eq_done")+"</p>\n"+
  "<div align=\"center\">"+
  "<form action=\"javascript:window.close();\"><input type=\"submit\" value=\""+opener.getString("eq_close")+"\" /></form>"+
  "</div>\n"+
  "</td></tr></table>\n";
 setElementHTML("questions", data);
 if (hasSlides && preVideo)
  opener.timesTitlesDisplay();
}

/**Utility methods**/

var timer=null;
var wcount=0;
function waitFor(method)
{
 try
 {
  wcount++;

  if (wcount<20)
  {
   if (typeof(opener.parent.videoframe.presentationLoaded)=="undefined")
    return false;

   if (opener.parent.videoframe.presentationLoaded==false)
   {
    if (timer==null)
    {
     setElementHTML("questions", 
      " <br /><br /><p style=\"text-align:center;font-weight:bold;\">"+opener.getString("e_convert_wait")+"</p>\n"+
      " <p style=\"text-align:center;font-weight:bold;\"><img src=\""+opener.parent.videoframe.avEditDir+"wait.gif\" width=\"116\" height=\"20\" alt=\"\"/></p>\n"+
      " <br /><p style=\"text-align:center;\">"+opener.getString("eq_wait_reload")+"</p>\n");

     timer=setInterval(method, 1000);
    }

    return false;
   }
  }

  if (timer!=null)
   clearInterval(timer);

  wcount=0;
  window.focus();
  return true;
 }
 catch (exc)
 {
  if (timer!=null)
   clearInterval(timer);

  wcount=0;
  return true;
 }
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

var tid;

function focusWindow()
{
 tid=setTimeout("window.focus();", 500);
}

function openFileBrowser()
{
 alert(opener.fileBrowser);
 var w=window.open(opener.fileBrowser, '_blank', 'width=800,height=480,status=no,toolbar=no,menubar=no,scrollbars=yes,resizable=1');
 w.focus();
}
