import { iCompany } from "./icompany";
import { iPerson } from "./iperson";
import { iReview } from "./ireview";



export interface iMovie {
  id?: number;
  title: string;
  year: number;
  duration: number;
  description: string;
  genres: iGenre[];
  posterImg?: string;
  reviews?: iReview[];
  cast?: iPerson[];
  directors?: iPerson[];
  screenwriters?: iPerson[];
  producers?: iCompany[];
  distributor?: iCompany;
  averageRating?: number;
}

export type iGenre = string;


