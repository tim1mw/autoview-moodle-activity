AutoView Moodle Module
----------------------

This module has been written by EuroMotor-AutoTrain LLP and is provided under the GPL v2 licence
(please see gpl.txt). Feel free to make use of this code under the terms of the GPL v2 licence,
but please leave our copyright notices in place for whole files, or provide a suitable attribution
if you use significant portions of the code, we have tried to do the same where third party code
has been included with AutoView.

If you wish to use this module code under an alternative licence, please contact us via
http://www.autotrain.org to discuss your requirements.


Installation/Requirements
-------------------------

To install this module into you Moodle server just place the autoview directory created by
unzipping this download into your moodle/mod directory and then point your browser at /admin
on your Moodle server, or click the notifications link in the 'Site Admin' menu.

This module also requires the following extras which may not be part of the default PHP
installation on your system :

1) XSL support. The default source downloads for PHP 5 both has XSLT support bundled, but the
libraries may not be enabled by default. The module will NOT work without the XSLT functions.

For PHP 5 look for the following option on the PHP info page :

--with-xsl=

Windows users should look at http://uk.php.net/manual/en/ref.xsl.php#65277 for a note on
enabling XSL in PHP 5.

Note : You should also find a section further down the the phpinfo() page which
mentions xslt. It is not uncommon for binary distributions of PHP (particularly
RPM's and DEB's for linux) to compile PHP with the full set of options and then spilt up the binary
into several separate packages. In these cases the compile options may still show on the phpinfo()
page, but the later xsl/sablotron section will be missing. You need to look for the xml/xslt support
packages, eg on CentOS make sure the php-xml rpm is installed.

2nd Note : We have come across cases where PHP installations appear to have the 'wrong' options for
XSL support installed (eg PHP 5 claiming --with-dom= --with-dom-xslt=). This shouldn't matter,
the module detects XSL support on the basis of the methods present, not the PHP version.


2) You will require either curl or pecl_http support to link to an on line document converter.
If you do not intend  to use a document conversion service, you should not need to install this.
curl is now the prefered method of communicating with a conversion service. Look for the following
option on the PHP info page to confirm that curl support is installed:

--with-curl

If you prefer the pecl_http extension, this can be obtained from http://pecl.php.net/package/pecl_http/
You may be able to install the extension automatically using the 'pecl' programme in the php bin directory
On our linux/apache server, the following worked very nicely :

/path/to/php/bin/pecl install pecl_http

3) Moodle 2.x users will also need the Course File Area Repository plugin and the Repository file manager block.
Please go to http://www.autotrain.org/misc/source/moodle2/ to download these modules if you did not get them
from the AutoView download area. The Course File Area Repository will need to be activated on the Moodle repository
configuration page before AutoView will function correctly.


HTML 5 Video Support
--------------------

Support is included, but due to HTML 5 being a draft spec which has not yet been fully implemented by browser manufacturers,
it is disabled by default. Because of this, HTML 5 video in AutoView is not yet considered fully stable and should only be used
for testing purposes.

To enable HTML 5 videos, go to the Moodle module config page and enter the following into the JavaScript calls box on a new line:

setEnableHTML5(1);


Support
-------

Feel free to visit and log on to the AutoView forums on http://autoview.autotrain.org. You can also
purchase paid for support services by contacting EuroMotor-AutoTrain via http://www.autotrain.org.
