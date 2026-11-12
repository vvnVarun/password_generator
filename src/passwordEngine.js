// Security & entropy calculation utilities
export function calculateEntropy(password) {
  if (!password) return 0;
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33; // special characters

  if (poolSize === 0) return 0;
  const entropy = Math.round(password.length * Math.log2(poolSize));
  return entropy;
}

export function evaluatePasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: 'None',
      color: '#64748b',
      crackTime: 'Instant',
      feedback: ['Generate or enter a password to evaluate.'],
    };
  }

  const entropy = calculateEntropy(password);
  const checks = {
    length: password.length >= 12,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password),
  };

  const satisfiedCount = Object.values(checks).filter(Boolean).length;
  let score = 0;
  let label = 'Very Weak';
  let color = '#ef4444';
  let crackTime = '< 1 millisecond';

  if (entropy < 28) {
    score = 1;
    label = 'Very Weak';
    color = '#ef4444';
    crackTime = 'Instant (< 1 sec)';
  } else if (entropy < 45) {
    score = 2;
    label = 'Weak';
    color = '#f97316';
    crackTime = 'Few seconds to minutes';
  } else if (entropy < 65) {
    score = 3;
    label = 'Moderate';
    color = '#eab308';
    crackTime = 'Hours to days';
  } else if (entropy < 85) {
    score = 4;
    label = 'Strong';
    color = '#22c55e';
    crackTime = 'Months to thousands of years';
  } else {
    score = 5;
    label = 'Uncrackable / Military Grade';
    color = '#06b6d4';
    crackTime = 'Millions of centuries';
  }

  const feedback = [];
  if (password.length < 12) feedback.push('Increase length to at least 12 characters.');
  if (!checks.upper) feedback.push('Add uppercase characters (A-Z).');
  if (!checks.lower) feedback.push('Add lowercase characters (a-z).');
  if (!checks.number) feedback.push('Include numbers (0-9).');
  if (!checks.symbol) feedback.push('Include special symbols (!@#$%^&*).');
  if (feedback.length === 0) {
    feedback.push('Optimal randomness & character diversity achieved!');
  }

  return {
    score,
    label,
    color,
    entropy,
    crackTime,
    feedback,
    checks,
  };
}

// AI-based Phonetic dictionary & smart token sets
const ADJECTIVES = [
  'Brave', 'Cosmic', 'Cyber', 'Quantum', 'Shadow', 'Silent', 'Electric', 
  'Hyper', 'Stellar', 'Iron', 'Solar', 'Velvet', 'Crystal', 'Omega', 'Vivid', 
  'Mighty', 'Thunder', 'Astral', 'Emerald', 'Titan', 'Apex', 'Nova', 'Vortex'
];

const NOUNS = [
  'Falcon', 'Phoenix', 'Matrix', 'Nexus', 'Shield', 'Circuit', 'Cipher', 
  'Beacon', 'Guardian', 'Protocol', 'Vector', 'Reactor', 'Voyager', 'Pioneer',
  'Zenith', 'Echo', 'Drifter', 'Sentinel', 'Dragon', 'Horizon', 'Core', 'Forge'
];

const SYMBOLS = '!@#$%^&*()_+~|}{[]:;?><,.-=';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';

const LEET_MAP = {
  a: '@', A: '4', e: '3', E: '3', i: '1', I: '!',
  o: '0', O: '0', s: '$', S: '5', t: '7', T: '7'
};

// Cryptographically secure random integer
function getRandomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

// AI Smart Random Character Generator
export function generateSmartPassword({
  length = 16,
  includeUpper = true,
  includeLower = true,
  includeNumbers = true,
  includeSymbols = true,
  avoidAmbiguous = false,
  mode = 'smart-entropy', // 'smart-entropy', 'passphrase', 'mnemonic-context'
  contextKeywords = '',
}) {
  let ambiguousChars = 'l1Io0O';

  if (mode === 'passphrase') {
    // Memorable high-entropy passphrase with AI leet substitution & separators
    const adj = ADJECTIVES[getRandomInt(ADJECTIVES.length)];
    const noun = NOUNS[getRandomInt(NOUNS.length)];
    const num = getRandomInt(900) + 100;
    const sym = SYMBOLS[getRandomInt(SYMBOLS.length)];
    let phrase = `${adj}${sym}${noun}${num}`;
    
    // Adjust length if requested longer
    while (phrase.length < length) {
      phrase += SYMBOLS[getRandomInt(SYMBOLS.length)] + getRandomInt(9);
    }
    return phrase;
  }

  if (mode === 'mnemonic-context') {
    // Generate AI contextual security password derived from user prompt keywords
    const words = contextKeywords
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);

    let seedBase = '';
    if (words.length > 0) {
      seedBase = words.map(w => {
        let transformed = w[0].toUpperCase() + w.slice(1).toLowerCase();
        // apply occasional leet
        return transformed.split('').map(ch => (getRandomInt(2) === 1 && LEET_MAP[ch] ? LEET_MAP[ch] : ch)).join('');
      }).join('');
    } else {
      seedBase = ADJECTIVES[getRandomInt(ADJECTIVES.length)] + NOUNS[getRandomInt(NOUNS.length)];
    }

    let result = seedBase;
    while (result.length < length) {
      const charPool = (includeNumbers ? NUMBERS : '') + (includeSymbols ? SYMBOLS : '') + UPPER + LOWER;
      result += charPool[getRandomInt(charPool.length)];
    }
    return result.slice(0, length);
  }

  // Smart Entropy Mode (Character by Character with guaranteed distribution)
  let charset = '';
  if (includeUpper) charset += UPPER;
  if (includeLower) charset += LOWER;
  if (includeNumbers) charset += NUMBERS;
  if (includeSymbols) charset += SYMBOLS;

  if (avoidAmbiguous) {
    charset = charset.split('').filter(c => !ambiguousChars.includes(c)).join('');
  }

  if (!charset) return '';

  let passwordChars = [];
  // Ensure at least one from each active requirement
  if (includeUpper) passwordChars.push(UPPER[getRandomInt(UPPER.length)]);
  if (includeLower) passwordChars.push(LOWER[getRandomInt(LOWER.length)]);
  if (includeNumbers) passwordChars.push(NUMBERS[getRandomInt(NUMBERS.length)]);
  if (includeSymbols) passwordChars.push(SYMBOLS[getRandomInt(SYMBOLS.length)]);

  while (passwordChars.length < length) {
    const randomChar = charset[getRandomInt(charset.length)];
    passwordChars.push(randomChar);
  }

  // Shuffle using Fisher-Yates with crypto random
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.slice(0, length).join('');
}

