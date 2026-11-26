import { createHmac, randomInt } from "node:crypto";

export const generateOtp = () => {
  return randomInt(100000, 1000000).toString();
};

export const hashOtp = (otp: string) => {
  return createHmac("sha256", process.env.OTP_SECRET as string)
    .update(otp)
    .digest("hex");
};
