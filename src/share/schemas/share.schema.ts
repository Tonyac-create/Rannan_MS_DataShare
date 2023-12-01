import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

enum ShareFormat {
    GROUP = "group",
    USER = "user"
}

export type ShareDocument = HydratedDocument<Share>

@Schema({ collection: "share", timestamps: true, versionKey: false })
export class Share {
    @Prop({ type: String, enum: ShareFormat })
    target: ShareFormat

    @Prop({ type: Number })
    target_id: Number

    @Prop({ type: Number})
    owner_id: Number

    // Many-to-many avec data
    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Data' }],
        default: [],
    })
    datas: mongoose.Types.Array<string>
}



export const shareSchema = SchemaFactory.createForClass(Share)