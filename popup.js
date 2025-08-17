/* popup.js – minimal & fixed */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- DOM refs ---- */
  const btnSummarize = document.getElementById('summarize-btn');
  const btnCopy      = document.getElementById('copy-btn');
  const resultDiv    = document.getElementById('result');
  const summaryType  = document.getElementById('summary-type');

  /* ---- “Summarize” click handler ---- */
  btnSummarize.addEventListener('click', () => {
    // 1. Make sure we have an API key
    chrome.storage.sync.get(['geminiApiKey'], ({ geminiApiKey }) => {
      if (!geminiApiKey) {
        resultDiv.textContent = 'No API key set! Click the gear icon to add one.';
        return;
      }

      // 2. Show loader
      resultDiv.innerHTML = '<div class="loader"></div>';

      // 3. Ask the active tab for its article text
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: 'GET_ARTICLE_TEXT' },
          async (resp) => {
            if (chrome.runtime.lastError || !resp || !resp.articleText?.trim()) {
              resultDiv.textContent = 'Could not extract text from this page.';
              return;
            }

            // 4. Send to Gemini
            try {
              const summary = await getGeminiSummary(
                resp.articleText,
                summaryType.value,
                geminiApiKey
              );
              resultDiv.textContent = summary;
            } catch (err) {
              resultDiv.textContent = 'Gemini Error! ' + err.message;
            }
          }
        );
      });
    });
  });

  /* ---- “Copy” click handler ---- */
btnCopy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(resultDiv.textContent);
    const oldText = btnCopy.textContent;
    btnCopy.textContent = 'Copied!';
    setTimeout(() => (btnCopy.textContent = oldText), 1500);
  } catch (e) {
    console.error('Copy failed:', e);
  }
});

  /* ------------------------------------------------------------------ */
  /* Helper – call Gemini API                                            */
  async function getGeminiSummary(rawText, type, apiKey) {
    const MAX = 20_000;
    const text =
      rawText.length > MAX ? rawText.slice(0, MAX) + '...' : rawText;

    const promptMap = {
      brief:   'Summarize in 2-3 sentences:\n\n' + text,
      detailed:'Summarize in detail:\n\n' + text,
      bullets: 'Summarize in 5-7 bullet points (start each with "- "):\n\n' + text,
    };

    const prompt = promptMap[type] || promptMap.brief;

    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}));
      throw new Error(error?.message || 'Unknown Gemini error');
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary returned.';
  }
});