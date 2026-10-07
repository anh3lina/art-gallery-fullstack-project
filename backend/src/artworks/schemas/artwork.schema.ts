import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArtworkDocument = HydratedDocument<Artwork>;

@Schema({ timestamps: true })
export class Artwork {
    @Prop({ required: true, maxlength: 99, trim: true })
    title: string;

    @Prop({ required: true, maxlength: 50, trim: true })
    artist: string;

    @Prop({ required: true })
    type: string;

    @Prop({
        required: true,
        validate: {
            validator: (v: number) => v > 0,
            message: 'Price must be greater than 0',
        },
    })
    price: number;

    @Prop({ default: true })
    available: boolean;
}

export const ArtworkSchema = SchemaFactory.createForClass(Artwork);