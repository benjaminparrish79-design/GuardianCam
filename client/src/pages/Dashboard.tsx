import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Camera, Plus, Settings, LogOut, AlertCircle, Clock, Share2, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface CameraDevice {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  lastSeen: Date;
  type: string;
}

interface AlertEvent {
  id: string;
  cameraName: string;
  type: string;
  severity: "low" | "medium" | "high";
  time: Date;
  description: string;
}

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"cameras" | "alerts" | "broadcast">("cameras");
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [cameraName, setCameraName] = useState("");
  const [cameraLocation, setCameraLocation] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [nightVisionEnabled, setNightVisionEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  // Initialize webcam
  useEffect(() => {
    if (activeTab === "broadcast" && !isBroadcasting) {
      startWebcam();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeTab, isBroadcasting]);

  // Apply night vision filter
  useEffect(() => {
    if (nightVisionEnabled && canvasRef.current && videoRef.current) {
      applyNightVision();
    }
  }, [nightVisionEnabled]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsBroadcasting(true);
      toast.success("Webcam started");
    } catch (err) {
      toast.error("Failed to access webcam");
      console.error(err);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsBroadcasting(false);
    setNightVisionEnabled(false);
    toast.success("Webcam stopped");
  };

  const applyNightVision = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const drawFrame = () => {
      ctx.drawImage(videoRef.current!, 0, 0, canvas.width, canvas.height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply green thermal effect
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Convert to grayscale
        const gray = r * 0.299 + g * 0.587 + b * 0.114;

        // Apply green thermal effect
        data[i] = Math.max(0, gray - 50); // Red
        data[i + 1] = gray; // Green (bright)
        data[i + 2] = Math.max(0, gray - 100); // Blue
      }

      ctx.putImageData(imageData, 0, 0);

      if (nightVisionEnabled) {
        animationFrameRef.current = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();
  };

  const addCamera = () => {
    if (!cameraName || !cameraLocation) {
      toast.error("Please fill in all fields");
      return;
    }

    const newCamera: CameraDevice = {
      id: Date.now().toString(),
      name: cameraName,
      location: cameraLocation,
      status: "online",
      lastSeen: new Date(),
      type: "Phone Camera",
    };

    setCameras([...cameras, newCamera]);
    setCameraName("");
    setCameraLocation("");
    setShowAddCamera(false);
    toast.success("Camera added successfully");
  };

  const deleteCamera = (id: string) => {
    setCameras(cameras.filter((c) => c.id !== id));
    toast.success("Camera deleted");
  };

  const simulateMotionAlert = () => {
    if (cameras.length === 0) {
      toast.error("Add a camera first");
      return;
    }

    const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];
    const alert: AlertEvent = {
      id: Date.now().toString(),
      cameraName: randomCamera.name,
      type: "Motion Detected",
      severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
      time: new Date(),
      description: `Motion detected at ${randomCamera.location}`,
    };

    setAlerts([alert, ...alerts]);
    toast.success(`Motion alert: ${alert.description}`);
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `snapshot-${Date.now()}.png`;
      link.click();
      toast.success("Snapshot saved");
    }
  };

  const startRecording = () => {
    if (!videoRef.current?.srcObject) return;

    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `recording-${Date.now()}.webm`;
      link.click();
      toast.success("Recording saved");
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 10000); // Record for 10 seconds
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold">GuardianCam</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Welcome, {user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-300 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-4 border-b border-slate-700 mb-8">
          <button
            onClick={() => setActiveTab("cameras")}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === "cameras"
                ? "border-b-2 border-cyan-400 text-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Cameras
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === "alerts"
                ? "border-b-2 border-cyan-400 text-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Alerts
          </button>
          <button
            onClick={() => setActiveTab("broadcast")}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === "broadcast"
                ? "border-b-2 border-cyan-400 text-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Broadcast
          </button>
        </div>

        {/* Cameras Tab */}
        {activeTab === "cameras" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">My Cameras</h2>
              <Button
                onClick={() => setShowAddCamera(!showAddCamera)}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Camera
              </Button>
            </div>

            {showAddCamera && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Add New Camera</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Camera Name"
                    value={cameraName}
                    onChange={(e) => setCameraName(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={cameraLocation}
                    onChange={(e) => setCameraLocation(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                  <div className="flex gap-4">
                    <Button
                      onClick={addCamera}
                      className="bg-cyan-500 hover:bg-cyan-600"
                    >
                      Add Camera
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddCamera(false)}
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {cameras.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
                <Camera className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No cameras added yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cameras.map((camera) => (
                  <div
                    key={camera.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">{camera.name}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          camera.status === "online"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {camera.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{camera.location}</p>
                    <p className="text-slate-500 text-xs mb-4">
                      Last seen: {camera.lastSeen.toLocaleTimeString()}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteCamera(camera.id)}
                        className="flex-1 border-red-600 text-red-400 hover:bg-red-500/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Motion Alerts & History</h2>
              <Button
                onClick={simulateMotionAlert}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Simulate Alert
              </Button>
            </div>

            {alerts.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
                <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No alerts yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{alert.cameraName}</h3>
                        <p className="text-slate-400 text-sm">{alert.description}</p>
                        <p className="text-slate-500 text-xs mt-2">
                          {alert.time.toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          alert.severity === "high"
                            ? "bg-red-500/20 text-red-400"
                            : alert.severity === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Broadcast Tab */}
        {activeTab === "broadcast" && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Broadcast Mode</h2>

            {isBroadcasting ? (
              <div className="space-y-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full aspect-video bg-black"
                  />
                </div>

                {nightVisionEnabled && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      className="w-full aspect-video bg-black"
                    />
                  </div>
                )}

                <div className="space-y-4">
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
                    <Button
                      onClick={takeSnapshot}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      📷 Snapshot
                    </Button>
                    <Button
                      onClick={startRecording}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      ⏺️ Record (10s)
                    </Button>
                  </div>

                  <Button
                    onClick={stopWebcam}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Stop Broadcasting
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
                <Camera className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 mb-6">
                  Turn this device into a security camera
                </p>
                <Button
                  onClick={startWebcam}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Broadcasting
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
