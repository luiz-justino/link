<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();
Route::post('/loginWithCertificate', 'Auth\LoginController@loginWithCertificate')->middleware('auth');
Route::get('/home', 'HomeController@index')->middleware('has_permission')->name('home');
Route::get('/', 'HomeController@indexPage')->middleware('has_permission')->name('index');
Route::get('/logout', 'Auth\LoginController@logout')->name('logout');
