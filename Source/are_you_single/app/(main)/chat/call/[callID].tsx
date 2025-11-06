import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'; 
import { useAuthStore } from '@store/useAuthStore';
import { ZegoConfig } from 'src/config/zegoConfig';

import { ZegoUIKitPrebuiltCall } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { router, useLocalSearchParams } from 'expo-router';

import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

export default function VideoCallScreen() {
  const { callID } = useLocalSearchParams<{ callID: string }>();
  const currentUser = useAuthStore((state) => state.user);
  const finalCallID = callID || 'test-call-id';

  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const requestPermissions = async () => {
      setIsLoading(true);
      try {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        const audioPermission = await Audio.requestPermissionsAsync();

        if (
          cameraPermission.status === 'granted' &&
          audioPermission.status === 'granted'
        ) {
          setHasPermission(true); // Đã có quyền
        } else {
          setHasPermission(false); // Bị từ chối
          alert('Bạn phải cấp quyền camera và micro để thực hiện cuộc gọi.');
          router.back();
        }
      } catch (e) {
        console.error('Lỗi xin quyền:', e);
        setHasPermission(false);
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    requestPermissions();
  }, []); 

  if (!currentUser) {
    router.back();
    return null;
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Đang xin quyền truy cập...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={ZegoConfig.appID}
        appSign={ZegoConfig.appSign}
        userID={currentUser._id}
        userName={currentUser.profile?.name || 'User'}
        callID={finalCallID}
        config={{
          onHangUp: () => {
            router.back();
          },
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          useSpeakerWhenJoining: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});