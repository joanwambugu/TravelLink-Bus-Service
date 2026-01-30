<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MpesaController extends Controller
{
    public function stkPush(Request $request)
    {
        $amount = 1; // For testing, use 1 Ksh
        $phone = $request->phone; // Format: 2547xxxxxxxx
        
        // 1. Get Access Token
        $response = Http::withBasicAuth(env('MPESA_CONSUMER_KEY'), env('MPESA_CONSUMER_SECRET'))
            ->get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials');
            
        $token = $response->json()['access_token'];

        // 2. Prepare STK Push
        $timestamp = now()->format('YmdHis');
        $password = base64_encode(env('MPESA_SHORTCODE').env('MPESA_PASSKEY').$timestamp);

        $stkResponse = Http::withToken($token)->post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processquery', [
            "BusinessShortCode" => env('MPESA_SHORTCODE'),
            "Password" => $password,
            "Timestamp" => $timestamp,
            "TransactionType" => "CustomerPayBillOnline",
            "Amount" => $amount,
            "PartyA" => $phone,
            "PartyB" => env('MPESA_SHORTCODE'),
            "PhoneNumber" => $phone,
            "CallBackURL" => "https://your-domain.com/api/mpesa-callback",
            "AccountReference" => "TravelLink",
            "TransactionDesc" => "Bus Ticket"
        ]);

        return response()->json($stkResponse->json());
    }
}