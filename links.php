<?php

session_start();

if ($_POST['$online']) {
  echo 'online';
}

add_link(count(make_jsonLinks_bd()) + 1);

change_link_name($_POST['linkID'], $_POST['new_link_name']);

delete_link($_POST['$id']);





function add_link($id) {
    $links_table = 'links_' . $_SESSION['login'];
  
	if ($_POST['new_link']) {
		require('requireDb.php');
		
		$query = "INSERT INTO $links_table VALUES ($id, 'новый')";
		$result = mysqli_query($link, $query);
      
        mysqli_close($link);
	}
}

function change_link_name($linkID, $link_name) {
    $links_table = 'links_' . $_SESSION['login'];
	if ($link_name) {
		
		require('requireDb.php');
		
		$id = (int) $linkID;
		
		$update_query = "UPDATE $links_table SET linkName = '$link_name'
					   WHERE linkID = $id";
		$update_result = mysqli_query($link, $update_query);
		
		mysqli_close($link);
	}
}

function make_json_bd() {
    $inventory_table = 'inventory_' . $_SESSION['login'];
    $links_table = 'links_' . $_SESSION['login'];
	require('requireDb.php');
	
	$linksArray = [];
	$products = [];
	$json_bd = [];
	
	$query_link = "SELECT * FROM $links_table";
	$select_link = mysqli_query($link, $query_link);
	if ($select_link) {
		while ($link_name = mysqli_fetch_array($select_link)) {
			array_push($linksArray, $link_name['linkName']);
		}
		array_push($json_bd, $linksArray);
	} else {
		return false;
	}
	
	$query_product = "SELECT * FROM $inventory_table";
	$select_product = mysqli_query($link, $query_product);
	if ($select_product) {
		while ($product = mysqli_fetch_array($select_product)) {
			$arr = ['id' => $product['id'], 'linkName' => $product['linkName'], 'name' => $product['name'], 'quantity' => (int) $product['quantity']];
			array_push($products, $arr);
		}
		array_push($json_bd, count($products) + 1);
		array_push($json_bd, 1);
		for ($i = 0; $i < count($products); $i++) {
			array_push($json_bd, $products[$i]);
		}
	} else {
		return false;
	}
	
	mysqli_close($link);
	
	return json_encode($json_bd, JSON_UNESCAPED_UNICODE);
	
}

function make_jsonLinks_bd() {
  require('requireDb.php');
  
  $links_table = 'links_' . $_SESSION['login'];
  $linksArray = [];
  
  $query = "SELECT * FROM $links_table";
	$select_link = mysqli_query($link, $query);
	if ($select_link) {
		while ($link_name = mysqli_fetch_array($select_link)) {
			array_push($linksArray, $link_name['linkName']);
		}
	}
  
  mysqli_close($link);
  return $linksArray;
}

function delete_link($id) {
  $inventory_table = 'inventory_' . $_SESSION['login'];
  $links_table = 'links_' . $_SESSION['login'];
  $links = make_jsonLinks_bd();
  $bdStor = json_decode(make_json_bd(), true);
  $products_in_bd = array_slice($bdStor, 3);
  
  if ($id) {
    require('requireDb.php');

    $query = "DELETE FROM $links_table WHERE linkID = $id";
    $result = mysqli_query($link, $query);

    for ($i = 0; $i < count($links); $i++) {
      $linkID = $i + 1;
      if ($i > 0) {
        $query = "UPDATE $links_table SET linkID = '$i' WHERE linkID = $linkID";
        $result = mysqli_query($link, $query);
      }
    }

    $query = "DELETE FROM $inventory_table WHERE linkName = $id";
    $result = mysqli_query($link, $query);

    for ($j = 0; $j < count($products_in_bd); $j++) {
      if ($products_in_bd[$j]['linkName'] > $id) {
        $changed_linkName = $products_in_bd[$j]['linkName'] - 1;
        $id_in_bdStorage = $products_in_bd[$j]['id'];
        $update_query = "UPDATE $inventory_table SET linkName = '$changed_linkName' WHERE id = $id_in_bdStorage";
        $update_result = mysqli_query($link, $update_query);
      }
    }

    mysqli_close($link);
  }
}

?>