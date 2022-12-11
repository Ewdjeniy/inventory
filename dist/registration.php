<?php

if ($_POST['$user_login'] && $_POST['$user_password']) {
  registrate_user();
}

function registrate_user() {
    require('requireDb.php');
    $login = $_POST['$user_login'];
    $password = $_POST['$user_password'];
    
    if ($login && $password) {
        $query = "SELECT * FROM users WHERE user_login = '$login'";
        $send_query = mysqli_query($link, $query);
        $user_array = mysqli_fetch_array($send_query);
        $login = $user_array['user_login'];

        $count = mysqli_num_rows($send_query);
        if ($count == 0) {
          $login = $_POST['$user_login'];
          
          $inventory_table = 'inventory_' . $login;
          $links_table = 'links_' .$login;
          
          $query = "INSERT INTO users VALUES (NULL, '$login', '$password')";
          $result = mysqli_query($link, $query);
          
          $query = "CREATE TABLE $inventory_table
                                  (
                                    id INT NOT NULL AUTO_INCREMENT,
                                    PRIMARY KEY(id),
                                    linkName INT(2),
                                    name VARCHAR (20),
                                    quantity INT (10)
                                  )";
          $create_inventory = mysqli_query($link, $query);

          $query = "CREATE TABLE $links_table
                                        (
                                          linkID INT NOT NULL AUTO_INCREMENT,
                                          PRIMARY KEY(linkID),
                                          linkName VARCHAR (20)
                                        )";
          $create_links = mysqli_query($link, $query);

          $query = "INSERT INTO $links_table VALUES (NULL, 'новый')";
          $result = mysqli_query($link, $query);
          
          session_start();
          $_SESSION['login'] = $login;
          echo $login;
        } else {
          echo "busy";
        }
    }
        
    mysqli_close($link);
}

?>