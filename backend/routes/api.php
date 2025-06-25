<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\DashboardController; 


 

Route::post('/login', [UserController::class, 'login']);


Route::group(['middleware'=>['auth:sanctum', 'permission','request.null']], function(){
   
  
   Route::resource('staff', StaffController::class);  
   Route::get('/all_staff', [StaffController::class, 'allStaffs'])->name("staffs.all");

   Route::resource('companies', CompanyController::class);  
   Route::get('/all_companies', [CompanyController::class, 'allCompany'])->name("companys.all");
 

   // Dashboard route
   Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.data');

   


});

 

 
 

 
 

 
 