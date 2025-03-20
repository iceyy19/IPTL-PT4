async function loginUser() {
    const email = document.getElementById("loginUsername").value; // Change from 'username' to 'email'
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }), // Changed from 'username' to 'email'
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            window.location.href = "/dashboard";
        } else {
            alert(data.message || "Invalid login credentials.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred. Please try again.");
    }
}
