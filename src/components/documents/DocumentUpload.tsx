"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileIcon, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
}

interface DocumentUploadProps {
  workspaceId: string;
  folderId?: string;
  onUpload?: (files: File[]) => Promise<void>;
  onUploadComplete?: (document: any) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

const DOCUMENT_CATEGORIES = [
  { value: "financial", label: "Financial Documents" },
  { value: "legal", label: "Legal Documents" },
  { value: "operational", label: "Operational Documents" },
  { value: "strategic", label: "Strategic Planning" },
  { value: "hr", label: "HR Documents" },
  { value: "other", label: "Other" },
];

const ALLOWED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "text/plain": [".txt"],
  "text/csv": [".csv"],
  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
};

export function DocumentUpload({
  workspaceId,
  folderId,
  onUpload,
  onUploadComplete,
  onCancel,
  onClose,
}: DocumentUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("other");
  const [description, setDescription] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState("");
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
        uploadProgress: 0,
      }),
    ) as FileWithPreview[];

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_FILE_TYPES,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const file = newFiles[index];
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);

    try {
      // If onUpload prop is provided, use it (parent handles the upload)
      if (onUpload) {
        await onUpload(files);
      } else {
        // Otherwise, handle upload internally
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("category", category);
          formData.append("description", description);
          formData.append("isEncrypted", String(isEncrypted));

          if (folderId) {
            formData.append("folderId", folderId);
          }

          if (isEncrypted && encryptionKey) {
            formData.append("encryptionKey", encryptionKey);
          }

          // Upload with progress tracking
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setFiles((prev) => {
                const newFiles = [...prev];
                newFiles[i] = { ...newFiles[i], uploadProgress: progress };
                return newFiles;
              });
            }
          });

          const uploadPromise = new Promise((resolve, reject) => {
            xhr.addEventListener("load", () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
              } else {
                reject(new Error(`Upload failed: ${xhr.statusText}`));
              }
            });

            xhr.addEventListener("error", () =>
              reject(new Error("Upload failed")),
            );
          });

          xhr.open("POST", `/api/workspaces/${workspaceId}/documents`);
          xhr.setRequestHeader(
            "Authorization",
            `Bearer ${localStorage.getItem("token")}`,
          );
          xhr.send(formData);

          const result = await uploadPromise;

          if (onUploadComplete) {
            onUploadComplete(result);
          }
        }

        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${files.length} document${files.length > 1 ? "s" : ""}`,
        });
      }

      // Clean up
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });

      setFiles([]);
      setDescription("");

      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div key={index} className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? "Drop the files here..."
            : "Drag & drop files here, or click to select files"}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: PDF, Word, Excel, Text, CSV, Images (Max 100MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Files to upload</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center space-x-4">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <FileIcon className="h-10 w-10 text-gray-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {file.uploadProgress !== undefined &&
                      file.uploadProgress > 0 && (
                        <Progress
                          value={file.uploadProgress}
                          className="mt-2 h-2"
                        />
                      )}
                  </div>
                  {!uploading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for these documents..."
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="encrypted"
              checked={isEncrypted}
              onCheckedChange={setIsEncrypted}
            />
            <Label htmlFor="encrypted" className="flex items-center space-x-2">
              {isEncrypted ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
              <span>Encrypt documents</span>
            </Label>
          </div>

          {isEncrypted && (
            <div>
              <Label htmlFor="encryptionKey">
                Encryption Key (Optional - will be generated if not provided)
              </Label>
              <Input
                id="encryptionKey"
                type="password"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
                placeholder="Enter encryption key..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Save this key securely - you&apos;ll need it to decrypt the
                documents
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {(onCancel || onClose) && (
          <Button
            variant="outline"
            onClick={onCancel || onClose}
            disabled={uploading}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={uploadFiles}
          disabled={files.length === 0 || uploading}
        >
          {uploading
            ? "Uploading..."
            : `Upload ${files.length} File${files.length !== 1 ? "s" : ""}`}
        </Button>
      </div>
    </div>
  );
}
