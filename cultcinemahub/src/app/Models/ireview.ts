import { iComment } from "./icomment";
import { iMovie } from "./imovie";
import { iUser } from "./iuser";


export interface iReview {
  id?: number;
  title: string;
  body: string;
  rating: number;
  userId?: number;
  movieId?: number;
  user?: iUser;
  userStatus?: string;
  createdAt: string;
  updatedAt?: string;
  comments?: iComment[];
  commentIds?: number[];
}
