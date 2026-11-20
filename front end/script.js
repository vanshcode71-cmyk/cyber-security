
const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("togglePassword");

const strengthText = document.getElementById("strengthText");
const strengthBar = document.getElementById("strengthBar");
const scoreText = document.getElementById("scoreText");

const entropyText = document.getElementById("entropyText");
const entropyDescription = document.getElementById("entropyDescription");
const suggestionText = document.getElementById("suggestionText");

// ======================================
// 1. COMMON WORDS AND PHRASES
// ======================================

const commonWords = [
    "password", "admin", "welcome", "qwerty",
    "letmein", "iloveyou", "monkey", "dragon",
    "football", "india", "hello", "login",
    "master", "secret", "love", "computer",
    "security", "vansh", "user", "guest",
    "root", "sunshine", "princess", "freedom",
    "trustno", "pass", "test", "default",
    "summer", "winter", "spring", "family",
    "shadow", "killer", "superman", "baseball",
    "access", "hockey", "star", "angel"
];

const keyboardPatterns = [
    "qwerty", "asdf", "zxcv",
    "qazwsx", "1q2w3e", "zaq12wsx",
    "qweasd", "poiuy", "lkjh"
];

// ======================================
// 2. NORMALIZE PASSWORD
// ======================================

function normalizePassword(password) {

    return password.toLowerCase()
        .replace(/@/g, "a")
        .replace(/0/g, "o")
        .replace(/1/g, "i")
        .replace(/3/g, "e")
        .replace(/4/g, "a")
        .replace(/\$/g, "s")
        .replace(/5/g, "s")
        .replace(/7/g, "t");
}

// ======================================
// 3. FIND COMMON WORDS
// ======================================

function detectCommonWords(normalized) {

    return commonWords.filter(word =>
        normalized.includes(word)
    );
}

// ======================================
// 4. DETECT NUMBER SEQUENCES
// ======================================

function detectNumberSequences(password) {

    const findings = [];

    const sequences = [
        "0123", "1234", "2345", "3456",
        "4567", "5678", "6789",
        "9876", "8765", "7654",
        "6543", "5432", "4321"
    ];

    for (const sequence of sequences) {

        if (password.includes(sequence)) {
            findings.push(sequence);
        }
    }

    return findings;
}

// ======================================
// 5. MAIN PATTERN DETECTOR
// ======================================

function detectCommonPatterns(password) {

    const normalized = normalizePassword(password);

    const findings = [];

    const words = detectCommonWords(normalized);
    const sequences = detectNumberSequences(password);

    if (words.length > 0) {
        findings.push("Common word: " + words.join(", "));
    }

    for (const pattern of keyboardPatterns) {

        if (normalized.includes(pattern)) {
            findings.push("Keyboard pattern detected");
            break;
        }
    }

    if (sequences.length > 0) {
        findings.push("Sequential numbers detected");
    }

    if (/(.)\1{2,}/i.test(password)) {
        findings.push("Repeated characters detected");
    }

    if (/(19|20)\d{2}/.test(password)) {
        findings.push("Year detected");
    }

    if (/[A-Za-z]+[0-9]+[!@#$%^&*]+/.test(password)) {
        findings.push("Word + number + symbol combination");
    }

    return [...new Set(findings)];
}

// ======================================
// 6. REQUIREMENT DISPLAY
// ======================================

function updateRequirement(id, condition) {

    const element = document.getElementById(id);

    element.classList.toggle("valid", condition);

    element.querySelector("span").textContent =
        condition ? "✓" : "✕";
}

// ======================================
// 7. SHOW / HIDE PASSWORD
// ======================================

toggleButton.addEventListener("click", function () {

    const showing = passwordInput.type === "password";

    passwordInput.type = showing ? "text" : "password";
    toggleButton.textContent = showing ? "Hide" : "Show";

});

// ======================================
// 8. PASSWORD ANALYSIS
// ======================================

passwordInput.addEventListener("input", function () {

    const password = passwordInput.value;

    if (!password) {

        strengthText.textContent = "Not Tested";
        strengthBar.style.width = "0%";
        scoreText.textContent = "Score: 0/5";

        entropyText.textContent = "Entropy: 0 bits";
        entropyDescription.textContent =
            "Enter a password to calculate entropy.";

        suggestionText.textContent =
            "Enter a password to begin analysis.";

        [
            "length", "uppercase", "lowercase",
            "number", "special", "commonCheck"
        ].forEach(id => updateRequirement(id, false));

        return;
    }

    // Character checks

    const hasLength = password.length >= 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    // Pattern analysis

    const patterns = detectCommonPatterns(password);
    const predictable = patterns.length > 0;

    // Update checklist

    updateRequirement("length", hasLength);
    updateRequirement("uppercase", hasUppercase);
    updateRequirement("lowercase", hasLowercase);
    updateRequirement("number", hasNumber);
    updateRequirement("special", hasSpecial);
    updateRequirement("commonCheck", !predictable);

    // Basic score

    const checks = [
        hasLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecial
    ];

    let score = checks.filter(Boolean).length;

    // Penalize predictable patterns

    if (predictable) {
        score = Math.max(0, score - 2);
    }

    // Entropy estimate

    let pool = 0;

    if (hasLowercase) pool += 26;
    if (hasUppercase) pool += 26;
    if (hasNumber) pool += 10;
    if (hasSpecial) pool += 32;

    const entropy = password.length * Math.log2(pool);

    entropyText.textContent =
        "Entropy: " + entropy.toFixed(2) + " bits";

    entropyDescription.textContent =
        "Theoretical estimate based on character variety.";

    // Strength classification

    let strength;
    let color;

    if (predictable || score <= 2) {
        strength = "Weak";
        color = "#ef4444";
    }
    else if (score === 3) {
        strength = "Medium";
        color = "#facc15";
    }
    else if (score === 4) {
        strength = "Strong";
        color = "#22c55e";
    }
    else {
        strength = "Very Strong";
        color = "#22c55e";
    }

    strengthText.textContent = strength;
    strengthText.style.color = color;

    strengthBar.style.width = (score * 20) + "%";
    strengthBar.style.background = color;

    scoreText.textContent = "Score: " + score + "/5";

    // Recommendations

    const suggestions = [];

    if (!hasLength) suggestions.push("Use at least 12 characters.");
    if (!hasUppercase) suggestions.push("Add uppercase letters.");
    if (!hasLowercase) suggestions.push("Add lowercase letters.");
    if (!hasNumber) suggestions.push("Add numbers.");
    if (!hasSpecial) suggestions.push("Add special characters.");

    if (predictable) {
        suggestions.push(
            "Avoid predictable patterns: " + patterns.join("; ")
        );
    }

    suggestionText.textContent = suggestions.length
        ? suggestions.join(" ")
        : "No known patterns detected. Use a unique, unpredictable password.";

});
