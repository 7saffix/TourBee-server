/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Query } from "mongoose";
import { excludeField } from "../constant";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };

    for (const field of excludeField) {
      delete filter[field];
    }

    this.modelQuery = this.modelQuery.find(filter); //Tour.find().find(filter)

    return this;
  }

  search(SearchAbleField: string[]): this {
    const searchTerm = this.query.searchTerm || "";

    const searchQuery = {
      $or: SearchAbleField.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };

    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  pagination(): this {
    const limit = Number(this.query.limit) || 10;
    const page = Number(this.query.page) || 1;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  async getMeta() {
    const total = await this.modelQuery.model.countDocuments();

    const limit = Number(this.query.limit) || 10;
    const page = Number(this.query.page) || 1;

    const totalPage = Math.ceil(total / limit);

    return {
      limit,
      page,
      totalPage,
      total,
    };
  }

  build() {
    return this.modelQuery;
  }
}
