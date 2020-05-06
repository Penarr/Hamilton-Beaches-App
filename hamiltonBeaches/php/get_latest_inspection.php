
<?php
/**
 * Robert Peña, 000738570
 * Grabs beach inspection where the beach id matches.
 * Orders from most recent inspections
 * 
 * March 17 2019
 */
include "connect.php";
include "inspection.php";
$beach_id = filter_input(INPUT_POST, "beachId", FILTER_SANITIZE_NUMBER_INT);

try {
    $cmd = "SELECT * from beach_inspections where BEACH_ID = ? ORDER BY DATE_SAMPLED DESC ";
    $stmt = $db->prepare($cmd);
    $success = $stmt->execute([$beach_id]);
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