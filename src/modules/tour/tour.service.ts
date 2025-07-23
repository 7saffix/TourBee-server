/* eslint-disable @typescript-eslint/no-dynamic-delete */

import appError from "../../errorHelper/appError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchField } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatus from "http-status-codes";

//---------- Tour Type----------
const createTourType = async (payload: ITourType) => {
  const isExist = await TourType.findOne({ name: payload.name });

  if (isExist) {
    throw new appError(httpStatus.BAD_REQUEST, "Already exist");
  }
  const tourType = await TourType.create(payload);

  return tourType;
};

const getAllTourType = async () => {
  const AllTourType = await TourType.find({});

  return AllTourType;
};

const updateTourType = async (id: string, payload: ITourType) => {
  const isExist = await TourType.findById(id);
  if (!isExist) {
    throw new appError(httpStatus.NOT_FOUND, "tour type not found");
  }
  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return updatedTourType;
};

const deleteTourType = async (id: string) => {
  const isExist = await TourType.findById(id);

  if (!isExist) {
    throw new appError(httpStatus.NOT_FOUND, "tour type not found");
  }

  await TourType.findByIdAndDelete(id);

  return null;
};

//---------- Tour----------
const createTour = async (payload: Partial<ITour>) => {
  const isExist = await Tour.findOne({ title: payload.title });

  if (isExist) {
    throw new appError(httpStatus.BAD_REQUEST, "Already exist");
  }
  const tour = await Tour.create(payload);

  return tour;
};

const getAllTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const AllTour = await queryBuilder
    .search(tourSearchField)
    .filter()
    .fields()
    .sort()
    .pagination();

  const [tours, meta] = await Promise.all([
    AllTour.build(),
    queryBuilder.getMeta(),
  ]);

  return { tours, meta };
};

// const getAllTour = async (query: Record<string, string>) => {
//   const filter = query;
//   const search = query.search || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query.fields?.split(",").join(" ") || "";
//   const pages = Number(query.pages) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (pages - 1) * limit;

//   /*
//     page -1 , skip = 0 , limit = 10
//     page -2 , skip = 10 , limit = 10
//     page -3 , skip = 20 , limit = 10
//   */

//   // delete filter["search"];
//   // delete filter["sort"];

//   for (const field of excludeField) {
//     delete filter[field];
//   }

//   console.log(filter);

//   const tourSearchField = ["title", "description", "location"];

//   const searchQuery = {
//     $or: tourSearchField.map((field) => ({
//       [field]: { $regex: search, $options: "i" },
//     })),
//   };

//   const AllTour = await Tour.find(searchQuery)
//     .find(filter)
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);

//   const totalTour = await Tour.countDocuments();

//   const totalPages = Math.ceil(totalTour / limit);

//   const meta = {
//     page: pages,
//     limit: limit,
//     total: totalTour,
//     totalPages: totalPages,
//   };

//   return { meta, AllTour };
// };

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const isExist = await Tour.findById(id);
  if (!isExist) {
    throw new appError(httpStatus.NOT_FOUND, "tour not found");
  }
  const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return updatedTour;
};

const deleteTour = async (id: string) => {
  const isExist = await Tour.findById(id);

  if (!isExist) {
    throw new appError(httpStatus.NOT_FOUND, "tour type not found");
  }

  await Tour.findByIdAndDelete(id);

  return null;
};
export const tourService = {
  createTourType,
  getAllTourType,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTour,
  updateTour,
  deleteTour,
};
