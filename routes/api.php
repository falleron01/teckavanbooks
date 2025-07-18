<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LivroController;

Route::apiResource('livros', LivroController::class);