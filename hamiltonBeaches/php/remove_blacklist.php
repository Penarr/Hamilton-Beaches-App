<?php

/**
 * Robert Peña, 000738570
 * Removes a beach from blacklist.
 * 
 * March 17 2019
 */
include "connect.php";
try {
    $id = filter_input(INPUT_POST, "id", FILTER_VALIDATE_INT);
    $cmd = "UPDATE beaches SET BLACKLISTED = 0  where ID = ?";
    $stmt = $db->prepare(($cmd));
    $success = $stmt->execute([$id]);

    
} catch (Exception $e) {
    die("Error: {$e->getMessage()}");
}
