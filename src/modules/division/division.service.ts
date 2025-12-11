import mongoose from "mongoose";
import appError from "../../errorHelper/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes";
import { deleteFromCloudinary } from "../../config/cloudinary.config";

const createDivision = async (payload: Partial<IDivision>) => {
  const isDivisionExist = await Division.findOne({ name: payload.name });
  if (isDivisionExist) {
    throw new appError(
      httpStatus.BAD_REQUEST,
      "The name of division is already exist"
    );
  }
  // const baseSlug = payload.name?.toLowerCase().split(" ").join("-");
  // const slug = `${baseSlug}-division`;

  // payload.slug = slug; //alternative- using mongoose pre middleware.check model

  const division = await Division.create(payload);

  return division;
};

const getAllDivision = async () => {
  const divisions = await Division.find({});

  return divisions;
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const isExist = await Division.findById(id).session(session);
    if (!isExist) {
      throw new appError(httpStatus.NOT_FOUND, "Division Not Found!");
    }

    const isDuplicate = await Division.findOne({
      name: payload.name,
      _id: { $ne: id },
    }).session(session);

    if (isDuplicate) {
      throw new appError(httpStatus.BAD_REQUEST, "This Name is already Exist");
    }

    const updatedData = await Division.findByIdAndUpdate(id, payload, {
      new: true,
      session,
    });
    await session.commitTransaction();
    session.endSession();

    if (payload.thumbnail && isExist.thumbnail) {
      await deleteFromCloudinary(isExist.thumbnail);
    }

    return updatedData;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);

  return null;
};

export const divisionService = {
  createDivision,
  getAllDivision,
  updateDivision,
  deleteDivision,
};
