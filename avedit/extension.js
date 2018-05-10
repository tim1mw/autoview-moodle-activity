/*************************************************************************

   Copyright: EuroMotor-AutoTrain LLP 2007

   License: GPLv3 + Commercial

   Authors: Tim Williams (tmw@autotrain.org)

*************************************************************************/

editing=true;
var avEditDir="./";

/*****Config stuff*****/

function setAVEditDir(x)
{
 avEditDir=x;
}

/*****For loading extra language strings used by editing functions*****/

function mergeLangStrings(l, data)
{
 if (typeof(lang[l])=="undefined")
 {
  showMessage("Can't merge language strings for "+l+", the language does not exist.");
  return;
 }

 for (var id in data)
  lang[l][id]=data[id];
}

/*****Slide and Subtitle times*****/

function setSlideTimeToCurrent()
{
 var pos=parseInt(selectedAVSource.getPosition());
 var current=currentSlide-1;
 return setSlideTime(current, pos);
}

function setSlideTime(index, pos)
{
 if (index==0)
  return 0;

 if (selectedAVSource.type<30 && pos>-1)
 {
  var res=checkTimeConsistency(index, pos, times[avLang]);
  if (res>0)
   return res;
 }

 times[avLang][index]=pos;
 return 0;
}

function addSlideTime(number, index, pos)
{
 if (index==0)
  return;

 if (number==index)
  times[avLang][index]=pos;
 else
  times[avLang][number]=pos+"."+(index+1);
}

function setSubtitleTimeToCurrent()
{
 var pos=parseInt(selectedAVSource.getPosition());
 var current=currentSubtitle-1;
 return setSubtitleTime(current, pos);
}

function setSubtitleTime(index, pos)
{
 if (index==0)
  return 0;

 if (pos>-1)
 {
  var res=checkTimeConsistency(index, pos, subTimes[subtitleLang]);
  if (res>0)
   return res;
 }

 subTimes[subtitleLang][index]=pos;
 return 0;
}

function clearSlideTimes()
{
 while(times[avLang].length>0)
  times[avLang].shift();
}

function clearSubtitleTimes()
{
 while(subTimes[subtitleLang].length>0)
  subTimes[subtitleLang].shift();
}

function checkTimeConsistency(index, pos, data)
{
 var prev=findPreviousTime(index, data);
 if (pos<prev)
  return 1;

 var next=findNextTime(index, data);
 if (pos>next && next>-1)
  return 2;

 return 0;
}

function findPreviousTime(index, data)
{
 for (var loop=index-1; loop>-1; loop--)

  if (typeof(data[loop])!="undefined" && data[loop]>-1)
   return data[loop];

 return 0;
}

function findNextTime(index, data)
{
 for (var loop=index+1; loop<data.length; loop++)

  if (typeof(data[loop])!="undefined" && data[loop]>-1)
   return data[loop];

 return -1;
}

/*****Slide titles*****/

function setCurrentSlideTitle(title)
{
 titles[slideLang][currentSlide-1]=title;
 setSlideMenu();
}

function setSlideTitles(t, lang)
{
 titles[lang]=t;
}

function slideChanged(last)
{
 if (typeof(parent.editframe.document.titleform)!="undefined")
  parent.editframe.document.titleform.title.value=titles[slideLang][currentSlide-1];

 if (parent.editframe.currentDisplay==parent.editframe.DISPLAY_TIMESTITLES)
 {
  parent.editframe.setActiveTimeElement("Slide", currentSlide, last);
 }
}

/*****Slide source changing stuff*****/

function setNumSlides(lang, num)
{
 var temp=titles[lang];
 titles[lang]=new Array();
 for (var loop=0; loop<num; loop++)
 {
  if (typeof(temp[loop])=="undefined")
   titles[lang][loop]="#"+(loop+1);
  else
   titles[lang][loop]=temp[loop];
 }

 for (var loop=0; loop<allSlideSrc.length; loop++)
  if (allSlideSrc[loop].type==SLIDE_IMAGE_PRELOAD)
  {
   allSlideSrc[loop].preloadDone=false;
  }

 setSlideMenu();
 setSlideHTML();
}

function addUpdateSlideSrc(oldlang, num, newlang, type, url, slideType, select)
{
 if (typeof(select)=="undefined")
  select=true;

 //Check to see if we need to add a new language
 if (typeof(parent.videoframe.allSlideSrc[newlang])=="undefined")
 {
  var t=new Array();
  t[0]="#1";
  addSlideLang(newlang, t);
 }

 if (num==-1 || oldlang==null)
  num=addSlideSource(newlang, getSlideSource(type, url, slideType));
 else
 {
  //Existsing source. If the lang and type haven't changed, then update existing object
  var source=allSlideSrc[oldlang][num];
  if (type==source.type && oldlang==newlang)
  {
   source.url=url;
   if (source.type==SLIDE_IMAGE || source.type==SLIDE_IMAGE_PRELOAD)
    source.slideType=slideType;
  }
  else
  if (type!=source.type && oldlang==newlang)
   allSlideSrc[oldlang][num]=getSlideSource(type, url, slideType);
  else
  {
   //Need to remove and re-add to change language
   deleteSlideSrc(oldlang, num);
   num=addSlideSource(newlang, getSlideSource(type, url, slideType));
  }
 }

 if (select)
 {
  if (allSlideSrc[newlang][num].synchronisable)
  {
   setAllLanguages(newlang);
   selectedSlides=allSlideSrc[newlang][num] ;
  }
  else
  {
   checkLanguage();
   chooseSlides();
  }
  setSlideHTML();
 }

 setSlideControls();
 setSlideMenu();
}

function getSlideSource(type, url, slideType)
{
 if (slideType=="")
  slideType=".jpg";

 if (type==SLIDE_OOFLASH)
  return new OOFlashSlide(url);
 if (type==SLIDE_AVFLASH)
  return new AVFlashSlide(url);
 if (type==SLIDE_IMAGE_PRELOAD)
  return new PreloadImageSlide(url, slideType);
 if (type==SLIDE_IMAGE)
  return new ImageSlide(url, slideType);
 if (type==SLIDE_PDF)
  return new PDFSlide(url);
 if (type==SLIDE_SEPFLASH)
  return new SeparateFlashSlide(url);

 return new NoSlide();
}

function deleteSlideSrc(lang, num)
{
 //Remove the specified source
 var tempArray=allSlideSrc[lang];
 allSlideSrc[lang]=new Array();
 for (var loop=0; loop<tempArray.length; loop++)
  if (loop!=num)
   allSlideSrc[lang].push(tempArray[loop]);

 //***Check that we don't have any empty languages***
 tempArray=allSlideSrc;
 allSlideSrc=new Array();
 slideSet=false;
 for (var n in tempArray)
 {
  if (tempArray[n].length>0)
  {
   allSlideSrc[n]=tempArray[n];
   slideSet=true;
  }
 }

 //***Rescan for thumbnails***
 noSuitableThumbnails=true;
 for (var n in allSlideSrc)
 {
  for (i=0; i<allSlideSrc[n].length; i++)
  {
   if (allSlideSrc[n][i].type==SLIDE_IMAGE_PRELOAD || allSlideSrc[n][i].type==SLIDE_IMAGE)
    noSuitableThumbnails=false;

   if (typeof(allSlideSrc[n][i].backUpImages)!="undefined")
    delete allSlideSrc[n][i].backUpImages;
  }
 }
 if (noSuitableThumbnails)
  thumbnailsActive=false;

 //***Redisplay***
 checkLanguage();
 chooseSlides();
 setSlideHTML();
 setThumbnailHTML();
 setThumbnailControl();
 setSlideControls();
 setSlideMenu();
}

/*****Video Source changing stuff*****/


function addUpdateAVSrc(oldlang, num, newlang, type, url, speed, monitor)
{
 //Check to see if we need to add a new language
 if (typeof(avSrc[newlang])=="undefined")
  addAVLang(newlang);

 //If these values are not set, then this is should be treated as a new source
 if (num==-1 || oldlang==null)
 {
  num=addAVSource(newlang, getAVSource(type, url, speed, monitor));
 }
 else
 {
  //Existing source. If the lang and type haven't changed, then update existing object
  var source=avSrc[oldlang][num];
  if (type==source.type && oldlang==newlang)
  {
   source.url=url;
   source.speed=speed;
   if (typeof(source.useMonitor)!="undefined")
    source.useMonitor=monitor;
  }
  else
  if (type!=source.type && oldlang==newlang)
   avSrc[oldlang][num]=getAVSource(type, url, speed, monitor);
  else
  {
   //Need to remove and re-add to change language
   deleteAVSrc(oldlang, num);
   num=addAVSource(newlang, getAVSource(type, url, speed, monitor));
  }
 }

 checkLanguage();
 chooseVideo();
 setVideoHTML();
 setVideoControls();

 setAllLanguages(newlang);
 if (avSrc[newlang][num].isValid())
  setVideoSource(num);
}

function getAVSource(type, url, speed, monitor)
{
 if (type==VIDEO_FLASH)
  return new FlashVideo(url,speed);
 if (type==VIDEO_HTML5)
  return new HTML5Video(url,speed);

 return new NoVideo();
}

function deleteAVSrc(lang, num)
{
 //Remove the specified source
 var tempArray=avSrc[lang];
 avSrc[lang]=new Array();
 for (var loop=0; loop<tempArray.length; loop++)
  if (loop!=num)
   avSrc[lang].push(tempArray[loop]);

 //Check that we don't have any empty languages
 tempArray=avSrc;
 avSrc=new Array();
 videoSet=false;
 for (var n in tempArray)
 {
  if (tempArray[n].length>0)
  {
   avSrc[n]=tempArray[n];
   videoSet=true;
  }
 }

 checkLanguage();
 chooseVideo();
 setVideoHTML();
 setVideoControls();
}

function hasLiveCapture(sw)
{
 for (var n in avSrc)
  for (var loop=0; loop<avSrc[n].length; loop++)
   if (avSrc[n][loop].type==VIDEO_JAVALIVE || avSrc[n][loop].type==VIDEO_FLASHLIVE)
   {
    if (sw)
    {
     setAllLanguages(n);
     setVideoSource(loop);
    }
    return true;
   }
 return false;
}

function liveBroadcastUrl()
{
 for (var n in avSrc)
  for (var loop=0; loop<avSrc[n].length; loop++)
   if (avSrc[n][loop].type==VIDEO_FLASHBROADCAST)
    return avSrc[n][loop].url;

 return null;
}

/*****Subtitle changing stuff*****/

function deleteSubtitleSrc(lang)
{
 subtitleSrc=removeElement(subtitleSrc, lang);
 subTimes=removeElement(subTimes, lang);
 subtitleSlideLink=removeElement(subtitleSlideLink, lang);

 subtitleSet=false;
 for (var i in subtitleSrc)
 {
  subtitleSet=true;
  break;
 }

 if (subtitleSet==false && subtitlesActive==true)
  subtitlesActive=false;

 checkLanguage();
 setSubtitleControls();
 setSubtitleHTML();
}

function addUpdateSubtitleSrc(lang, url)
{
 subtitleSrc[lang]=url;
 if (typeof(subTimes[lang])=="undefined")
  subTimes[lang]=new Array();
 if (typeof(subtitleSlideLink[lang])=="undefined")
  subtitleSlideLink[lang]=new Array();
 subtitleSet=true;
 checkLanguage();
 setSubtitleControls();
 setSubtitleHTML();
 subtitleChanged();
}


function removeElement(dataArray, toRemove)
{
 var newData=new Array();
 for (var index in dataArray)
  if (index!=toRemove)
   newData[index]=dataArray[index];

 return newData;
}

function addSubtitleBefore()
{
 setSubSync(false);
 subtitles.splice(currentSubtitle, 0, "");
 subTimes[subtitleLang].splice(currentSubtitle-1, 0, -100);
 editSubtitle();
}

function addSubtitleAfter()
{
 setSubSync(false);
 subtitles.splice(currentSubtitle+1, 0, "");
 subTimes[subtitleLang].splice(currentSubtitle, 0, -100);
 currentSubtitle++;
 editSubtitle();
}

function editSubtitle()
{
 var data="<form action=\"javascript:updateCurrentSubtitle()\" name=\"subupdate\" style=\"margin:0px;\">\n"+
  " <textarea name=\"subtitle\" style=\"width:"+(subtitleWidth-75)+"px; height:"+(subtitleHeight-18)+"px;\" onChange=\"updateCurrentSubtitle()\">"+
  subtitles[currentSubtitle]+"</textarea>\n"+
  "</form>\n";

 setElementHTML("subtitledisplay", data);
}

function updateCurrentSubtitle()
{
 subtitles[currentSubtitle]=document.forms.subupdate.subtitle.value;
 setSubtitleHTML();
 parent.editframe.fillSubtitleSummary();
 parent.editframe.saveCurrentSubtitles();
}

function deleteSubtitle()
{
 subtitles.splice(currentSubtitle, 1);
 subTimes[subtitleLang].splice(currentSubtitle-1, 1);
 setSubtitleHTML();
}

function subtitleChanged(last)
{
 if (parent.editframe.currentDisplay==parent.editframe.DISPLAY_SUBTITLES)
  parent.editframe.subtitlesDisplay();

 if (parent.editframe.currentDisplay==parent.editframe.DISPLAY_TIMESTITLES)
 {
  parent.editframe.fillSubtitleTimesList();
 }
}

function addSubtitleAtEnd(time, text)
{
 var subNum=subTimes[subtitleLang].length+1;
 var timeNum=subTimes[subtitleLang].length;
 subtitles[subNum]=text;
 subTimes[subtitleLang][timeNum]=time;
}

/*****Subtitle/Slide linking*****/

function getSubSlideLink(subs, slides)
{
 var links=new Array();
 var count=0;
 for (var loop=0; loop<subs.length; loop++)
 {
  //Give up if something hasn't been defined
  if (typeof(subs[loop])=="undefined" || typeof(slides[count])=="undefined")
   return links;

  while(subs[loop]>=slides[count] && count<slides.length)
   count++;

  links[loop]=count;
 }
 return links;
}

/*****XML Stuff*****/

function exportXMLConfig(pathMatch)
{
 var data="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"+
  "<autoview>\n"+
  " <version>"+VERSION+"</version>\n";

 data=data+findUsedLangs();
 data=data+getOptionsXML();
 data=data+getControlsHTML()
 data=data+getVideoXML(pathMatch);
 data=data+getSlideXML(pathMatch);
 data=data+getSubtitleXML(pathMatch);

 data=data+"</autoview>\n";
 return data;
}

function findUsedLangs()
{
 var videoLang=findValidLangs(avSrc);
 var slideLang=findValidLangs(allSlideSrc);
 var subLang=findValidLangs(subtitleSrc);
 for (var vLoop=0; vLoop<videoLang.length; vLoop++)
 {
  var found=false;
  for (var sLoop=0; sLoop<slideLang.length; sLoop++)
   if (videoLang[vLoop]==slideLang[sLoop])
     found=true;

  if (found==false)
   slideLang.push(videoLang[vLoop]);
 }

 for (var vLoop=0; vLoop<subLang.length; vLoop++)
 {
  var found=false;
  for (var sLoop=0; sLoop<slideLang.length; sLoop++)
   if (subLang[vLoop]==slideLang[sLoop])
    found=true;

  if (found==false)
   slideLang.push(subLang[vLoop]);
 }

 /***Check for languages in orphaned times***/
 /***Not sure if we really want to do this, disable for now
 for (var t in times)
 {
  if (typeof(avSrc[t])=="undefined")
  {
   var found=false;
   for (var sLoop=0; sLoop<slideLang.length; sLoop++)
    if (t==slideLang[sLoop])
     found=true;

   if (found==false)
    slideLang.push(t);
  }
 }
 ***/

 var data=" <languages>\n";
 for (var loop=0; loop<slideLang.length; loop++)
  data=data+"  <lang>"+slideLang[loop]+"</lang>\n";

 data=data+" </languages>\n";
 return data;
}

function getControlsHTML()
{
 var data=" <controls>\n"+
  "  <video>"+showVideoControls+"</video>\n"+
  "  <slide>"+showSlideControls+"</slide>\n"+
  "  <subtitle>"+showSubtitleControls+"</subtitle>\n"+
  "  <lang>"+showLanguageControls+"</lang>\n"+
  "  <position>"+showPositionControls+"</position>\n"+
  "  <slidemenu>"+showSlideMenu+"</slidemenu>\n"+
  "  <thumbnail>"+showThumbnailControls+"</thumbnail>\n"+
  "  <other>"+showOtherControls+"</other>\n"+
  "  <exit>"+alwaysHideExit+"</exit>\n"+
  " </controls>\n";

 return data;
}

function getOptionsXML()
{
 var data=" <options>\n"+
  "  <thumbnailsactive>"+thumbnailsActiveDefault+"</thumbnailsactive>\n"+
  "  <subtitlesactive>"+subtitlesActiveDefault+"</subtitlesactive>\n"+
  "  <autostart>"+autoStartDefault+"</autostart>\n"+
  "  <videoposition>"+videoPosition+"</videoposition>\n"+
  "  <pauseafterslide>"+pauseAfterSlide+"</pauseafterslide>\n"+
  "  <videoaspect>"+videoAspect+"</videoaspect>\n"+
  "  <downloadbutton>"+downloadButton+"</downloadbutton>\n"+
  " </options>\n";

 return data;
}

function getVideoXML(pathMatch)
{
 var data=" <videos>\n";

 for (var lang in avSrc)
 {
  data=data+"  <avlang name=\""+lang+"\">\n";
  if (typeof(times[lang])!="undefined" && times[lang].length>0)
  {
   data=data+"   <times>\n";
   data=data+getArrayXML(cleanTimesArray(times[lang]), "    ", "index");
   data=data+"   </times>\n";
  }

  for (var loop=0; loop<avSrc[lang].length; loop++)
  {
   var vid=avSrc[lang][loop];
   var um=vid.useMonitor;
   if (typeof(um)=="undefined")
    um=vid.useTimeMonitor();
   var url=checkURL(vid.url, pathMatch);
   data=data+"   <avsrc>\n"+
    "    <type>"+getVideoType(vid.type)+"</type>\n"+
    "    <url>"+url+"</url>\n"+
    "    <speed>"+getSpeedType(vid.speed)+"</speed>\n"+
    "    <monitor>"+um+"</monitor>\n"+
    "   </avsrc>\n";
  }
  data=data+"  </avlang>\n";
 }

 /***This will check for any saved times which don't have a video source and save them with a
  'novideo' source so that they can be kept just in case***/
 /***Not sure if we really want to do this, disable for now
 for (var t in times)
 {
  if (typeof(avSrc[t])=="undefined")
  {
   data=data+"  <avlang name=\""+t+"\">\n"+
             "   <times>\n"+
             getArrayXML(cleanTimesArray(times[t]), "    ", "index")+
             "   </times>\n"+
             "   <avsrc>\n"+
             "    <type>NoVideo</type>\n"+
             "    <url></url>\n"+
             "    <speed>SPEED_NONE</speed>\n"+
             "    <monitor>false</monitor>\n"+
             "   </avsrc>\n"+
             "  </avlang>\n";
  }
 }
 ***/

 data=data+" </videos>\n";
 return data;
}

function getSlideXML(pathMatch)
{
 var data=" <slides>\n";
 for (var lang in allSlideSrc)
 {
  data=data+"  <slidelang name=\""+lang+"\">\n   <titles>\n";

  for (var loop=0; loop<titles[lang].length; loop++)
   if (typeof(titles[lang][loop])!="undefined")
    data=data+"    <title pos=\""+loop+"\">"+jsEscape(titles[lang][loop])+"</title>\n";
   else
    data=data+"    <title pos=\""+loop+"\">#"+(loop+1)+"</title>\n";  

  data=data+"   </titles>\n";

  var slides=allSlideSrc[lang];

  for (var loop=0; loop<slides.length; loop++)
  {
   var url=checkURL(slides[loop].url, pathMatch);
   var img="none";
   if (slides[loop].type==SLIDE_IMAGE_PRELOAD || slides[loop].type==SLIDE_IMAGE)
    img=slides[loop].slideType;

   data=data+"   <slidesrc>\n"+
    "    <type>"+getSlideType(slides[loop].type)+"</type>\n"+
    "    <url>"+url+"</url>\n"+
    "    <imgtype>"+img+"</imgtype>\n"+
    "   </slidesrc>\n";
  }

  data=data+"  </slidelang>\n";
 }
 data=data+" </slides>\n";
 return data;
}

function getSubtitleXML(pathMatch)
{
 var data=" <subtitles>\n";
 for (var lang in subtitleSrc)
 {
  data=data+"  <sublang name=\""+lang+"\">\n"+
   "   <url>"+subtitleSrc[lang]+"</url>\n"+
   "   <times>\n"+
   getArrayXML(cleanTimesArray(subTimes[lang]), "    ", "index")+
   "   </times>\n";

  if (typeof(times[lang])!="undefined")
  {
   data=data+"   <slidelink>\n"+
    getArrayXML(getSubSlideLink(subTimes[lang], times[lang]), "    ", "index")+
    "   </slidelink>\n";
  }
  data=data+"  </sublang>\n";
 }
 data=data+" </subtitles>\n";
 return data;
}

function cleanTimesArray(dataArray)
{
 var newArray=new Array();
 for (var loop=0; loop<dataArray.length; loop++)
  if (dataArray[loop]>-1)
   newArray[loop]=dataArray[loop];

 return newArray;
}

function getArrayXML(dataArray, spaces, tagName)
{
 if (typeof(dataArray)=="undefined")
  return "";

 var data="";
 for (var loop=0; loop<dataArray.length; loop++)
  if (typeof(dataArray[loop])!="undefined"  && (""+dataArray[loop]).length>0 )
   data=data+spaces+"<"+tagName+" pos=\""+loop+"\">"+dataArray[loop]+"</"+tagName+">\n";
 return data;
}

function checkURL(url, pathMatch)
{
 var i=url.indexOf(pathMatch);
 if (i==0)
  url=url.substring(pathMatch.length)

 return url;
}

function arrayContains(toTest, item)
{
 for (var loop=0; loop<toTest.length; loop++)
  if (toTest[loop]==item)
   return true;

 return false
}

function getSpeedType(speed)
{
 if (speed==SPEED_MODEM)
  return "SPEED_MODEM";

 if (speed==SPEED_BROAD)
  return "SPEED_BROAD";

 if (speed==SPEED_STREAM)
  return "SPEED_STREAM";

 return "SPEED_NONE";
}

function getSlideType(type)
{
 if (type==SLIDE_IMAGE)
  return "ImageSlide";

 if (type==SLIDE_IMAGE_PRELOAD)
  return "PreloadImageSlide";

 if (type==SLIDE_OOFLASH)
  return "OOFlashSlide";

 if (type==SLIDE_AVFLASH)
  return "AVFlashSlide";

 if (type==SLIDE_PDF)
  return "PDFSlide";

 if (type==SLIDE_SEPFLASH)
  return "SeparateFlashSlide";

 return "NoSlide";
}

function getVideoType(type)
{
 if (type==VIDEO_FLASH)
  return "FlashVideo";

 if (type==VIDEO_HTML5)
  return "HTML5Video";

 if (type==VIDEO_LEGACY)
  return "LegacyVideoContainer";

 return "NoVideo";
}

/*****For putting Javascipt escape sequences into a string*****/

function jsEscape(prep)
{
 if (typeof(prep)=="undefined")
  return "";

 for (var pos=0; pos<prep.length; pos++)
 {
  var c=prep.charCodeAt(pos);
  if (c>127 || c==34 || c==60 || c==62 || c==38 || c==39 || c==45 || c==10 || c==13)
  {
   var hex=new Number(c).toString(16);
   while(hex.length<4)
    hex="0"+hex;
   var first=prep.substring(0,pos)+"\\u"+hex;
   prep=first+prep.substring(pos+1);
   pos=first.length-1;
  }
 }
 return prep;
}

/*****Deprecated Video Types******/

function JavaLiveCapture()
{
 this.url=false;
 this.deprecated=true;
}


function FlashLiveCapture()
{
 this.url=false;
 this.deprecated=true;
}
