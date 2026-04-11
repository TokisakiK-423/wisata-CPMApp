export default function AdminLayout({ children }) {
    return (
      <div>
        <h1>ADMIN</h1>
        <a href="/admin">Home</a> | 
        <a href="/admin/tabs/wisata">Wisata</a> | 
        <a href="/admin/tabs/booking">Booking</a> | 
        <a href="/admin/tabs/review">Review</a>
        <hr />
        {children}
      </div>
    );
  }