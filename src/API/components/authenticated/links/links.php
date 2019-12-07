<?php

add_link();
change_link_name($_POST['linkID'], $_POST['new_link_name']);





function add_link() {
	if (isset( $_POST['new_link'])) {
		require('requireDb.php');
		
		$query = "INSERT INTO links VALUES (NULL, 'новый')";
		$result = mysqli_query($link, $query);
	}
}

function change_link_name($linkID, $link_name) {
	if ($link_name) {
		
		require('requireDb.php');
		
		$id = (int) $linkID;
		
		$update_query = "UPDATE links SET linkName = '$link_name'
					   WHERE linkID = $id";
		$update_result = mysqli_query($link, $update_query);
		
		mysqli_close($link);
	}
}



?>