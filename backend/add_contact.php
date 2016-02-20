<?php
    $id=$_GET['id'];
    $password=$_GET['password'];
    $contact_username=$_GET['contact_username']; //contact_username is guaranteed to be the username of user with id

    function connectToDatabase() {
        // Connect to your MySQL database here
    }   
                                    
    connectToDatabase();
    
    $user = mysql_query("SELECT * FROM `messenger_users` WHERE id='$id' AND password='$password'");
    $contact = mysql_query("SELECT * FROM `messenger_users` WHERE username='$contact_username'");
    
    if (mysql_num_rows($user) > 0) {
        $row = mysql_fetch_array($contact);
        if (mysql_num_rows($contact) > 0) {
            $contact_id = $row["id"];
            mysql_query("INSERT INTO `messenger_contacts`(`id`, `contact_id`) VALUES ('$id','$contact_id')");
            $result = array('result' => 0, 'contact_id' => $contact_id);
            echo json_encode($result);
        }
        else {
            $result = array('result' => -1, 'contact_id' => -1);
            echo json_encode($result);
        }
    }
?>
