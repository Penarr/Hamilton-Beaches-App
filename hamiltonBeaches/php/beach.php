<?php

/**
 * 
 * Robert Peña, 000738570
 * A class to create beach objects
 * Implements JsonSerializable
 * March 17 2019
 * 
 */

class beach implements JsonSerializable
{
    private $id;
    private $name;
    private $water_source;
    private $longitude;
    private $latitude;
    private $blacklisted;


    /**
     * @param [$id] 
     * @param [$name] 
     * @param [$water_source] 
     * @param [$longitude]
     * @param [$latitude]
     * @param [$blacklisted]
     */
    public function __construct($id, $name, $water_source, $latitude, $longitude, $blacklisted)
    {
        $this->id = (int) $id;
        $this->name = $name;
        $this->water_source = $water_source;
        $this->latitude = (double)$latitude;
        $this->longitude = (double)$longitude;
        $this->blacklisted = (bool)$blacklisted;
    }
    /**
     * Return object values in JSON
     */
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }


    
}
