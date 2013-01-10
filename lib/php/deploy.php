<?php
// deploy.php v0.3 20130110 (C) Mark Constable (AGPLv3)
// based on https://gist.github.com/1809044

//error_log(var_export($_SERVER, true));
//error_log(var_export($_REQUEST, true));

define("MYIP", "101.167.17.51");

// deny access if not from MYIP, localhost or Github
if ($_SERVER['REMOTE_ADDR'] !== MYIP and
    $_SERVER['REMOTE_ADDR'] !== '127.0.0.1' and
    $_SERVER['REMOTE_ADDR'] !== '207.97.227.253' and
    $_SERVER['REMOTE_ADDR'] !== '50.57.128.197' and
    $_SERVER['REMOTE_ADDR'] !== '108.171.174.178') {
  error_log($_SERVER['REMOTE_ADDR']." is NOT authorized to access deploy.php");
  exit(1);
} else {
  error_log($_SERVER['REMOTE_ADDR']." is authorized to access deploy.php");
}

$commands = array(
  'echo $PWD',
  'whoami',
  'git pull',
  'git status',
);

//  'git submodule sync',
//  'git submodule update',
//  'git submodule status',

$output = '';
foreach($commands as $command) {
  $tmp = shell_exec($command);
  if ($_SERVER['REMOTE_ADDR'] != MYIP or
      $_SERVER['REMOTE_ADDR'] != '127.0.0.1') {
    $output .= '
<em>$</em> <span class="blue">'.$command.'</span>
'.htmlentities(trim($tmp));
  }
}

if ($_SERVER['REMOTE_ADDR'] != MYIP or
    $_SERVER['REMOTE_ADDR'] != '127.0.0.1') {
echo '<!DOCTYPE HTML>
<html lang="en-US">
  <head>
    <meta charset="UTF-8">
    <title>GitHub Deploy</title>
    <style>
body {
  background-color: #000000;
  color: #FFFFFF;
  font-weight: bold;
  padding: 0 1em;
}
em {
  color: #6BE234;
}
.blue {
  color: #729FCF;
}
    </style>
  </head>
  <body>
    <h2>GitHub Deploy v0.3</h2>
    <pre>'.$output.'
    </pre>
  </body>
</html>
';
}
?>
