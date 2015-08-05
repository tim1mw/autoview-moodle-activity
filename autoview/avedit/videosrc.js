/*************************************************************************

   Copyright: EuroMotor-AutoTrain LLP 2007

   License: GPLv2 + Commercial

   Authors: Tim Williams (tmw@autotrain.org)

*************************************************************************/

updateDisplay();

function updateDisplay()
{
 var selection=document.form.type.value;

 if (selection==opener.parent.videoframe.VIDEO_JAVALIVE ||
     selection==opener.parent.videoframe.VIDEO_FLASHLIVE ||
     selection==opener.parent.videoframe.VIDEO_NONE || 
     selection==opener.parent.videoframe.VIDEO_VLC ||
     selection==opener.parent.videoframe.VIDEO_JAVAAUDIO ||
     selection==opener.parent.videoframe.VIDEO_FLASH ||
     selection==opener.parent.videoframe.VIDEO_SILVERLIGHT ||
     selection==opener.parent.videoframe.VIDEO_FLASHBROADCAST ||
     selection==opener.parent.videoframe.VIDEO_HTML5 )
  setEventDisplay("none");
 else
  setEventDisplay("inline");

 if (selection==opener.parent.videoframe.VIDEO_JAVALIVE ||
     selection==opener.parent.videoframe.VIDEO_FLASHLIVE ||
     selection==opener.parent.videoframe.VIDEO_NONE)
 {
  setURLDisplay("none");
  setBandwidthDisplay("none");
 }
 else
 {
  setURLDisplay("inline");
  setBandwidthDisplay("inline");
 }
} 

function setEventDisplay(val)
{
 document.getElementById("eventlabel").style.display=val;
 document.getElementById("eventcheck").style.display=val;
 document.getElementById("eventnote").style.display=val;
}

function setURLDisplay(val)
{
 document.getElementById("urllabel").style.display=val;
 document.getElementById("urlbox").style.display=val;
}

function setBandwidthDisplay(val)
{
 document.getElementById("bandlabel").style.display=val;
 document.getElementById("bandbox").style.display=val;
}

function submitVidSource()
{
 if (checkType())
 {
  if (document.form.type.value==opener.parent.videoframe.VIDEO_FLASH)
  {
   var url=document.form.url.value.toLowerCase();
   if ( (url.indexOf(".flv") || url.indexOf(".mp3")) && url.indexOf("://")<0 && url.indexOf("$flashserver")<0 && opener.liveCaptureInstalled)
   {
    if (opener.alwaysFlashStream==true || confirm(opener.getString("e_streamquestion")))
     document.form.url.value="$flashserver/"+document.form.url.value;
   }
  }
  opener.addUpdateVideoSrc(lang, num, document.form.lang.value, document.form.type.value, document.form.url.value,     
   document.form.speed.value, !document.form.triggers.checked);
  window.close();
 }
}

function checkType()
{
 var detectedType=getTypeFromExtension();
 //If types match it's OK
 if (detectedType==document.form.type.value)
  return true;

 if (document.form.type.value==opener.parent.videoframe.VIDEO_JAVALIVE  || document.form.type.value==opener.parent.videoframe.VIDEO_FLASHLIVE)
  return true;

 //VLC won't be detected, but can play most things except Real
 if (detectedType!=opener.parent.videoframe.VIDEO_REALPLAYER && document.form.type.value==opener.parent.videoframe.VIDEO_VLC)
  return true;

 if (document.form.url.value.toLowerCase().indexOf(".mp4")>-1 && document.form.type.value==opener.parent.videoframe.VIDEO_HTML5)
  return true;

 if (document.form.url.value.toLowerCase().indexOf(".mp3")>-1 && detectedType!=opener.parent.videoframe.VIDEO_JAVAAUDIO)
  return true;

 //Silverlight can play what windows media can play
 if (detectedType==opener.parent.videoframe.VIDEO_WINDOWSMEDIA  && document.form.type.value==opener.parent.videoframe.VIDEO_SILVERLIGHT)
  return true;

 //VIDEO_FLASH and VIDEO_FLASHBROADCAST can play the same types of file, but in different contexts
 if (document.form.type.value==opener.parent.videoframe.VIDEO_FLASHBROADCAST && detectedType==opener.parent.videoframe.VIDEO_FLASH)
  return true;

 return confirm(opener.getString("e_video_type_warn"));
}

function detectType()
{
 var type=getTypeFromExtension();
 if (type==opener.parent.videoframe.VIDEO_NONE)
  alert(opener.getString("e_unrecognised_video_type"));
 else
  document.form.type.value=type;
}

function getTypeFromExtension()
{
 var url=document.form.url.value.toLowerCase();
 if (url.indexOf(".mov")>-1 || url.indexOf(".mp4")>-1)
  return opener.parent.videoframe.VIDEO_QUICKTIME;
 else
 if (url.indexOf(".rm")>-1 || url.indexOf(".ram")>-1 ||
     url.indexOf(".ra")>-1 || url.indexOf(".rv")>-1 || (url.indexOf(".mp3")>-1 && url.indexOf("rtsp://")>-1) )
  return opener.parent.videoframe.VIDEO_REALPLAYER;
 else
 if (url.indexOf(".wmv")>-1 || url.indexOf(".asf")>-1 ||
     url.indexOf(".avi")>-1 || url.indexOf(".wma")>-1)
  return opener.parent.videoframe.VIDEO_WINDOWSMEDIA;
 else
 if (url.indexOf(".ogg")>-1 || url.indexOf(".ogv")>-1 || url.indexOf(".ogm")>-1)
  return opener.parent.videoframe.VIDEO_HTML5;
 else
 if (url.indexOf(".oga")>-1)
  return opener.parent.videoframe.VIDEO_JAVAAUDIO;
 else
 if (url.indexOf(".flv")>-1  || url.indexOf("rtmp://")>-1 || url.indexOf("$flashserver")>-1 || (url.indexOf(".mp3")>-1 && url.indexOf("rtsp://")<0) )
  return opener.parent.videoframe.VIDEO_FLASH;

 return opener.parent.videoframe.VIDEO_NONE;
}
