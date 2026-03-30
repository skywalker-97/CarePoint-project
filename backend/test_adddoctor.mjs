import jwt from 'jsonwebtoken';
import 'dotenv/config';

const token = jwt.sign(process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD, process.env.JWT_SECRET);
console.log("Token:", token);

fetch('http://localhost:4000/api/admin/add-doctor', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'atoken': token
    },
    body: JSON.stringify({
        name: "Test Doc",
        email: "doc@test.com",
        password: "password123",
        experience: "1 Year",
        fees: 100,
        about: "Testing",
        speciality: "General physician",
        degree: "MBBS",
        address: "{\"line1\":\"Street 1\",\"line2\":\"\"}"
    })
}).then(r => r.json()).then(console.log).catch(console.error);
