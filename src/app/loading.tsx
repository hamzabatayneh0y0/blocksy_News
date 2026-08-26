import { MorphingInfinity } from "@/components/morphing-infinity";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <MorphingInfinity className="size-20 text-primary" />
    </div>
  );
}
