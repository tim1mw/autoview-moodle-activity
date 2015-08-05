/*************************************************************************

   Copyright: EuroMotor-AutoTrain LLP 2007

   License: GPLv2 + Commercial

   Authors: Tim Williams (tmw@autotrain.org)

*************************************************************************/

updateDisplay();

function updateDisplay()
{
 var selection=document.form.type.value;

 if (selection=="textbox")
 {
  setTypeDisplay("inline");
  setURLDisplay("none");
  window.outerHeight=680;
 }
 else
 if (selection=="blank")
 {
  setTypeDisplay("none");
  setURLDisplay("none");
  window.outerHeight=280;
 }
 else
 {
  setTypeDisplay("none");
  setURLDisplay("inline");
  window.outerHeight=280;
 }
} 

function setTypeDisplay(val)
{
 document.getElementById("boxlabel").style.display=val;
 document.getElementById("subbox").style.display=val;
}

function setURLDisplay(val)
{
 document.getElementById("urllabel").style.display=val;
 document.getElementById("urlbox").style.display=val;
}

function submitForm()
{
 if (document.form.type.value=="textbox")
  opener.addUpdateSubtitleSrc(document.form.lang.value, document.form.type.value, document.form.subtitles.value);
 else
  opener.addUpdateSubtitleSrc(document.form.lang.value, document.form.type.value, document.form.url.value);

 window.close();
}
