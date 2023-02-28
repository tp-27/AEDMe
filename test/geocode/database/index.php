<?php
    // PHP Data Objects - PDO - extension that allows for accessing databases
    //define PDO - tell about database file
    // $pdo = new PDO('sqlite:location.db');
    $pdo = new PDO('sqlite:location.db');

    // write SQL
    $statement = $pdo->query("SELECT * FROM locations");

    // run the SQL
    $rows = $statement->fetchAll(PDO::FETCH_ASSOC); // returns an array containing all of the result set rows

    // show it on screen
        // echo "<pre>";
        // print_r($rows); // prints human-readable information about a variable
        // var_dump($rows);
        // echo "</pre>";
    echo json_encode($rows);
   


    // RUN PHP SERVER