<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', fn() => view('auth.login'))->name('login');
Route::get('/register', fn() => view('auth.register'))->name('register');
Route::get('/forgot-password', fn() => view('auth.forgot-password'))->name('forgot');
Route::get('/reset-password', fn() => view('auth.reset-password'))->name('reset-password');
Route::get('/dashboard', fn() => view('dashboard'))->name('dashboard');
