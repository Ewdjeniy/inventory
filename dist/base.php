<?php

session_start();


if ($_POST['$takeDataFromBd']) {
  echo make_json_bd();
}

if ($_POST['$checkSynchronization']) {
  synchronize();
}

if ($_POST['$online']) {
  echo 'online';
}


function make_json_bd() {
    $inventory_table = 'inventory_' . $_SESSION['login'];
    $links_table = 'links_' . $_SESSION['login'];
	require('requireDb.php');
	
	$linksArray = [];
	$products = [];
	$json_bd = [];
    $max_id = 0;
	
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
            if ($product['id'] > $max_id) {
              $max_id = $product['id'];
            }
			$arr = ['id' => $product['id'], 'linkName' => $product['linkName'], 'name' => $product['name'], 'quantity' => (int) $product['quantity']];
			array_push($products, $arr);
		}
		array_push($json_bd, $max_id + 1);
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

function synchronize() {
  $inventory_table = 'inventory_' . $_SESSION['login'];
  $links_table = 'links_' . $_SESSION['login'];
  $localStor = json_decode($_POST['$localStor'], true);
  $bdStor = json_decode(make_json_bd(), true);
  
  if ($localStor != $bdStor) {
    require('requireDb.php');
    
    $n = (count($localStor[0]) >= count($bdStor[0])) ? count($localStor[0]) : count($bdStor[0]);
    for ($i = 0; $i < $n; $i++) {
      $bdStor = json_decode(make_json_bd(), true);
      $id = $i + 1;
      $linkName = $localStor[0][$i];
      
      if ($localStor[0][$i] && $bdStor[0][$i] && $bdStor[0][$i] != $localStor[0][$i]) {
        $update_query = "UPDATE $links_table SET linkName = '$linkName' WHERE linkID = $id";
        $update_result = mysqli_query($link, $update_query);
      } else if ($localStor[0][$i] && !$bdStor[0][$i]) {
          $query = "INSERT INTO $links_table VALUES (NULL, '$linkName')";
          $result = mysqli_query($link, $query);
      } else if (!$localStor[0][$i] && $bdStor[0][$i]) {
          $query = "DELETE FROM $links_table WHERE id = $id";
		  $result = mysqli_query($link, $query);
      }
    }
    
    $products_in_local_storage = array_slice($localStor, 3);
    $products_in_bd = array_slice($bdStor, 3);
    $n = (count($products_in_local_storage) >= count($products_in_bd)) ? count($products_in_local_storage) : count($products_in_bd);
    $j = 0;
    
    while ($products_in_local_storage != $products_in_bd) {
        $bdStor = json_decode(make_json_bd(), true);
        $products_in_bd = array_slice($bdStor, 3);
        $id_in_localStorage = $products_in_local_storage[$j]['id'];
        $linkName_in_localStorage = $products_in_local_storage[$j]['linkName'];
        $name_in_localStorage = $products_in_local_storage[$j]['name'];
        $quantity_in_localStorage = $products_in_local_storage[$j]['quantity'];
        $id_in_bdStorage = $products_in_bd[$j]['id'];
        $linkName_in_bdStorage = $products_in_bd[$j]['linkName'];
        $name_in_bdStorage = $products_in_bd[$j]['name'];
        $quantity_in_bdStorage = $products_in_bd[$j]['quantity'];

        if (
          $products_in_local_storage[$j] && $products_in_bd[$j] &&
          $id_in_localStorage == $id_in_bdStorage &&
          $quantity_in_localStorage != $quantity_in_bdStorage
        ) {
          $update_query = "UPDATE $inventory_table SET quantity = '$quantity_in_localStorage' WHERE id = $id_in_bdStorage";
          $update_result = mysqli_query($link, $update_query);
        } else if (
          $products_in_local_storage[$j] && $products_in_bd[$j] &&
          $id_in_localStorage != $id_in_bdStorage
        ) {
          $query = "DELETE FROM $inventory_table WHERE id = $id_in_bdStorage";
          $result = mysqli_query($link, $query);
          $query = "INSERT INTO $inventory_table VALUES 
                      ('$id_in_localStorage', '$linkName_in_localStorage', '$name_in_localStorage', '$quantity_in_localStorage')";
          $result = mysqli_query($link, $query);
        } else if ($products_in_local_storage[$j] && !$products_in_bd[$j]) {
          $query = "INSERT INTO $inventory_table VALUES 
                      ('$id_in_localStorage', '$linkName_in_localStorage', '$name_in_localStorage', '$quantity_in_localStorage')";
          $result = mysqli_query($link, $query);
        } else if (!$products_in_local_storage[$j] && $products_in_bd[$j]) {
          $query = "DELETE FROM $inventory_table WHERE id = $id_in_bdStorage";
          $result = mysqli_query($link, $query);
        }
      
      if ($j < $n) {
        $j += 1;
      } else {
        $j = 0;
      }
    }
    
    mysqli_close($link);
  }
}

?>