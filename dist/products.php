<?php

session_start();

if ($_POST['$online']) {
  echo 'online';
}

add_product($_POST['link_id'], $_POST['linkName'], $_POST['productName'], $_POST['productQuantity']);

change_quantity($_POST['$id_to_change']);

if ($_POST['$id']) {
  delete_product($_POST['$id']);
}





function add_product($link_id, $link_name, $name, $quantity) {
    $inventory_table = 'inventory_' . $_SESSION['login'];
    $quantity = (int) $quantity;
	if ($name) {
		require('requireDb.php');
		
		$query = "INSERT INTO $inventory_table VALUES ('$link_id', '$link_name', '$name', '$quantity')";
		$result = mysqli_query($link, $query);
		
		mysqli_close($link);
	}
}

function change_quantity($id) {
    $inventory_table = 'inventory_' . $_SESSION['login'];
	$changed_quantity = $_POST['$quantity'];
	$id = (int) $id;
	if ($changed_quantity && $id) {
		require('requireDb.php');
		
		$update_query = "UPDATE $inventory_table SET quantity = '$changed_quantity'
					   WHERE id = $id";
		$update_result = mysqli_query($link, $update_query);
		
		mysqli_close($link);
	}
}

function delete_product($id) {
  $inventory_table = 'inventory_' . $_SESSION['login'];
  
  require('requireDb.php');
  
  $query = "DELETE FROM $inventory_table WHERE id = $id";
  $result = mysqli_query($link, $query);
  
  mysqli_close($link);
}

?>