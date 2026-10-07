import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
import { ArtworkType } from "../artwork-type.enum";

export class getArtworksDto {
    @IsOptional()
    @MaxLength(50)
    @IsString()
    artist?: string;

    @IsOptional()
    @IsEnum(ArtworkType)
    type?: string;

    @IsOptional()
    @IsString()
    @IsIn(["asc", "desc"])
    price?: "asc" | "desc"
}