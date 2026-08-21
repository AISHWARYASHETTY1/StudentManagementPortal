// Test the login API endpoint
async function testAdminLogin() {
    try {
        console.log("🔍 Testing Admin Login API...\n");
        
        const loginData = {
            username: "admin",
            password: "admin@123"
        };
        
        console.log("📤 Sending request to http://localhost:5000/api/admin/auth/login");
        console.log("📝 Payload:", loginData);
        console.log();
        
        const response = await fetch("http://localhost:5000/api/admin/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        console.log("📥 Response Status:", response.status);
        console.log("📥 Response Body:");
        console.log(JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log("\n✅ Login successful!");
            console.log("   Token:", data.token);
            console.log("   Admin:", data.admin);
        } else {
            console.log("\n❌ Login failed!");
        }
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testAdminLogin();
