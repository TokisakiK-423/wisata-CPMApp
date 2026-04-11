export default function Home() {
    const role = localStorage.getItem("role");
  
    if (role === "admin") {
      window.location.href = "/admin";
    } else if (role === "customer") {
      window.location.href = "/customer";
    } else {
      window.location.href = "/login";
    }
  
    return null;
  }