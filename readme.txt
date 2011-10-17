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

Important : If you are upgrading from a version of Autoview prior to 2008042301, you should
now remove the autoview.php language file from your moodle lang directory. Language strings
are now included in the module directory.


This module also requires the following extras which may not be part of the default PHP
installation on your system :

1) XSL support. The default source downloads for PHP 4 and PHP 5 both have XSLT support
bundled with them, but the libraries are different and may not be enabled by default. The 
AutoView module should support XSLT under both PHP 4 and 5 and you should consult the PHP 
documentation for more information on enabling this. The module will NOT work without the XSLT 
functions.

For PHP 5 look for the following option on the PHP info page :

--with-xsl=

Windows users should look at http://uk.php.net/manual/en/ref.xsl.php#65277 for a note on
enabling XSL in PHP 5.

For PHP 4 your installation will probably need to have been compiled with the following options 
(In Moodle you can check this on the PHP info page in the server section of the admin functions) :

-enable-xslt --with-xslt-sablot=

for the Sablotron based XSL methods OR

--with-dom= --with-dom-xslt=

For the libxslt based methods.

Windows users with PHP 4 should have a look at the Win32 note on 
http://uk.php.net/manual/en/ref.xslt.php for information on enabling XSLT support.

Note : For all three options you should also find a section further down the the phpinfo() page which
mentions xslt or sablotron. It is not uncommon for binary distributions of PHP (particularly
RPM's and DEB's for linux) to compile PHP with the full set of options and then spilt up the binary
into several separate packages. In these cases the compile options may still show on the phpinfo()
page, but the later xsl/sablotron section will be missing. You need to look for the xml/xslt support
packages, eg on CentOS make sure the php-xml rpm is installed.

2nd Note : We have come across cases where PHP installations appear to have the 'wrong' options for
XSL support installed (eg PHP 5 claiming --with-dom= --with-dom-xslt=). This shouldn't matter,
the module detects XSL support on the basis of the methods present, not the PHP version, so as long
as you have one of the 3 supported methods it should work.


2) You will require either curl or pecl_http support to link to an on line document converter.
If you do not intend  to use a document conversion service, you should not need to install this.
curl is now the prefered method of communicating with a conversion service. Look for the following
option on the PHP info page to confirm that curl support is installed:

--with-curl

If you prefer the pecl_http extension, this can be obtained from http://pecl.php.net/package/pecl_http/
You may be able to install the extension automatically using the 'pecl' programme in the php bin directory
On our linux/apache server, the following worked very nicely :

/path/to/php/bin/pecl install pecl_http


PHP 4
-----

PHP 4 is no longer supported by AutoView, some functions may no longer work on servers with PHP 4.

PHP 4 is considered obsolete by php.org and no longer receives vital security updates, so if you
are still using PHP 4, you should upgrade as a matter of urgency.


HTML 5 Video Support
--------------------

Support is now included, but due to HTML 5 being a draft spec which has not yet been fully implemented by browser manufacturers,
it is disabled by default. Because of this, HTML 5 video in AutoView is not yet considered fully stable and should only be used
for testing purposes.

To enable HTML 5 videos, go to the Moodle module config page and enter the following into the JavaScript calls box on a new line:

setEnableHTML5(1);


Support
-------

Feel free to visit and log on to the AutoView forums on http://autoview.autotrain.org. You can also
purchase paid for support services by contacting EuroMotor-AutoTrain via http://www.autotrain.org.
