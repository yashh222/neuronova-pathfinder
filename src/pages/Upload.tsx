import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UploadFile {
  id: string;
  name: string;
  type: 'attendance' | 'marks' | 'fees';
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
}

export default function Upload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadFile[] = Array.from(fileList).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      type: detectFileType(file.name),
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload process
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        simulateUpload(file.id);
      }, index * 500);
    });
  };

  const detectFileType = (fileName: string): 'attendance' | 'marks' | 'fees' => {
    const lower = fileName.toLowerCase();
    if (lower.includes('attendance')) return 'attendance';
    if (lower.includes('marks') || lower.includes('score') || lower.includes('grade')) return 'marks';
    if (lower.includes('fees') || lower.includes('fee') || lower.includes('payment')) return 'fees';
    return 'attendance'; // default
  };

  const simulateUpload = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, status: 'uploading' } : file
    ));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      setFiles(prev => prev.map(file => 
        file.id === fileId ? { ...file, progress: Math.min(progress, 100) } : file
      ));

      if (progress >= 100) {
        clearInterval(interval);
        setFiles(prev => prev.map(file => 
          file.id === fileId ? { ...file, status: 'success', progress: 100 } : file
        ));
        toast.success("File uploaded successfully! ✅");
      }
    }, 200);
  };

  const getFileTypeIcon = (type: string) => {
    return <FileText className="h-5 w-5" />;
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'attendance': return 'text-blue-600';
      case 'marks': return 'text-green-600';
      case 'fees': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-danger" />;
      default:
        return <UploadIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const allFilesUploaded = files.length > 0 && files.every(file => file.status === 'success');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Data Upload</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload your student data files (CSV/Excel) for attendance, marks, and fees to begin risk analysis
        </p>
      </div>

      {/* Upload Area */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadIcon className="h-5 w-5" />
            Upload Student Data Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drag & drop your files here</h3>
            <p className="text-muted-foreground mb-4">
              Supports CSV and Excel files for attendance, marks, and fees data
            </p>
            <Button
              onClick={() => document.getElementById('file-input')?.click()}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Choose Files
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Uploaded Files ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={getFileTypeColor(file.type)}>
                      {getFileTypeIcon(file.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{file.type} data</p>
                      {file.status === 'uploading' && (
                        <Progress value={file.progress} className="mt-2 h-2" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === 'uploading' && (
                      <span className="text-sm text-muted-foreground">{Math.round(file.progress)}%</span>
                    )}
                    {getStatusIcon(file.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {allFilesUploaded && (
        <Card className="mb-8 border-success bg-success/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-success mb-4" />
              <h3 className="text-lg font-semibold text-success mb-2">
                ✅ Data loaded successfully. Ready for analysis!
              </h3>
              <p className="text-muted-foreground mb-6">
                All files have been processed and validated. You can now proceed to the risk dashboard.
              </p>
              <Button
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                asChild
              >
                <a href="/dashboard">
                  View Risk Dashboard
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Preview Sample */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sample Attendance Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono bg-muted p-3 rounded">
              <div>Student_Name, Class, Date, Status</div>
              <div>Priya Sharma, 10A, 2024-01-15, Present</div>
              <div>Raj Kumar, 12B, 2024-01-15, Absent</div>
              <div>...</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sample Marks Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono bg-muted p-3 rounded">
              <div>Student_Name, Subject, Test, Marks</div>
              <div>Priya Sharma, Math, Test1, 85</div>
              <div>Raj Kumar, Science, Test1, 72</div>
              <div>...</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sample Fees Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono bg-muted p-3 rounded">
              <div>Student_Name, Month, Amount, Status</div>
              <div>Priya Sharma, Jan2024, 5000, Paid</div>
              <div>Raj Kumar, Jan2024, 5000, Overdue</div>
              <div>...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}