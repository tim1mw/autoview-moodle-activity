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
 }
 else
 if (selection=="blank")
 {
  setTypeDisplay("none");
  setURLDisplay("none");
 }
 else
 {
  setTypeDisplay("none");
  setURLDisplay("inline");
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