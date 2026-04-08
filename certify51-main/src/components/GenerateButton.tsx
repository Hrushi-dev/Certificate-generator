import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Download, FileImage, FileText, Loader2, Sparkles } from "lucide-react";
import { Student, CertificateConfig } from "@/types/certificate";
import { toast } from "sonner";

interface GenerateButtonProps {
  students: Student[];
  templateUrl: string | null;
  config: CertificateConfig;
}

type ExportFormat = "pdf" | "png" | "jpg";

export const GenerateButton = ({ students, templateUrl, config }: GenerateButtonProps) => {
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const createCertificateElement = async (student: Student): Promise<HTMLDivElement> => {
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.overflow = "hidden";
    
    // Load image to get natural dimensions
    const img = document.createElement("img");
    img.src = templateUrl!;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    
    // Use the image's natural aspect ratio
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const containerWidth = 1000;
    const containerHeight = containerWidth / aspectRatio;
    
    container.style.width = `${containerWidth}px`;
    container.style.height = `${containerHeight}px`;
    
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    container.appendChild(img);

    const nameEl = document.createElement("div");
    nameEl.textContent = student.name;
    nameEl.style.position = "absolute";
    nameEl.style.left = `${config.namePosition.x}%`;
    nameEl.style.top = `${config.namePosition.y}%`;
    nameEl.style.transform = "translate(-50%, -50%)";
    nameEl.style.fontSize = `${config.namePosition.fontSize}px`;
    nameEl.style.fontFamily = config.namePosition.fontFamily;
    nameEl.style.color = config.namePosition.color;
    nameEl.style.whiteSpace = "nowrap";
    container.appendChild(nameEl);

    const regEl = document.createElement("div");
    regEl.textContent = student.registrationNumber;
    regEl.style.position = "absolute";
    regEl.style.left = `${config.regNumberPosition.x}%`;
    regEl.style.top = `${config.regNumberPosition.y}%`;
    regEl.style.transform = "translate(-50%, -50%)";
    regEl.style.fontSize = `${config.regNumberPosition.fontSize}px`;
    regEl.style.fontFamily = config.regNumberPosition.fontFamily;
    regEl.style.color = config.regNumberPosition.color;
    regEl.style.whiteSpace = "nowrap";
    container.appendChild(regEl);

    return container;
  };

  const generateCertificates = async () => {
    if (!templateUrl || students.length === 0) {
      toast.error("Please upload a template and CSV data first");
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const zip = new JSZip();
      const pdf = format === "pdf" ? new jsPDF("landscape", "pt", "a4") : null;

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const element = await createCertificateElement(student);
        document.body.appendChild(element);

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        document.body.removeChild(element);

        if (format === "pdf" && pdf) {
          if (i > 0) pdf.addPage();
          const imgData = canvas.toDataURL("image/jpeg", 0.95);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        } else {
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob(
              (b) => resolve(b!),
              format === "png" ? "image/png" : "image/jpeg",
              0.95
            );
          });
          const safeName = student.name.replace(/[^a-zA-Z0-9]/g, "_");
          zip.file(`${safeName}_${student.registrationNumber}.${format}`, blob);
        }

        setProgress(Math.round(((i + 1) / students.length) * 100));
      }

      if (format === "pdf" && pdf) {
        pdf.save("certificates.pdf");
        toast.success("PDF generated successfully!");
      } else {
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zipBlob);
        link.download = `certificates_${format}.zip`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success(`${students.length} certificates generated!`);
      }
    } catch (error) {
      console.error("Error generating certificates:", error);
      toast.error("Error generating certificates");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const isDisabled = !templateUrl || students.length === 0 || isGenerating;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 via-card/80 to-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Generate
        </CardTitle>
        <CardDescription>
          Create certificates for {students.length || 0} students
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
            <SelectTrigger className="w-36 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF
                </span>
              </SelectItem>
              <SelectItem value="png">
                <span className="flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  PNG
                </span>
              </SelectItem>
              <SelectItem value="jpg">
                <span className="flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  JPG
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={generateCertificates}
            disabled={isDisabled}
            className="flex-1 bg-primary hover:bg-primary/90 shadow-md"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download All
              </>
            )}
          </Button>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {progress}% complete
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
