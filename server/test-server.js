// Test the server
async function testServer() {
    try {
        console.log("🔍 Testing Server Connectivity...\n");
        
        console.log("📤 Testing GET /api/students");
        const response1 = await fetch("http://localhost:5000/api/students");
        console.log("Response status:", response1.status);
        console.log("Response headers:", response1.headers);
        const text = await response1.text();
        console.log("Response text:", text.substring(0, 200));
        
        console.log("\n📤 Testing POST /api/students");
        const response2 = await fetch("http://localhost:5000/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: "john@student.com"
            })
        });
        
        console.log("Response status:", response2.status);
        console.log("Response headers:", response2.headers);
        const text2 = await response2.text();
        console.log("Response text:", text2.substring(0, 200));
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testServer();
