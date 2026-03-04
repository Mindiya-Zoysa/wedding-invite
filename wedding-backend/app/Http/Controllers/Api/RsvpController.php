<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rsvp;
use Illuminate\Http\Request;
use App\Exports\RsvpExport;
use Maatwebsite\Excel\Facades\Excel;

class RsvpController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate the incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'side' => 'required|string|in:yasara,anuruddha',
            'attending' => 'required|string|in:yes,no',
            'message' => 'nullable|string'
        ]);

        // 2. Save to the database
        $rsvp = Rsvp::create($validated);

        // 3. Return a success response to React
        return response()->json([
            'status' => 'success',
            'message' => 'RSVP saved successfully!',
            'data' => $rsvp
        ], 201);
    }

    // --- NEW EXPORT FUNCTION ---
    public function export() 
    {
        // This instantly generates and downloads the file as 'wedding_rsvps.xlsx'
        return Excel::download(new RsvpExport, 'wedding_rsvps.xlsx');
    }
}