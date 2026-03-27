import { useRef, useEffect, useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Phone, RotateCcw, Volume2 } from "lucide-react";
import { useCallStore } from "../store/useCallStore";

/* ─── Call Duration Timer ─── */
const useCallTimer = (isActive) => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!isActive) { setSeconds(0); return; }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isActive]);
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

/* ─── Single Control Button ─── */
const ControlBtn = ({ onClick, active, activeIcon, inactiveIcon, label }) => (
  <div className="flex flex-col items-center gap-1.5">
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
      style={{
        background: active ? 'rgba(255,255,255,0.1)' : 'rgba(220,38,38,0.7)',
        border: `1px solid ${active ? 'rgba(255,255,255,0.15)' : 'rgba(220,38,38,0.5)'}`,
        backdropFilter: 'blur(10px)',
        color: 'white',
      }}
    >
      {active ? activeIcon : inactiveIcon}
    </button>
    <span className="text-[10px] text-[#94a3b8]">{label}</span>
  </div>
);

const Calls = () => {
  const {
    isInCall, isCalling, isReceivingCall,
    caller, callType, localStream, remoteStream,
    callError, canRetryCall,
    answerCall, rejectCall, endCall, retryCall,
  } = useCallStore();

  const localVideoRef  = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isMicMuted,  setIsMicMuted]  = useState(false);
  const [isVideoOff,  setIsVideoOff]  = useState(false);
  const timer = useCallTimer(isInCall);

  /* attach streams */
  useEffect(() => {
    if (localStream && localVideoRef.current)
      localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(() => {});
    }
  }, [remoteStream, isInCall]);

  const toggleMic = () => {
    localStream?.getAudioTracks().forEach(t => (t.enabled = !t.enabled));
    setIsMicMuted(p => !p);
  };
  const toggleVideo = () => {
    localStream?.getVideoTracks().forEach(t => (t.enabled = !t.enabled));
    setIsVideoOff(p => !p);
  };

  if (!isInCall && !isCalling && !isReceivingCall) return null;

  const callerInitial = caller?.fullName?.charAt(0).toUpperCase() || "?";
  const avatarNode = caller?.profilePic
    ? <img src={caller.profilePic} alt={caller.fullName} className="w-full h-full object-cover" />
    : <div className="w-full h-full flex items-center justify-center font-bold text-[#c9a84c]" style={{ fontFamily: "'Playfair Display', serif" }}>{callerInitial}</div>;

  /* ─────────────────── INCOMING CALL ─────────────────── */
  if (isReceivingCall && !isInCall) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(12,31,61,0.97)', backdropFilter: 'blur(20px)' }}>
        {/* Pulsing rings */}
        <div className="absolute flex items-center justify-center pointer-events-none">
          {[160, 260, 360].map((size, i) => (
            <div key={i} className="absolute rounded-full border-2 border-[#c9a84c]/15 animate-ping"
              style={{ width: size, height: size, animationDelay: `${i * 0.5}s`, animationDuration: '3s' }} />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 text-center px-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#c9a84c]/50 shadow-2xl"
              style={{ background: '#162d4a' }}>
              {avatarNode}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: callType === 'video' ? '#1a3a5c' : '#047857' }}>
              {callType === 'video' ? <Video size={14} color="white" /> : <Phone size={14} color="white" />}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
              Incoming {callType === 'video' ? 'Video' : 'Voice'} Consultation
            </p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {caller?.fullName || "Unknown"}
            </h2>
            <p className="text-[#94a3b8] mt-1 text-sm">LexConnect · Secure Call</p>
          </div>

          <div className="flex items-end gap-12 mt-2">
            <div className="flex flex-col items-center gap-2">
              <button onClick={rejectCall}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}>
                <PhoneOff size={24} color="white" />
              </button>
              <span className="text-xs text-[#94a3b8]">Decline</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button onClick={answerCall}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 0 30px rgba(5,150,105,0.4)' }}>
                {callType === 'video' ? <Video size={24} color="white" /> : <Phone size={24} color="white" />}
              </button>
              <span className="text-xs text-[#94a3b8]">Accept</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────── OUTGOING RINGING ─────────────────── */
  if (isCalling && !isInCall) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(12,31,61,0.97)', backdropFilter: 'blur(20px)' }}>
        <div className="flex flex-col items-center gap-7 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#c9a84c]/40 shadow-2xl animate-pulse"
            style={{ background: '#162d4a' }}>
            {avatarNode}
          </div>
          <div>
            <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Calling...</p>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {caller?.fullName}
            </h2>
          </div>
          <div className="flex gap-2">
            {[0,1,2,3].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce"
                style={{ animationDelay: `${i * 0.18}s` }} />
            ))}
          </div>
          <button onClick={endCall}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 mt-2"
            style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}>
            <PhoneOff size={22} color="white" />
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────── ACTIVE CALL ─────────────────── */
  return (
    <div className="fixed inset-0 z-50 md:flex md:items-center md:justify-center"
      style={{ background: 'rgba(5,12,25,0.98)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full h-full md:w-[88vw] md:h-[92vh] flex flex-col overflow-hidden md:rounded-3xl shadow-2xl"
        style={{ background: '#080f1a', border: '1px solid rgba(201,168,76,0.12)' }}>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4"
          style={{ background: 'linear-gradient(to bottom, rgba(5,12,25,0.9), transparent)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#c9a84c]/40"
              style={{ background: '#162d4a' }}>
              {avatarNode}
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{caller?.fullName || "Consultation"}</p>
              <p className="text-[#c9a84c] text-xs font-mono tracking-wider">{timer}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Encrypted</span>
          </div>
        </div>

        {/* Remote video / placeholder */}
        <div className="relative flex-1 flex items-center justify-center"
          style={{ background: 'linear-gradient(160deg, #050c19 0%, #0c1f3d 100%)' }}>
          {!remoteStream && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#c9a84c]/30 shadow-2xl"
                style={{ background: '#162d4a' }}>
                {avatarNode}
              </div>
              <p className="text-white font-semibold">{caller?.fullName}</p>
              <div className="flex items-center gap-1.5">
                <Volume2 size={13} className="text-[#94a3b8]" />
                <p className="text-[#94a3b8] text-sm animate-pulse">Connecting audio...</p>
              </div>
            </div>
          )}
          {remoteStream && (
            <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
          )}

          {callError && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-5 py-2.5 rounded-2xl text-white text-sm font-medium"
              style={{ background: 'rgba(220,38,38,0.85)', backdropFilter: 'blur(10px)' }}>
              <span>{callError}</span>
              {canRetryCall && (
                <button onClick={retryCall} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full">
                  <RotateCcw size={13} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Local video PiP */}
        {(callType === "video" || localStream) && (
          <div className="absolute top-16 right-4 w-28 h-40 md:w-40 md:h-52 rounded-2xl overflow-hidden shadow-2xl z-20 hover:scale-105 transition-transform cursor-pointer"
            style={{ border: '2px solid rgba(201,168,76,0.25)' }}>
            {localStream
              ? <video ref={localVideoRef} className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} autoPlay playsInline muted />
              : <div className="w-full h-full flex items-center justify-center" style={{ background: '#162d4a' }}><VideoOff size={18} className="text-[#94a3b8]" /></div>
            }
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(12,31,61,0.9)' }}>
                <VideoOff size={20} className="text-[#94a3b8]" />
              </div>
            )}
          </div>
        )}

        {/* Control bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-center gap-6 pb-10 pt-16"
          style={{ background: 'linear-gradient(to top, rgba(5,12,25,0.95), transparent)' }}>
          <ControlBtn onClick={toggleMic} active={!isMicMuted}
            activeIcon={<Mic size={20} />} inactiveIcon={<MicOff size={20} />}
            label={isMicMuted ? "Unmute" : "Mute"} />

          <div className="flex flex-col items-center gap-1.5">
            <button onClick={endCall}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 0 25px rgba(220,38,38,0.5)' }}>
              <PhoneOff size={24} color="white" />
            </button>
            <span className="text-[10px] text-[#94a3b8]">End Call</span>
          </div>

          <ControlBtn onClick={toggleVideo} active={!isVideoOff}
            activeIcon={<Video size={20} />} inactiveIcon={<VideoOff size={20} />}
            label={isVideoOff ? "Start Video" : "Stop Video"} />
        </div>
      </div>
    </div>
  );
};

export default Calls;
