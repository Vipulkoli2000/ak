import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Users, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaveApplication {
  id: number;
  staff_name?: string;
  from_date: string;
  to_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks: string;
  approved_by: string;
  approved_at: string;
}

interface Event {
  id: any; // Or more specific type if known
  [key: string]: any; // Allow other properties
}

interface Task {
  id: any;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  // Add other task-specific fields if needed
}

interface Complaint {
  id: any;
  institute_id: number;
  institute_name: string;
  complaint_date: string;
  complainant_name: string; 
  nature_of_complaint: string; 
  description?: string;
  created_at?: string; 
}

interface Meeting {
  id: number;
  venue: string;
  synopsis: string;
  date: string;
  time: string;
}

interface Memo {
  id: any; 
  memo_subject: string; // Changed from title
  memo_description?: string; // Added description
  created_at: string; 
}

interface StaffBirthday {
  id: any; 
  name: string;
  date_of_birth: string; // Formatted as "Mon DD"
}

interface TodaysSyllabusProgress {
  subject_name: string;
  course_name?: string;
  semester_name?: string;
  completed_percentage: number;
  remarks?: string;
}

interface SupervisionDuty {
  id: number;
  exam_name: string;
  date: string;
  exam_time: string;
  course_name: string;
  subject_name: string;
}

export default function ResponsiveLabDashboard() {
  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : { name: 'User', role: '' };
  const userRole = currentUser.role;

  const [myLeads, setMyLeads] = useState(0);
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [combinedCalendarItems, setCombinedCalendarItems] = useState<any[]>([]);
  const [tasksData, setTasksData] = useState<Task[]>([]);
  const [complaintsData, setComplaintsData] = useState<Complaint[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveApplication[]>([]);
  const [openLeadsCount, setOpenLeadsCount] = useState(0);
  const [memosData, setMemosData] = useState<Memo[]>([]);
  const [upcomingBirthdaysData, setUpcomingBirthdaysData] = useState<StaffBirthday[]>([]);
  const [todaysSyllabusProgress, setTodaysSyllabusProgress] = useState<TodaysSyllabusProgress[]>([]);
  const [supervisionDuties] = useState<SupervisionDuty[]>([
    { id: 1, exam_name: 'Mid Semester', subject_name: 'Mathematics', course_name: 'BSc', date: '2025-07-01', exam_time: '10:00 AM' },
    { id: 2, exam_name: 'Final Exam', subject_name: 'Physics', course_name: 'BSc', date: '2025-08-10', exam_time: '1:00 PM' },
  ]);
  const [staffList, setStaffList] = useState<{ id: number; staff_name: string }[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

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
                <div className="text-2xl font-bold">11</div>
              </CardContent>
            </Card>

            <Card className="bg-accent/40 transition-shadow duration-200 ease-in-out hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Number of Interest Shown</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
              </CardContent>
            </Card>
          </>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-4 mb-3">
          {userRole === 'teachingstaff' && supervisionDuties.length > 0 && (
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>My Supervision Duties</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supervisionDuties.slice(0, 5).map((duty) => (
                      <TableRow key={duty.id}>
                        <TableCell>{duty.exam_name}</TableCell>
                        <TableCell>{duty.subject_name}</TableCell>
                        <TableCell>{duty.exam_time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {supervisionDuties.length > 5 && (
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => navigate({ to: "/displaytimetable" })}
                      className="text-xs hover:text-blue-500"
                    >
                      Show More...
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
