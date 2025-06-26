<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Staff;
use App\Models\Company;
 
use Carbon\Carbon;    // For date calculations
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Fetch consolidated data for the dashboard.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user || !$user->staff) {
                return response()->json([
                    'status' => false,
                    'message' => 'User or staff details not found. Unable to load dashboard data.'
                ], 401); 
            }
            $staff = Staff::all();

            return response()->json([
                'status' => true,
                'data' => [
                    'staff_summary' => [
                        'total_staff' => $staff->count(),
                        'company_count' => Company::count()
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            
            return response()->json([
                'status' => false,
                'message' => 'Error fetching dashboard data.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
