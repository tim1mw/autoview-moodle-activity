

function importTheme()
{
 var themeWindow=parent.headerframe.document;
 var body=getRule(themeWindow.styleSheets, "body");
 var table=findStyleValue(themeWindow.styleSheets, ".navbar", "background-color");

 if (table!=null && body!=null)
 {
  getRule(document.styleSheets, "body").backgroundColor=body.backgroundColor;

  var tdn=getRule(document.styleSheets, "table.display-noslides");
  tdn.backgroundColor=table.backgroundColor;
  tdn.borderColor=table.borderColor;
  tdn.color=table.color;

  var tdm=getRule(document.styleSheets, "td.messagebox");
  tdm.backgroundColor=table.backgroundColor;
  tdm.borderColor=table.borderColor;
  tdm.color=table.color;

  var tdc=getRule(document.styleSheets, "td.controlbarbox");
  tdc.backgroundColor=table.backgroundColor;
  tdc.borderColor=table.borderColor;
  tdc.color=table.color;

  var tdv=getRule(document.styleSheets, "td.videocolumn");
  tdv.backgroundColor=table.backgroundColor;
  tdv.borderColor=table.borderColor;
  tdv.color=table.color;

  var tmb=getRule(document.styleSheets, "td.messagebox");
  tmb.backgroundColor=table.backgroundColor;
  tmb.borderColor=table.borderColor;
  tmb.color=table.color;

  var vidf=getRule(document.styleSheets, "iframe.video");
  vidf.backgroundColor=table.backgroundColor;

  getRule(document.styleSheets, "a").color=table.color; 

  var ss=getRule(document.styleSheets, "td.slides_subtitles");
  ss.backgroundColor=body.backgroundColor;
  ss.color=body.color;
 }
}

function findStyleValue(sheets, rule, property)
{
 for(var loop=sheets.length-1; loop>-1; loop--)
 {
  var rules=sheets[loop].cssRules? sheets[loop].cssRules: sheets[loop].rules;
  for (i=0; i<rules.length; i++)
  {
   if(rules[i].selectorText.toLowerCase()==rule)
   {
    if (rules[i].style.cssText.toLowerCase().indexOf(property)>-1)
    {
     return rules[i].style;
    }
   }
  }
 }

 return null;
}

function getRule(sheets, rule, property)
{
 for(var loop=sheets.length-1; loop>-1; loop--)
 {
  var rules=sheets[loop].cssRules? sheets[loop].cssRules: sheets[loop].rules;
  for (i=0; i<rules.length; i++)
  {
   if(rules[i].selectorText.toLowerCase()==rule)
   {
    return rules[i].style;
   }
  }
 }
 return null;
}