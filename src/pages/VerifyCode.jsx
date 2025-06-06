// /pages/VerifyCode.jsx
import { useState } from 'react';

function VerifyCode() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleVerify = async () => {
    const res = await fetch('https://your-backend.com/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: input }),
    });
    const data = await res.json();
    setResult(data.message);
  };

  return (
    <div className="verify-code">
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter Code" />
      <button onClick={handleVerify}>Verify</button>
      {result && <p>{result}</p>}
    </div>
  );
}
