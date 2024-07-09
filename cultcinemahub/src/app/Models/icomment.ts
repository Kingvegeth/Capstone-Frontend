import { iUser } from "./iuser";



export interface iComment {
  id: number;
  body: string;
  isReplyToComment: boolean;
  user: iUser;
  userStatus: string;
  replies?: iComment[];
  reviewId?: number;
  parentId?: number | null;
  createdAt: string;
  updatedAt?: string;
}
