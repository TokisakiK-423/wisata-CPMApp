async create(data: any, customerId: number, file?: Express.Multer.File) {
  const customer = await this.prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new Error('Customer tidak ditemukan');
  }

  return this.prisma.review.create({
    data: {
      wisataId: Number(data.wisataId),
      customerId: customerId,
      nama: customer.nama,
      rating: Number(data.rating),
      komentar: data.komentar,

      // 🔥 INI YANG BIKIN GAMBAR MASUK DB
      image: file ? `/uploads/${file.filename}` : null,
    },
  });
}
