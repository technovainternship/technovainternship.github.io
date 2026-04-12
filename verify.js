// ============================================================
// Apni Google Sheet ka ID yahan paste karo
// ============================================================
const SHEET_ID = "1VGfOsYoGt9MKRyrE8Bfkfmg5SJQNbVae_uAkkvwmUps";
const SHEET_NAME = "Sample";
// ============================================================

// URL se cert ID auto-fill (QR scan ke liye)
const params = new URLSearchParams(window.location.search);
const certFromUrl = params.get('cert') || params.get('id');
if (certFromUrl) {
  const input = document.getElementById("certId");
  if (input) {
    input.value = decodeURIComponent(certFromUrl);
    setTimeout(verifyCert, 400);
  }
}

// Enter key support
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("certId");
  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") verifyCert();
    });
  }
});

async function verifyCert() {
  const certInput = document.getElementById("certId");
  const resultDiv = document.getElementById("result");
  const certId = certInput.value.trim().toUpperCase();

  // Empty check
  if (!certId) {
    resultDiv.innerHTML = `
      <p class="verify-error">
        ❌ Please enter a Certificate ID
      </p>
    `;
    return;
  }

  // Loading state
  resultDiv.innerHTML = `
    <p style="color:#94A3B8; font-weight:600;">
      🔍 Verifying certificate...
    </p>
  `;

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
    const res  = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    let found = null;
    for (const row of rows) {
      const id = (row.c[0]?.v || '').toString().toUpperCase().trim();
      if (id === certId) {
        found = {
          name:      row.c[1]?.v || '—',
          domain:    row.c[2]?.v || '—',
          batch:     row.c[3]?.v || '—',
          issueDate: row.c[4]?.v || '—',
          duration:  row.c[5]?.v || '—',
        };
        break;
      }
    }

    if (found) {
      resultDiv.innerHTML = `
        <div class="verify-success">
          <h3>✅ Certificate Verified</h3>
          <p><strong>Certificate ID:</strong> ${certId}</p>
          <p><strong>Name:</strong> ${found.name}</p>
          <p><strong>Domain:</strong> ${found.domain}</p>
          <p><strong>Batch:</strong> ${found.batch}</p>
          <p><strong>Duration:</strong> ${found.duration}</p>
          <p><strong>Issue Date:</strong> ${found.issueDate}</p>
          <p><strong>Status:</strong> ✅ Valid & Authentic</p>
        </div>
      `;
    } else {
      resultDiv.innerHTML = `
        <p class="verify-error">
          ❌ Certificate not found. Please check the ID and try again.
        </p>
      `;
    }

  } catch (err) {
    resultDiv.innerHTML = `
      <p class="verify-error">
        ⚠️ Could not connect. Please try again later.
      </p>
    `;
  }
}
