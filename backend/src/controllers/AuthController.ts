import {
  Router,
  type CookieOptions,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import type { ITokenService } from "../models/authentication/interfaces/ITokenService.js";
import type { AuthService } from "../services/AuthService.js";
import { validateBody } from "../middlewares/ValidateDtoMiddleware.js";
import { RegisterDTO } from "../dto/auth/RegisterDTO.js";
import type { AuthResponse } from "../models/authentication/interfaces/AuthResponse.js";
import { LoginDTO } from "../dto/auth/LoginDTO.js";
import { requireAuth } from "../middlewares/AuthMiddleware.js";
import { UnauthenticatedError } from "../exceptions/AppError.js";
import { UserMapper } from "../models/user/UserMapper.js";

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
    this.authRouter.post("/login", validateBody(LoginDTO), this.login);
    this.authRouter.post(
      "/logout",
      requireAuth(this.tokenService),
      this.logout,
    );
    this.authRouter.get(
      "/me",
      requireAuth(this.tokenService),
      this.getCurrentUser,
    );
    this.authRouter.post("/refresh", this.refresh);
  }
  private register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const registerDto: RegisterDTO = res.locals.validateBody;

    const result = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.role,
    );

    this.generateSecurityCookie(res, result);

    return res.status(200).json(result.user);
  };
  private login = async (req: Request, res: Response, next: NextFunction) => {
    const loginDto: LoginDTO = res.locals.validateBody;

    const result = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    this.generateSecurityCookie(res, result);

    return res.status(200).json(result.user);
  };
  private logout = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.refreshToken;
      if (token) {
        const payload = this.tokenService.verifyRefreshToken(token);
        await this.authService.logout(payload.uuid);
      }
    } catch (error) {
      // On ignore les erreurs de token invalide/expiré ici,
      // le but est de vider le navigateur.
    } finally {
      const jwtCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      };
      const csrfCookieOptions: CookieOptions = {
        ...jwtCookieOptions,
        httpOnly: false,
      };

      res.clearCookie("accessToken", jwtCookieOptions);
      res.clearCookie("refreshToken", jwtCookieOptions);
      res.clearCookie("XSRF-TOKEN", csrfCookieOptions);

      return res.status(200).json({ message: "User logged out" });
    }
  };
  private getCurrentUser = async (req: Request, res: Response) => {
    const user = await this.authService.getCurrentUser(req.user!.uuid);
    return res.status(200).json(UserMapper.toProfile(user));
  };
  private refresh = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthenticatedError();
    }

    const result = await this.authService.refresh(refreshToken);

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
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
  }
}
