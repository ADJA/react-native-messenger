<?php
    $id=$_GET['id'];
    $password=$_GET['password'];
    $contact_id=$_GET['contact_id'];

    function connectToDatabase() {
        // Connect to your MySQL database here
    }   
                                    
    connectToDatabase();
    
    $result = mysql_query("SELECT * FROM `messenger_users` WHERE id='$id' AND password='$password'");
    
    if (mysql_num_rows($result) > 0) {
        $messages_result = mysql_query("SELECT SQL_NO_CACHE * FROM messenger_messages WHERE (from_id='$id' AND to_id='$contact_id') OR (from_id='$contact_id' AND to_id='$id') ORDER BY message_id");
        $messages = array();
        while($row=mysql_fetch_array($messages_result)) { 
            $message_id=$row['message_id'];
            $from_id=$row['from_id']; 
            $to_id=$row['to_id']; 
            $message=$row['message']; 
            $messages[] = array('message_id' => $message_id, 'from_id' => $from_id, 'to_id' => $to_id, 'message' => $message);
        } 
        echo json_encode($messages);
    }
?>
