import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Download, TrendingUp, Users, AlertTriangle, Target } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for charts
const riskDistribution = [
  { name: 'Low Risk', value: 65, color: 'hsl(var(--success))' },
  { name: 'Medium Risk', value: 20, color: 'hsl(var(--warning))' },
  { name: 'High Risk', value: 15, color: 'hsl(var(--danger))' }
];

const classRiskData = [
  { class: '9th A', high: 2, medium: 3, low: 15 },
  { class: '9th B', high: 1, medium: 4, low: 18 },
  { class: '10th A', high: 3, medium: 2, low: 12 },
  { class: '10th B', high: 2, medium: 5, low: 14 },
  { class: '11th A', high: 4, medium: 3, low: 13 },
  { class: '11th B', high: 1, medium: 2, low: 19 },
  { class: '12th A', high: 2, medium: 1, low: 16 },
  { class: '12th B', high: 0, medium: 0, low: 22 }
];

const departmentRiskData = [
  { department: 'Science', total: 45, high: 8, medium: 12, low: 25 },
  { department: 'Commerce', total: 35, high: 4, medium: 6, low: 25 },
  { department: 'Arts', total: 28, high: 3, medium: 2, low: 23 }
];

const monthlyTrends = [
  { month: 'Aug', highRisk: 12, mediumRisk: 18, lowRisk: 70 },
  { month: 'Sep', highRisk: 14, mediumRisk: 20, lowRisk: 66 },
  { month: 'Oct', highRisk: 16, mediumRisk: 22, lowRisk: 62 },
  { month: 'Nov', highRisk: 18, mediumRisk: 20, lowRisk: 62 },
  { month: 'Dec', highRisk: 15, mediumRisk: 20, lowRisk: 65 },
  { month: 'Jan', highRisk: 15, mediumRisk: 20, lowRisk: 65 }
];

const COLORS = {
  high: 'hsl(var(--danger))',
  medium: 'hsl(var(--warning))',
  low: 'hsl(var(--success))'
};

export default function Insights() {
  const handleDownloadReport = () => {
    toast.success("Report download started! 📊");
  };

  const totalStudents = riskDistribution.reduce((sum, item) => sum + item.value, 0);
  const safeZonePercentage = Math.round((riskDistribution[0].value / totalStudents) * 100);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Risk Analysis Insights</h1>
        <p className="text-muted-foreground">Comprehensive overview of student risk patterns and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Safe Zone Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-success">{safeZonePercentage}%</span>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              🎯 {riskDistribution[0].value} students are in Green Zone — keep going!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold">{totalStudents}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all classes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-danger/10 to-danger/5 border-danger/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
              <span className="text-3xl font-bold text-danger">{riskDistribution[2].value}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Needs immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-warning" />
              <span className="text-3xl font-bold text-warning-foreground">{riskDistribution[1].value}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Monitor closely</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-4">
              {riskDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Risk Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Analysis by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentRiskData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="high" stackId="a" fill={COLORS.high} name="High Risk" />
                <Bar dataKey="medium" stackId="a" fill={COLORS.medium} name="Medium Risk" />
                <Bar dataKey="low" stackId="a" fill={COLORS.low} name="Low Risk" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Class-wise Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Count per Class</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classRiskData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="high" stackId="a" fill={COLORS.high} name="High Risk" />
                <Bar dataKey="medium" stackId="a" fill={COLORS.medium} name="Medium Risk" />
                <Bar dataKey="low" stackId="a" fill={COLORS.low} name="Low Risk" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="highRisk" 
                  stroke={COLORS.high} 
                  strokeWidth={2}
                  name="High Risk"
                />
                <Line 
                  type="monotone" 
                  dataKey="mediumRisk" 
                  stroke={COLORS.medium} 
                  strokeWidth={2}
                  name="Medium Risk"
                />
                <Line 
                  type="monotone" 
                  dataKey="lowRisk" 
                  stroke={COLORS.low} 
                  strokeWidth={2}
                  name="Low Risk"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <h4 className="font-semibold text-success mb-2">✅ Positive Trends</h4>
                <ul className="text-sm space-y-1 text-foreground">
                  <li>• 85% of students are in the safe zone</li>
                  <li>• Arts department shows lowest risk levels</li>
                  <li>• 12th B has zero high-risk students</li>
                </ul>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">💡 Opportunities</h4>
                <ul className="text-sm space-y-1 text-foreground">
                  <li>• Focus mentor resources on Science dept</li>
                  <li>• Implement peer support in 11th A</li>
                  <li>• Share best practices from 12th B</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-danger/10 rounded-lg border border-danger/20">
                <h4 className="font-semibold text-danger mb-2">⚠️ Areas of Concern</h4>
                <ul className="text-sm space-y-1 text-foreground">
                  <li>• 11th A has highest risk concentration</li>
                  <li>• Science department needs attention</li>
                  <li>• Risk levels stable but not improving</li>
                </ul>
              </div>
              
              <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                <h4 className="font-semibold text-warning-foreground mb-2">📋 Action Items</h4>
                <ul className="text-sm space-y-1 text-foreground">
                  <li>• Schedule counseling for high-risk students</li>
                  <li>• Increase parent engagement initiatives</li>
                  <li>• Deploy targeted intervention programs</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleDownloadReport}
              className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Full Report (PDF)
            </Button>
            <Button 
              onClick={handleDownloadReport}
              variant="outline" 
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data (CSV)
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Reports include detailed analytics, student lists, and actionable insights for stakeholders.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}