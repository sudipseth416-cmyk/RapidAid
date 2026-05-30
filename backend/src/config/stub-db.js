/**
 * Lightweight in-memory store when MongoDB is unavailable.
 * Powers auth/login for local demos only.
 */
const PASSWORD_HASH =
  "$2a$12$HdiuAZ/ZvfSiHqopbGPa8ukbcNutUOSk/vELir20JO.5XcPEkxcty";

const users = new Map();

function makeUser(id, data) {
  return {
    _id: id,
    ...data,
    passwordHash: PASSWORD_HASH,
    toString: () => id,
    save: async () => {},
  };
}

export function initStubUsers() {
  if (users.size > 0) return;

  users.set(
    "citizen-1",
    makeUser("citizen-1", {
      role: "citizen",
      profile: { name: "Rajesh Kumar", phone: "+919876543210", city: "Mumbai" },
      medicalId: {
        bloodGroup: "B+",
        allergies: ["Penicillin"],
        conditions: ["Type 2 Diabetes"],
      },
      isPhoneVerified: true,
      isVerified: true,
    })
  );

  users.set(
    "ambulance-1",
    makeUser("ambulance-1", {
      role: "ambulance",
      profile: { name: "Amit Singh", phone: "+919876543220" },
      isPhoneVerified: true,
      isVerified: true,
      linkedAmbulanceId: "amb-1",
    })
  );

  users.set(
    "hospital-1",
    makeUser("hospital-1", {
      role: "hospital",
      profile: {
        name: "Dr. Ananya Sharma",
        email: "emergency@kemhospital.dev",
        hospitalName: "KEM Hospital",
        city: "Mumbai",
      },
      isEmailVerified: true,
      isApproved: true,
      isVerified: true,
      linkedHospitalId: "hos-1",
    })
  );
}

export function stubFindUser({ identifier, role }) {
  initStubUsers();
  const idLower = identifier.toLowerCase();
  const phoneNorm = identifier.replace(/\s/g, "");

  for (const user of users.values()) {
    if (role && user.role !== role) continue;
    const email = user.profile.email?.toLowerCase();
    const phone = user.profile.phone?.replace(/\s/g, "");
    if (email === idLower || phone === phoneNorm || phone === identifier) {
      return user;
    }
  }
  return null;
}

export function stubFindById(id) {
  initStubUsers();
  return users.get(id) ?? null;
}

export function isStubMode() {
  return process.env.RAPIDAID_STUB_DB === "true";
}

export function enableStubMode() {
  process.env.RAPIDAID_STUB_DB = "true";
  initStubUsers();
  console.log("Stub DB active — login with seed accounts / password123");
}
