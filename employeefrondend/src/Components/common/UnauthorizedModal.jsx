import React, { useEffect, useState } from "react";
import "./UnauthorizedModal.css";
import { UNAUTHORIZED_EVENT } from "../../service/notify";

// Mounted once near the root of the app (see App.js). Listens for the global
// "ems:unauthorized" event and shows a popup - fired either by a client-side
// permission check (instant feedback) or by the backend returning a 403
// (defense in depth, in case someone bypasses the client-side check).
const UnauthorizedModal = () => {
    const [message, setMessage] = useState(null);

    useEffect(() => {
        function handleUnauthorized(e) {
            setMessage(e.detail?.message || "You are not authorized to perform this action.");
        }
        window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
        return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    }, []);

    if (!message) return null;

    return (
        <div className="modal-backdrop" role="presentation" onClick={() => setMessage(null)}>
            <div
                className="modal-card modal-card--danger"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="unauthorized-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-icon">!</div>
                <h3 id="unauthorized-title">Access restricted</h3>
                <p>{message}</p>
                <p className="modal-subtext">Your account has read-only access. Contact an administrator if you need this changed.</p>
                <button className="modal-dismiss" onClick={() => setMessage(null)}>Got it</button>
            </div>
        </div>
    );
};

export default UnauthorizedModal;
