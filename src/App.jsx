import { auth } from "./firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

function App() {
  const testSignup = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        "testuser@gmail.com",
        "password123"
      );
      console.log("User created");
      alert("User created successfully!");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Event Management System</h1>
      <button onClick={testSignup}>Test Firebase Auth</button>
    </div>
  );
}

export default App;
