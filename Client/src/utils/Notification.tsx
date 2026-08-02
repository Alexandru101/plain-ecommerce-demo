// Utils //
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import { playSound } from "./SoundManager";

// Types //
type notificationTypes = "info" | "success"  | "alert";
type notificationPayload = {
    type: notificationTypes;
    message: string;
    duration?: number;
};

// Icon Pack //
const icons = {
    info: renderToStaticMarkup(<FaInfoCircle />),
    success: renderToStaticMarkup(<FaCheckCircle />),
    alert: renderToStaticMarkup(<FaExclamationTriangle />),
};

// Notification Event Listener: once called it will fire a custom event with the notification args //
export function emitNotification(args: notificationPayload) {
    window.dispatchEvent( new CustomEvent("app-notification", { detail: args }));
};

// Notification Manager Class (includes all notification methods) //
class NotificationManager {
    private container: HTMLElement;

    constructor() {
        this.container = document.createElement("div");
        this.container.id = "notifications";

        document.body.appendChild(this.container);
    };

    createNotification(type: notificationTypes, message: string, duration: number = 3000): void
    {
        playSound(type);

        const notification = document.createElement("div");
        notification.className = `notification-container ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                ${icons[type]}
            </div>
            
            <span class="notification-text">${message}</span>
        `;

        this.container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add("closing");
            notification.addEventListener("animationend", () => notification.remove(), { once: true});
        }, duration);
    };
}

export default new NotificationManager();