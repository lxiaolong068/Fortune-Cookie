const fs = require('fs');
const path = require('path');

// 1. Simulating environment loading from .env.local
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    console.log(`Reading environment from: ${envPath}`);

    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            // Simple parse: key=value, ignoring comments
            line = line.trim();
            if (!line || line.startsWith('#')) return;

            const idx = line.indexOf('=');
            if (idx !== -1) {
                const key = line.substring(0, idx).trim();
                let value = line.substring(idx + 1).trim();
                // Remove enclosing quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
    } else {
        console.warn("⚠️ .env.local file not found!");
    }
} catch (e) {
    console.error("Error reading .env.local", e);
}

// 2. Simulating the logic from lib/openrouter.ts
const configuredModel = (process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini").trim();

// 3. Output results
console.log("\n---------------------------------------------------");
console.log("Configuration Test Results");
console.log("---------------------------------------------------");
console.log(`[Env Var] OPENROUTER_MODEL: ${process.env.OPENROUTER_MODEL || '(undefined)'}`);
console.log(`[App Logic] Effective Model: "${configuredModel}"`);

if (process.env.OPENROUTER_MODEL && configuredModel === process.env.OPENROUTER_MODEL) {
    console.log("\n✅ SUCCESS: Application will use the configured model.");
} else if (!process.env.OPENROUTER_MODEL && configuredModel === "openai/gpt-4o-mini") {
    console.log("\nℹ️ INFO: No custom model set. Application will use default: openai/gpt-4o-mini");
} else {
    console.log("\n❌ WARNING: Configuration mismatch.");
}
console.log("---------------------------------------------------");
