<?php
    $username=$_GET['username'];
    $password=$_GET['password'];

    function connectToDatabase() {
        // Connect to your MySQL database here
    }   
                                    
    connectToDatabase();
    
    $query = mysql_query("SELECT `id` FROM `messenger_users` WHERE username='$username'");

    if (mysql_num_rows($query) > 0 || $username == '' || $password == '') {
        $id = array('id' => -1);
        echo json_encode($id);
    }
    else {
        mysql_query("INSERT INTO `messenger_users`(`username`, `password`) VALUES ('$username', '$password')");
        $new_id_query = mysql_query("SELECT `id` FROM `messenger_users` WHERE username='$username' AND password='$password'");
        $id = array('id' => -1);
        if (mysql_num_rows($new_id_query) > 0) {
            $row = mysql_fetch_array($new_id_query);
            $id = array('id' => $row["id"]);
        }
        echo json_encode($id);
    }
?>
