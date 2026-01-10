export type Role = "USER" | "HOST" | "ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCK";

export type FriendshipStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "REJECTED";

export type EventStatus =
  | "OPEN"
  | "FULL"
  | "COMPLETED"
  | "CANCELLED";

export type HostUpdateStatus =
  | "PENDING"
  | "APPROVED";

export type PaymentStatus =
  | "PAID"
  | "UNPAID"
  | "CANCEL";

export interface ILocation {
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
  city?: ILocation;
  avgRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventCreate {
  id?: string;
  title: string;
  eventType?: string | null;
  description: string;
  hostId: string;
  minParticipants?: number | null;
  maxParticipants?: number | null;
  image?: string | null;
  location: ILocation;
  startDate: string | Date;
  endDate: string | Date;
  joiningFee?: number;
  status?: EventStatus;
}

export interface IHostCreate {
  id?: string;
  userId?: string;
  message?: string;
}

export interface IHostUpdate {
  status?: HostUpdateStatus;
}
export interface IFriendRequestPayload {
  receiverId: string;
}

export interface IFriendUpdatePayload {
  requestId: string;
  action: "accept" | "reject";
}

export interface IFollowPayload {
  followingId: string;
}

export interface ISaveEventPayload {
  eventId: string;
}

export interface IReviewPayload {
  eventId: string;
  rating: number;
  comment?: string;
}