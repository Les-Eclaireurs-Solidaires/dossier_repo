import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import type { ITokenService } from "../models/authentication/interfaces/ITokenService.js";
import type { AuthService } from "../services/AuthService.js";
import { validateBody } from "../middlewares/ValidateDtoMiddleware.js";
import { RegisterDTO } from "../dto/auth/RegisterDTO.js";
import type { AuthResponse } from "../models/authentication/interfaces/AuthResponse.js";

export class AuthController {
  private authRouter: Router = Router();

  constructor(
    private authService: AuthService,
    private tokenService: ITokenService,
  ) {
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.authRouter;
  }

  private initializeRoutes(): void {
    this.authRouter.post("/register", validateBody(RegisterDTO), this.register);
  }
  private register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const registerDto: RegisterDTO =
      res.locals.validateBody;

    const result = await this.authService.register(
      registerDto.email,
      registerDto.password,
    );

    this.generateSecurityCookie(res, result);

    return res.status(200).json(result.user);
  };

  private generateSecurityCookie(res: Response, result: AuthResponse) {
    const csrfToken = this.tokenService.generateRandomToken();
    res.cookie("XSRF-TOKEN", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV  === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV  === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
  }
}
