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
      console.log('🎥 SETTING LOCAL STREAM TO VIDEO ELEMENT');
      console.log('Local stream:', localStream);
      console.log('Local stream tracks:', localStream.getTracks().map(t => ({
        kind: t.kind,
        enabled: t.enabled,
        readyState: t.readyState,
        muted: t.muted
      })));
      console.log('Local stream active:', localStream.active);
      console.log('Local video element:', localVideoRef.current);
      console.log('Video element readyState before:', localVideoRef.current.readyState);

      // Check if video element already has a stream
      if (localVideoRef.current.srcObject) {
        console.log('Local video element already has srcObject, replacing it');
      }

      localVideoRef.current.srcObject = localStream;

      // Force the video element to load the new stream
      localVideoRef.current.load();
      console.log('Called load() on local video element');

      // Try to play immediately
      const playPromise = localVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Local video started playing successfully');
        }).catch(error => {
          console.error('Error playing local video:', error);
        });
      }

      // Add event listeners for debugging
      localVideoRef.current.onloadedmetadata = () => {
        console.log('Local video metadata loaded');
        console.log('Local video dimensions:', localVideoRef.current.videoWidth, 'x', localVideoRef.current.videoHeight);
        console.log('Video element readyState:', localVideoRef.current.readyState);
      };

      localVideoRef.current.oncanplay = () => {
        console.log('Local video can play');
        console.log('Video element readyState:', localVideoRef.current.readyState);
      };

      localVideoRef.current.onplay = () => {
        console.log('Local video started playing');
      };

      localVideoRef.current.onpause = () => {
        console.log('Local video paused');
      };

      localVideoRef.current.onerror = (error) => {
        console.error('Local video error:', error);
        console.error('Video error code:', error.code);
        console.error('Video error message:', error.message);
      };

      localVideoRef.current.onwaiting = () => {
        console.log('Local video is waiting for data');
      };

      localVideoRef.current.onstalled = () => {
        console.log('Local video stalled');
      };
    } else if (localVideoRef.current && !localStream) {
      console.log('Clearing local video element');
      localVideoRef.current.srcObject = null;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      console.log('Setting remote stream to video element:', remoteStream);
      console.log('Remote stream tracks:', remoteStream.getTracks());
      console.log('Remote stream active:', remoteStream.active);
      console.log('Remote video element:', remoteVideoRef.current);
      console.log('Remote video element readyState:', remoteVideoRef.current.readyState);
      window.remoteStream = remoteStream; // Add global reference for debugging

      // Check if video element already has a stream
      if (remoteVideoRef.current.srcObject) {
        console.log('Video element already has srcObject, replacing it');
      }

      console.log('🎥 REMOTE STREAM ALREADY SET VIA CALLBACK REF');
      console.log('Remote stream object:', remoteStream);
      console.log('Remote stream active:', remoteStream.active);
      console.log('Remote stream tracks:', remoteStream.getTracks().map(t => ({
        kind: t.kind,
        enabled: t.enabled,
        muted: t.muted,
        readyState: t.readyState
      })));
      console.log('Called load() on remote video element');

      // Check video element state after setting stream
      setTimeout(() => {
        console.log('🎥 VIDEO ELEMENT STATE AFTER STREAM SET:');
        console.log('Video readyState:', remoteVideoRef.current.readyState);
        console.log('Video networkState:', remoteVideoRef.current.networkState);
        console.log('Video srcObject:', remoteVideoRef.current.srcObject);
        console.log('Video videoWidth:', remoteVideoRef.current.videoWidth);
        console.log('Video videoHeight:', remoteVideoRef.current.videoHeight);
      }, 1000);

      // Add event listeners for debugging
      remoteVideoRef.current.onloadedmetadata = () => {
        console.log('Remote video metadata loaded');
        console.log('Video dimensions:', remoteVideoRef.current.videoWidth, 'x', remoteVideoRef.current.videoHeight);
      };

      remoteVideoRef.current.oncanplay = () => {
        console.log('Remote video can play');
        console.log('Video readyState:', remoteVideoRef.current.readyState);
      };

      remoteVideoRef.current.onplay = () => {
        console.log('Remote video started playing');
      };

      remoteVideoRef.current.onpause = () => {
        console.log('Remote video paused');
      };

      remoteVideoRef.current.onerror = (error) => {
        console.error('Remote video error:', error);
        console.error('Video error code:', error.code);
        console.error('Video error message:', error.message);
      };

      remoteVideoRef.current.onwaiting = () => {
        console.log('Remote video is waiting for data');
      };

      remoteVideoRef.current.onstalled = () => {
        console.log('Remote video stalled');
      };

      // Try to play the video, but handle autoplay restrictions
      const playPromise = remoteVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Remote video started playing successfully');
        }).catch(error => {
          console.error('Error playing remote video:', error);
          console.error('Play error name:', error.name);
          console.error('Play error message:', error.message);
          // If autoplay fails, we'll rely on user interaction
          // The video will show but won't autoplay due to browser policies
        });
      }
    } else if (remoteVideoRef.current && !remoteStream) {
      console.log('Clearing remote video element');
      remoteVideoRef.current.srcObject = null;
    }
  }, [remoteStream]);

  console.log('Calls component render check:', { isInCall, isCalling, isReceivingCall });

  if (!isInCall && !isCalling && !isReceivingCall) {
    console.log('Calls component not rendering - no active call state');
    return null;
  }

  console.log('Calls component rendering with state:', { isInCall, isCalling, isReceivingCall, callType, caller });

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
                    console.log('Setting remote stream via callback ref:', remoteStream);
                    el.srcObject = remoteStream;
                    el.load();
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
