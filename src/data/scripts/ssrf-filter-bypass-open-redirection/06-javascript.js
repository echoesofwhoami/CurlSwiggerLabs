# stockCheckPayload.js
window.contentType = 'application/x-www-form-urlencoded';

function payload(data) {
    return new URLSearchParams(data).toString();
}
