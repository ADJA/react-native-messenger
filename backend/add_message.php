<?php
    $id=$_GET['id'];
    $password=$_GET['password'];
    $contact_id=$_GET['contact_id'];
    $message=$_GET['message'];

    function connectToDatabase() {
        // Connect to your MySQL database here
    }   
                                    
    connectToDatabase();
    
    $user = mysql_query("SELECT * FROM `messenger_users` WHERE id='$id' AND password='$password'");
    
    if (mysql_num_rows($user) > 0) {
        $query = mysql_query("INSERT INTO `messenger_messages`(`from_id`, `to_id`, `message`) VALUES ('$id', '$contact_id', '$message')");
        $result = array('result' => 0);
        echo json_encode($result);
    }
?>
