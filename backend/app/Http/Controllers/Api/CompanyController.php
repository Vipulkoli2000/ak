<?php

namespace App\Http\Controllers\Api;

use App\Models\company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\CompanyResource;
use App\Http\Controllers\Api\BaseController;

class CompanyController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
       
    
        // Build the base query.
        $query = company::query();

        // If there's a search term, apply additional filtering.
        if ($searchTerm = $request->query('search')) {
            $query->where('company_name', 'like', '%' . $searchTerm . '%');
        }

        // Paginate the results.
        $company = $query->paginate(7);
    
        // Return the paginated response with staff resources.
        return $this->sendResponse(
            [
                "Company" => CompanyResource::collection($company),
                'Pagination' => [
                    'current_page' => $company->currentPage(),
                    'last_page'    => $company->lastPage(),
                    'per_page'     => $company->perPage(),
                    'total'        => $company->total(),
                ]
            ],
            "Company retrieved successfully"
        );
    }


    public function store(Request $request): JsonResponse
    {
        // Create a new staff record and assign the institute_id from the logged-in admin
        $company = new company();
         $company->company_name = $request->input('company_name');
        $company->street_address = $request->input('street_address');
        $company->area = $request->input('area');
        $company->city = $request->input('city');
        $company->state = $request->input('state');
        $company->pincode = $request->input('pincode');
        $company->country = $request->input('country');
        $company->type_of_company = $request->input('type_of_company');
        $company->other_type_of_company = $request->input('other_type_of_company');
        $company->contact_person = $request->input('contact_person');
        $company->contact_email = $request->input('contact_email');
        $company->contact_mobile = $request->input('contact_mobile');
         $company->save();
        
        return $this->sendResponse([new CompanyResource($company)], "Company stored successfully");
    }


    public function show(string $id): JsonResponse
    {
        $company = Company::find($id);

        if(!$company){
            return $this->sendError("Company not found", ['error'=>'Company not found']);
        }

  
        return $this->sendResponse([ "Company" => new CompanyResource($company) ], "Company retrived successfully");
    }


    public function update(Request $request, string $id): JsonResponse
    {
 
        $company = company::find($id);

        if(!$company){
            return $this->sendError("Company not found", ['error'=>'Company not found']);
        }
       
                       
         $company->company_name = $request->input('company_name');
        $company->street_address = $request->input('street_address');
        $company->area = $request->input('area');
        $company->city = $request->input('city');
        $company->state = $request->input('state');
        $company->pincode = $request->input('pincode');
        $company->country = $request->input('country');
        $company->type_of_company = $request->input('type_of_company');
        $company->other_type_of_company = $request->input('other_type_of_company');
        $company->contact_person = $request->input('contact_person');
        $company->contact_email = $request->input('contact_email');
        $company->contact_mobile = $request->input('contact_mobile');
           
        $company->save();
       
        return $this->sendResponse([ new CompanyResource($company)], "Company updated successfully");

    }


    public function destroy(string $id): JsonResponse
    {
        $company = company::find($id);
        if(!$company){
            return $this->sendError("Company not found", ['error'=> 'Company not found']);
        }
         $company->delete();
         return $this->sendResponse([], "Company deleted successfully");
    }

    public function allCompany(): JsonResponse
    {
      
        // Retrieve all companies.
        $company = company::all();
    
        return $this->sendResponse(
            ["Company" => CompanyResource::collection($company)],
            "Company retrieved successfully"
        );
    }
}
