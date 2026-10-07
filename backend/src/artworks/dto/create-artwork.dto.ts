import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from "class-validator";
import { ArtworkType } from "../artwork-type.enum";

export class createArtworkDto {
    @IsNotEmpty()
    @MaxLength(99)
    @IsString()
    title!: string;

    @IsNotEmpty()
    @MaxLength(50)
    @IsString()
    artist!: string;

    @IsNotEmpty()
    @IsEnum(ArtworkType)
    type!: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price!: number;

    @IsOptional()
    @IsBoolean()
    available?: boolean;
}