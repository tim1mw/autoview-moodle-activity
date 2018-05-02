

function importTheme()
{
 var themeWindow=window.parent.document;

 var body=getRule(themeWindow.styleSheets, "body");
 if (body!=null)
 {
  getRule(document.styleSheets, "body").backgroundColor=body.backgroundColor;

  var ss=getRule(document.styleSheets, "td.slides_subtitles");
  ss.backgroundColor=body.backgroundColor;
  ss.color=body.color;
 }

 var table=findStyleValue(themeWindow.styleSheets, ".navbar", "background-color");
 if (table!=null)
 {
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

  var vidb=getRule(document.styleSheets, "div.videobak");
  vidb.backgroundColor=table.backgroundColor;

  getRule(document.styleSheets, "a").color=table.color; 
 }
/*
 var table=findStyleValue(themeWindow.styleSheets, ".navbar", "background-image");
 if (table!=null)
 {
  var tdn=getRule(document.styleSheets, "table.display-noslides");
  tdn.backgroundImage=table.backgroundImage;
  tdn.borderColor=table.borderColor;
  tdn.color=table.color;

  var tdm=getRule(document.styleSheets, "td.messagebox");
  tdm.backgroundImage=table.backgroundImage;
  tdm.borderColor=table.borderColor;
  tdm.color=table.color;

  var tdc=getRule(document.styleSheets, "td.controlbarbox");
  tdc.backgroundImage=table.backgroundImage;
  tdc.borderColor=table.borderColor;
  tdc.color=table.color;

  var tdv=getRule(document.styleSheets, "td.videocolumn");
  tdv.backgroundImage=table.backgroundImage;
  tdv.borderColor=table.borderColor;
  tdv.color=table.color;

  var tmb=getRule(document.styleSheets, "td.messagebox");
  tmb.backgroundImage=table.backgroundImage;
  tmb.borderColor=table.borderColor;
  tmb.color=table.color;

  var vidf=getRule(document.styleSheets, "iframe.video");
  vidf.backgroundImage=table.backgroundImage;

  var vidb=getRule(document.styleSheets, "div.videobak");
  vidb.backgroundImage=table.backgroundImage;

  getRule(document.styleSheets, "a").color=table.color; 
 }
*/
}

function findStyleValue(sheets, rule, property)
{
 for(var loop=sheets.length-1; loop>-1; loop--)
 {
  var rules=sheets[loop].cssRules? sheets[loop].cssRules: sheets[loop].rules;
  for (i=0; i<rules.length; i++)
  {
   if(rules[i].selectorText!=null && rules[i].selectorText.toLowerCase()==rule)
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
   if(rules[i].selectorText!=null && rules[i].selectorText.toLowerCase()==rule)
   {
    return rules[i].style;
   }
  }
 }
 return null;
}
