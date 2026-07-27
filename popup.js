document.addEventListener('DOMContentLoaded', async () => {
    const outputArea = document.getElementById('output');

    // Restore saved notes or status from local storage if clicked away
    const saved = await chrome.storage.local.get(['savedNotes']);
    if (saved.savedNotes) {
        outputArea.value = saved.savedNotes;
    }

    // Auto-save changes if edited manually
    outputArea.addEventListener('input', () => {
        chrome.storage.local.set({ savedNotes: outputArea.value });
    });
});

document.getElementById('scanBtn').addEventListener('click', async () => {
    const outputArea = document.getElementById('output');
    outputArea.value = "Scraping DOM and executing Operational Filter...";
    await chrome.storage.local.set({ savedNotes: outputArea.value });

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) {
            outputArea.value = "Error: No active tab identified.";
            return;
        }

        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const article = document.querySelector('article, main, #main-content, .markdown-body');
                return article ? article.innerText : document.body.innerText;
            }
        });

        if (!results || !results[0] || !results[0].result) {
            outputArea.value = "Error: Could not read target DOM content.";
            return;
        }

        const rawText = results[0].result;

        const systemPrompt = `You are a high-density, technical study ingestion engine.
Your goal is to parse raw material and extract ONLY operational mechanics, trade-offs, and actionable logic.

STUDY SPEED KEY RULE:
- EVERY entry MUST explicitly answer: How does Input/Data X become Result Y? OR When do I pick Tool/Technique A over B?
- Delete all basic dictionary definitions, fluff, generic intros, and isolated vocabulary lists.
- If a term provides no decision-making value or operational mechanism, OMIT IT ENTIRELY.

MARKDOWN & HEADER FORMATTING RULES:
- Main Title MUST use ##
- Sub-sections MUST use ####
- Output MUST strictly match the layout template below.

OUTPUT TEMPLATE EXACT STRUCTURE:

## [Core Subject / Topic Title]

#### Context & Operational Purpose
* Short, high-density summary of what this solves and the target scenario.

#### Decision Matrix & Mechanics
| Option / Paradigm | Data In -> Process | Operational Decision (When to pick A over B) |
| :--- | :--- | :--- |
| [Tool/Technique A] | [Input -> Core Mechanism] | [Specific condition or constraint that makes this the choice] |
| [Tool/Technique B] | [Input -> Core Mechanism] | [Specific condition or constraint that makes this the choice] |

#### Execution & Command Syntaxes
* **[Technique/Tool Name]** :: [Input/Surface] -> [Mechanism]
\`\`\`bash
# Exact execution syntax or payload
[command / syntax]
\`\`\`

#### Tactical Notes & Trade-offs
> **Core Decision Rule:** [Single line summary on the critical trade-off or primary takeaway]`;

        const response = await fetch('http://127.0.0.1:8080/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'DeepSeek-Coder-V2-Lite-Instruct-Q4_K_M.gguf',
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Text to parse:\n\n${rawText}` }
                ],
                temperature: 0.0,
                stream: false
            })
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            let content = data.choices[0].message.content.trim();

            content = content
                .replace(/^```markdown\n?/i, '')
                .replace(/^```text\n?/i, '')
                .replace(/^```\n?/, '')
                .replace(/\n?```$/, '');

            outputArea.value = content;
            await chrome.storage.local.set({ savedNotes: content });
        } else {
            outputArea.value = "Error: Unexpected API response structure.";
            await chrome.storage.local.set({ savedNotes: outputArea.value });
        }

    } catch (err) {
        outputArea.value = `Execution Failed: Ensure llama-server is listening on http://127.0.0.1:8080.\nDetails: ${err.message}`;
        await chrome.storage.local.set({ savedNotes: outputArea.value });
    }
});

// Copy button logic
document.getElementById('copyBtn').addEventListener('click', () => {
    const outputArea = document.getElementById('output');
    if (!outputArea.value) return;

    outputArea.select();
    navigator.clipboard.writeText(outputArea.value);

    const btn = document.getElementById('copyBtn');
    btn.innerText = "Copied to Clipboard!";
    setTimeout(() => btn.innerText = "Copy to Obsidian", 2000);
});

// Clear button logic to reset session and close interface cleanly
document.getElementById('clearBtn').addEventListener('click', async () => {
    await chrome.storage.local.remove(['savedNotes']);
    const outputArea = document.getElementById('output');
    outputArea.value = "";
    window.close(); // Cleanly terminates popup interface
});