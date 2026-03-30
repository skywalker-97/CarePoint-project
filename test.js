const axios = require('axios');
async function test() {
    try {
        const res = await axios.post('http://localhost:4000/api/user/register', {
            name: "testName",
            email: "test.email@example.com",
            password: "password123"
        });
        console.log(res.data);
    } catch (error) {
        console.log(error.message);
    }
}
test();
