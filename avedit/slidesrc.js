/*************************************************************************

   Copyright: EuroMotor-AutoTrain LLP 2007

   License: GPLv2 + Commercial

   Authors: Tim Williams (tmw@autotrain.org)

*************************************************************************/

updateDisplay();

function updateDisplay()
{
 var selection=document.form.type.value;

 if (selection==opener.parent.videoframe.SLIDE_IMAGE_PRELOAD || 
     selection==opener.parent.videoframe.SLIDE_IMAGE)
  setTypeDisplay("inline");
 else
  setTypeDisplay("none");

 if (selection==opener.parent.videoframe.SLIDE_NONE)
  setURLDisplay("none");
 else
  setURLDisplay("inline");
} 

function setTypeDisplay(val)
{
 document.getElementById("typelabel").style.display=val;
 document.getElementById("typebox").style.display=val;
}

function setURLDisplay(val)
{
 document.getElementById("urllabel").style.display=val;
 document.getElementById("urlbox").style.display=val;
}

function submitSlideSource()
{
 var url=document.form.url.value.toLowerCase();

 if (url.indexOf(".ppt")>-1 ||
     url.indexOf(".pptx")>-1 ||
     url.indexOf(".odp")>-1)
 {
  if (!confirm(opener.getString("e_ppt_question")))
   return;
 }

 if (document.form.type.value==opener.parent.videoframe.SLIDE_AVFLASH ||
     document.form.type.value==opener.parent.videoframe.SLIDE_OOFLASH)
 {
  if (url.indexOf(".swf")<0)
  {
   if (!confirm(opener.getString("e_slidenotcompat")))
    return;
  }
 }

 if (document.form.type.value==opener.parent.videoframe.SLIDE_PDF)
 {
  if (url.indexOf(".pdf")<0)
  {
   if (!confirm(opener.getString("e_slidenotcompat")))
    return;
  }
 }

 checkURL();
 opener.addUpdateSlideSrc(lang, num, document.form.lang.value,    
  document.form.type.value, document.form.url.value, 
  document.form.slideType.value);
 window.close();
}

function checkURL()
{
 var selection=document.form.type.value;

 if (selection==opener.parent.videoframe.SLIDE_IMAGE_PRELOAD ||
     selection==opener.parent.videoframe.SLIDE_IMAGE)
 {
  var url=document.form.url.value;
  var index=url.indexOf(".jpg");
  if (index>-1)
   document.form.slideType.value=".jpg";
  else
  {
   index=url.indexOf(".gif");
   if (index>-1)
    document.form.slideType.value=".gif";
   else
   {
    index=url.indexOf(".png");
    if (index>-1)
     document.form.slideType.value=".png";
   }
  }

  if (index>-1)
  {
   var pos=url.lastIndexOf("/");
   document.form.url.value=url.substring(0,pos);
  }
 }
 else
 if (selection==opener.parent.videoframe.SLIDE_SEPFLASH)
 {
  var url=document.form.url.value;
  var index=url.indexOf(".swf");
  if (index>-1)
  {
   var pos=url.lastIndexOf("/");
   document.form.url.value=url.substring(0,pos);
  }
 }
}
