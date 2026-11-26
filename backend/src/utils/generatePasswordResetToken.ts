import crypto from "crypto";

export const generateResetPasswordToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
export const hashResetToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
