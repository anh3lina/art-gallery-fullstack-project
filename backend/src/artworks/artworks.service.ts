import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel, ParseObjectIdPipe } from '@nestjs/mongoose';
import { Artwork } from './schemas/artwork.schema';
import { Model } from 'mongoose';
import { createArtworkDto } from './dto/create-artwork.dto';
import { getArtworksDto } from './dto/get-artworks.dto';

@Injectable()
export class ArtworksService implements OnModuleInit {
    constructor(
        @InjectModel(Artwork.name) private artworkModel: Model<Artwork>,
    ) { }

    async onModuleInit() {
        const count = await this.artworkModel.countDocuments();
        if (count > 0) return;

        await this.artworkModel.insertMany([
            { title: 'impression, sunrise', artist: 'claude monet', type: 'painting', price: 1111, available: true },
            { title: 'water lilies', artist: 'claude monet', type: 'painting', price: 2222, available: true },
            { title: 'woman with a parasol', artist: 'claude monet', type: 'painting', price: 3333, available: false },
            { title: 'haystacks', artist: 'claude monet', type: 'painting', price: 4444, available: true },
        ]);
    }

    async getAllArtworks(params: getArtworksDto): Promise<Artwork[]> {
        const { price, artist, type } = params
        const queryObj: Record<string, string> = {}
        if (artist) {
            queryObj.artist = artist
        }
        if (type) {
            queryObj.type = type
        }
        const result = this.artworkModel.find(queryObj)
        if (price) {
            result.sort({
                price: price === "asc" ? 1 : -1
            })
        }
        const artworks = await result
        return artworks
    }

    async getArtwork(id: string): Promise<Artwork> {
        const artwork = await this.artworkModel.findOne(
            {
                _id: id
            }
        )
        if (!artwork) {
            throw new NotFoundException('Artwork with this id was not found')
        }
        return artwork
    }

    async createArtwork(data: createArtworkDto): Promise<Artwork> {
        const artwork = await this.artworkModel.create(data)
        return artwork
    }

    async deleteArtwork(id: string): Promise<Artwork> {
        const deletedArtwork = await this.artworkModel.findOneAndDelete(
            {
                _id: id
            }
        )
        if (!deletedArtwork) {
            throw new NotFoundException('Artwork with this id was not found')
        }
        return deletedArtwork
    }

    async updateArtwork(id: string, data: createArtworkDto): Promise<Artwork> {
        const updatedArtwork = await this.artworkModel.findOneAndUpdate({ _id: id }, data, {
            new: true,
            runValidators: true,
        })
        if (!updatedArtwork) {
            throw new NotFoundException('Artwork with this id was not found')
        }
        return updatedArtwork
    }
}
