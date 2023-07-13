import { PrismaClient } from "@prisma/client";

export class facebookApiService {
   constructor() {
      this.prisma = new PrismaClient();
    }
   getAllFacebookCars() {
      return this.prisma.cars_facebook.findMany({
         orderBy: {
            id: "desc",
          },
         select: {
            urn: true,
         }
      });
   }
}