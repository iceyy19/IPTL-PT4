document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key === "0") { // Detects Alt + 0 key press
        alert("Admin access granted!");
        window.location.href = "/admin/dashboard"; // Redirects to admin dashboard, "/admin/dashboard" is still a subject to change, depending on the actual admin dashboard name and path
    }
});

async function loginUser() {
    const email = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            window.location.href = "/dashboard"; // Regular user redirection
        } else {
            alert(data.message || "Invalid login credentials.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred. Please try again.");
    }
}
