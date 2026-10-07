import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { createArtworkDto } from './dto/create-artwork.dto';
import { getArtworksDto } from './dto/get-artworks.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('artworks')
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) { }

  @Get()
  getAllArtworks(@Query() params: getArtworksDto) {
    return this.artworksService.getAllArtworks(params)
  }

  @Get(':id')
  getArtwork(@Param('id', ParseObjectIdPipe) id: string) {
    return this.artworksService.getArtwork(id)
  }

  @Post()
  createArtwork(@Body() dto: createArtworkDto) {
    return this.artworksService.createArtwork(dto)
  }

  @Delete(':id')
  deleteArtwork(@Param('id', ParseObjectIdPipe) id: string) {
    return this.artworksService.deleteArtwork(id)
  }

  @Put(':id')
  updateArtwork(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: createArtworkDto) {
    return this.artworksService.updateArtwork(id, dto)
  }
}
