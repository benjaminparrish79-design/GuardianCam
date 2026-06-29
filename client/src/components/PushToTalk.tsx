import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Volume2 } from "lucide-react";
import { toast } from "sonner";

interface AudioMessage {
  id: string;
  duration: number;
  timestamp: Date;
  blob: Blob;
}

export function PushToTalk() {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<AudioMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startTimeRef = useRef<number>(0);

  // Initialize audio context
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const duration = (Date.now() - startTimeRef.current) / 1000;

          const message: AudioMessage = {
            id: Date.now().toString(),
            duration,
            timestamp: new Date(),
            blob,
          };

          setMessages((prev) => [message, ...prev]);
          chunksRef.current = [];
          setIsRecording(false);
          toast.success(`Message recorded: ${duration.toFixed(1)}s`);
        };
      } catch (err) {
        toast.error("Microphone access denied");
        console.error(err);
      }
    };

    initAudioContext();
  }, []);

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
      startTimeRef.current = Date.now();
      mediaRecorderRef.current.start();
      setIsRecording(true);
      playBeep(400, 100); // Start beep
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      playBeep(600, 100); // Stop beep
    }
  };

  const playBeep = (frequency: number, duration: number) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  };

  const playMessage = async (message: AudioMessage) => {
    if (!audioContextRef.current) return;

    setIsPlaying(true);
    const url = URL.createObjectURL(message.blob);
    const audio = new Audio(url);

    audio.onended = () => {
      setIsPlaying(false);
      URL.revokeObjectURL(url);
    };

    audio.play().catch((err) => {
      toast.error("Failed to play message");
      console.error(err);
    });
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast.success("Message deleted");
  };

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Push-to-Talk</h3>

        <div className="flex gap-4 mb-6">
          {!isRecording ? (
            <Button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-8 text-lg font-semibold"
            >
              <Mic className="w-5 h-5 mr-2" />
              Hold to Record
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-8 text-lg font-semibold animate-pulse"
            >
              <Mic className="w-5 h-5 mr-2" />
              Recording...
            </Button>
          )}
        </div>

        {/* Audio Visualization */}
        {isRecording && (
          <div className="mb-4 p-4 bg-slate-700/50 rounded">
            <div className="flex items-center justify-center gap-1 h-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-cyan-400 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-slate-400 text-center">
          {isRecording
            ? "Recording... Release to stop"
            : "Hold the button to record your message"}
        </p>
      </div>

      {/* Messages List */}
      {messages.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recorded Messages</h3>

          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm text-slate-300">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    Duration: {message.duration.toFixed(1)}s
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => playMessage(message)}
                    disabled={isPlaying}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => deleteMessage(message.id)}
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {messages.length === 0 && !isRecording && (
        <div className="text-center py-8 text-slate-400">
          <p>No messages recorded yet</p>
        </div>
      )}
    </div>
  );
}
