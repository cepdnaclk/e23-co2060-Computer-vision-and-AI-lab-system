async function test() {
    try {
        console.log("Verifying registration...");
        const res2 = await fetch('http://localhost:5000/api/auth/register/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: "test@eng.pdn.ac.lk",
                otp: "856969"
            })
        });
        const data = await res2.json();
        console.log("Verify response:", data);
    } catch (e) {
        console.error("Verify failed:", e);
    }
}
test();
