import { useCallback } from "react";
import Papa from "papaparse";
import { Upload, FileSpreadsheet, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types/certificate";
import { toast } from "sonner";

interface CSVUploadProps {
  onDataLoaded: (students: Student[]) => void;
  students: Student[];
}

export const CSVUpload = ({ onDataLoaded, students }: CSVUploadProps) => {
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as Record<string, string>[];
          
          const firstRow = data[0];
          if (!firstRow) {
            toast.error("CSV file is empty");
            return;
          }

          const keys = Object.keys(firstRow);
          const nameKey = keys.find(
            (k) =>
              k.toLowerCase().includes("name") &&
              !k.toLowerCase().includes("reg")
          ) || keys[0];
          const regKey = keys.find(
            (k) =>
              k.toLowerCase().includes("reg") ||
              k.toLowerCase().includes("number") ||
              k.toLowerCase().includes("id")
          ) || keys[1];

          if (!nameKey || !regKey) {
            toast.error("Could not find Name and Registration Number columns");
            return;
          }

          const students: Student[] = data.map((row) => ({
            name: row[nameKey] || "",
            registrationNumber: row[regKey] || "",
          })).filter(s => s.name && s.registrationNumber);

          if (students.length === 0) {
            toast.error("No valid student data found");
            return;
          }

          onDataLoaded(students);
          toast.success(`Loaded ${students.length} students`);
        },
        error: (error) => {
          toast.error(`Error parsing CSV: ${error.message}`);
        },
      });
    },
    [onDataLoaded]
  );

  return (
    <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          Student Data
        </CardTitle>
        <CardDescription>
          Upload CSV with Name and Registration Number
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <label className="group flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border/50 rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 hover:border-primary/50 transition-all duration-200">
            <div className="flex flex-col items-center justify-center py-4">
              <Upload className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Upload CSV</span>
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </label>

          {students.length > 0 && (
            <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50">
              <div className="p-3 bg-primary/5 border-b border-border/50 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">
                  {students.length} students
                </p>
              </div>
              <div className="max-h-32 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Reg. No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 4).map((student, idx) => (
                      <tr key={idx} className="border-t border-border/30">
                        <td className="px-3 py-2 text-foreground">{student.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{student.registrationNumber}</td>
                      </tr>
                    ))}
                    {students.length > 4 && (
                      <tr className="border-t border-border/30">
                        <td colSpan={2} className="px-3 py-2 text-muted-foreground text-center text-xs">
                          +{students.length - 4} more
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
