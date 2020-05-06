<?php

/**
 * Robert Peña, 000738570
 * Resets the blacklist value to false for every beach
 * 
 * March 17 2019
 */
include "connect.php";
try {
    $cmd = "UPDATE beaches SET BLACKLISTED = 0  where BLACKLISTED = 1";
    $stmt = $db->prepare(($cmd));
    $success = $stmt->execute();

    
} catch (Exception $e) {
    die("Error: {$e->getMessage()}");
}
