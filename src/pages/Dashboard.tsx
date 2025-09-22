import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, AlertTriangle, Users, TrendingUp, TrendingDown, Loader2, RefreshCw } from 'lucide-react';
import { StudentProfile } from '@/components/StudentProfile';
import { useDashboardData } from '@/hooks/useApi';
import { Student } from '@/services/api';
import { toast } from 'sonner';

// Mock fallback data for when no data is uploaded
const mockStudents: Student[] = [
  {
    id: 1,
    name: "Priya Sharma",
    class: "10th A",
    department: "Science",
    attendance: 45,
    score: 62,
    feeStatus: "Overdue",
    riskScore: 85,
    riskLevel: "high",
    lastUpdated: "2024-01-15"
  },
  {
    id: 2,
    name: "Raj Kumar",
    class: "12th B",
    department: "Commerce",
    attendance: 78,
    score: 45,
    feeStatus: "Paid",
    riskScore: 60,
    riskLevel: "medium",
    lastUpdated: "2024-01-15"
  },
  {
    id: 3,
    name: "Anita Singh",
    class: "11th A",
    department: "Arts",
    attendance: 92,
    score: 88,
    feeStatus: "Paid",
    riskScore: 15,
    riskLevel: "low",
    lastUpdated: "2024-01-15"
  }
];

export default function Dashboard() {
  const { data: dashboardData, loading, error, fetchDashboardData, refreshData } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>(mockStudents);

  // Load dashboard data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchDashboardData();
      } catch (error) {
        // If API fails, show warning and use mock data
        toast.warning('Unable to connect to backend. Showing demo data.');
        console.error('Dashboard data load failed:', error);
      }
    };
    
    loadData();
  }, [fetchDashboardData]);

  // Update students when dashboard data changes
  useEffect(() => {
    if (dashboardData?.students?.length > 0) {
      setStudents(dashboardData.students);
    } else if (!loading) {
      // Use mock data if no real data is available
      setStudents(mockStudents);
    }
  }, [dashboardData, loading]);

  // Refresh data with current filters
  const handleRefreshData = async () => {
    try {
      await refreshData({
        class_filter: classFilter !== 'all' ? classFilter : undefined,
        risk_filter: riskFilter !== 'all' ? riskFilter : undefined,
        limit: 100,
      });
      toast.success('Dashboard data refreshed successfully!');
    } catch (error) {
      // Error already handled by the hook
    }
  };

  // Filter students based on search and filters
  const filteredStudents = students
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(student => classFilter === 'all' || student.class.includes(classFilter))
    .filter(student => riskFilter === 'all' || student.riskLevel === riskFilter)
    .sort((a, b) => b.riskScore - a.riskScore); // Sort by highest risk first

  const getRiskBadge = (riskLevel: string, riskScore: number) => {
    switch (riskLevel) {
      case 'high':
        return <Badge variant="destructive">🔴 High Risk ({riskScore})</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">🟡 Medium Risk ({riskScore})</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-success text-success-foreground">🟢 Low Risk ({riskScore})</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getAttendanceTrend = (attendance: number) => {
    if (attendance >= 75) return <TrendingUp className="h-4 w-4 text-success" />;
    return <TrendingDown className="h-4 w-4 text-danger" />;
  };

  const riskStats = {
    high: students.filter(s => s.riskLevel === 'high').length,
    medium: students.filter(s => s.riskLevel === 'medium').length,
    low: students.filter(s => s.riskLevel === 'low').length
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Risk Dashboard</h1>
          <p className="text-muted-foreground">Monitor and support students before they fall behind</p>
        </div>
        <div className="flex gap-2">
          {error && (
            <Badge variant="destructive" className="text-sm">
              API Error - Using Demo Data
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={handleRefreshData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{students.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-danger" />
              <span className="text-2xl font-bold text-danger">{riskStats.high}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-warning" />
              <span className="text-2xl font-bold text-warning-foreground">{riskStats.medium}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Safe Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-success" />
              <span className="text-2xl font-bold text-success">{riskStats.low}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="9th">9th Grade</SelectItem>
                <SelectItem value="10th">10th Grade</SelectItem>
                <SelectItem value="11th">11th Grade</SelectItem>
                <SelectItem value="12th">12th Grade</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Student Risk Analysis ({filteredStudents.length} students)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Class</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Attendance</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Fee Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Risk Level</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.department}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">{student.class}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={student.attendance < 60 ? 'text-danger font-medium' : student.attendance < 75 ? 'text-warning-foreground font-medium' : 'text-success font-medium'}>
                          {student.attendance}%
                        </span>
                        {getAttendanceTrend(student.attendance)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={student.score < 50 ? 'text-danger font-medium' : student.score < 70 ? 'text-warning-foreground font-medium' : 'text-success font-medium'}>
                        {student.score}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={student.feeStatus === 'Paid' ? 'secondary' : 'destructive'}>
                        {student.feeStatus}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {getRiskBadge(student.riskLevel, student.riskScore)}
                    </td>
                    <td className="py-4 px-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            onClick={() => setSelectedStudent(student)}
                            className="hover:shadow-soft transition-all duration-200"
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Student Profile - {student.name}</DialogTitle>
                          </DialogHeader>
                          {selectedStudent && <StudentProfile student={selectedStudent} />}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}