<?php
// based on https://gist.github.com/1809044

error_log(var_export($_SERVER, true));
error_log(var_export($_REQUEST, true));

if ($_SERVER['REMOTE_ADDR'] != '127.0.0.1') {
  error_log($_SERVER['REMOTE_ADDR']." is not authorized to access deploy.php");
  exit(1);
}

// The commands
  $commands = array(
    'echo $PWD',
    'whoami',
    'git pull',
    'git status',
  );

//  'git submodule sync',
//  'git submodule update',
//  'git submodule status',

// Run the commands for output
  $output = '';
  foreach($commands AS $command){
// Run it
    $tmp = shell_exec($command);
// Output
    $output .= '
<span style="color: #6BE234;">$</span> <span style="color: #729FCF;">'.$command.'</span>
'.htmlentities(trim($tmp));
  }

echo '<!DOCTYPE HTML>
<html lang="en-US">
  <head>
    <meta charset="UTF-8">
    <title>GIT DEPLOYMENT SCRIPT</title>
  </head>
  <body style="background-color: #000000; color: #FFFFFF; font-weight: bold; padding: 0 10px;">
    <h2>Git Deployment Script v0.2</h2>
    <pre>'.$output.'
    </pre>
  </body>
</html>
';
?>
