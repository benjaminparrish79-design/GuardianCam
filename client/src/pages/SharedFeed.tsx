import { useEffect, useState, useRef } from "react";
import { useRoute } from "wouter";
import { Moon, Volume2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SharedFeed() {
  const [, params] = useRoute("/shared/:id");
  const [isValid, setIsValid] = useState(true);
  const [cameraName, setCameraName] = useState("Shared Camera");
  const [nightVisionEnabled, setNightVisionEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Validate share token (in production, this would check with backend)
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setIsValid(false);
      toast.error("Invalid or expired share link");
      return;
    }

    // Initialize webcam
    const initWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Webcam access denied:", err);
        toast.error("Camera access denied");
      }
    };

    initWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Night vision processing
  useEffect(() => {
    if (!nightVisionEnabled || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const processFrame = () => {
      if (videoRef.current && canvasRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = 0;
          data[i + 1] = Math.min(255, gray * 1.5);
          data[i + 2] = 0;
        }

        ctx.putImageData(imageData, 0, 0);
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nightVisionEnabled]);

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Invalid Share Link</h1>
          <p className="text-slate-400">This share link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">GuardianCam - Shared Feed</h1>
              <p className="text-slate-400 text-sm">{cameraName}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Video */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-video bg-black"
              />
            </div>

            {/* Night Vision Canvas */}
            {nightVisionEnabled && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full aspect-video bg-black"
                />
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-4">
              <Button
                onClick={() => setNightVisionEnabled(!nightVisionEnabled)}
                className={
                  nightVisionEnabled
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-slate-600 hover:bg-slate-700"
                }
              >
                <Moon className="w-4 h-4 mr-2" />
                Night Vision {nightVisionEnabled ? "ON" : "OFF"}
              </Button>

              <Button className="bg-blue-500 hover:bg-blue-600">
                <Volume2 className="w-4 h-4 mr-2" />
                Audio Feed
              </Button>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Camera Info */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Camera Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">Camera Name</p>
                  <p className="font-semibold">{cameraName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Status</p>
                  <p className="font-semibold text-green-400">Online</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Resolution</p>
                  <p className="font-semibold">1920x1080</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Bitrate</p>
                  <p className="font-semibold">2.5 Mbps</p>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Motion Detected</p>
                    <p className="text-xs text-slate-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Person Detected</p>
                    <p className="text-xs text-slate-500">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Camera Online</p>
                    <p className="text-xs text-slate-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Info */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Share Information</h2>
              <div className="space-y-3 text-sm">
                <p className="text-slate-400">
                  This is a shared view of a GuardianCam security camera. The owner can revoke access at any time.
                </p>
                <div className="bg-slate-700/50 rounded p-3">
                  <p className="text-slate-500 text-xs mb-1">Share Link Expires In</p>
                  <p className="font-semibold">23 hours 45 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
