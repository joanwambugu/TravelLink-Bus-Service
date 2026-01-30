<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusRoute; // Ensure this matches your model

class RouteSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing routes first to avoid duplicates
        BusRoute::truncate();

        $routes = [
            ['from' => 'Nairobi', 'to' => 'Mombasa', 'price' => 1500],
            ['from' => 'Nairobi', 'to' => 'Kisumu', 'price' => 1200],
            ['from' => 'Mombasa', 'to' => 'Nairobi', 'price' => 1500],
            ['from' => 'Kisumu', 'to' => 'Nairobi', 'price' => 1200],
            ['from' => 'Nakuru', 'to' => 'Nairobi', 'price' => 800],
        ];

        foreach ($routes as $route) {
            BusRoute::create($route);
        }
    }
}