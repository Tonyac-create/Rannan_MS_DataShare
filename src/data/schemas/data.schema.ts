import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose"
import { DataFormatEnum } from "src/enums/data.enum";

export type DataDocument = HydratedDocument<Data>

@Schema({ collection: "data", timestamps: true, versionKey: false })
export class Data {
    // One-to-many avec un user(db SQL)
    @Prop({ required: true, type: Number })
    user_id: Number

    @Prop({ type: String, enum: DataFormatEnum })
    type?: DataFormatEnum

    @Prop({ required: true, type: String })
    name: String

    @Prop({ required: true, type: String })
    value: String
}

export const dataSchema = SchemaFactory.createForClass(Data)