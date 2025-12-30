import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Upload, AlertCircle, CheckCircle, Loader } from "lucide-react";

interface EBMUploadProps {
  orderId: string;
  currentEBMDocument?: string | null;
  onUploadSuccess: (documentUrl: string) => void;
}

export function EBMDocumentUpload({
  orderId,
  currentEBMDocument,
  onUploadSuccess,
}: EBMUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(selectedFile.type)) {
        setError(
          "Invalid file type. Please upload: PDF, Image (JPG/PNG/WebP), or Word Document"
        );
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(false);

      // Generate unique filename
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${orderId}_${timestamp}.${fileExtension}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("ebm_documents")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("ebm_documents").getPublicUrl(fileName);

      // Update orders table with the document URL
      const { error: updateError } = await supabase
        .from("orders")
        .update({ ebm_document: publicUrl })
        .eq("id", orderId);

      if (updateError) throw updateError;

      setSuccess(true);
      setFile(null);
      onUploadSuccess(publicUrl);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error uploading EBM document:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload EBM document. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteEBM = async () => {
    if (!currentEBMDocument) return;

    try {
      setUploading(true);

      // Remove from database
      const { error: updateError } = await supabase
        .from("orders")
        .update({ ebm_document: null })
        .eq("id", orderId);

      if (updateError) throw updateError;

      // Extract filename from URL and delete from storage
      const fileName = currentEBMDocument.split("/").pop();
      if (fileName) {
        await supabase.storage.from("ebm_documents").remove([fileName]);
      }

      setSuccess(true);
      onUploadSuccess("");

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error deleting EBM document:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete EBM document. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-secondary/30">
      <h4 className="font-semibold text-sm">Upload EBM Document</h4>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            EBM document uploaded successfully! Client can now view and download it.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {currentEBMDocument && (
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <p className="text-sm text-green-800 font-medium mb-2">
            ✓ EBM Document Already Uploaded
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(currentEBMDocument, "_blank")}
              className="flex-1"
            >
              View Current Document
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteEBM}
              disabled={uploading}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Input
          type="file"
          onChange={handleFileSelect}
          disabled={uploading}
          accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
          className="cursor-pointer"
        />
        <p className="text-xs text-muted-foreground">
          Supported formats: PDF, JPG, PNG, WebP, Word (Max 10MB)
        </p>
      </div>

      {file && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Selected:</span> {file.name} (
            {(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full gap-2"
      >
        {uploading ? (
          <>
            <Loader className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload EBM Document
          </>
        )}
      </Button>
    </div>
  );
}
