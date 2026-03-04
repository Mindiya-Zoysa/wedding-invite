<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RsvpController;

Route::post('/rsvp', [RsvpController::class, 'store']);
Route::get('/rsvp/export', [RsvpController::class, 'export']);