<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rsvp extends Model
{
    use HasFactory;

    // Allow mass assignment for these columns
    protected $fillable = ['name', 'phone', 'side', 'attending', 'message'];
}