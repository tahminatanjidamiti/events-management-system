export type Role = "USER" | "HOST" | "ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCK";
export interface CityLocation {
  lat: number;
  lng: number;
  formattedAddress?: string;
}
export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string | null;
  role: Role;
  status: UserStatus;
  isVerified: boolean;
  phone?: string | null;
  picture?: string | null;
  bio?: string | null;
  interests: string[];
  city?: CityLocation;
  avgRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
