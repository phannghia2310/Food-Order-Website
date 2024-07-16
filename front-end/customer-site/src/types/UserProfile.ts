type UserProfile = {
  userId?: string;
  name: string;
  email?: string;
  imageUrl: string;
  phone: string;
  address: string;
  isAdmin: boolean;
  createdDate?: string;
};

export default UserProfile;