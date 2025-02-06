import React, { useState, useRef } from 'react';
import { View, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, XStack, YStack } from 'tamagui';
import { Pencil, X, Camera as CameraIcon, SwitchCamera } from '@tamagui/lucide-icons';

export default function ProfileImage({ imageUri }: { readonly imageUri?: string }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [showCamera, setShowCamera] = useState(false);
    const [photo, setPhoto] = useState<string>();
    const [facing, setFacing] = useState<CameraType>('front');
    const cameraRef = useRef<CameraView>(null);

    const openCamera = async () => {
        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) return;
        }
        setShowCamera(true);
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            setPhoto(photo?.uri);
            setShowCamera(false);
        }
    };

    const cancelPhoto = () => {
        setPhoto(undefined);
    };

    const updatePhoto = () => {
        console.log('Updating photo:', photo);
    };

    if (!permission) {
        return <View />;
    }

    if (showCamera) {
        return (
            <YStack height="100%" width="100%" position="absolute" top={0} left={0} zIndex={999}>
                <CameraView
                    ref={cameraRef}
                    style={{ flex: 1, height: "100%" }}
                    facing={facing}
                >
                    <YStack flex={1} justifyContent="space-between">
                        <Button
                            icon={X}
                            circular
                            margin="$2"
                            onPress={() => setShowCamera(false)}
                        />
                        <XStack padding="$4" justifyContent="space-around" marginBottom="-$20">
                            <Button
                                icon={SwitchCamera}
                                circular
                                size="$6"
                                onPress={toggleCameraFacing}
                            />
                            <Button
                                icon={CameraIcon}
                                circular
                                size="$6"
                                onPress={takePicture}
                            />
                        </XStack>
                    </YStack>
                </CameraView>
            </YStack>
        );
    }

    return (
        <YStack>
            <Image
                source={{
                    uri: photo ?? imageUri ?? 'https://api.dicebear.com/7.x/avataaars/png?seed=default'
                }}
                style={{ width: 150, height: 150, borderRadius: 75 }}
            />
            <Button
                position="absolute"
                bottom={0}
                right={0}
                icon={Pencil}
                circular
                onPress={openCamera}
            />
            {photo && (
                <XStack gap="$2" marginTop="$2">
                    <Button
                        onPress={cancelPhoto}
                        theme="red"
                        icon={X}
                    >
                        Cancel
                    </Button>
                    <Button
                        icon={CameraIcon}
                        onPress={updatePhoto}
                    >
                        Update
                    </Button>
                </XStack>
            )}
        </YStack>
    );
}