<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Booking extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'bookings';
    
    protected $fillable = [
        'phone', 
        'from', 
        'to', 
        'date', 
        'time', 
        'seats', 
        'status'
    ];
}