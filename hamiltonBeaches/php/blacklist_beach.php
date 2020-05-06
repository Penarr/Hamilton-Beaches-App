<?php

/**
 * Robert Peña, 000738570
 * Blacklists a beach
 * 
 * March 17 2019
 */
include "connect.php";
try {
    $id = filter_input(INPUT_POST, "id", FILTER_VALIDATE_INT);
    $cmd = "UPDATE beaches SET BLACKLISTED = 1  where ID = ?";
    $stmt = $db->prepare(($cmd));
    $success = $stmt->execute([$id]);

    
} catch (Exception $e) {
    die("Error: {$e->getMessage()}");
}
