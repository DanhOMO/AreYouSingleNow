import axios from "axios";
import { useAuthStore } from "@store/useAuthStore";
import { IP } from "src/types/type";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${IP}:3000/api`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetcher = (url: string) => api.get(url).then((res) => res.data);


const uploadImage = async (uri: string, endpoint: 'avatar' | 'photo') => {
  const formData = new FormData();

  const uriParts = uri.split('/');
  const fileName = uriParts[uriParts.length - 1];
  const fileType = fileName.split('.').pop(); 

  formData.append('image', {
    uri: uri,
    name: fileName,
    type: `image/${fileType}`,
  } as any); 

  try {
    const response = await api.post(
      `/upload/${endpoint}`, 
      formData, 
      {
        transformRequest: (data, headers) => {
          delete headers['Content-Type'];
          return data;
        },
        
      }
    );
    
    return response.data; 
  } catch (error: any) {
    console.error(`Lỗi khi upload ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

export const uploadAvatar = (uri: string) => {
  return uploadImage(uri, 'avatar');
};

export const uploadPhoto = (uri: string) => {
  return uploadImage(uri, 'photo');
};
export const deletePhoto = (photoUrl: string) => {
  return api.delete("/upload/photo/delete", {
    data: { photoUrl } 
  }).then((res) => res.data);
};

export const updateProfile = (profileData: any) => {
  return api.put("/users/update-profile", profileData).then((res) => res.data);
};

export default api;
