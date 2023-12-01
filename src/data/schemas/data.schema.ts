import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type DataDocument = HydratedDocument<Data>

enum DataFormat {
    TEXT = "text",
    NUMBER = "number",
    URL = "url",
    MAIL = "mail",
    FILE = "file"
}

@Schema({ collection: "data", timestamps: true, versionKey: false })
export class Data {
    // One-to-many avec un user(db SQL)
    @Prop({
        type: Number
    })
    user_id: Number

    @Prop({ type: String, enum: DataFormat })
    typeData: DataFormat

    @Prop({ type: String })
    name: String

    @Prop({ type: String })
    value: String

    // Many-to-many avec share
    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId}],
        default: [],
    })
    shares: mongoose.Types.Array<string>
}

export const dataSchema = SchemaFactory.createForClass(Data)