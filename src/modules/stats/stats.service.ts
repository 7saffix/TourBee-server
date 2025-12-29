import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDays = new Date(now).setDate(now.getDate() - 7);
const thirtyDays = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUserPromise = User.countDocuments();
  const activeUserPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });

  const newUsersInLastThirtyDaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDays },
  });

  const userByRolePromise = User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [totalUser, activeUser, newUsersInLastThirtyDays, userByRole] =
    await Promise.all([
      totalUserPromise,
      activeUserPromise,
      newUsersInLastThirtyDaysPromise,
      userByRolePromise,
    ]);

  return {
    totalUser,
    activeUser,
    newUsersInLastThirtyDays,
    userByRole,
  };
};

const getTourStats = async () => {
  const totalTourPromise = Tour.countDocuments();

  //total tour by tour type
  const totalTourByTourTypesPromise = Tour.aggregate([
    //stage -1 connect the tour with tour types
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "tourType",
      },
    },

    //stage 2 lookup gives you array so need to unwind
    {
      $unwind: "$tourType",
    },
    // stage 3
    {
      $group: {
        _id: "$tourType.name",
        count: { $sum: 1 },
      },
    },
  ]);

  //total tour by tour type
  const totalTourByDivisionPromise = Tour.aggregate([
    //stage -1 connect the tour with tour types
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },

    //stage 2 lookup gives you array so need to unwind
    {
      $unwind: "$division",
    },
    // stage 3
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalHighestBookedTourPromise = Booking.aggregate([
    //stage 1 filter complete booking
    {
      $match: {
        status: "COMPLETED",
      },
    },

    //STAGE 2 group all successful booking
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    //stage 3 get tour id now lookup to get full tour
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tour",
      },
    },
    //stage 3 lookup stage with using pipeline
    // {
    //     $lookup: {
    //         from: "tours",
    //         let: { tourId: "$_id" },
    //         pipeline: [
    //             {
    //                 $match: {
    //                     $expr: { $eq: ["$_id", "$$tourId"] }
    //                 }
    //             }
    //         ],
    //         as: "tour"
    //     }
    // },

    //stage 4 unwind
    {
      $unwind: "$tour",
    },
    //stage 5 project to specify field
    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
    //stage 6 sorting
    {
      $sort: {
        bookingCount: -1,
      },
    },
    //stage 7 limit data
    {
      $limit: 5,
    },
  ]);

  const [
    totalTour,
    totalTourByTourTypes,
    totalTourByDivision,
    totalHighestBookedTour,
  ] = await Promise.all([
    totalTourPromise,
    totalTourByTourTypesPromise,
    totalTourByDivisionPromise,
    totalHighestBookedTourPromise,
  ]);

  return {
    totalTour,
    totalTourByTourTypes,
    totalTourByDivision,
    totalHighestBookedTour,
  };
};

const getBookingStats = async () => {
  const totalBookingPromise = Booking.countDocuments({
    status: BOOKING_STATUS.COMPLETED,
  });

  //booking per tour
  const bookingPerTourPromise = Booking.aggregate([
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "tours",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$tourId"] },
            },
          },
          {
            $project: {
              title: 1,
              slug: 1,
              _id: 0,
            },
          },
        ],
        as: "tour",
      },
    },
    {
      $unwind: "$tour",
    },
  ]);

  //booking by unique user
  // const bookingUniqueUserPromise = Booking.aggregate([
  //   {
  //     $group: {
  //       _id: "$user",
  //     },
  //   },
  //   {
  //     $count: "uniqueUser",
  //   },
  // ]);
  //some other way
  // const bookingUniqueUserPromise =(await Booking.distinct("user")).length;

  const bookingUniqueUserPromise = Booking.distinct("user").then(
    (user) => user.length
  );

  //booking in last 7 days
  const bookingInLastSevenDaysPromise = Booking.countDocuments({
    createdAt: { $gte: sevenDays },
  });

  const [
    totalBooking,
    bookingPerTour,
    bookingUniqueUser,
    bookingInLastSevenDays,
  ] = await Promise.all([
    totalBookingPromise,
    bookingPerTourPromise,
    bookingUniqueUserPromise,
    bookingInLastSevenDaysPromise,
  ]);

  return {
    totalBooking,
    bookingPerTour,
    bookingUniqueUser,
    bookingInLastSevenDays,
  };
};

const getPaymentStats = async () => {
  const totalSuccessfulPaymentPromise = Payment.countDocuments({
    status: PAYMENT_STATUS.PAID,
  });

  const totalRevenuePromise = Payment.aggregate([
    {
      $match: {
        status: PAYMENT_STATUS.PAID,
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  const [totalSuccessfulPayment, totalRevenue] = await Promise.all([
    totalSuccessfulPaymentPromise,
    totalRevenuePromise,
  ]);

  return {
    totalSuccessfulPayment,
    totalRevenue,
  };
};

export const statService = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};
