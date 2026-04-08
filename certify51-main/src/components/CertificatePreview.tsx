import { forwardRef, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Move } from "lucide-react";
import { Student, CertificateConfig } from "@/types/certificate";

interface CertificatePreviewProps {
  templateUrl: string | null;
  students: Student[];
  config: CertificateConfig;
  selectedIndex: number;
  onSelectStudent: (index: number) => void;
  onConfigChange: (config: CertificateConfig) => void;
}

export const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(
  ({ templateUrl, students, config, selectedIndex, onSelectStudent, onConfigChange }, ref) => {
    const currentStudent = students[selectedIndex];
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<"name" | "reg" | null>(null);

    const handleMouseDown = useCallback((type: "name" | "reg") => (e: React.MouseEvent) => {
      e.preventDefault();
      setDragging(type);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (!dragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.max(5, Math.min(95, x));
      const clampedY = Math.max(5, Math.min(95, y));

      if (dragging === "name") {
        onConfigChange({
          ...config,
          namePosition: { ...config.namePosition, x: clampedX, y: clampedY },
        });
      } else {
        onConfigChange({
          ...config,
          regNumberPosition: { ...config.regNumberPosition, x: clampedX, y: clampedY },
        });
      }
    }, [dragging, config, onConfigChange]);

    const handleMouseUp = useCallback(() => {
      setDragging(null);
    }, []);

    if (!templateUrl) {
      return (
        <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-primary" />
              Preview
            </CardTitle>
            <CardDescription>
              Upload a template to see the preview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-[1.414/1] rounded-xl bg-muted/30 flex items-center justify-center border-2 border-dashed border-border/50">
              <p className="text-muted-foreground text-sm">No template uploaded</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-primary" />
              Preview
            </CardTitle>
            {students.length > 0 && (
              <Select
                value={selectedIndex.toString()}
                onValueChange={(v) => onSelectStudent(parseInt(v))}
              >
                <SelectTrigger className="w-48 h-9 bg-background/50">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <CardDescription className="flex items-center gap-2">
            <Move className="h-4 w-4" />
            Drag text to position on certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            ref={containerRef}
            className="relative aspect-[1.414/1] rounded-xl overflow-hidden border shadow-inner bg-card select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={templateUrl}
              alt="Certificate template"
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
            {currentStudent && (
              <>
                <div
                  onMouseDown={handleMouseDown("name")}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap cursor-move transition-all duration-75 rounded px-2 py-1 ${
                    dragging === "name" 
                      ? "ring-2 ring-primary ring-offset-2 scale-105 bg-primary/10" 
                      : "hover:ring-2 hover:ring-primary/50 hover:bg-primary/5"
                  }`}
                  style={{
                    left: `${config.namePosition.x}%`,
                    top: `${config.namePosition.y}%`,
                    fontSize: `${config.namePosition.fontSize}px`,
                    fontFamily: config.namePosition.fontFamily,
                    color: config.namePosition.color,
                  }}
                >
                  {currentStudent.name}
                </div>
                <div
                  onMouseDown={handleMouseDown("reg")}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap cursor-move transition-all duration-75 rounded px-2 py-1 ${
                    dragging === "reg" 
                      ? "ring-2 ring-primary ring-offset-2 scale-105 bg-primary/10" 
                      : "hover:ring-2 hover:ring-primary/50 hover:bg-primary/5"
                  }`}
                  style={{
                    left: `${config.regNumberPosition.x}%`,
                    top: `${config.regNumberPosition.y}%`,
                    fontSize: `${config.regNumberPosition.fontSize}px`,
                    fontFamily: config.regNumberPosition.fontFamily,
                    color: config.regNumberPosition.color,
                  }}
                >
                  {currentStudent.registrationNumber}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

CertificatePreview.displayName = "CertificatePreview";
