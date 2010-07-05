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
