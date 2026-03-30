fetch('http://localhost:4000/api/user/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: "Test User 2",
        email: "test_user_2@example.com",
        password: "password123456"
    })
}).then(r => r.json()).then(console.log).catch(console.error);
