import { useRef, useEffect } from "react";
import { X, Mic, Video, PhoneOff } from "lucide-react";
import { useCallStore } from "../store/useCallStore";
import { useAuthStore } from "../store/useAuthStore";

const GroupCalls = () => {
  const { authUser } = useAuthStore();
  const {
    isInGroupCall,
    isStartingGroupCall,
    isReceivingGroupCall,
    currentGroupCall,
    groupLocalStream,
    groupRemoteStreams,
    joinGroupCall,
    leaveGroupCall,
    endGroupCall,
  } = useCallStore();

  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});

  useEffect(() => {
    if (localVideoRef.current && groupLocalStream) {
      localVideoRef.current.srcObject = groupLocalStream;
    } else if (localVideoRef.current && !groupLocalStream) {
      localVideoRef.current.srcObject = null;
    }
  }, [groupLocalStream]);

  useEffect(() => {
    // Update remote video elements when remote streams change
    Object.entries(groupRemoteStreams).forEach(([userId, stream]) => {
      const videoRef = remoteVideoRefs.current[userId];
      if (videoRef && stream && videoRef.srcObject !== stream) {
        videoRef.srcObject = stream;
        
        // Try to play the video
        const playPromise = videoRef.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing remote video for user:', userId, error);
          });
        }
      }
    });
  }, [groupRemoteStreams]);

  if (!isInGroupCall && !isStartingGroupCall && !isReceivingGroupCall) {
    return null;
  }

  const handleAcceptGroupCall = () => {
    if (currentGroupCall) {
      joinGroupCall(currentGroupCall.groupId);
    }
  };

  const handleRejectGroupCall = () => {
    // For now, just leave if receiving
    if (isReceivingGroupCall) {
      leaveGroupCall();
    }
  };

  const participants = currentGroupCall?.participants || [];
  const remoteParticipants = participants.filter(p => p !== authUser?._id);
  const totalParticipants = participants.length;

  // Dynamic grid classes based on number of video slots (local + remote participants)
  const getGridClasses = () => {
    const videoSlots = (groupLocalStream ? 1 : 0) + remoteParticipants.length;
    if (videoSlots <= 1) return 'grid-cols-1';
    if (videoSlots <= 2) return 'grid-cols-1 md:grid-cols-2';
    if (videoSlots <= 4) return 'grid-cols-2';
    if (videoSlots <= 6) return 'grid-cols-2 md:grid-cols-3';
    if (videoSlots <= 9) return 'grid-cols-3';
    return 'grid-cols-3 md:grid-cols-4';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-bg-primary rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-primary">
            {isReceivingGroupCall
              ? `Incoming Group ${currentGroupCall?.callType} Call`
              : isStartingGroupCall
                ? 'Starting Group Call...'
                : `Group ${currentGroupCall?.callType} Call (${participants.length} participants)`
            }
          </h2>
          {!isReceivingGroupCall && (
            <button
              onClick={isStartingGroupCall ? leaveGroupCall : endGroupCall}
              className="text-text-secondary hover:text-text-primary"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Call content */}
        {isReceivingGroupCall ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">G</span>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Group {currentGroupCall?.callType} Call
            </h3>
            <p className="text-text-secondary mb-8">
              Incoming group {currentGroupCall?.callType} call...
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRejectGroupCall}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4"
              >
                <PhoneOff size={24} />
              </button>
              <button
                onClick={handleAcceptGroupCall}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4"
              >
                {currentGroupCall?.callType === 'video' ? <Video size={24} /> : <Mic size={24} />}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[500px]">
            {/* Video grid */}
            <div className={`flex-1 grid ${getGridClasses()} gap-4 mb-4 overflow-y-auto`}>
              {/* Local video - always show if we have a stream */}
              {groupLocalStream && (
                <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    You
                  </div>
                </div>
              )}

              {/* Show placeholder for local video if no stream but we're in call */}
              {!groupLocalStream && isInGroupCall && (
                <div className="relative bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {authUser?.fullName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <p className="text-sm">Setting up camera...</p>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    You
                  </div>
                </div>
              )}

              {/* Remote videos */}
              {remoteParticipants.map((participantId) => (
                <div key={participantId} className="relative bg-gray-800 rounded-lg overflow-hidden">
                  {groupRemoteStreams[participantId] ? (
                    <video
                      ref={(el) => {
                        if (el) {
                          remoteVideoRefs.current[participantId] = el;
                          
                          // If we already have a stream, set it immediately
                          const stream = groupRemoteStreams[participantId];
                          if (stream && el.srcObject !== stream) {
                            el.srcObject = stream;
                            const playPromise = el.play();
                            if (playPromise !== undefined) {
                              playPromise.catch(error => {
                                console.error('Error playing video for user:', participantId, error);
                              });
                            }
                          }
                        }
                      }}
                      autoPlay
                      playsInline
                      muted={false}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-lg font-bold">
                            {participantId.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm">Connecting...</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {participantId === authUser?._id ? 'You' : `User ${participantId.slice(-4)}`}
                  </div>
                </div>
              ))}
            </div>

            {/* Call controls */}
            <div className="flex justify-center gap-4">
              <button className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-3">
                <Mic size={20} />
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-3">
                <Video size={20} />
              </button>
              <button
                onClick={leaveGroupCall}
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

export default GroupCalls;