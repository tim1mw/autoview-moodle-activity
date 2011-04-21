on error resume next

// Find quicktime

set obj_qt = CreateObject("QuickTimeCheckObject.QuickTimeCheck.1")
if IsObject(obj_qt) then
 hasQuicktime = obj_qt.IsQuickTimeAvailable(0)
 qtVersion = hex(obj_qt.QuickTimeVersion)
end if

// Find realplayer

set tmpr=CreateObject("RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)")
hasRealPlayer = IsObject(tmpr)
set tmpr2 = CreateObject("rmocx.RealPlayer G2 Control")
if (IsObject(tmpr2)) then
 hasRealPlayer = true
 realVersion = tmp.GetVersionInfo
end if

//set tmpr3 = CreateObject("RealPlayer Download and Record Plugin for Internet Explorer");
//hasRealDownload = IsObject(tmpr3);

// Find Java plugin

set tmpj=CreateObject("Java")
hasJavaPlugin = IsObject(tmpj)

// Find Shockwave Flash 6

set tmpf=CreateObject("ShockwaveFlash.ShockwaveFlash.6")
hasFlash = IsObject(tmpf)

// Find Acrobat Reader

set tmp1=CreateObject("acroPDF.PDF.1")
if IsObject(tmp1) then
 hasAcrobat=true
end if

set tmp6=CreateObject("PDF.PdfCtrl.6")
if IsObject(tmp6) then
 hasAcrobat=true
end if

set tmp5=CreateObject("PDF.PdfCtrl.5")
if IsObject(tmp5) then
 hasAcrobat=true
end if

// Find MS media Player

set tmp7 = CreateObject("WMPlayer.OCX.7")
if IsObject(tmp7) then
 hasWindowsMedia = true
 wmVersion = tmp7.versionInfo
end if

//Find silverlight

set tmp8=CreateObject("AgControl.AgControl")
if IsObject(tmp8) then
 hasSilverlight=true
end if

// Find VideoLAN plugin

//set tmpv=CreateObject("VLC-ActiveX-Component")
//hasVLC = IsObject(tmpv)

vbDetectOK=true
