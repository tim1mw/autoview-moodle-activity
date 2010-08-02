<?php
/*
 * PHPRefMovie - Quicktime Reference Movie Generation Classes
 * Copyright (C) 2003 Juergen Enge 
 * ZKM | Center for Art and Media Karlsruhe
 * Institute for Net Development
 * mailto:juergen@info-age.net
 * http://net.zkm.de
 *
 * Based on "QuickTime File Format":
 * http://developer.apple.com/documentation/quicktime/QTFF/
 */
 

class QTBase
{
	var $list = false;
	var $type = '    ';
	
	function QTBase()
	{
		$this->list = array();
	}
	
	function addChunk( $chunk, $pos = -1 )
	{
		if( $pos < 0 )
			$this->list[] = $chunk;
		else
		   $this->list[$pos] = $chunk;
	}
	
	function size()
	{
		$size = 0;
		for( $i = 0; $i < sizeof( $this->list ); $i++)
		   $size += $this->list[$i]->size();
		$size += 2*4; // chunk + size-tag
		return $size;
	}
	
	function toString()
	{
		$str = pack( 'N', $this->size());
		$str .= $this->type;
		for( $i = 0; $i < sizeof( $this->list ); $i++)
		   $str .= $this->list[$i]->toString();
		return $str;
	}
}

/*
The Movie Atom
You use movie atoms to specify the information that defines a movie—that is, the 
information that allows your application to understand the data that is stored in the 
movie data atom. The movie atom normally contains a movie header atom, which defines 
the time scale and duration information for the entire movie, as well as its display 
characteristics. In addition, the movie atom contains a track atom for each track in 
the movie. 

The movie atom has an atom type of 'moov'. It contains other types of atoms, including 
at least one of three possible parent atoms—the movie header atom ('mvhd'), the 
compressed movie atom ('cmov'), or a reference movie atom ('rmra'). An uncompressed 
movie atom can contain both a movie header atom and a reference movie atom, but it 
must contain at least one of the two. It can also contain several other atoms, such 
as a clipping atom ( 'clip'), one or more track atoms ( 'trak'), a color table atom 
( 'ctab'), and a user data atom 'udta').

Compressed movie atoms and reference movie atoms are discussed separately. This 
section describes normal uncompressed movie atoms.

A movie atom may contain the following information.


Size 
The number of bytes in this movie atom. 

Type 
The type of this movie atom; this field must be set to 'moov'. 

Movie header atom 
See “Movie Header Atoms” for more information. 

Movie clipping atom 
See “Clipping Atoms” for more information. 

Track list atoms 
See “Track Atoms” for details on track atoms and their associated atoms. 

User data atom 
See “User Data Atoms” for more infomation about user data atoms. 

Color table atom 
See“Color Table Atoms” for a discussion of the color table atom. 

Compressed movie atom 
See “Compressed Movie Resources” for a discussion of compressed movie atoms. 

Reference movie atom 
See “Reference Movies” for a discussion of reference movie atoms. 


*/
class QTMovie extends QTBase
{
	function QTMovie( $QTRefMovie = false )
	{
		$this->QTBase();
		$this->type = "moov";
		if( $QTRefMovie )
		   $this->addChunk( $QTRefMovie );
	}
/*	
	function setRefMovie( $QTRefMovie )
	{
		$this->addChunk( $QTRefMovie, 0 );
	}
*/	
}

/*
Reference Movie Atom
A reference movie atom contains references to one or more movies. It can optionally 
contain a list of system requirements in order for each movie to play, and a quality 
rating for each movie. It is typically used to specify a list of alternate movies to 
be played under different conditions.

A reference movie atom’s parent is always a movie atom ('moov'). Only one reference 
movie atom is allowed in a given movie atom.


A reference movie atom may contain the following information.

Size 
The number of bytes in this reference movie atom. 

Type 
The type of this atom; this field must be set to 'rmra'. 

Reference movie descriptor atom 
A reference movie atom must contain at least one reference movie descriptor atom, and 
typically contains more than one. See “Reference Movie Descriptor Atom” for more 
information. 
*/
class QTRefMovie extends QTBase
{
	function QTRefMovie()
	{
		$this->QTBase();
		$this->type = "rmra";
	}
}

/*
Reference Movie Descriptor Atom
Each reference movie descriptor atom contains other atoms that describe where a 
particular movie can be found, and optionally what the system requirements are to 
play that movie, as well as an optional quality rating for that movie.

A reference movie descriptor atom’s parent is always a movie reference atom ('rmra'). 
Multiple reference movie descriptor atoms are allowed in a given movie reference atom, 
and more than one is usually present.

A reference movie descriptor atom may contain the following information.



Size 
The number of bytes in this reference movie descriptor atom. 

Type 
The type of this atom; this field must be set to 'rmda'. 

Data reference atom 
Each reference movie atom must contain exactly one data reference atom. See “Data 
Reference Atoms” for more information. 

Data rate atom 
A reference movie atom may contain an optional data rate atom. Only one data rate 
atom can be present. See “Data Rate Atom” for more information. 

CPU speed atom 
A reference movie atom may contain an optional CPU speed atom. Only one CPU speed 
atom can be present. See “CPU Speed Atom” for more information. 

Version check atom 
A reference movie atom may contain an optional version check atom. Multiple version 
check atoms can be present. See “Version Check Atom” for more information. 

Component detect atom 
A reference movie atom may contain an optional component detect atom. Multiple 
component detect atoms can be present. See “Component Detect Atom” for more 
information. 

Quality atom 
A reference movie atom may contain an optional quality atom. Only one quality atom 
can be present. See “Quality Atom” for more information
*/
class QTRefMovieDescriptor extends QTBase
{
	function QTRefMovieDescriptor()
	{
		$this->QTBase();
		$this->type = "rmda";
	}

/*	
	function setDataReference( $QTDataReference )
	{
		$this->addChunk( $QTDataReference, 0 );
	}

	function setDataRate( $QTDataRate )
	{
		$this->addChunk( $QTDataRate, 1 );
	}
*/	
}

/*
Data Reference Atom
A data reference atom contains the information necessary to locate a movie, or a 
stream or file that QuickTime can play, typically in the form of a URL or a file 
alias.

Only one data reference atom is allowed in a given movie reference descriptor atom.



A data reference atom may contain the following information.

Size 
The number of bytes in this data reference atom. 

Type 
The type of this atom; this field must be set to 'rdrf'. 

Flags 
A 32-bit integer containing flags. One flag is currently defined: movie is 
self-contained. If the least-significant bit is set to 1, the movie is self-contained. 
This requires that the parent movie contain a movie header atom as well as a reference 
movie atom. In other words, the current 'moov' atom must contain both a 'rmra' atom 
and a 'mvhd' atom. To resolve this data reference, an application uses the movie 
defined in the movie header atom, ignoring the remainder of the fields in this data 
reference atom, which are used only to specify external movies. 

Data reference type 
The data reference type. A value of 'alis' indicates a file system alias record. A 
value of 'url ' indicates a string containing a uniform resource locator. Note that 
the fourth character in 'url ' is an ASCII blank (hex 20). 

Data reference size 
The size of the data reference in bytes, expressed as a 32-bit integer. 

Data reference 
A data reference to a QuickTime movie, or to a stream or file that QuickTime can play. 
If the reference type is 'alis' this field contains the contents of an AliasHandle. 
If the reference type is 'url ' this field contains a null-terminated string that can 
be interpreted as a URL. The URL can be absolute or relative, and can specify any 
protocol that QuickTime supports, including http://, ftp://, rtsp://, file:///, and 
data:. 

*/
class QTDataReference extends QTBase
{
	var $flag = 0;
	var $RefType = "url ";
	var $size = 0;
	var $reference = "";
	
	function QTDataReference( $reference = false )
	{
		$this->QTBase();
		$this->type = "rdrf";
		if( $reference ) $this->setReference( $reference );
	}

	function setReference( $reference )
	{
		$this->reference = $reference;
		$this->size = strlen( $reference );
	}
	
	function toString()
	{
		$str = pack( 'N', $this->size() );
		$str .= $this->type;
		$str .= pack( 'N', $this->flag );
		$str .= $this->RefType;
		$str .= pack( 'N', $this->size );
		$str .= $this->reference;
		return $str;
	}
	
	function size()
	{
		return $this->size + 5 * 4;
	}
}

/*
Data Rate Atom
A data rate atom specifies the minimum data rate required to play a movie. This is 
normally compared to the connection speed setting in the user’s QuickTime Settings 
control panel. Applications should play the movie with the highest data rate less 
than or equal to the user’s connection speed. If the connection speed is slower than 
any movie’s data rate, applications should play the movie with the lowest data rate. 
The movie with the highest data rate is assumed to have the highest quality.

Only one data rate atom is allowed in a given reference movie descriptor atom.

A data rate atom may contain the following information.

Size 
The number of bytes in this data rate atom. 

Type 
The type of this atom; this field must be set to 'rmdr'. 

Flags 
A 32-bit integer that is currently always 0. 

Data rate 
The required data rate in bits per second, expressed as a 32-bit integer. 
*/
class QTDataRate extends QTBase
{
	var $flag = 0;
	var $rate = 256000;
	
	var $rates = array( "28.8 modem" => 2800,
        	            "56k modem" => 5600,
                            "isdn"        => 6400,
                            "dual isdn" =>  12800,
                            "256 kbps" =>   25600,
                            "384 kbps" =>   38400,
                            "512 kbps" =>   51200,
                            "768 kbps" =>   76800,
                            "1 mbps" =>    100000,
                            "t1" => 150000,
                            "intranet" => 2147483647 );  


	function QTDataRate( $rate )
	{
		$this->QTBase();
		$this->type = "rmdr";
		if( $rate ) $this->setRate( $rate );
	}
	
	function setRate( $rate )
	{
		if( $this->rates[$rate] )
		   $this->rate = $this->rates[$rate];
		else
		   $this->rate = $rate;
	}

	function toString()
	{
		$str = pack( 'N', $this->size() );
		$str .= $this->type;
		$str .= pack( 'N', $this->flag );
		$str .= pack( 'N', $this->rate );
		return $str;
	}
	
	function size()
	{
		return 4 * 4;
	}
}

/*
CPU Speed Atom
A CPU speed atom specifies the minimum computing power needed to display a movie. 
QuickTime performs an internal test to determine the speed of the user’s computer. 

This is not a simple measurement of clock speed—it is a measurement of performance 
for QuickTime-related operations. Speed is expressed as a relative value between 100 
and 2^31, in multiples of 100. 

Note: Typical scores might range from a minimum score of 100, which would describe a 
computer as slow as, or slower than, a 166 MHz Pentium or 120 MHz PowerPC, to a 
maximum score of 600 for a 500 MHz Pentium III or 400 MHz G4 PowerPC. A computer with 
a graphics accelerator and a Gigahertz clock speed might score as high as 1000. 
Future computers will score higher.

Applications should play the movie with the highest specified CPU speed that is less 
than or equal to the user’s speed. If the user’s speed is lower than any movie’s CPU 
speed, applications should play the movie with the lowest CPU speed requirement. The 
movie with the highest CPU speed is assumed to be the highest quality.

Only one CPU speed atom is allowed in a given reference movie descriptor atom.


A CPU speed atom may contain the following information.

Size 
The number of bytes in this CPU speed atom. 

Type 
The type of this atom; this field must be set to 'rmcs'. 

Flags 
A 32-bit integer that is currently always 0. 

CPU speed 
A relative ranking of required computer speed, expressed as a 32-bit integer divisible by 100, with larger numbers indicating higher speed. 

*/
class QTCPUSpeed extends QTBase
{
	var $flag = 0;
	var $speed = 500;
	
	var $speeds = array( 'very slow' => 100,
								'slow' => 300,
								'medium' => 500,
								'fast' => 700,
								'very fast' => 1000 );

	function QTCPUSpeed( $speed )
	{
		$this->QTBase();
		$this->type = "rmcs";
		if( $speed ) $this->setSpeed( $speed );
	}
	
	function setSpeed( $speed )
	{
		if( $this->speeds[$speed] )
		   $this->speed = $this->speeds[$speed];
		else
		   $this->speed = $speed;
	}

	function toString()
	{
		$str = pack( 'N', $this->size() );
		$str .= $this->type;
		$str .= pack( 'N', $this->flag );
		$str .= pack( 'N', $this->speed );
		return $str;
	}
	
	function size()
	{
		return 4 * 4;
	}
}

/*

Quality Atom
A quality atom describes the relative quality of a movie. This acts as a tie-breaker 
if more than one movie meets the specified requirements, and it is not otherwise 
obvious which movie should be played. 
This would be the case if two qualified movies have the same data rate and CPU speed 
requirements, for example, or if one movie requires a higher data rate and another 
requires a higher CPU speed, but both can be played on the current system. In these 
cases, applications should play the movie with the highest quality, as specified in 
the quality atom.
Only one quality atom is allowed in a given reference movie descriptor atom.

A quality atom may contain the following information.

Size 
The number of bytes in this quality atom. 

Type 
The type of this atom; this field must be set to 'rmqu'. 

Quality 
The relative quality of the movie, expressed as a 32-bit integer. A larger number indicates higher quality. A unique value should be given to each movie. 
*/
class QTQuality extends QTBase
{
	var $flag = 0;
	var $quality = 500;
	
	function QTQuality( $quality )
	{
		$this->QTBase();
		$this->type = "rmqu";
		if( $quality ) $this->setQuality( $quality );
	}
	
	function setQuality( $quality )
	{
	   $this->quality = $quality;
	}

	function toString()
	{
		$str = pack( 'N', $this->size() );
		$str .= $this->type;
		$str .= pack( 'N', $this->flag );
		$str .= pack( 'N', $this->quality );
		return $str;
	}
	
	function size()
	{
		return 4 * 4;
	}
}

/*
$RefMovie = new QTRefMovie();

$DataReference = new QTDataReference( "rtsp://193.197.172.41:80/test2.mov" );
$DataRate = new QTDataRate( "intranet" );
$CPUSpeed = new QTCPUSpeed( "fast" );

$MovieDescriptor = new QTRefMovieDescriptor();
$MovieDescriptor->addChunk( $DataReference );
$MovieDescriptor->addChunk( $DataRate );
$MovieDescriptor->addChunk( $CPUSpeed );

$RefMovie->addChunk( $MovieDescriptor );

$DataReference = new QTDataReference( "rtsp://193.197.172.41:80/test.mov" );
$DataRate = new QTDataRate( "t1" );
$CPUSpeed = new QTCPUSpeed( "medium" );

$MovieDescriptor = new QTRefMovieDescriptor();
$MovieDescriptor->addChunk( $DataReference );
$MovieDescriptor->addChunk( $DataRate );
$MovieDescriptor->addChunk( $CPUSpeed );

$RefMovie->addChunk( $MovieDescriptor );

$Movie = new QTMovie();
$Movie->addChunk( $RefMovie );

header( "Content-type: video/quicktime" );

echo $Movie->toString();
*/
?>