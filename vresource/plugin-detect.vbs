on error resume next

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


vbDetectOK=true
