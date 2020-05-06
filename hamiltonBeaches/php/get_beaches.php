<?php
/**
 * Robert Peña, 000738570
 * Grabs all of the beaches in Hamilton
 * 
 * March 17 2019
 */
include "connect.php";
include "beach.php";
try {
    $cmd = "SELECT * from beaches";
    $stmt = $db->prepare($cmd);
    $success = $stmt->execute();
    //Create an object array and fill it
    if ($success) {
        $beaches = [];
        while ($row = $stmt->fetch()) {
            $beach = new beach($row["ID"], $row["NAME"], $row["WATER_SOURCE"], $row["LATITUDE"], $row["LONGITUDE"], $row["BLACKLISTED"]);
            array_push($beaches, $beach);
        }

        echo json_encode($beaches);
    }
} catch (Exception $e) {
    die("Error: {$e->getMessage()}");
}