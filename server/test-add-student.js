// Test adding a student
async function testAddStudent() {
    try {
        console.log("🔍 Testing Add Student API...\n");
        
        const studentData = {
            firstName: "John",
            lastName: "Doe",
            email: "john@student.com",
            phone: "9876543200",
            department: "Computer Science",
            course: "B.Tech CSE",
            yearOfStudy: 2
        };
        
        console.log("📤 Sending request to http://localhost:5000/api/students");
        console.log("📝 Payload:", studentData);
        console.log();
        
        const response = await fetch("http://localhost:5000/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });
        
        const data = await response.json();
        
        console.log("📥 Response Status:", response.status);
        console.log("📥 Response Body:");
        console.log(JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log("\n✅ Student added successfully!");
        } else {
            console.log("\n❌ Failed to add student");
        }
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testAddStudent();
