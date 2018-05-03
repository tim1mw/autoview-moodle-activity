<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- This code is copyright to EuroMotor AutoTrain LLP and is licenced under the GNU GPLv3 Licence -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="xml"
    media-type="text/html"
    omit-xml-declaration="yes"
    indent="yes" />

<xsl:template match="/">
<xsl:apply-templates select="avsubtitles/subdata" />
</xsl:template>

<xsl:template match="subdata">
 <xsl:for-each select="subtitle">
 <p><xsl:value-of select="." /></p>
 </xsl:for-each>

</xsl:template>

</xsl:stylesheet>
