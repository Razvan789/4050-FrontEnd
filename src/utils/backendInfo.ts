//Server url
export const serverUrl = "http://localhost:5000";

// Aysnc function to send Post request to server
export const sendPostRequest = async (url: string, data: any) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
};
