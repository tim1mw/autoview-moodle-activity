<?php
function mdl21_getconfigparam($m, $v)
{
 $config = get_config($m);
 if (eval('return isset($config->'.$v.');'))
  return eval('return $config->'.$v.';');
 else
 {
  global $CFG;
  return eval('return $CFG->'.$m.'_'.$v.';');;
 }
}

function mdl21_configparamisset($m, $v)
{
 $config = get_config($m);
 if (eval('return isset($config->'.$v.');')==false)
 {
  global $CFG;
  return eval('return isset($CFG->'.$m.'_'.$v.');');
 }

 return true;
}

/**
* These methods exists to solve a global varaible scoping problem in PHP,
* sometimes the $DB/$OUTPUT/$PAGE objects contstructed above just can't be referenced 
* from the referencing page
**/

function mdl21_get_output()
{
 global $OUTPUT;
 return $OUTPUT;
}

function mdl21_get_DB()
{
 global $DB;
 return $DB;
}
?>
