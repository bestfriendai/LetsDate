import { Spinner } from "@nextui-org/react";

export default function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[1000] rounded-3xl">
      <div className="bg-white dark:bg-[#1D1D1F] p-4 rounded-xl shadow-lg">
        <Spinner color="primary" size="lg" />
      </div>
    </div>
  );
}