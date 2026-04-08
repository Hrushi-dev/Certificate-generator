import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from "lucide-react";
import { CertificateConfig } from "@/types/certificate";

interface TextStyleControlsProps {
  config: CertificateConfig;
  onConfigChange: (config: CertificateConfig) => void;
}

const FONTS = [
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "cursive", label: "Cursive" },
];

export const TextStyleControls = ({ config, onConfigChange }: TextStyleControlsProps) => {
  const updateNameStyle = (field: string, value: number | string) => {
    onConfigChange({
      ...config,
      namePosition: { ...config.namePosition, [field]: value },
    });
  };

  const updateRegStyle = (field: string, value: number | string) => {
    onConfigChange({
      ...config,
      regNumberPosition: { ...config.regNumberPosition, [field]: value },
    });
  };

  return (
    <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Palette className="h-5 w-5 text-primary" />
          Text Styling
        </CardTitle>
        <CardDescription>
          Customize font and colors for certificate text
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name Styling */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <h4 className="font-medium text-sm">Student Name</h4>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Size</Label>
              <Input
                type="number"
                value={config.namePosition.fontSize}
                onChange={(e) => updateNameStyle("fontSize", parseInt(e.target.value) || 24)}
                min={8}
                max={72}
                className="h-9 bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font</Label>
              <Select
                value={config.namePosition.fontFamily}
                onValueChange={(v) => updateNameStyle("fontFamily", v)}
              >
                <SelectTrigger className="h-9 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="relative">
                <Input
                  type="color"
                  value={config.namePosition.color}
                  onChange={(e) => updateNameStyle("color", e.target.value)}
                  className="h-9 p-1 cursor-pointer bg-background/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border/50" />

        {/* Registration Number Styling */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-secondary" />
            <h4 className="font-medium text-sm">Registration Number</h4>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Size</Label>
              <Input
                type="number"
                value={config.regNumberPosition.fontSize}
                onChange={(e) => updateRegStyle("fontSize", parseInt(e.target.value) || 16)}
                min={8}
                max={72}
                className="h-9 bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font</Label>
              <Select
                value={config.regNumberPosition.fontFamily}
                onValueChange={(v) => updateRegStyle("fontFamily", v)}
              >
                <SelectTrigger className="h-9 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="relative">
                <Input
                  type="color"
                  value={config.regNumberPosition.color}
                  onChange={(e) => updateRegStyle("color", e.target.value)}
                  className="h-9 p-1 cursor-pointer bg-background/50"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
