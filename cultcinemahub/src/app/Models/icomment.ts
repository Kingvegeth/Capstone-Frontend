import { iUser } from "./iuser";



export interface iComment {
  id: number;
  body: string;
  isReplyToComment: boolean;
  user: iUser;
  userStatus: string;
  replies?: iComment[];
  reviewId?: number;
  parentId?: number;
  createdAt: string;
  updatedAt?: string;
}
