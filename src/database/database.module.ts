import { MongooseModule } from "@nestjs/mongoose";
import _CONFIG from "~src/config";

export const MongooseDatabaseModule = MongooseModule.forRoot(_CONFIG.db.uri);
