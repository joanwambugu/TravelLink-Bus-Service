<?php

use Illuminate\Support\Facades\Route;
use App\Models\BusRoute;
use App\Models\Booking;
use App\Http\Controllers\MpesaController;
use App\Http\Controllers\BookingController;

/*
|--------------------------------------------------------------------------
| Admin & Utility Routes (Specific Routes First)
|--------------------------------------------------------------------------
*/

// 1. Get every single booking in the database
Route::get('/all-bookings', function() {
    return response()->json(Booking::all())
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Accept');
});

// 2. Delete a booking by its MongoDB ID
Route::delete('/delete-booking/{id}', function($id) {
    Booking::destroy($id);
    return response()->json(['message' => 'Deleted successfully'])
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
});

// 3. Get routes for dropdowns
Route::get('/get-routes', function () {
    try {
        $fromTowns = BusRoute::raw(function($collection) {
            return $collection->distinct('from');
        });

        $toTowns = BusRoute::raw(function($collection) {
            return $collection->distinct('to');
        });

        return response()->json([
            'from' => $fromTowns,
            'to' => $toTowns
        ], 200, [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, X-Requested-With'
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

/*
|--------------------------------------------------------------------------
| Controller-based Routes
|--------------------------------------------------------------------------
*/

Route::post('/process-booking', [BookingController::class, 'store']);
Route::get('/booked-seats', [BookingController::class, 'getBookedSeats']);
Route::post('/mpesa-stkpush', [MpesaController::class, 'stkPush']);

/*
|--------------------------------------------------------------------------
| Global Options Catch-all (MUST BE AT THE VERY BOTTOM)
|--------------------------------------------------------------------------
*/
Route::options('{any}', function() {
    return response()->json([], 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
        ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept');
})->where('any', '.*');