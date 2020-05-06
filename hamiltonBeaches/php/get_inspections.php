<?php
include "connect.php";
include "inspection.php";
/**
 * Robert Peña, 000738570
 * grabs all inspections from the most recent
 * 
 * March 17 2019
 */
try {
    $cmd = "SELECT * from beach_inspections ORDER BY DATE_SAMPLED DESC";
    $stmt = $db->prepare($cmd);
    $success = $stmt->execute();
    //Create an object array and fill it
    if ($success) {
        $inspections = [];
        while ($row = $stmt->fetch()) {
            $inspection = new inspection($row["ID"], $row["BEACH_ID"], $row["DATE_SAMPLED"], $row["GEOMETRIC_MEAN"], $row["BEACH_POSTED"]);
            array_push($inspections, $inspection);
        }

        echo json_encode($inspections);
    }
} catch (Exception $e) {
    die("Error: {$e->getMessage()}");
}