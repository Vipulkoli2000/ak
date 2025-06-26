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

      // Company custom routes (keep before resource to avoid conflict)
   Route::post('/companies/importCompany', [CompanyController::class, 'importCompany'])->name('companies.import');
   Route::get('/companies/download-template', [CompanyController::class, 'downloadTemplate'])->name('companies.download-template');
   Route::get('/all_companies', [CompanyController::class, 'allCompany'])->name("companys.all");
   // Company resource routes
   Route::resource('companies', CompanyController::class);
 

   // Dashboard route
   Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.data');

   


});

 

 
 

 
 

 
 