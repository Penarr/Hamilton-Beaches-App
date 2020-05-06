<?php

/**
 * 
 * Robert Peña, 000738570
 * A class to create inspection objects
 * Implements JsonSerializable
 * March 17 2019
 * 
 */

class inspection implements JsonSerializable
{
    private $id;
    private $beach_id;
    private $date_sampled;
    private $geometric_mean;
    private $beach_posted;


    /**
     * @param [$id] 
     * @param [$beach_id] 
     * @param [$date_sampled] []
     * @param [$geometric_mean]
     * @param [$beach_posted]
     
     */
    public function __construct($id, $beach_id, $date_sampled, $geometric_mean, $beach_posted)
    {
        $this->id = (int) $id;
        $this->beach_id = (int)$beach_id;
        $this->date_sampled = $date_sampled;
        $this->geometric_mean = (double)$geometric_mean;
        if($beach_posted === "Yes")
            $this->beach_posted = true;
        else if($beach_posted === "No")
            $this->beach_posted = false;
    }
    /**
     * Return object values in JSON
     */
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }


    
}
