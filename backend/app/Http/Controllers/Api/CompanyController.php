<?php

namespace App\Http\Controllers\Api;

use App\Models\company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\CompanyResource;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Validator;
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

    public function importCompany(Request $request): JsonResponse
    {
        // Validate the uploaded file
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);
    
        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }
    
        try {
            $file = $request->file('file');
            $spreadsheet = IOFactory::load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();
            
            if (empty($rows) || count($rows) < 2) {
                return $this->sendError('Import Error', ['error' => 'The uploaded file is empty or does not contain any data rows.'], 422);
            }
            
            // Get header row and map column indices
            $headers = array_map('trim', $rows[0]);
            $columnMap = [
                'company_name'    => array_search('Company Name', $headers),
                'type_of_company' => array_search('Type Of Company', $headers),
                'street_address'  => array_search('Street Address', $headers),
                'state'           => array_search('State', $headers),
                'pincode'         => array_search('Pincode', $headers),
                'contact_person'  => array_search('Contact Person', $headers),
                'contact_mobile'  => array_search('Contact Mobile', $headers),
            ];
    
            // Validate that all required columns are present
            foreach ($columnMap as $key => $index) {
                if ($index === false) {
                    // Create a user-friendly column name
                    $friendlyKey = ucwords(str_replace('_', ' ', $key));
                    return $this->sendError('Import Error', ['error' => "Required column '{$friendlyKey}' not found in the uploaded file."], 422);
                }
            }
    
            // Skip header row
            $dataRows = array_slice($rows, 1);
            
            $importCount = 0;
            $errors = [];
            $errorRows = [];
    
            foreach ($dataRows as $index => $row) {
                $rowNum = $index + 2; // +2 because of 1-indexing and header row
    
                // Skip empty rows (a row is considered empty if all its cells are empty)
                if (empty(array_filter($row))) {
                    continue;
                }
                
                try {
                    // Create new company
                    $company = new Company();
                    $company->company_name = trim($row[$columnMap['company_name']]);
                    $company->type_of_company = trim($row[$columnMap['type_of_company']]);
                    $company->street_address = trim($row[$columnMap['street_address']]);
                    $company->state = trim($row[$columnMap['state']]);
                    $company->pincode = trim($row[$columnMap['pincode']]);
                    $company->contact_person = trim($row[$columnMap['contact_person']]);
                    $company->contact_mobile = trim($row[$columnMap['contact_mobile']]);
                                        $company->save();
                    
                    $importCount++;
                } catch (\Exception $e) {
                    $errors[] = 'Row ' . $rowNum . ': ' . $e->getMessage();
                    $errorRows[] = $rowNum;
                }
            }
            
            $message = "Successfully imported {$importCount} companies";
            $response = ['count' => $importCount];
            
            if (!empty($errors)) {
                $response['errors'] = $errors;
                $response['errorRows'] = $errorRows;
                if ($importCount == 0) {
                    $message = "No companies were imported. Please check the errors.";
                } else {
                    $message = "Imported {$importCount} companies with some errors.";
                }
            }
            
            return $this->sendResponse($response, $message);
            
        } catch (\Exception $e) {
            return $this->sendError('Import Error', ['error' => $e->getMessage()], 500);
        }
    }

     /**
     * Download the student import template Excel file.
     */
    public function downloadTemplate()
    {
        // Path to the template located in backend/excel/students.xlsx
        $filePath = base_path('excel/company.xlsx');

        if (!file_exists($filePath)) {
            return $this->sendError('File not found', ['error' => 'Template not found'], 404);
        }

        // Return the file as a download response
        return response()->download(
            $filePath,
            'company_template.xlsx',
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]
        );
    }

}
