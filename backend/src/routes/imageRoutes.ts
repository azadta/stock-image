import { Router } from "express";
import { ENDPOINTS } from "../constants/endpoints";
import container from "../containers/container";
import { ImageController } from "../controllers/imageController";
import { verifyToken } from "../middleware/auth";
import { Types } from "../types/Types";

const router = Router();
const imageController = container.get<ImageController>(Types.ImageController);

router.get("/", verifyToken, imageController.getImages);
router.post(
  ENDPOINTS.IMAGES.UPLOAD,
  verifyToken,

  imageController.uploadImages,
);
router.put(
  ENDPOINTS.IMAGES.BY_ID,
  verifyToken,

  imageController.updateImage,
);
router.delete(ENDPOINTS.IMAGES.BY_ID, verifyToken, imageController.deleteImage);
router.post(
  ENDPOINTS.IMAGES.REARRANGE,
  verifyToken,
  imageController.rearrangeImages,
);

export default router;
