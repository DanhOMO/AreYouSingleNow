import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const pickImageFromLibrary = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Cần cấp quyền',
      'Ứng dụng cần quyền truy cập thư viện ảnh để bạn có thể chọn ảnh.'
    );
    return null;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true, 
    aspect: [1, 1],      
    quality: 0.7,        
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};