// Tiny event bus so any part of the app (apiClient's interceptor included) can
// pop the "you're not authorized" modal without prop-drilling handlers around.
export const UNAUTHORIZED_EVENT = "ems:unauthorized";

export function notifyUnauthorized(message) {
    window.dispatchEvent(
        new CustomEvent(UNAUTHORIZED_EVENT, {
            detail: { message: message || "You are not authorized to perform this action." },
        })
    );
}
