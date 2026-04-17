async create(data: any, file?: Express.Multer.File) {
  const wisata = await this.prisma.wisata.create({
    data: {
      nama: data.nama,
      lokasi: data.lokasi,
      deskripsi: data.deskripsi,
      alamat: data.alamat,
      jamBuka: data.jamBuka,
      hargaTiket: Number(data.hargaTiket),
    },
  });

  // simpan gambar ke galeri
  if (file) {
    await this.prisma.galeri.create({
      data: {
        url: `/uploads/${file.filename}`,
        wisataId: wisata.id,
      },
    });
  }

  return wisata;
}
