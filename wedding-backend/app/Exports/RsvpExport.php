<?php

namespace App\Exports;

use App\Models\Rsvp;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class RsvpExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        // Select exactly which columns we want in the Excel file
        return Rsvp::select('id', 'name', 'phone', 'side', 'attending', 'message', 'created_at')->get();
    }

    /**
     * Define the column headers for the Excel file
     */
    public function headings(): array
    {
        return [
            'ID',
            'Full Name',
            'Phone / WhatsApp',
            'Side',
            'Attending?',
            'Special Message',
            'Date Submitted'
        ];
    }
}