# 🛡️ CredSafe Identity Services Guide (walt.id)

This document outlines the setup and integration of the **Issuer** and **Verifier** services for the CredSafe project. We are using the **walt.id** open-source toolkit to handle Decentralized Identity (DID) and Verifiable Credentials (VC).

## 🚀 1. Infrastructure Setup

To run the identity services locally, follow these steps:

### Prerequisites
- Docker & Docker Compose installed.
- Node.js (for the API wrapper).

### Commands
```powershell
# 1. Navigate to the identity services directory
cd projects/Docvault-identity

# 2. Start the walt.id services
docker-compose up -d

# 3. Check if services are running (Issuer/Verifier API will be at http://localhost:8000)
docker ps
```

---

## 🎓 2. Issuer Service (University/Government)

The Issuer service is configured to issue **SD-JWT** (Selective Disclosure) credentials. This allows the user to share only parts of their data (e.g., just "Age > 18" without revealing their exact birthdate).

### Credential Types
1. **UniversityDegree**: Contains `name`, `degree`, `gpa`, and `graduation_date`.
2. **GovernmentID**: Contains `full_name`, `birth_date`, `id_number`, and `address`.

### Issuing to `did:algo`
When issuing a credential, we link it to the user's Algorand DID:
- **Issuer Payload Example:**
```json
{
  "issuerDid": "did:key:z6MkpTHR8V... (our local issuer key)",
  "subjectDid": "did:algo:V7X...", // This comes from our Blockchain Engineer
  "credentialConfigurationId": "UniversityDegree_SD_JWT",
  "data": {
    "name": "John Doe",
    "degree": "Bachelors in Computer Science",
    "gpa": "3.8",
    "graduation_date": "2023-05-15"
  }
}
```

---

## 🔍 3. Verifier Service

The Verifier service requests a **Verifiable Presentation** from the user's wallet.

### Selective Disclosure (Age Verification)
To verify if a user is over 18 without seeing their birthdate, we use a **Presentation Exchange** request with a filter.

**Request Payload:**
```json
{
  "policies": [
    {
      "policy": "signature"
    },
    {
      "policy": "challenge-response"
    }
  ],
  "presentation_definition": {
    "id": "age-verification",
    "input_descriptors": [
      {
        "id": "GovernmentID",
        "format": { "vc+sd-jwt": { "sd-jwt_alg_values": ["ES256"] } },
        "constraints": {
          "fields": [
            {
              "path": ["$.birth_date"],
              "filter": {
                "type": "string",
                "format": "date",
                "const": "..." // Verification logic for Age > 18
              }
            }
          ]
        }
      }
    ]
  }
}
```

---

## 🛠️ 4. API Wrapper (Node.js)

We have provided a small Node.js wrapper in `/wrapper` that simplifies the interaction with Dockerized walt.id services.

### Setup & Run
```powershell
cd wrapper
npm install
npm start
```

### Endpoints for Frontend
- `POST /api/issue/university`: Triggers OID4VCI flow for a degree.
  - Body: `{ "subjectDid": "did:algo:...", "name": "...", "degree": "...", ... }`
- `POST /api/issue/id`: Triggers OID4VCI flow for a Government ID.
  - Body: `{ "subjectDid": "did:algo:...", "fullName": "...", ... }`
- `GET /api/verify/age`: Generates an OID4VP request for age verification.
- `GET /api/verify/result/:sessionId`: Polls for the verification result and checks if Age > 18.

---

## 👨‍💻 Note for Team Members
- **Blockchain Engineer**: Ensure the `did:algo` string is correctly formatted as per Algorand DID standards.
- **Frontend Engineer**: Use the return URLs from the wrapper endpoints to redirect users to their wallets or display QR codes.

**Do not modify code in `Docvault-contracts` or `Docvault-frontend` directly; all identity logic resides here.**
