// import axios from 'axios';

// const API_URL = '/api/users';

// export const registerUser = async (name: string, email: string, password: string) => {
//   try {
//     const response = await axios.post(`${API_URL}?method=register`, { name, email, password });
//     return response;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.error || 'Failed to register user');
//   }
// };

// export const signinUser = async (email: string, password: string) => {
//   try {
//     const response = await axios.post(`${API_URL}?method=signin`, { email, password });
//     return response;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.error || 'Failed to sign in user');
//   }
// };

// export const signinWithGoogle = async (idToken: any) => {
//   try {
//     const response = await axios.post(`${API_URL}?method=signin-google`, { idToken });
//     return response;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.error || 'Failed to sign in with Google');
//   }
// };

// export const updateUser = async (id: any, data: any) => {
//   try {
//     const response = await axios.put(`${API_URL}?method=update`, { id, data });
//     return response;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.error || 'Failed to update user');
//   }
// };

// export const uploadFile = async (formData: any) => {
//   try {
//     const response = await axios.post(`${API_URL}?method=upload`, formData , {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response;
//   } catch (error: any) {
//     console.error('Upload error:', error.response?.data || error.message);
//     throw new Error(error.response?.data?.error || 'Failed to upload file');
//   }
// };

import axios from 'axios';

const API_URL = '/api/users';

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Failed to register user');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to register user');
  }
};

export const signinWithGoogle = async (idToken: any) => {
  try {
    const response = await axios.post(`${API_URL}?method=signin-google`, { idToken });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to sign in with Google');
  }
};
