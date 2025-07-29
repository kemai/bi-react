
"use client";
import { useState, useRef } from "react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../components/hooks/use-toast";
import { UploadCloud, File as FileIcon, AlertCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import PageHeader from '../components/layout/page-header';
import DataSourcesContentCard from '../components/layout/data-sources-content-card';

import type { ChangeEvent, FormEvent,} from "react";

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function DataSourcesPage() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setFileError("Invalid file type. Please upload a CSV file.");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setSelectedFile(file);
      setFileError(null);
    } else {
      setSelectedFile(null);
      setFileError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a CSV file to upload.",
      });
      return;
    }

    if (fileError) {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: fileError,
      });
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      toast({
        title: "File Ready (Simulated)",
        description: `${selectedFile.name} is ready for analysis. (This is a simulation)`,
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Data Sources"
        description="Manage and upload your data sources for analysis."
      />
      <DataSourcesContentCard
        icon={UploadCloud}
        title="Upload CSV Data Source"
        description={`Upload your CSV file (max ${MAX_FILE_SIZE_MB}MB) to analyze its content with our AI.`}
        footerContent={<p className="text-xs text-muted-foreground">Your data will be processed securely.</p>}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="csv-upload" className="text-base font-medium">Choose CSV File</Label>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              aria-describedby="file-upload-help"
            />
            <p id="file-upload-help" className="text-xs text-muted-foreground">
              Supported format: .csv. Max file size: {MAX_FILE_SIZE_MB}MB.
            </p>
          </div>

          {selectedFile && !fileError && (
            <div className="p-3 border rounded-md bg-muted/50">
              <div className="flex items-center gap-2">
                <FileIcon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <Badge variant="secondary">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</Badge>
              </div>
            </div>
          )}

          {fileError && (
            <div className="p-3 border border-destructive/50 rounded-md bg-destructive/10 text-destructive">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{fileError}</span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!selectedFile || !!fileError || isUploading}>
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Upload and Analyze"
            )}
          </Button>
        </form>
      </DataSourcesContentCard>
    </div>
  );
}
