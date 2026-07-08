import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, PhoneCall, ScreenShare } from "lucide-react";

export default function VideoCall() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!inCall) return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [inCall]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const startCall = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setInCall(true);
      setElapsed(0);
    } catch (err) {
      setError(
        "Could not access camera/microphone. Please allow permissions, or use HTTPS/localhost."
      );
    }
  };

  const endCall = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    screenStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    setInCall(false);
    setSharingScreen(false);
  };

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMicOn((v) => !v);
  };

  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCamOn((v) => !v);
  };

  const toggleScreenShare = async () => {
    if (sharingScreen) {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      if (localVideoRef.current && streamRef.current) {
        localVideoRef.current.srcObject = streamRef.current;
      }
      setSharingScreen(false);
      return;
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = screenStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
      setSharingScreen(true);
      screenStream.getVideoTracks()[0].onended = () => {
        screenStreamRef.current = null;
        if (localVideoRef.current && streamRef.current) {
          localVideoRef.current.srcObject = streamRef.current;
        }
        setSharingScreen(false);
      };
    } catch {
      setError("Screen share was cancelled or is not supported in this browser.");
    }
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="container-responsive py-6">
      <h1 className="font-heading text-xl font-semibold text-primary-700 mb-4">
        Video Call
      </h1>

      <div className="bg-slate-900 rounded-2xl overflow-hidden relative" style={{ minHeight: 420 }}>
        {inCall ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-[420px] object-cover bg-black"
          />
        ) : (
          <div className="w-full h-[420px] flex flex-col items-center justify-center text-slate-400">
            <PhoneCall size={40} className="mb-3 opacity-60" />
            <p className="text-sm">No active call. Click "Start Call" to begin.</p>
          </div>
        )}

        {inCall && (
          <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
            {formatTime(elapsed)} {sharingScreen && "· Sharing screen"}
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
          {!inCall ? (
            <button
              onClick={startCall}
              className="flex items-center gap-2 bg-accent-600 hover:bg-accent-700 text-white text-sm px-5 py-2.5 rounded-full shadow-lg"
            >
              <PhoneCall size={16} />
              Start Call
            </button>
          ) : (
            <>
              <button
                onClick={toggleMic}
                className={`p-3 rounded-full shadow-lg ${
                  micOn ? "bg-white/90 text-slate-800" : "bg-red-500 text-white"
                }`}
                title={micOn ? "Mute microphone" : "Unmute microphone"}
              >
                {micOn ? <Mic size={18} /> : <MicOff size={18} />}
              </button>
              <button
                onClick={toggleCam}
                className={`p-3 rounded-full shadow-lg ${
                  camOn ? "bg-white/90 text-slate-800" : "bg-red-500 text-white"
                }`}
                title={camOn ? "Turn camera off" : "Turn camera on"}
              >
                {camOn ? <Video size={18} /> : <VideoOff size={18} />}
              </button>
              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full shadow-lg ${
                  sharingScreen ? "bg-primary-600 text-white" : "bg-white/90 text-slate-800"
                }`}
                title="Share screen"
              >
                <ScreenShare size={18} />
              </button>
              <button
                onClick={endCall}
                className="p-3 rounded-full shadow-lg bg-red-600 hover:bg-red-700 text-white"
                title="End call"
              >
                <PhoneOff size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Note: this is a frontend-only mock using your own camera as a local preview. A real
        peer-to-peer connection needs a signaling server and a second participant, which is
        outside this week's scope.
      </p>
    </div>
  );
}
