import { useCallback } from "react";
import { Upload, ImageIcon, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TemplateUploadProps {
  onTemplateLoaded: (imageUrl: string) => void;
  templateUrl: string | null;
}

export const TemplateUpload = ({ onTemplateLoaded, templateUrl }: TemplateUploadProps) => {
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onTemplateLoaded(result);
        toast.success("Template loaded");
      };
      reader.onerror = () => {
        toast.error("Error reading file");
      };
      reader.readAsDataURL(file);
    },
    [onTemplateLoaded]
  );

  return (
    <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ImageIcon className="h-5 w-5 text-primary" />
          Certificate Template
        </CardTitle>
        <CardDescription>
          Upload your certificate design
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!templateUrl ? (
            <label className="group flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border/50 rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 hover:border-primary/50 transition-all duration-200">
              <div className="flex flex-col items-center justify-center py-4">
                <Upload className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Upload template</span>
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </label>
          ) : (
            <div className="space-y-3">
              <div className="relative aspect-[1.414/1] rounded-xl overflow-hidden border border-border/50 bg-background/50">
                <img
                  src={templateUrl}
                  alt="Certificate template"
                  className="w-full h-full object-contain"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => onTemplateLoaded("")}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <label className="block text-center">
                <span className="text-xs text-primary cursor-pointer hover:underline">
                  Change template
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
