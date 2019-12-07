<?php


if ($_POST['$online']) {
  echo 'online';
}

add_product($_POST['linkName'], $_POST['productName'], $_POST['productQuantity']);

change_quantity($_POST['$i']);

if ($_POST['$id']) {
  echo 5;
}





function add_product($link_name, $name, $quantity) {
    $quantity = (int) $quantity;
	if ($name) {
		require('requireDb.php');
		
		$query = "INSERT INTO inventory VALUES (NULL, '$link_name', '$name', '$quantity')";
		$result = mysqli_query($link, $query);
		
		mysqli_close($link);
	//  exit('<meta http-equiv="refresh" content="0; url=index.html" />');
	}
}

function change_quantity($i) {	
	$changed_quantity = $_POST['quantity' . $i];
	$id = (int) $_POST['id' . $i];
	if ($changed_quantity && $id) {
		require('requireDb.php');
		
		$update_query = "UPDATE inventory SET quantity = '$changed_quantity'
					   WHERE id = $id";
		$update_result = mysqli_query($link, $update_query);
		
		mysqli_close($link);
	}
}

function delete_product($id) {
  require('requireDb.php');
  
  DELETE FROM `table` WHERE `number` = номер 
  
  mysqli_close($link);
}

?>