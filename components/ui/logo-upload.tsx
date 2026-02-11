"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";

interface LogoUploadProps {
  currentUrl?: string | null;
  schoolId: string;
  onUploaded: (url: string) => void;
}

export function LogoUpload({
  currentUrl,
  schoolId,
  onUploaded,
}: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("schoolId", schoolId);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const { url } = await res.json();
      setPreview(url);
      onUploaded(url);
    }

    setUploading(false);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-input bg-muted transition-colors hover:border-ring/30"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Logo"
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <ImagePlus className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
      <p className="text-xs text-muted-foreground">
        {uploading ? "Envoi..." : "Cliquez pour ajouter un logo"}
      </p>
    </div>
  );
}
