
import { Container } from "inversify";
import { Types } from "../types/Types";
import { UserRepository } from "../repositories/UserRepository";
import { ImageRepository } from "../repositories/ImageRepository";
import { AuthService } from "../services/AuthService";
import { ImageService } from "../services/IImageService";
import { AuthController } from "../controllers/authController";
import { ImageController } from "../controllers/imageController";

const container = new Container();

container.bind(Types.UserRepository).to(UserRepository);
container.bind(Types.ImageRepository).to(ImageRepository);

container.bind(Types.AuthService).to(AuthService);
container.bind(Types.ImageService).to(ImageService);

container.bind(Types.AuthController).to(AuthController);
container.bind(Types.ImageController).to(ImageController);

export default container;
