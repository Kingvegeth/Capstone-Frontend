import { iComment } from "./icomment";
import { iMovie } from "./imovie";
import { iUser } from "./iuser";


export interface iReview {
  id: number;
  title: string;
  body: string;
  rating: number;
  user: iUser;
  userStatus: string;
  createdAt: string;
  updatedAt?: string;
  movie: iMovie;
  comments?: iComment[];
}
