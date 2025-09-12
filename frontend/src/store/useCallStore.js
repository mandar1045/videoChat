import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useCallStore = create((set, get) => ({
  // Initialize socket listeners
  initSocketListeners: () => {
    const socket = useAuthStore.getState().socket;
    console.log('initSocketListeners called, socket:', socket);
    console.log('Socket connected:', socket?.connected);

    if (!socket) {
      console.error('No socket available for call listeners');
      return;
    }

    console.log('Setting up call event listeners...');

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

  startCall: async (userId, type) => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;
    const selectedUser = useChatStore.getState().selectedUser;

    console.log('🚀 STARTING CALL - startCall called with:', { userId, type });
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
    if (authUser && userId === authUser._id) {
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
            to: userId,
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

      console.log('Emitting call-user', { to: userId, offer, type });

      if (socket && socket.connected) {
        socket.emit('call-user', {
          to: userId,
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