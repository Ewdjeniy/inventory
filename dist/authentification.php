<?php

create_db();

session_start();

// Если методом POST придут данные о session_login, выводим значение 
// ключа 'login' в глобальном массиве SESSION
// для аутентифицированного пользователя, для не аутентифицированного
// значение 'login' не определенно, сервер будет отвечать ''
if ($_POST['session_login']) {
  echo $_SESSION['login'];
}

// Если методом POST придут данные о $log_out закрываем открытую сессию
if ($_POST['$log_out']) {
  session_unset();
  session_destroy();
}

authenticate_user();

function authenticate_user() {
  require('requireDb.php');
  
  $login = $_POST['$user_login'];
  $password = $_POST['$user_password'];
  
  // пытается получить данные из метода logIn класса AnonymousAuthentification,
  // переданные в Ajax
  if ($login && $password) {
    
    // если данные пришли проверяет поля user_login и user_password в таблице users БД
    // на совпадение с пришедшими значениями
    $query = "SELECT * FROM users WHERE user_login = '$login' AND user_password = '$password'";
    $send_query = mysqli_query($link, $query);
    $user_array = mysqli_fetch_array($send_query);
    $login = $user_array['user_login'];
    $password = $user_array['user_password'];

    $count = mysqli_num_rows($send_query);
    if ($count > 0) {
      // если есть строка в БД, совпадающая с пришедшими значениями
      // в массив SESSION добавляется значение (поля user_login 
      //из таблицы users) с ключом login и сервер выводит 'session is started'
      $_SESSION['login'] = $login;
      echo 'session is started';
    } else {
      //  если в БД нет совпадений с пришедшими значениями сервер выводит 'noDate'
      echo 'noDate';
    }
  }
  
  mysqli_close($link);
}

function create_db() {
  $inventory_table = 'inventory_' . 'admin';
  $links_table = 'links_' . 'admin';
  $link = mysqli_connect("localhost", "root", "");
  $db = "inventory_db";
  $select = mysqli_select_db($link, $db);
  if ($select == '') {
    $query = "CREATE DATABASE $db";
    $create_db = mysqli_query($link, $query);
    
    $select = mysqli_select_db($link, $db);
      
    $query = "CREATE TABLE users
                                (
                                    userID INT NOT NULL AUTO_INCREMENT,
                                    PRIMARY KEY(userID),
                                    user_login VARCHAR (20),
                                    user_password VARCHAR (20)
                                  )";
    $create_users = mysqli_query($link, $query);
      
    $query = "INSERT INTO users VALUES (NULL, 'admin', 'admin')";
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
  }
  mysqli_close($link);
  header("Refresh:0");
}

?>