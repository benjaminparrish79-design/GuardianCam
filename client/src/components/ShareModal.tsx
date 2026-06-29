import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, QrCode, X } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cameraName: string;
  cameraId: string;
}

export function ShareModal({ isOpen, onClose, cameraName, cameraId }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [expiresIn, setExpiresIn] = useState<"1h" | "24h" | "7d" | "never">("24h");

  if (!isOpen) return null;

  // Generate share link (in production, this would come from backend)
  const shareLink = `${window.location.origin}/shared/${cameraId}?token=${Math.random().toString(36).substring(2, 15)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareLink)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const expirationTimes = {
    "1h": "1 hour",
    "24h": "24 hours",
    "7d": "7 days",
    never: "Never expires",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Share Live Feed</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-slate-400 mb-4">
          Share <span className="font-semibold text-cyan-400">{cameraName}</span> with others
        </p>

        {/* Expiration Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Link expires in:</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(expirationTimes) as Array<keyof typeof expirationTimes>).map((key) => (
              <button
                key={key}
                onClick={() => setExpiresIn(key)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  expiresIn === key
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {expirationTimes[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Share Link */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Share Link:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500"
            />
            <Button
              onClick={handleCopyLink}
              className={`${
                copied ? "bg-green-500 hover:bg-green-600" : "bg-cyan-500 hover:bg-cyan-600"
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* QR Code */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">QR Code:</label>
          <div className="bg-white p-4 rounded flex justify-center">
            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
          </div>
        </div>

        {/* Info */}
        <div className="bg-slate-700/50 border border-slate-600 rounded p-4 mb-6 text-sm text-slate-300">
          <p className="mb-2">
            <span className="font-semibold">Anyone with this link</span> can view your live feed.
          </p>
          <p>The link will expire in {expirationTimes[expiresIn].toLowerCase()}.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-600 text-white hover:bg-slate-700"
          >
            Done
          </Button>
          <Button
            onClick={handleCopyLink}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
}
