export const fetchWisata = async () => {
  try {
    const res = await fetch("http://10.0.2.2:3000/wisata");
    const data = await res.json();

    return Array.isArray(data)
      ? data.filter((w) => w.status === true)
      : [];
  } catch {
    return [];
  }
};

export const getRating = (reviews?: { rating: number }[]) => {
  if (!reviews || reviews.length === 0) {
    return { avg: 0, total: 0 };
  }

  const total = reviews.length;
  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / total;

  return { avg, total };
};