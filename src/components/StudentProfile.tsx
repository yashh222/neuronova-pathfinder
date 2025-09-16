import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Bell, MessageSquare, Phone, Calendar, TrendingDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: number;
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

interface StudentProfileProps {
  student: Student;
}

// Mock data for charts
const attendanceData = [
  { month: 'Aug', attendance: 85 },
  { month: 'Sep', attendance: 75 },
  { month: 'Oct', attendance: 65 },
  { month: 'Nov', attendance: 55 },
  { month: 'Dec', attendance: 45 },
  { month: 'Jan', attendance: 45 }
];

const scoreData = [
  { test: 'Test 1', score: 78 },
  { test: 'Test 2', score: 72 },
  { test: 'Test 3', score: 65 },
  { test: 'Test 4', score: 62 },
  { test: 'Test 5', score: 58 },
];

const feeHistory = [
  { month: 'Aug', status: 'Paid', amount: 5000 },
  { month: 'Sep', status: 'Paid', amount: 5000 },
  { month: 'Oct', status: 'Late', amount: 5000 },
  { month: 'Nov', status: 'Overdue', amount: 5000 },
  { month: 'Dec', status: 'Overdue', amount: 5000 },
];

export function StudentProfile({ student }: StudentProfileProps) {
  const generateMentorMessage = () => {
    let message = `${student.name} needs your attention ❤️. `;
    
    if (student.attendance < 60) {
      message += `Attendance is ${student.attendance}% (critical level). `;
    }
    if (student.score < 50) {
      message += `Academic performance is declining (${student.score}%). `;
    }
    if (student.feeStatus !== 'Paid') {
      message += `Fee status: ${student.feeStatus}. `;
    }
    
    message += "Consider scheduling a counseling session to provide support and guidance.";
    
    return message;
  };

  const getTopRiskReasons = () => {
    const reasons = [];
    if (student.attendance < 60) reasons.push({ reason: 'Poor Attendance', impact: 'High', detail: `${student.attendance}% attendance rate` });
    if (student.score < 50) reasons.push({ reason: 'Declining Grades', impact: 'High', detail: `${student.score}% average score` });
    if (student.feeStatus !== 'Paid') reasons.push({ reason: 'Fee Issues', impact: 'Medium', detail: `Status: ${student.feeStatus}` });
    
    return reasons.slice(0, 2);
  };

  const handleNotifyMentor = () => {
    toast.success("Mentor notification sent successfully! 📧");
  };

  const handleNotifyParent = () => {
    toast.success("Parent notification sent successfully! 📱");
  };

  return (
    <div className="space-y-6">
      {/* Student Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">{student.name}</h3>
          <p className="text-muted-foreground">{student.class} • {student.department}</p>
        </div>
        <div className="text-right">
          <Badge 
            variant={student.riskLevel === 'high' ? 'destructive' : student.riskLevel === 'medium' ? 'secondary' : 'secondary'}
            className={student.riskLevel === 'medium' ? 'bg-warning text-warning-foreground' : student.riskLevel === 'low' ? 'bg-success text-success-foreground' : ''}
          >
            Risk Score: {student.riskScore}
          </Badge>
          <p className="text-sm text-muted-foreground mt-1">Last updated: {student.lastUpdated}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{student.attendance}%</span>
                <TrendingDown className="h-4 w-4 text-danger" />
              </div>
              <Progress value={student.attendance} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {student.attendance < 60 ? 'Critical - Immediate attention needed' : 'Below target'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Academic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{student.score}%</span>
                <TrendingDown className="h-4 w-4 text-danger" />
              </div>
              <Progress value={student.score} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {student.score < 50 ? 'Needs improvement' : 'Average performance'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Fee Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant={student.feeStatus === 'Paid' ? 'secondary' : 'destructive'} className="text-lg">
                {student.feeStatus}
              </Badge>
              <p className="text-xs text-muted-foreground">
                {student.feeStatus === 'Paid' ? 'All dues cleared' : 'Payment pending - may affect access'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Attendance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Test Score History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="score" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Top Risk Factors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getTopRiskReasons().map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">{risk.reason}</h4>
                  <p className="text-sm text-muted-foreground">{risk.detail}</p>
                </div>
                <Badge variant={risk.impact === 'High' ? 'destructive' : 'secondary'}>
                  {risk.impact} Impact
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI-Generated Mentor Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI-Generated Mentor Guidance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
            <p className="text-foreground leading-relaxed">{generateMentorMessage()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleNotifyMentor}
          className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          <Bell className="mr-2 h-4 w-4" />
          Notify Mentor
        </Button>
        <Button 
          onClick={handleNotifyParent}
          variant="outline"
          className="flex-1"
        >
          <Phone className="mr-2 h-4 w-4" />
          Notify Parent
        </Button>
      </div>
    </div>
  );
}