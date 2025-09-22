import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, AlertTriangle, Users, TrendingUp, TrendingDown, Loader2, RefreshCw } from 'lucide-react';
import { StudentProfile } from '@/components/StudentProfile';
import { toast } from 'sonner';

export interface Student {
  id: string; // ensure string
  name: string;
  class: string;
  department: string;
  attendance: number;
  score: number;
  feeStatus: string;
  riskScore: number;
  riskLevel: string;
  lastUpdated: string;
}

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Fetch students from API
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/students');
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      // Ensure id is string
      const formattedStudents: Student[] = data.students.map((s: any) => ({
        ...s,
        id: String(s.id),
      }));
      setStudents(formattedStudents);
      setError(false);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      toast.warning('Unable to fetch API. Showing empty dashboard.');
      setError(true);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const riskStats = {
    high: students.filter(s => s.riskLevel === 'high').length,
    medium: students.filter(s => s.riskLevel === 'medium').length,
    low: students.filter(s => s.riskLevel === 'low').length,
  };

  const getRiskBadge = (riskLevel: string, riskScore: number) => {
    switch (riskLevel) {
      case 'high':
        return <Badge variant="destructive">🔴 High ({riskScore})</Badge>;
      case 'medium':
        return <Badge variant="secondary">🟡 Medium ({riskScore})</Badge>;
      case 'low':
        return <Badge variant="default">🟢 Low ({riskScore})</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getAttendanceTrend = (attendance: number) =>
    attendance >= 75 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />;

  const filteredStudents = students
    .filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(s => classFilter === 'all' || s.class.includes(classFilter))
    .filter(s => riskFilter === 'all' || s.riskLevel === riskFilter)
    .sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Student Risk Dashboard</h1>
          <p className="text-muted-foreground">Monitor and support students before they fall behind</p>
        </div>
        <div className="flex gap-2">
          {error && <Badge variant="destructive" className="text-sm">API Error</Badge>}
          <Button variant="outline" onClick={fetchStudents} disabled={loading} className="flex items-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Total Students</CardTitle></CardHeader>
          <CardContent><Users className="h-4 w-4" /> {students.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>High Risk</CardTitle></CardHeader>
          <CardContent><AlertTriangle className="h-4 w-4 text-red-600" /> {riskStats.high}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Medium Risk</CardTitle></CardHeader>
          <CardContent>{riskStats.medium}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Low Risk</CardTitle></CardHeader>
          <CardContent>{riskStats.low}</CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
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
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" /> Student Risk Analysis ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Attendance</th>
                  <th>Score</th>
                  <th>Fee Status</th>
                  <th>Risk Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-100">
                    <td>{student.name}</td>
                    <td>{student.class}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={student.attendance < 60 ? 'text-red-600' : student.attendance < 75 ? 'text-yellow-600' : 'text-green-600'}>
                          {student.attendance}%
                        </span>
                        {getAttendanceTrend(student.attendance)}
                      </div>
                    </td>
                    <td className={student.score < 50 ? 'text-red-600' : student.score < 70 ? 'text-yellow-600' : 'text-green-600'}>
                      {student.score}
                    </td>
                    <td>
                      <Badge variant={student.feeStatus === 'Paid' ? 'secondary' : 'destructive'}>
                        {student.feeStatus}
                      </Badge>
                    </td>
                    <td>{getRiskBadge(student.riskLevel, student.riskScore)}</td>
                    <td>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedStudent(student)}>View Details</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Student Profile - {selectedStudent?.name}</DialogTitle>
                          </DialogHeader>
                          {selectedStudent && <StudentProfile student={selectedStudent} />}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No students found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
