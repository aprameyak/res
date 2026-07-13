"use client";
import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUpload } from "@/hooks/use-upload";

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

export function ResumeDropzone() {
  const { upload, isUploading, progress, reset } = useUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    setError(null);
    if (rejected.length > 0) {
      const err = rejected[0].errors[0];
      if (err.code === "file-too-large") setError(`File too large. Max ${MAX_SIZE / 1024 / 1024}MB`);
      else if (err.code === "file-invalid-type") setError("Only PDF and DOCX files are accepted");
      else setError(err.message);
      return;
    }
    if (accepted.length > 0) setSelectedFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE,
    multiple: false,
    disabled: isUploading,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    setError(null);
    try {
      await upload(selectedFile);
      setSelectedFile(null);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      setError(err?.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors",
          isDragActive ? "border-primary bg-muted/50" : "border-border hover:bg-muted/30",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 text-center">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", isDragActive ? "bg-muted" : "bg-muted")}>
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{isDragActive ? "Drop file here" : "Drag and drop your resume"}</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF or DOCX, max {MAX_SIZE / 1024 / 1024}MB</p>
          </div>
        </div>
      </div>

      {selectedFile && !isUploading && (
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <FileText className="h-5 w-5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(selectedFile.size)}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSelectedFile(null); reset(); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2 rounded-lg border p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Uploading...</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {selectedFile && !isUploading && (
        <Button onClick={handleUpload} className="w-full">
          Analyze resume
        </Button>
      )}
    </div>
  );
}
