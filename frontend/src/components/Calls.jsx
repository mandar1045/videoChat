import { useRef, useEffect } from "react";
import { X, Mic, Video, PhoneOff, RotateCcw } from "lucide-react";
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

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      console.log('Setting local stream to video element');
      
      localVideoRef.current.srcObject = localStream;

      // Try to play the video
      const playPromise = localVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing local video:', error);
        });
      }
    } else if (localVideoRef.current && !localStream) {
      localVideoRef.current.srcObject = null;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      console.log('Setting remote stream to video element');
      
      // Note: The stream is already set via the callback ref below,
      // but we handle it here for consistency
      // Try to play the video
      const playPromise = remoteVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing remote video:', error);
        });
      }
    } else if (remoteVideoRef.current && !remoteStream) {
      remoteVideoRef.current.srcObject = null;
    }
  }, [remoteStream]);

  if (!isInCall && !isCalling && !isReceivingCall) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-bg-primary rounded-lg p-6 max-w-4xl w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-primary">
            {isReceivingCall ? `Incoming ${callType} call` : isCalling ? `Calling...` : `${callType} Call`}
          </h2>
          {!isReceivingCall && (
            <button
              onClick={endCall}
              className="text-text-secondary hover:text-text-primary"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Error Message */}
        {callError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="text-sm font-medium">{callError}</p>
            {canRetryCall && (
              <button
                onClick={retryCall}
                className="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors flex items-center gap-1"
              >
                <RotateCcw size={14} />
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Call content */}
        {isReceivingCall ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">
                {caller?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              {caller?.fullName}
            </h3>
            <p className="text-text-secondary mb-8">
              Incoming {callType} call...
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={rejectCall}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4"
              >
                <PhoneOff size={24} />
              </button>
              <button
                onClick={answerCall}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4"
              >
                {callType === 'video' ? <Video size={24} /> : <Mic size={24} />}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Remote video */}
            {remoteStream && remoteStream.getVideoTracks().length > 0 ? (
              <video
                ref={(el) => {
                  remoteVideoRef.current = el;
                  if (el && remoteStream) {
                    el.srcObject = remoteStream;
                  }
                }}
                autoPlay
                playsInline
                className="w-full h-96 bg-black rounded-lg object-cover"
                style={{ display: 'block' }}
              />
            ) : (
              <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {caller?.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-lg">{caller?.fullName}</p>
                  <p className="text-sm opacity-75">
                    {isCalling ? 'Calling...' : 'Connected'}
                  </p>
                  {remoteStream && (
                    <p className="text-xs opacity-50 mt-2">
                      Audio call - {remoteStream.getAudioTracks().length} audio track(s)
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Local video (picture-in-picture) */}
            {callType === 'video' && localStream && (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute top-4 right-4 w-32 h-24 bg-black rounded-lg object-cover border-2 border-white"
                style={{ display: 'block' }}
              />
            )}

            {/* Call controls */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-3">
                <Mic size={20} />
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-3">
                <Video size={20} />
              </button>
              <button
                onClick={endCall}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calls;
