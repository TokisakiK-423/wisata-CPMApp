async update(id: number, data: any, file?: Express.Multer.File) {
  const wisata = await this.prisma.wisata.findUnique({
    where: { id },
  });

  if (!wisata) {
    throw new Error('Data tidak ditemukan');
  }

  // update data utama
  const updated = await this.prisma.wisata.update({
    where: { id },
    data: {
      nama: data.nama,
      lokasi: data.lokasi,
      deskripsi: data.deskripsi,
      alamat: data.alamat,
      jamBuka: data.jamBuka,
      hargaTiket: Number(data.hargaTiket),
    },
  });

  // 🔥 kalau ada gambar baru
  if (file) {
    const url = `/uploads/${file.filename}`;

    await this.prisma.galeri.create({
      data: {
        wisataId: id,
        url,
      },
    });
  }

  return updated;
}
