export const fetchWisataDetail = async (id: string | number) => {
  try {
    const res = await fetch(`http://10.0.2.2:3000/wisata/${id}`);
    if (!res.ok) throw new Error("Gagal ambil data");

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("FETCH DETAIL ERROR:", err);
    return null;
  }
};