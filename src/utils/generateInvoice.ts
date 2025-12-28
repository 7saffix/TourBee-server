/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import appError from "../errorHelper/appError";
export interface IInvoiceData {
  username: string;
  transactionID: string;
  tour: string;
  totalGuest: number;
  totalAmount: number;
  bookingDate: Date;
}
export const generateInvoice = async (invoiceData: IInvoiceData) => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      //pdf content
      doc.fontSize(20).text("invoice", { align: "center" });
      doc.moveDown();

      doc.text(`Name: ${invoiceData.username}`);
      doc.text(`Tour: ${invoiceData.tour}`);
      doc.text(`Transaction ID: ${invoiceData.transactionID}`);
      doc.text(`Total guest: ${invoiceData.totalGuest}`);
      doc.text(`Total amount: ${invoiceData.totalAmount}`);
      doc.text(`Booking Date: ${invoiceData.bookingDate}`);

      doc.moveDown();

      doc.text("Thanks for booking!", { align: "center" });
      doc.end();
    });
  } catch (error: any) {
    console.log(`failed to generate invoice ${error}`);
    throw new appError(401, `Pdf creation error ${error.message}`);
  }
};
