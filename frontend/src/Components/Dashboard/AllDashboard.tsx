import { useState, useEffect } from "react";


import { Users, Building2 } from "lucide-react";
import { useGetData } from "../HTTP/GET";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";




export default function ResponsiveLabDashboard() {
  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : { name: 'User', role: '' };

  const [staffCount, setStaffCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);

  useGetData({
    endpoint: "/api/dashboard",
    params: {
      queryKey: ["dashboard"],
      onSuccess: (data: any) => {
        if (data.status) {
          const { staff_summary } = data.data;
          setStaffCount(staff_summary.total_staff);
          setCompanyCount(staff_summary.company_count);
        }
      },
      onError: (error: any) => {
        console.error("Error fetching dashboard data:", error);
      },
    },
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="flex h-screen ">
      {/* Sidebar for larger screens */}
      {/* <Sidebar className="hidden md:block w-64 shadow-md" /> */}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome, {currentUser.name} 
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <>
            <Card className="bg-accent/40 transition-shadow duration-200 ease-in-out hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Staff Count
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{staffCount}</div>
              </CardContent>
            </Card>

            <Card className="bg-accent/40 transition-shadow duration-200 ease-in-out hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Company Count</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companyCount}</div>
              </CardContent>
            </Card>
          </>
        </div>


      </main>
    </div>
  );
}
