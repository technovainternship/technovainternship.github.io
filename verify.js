function verifyCert() {
  const certInput = document.getElementById("certId");
  const resultDiv = document.getElementById("result");

  const certId = certInput.value.trim();

  // 🔍 Certificate ID format check
  const certFormat = /^TN\/DM\/\d{4,6}$/;

  // ❌ Empty input
  if (!certId) {
    resultDiv.innerHTML = `
      <p class="verify-error">
        ❌ Please enter a Certificate ID
      </p>
    `;
    return;
  }

  // ❌ Invalid format
  if (!certFormat.test(certId)) {
    resultDiv.innerHTML = `
      <p class="verify-error">
        ❌ Invalid format. Use <strong>TN/DM/XXXXX</strong>
      </p>
    `;
    return;
  }

  // ⏳ Fake loading
  resultDiv.innerHTML = `
    <p style="color:#94A3B8; font-weight:600;">
      🔍 Verifying certificate...
    </p>
  `;

  // ⏱ Simulated verification delay
  setTimeout(() => {
    resultDiv.innerHTML = `
      <div class="verify-success">
        <h3>✅ Certificate Verified</h3>
        <p><strong>Certificate ID:</strong> ${certId}</p>
        <p><strong>Status:</strong> Valid</p>
        <p><strong>Program:</strong> TechNova Internship</p>
        <p><strong>Duration:</strong> 1 Month</p>
        <p><strong>Issue Date:</strong> Issued</p>
      </div>
    `;
  }, 800);
}