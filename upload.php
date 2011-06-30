<?php

  date_default_timezone_set("Europe/Berlin");  
  
  /* 
    Decrypt in PHP
  
  require_once('inc/Cryptojs.php'); 
  require_once('inc/Cryptojs_UTF8.php');
  require_once('inc/Cryptojs_AES.php');
  require_once('inc/Cryptojs_util.php');
  //$dec = base64_decode($string);
  //print_r($dec);
  $dec = Cryptojs_AES::decrypt($_POST["randname"],  'secret'); 
  */ 
  
  //This is here for debugging
  /*
  print_r($_POST);
  echo "\n\n";
  echo "decrypt:\n";
  print_r($dec);
  echo "\n\n";
  */
  $dir = "uploads/";

  if(isset($_FILES)) {
	  ob_start();
      echo date('l jS \of F Y h:i:s A')."\n";
      
      if($_FILES['fileupload']['name']) {
		  $uploadfile = $dir.$_FILES['fileupload']['name'].rand(0,10000);
		  
		  if(move_uploaded_file($_FILES['fileupload']['tmp_name'], $uploadfile)) {
        $signal = "success";
		  	echo "File upload success.\n";
		  }
		  else {
		  	echo "Error: File upload failed!\n";
		  }
	  }
	  else {
	  	echo "E: filename not alfanumerical!\n";
	  }
  	  $output = ob_get_clean();
	  file_put_contents('log.txt', file_get_contents('log.txt') . $output);
    echo $signal;
  }

  if(isset($_GET['getfilelist'])) {
  	
	$list = scandir($dir);
  	foreach ($list as $file) {
  		if($file != "." && $file != "..")
  			echo $file.";";
  	}
  	echo "\n";
  }
  
?>
