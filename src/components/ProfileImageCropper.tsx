"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { getCroppedImg, PixelCrop } from "@/utils/cropImage";

interface Props {
  imageSrc: string;
  onCrop: (file: File) => void;
  onCancel: () => void;
}

export default function ProfileImageCropper({
  imageSrc,
  onCrop,
  onCancel,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(
    null,
  );
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = (_croppedArea: unknown, croppedPixels: PixelCrop) => {
    setCroppedAreaPixels(croppedPixels);
  };

  async function handleCrop() {
    if (!croppedAreaPixels) return;

    try {
      setIsCropping(true);

      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);

      const file = new File([blob], "profile.jpg", {
        type: "image/jpeg",
      });

      onCrop(file);
    } catch (error) {
      console.error("cropImageError", error);
    } finally {
      setIsCropping(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Cropper */}
      <div className="relative mx-auto h-72 w-72 overflow-hidden rounded-lg bg-black">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* Zoom */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Zoom</p>

        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full cursor-pointer"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isCropping}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="button" disabled={isCropping} onClick={handleCrop}>
          {isCropping ? "Processing..." : "Crop"}
        </Button>
      </div>
    </div>
  );
}
