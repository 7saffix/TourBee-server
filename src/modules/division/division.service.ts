import appError from "../../errorHelper/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes";

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
  const isExist = await Division.findById(id);
  if (!isExist) {
    throw new appError(httpStatus.NOT_FOUND, "Division Not Found!");
  }

  const isDuplicate = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (isDuplicate) {
    throw new appError(httpStatus.BAD_REQUEST, "This Name is already Exist");
  }

  const updatedData = await Division.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return updatedData;
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
