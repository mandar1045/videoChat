import { useRef, useEffect, useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, RotateCcw } from "lucide-react";
import { useCallStore } from "../store/useCallStore";

const Calls = () => {
  const {
    isInCall,
    isCalling,
    isReceivingCall,
    caller,
    callType,
    localStream,
    remoteStream,
    callError,
    canRetryCall,
    answerCall,
    rejectCall,
    endCall,
    retryCall,
  } = useCallStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Handle Local Stream
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Handle Remote Stream
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, isInCall]);

  // Toggle Mic
  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(!isMicMuted);
    }
  };

  // Toggle Video
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  if (!isInCall && !isCalling && !isReceivingCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full h-full md:w-[90vw] md:h-[90vh] bg-gray-900 md:rounded-2xl overflow-hidden shadow-2xl flex flex-col">

        {/* Main Video Area (Remote) */}
        <div className="relative flex-1 bg-black flex items-center justify-center">
          {/* Background / Placeholder when no video */}
          <div className="absolute inset-0 flex items-center justify-center text-white/20">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4 text-4xl font-bold text-white">
                {caller?.fullName?.charAt(0).toUpperCase() || "?"}
              </div>
              <h3 className="text-2xl font-semibold">{caller?.fullName || "Unknown"}</h3>
              <p className="text-lg animate-pulse">
                {isReceivingCall ? "Incoming Call..." : isCalling ? "Calling..." : "Connected"}
              </p>
            </div>
          </div>

          {/* Remote Video Element */}
          {remoteStream && (
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
          )}

          {/* Error Message Overlay */}
          {callError && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-lg z-10">
              <span>{callError}</span>
              {canRetryCall && (
                <button onClick={retryCall} className="bg-white/20 hover:bg-white/30 p-1 rounded-full"><RotateCcw size={16} /></button>
              )}
            </div>
          )}
        </div>

        {/* Local Video (PiP) */}
        {(!isReceivingCall && (callType === "video" || localStream)) && (
          <div className="absolute top-4 right-4 w-32 h-48 md:w-48 md:h-64 bg-gray-800 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 z-20">
            {localStream ? (
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover mirror"
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 bg-gray-900">
                <VideoOff />
              </div>
            )}

          </div>
        )}

        {/* Controls Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
          {isReceivingCall ? (
            // Incoming Call Controls
            <>
              <button onClick={rejectCall} className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-transform hover:scale-110">
                <PhoneOff size={32} />
              </button>
              <button onClick={answerCall} className="p-4 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-transform hover:scale-110">
                {callType === 'video' ? <Video size={32} /> : <Mic size={32} />}
              </button>
            </>
          ) : (
            // Active Call Controls
            <>
              <button onClick={toggleMic} className={`p-4 rounded-full shadow-lg backdrop-blur-md transition-all ${isMicMuted ? 'bg-red-500/80 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                {isMicMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              <button onClick={endCall} className="p-5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-xl transform hover:scale-105 transition-all">
                <PhoneOff size={32} />
              </button>

              <button onClick={toggleVideo} className={`p-4 rounded-full shadow-lg backdrop-blur-md transition-all ${isVideoOff ? 'bg-red-500/80 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>
            </>
          )}
        </div>
      </div>
      <style>{`
        .mirror {
            transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default Calls;
