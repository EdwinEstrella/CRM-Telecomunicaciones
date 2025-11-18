import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { UserRole } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const user = await this.usersService.create({
      ...registerDto,
      role: registerDto.role || UserRole.AGENT,
    });

    const { password: _password, ...result } = user;
    return {
      user: result,
      access_token: this.generateToken(user),
    };
  }

  async login(loginDto: LoginDto) {
    console.log(`[AuthService] Intento de login para: ${loginDto.email}`);
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      console.log(`[AuthService] Usuario no encontrado: ${loginDto.email}`);
      throw new UnauthorizedException("Invalid credentials");
    }

    console.log(`[AuthService] Usuario encontrado, verificando contraseña...`);
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      console.log(`[AuthService] Contraseña inválida para: ${loginDto.email}`);
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.isActive) {
      console.log(`[AuthService] Usuario inactivo: ${loginDto.email}`);
      throw new UnauthorizedException("User account is inactive");
    }

    console.log(`[AuthService] Login exitoso para: ${loginDto.email}`);
    const { password: _password, ...result } = user;
    return {
      user: result,
      access_token: this.generateToken(user),
    };
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
    const { password: _password, ...result } = user;
    return result;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      // Don't reveal if email exists
      return { message: "If email exists, reset link has been sent" };
    }

    // TODO: Generate reset token and send email
    // For now, just return success message
    return { message: "If email exists, reset link has been sent" };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // TODO: Validate token and reset password
    // For now, throw not implemented
    throw new BadRequestException("Password reset not implemented yet");
  }

  private generateToken(user: { id: string; email: string; role: string }) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const jwtSecret = this.configService.get<string>("JWT_SECRET");
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is required in environment variables");
    }
    return this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: this.configService.get<string>("JWT_EXPIRES_IN") || "7d",
    });
  }
}
