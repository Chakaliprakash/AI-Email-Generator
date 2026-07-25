console.log("Extension Loaded");

const API_URL = 'https://ai-email-generator-1-3skg.onrender.com/api/email/generate';

const TONES = ['Professional', 'Friendly', 'Concise', 'Formal'];


function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

function getComposeBox() {
    return document.querySelector('[role="textbox"][g_editable="true"]')
        || document.querySelector('div[aria-label="Message Body"][role="textbox"]');
}

function showToast(message, isError = false) {
    const existing = document.querySelector('.ai-reply-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'ai-reply-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: ${isError ? '#d93025' : '#323232'};
        color: #fff;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 13px;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
        box-shadow: 0 3px 8px rgba(0,0,0,0.24);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => (toast.style.opacity = '1'));

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}



function createAIButton() {
    const button = document.createElement('div');
    button.className = 'ai-reply-button T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('data-tooltip', 'Generate AI Reply');

    
    button.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-right: 8px;
        padding: 0 16px;
        height: 36px;
        border-radius: 18px;
        background-color: #0b57d0;
        color: #fff;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        transition: background-color 0.15s ease, box-shadow 0.15s ease;
        box-shadow: none;
    `;

    button.addEventListener('mouseenter', () => {
        if (!button.dataset.disabled) {
            button.style.backgroundColor = '#0a4bb8';
            button.style.boxShadow = '0 1px 2px rgba(60,64,67,0.3)';
        }
    });
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#0b57d0';
        button.style.boxShadow = 'none';
    });

    button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#fff"/>
        </svg>
        <span class="ai-reply-label">AI Reply</span>
    `;

    return button;
}



function showTonePopup(anchorButton, onSelect) {
    const existing = document.querySelector('.ai-reply-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.className = 'ai-reply-popup';

    // Position using the button's real screen coordinates and attach to
    // <body> so Gmail's overflow:hidden compose wrappers can't clip it.
    const rect = anchorButton.getBoundingClientRect();

    popup.style.cssText = `
        position: fixed;
        left: ${rect.left}px;
        bottom: ${window.innerHeight - rect.top + 8}px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1);
        padding: 6px;
        z-index: 2147483647;
        min-width: 160px;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
    `;

    TONES.forEach(tone => {
        const item = document.createElement('div');
        item.textContent = tone;
        item.style.cssText = `
            padding: 8px 12px;
            font-size: 13px;
            color: #202124;
            border-radius: 4px;
            cursor: pointer;
        `;
        item.addEventListener('mouseenter', () => (item.style.backgroundColor = '#f1f3f4'));
        item.addEventListener('mouseleave', () => (item.style.backgroundColor = 'transparent'));
        item.addEventListener('click', () => {
            popup.remove();
            document.removeEventListener('click', closeHandler);
            onSelect(tone);
        });
        popup.appendChild(item);
    });

    document.body.appendChild(popup);

    // close when clicking elsewhere
    const closeHandler = (e) => {
        if (!popup.contains(e.target) && e.target !== anchorButton) {
            popup.remove();
            document.removeEventListener('click', closeHandler);
        }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 0);
}


function setButtonLoading(button, isLoading) {
    const label = button.querySelector('.ai-reply-label');
    if (isLoading) {
        button.dataset.disabled = 'true';
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.7';
        if (label) label.textContent = 'Generating…';
    } else {
        delete button.dataset.disabled;
        button.style.pointerEvents = '';
        button.style.opacity = '1';
        if (label) label.textContent = 'AI Reply';
    }
}

async function generateReply(button, tone) {
    setButtonLoading(button, true);
    try {
        const emailContent = getEmailContent();

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailContent, tone })
        });

        if (!res.ok) {
            throw new Error(`API request failed (${res.status})`);
        }

        const generatedReply = await res.text();
        const composeBox = getComposeBox();

        if (composeBox) {
            composeBox.focus();
            document.execCommand('insertText', false, generatedReply);
            showToast('Reply generated');
        } else {
            console.error('Compose box was not found');
            showToast('Could not find the compose box', true);
        }
    } catch (error) {
        console.error(error);
        showToast('Failed to generate a reply', true);
    } finally {
        setButtonLoading(button, false);
    }
}

function injectionButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button");
    const button = createAIButton();

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        showTonePopup(button, (tone) => generateReply(button, tone));
    });

    toolbar.insertBefore(button, toolbar.firstChild);
}


const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches?.('.aDh, .btC, [role="dialog"]') ||
                node.querySelector?.('.aDh, .btC, [role="dialog"]'))
        );
        if (hasComposeElements) {
            console.log("Compose window detected");
            setTimeout(injectionButton, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
