import { Types } from "mongoose";

export interface ITourType {
  name: string;
}

export interface ITour {
  slug: string;
  title: string;
  description?: string;
  images?: string[];
  location?: string;
  costForm?: number;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: number;
  minAge?: number;
  division: Types.ObjectId;
  tourType: Types.ObjectId;
  deletedImage?: string[];
}

export interface ITourQueryOptions {
  location: string;
  tourType: string;
  maxCost: string;
  search: string;
  sortBy: string;
  page: number;
  limit: number;
}
