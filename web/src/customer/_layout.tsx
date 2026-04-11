export default function CustomerLayout({ children }) {
    return (
      <div>
        <h1>CUSTOMER</h1>
        <a href="/customer">Home</a> | 
        <a href="/customer/tabs">Wisata</a> | 
        <a href="/customer/tabs/booking">Booking</a>
        <hr />
        {children}
      </div>
    );
  }