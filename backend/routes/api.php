<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\FieldController;
use App\Http\Controllers\ResponseController;
use App\Http\Controllers\PublicFormController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/public/forms/{form}', [PublicFormController::class, 'show']);
Route::post('/public/forms/{form}/submit', [PublicFormController::class, 'submit']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Form routes
    Route::apiResource('forms', FormController::class);

    // Field routes
    Route::get('/forms/{form}/fields', [FieldController::class, 'index']);
    Route::post('/forms/{form}/fields', [FieldController::class, 'store']);
    Route::put('/fields/{field}', [FieldController::class, 'update']);
    Route::delete('/fields/{field}', [FieldController::class, 'destroy']);
    Route::post('/forms/{form}/fields/reorder', [FieldController::class, 'reorder']);

    // Response routes
    Route::get('/responses', [ResponseController::class, 'index']);
    Route::get('/forms/{form}/responses', [ResponseController::class, 'index']);
    Route::get('/responses/{response}', [ResponseController::class, 'show']);
    Route::delete('/responses/{response}', [ResponseController::class, 'destroy']);
    Route::get('/forms/{form}/responses/export', [ResponseController::class, 'export']);
});
