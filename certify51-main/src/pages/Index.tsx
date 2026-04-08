import { useState, useRef } from "react";
import { Award } from "lucide-react";
import { CSVUpload } from "@/components/CSVUpload";
import { TemplateUpload } from "@/components/TemplateUpload";
import { TextStyleControls } from "@/components/TextStyleControls";
import { CertificatePreview } from "@/components/CertificatePreview";
import { GenerateButton } from "@/components/GenerateButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Student, CertificateConfig } from "@/types/certificate";

const defaultConfig: CertificateConfig = {
  namePosition: {
    x: 50,
    y: 45,
    fontSize: 32,
    fontFamily: "Georgia, serif",
    color: "#1a1a2e",
  },
  regNumberPosition: {
    x: 50,
    y: 55,
    fontSize: 18,
    fontFamily: "Arial, sans-serif",
    color: "#333333",
  },
};

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const [config, setConfig] = useState<CertificateConfig>(defaultConfig);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
              <Award className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Certify</h1>
              <p className="text-xs text-muted-foreground">
                Bulk certificate generator
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Sidebar - Inputs */}
          <div className="lg:col-span-2 space-y-5">
            <CSVUpload onDataLoaded={setStudents} students={students} />
            <TemplateUpload
              onTemplateLoaded={setTemplateUrl}
              templateUrl={templateUrl}
            />
            <TextStyleControls config={config} onConfigChange={setConfig} />
            <GenerateButton
              students={students}
              templateUrl={templateUrl}
              config={config}
            />
          </div>

          {/* Right - Preview */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <CertificatePreview
                ref={previewRef}
                templateUrl={templateUrl}
                students={students}
                config={config}
                selectedIndex={selectedStudentIndex}
                onSelectStudent={setSelectedStudentIndex}
                onConfigChange={setConfig}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
