<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class BusRoute extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'routes';
    protected $fillable = ['from', 'to', 'price'];
}