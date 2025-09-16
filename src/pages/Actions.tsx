import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  Clock, 
  Phone, 
  MessageSquare, 
  Calendar, 
  User, 
  Trophy,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface Action {
  id: string;
  studentName: string;
  studentClass: string;
  actionType: 'counseling' | 'parent_call' | 'meeting' | 'follow_up';
  status: 'pending' | 'in_progress' | 'completed';
  description: string;
  assignedTo: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

// Mock action data
const initialActions: Action[] = [
  {
    id: '1',
    studentName: 'Priya Sharma',
    studentClass: '10th A',
    actionType: 'counseling',
    status: 'pending',
    description: 'Schedule counseling session for declining attendance and grades',
    assignedTo: 'Mrs. Gupta',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    studentName: 'Raj Kumar',
    studentClass: '12th B',
    actionType: 'parent_call',
    status: 'in_progress',
    description: 'Contact parents about academic performance concerns',
    assignedTo: 'Mr. Singh',
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    studentName: 'Arjun Patel',
    studentClass: '9th C',
    actionType: 'meeting',
    status: 'completed',
    description: 'Parent-teacher meeting conducted',
    assignedTo: 'Ms. Reddy',
    createdAt: '2024-01-13',
    completedAt: '2024-01-15',
    notes: 'Parents committed to supervising homework. Follow up in 2 weeks.'
  }
];

export default function Actions() {
  const [actions, setActions] = useState<Action[]>(initialActions);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAction, setNewAction] = useState({
    studentName: '',
    actionType: 'counseling',
    description: '',
    assignedTo: ''
  });

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'counseling': return <MessageSquare className="h-4 w-4" />;
      case 'parent_call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'follow_up': return <Clock className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-warning-foreground bg-warning/10 border-warning">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-primary bg-primary/10 border-primary">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-success bg-success/10 border-success">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const markActionCompleted = (actionId: string, notes: string) => {
    setActions(prev => prev.map(action => 
      action.id === actionId 
        ? { ...action, status: 'completed', completedAt: new Date().toISOString().split('T')[0], notes }
        : action
    ));
    
    // Show congratulatory message
    toast.success("🎉 Great job! Action completed successfully. The student's dashboard status has been updated.", {
      description: "Your dedication makes a difference in students' lives!"
    });
  };

  const addNewAction = () => {
    if (!newAction.studentName || !newAction.description || !newAction.assignedTo) {
      toast.error("Please fill in all required fields");
      return;
    }

    const action: Action = {
      id: Date.now().toString(),
      studentName: newAction.studentName,
      studentClass: '10th A', // Default for demo
      actionType: newAction.actionType as any,
      status: 'pending',
      description: newAction.description,
      assignedTo: newAction.assignedTo,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setActions(prev => [action, ...prev]);
    setNewAction({ studentName: '', actionType: 'counseling', description: '', assignedTo: '' });
    setShowAddDialog(false);
    toast.success("New action created successfully! 📝");
  };

  const filteredActions = actions.filter(action => 
    filter === 'all' || action.status === filter
  );

  const completedCount = actions.filter(a => a.status === 'completed').length;
  const pendingCount = actions.filter(a => a.status === 'pending').length;
  const inProgressCount = actions.filter(a => a.status === 'in_progress').length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mentor Action Log</h1>
        <p className="text-muted-foreground">Track and manage intervention actions for at-risk students</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{actions.length}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-2xl font-bold text-warning-foreground">{pendingCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-primary" />
              <span className="text-2xl font-bold">{inProgressCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-2xl font-bold text-success">{completedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {(['all', 'pending', 'in_progress', 'completed'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
              className={filter === status ? "bg-gradient-primary" : ""}
            >
              {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          ))}
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Add Action
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Action</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Student Name</label>
                <Input
                  value={newAction.studentName}
                  onChange={(e) => setNewAction(prev => ({ ...prev, studentName: e.target.value }))}
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Action Type</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newAction.actionType}
                  onChange={(e) => setNewAction(prev => ({ ...prev, actionType: e.target.value }))}
                >
                  <option value="counseling">Counseling Session</option>
                  <option value="parent_call">Parent Call</option>
                  <option value="meeting">Parent Meeting</option>
                  <option value="follow_up">Follow Up</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newAction.description}
                  onChange={(e) => setNewAction(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the action to be taken"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Assigned To</label>
                <Input
                  value={newAction.assignedTo}
                  onChange={(e) => setNewAction(prev => ({ ...prev, assignedTo: e.target.value }))}
                  placeholder="Mentor/Teacher name"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={addNewAction} className="flex-1">Create Action</Button>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Actions List */}
      <div className="space-y-4">
        {filteredActions.map((action) => (
          <Card key={action.id} className="hover:shadow-soft transition-all duration-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getActionIcon(action.actionType)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{action.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{action.studentClass}</p>
                    </div>
                    {getStatusBadge(action.status)}
                  </div>
                  
                  <p className="text-sm mb-3">{action.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Assigned to: {action.assignedTo}</span>
                    <span>Created: {action.createdAt}</span>
                    {action.completedAt && <span>Completed: {action.completedAt}</span>}
                  </div>
                  
                  {action.notes && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-sm"><strong>Notes:</strong> {action.notes}</p>
                    </div>
                  )}
                </div>
                
                {action.status !== 'completed' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        Mark Complete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Complete Action</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>Mark this action as completed for <strong>{action.studentName}</strong>?</p>
                        <Textarea 
                          placeholder="Add completion notes (optional)"
                          id={`notes-${action.id}`}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              const notes = (document.getElementById(`notes-${action.id}`) as HTMLTextAreaElement)?.value || '';
                              markActionCompleted(action.id, notes);
                            }}
                            className="flex-1 bg-gradient-success"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Complete Action
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActions.length === 0 && (
        <Card>
          <CardContent className="pt-8 pb-8 text-center">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No {filter !== 'all' ? filter : ''} actions found.</p>
            {filter !== 'all' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFilter('all')}
                className="mt-2"
              >
                View All Actions
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}