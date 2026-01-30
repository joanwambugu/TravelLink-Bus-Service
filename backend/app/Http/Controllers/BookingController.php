<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Create the booking using your fillable fields
            $booking = Booking::create([
                'from'   => $request->from,
                'to'     => $request->to,
                'date'   => $request->date,
                'time'   => $request->time,
                'phone'  => $request->phone,
                'seat'  => $request->seats, 
                'status' => 'paid'
            ]);

            return response()->json(['message' => 'Success', 'booking' => $booking], 201)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500)
                ->header('Access-Control-Allow-Origin', '*');
        }
    }

    public function getBookedSeats(Request $request)
    {
        $booked = Booking::where('from', $request->from)
            ->where('to', $request->to)
            ->where('date', $request->date)
            ->get()
            ->pluck('seats')
            ->flatten()
            ->toArray();

        return response()->json($booked)
            ->header('Access-Control-Allow-Origin', '*');
    }
}