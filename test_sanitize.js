
// Mock regex matching that matches validation.ts logic
function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '';
    let sanitized = url.trim();

    // Block dangerous protocols
    if (sanitized.toLowerCase().startsWith('javascript:') || sanitized.toLowerCase().startsWith('data:')) {
        return '';
    }

    // RELAXED: Allow relative URLs, anchors, and non-standard inputs (like "Notify Soon")
    // Use heuristic: if it looks like a domain without protocol, prepend https://
    // But don't break simple text or anchors
    if (!sanitized.match(/^[a-z]+:\/\//i) && !sanitized.startsWith('/') && !sanitized.startsWith('#') && sanitized.includes('.')) {
        // Simple domain check (contains dot, no protocol, no slash/anchor start)
        sanitized = `https://${sanitized}`;
    }

    return sanitized;
}

const tests = [
    "https://google.com",
    "http://example.com",
    "google.com",
    "www.google.com",
    "/foo/bar",
    "#",
    "javascript:alert(1)",
    "Download Notification",
    "Click Here"
];

tests.forEach(t => {
    console.log(`'${t}' -> '${sanitizeUrl(t)}'`);
});
