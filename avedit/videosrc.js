/*************************************************************************

   Copyright: EuroMotor-AutoTrain LLP 2007

   License: GPLv3 + Commercial

   Authors: Tim Williams (tmw@autotrain.org)

*************************************************************************/

updateDisplay();

function updateDisplay()
{
 var selection=document.form.type.value;

 if (selection==opener.parent.videoframe.VIDEO_NONE)
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

 if (url.indexOf(".ogg")>-1 || 
     url.indexOf(".ogv")>-1 || 
     url.indexOf(".ogm")>-1 ||
     url.indexOf(".mp4")>-1 ||
     url.indexOf(".mpd")>-1 ||
     url.indexOf(".m3u8")>-1 ||
     url.indexOf(".webm")>-1)
  return opener.parent.videoframe.VIDEO_HTML5;
 else
 if (url.indexOf(".flv")>-1  || url.indexOf("rtmp://")>-1 || url.indexOf(".mp3">-1 && url.indexOf("rtsp://")<0) )
  return opener.parent.videoframe.VIDEO_FLASH;

 return opener.parent.videoframe.VIDEO_NONE;
}
