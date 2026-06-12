/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../../config/env";
import appError from "../../errorHelper/appError";
import { ISSLCommerz } from "./sslCommerz.interface";
import httpStatus from "http-status-codes";
import axios from "axios";

const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVars.SSL.SSL_STORE_ID,
      store_passwd: envVars.SSL.SSL_STORE_PASSWORD,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
      fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=failed`,
      cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
      shipping_method: "N/A",
      product_name: "tour",
      product_category: "service",
      product_profile: "N/A",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_phone: payload.phone,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "N/A",
      cus_fax: "N/A",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "N/A",
      ship_country: "N/A",
    };

    const response = await axios({
      method: "POST",
      url: envVars.SSL.SSL_PAYMENT_API,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error: any) {
    console.log("Payment Error Occurred", error);
    throw new appError(httpStatus.BAD_REQUEST, error.message);
  }
};

export const SSLService = { sslPaymentInit };
