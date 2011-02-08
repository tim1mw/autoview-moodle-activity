/*************************************************************************

   Copyright: EuroMotor-AutoTrain LLP 2010

   License: GPLv2 + Commercial

   Authors: Tim Williams (tmw@autotrain.org)

*************************************************************************/

display();

function display()
{
 if (opener.conversionURL.length>0)
  setElementHTML("converter", "<h1 style=\"text-align:center;\">"+opener.getString("e_convert_heading")+"</h1><br />\n"+
   "<div id=\"convform\"><form action=\""+opener.conversionURL+"\" name=\"form\" id=\"dataform\">\n"+
   "<input type=\"hidden\" name=\"id\" value=\""+opener.xmlID+"\" />\n"+
   "<table align=\"center\">\n"+
   "  <tr>\n"+
   "   <td>"+opener.getString("e_slide_file")+"<br />(.pdf/.ppt/.pptx/.odp/.sxi)</td>\n"+
   "   <td><input type=\"textfield\" size=\"50\" name=\"url\" id=\"urltext\" />&nbsp;<input type=\"button\" value=\""+opener.getString("e_select")+"\""+
   "     onClick=\"window.open('"+opener.fileBrowser+"', '_blank', 'width=750,height=480,status=no,toolbar=no,menubar=no,scrollbars=yes,resizable=1')\" /></td>\n"+
   "  </tr>\n"+
   "  <tr>\n"+
   "   <td valign=\"top\">"+opener.getString("e_convert_to")+"</td>\n"+
   "   <td>\n"+
   "    <input type=\"checkbox\" name=\"swf\" id=\"swfcheck\" value=\"true\" checked />"+opener.getString("e_flash")+"<br />\n"+
   "    <input type=\"checkbox\" name=\"pdf\" id=\"pdfcheck\" value=\"true\" checked />"+opener.getString("e_pdf")+"<br />\n"+
   "    <input type=\"checkbox\" name=\"jpg\" id=\"jpgcheck\" value=\"true\" checked />"+opener.getString("e_images")+"<br />\n"+
   "   </td>\n"+
   "  </tr>\n"+
   "</table>\n"+
   " <p align=\"center\"><input type=\"button\" value=\""+opener.getString("e_convert")+"\" onclick=\"convert()\"/></p>\n"+
   "</form></div>\n"+
   "<div id=\"wait\" style=\"display:none;\"></div>\n");
 else
  setElementHTML("converter", "<p>"+opener.getString("e_convertmessage")+"</p>");
}

function convert()
{
 var url=document.getElementById("urltext");
 if (url.value.length==0)
 {
  alert(opener.getString("e_convert_nofile"));
  return;
 }

 var swf=document.getElementById("swfcheck");
 var pdf=document.getElementById("pdfcheck");
 var jpg=document.getElementById("jpgcheck");

 if (!swf.checked && !pdf.checked && !jpg.checked)
 {
  alert(opener.getString("e_convert_notypes"));
  return;
 }

 var urlLw=url.value.toLowerCase();
 if (urlLw.indexOf(".ppt")>0 ||
     urlLw.indexOf(".pptx")>0 ||
     urlLw.indexOf(".odp")>0 ||
     urlLw.indexOf(".sxi")>0 ||
     urlLw.indexOf(".pdf")>0)
  submitForm();
 else
  if (confirm(opener.getString("e_convert_format")))
   submitForm();
}

function submitForm()
{
 var f=document.getElementById("dataform");
 f.submit();

 changeElement("convform", "none");
 changeElement("wait", "block");

 setElementHTML("wait", 
  " <p style=\"text-align:center;font-weight:bold;\">"+opener.getString("e_convert_wait")+"</p>\n"+
  " <p style=\"text-align:center;font-weight:bold;\"><img src=\""+opener.parent.videoframe.avEditDir+"wait.gif\" width=\"116\" height=\"20\" alt=\"\"/></p>\n"+
  " <br /><p style=\"text-align:center;\">"+opener.getString("e_convert_wait2")+"</p>\n");
}

function changeElement(id, value)
{
  var element=document.getElementById(id);
  if (element!=null)
  {
   element.style.display=value;
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
