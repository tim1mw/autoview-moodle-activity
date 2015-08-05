data=new Array();

data["langname"]="English";

data["language"]="Language";
data["showlangopts"]="Show all language options";
data["hidelangopts"]="Hide all language options";
data["intlang"]="Interface";
data["avlang"]="Video";
data["slidelang"]="Slides";
data["sublang"]="Subtitles";

data["notavailable"]="is not available";
data["avlangerror"]="Error adding audio/video language :";
data["averror"]="Error adding audio/video source :";
data["suberror"]="Error adding subtitle source :";
data["slidelangerror"]="Error adding slide language source :";
data["slideerror"]="Error adding slide source :";
data["novideolang"]="has not been defined as a video language.";
data["noslidelang"]="has not been defined as a slide language.";

data["savepostitle"]="Position";
data["savepos"]="Save";
data["loadpos"]="Load";
data["savepositiontitle"]="Save current video position";
data["loadpositiontitle"]="Load current video position";
data["video"]="Video Options";
data["showvideoopts"]="Show all video options";
data["hidevideoopts"]="Hide all video options";
data["realplayer"]="Real Player";
data["quicktime"]="Quicktime";
data["windowsmedia"]="Windows Media";
data["javaaudio"]="Java Audio";
data["vlcvideo"]="VideoLAN VLC";
data["flashvideo"]="Flash Video";
data["flashvideobroadcast"]="Flash Video Broadcast";
data["silverlightvideo"]="Silverlight Video";
data["silverlight2"] = "Silverlight 2 is required to run this video";
data["html5video"] = "Built in (HTML 5)";
data["nohtml5"]="Your web browser does not support the codecs necessary to play this video using HTML 5.";
data["novideoplayer"]="No Video";
data["pluginnotfound"]="The plugin required to play this source has not been found";

data["play"]="Play";
data["pause"]="Pause";
data["stop"]="Stop";

data["hidevideo"]="Hide Video";
data["showvideo"]="Show Video";
data["downloadbutton"]="Download Video";

data["pausemessage"]="Paused - Click here to continue";

data["subtitle"]="Subtitles";
data["subon"]="Switch on subtitles";
data["suboff"]="Switch off subtitle";
data["nextsubtitle"]="Go to the next subtitle";
data["prevsubtitle"]="Go to the previous subtitle";
data["transcript"]="Transcript";
data["transcripttitle"]="Show presentation transcript";

data["on"]="On";
data["off"]="Off";

data["exitpres"]="Exit Presentation";
data["exittitle"]="Exit this presentation";
data["help"]="Help";
data["helptitle"]="Open the AutoView help file";

data["slide"]="Slide";
data["slideopts"]="Slide Options";
data["showslideopts"]="Show all slide options";
data["hideslideopts"]="Hide all slide options";
data["slidesize"]="Slide Size";
data["incslidesize"]="Increase Slide Size";
data["decslidesize"]="Decrease Slide Size";
data["noslides"]="No Slides";
data["pdfslides"]="Adobe PDF";
data["imageslides"]="Images";
data["preloadimage"]="Cached&nbsp;Images";
data["flashslides"]="Adobe Flash";
data["slidesyncon"]="Sync On";
data["slidesyncoff"]="Sync Off";
data["slidesyncontitle"]="Synchronisation between the slides/subtitles and video is on. Click to switch off.";
data["slidesyncofftitle"]="Synchronisation between the slides and/or subtitles and video is off (* indicates partial sync is enabled)";
data["noprintslides"]="No printable slides can be found";
data["allslides"]="Printable Slides";
data["allslidestitle"]="Show all slides ready for printing";
data["nexttitle"]="Show the next slide";
data["prevtitle"]="Show the previous slide";

data["thumbnails"]="Thumbnails";
data["thumbontitle"]="Switch on slide thumbnails";
data["thumbofftitle"]="Switch off slide thumbnails";

data["preloadmessage1"]="Downloading Presentation Slides - Please Wait";
data["preloadmessage2"]="Please do not start the video until the slides have finished downloading.";
data["preloadmessage3"]="Downloading Slide No.";
data["preloadmessage4"]="out of";
data["preloadmessage5"]="downloaded";

data["speed"+SPEED_NONE]="";
data["speed"+SPEED_MODEM]="Modem";
data["speed"+SPEED_BROAD]="Broadband";
data["speed"+SPEED_STREAM]="Streaming";

data["novideosource"]="Unable to locate a suitable audio/video plugin. " + 
 "You may need to install additional software to view this presentation, " + 
 "please see the help file (click 'help' link if it doesn't pop up automatically) for more information. ";
data["noslidesource"]="Unable to locate a suitable set of slides, the slides may not function correctly. " + 
 "You may need to install additional software to view this presentation, " + 
 "please see the help file (click 'help' link if it doesn't pop up automatically) for more information. ";

data["flashfailed"]="We have detected that your browser does not support the required functions for the presentation slide "+
  "synchronisation and buttons to work when using the Adobe Flash slide format. "+
  "If you are using Mozilla Firefox, we have found that if you have upgraded your browser from "+
  "an older version it is sometimes necessary to update the Adobe Flash player plugin before it will work "+
  "properly with the upgraded browser. Visit http://www.adobe.com to get the latest version of the Flash Player. "+
  "If you wish, you can now be switched to an alternative slide format for this presentation (see box on the left) if one is available. ";

data["javaaudiopositon"]="Please Note : When in Java Audio mode, the position of the player cannot be changed to "+
  "match up with the choosen slide.";
data["javaaudiosubtitles"]="Warning : Subtitles will not work with the Java Audio player.";

data["realsyncproblem"]="Warning : Your RealPlayer plugin doesn't support the necessary functions to synchronise the video stream "+
  "with the selected slide.";
data["qtlinux"]="Quicktime with Crossover plugin probably won't work with this presentation.";
data["mozplugger"]="MozPlugger plugin is interfering with the RealPlayer plugin.";

data["oldwindowsmedia"]="We have detected that you might be using an old version of Windows Media Player.\nPlease ensure that you have version 7.1 or greater,\n go to http://www.microsoft.com/windows/windowsmedia/ to download.";
data["windowsmediaieonly"]="Warning : Windows Media Player mode only works correctly in Internet Explorer.";
data["vlc_notsupported"]="Warning : The VideoLAN Player is not supported on your web browser.";

data["qtrefmissing"]="The URL for this video is directly referencing a Quicktime stream, but this server does not have a Quicktime "+
 "reference generator installed, so this is unlikely to work.";

data["helpurl"]="en";

data["noprint"]="No printable slides have been found.";
data["print"]="Print";

data["qt764bug"]="You are using Quicktime 7.6.4, this version of Quicktime has a bug which sometimes causes the video to be blank."+
 " If you experience this problem, please either install a different version of Quicktime, or switch to a different video format using"+
 " the video options menu (if available).";

/*****A few basic params*****/

lang["en"]=data;
langRTL["en"]=false;
