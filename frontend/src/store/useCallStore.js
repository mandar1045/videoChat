import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useCallStore = create((set, get) => ({
  // Initialize socket listeners
  initSocketListeners: () => {
    const socket = useAuthStore.getState().socket;
    console.log('🔌 FRONTEND: initSocketListeners called, socket:', socket);
    console.log('🔌 FRONTEND: Socket connected:', socket?.connected);

    if (!socket) {
      console.error('🔌 FRONTEND: No socket available for call listeners');
      return;
    }

    console.log('🔌 FRONTEND: Setting up call event listeners...');

    socket.on("incoming-call", (data) => {
      console.log('📞 RECEIVED INCOMING CALL EVENT:', data);
      console.log('📞 Caller info:', data.from);
      console.log('📞 Call type:', data.type);
      console.log('📞 Offer present:', !!data.offer);
      get().handleIncomingCall(data);
    });

    socket.on("call-accepted", (data) => {
      console.log('✅ RECEIVED CALL ACCEPTED EVENT:', data);
      console.log('✅ Answer received:', !!data.answer);
      get().handleCallAccepted(data);
    });

    socket.on("call-rejected", () => {
      console.log('❌ RECEIVED CALL REJECTED EVENT');
      get().handleCallRejected();
    });

    socket.on("ice-candidate", (data) => {
      console.log('🧊 RECEIVED ICE CANDIDATE EVENT:', data.candidate?.type);
      get().handleIceCandidate(data);
    });

    socket.on("call-ended", () => {
      console.log('🔚 RECEIVED CALL ENDED EVENT');
      get().endCall();
    });

    // Group call event listeners
    socket.on("group-call-started", (data) => {
      console.log('📞 FRONTEND: RECEIVED GROUP-CALL-STARTED EVENT:', data);
      get().handleGroupCallStarted(data);
    });

    socket.on("group-participant-joined", (data) => {
      console.log('📞 FRONTEND: RECEIVED GROUP-PARTICIPANT-JOINED EVENT:', data);
      get().handleGroupParticipantJoined(data);
    });

    socket.on("group-participant-left", (data) => {
      console.log('📞 FRONTEND: RECEIVED GROUP-PARTICIPANT-LEFT EVENT:', data);
      get().handleGroupParticipantLeft(data);
    });

    socket.on("group-call-ended", (data) => {
      console.log('📞 FRONTEND: RECEIVED GROUP-CALL-ENDED EVENT:', data);
      get().handleGroupCallEnded(data);
    });

    socket.on("group-offer", (data) => {
      console.log('📞 FRONTEND: RECEIVED GROUP-OFFER EVENT:', data);
      get().handleGroupOffer(data);
    });

    socket.on("group-answer", (data) => {
      console.log('📞 FRONTEND: RECEIVED GROUP-ANSWER EVENT:', data);
      get().handleGroupAnswer(data);
    });

    socket.on("group-ice-candidate", (data) => {
      console.log('🧊 FRONTEND: RECEIVED GROUP-ICE-CANDIDATE EVENT:', data);
      get().handleGroupIceCandidate(data);
    });

    console.log('Call event listeners set up successfully');
  },

  isInCall: false,
  isCalling: false,
  isReceivingCall: false,
  caller: null,
  callType: null, // 'audio' or 'video'
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  iceCandidatesQueue: [], // Queue for ICE candidates received before remote description

  // Group call state
  isInGroupCall: false,
  isStartingGroupCall: false,
  isReceivingGroupCall: false,
  currentGroupCall: null, // { groupId, callType, participants: [], startedBy, startedAt }
  groupLocalStream: null,
  groupRemoteStreams: {}, // { userId: MediaStream }
  groupPeerConnections: {}, // { userId: RTCPeerConnection }
  groupIceCandidatesQueues: {}, // { userId: [] }

  startCall: async (targetId, type) => {
    const selectedUser = useChatStore.getState().selectedUser;
    const selectedGroup = useChatStore.getState().selectedGroup;

    // Check if it's a group call
    if (selectedGroup && selectedGroup._id === targetId) {
      console.log('Starting group call');
      get().startGroupCall(targetId, type);
      return;
    }

    // Individual call logic
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;

    console.log('🚀 STARTING INDIVIDUAL CALL - startCall called with:', { targetId, type });
    console.log('🔌 Socket available:', !!socket);
    console.log('🔌 Socket connected:', socket?.connected);
    console.log('👤 Auth user:', authUser);
    console.log('🎯 Selected user:', selectedUser);
    console.log('🔗 Socket ID:', socket?.id);
    console.log('🌐 Socket URL:', socket?.io?.uri);

    if (!socket) {
      console.error('No socket available for call - proceeding anyway');
      // Don't return, try to proceed
    }

    if (socket && !socket.connected) {
      console.error('Socket not connected - proceeding anyway');
      // Don't return, try to proceed
    }

    // Prevent calling yourself
    if (authUser && targetId === authUser._id) {
      console.error('Cannot call yourself');
      return;
    }

    console.log('Setting call state: isCalling=true, callType=', type);
    set({ isCalling: true, callType: type, caller: selectedUser });
    console.log('Call state set successfully');

    // Get user media
    try {
      const constraints = {
        audio: true,
        video: type === 'video' ? true : false,
      };

      console.log('Requesting media with constraints:', constraints);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got media stream with tracks:', stream.getTracks().map(t => ({ kind: t.kind, label: t.label })));

      set({ localStream: stream });

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          {
            urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
            username: 'webrtc',
            credential: 'webrtc'
          }
        ],
        iceCandidatePoolSize: 10,
      });

      pc.onicecandidate = (event) => {
        console.log('ICE candidate for caller:', event.candidate);
        if (event.candidate) {
          socket.emit('ice-candidate', {
            candidate: event.candidate,
            to: targetId,
          });
          console.log('ICE candidate sent');
        } else {
          console.log('ICE candidate gathering complete for caller');
        }
      };

      pc.ontrack = (event) => {
        console.log('🎯 ONTRACK EVENT FIRED FOR CALLER - THIS IS IMPORTANT!');
        console.log('Event object:', event);
        console.log('Event streams:', event.streams);
        console.log('Number of streams:', event.streams?.length);

        if (!event.streams || event.streams.length === 0) {
          console.error('❌ No streams in ontrack event for caller');
          return;
        }

        const remoteMediaStream = event.streams[0];
        console.log('📺 Remote media stream for caller:', remoteMediaStream);
        console.log('🎵 Remote media stream tracks:', remoteMediaStream.getTracks().map(t => ({
          kind: t.kind,
          id: t.id,
          enabled: t.enabled,
          readyState: t.readyState
        })));

        // Ensure tracks are enabled
        remoteMediaStream.getTracks().forEach(track => {
          if (!track.enabled) {
            console.log(`⚠️ Enabling ${track.kind} track for caller`);
            track.enabled = true;
          }
        });

        if (remoteMediaStream.getTracks().length > 0) {
          set({ remoteStream: remoteMediaStream });
          console.log('✅ Remote stream set for caller with', remoteMediaStream.getTracks().length, 'tracks');
        } else {
          console.warn('⚠️ Remote stream has no tracks for caller');
        }
      };

      // Add local stream tracks
      console.log('🎥 Adding local tracks to peer connection...');
      stream.getTracks().forEach(track => {
        console.log('📤 Adding track to peer connection:', {
          kind: track.kind,
          id: track.id,
          enabled: track.enabled,
          label: track.label,
          readyState: track.readyState
        });

        // Ensure track is enabled before adding
        if (!track.enabled) {
          track.enabled = true;
          console.log(`✅ Enabled ${track.kind} track`);
        }

        const sender = pc.addTrack(track, stream);
        console.log('✅ Track added to peer connection, sender:', sender);
      });
      console.log('🎥 Finished adding local tracks');

      set({ peerConnection: pc });

      pc.onconnectionstatechange = () => {
        console.log('Connection state for caller:', pc.connectionState);
        if (pc.connectionState === 'connected') {
          console.log('✅ WebRTC connection established for caller');
        } else if (pc.connectionState === 'failed') {
          console.error('❌ WebRTC connection failed for caller');
        }
      };

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log('Emitting call-user', { to: targetId, offer, type });

      if (socket && socket.connected) {
        socket.emit('call-user', {
          to: targetId,
          offer,
          type,
        });

        console.log('🎯 Call-user event emitted successfully');

        // Add a timeout to check if call is answered
        setTimeout(() => {
          const currentState = get();
          if (currentState.isCalling && !currentState.isInCall) {
            console.warn('⚠️ Call not answered within 30 seconds, ending call');
            get().endCall();
          }
        }, 30000);

      } else {
        console.error('❌ Socket not available or not connected');
        set({ isCalling: false });
        return;
      }
    } catch (error) {
      console.error('Error starting call:', error);
      set({ isCalling: false });
    }
  },

  answerCall: async () => {
    const { peerConnection, callType, caller } = get();
    const socket = useAuthStore.getState().socket;

    console.log('📞 Answering call from:', caller);

    if (!peerConnection || !socket) {
      console.error('❌ Cannot answer call: missing peerConnection or socket');
      return;
    }

    if (!caller) {
      console.error('❌ Cannot answer call: no caller info');
      return;
    }

    set({ isReceivingCall: false, isInCall: true });
    console.log('✅ Call state updated: isReceivingCall=false, isInCall=true');

    try {
      console.log('🎯 Creating answer...');

      const constraints = {
        audio: true,
        video: callType === 'video' ? true : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got user media for answer with tracks:', stream.getTracks().map(t => ({ kind: t.kind, label: t.label })));

      set({ localStream: stream });

      // Add tracks to peer connection
      console.log('🎥 Adding local tracks to peer connection for answer...');
      stream.getTracks().forEach(track => {
        console.log('📤 Adding track to peer connection for answer:', {
          kind: track.kind,
          id: track.id,
          enabled: track.enabled,
          label: track.label,
          readyState: track.readyState
        });

        // Ensure track is enabled before adding
        if (!track.enabled) {
          track.enabled = true;
          console.log(`✅ Enabled ${track.kind} track for answer`);
        }

        const sender = peerConnection.addTrack(track, stream);
        console.log('✅ Track added to peer connection for answer, sender:', sender);
      });
      console.log('🎥 Finished adding local tracks for answer');

      const answer = await peerConnection.createAnswer();
      console.log('✅ Created answer');
      await peerConnection.setLocalDescription(answer);
      console.log('✅ Set local description');

      const answerData = {
        answer,
        to: caller._id,
      };
      console.log('📤 Emitting answer-call event:', answerData);

      socket.emit('answer-call', answerData);
      console.log('🎯 Answer-call event emitted successfully');
    } catch (error) {
      console.error('Error answering call:', error);
    }
  },

  rejectCall: () => {
    const socket = useAuthStore.getState().socket;
    if (socket && get().caller) {
      socket.emit('reject-call', { to: get().caller._id });
    }
    get().endCall();
  },

  endCall: () => {
    const { localStream, peerConnection, caller } = get();
    const socket = useAuthStore.getState().socket;

    // Notify the other party that the call has ended
    if (socket && caller) {
      socket.emit('end-call', { to: caller._id });
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    if (peerConnection) {
      peerConnection.close();
    }

    set({
      isInCall: false,
      isCalling: false,
      isReceivingCall: false,
      caller: null,
      callType: null,
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      iceCandidatesQueue: [],
    });
  },

  handleIncomingCall: async (data) => {
    console.log('Handling incoming call:', data);

    // Create peer connection for receiving call
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        {
          urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
          username: 'webrtc',
          credential: 'webrtc'
        }
      ],
      iceCandidatePoolSize: 10,
    });

    const socket = useAuthStore.getState().socket;

    pc.onicecandidate = (event) => {
      console.log('ICE candidate for receiver:', event.candidate);
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          to: data.from._id,
        });
        console.log('ICE candidate sent from receiver');
      } else if (!event.candidate) {
        console.log('ICE candidate gathering complete for receiver');
      }
    };

    pc.ontrack = (event) => {
      console.log('🎯 ONTRACK EVENT FIRED FOR RECEIVER - THIS IS IMPORTANT!');
      console.log('Event object:', event);
      console.log('Event streams:', event.streams);
      console.log('Number of streams:', event.streams?.length);

      if (!event.streams || event.streams.length === 0) {
        console.error('❌ No streams in ontrack event for receiver');
        return;
      }

      const remoteMediaStream = event.streams[0];
      console.log('📺 Remote media stream for receiver:', remoteMediaStream);
      console.log('🎵 Remote media stream tracks:', remoteMediaStream.getTracks().map(t => ({
        kind: t.kind,
        id: t.id,
        enabled: t.enabled,
        readyState: t.readyState
      })));

      // Ensure tracks are enabled
      remoteMediaStream.getTracks().forEach(track => {
        if (!track.enabled) {
          console.log(`⚠️ Enabling ${track.kind} track for receiver`);
          track.enabled = true;
        }
      });

      if (remoteMediaStream.getTracks().length > 0) {
        set({ remoteStream: remoteMediaStream });
        console.log('✅ Remote stream set for receiver with', remoteMediaStream.getTracks().length, 'tracks');
      } else {
        console.warn('⚠️ Remote stream has no tracks for receiver');
      }
    };

    try {
      // Set remote description with the offer
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      console.log('✅ Remote description set for receiver');

      set({
        isReceivingCall: true,
        caller: data.from,
        callType: data.type,
        peerConnection: pc,
      });

      // Process any queued ICE candidates
      get().processQueuedIceCandidates();

      pc.onconnectionstatechange = () => {
        console.log('Connection state for receiver:', pc.connectionState);
        if (pc.connectionState === 'connected') {
          console.log('✅ WebRTC connection established for receiver');
        } else if (pc.connectionState === 'failed') {
          console.error('❌ WebRTC connection failed for receiver');
        }
      };
    } catch (error) {
      console.error('Error setting remote description:', error);
    }
  },

  handleCallAccepted: async (data) => {
    console.log('✅ Handling call accepted:', data);
    console.log('📋 Answer data received:', !!data.answer);

    const { peerConnection } = get();
    if (peerConnection) {
      console.log('🔄 Setting remote description with answer');
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        console.log('✅ Remote description set for caller');

        // Process any queued ICE candidates
        get().processQueuedIceCandidates();

        console.log('🔄 Setting call state: isCalling=false, isInCall=true');
        set({ isCalling: false, isInCall: true });
        console.log('✅ Call state updated successfully');
      } catch (error) {
        console.error('❌ Error setting remote description:', error);
      }
    } else {
      console.error('❌ No peer connection found when handling call accepted');
    }
  },

  handleCallRejected: () => {
    get().endCall();
  },

  handleIceCandidate: async (data) => {
    console.log('📡 Received ICE candidate:', data.candidate);
    const { peerConnection, iceCandidatesQueue } = get();

    if (peerConnection && data.candidate) {
      const candidate = new RTCIceCandidate(data.candidate);
      console.log('Created RTCIceCandidate:', candidate);

      // If remote description is not set yet, queue the candidate
      if (peerConnection.remoteDescription === null) {
        console.log('⏳ Remote description not set, queuing ICE candidate');
        iceCandidatesQueue.push(candidate);
        set({ iceCandidatesQueue });
        console.log('ICE candidate queued, queue length:', iceCandidatesQueue.length);
      } else {
        // Remote description is set, add candidate immediately
        try {
          await peerConnection.addIceCandidate(candidate);
          console.log('✅ ICE candidate added successfully');
        } catch (error) {
          console.error('❌ Error adding ICE candidate:', error);
        }
      }
    } else {
      console.warn('⚠️ No peer connection or candidate data');
    }
  },

  // Process queued ICE candidates after remote description is set
  processQueuedIceCandidates: async () => {
    const { peerConnection, iceCandidatesQueue } = get();
    if (peerConnection && iceCandidatesQueue.length > 0) {
      console.log(`🔄 Processing ${iceCandidatesQueue.length} queued ICE candidates`);
      for (const candidate of iceCandidatesQueue) {
        try {
          await peerConnection.addIceCandidate(candidate);
          console.log('✅ Queued ICE candidate added successfully');
        } catch (error) {
          console.error('❌ Error adding queued ICE candidate:', error);
        }
      }
      set({ iceCandidatesQueue: [] });
      console.log('🗑️ Cleared ICE candidates queue');
    } else {
      console.log('ℹ️ No queued ICE candidates to process');
    }
  },

  // Group call functions
  startGroupCall: async (groupId, type) => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;

    console.log('🚀 FRONTEND: STARTING GROUP CALL - startGroupCall called with:', { groupId, type });
    console.log('🚀 FRONTEND: Socket available:', !!socket);
    console.log('🚀 FRONTEND: Socket connected:', socket?.connected);
    console.log('🚀 FRONTEND: Auth user:', authUser);

    if (!socket || !socket.connected) {
      console.error('🚀 FRONTEND: No socket available for group call');
      return;
    }

    set({ isStartingGroupCall: true });

    try {
      // Get user media
      const constraints = {
        audio: true,
        video: type === 'video' ? true : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got media stream for group call with tracks:', stream.getTracks().map(t => ({ kind: t.kind, label: t.label })));

      set({ groupLocalStream: stream });

      // Immediately set up the call state for the initiator
      set({
        isStartingGroupCall: false,
        isInGroupCall: true,
        currentGroupCall: {
          groupId,
          callType: type,
          participants: [authUser._id], // Start with just the initiator
          startedBy: authUser,
          startedAt: new Date(),
        },
      });

      // Emit start group call event
      socket.emit('start-group-call', {
        groupId,
        type,
      });

      console.log('🎯 Start-group-call event emitted successfully');
    } catch (error) {
      console.error('Error starting group call:', error);
      set({ isStartingGroupCall: false });
    }
  },

  joinGroupCall: async (groupId) => {
    const socket = useAuthStore.getState().socket;
    const { currentGroupCall } = get();
    const authUser = useAuthStore.getState().authUser;

    console.log('📞 JOINING GROUP CALL - joinGroupCall called with:', { groupId });

    if (!socket || !socket.connected) {
      console.error('No socket available for joining group call');
      return;
    }

    if (!currentGroupCall || currentGroupCall.groupId !== groupId) {
      console.error('No active group call to join');
      return;
    }

    try {
      // Get user media if not already have
      let { groupLocalStream } = get();
      if (!groupLocalStream) {
        const constraints = {
          audio: true,
          video: currentGroupCall.callType === 'video' ? true : false,
        };
        groupLocalStream = await navigator.mediaDevices.getUserMedia(constraints);
        set({ groupLocalStream });
      }

      // Transition to in-call state
      set({
        isReceivingGroupCall: false,
        isInGroupCall: true,
      });

      // Emit join group call event
      socket.emit('join-group-call', {
        groupId,
      });

      console.log('🎯 Join-group-call event emitted successfully');

      // Create peer connections with all other participants and send offers
      const otherParticipants = currentGroupCall.participants.filter(p => p !== authUser._id);
      for (const participantId of otherParticipants) {
        const pc = get().createGroupPeerConnection(participantId);
        if (pc) {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit('group-offer', {
              groupId,
              targetUserId: participantId,
              offer,
            });

            console.log('Sent group offer to existing participant:', participantId);
          } catch (error) {
            console.error('Error creating/sending group offer to existing participant:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error joining group call:', error);
    }
  },

  leaveGroupCall: () => {
    const socket = useAuthStore.getState().socket;
    const { currentGroupCall, groupLocalStream, groupPeerConnections } = get();

    if (!currentGroupCall) {
      console.error('No active group call to leave');
      return;
    }

    // Notify others
    if (socket && socket.connected) {
      socket.emit('leave-group-call', {
        groupId: currentGroupCall.groupId,
      });
    }

    // Clean up
    if (groupLocalStream) {
      groupLocalStream.getTracks().forEach(track => track.stop());
    }

    Object.values(groupPeerConnections).forEach(pc => {
      if (pc) pc.close();
    });

    set({
      isInGroupCall: false,
      isStartingGroupCall: false,
      isReceivingGroupCall: false,
      currentGroupCall: null,
      groupLocalStream: null,
      groupRemoteStreams: {},
      groupPeerConnections: {},
      groupIceCandidatesQueues: {},
    });
  },

  endGroupCall: () => {
    const socket = useAuthStore.getState().socket;
    const { currentGroupCall } = get();

    if (!currentGroupCall) {
      console.error('No active group call to end');
      return;
    }

    // Notify others
    if (socket && socket.connected) {
      socket.emit('end-group-call', {
        groupId: currentGroupCall.groupId,
      });
    }

    get().leaveGroupCall();
  },

  // Group call event handlers
  handleGroupCallStarted: async (data) => {
    console.log('🎯 FRONTEND: Handling group call started:', data);
    const authUser = useAuthStore.getState().authUser;
    const socket = useAuthStore.getState().socket;
    const { isInGroupCall, currentGroupCall } = get();

    console.log('🎯 FRONTEND: Current authUser:', authUser);
    console.log('🎯 FRONTEND: Current socket:', socket);
    console.log('🎯 FRONTEND: Already in group call:', isInGroupCall);

    // Check if this user started the call
    const isInitiator = data.startedBy._id === authUser._id;

    if (isInitiator && !isInGroupCall) {
      // User started the call but hasn't transitioned to in-call state yet
      set({
        isStartingGroupCall: false,
        isInGroupCall: true,
        currentGroupCall: {
          groupId: data.groupId,
          callType: data.callType,
          participants: data.participants,
          startedBy: data.startedBy,
          startedAt: new Date(),
        },
      });

      // Create peer connections with all other participants and send offers
      const otherParticipants = data.participants.filter(p => p !== authUser._id);
      for (const participantId of otherParticipants) {
        const pc = get().createGroupPeerConnection(participantId);
        if (pc) {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit('group-offer', {
              groupId: data.groupId,
              targetUserId: participantId,
              offer,
            });

            console.log('Sent group offer to:', participantId);
          } catch (error) {
            console.error('Error creating/sending group offer:', error);
          }
        }
      }
    } else if (isInitiator && isInGroupCall) {
      // User is the initiator and already in the call - just update participants
      set({
        currentGroupCall: {
          ...currentGroupCall,
          participants: data.participants,
        },
      });
    } else {
      // User is receiving notification about a group call
      set({
        isReceivingGroupCall: true,
        currentGroupCall: {
          groupId: data.groupId,
          callType: data.callType,
          participants: data.participants,
          startedBy: data.startedBy,
          startedAt: new Date(),
        },
      });
    }
  },

  handleGroupParticipantJoined: async (data) => {
    console.log('Handling group participant joined:', data);
    const { currentGroupCall } = get();
    const authUser = useAuthStore.getState().authUser;
    const socket = useAuthStore.getState().socket;

    if (currentGroupCall && currentGroupCall.groupId === data.groupId) {
      set({
        currentGroupCall: {
          ...currentGroupCall,
          participants: data.participants,
        },
      });

      // Only create peer connection and send offer if we're already in the call
      // and the new participant is not ourselves
      if (get().isInGroupCall && data.participant._id !== authUser._id) {
        const pc = get().createGroupPeerConnection(data.participant._id);
        if (pc) {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit('group-offer', {
              groupId: data.groupId,
              targetUserId: data.participant._id,
              offer,
            });

            console.log('Sent group offer to new participant:', data.participant._id);
          } catch (error) {
            console.error('Error creating/sending group offer to new participant:', error);
          }
        }
      }
    }
  },

  handleGroupParticipantLeft: (data) => {
    console.log('Handling group participant left:', data);
    const { currentGroupCall, groupRemoteStreams, groupPeerConnections, groupIceCandidatesQueues } = get();
    if (currentGroupCall && currentGroupCall.groupId === data.groupId) {
      const updatedParticipants = data.participants;
      set({
        currentGroupCall: {
          ...currentGroupCall,
          participants: updatedParticipants,
        },
      });

      // Clean up peer connection for left participant
      const userId = data.participant._id;
      if (groupPeerConnections[userId]) {
        groupPeerConnections[userId].close();
        delete groupPeerConnections[userId];
      }
      if (groupRemoteStreams[userId]) {
        delete groupRemoteStreams[userId];
      }
      if (groupIceCandidatesQueues[userId]) {
        delete groupIceCandidatesQueues[userId];
      }

      set({
        groupPeerConnections: { ...groupPeerConnections },
        groupRemoteStreams: { ...groupRemoteStreams },
        groupIceCandidatesQueues: { ...groupIceCandidatesQueues },
      });
    }
  },

  handleGroupCallEnded: (data) => {
    console.log('Handling group call ended:', data);
    const { currentGroupCall } = get();
    if (currentGroupCall && currentGroupCall.groupId === data.groupId) {
      get().leaveGroupCall();
    }
  },

  createGroupPeerConnection: (targetUserId) => {
    const socket = useAuthStore.getState().socket;
    const { groupLocalStream, groupPeerConnections, groupIceCandidatesQueues } = get();

    console.log('🔗 FRONTEND: Creating group peer connection for user:', targetUserId);

    if (!groupLocalStream) {
      console.error('🔗 FRONTEND: No local stream for group call');
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        {
          urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
          username: 'webrtc',
          credential: 'webrtc'
        }
      ],
      iceCandidatePoolSize: 10,
    });

    console.log('🔗 FRONTEND: RTCPeerConnection created for user:', targetUserId);

    pc.onicecandidate = (event) => {
      console.log('🧊 FRONTEND: Group ICE candidate for user:', targetUserId, event.candidate);
      if (event.candidate && socket) {
        socket.emit('group-ice-candidate', {
          groupId: get().currentGroupCall.groupId,
          targetUserId,
          candidate: event.candidate,
        });
        console.log('🧊 FRONTEND: Group ICE candidate sent to user:', targetUserId);
      } else if (!event.candidate) {
        console.log('🧊 FRONTEND: ICE gathering complete for user:', targetUserId);
      }
    };

    pc.ontrack = (event) => {
      console.log('🎯 FRONTEND: Group ONTRACK EVENT FIRED for user:', targetUserId);
      console.log('🎯 FRONTEND: Event streams:', event.streams);

      if (event.streams && event.streams.length > 0) {
        const remoteStream = event.streams[0];
        console.log('🎯 FRONTEND: Remote stream received:', remoteStream);
        console.log('🎯 FRONTEND: Stream tracks:', remoteStream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));

        // Ensure tracks are enabled
        remoteStream.getTracks().forEach(track => {
          if (!track.enabled) {
            console.log('🎯 FRONTEND: Enabling track:', track.kind);
            track.enabled = true;
          }
        });

        set(state => ({
          groupRemoteStreams: {
            ...state.groupRemoteStreams,
            [targetUserId]: remoteStream,
          },
        }));

        console.log('🎯 FRONTEND: Remote stream set for user:', targetUserId);
      } else {
        console.warn('🎯 FRONTEND: No streams in ontrack event for user:', targetUserId);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('🔗 FRONTEND: Connection state for user', targetUserId, ':', pc.connectionState);
      if (pc.connectionState === 'connected') {
        console.log('✅ FRONTEND: WebRTC connection established for user:', targetUserId);
      } else if (pc.connectionState === 'failed') {
        console.error('❌ FRONTEND: WebRTC connection failed for user:', targetUserId);
      }
    };

    // Add local tracks
    console.log('🔗 FRONTEND: Adding local tracks to peer connection for user:', targetUserId);
    groupLocalStream.getTracks().forEach(track => {
      console.log('🔗 FRONTEND: Adding track:', track.kind, 'enabled:', track.enabled);
      pc.addTrack(track, groupLocalStream);
    });

    groupPeerConnections[targetUserId] = pc;
    groupIceCandidatesQueues[targetUserId] = [];

    set({
      groupPeerConnections: { ...groupPeerConnections },
      groupIceCandidatesQueues: { ...groupIceCandidatesQueues },
    });

    console.log('🔗 FRONTEND: Peer connection created successfully for user:', targetUserId);
    return pc;
  },

  handleGroupOffer: async (data) => {
    console.log('📞 FRONTEND: Handling group offer:', data);
    const { groupId, from, offer } = data;
    const { currentGroupCall } = get();

    if (!currentGroupCall || currentGroupCall.groupId !== groupId) {
      console.error('📞 FRONTEND: No matching group call for offer');
      return;
    }

    console.log('📞 FRONTEND: Creating/using peer connection for user:', from);
    let pc = get().groupPeerConnections[from];
    if (!pc) {
      pc = get().createGroupPeerConnection(from);
      console.log('📞 FRONTEND: Created new peer connection for user:', from);
    } else {
      console.log('📞 FRONTEND: Using existing peer connection for user:', from);
    }

    try {
      console.log('📞 FRONTEND: Setting remote description...');
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('📞 FRONTEND: Remote description set successfully');

      console.log('📞 FRONTEND: Creating answer...');
      const answer = await pc.createAnswer();
      console.log('📞 FRONTEND: Answer created successfully');

      console.log('📞 FRONTEND: Setting local description...');
      await pc.setLocalDescription(answer);
      console.log('📞 FRONTEND: Local description set successfully');

      const socket = useAuthStore.getState().socket;
      console.log('📞 FRONTEND: Sending group answer to:', from);
      socket.emit('group-answer', {
        groupId,
        targetUserId: from,
        answer,
      });

      // Process queued ICE candidates
      get().processGroupQueuedIceCandidates(from);
      console.log('📞 FRONTEND: Group offer handled successfully');
    } catch (error) {
      console.error('📞 FRONTEND: Error handling group offer:', error);
    }
  },

  handleGroupAnswer: async (data) => {
    console.log('📞 FRONTEND: Handling group answer:', data);
    const { groupId, from, answer } = data;
    const pc = get().groupPeerConnections[from];

    if (pc) {
      try {
        console.log('📞 FRONTEND: Setting remote description with answer from:', from);
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('📞 FRONTEND: Remote description set successfully for user:', from);

        // Process queued ICE candidates
        get().processGroupQueuedIceCandidates(from);
        console.log('📞 FRONTEND: Group answer handled successfully');
      } catch (error) {
        console.error('📞 FRONTEND: Error handling group answer:', error);
      }
    } else {
      console.error('📞 FRONTEND: No peer connection found for user:', from);
    }
  },

  handleGroupIceCandidate: async (data) => {
    console.log('🧊 FRONTEND: Handling group ICE candidate:', data);
    const { groupId, from, candidate } = data;
    const pc = get().groupPeerConnections[from];
    const queue = get().groupIceCandidatesQueues[from];

    if (pc && candidate) {
      const iceCandidate = new RTCIceCandidate(candidate);
      console.log('🧊 FRONTEND: Created ICE candidate for user:', from);

      if (pc.remoteDescription) {
        try {
          console.log('🧊 FRONTEND: Adding ICE candidate immediately for user:', from);
          await pc.addIceCandidate(iceCandidate);
          console.log('🧊 FRONTEND: ICE candidate added successfully for user:', from);
        } catch (error) {
          console.error('🧊 FRONTEND: Error adding group ICE candidate:', error);
        }
      } else {
        // Queue the candidate
        console.log('🧊 FRONTEND: Queuing ICE candidate for user:', from);
        queue.push(iceCandidate);
        set(state => ({
          groupIceCandidatesQueues: {
            ...state.groupIceCandidatesQueues,
            [from]: queue,
          },
        }));
        console.log('🧊 FRONTEND: ICE candidate queued for user:', from, 'Queue length:', queue.length);
      }
    } else {
      console.warn('🧊 FRONTEND: Missing peer connection or candidate data for user:', from);
    }
  },

  processGroupQueuedIceCandidates: async (userId) => {
    const { groupPeerConnections, groupIceCandidatesQueues } = get();
    const pc = groupPeerConnections[userId];
    const queue = groupIceCandidatesQueues[userId];

    if (pc && queue && queue.length > 0) {
      console.log(`🔄 FRONTEND: Processing ${queue.length} queued group ICE candidates for ${userId}`);
      for (const candidate of queue) {
        try {
          console.log(`🔄 FRONTEND: Adding queued ICE candidate for ${userId}`);
          await pc.addIceCandidate(candidate);
          console.log(`🔄 FRONTEND: Queued ICE candidate added successfully for ${userId}`);
        } catch (error) {
          console.error('🔄 FRONTEND: Error adding queued group ICE candidate:', error);
        }
      }

      set(state => ({
        groupIceCandidatesQueues: {
          ...state.groupIceCandidatesQueues,
          [userId]: [],
        },
      }));
      console.log(`🔄 FRONTEND: Cleared ICE candidates queue for ${userId}`);
    } else {
      console.log(`🔄 FRONTEND: No queued ICE candidates to process for ${userId}`);
    }
  },

  // Debug function to check current call state
  debugCallState: () => {
    const state = get();
    console.log('=== 📊 CALL STATE DEBUG ===');
    console.log('isInCall:', state.isInCall);
    console.log('isCalling:', state.isCalling);
    console.log('isReceivingCall:', state.isReceivingCall);
    console.log('caller:', state.caller);
    console.log('callType:', state.callType);

    if (state.localStream) {
      console.log('📤 Local stream tracks:', state.localStream.getTracks().map(t => ({
        kind: t.kind,
        enabled: t.enabled,
        readyState: t.readyState
      })));
    } else {
      console.log('❌ No local stream');
    }

    if (state.remoteStream) {
      console.log('📥 Remote stream tracks:', state.remoteStream.getTracks().map(t => ({
        kind: t.kind,
        enabled: t.enabled,
        readyState: t.readyState
      })));
    } else {
      console.log('❌ No remote stream - THIS IS THE PROBLEM!');
    }

    if (state.peerConnection) {
      console.log('🔗 Peer connection state:', state.peerConnection.connectionState);
      console.log('🧊 ICE connection state:', state.peerConnection.iceConnectionState);
      console.log('📤 Senders:', state.peerConnection.getSenders().length);
      console.log('📥 Receivers:', state.peerConnection.getReceivers().length);
    } else {
      console.log('❌ No peer connection');
    }

    console.log('=== 🏁 END CALL STATE DEBUG ===');
  },
}));