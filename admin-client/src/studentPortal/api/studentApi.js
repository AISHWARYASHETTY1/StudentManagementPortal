const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/student`;

export const getStudentData = async (path) => {
    const token = localStorage.getItem("studentToken");
    let response;
    try {
        response = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch {
        throw new Error("Unable to connect to the server. Make sure the API is running on port 5000.");
    }
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : { message: await response.text() };
    if (!response.ok) throw new Error(data.message || "Failed to load student data");
    return data;
};
