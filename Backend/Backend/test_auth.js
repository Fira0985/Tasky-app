async function runTest() {
    let sessionCookie = '';

    console.log('1. Testing Signup/Login to get cookie...');
    const signupData = JSON.stringify({ name: 'Test', email: 'test_session_user@example.com', password: 'password123' });

    // First let's try login
    let res = await fetch('http://localhost:3002/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: signupData
    });

    if (res.status === 404) {
        console.log('User not found, signing up...');
        res = await fetch('http://localhost:3002/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: signupData
        });
    }

    if (res.status !== 200 && res.status !== 201) {
        console.error('Failed to authenticate:', await res.text());
        return;
    }

    const setCookieHeader = res.headers.get('set-cookie');
    if (!setCookieHeader) {
        console.error('No set-cookie header received! Session is not working.');
        return;
    }

    console.log('Received Session Cookie:', setCookieHeader.split(';')[0]);
    sessionCookie = setCookieHeader.split(';')[0];

    console.log('\n2. Testing /check-auth with cookie...');
    let checkRes = await fetch('http://localhost:3002/check-auth', {
        headers: { 'Cookie': sessionCookie }
    });

    console.log('Check Auth Status:', checkRes.status);
    console.log('Check Auth Body:', await checkRes.text());

    if (checkRes.status === 200) {
        console.log('✅ Session active and verified!');
    } else {
        console.error('❌ Session verification failed!');
    }

    console.log('\n3. Testing /logout...');
    let logoutRes = await fetch('http://localhost:3002/logout', {
        method: 'POST',
        headers: { 'Cookie': sessionCookie }
    });
    console.log('Logout Status:', logoutRes.status);
    console.log('Logout Body:', await logoutRes.text());

    console.log('\n4. Testing /check-auth after logout...');
    let checkResAfter = await fetch('http://localhost:3002/check-auth', {
        headers: { 'Cookie': sessionCookie }
    });

    console.log('Check Auth After Logout Status:', checkResAfter.status);
    console.log('Check Auth After Logout Body:', await checkResAfter.text());

    if (checkResAfter.status === 401) {
        console.log('✅ Session successfully destroyed!');
    } else {
        console.error('❌ Session was not destroyed!');
    }
}

runTest().catch(console.error);
