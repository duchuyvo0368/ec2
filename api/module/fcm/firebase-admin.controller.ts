import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { FirebaseAdminService } from "./firebase-admin.service";
import { AuthGuard } from "module/auth/guards/access-token.guard";
import { AuthRequest } from "module/auth/interfaces/auth-request.interface";

@Controller('fcm')
export class FirebaseAdminController {
     constructor(private readonly firebaseAdminService: FirebaseAdminService) { }


     @UseGuards(AuthGuard)
     @Post('update-fcm')
     async updateFcm(@Body("fcmToken") fcmToken: string, @Req() req: AuthRequest) {
          const userId = req?.user?.userId
          if (!userId) {
               throw new UnauthorizedException("User not found")
          }
          console.log("data fcm",fcmToken)
          const update = await this.firebaseAdminService.updateFcmToken(userId, fcmToken)
          return update;
     }
}