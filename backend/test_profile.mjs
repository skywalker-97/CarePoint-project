
async function test() {
    // Login to get token
    const loginRes = await fetch('http://localhost:4000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: "test_user_2@example.com", password: "password123456" })
    });
    const { token } = await loginRes.json();
    console.log("Token:", token);

    // Get Profile
    const profileRes = await fetch('http://localhost:4000/api/user/get-profile', {
        headers: { 'token': token }
    });
    const profileData = await profileRes.json();
    console.log("Profile Data:", profileData);
}
test();
