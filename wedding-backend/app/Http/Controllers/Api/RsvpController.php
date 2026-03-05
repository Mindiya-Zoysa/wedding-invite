<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rsvp;
use Illuminate\Http\Request;
use App\Exports\RsvpExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class RsvpController extends Controller
{
    // --- NEW: Fetch all RSVPs for the Dashboard ---
    public function index()
    {
        // Get all RSVPs, newest first
        $rsvps = \App\Models\Rsvp::orderBy('created_at', 'desc')->get();
        return response()->json($rsvps);
    }

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

    public function exportPdf()
    {
        // 1. Fetch guests split by side
        $yasaraGuests = Rsvp::where('side', 'yasara')->orderBy('name', 'asc')->get();
        $anuruddhaGuests = Rsvp::where('side', 'anuruddha')->orderBy('name', 'asc')->get();

        // 2. Load the HTML blade view we just created, passing the data in
        $pdf = Pdf::loadView('pdf.rsvps', [
            'yasaraGuests' => $yasaraGuests,
            'anuruddhaGuests' => $anuruddhaGuests
        ]);

        // 3. Download the generated PDF
        return $pdf->download('Wedding_Guest_List.pdf');
    }
}