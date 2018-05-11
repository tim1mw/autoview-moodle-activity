AutoView Moodle Module
----------------------

This module has been written by EuroMotor-AutoTrain LLP and is provided under the GPL v3 licence
(please see gpl.txt). Feel free to make use of this code under the terms of the GPL v3 licence,
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

1) XSL support. The default source downloads for PHP 5 and better has XSLT support bundled, but the
libraries may not be enabled by default. The module will NOT work without the XSLT functions.

Look for the following option on the PHP info page :

--with-xsl=

Windows users should look at http://uk.php.net/manual/en/ref.xsl.php#65277 for a note on
enabling XSL in PHP.

Note : You should also find a section further down the the phpinfo() page which
mentions xslt. It is not uncommon for binary distributions of PHP (particularly
RPM's and DEB's for linux) to compile PHP with the full set of options and then spilt up the binary
into several separate packages. In these cases the compile options may still show on the phpinfo()
page, but the later xsl/sablotron section will be missing. You need to look for the xml/xslt support
packages, eg on CentOS make sure the php-xml rpm is installed.

2) You will also need the Course File Area Repository plugin and the Repository file manager block.
Please download these plugins from the Moodle plugins database. The Course File Area Repository will
need to be activated on the Moodle repository configuration page before AutoView will function correctly.


Support
-------

Please post an issue on the AutoView GitHub page, https://github.com/tim1mw/autoview-moodle-activity/issues
if you have a problem with this plugin, or use the comments section on the Moodle plugin page.
