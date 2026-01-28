import { WHATSAPP_MESSAGE, WHATSAPP_NUMBER } from "../../lib/constants";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export default function StickyWhatsApp() {
  return (
    <>
      <a className="wpp" href={whatsappUrl} target="_blank" rel="noopener" aria-label="Contactar por WhatsApp">
        <svg className="wpp__icon" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 3C9.4 3 4 8.2 4 14.7c0 2.4.8 4.6 2 6.5L4 29l7-2.1c1.7.9 3.6 1.3 5.5 1.3 6.6 0 12-5.2 12-11.7S22.6 3 16 3Zm0 2.3c5.3 0 9.7 4.2 9.7 9.4 0 5.2-4.3 9.4-9.7 9.4-1.7 0-3.4-.5-4.8-1.3l-.4-.2-4.1 1.2 1.3-3.9-.3-.4c-1-1.5-1.6-3.2-1.6-5 0-5.2 4.3-9.4 9.7-9.4Zm-5.4 4c-.1-.2-.3-.2-.5-.2h-.4c-.1 0-.3 0-.4.2-.1.2-1.1 1-.1 3.1.9 1.7 2.1 3.3 3.9 4.5 1.8 1.1 2.7 1.3 3.3 1.2.6-.1 1.6-.7 1.8-1.4.2-.7.2-1.2.2-1.3 0-.1-.1-.2-.3-.3-.2-.1-1.5-.7-1.7-.8-.2-.1-.4 0-.5.1-.1.1-.6.7-.7.9-.1.1-.2.1-.3 0-.1 0-.5-.2-1.1-.5-1-.6-1.6-1.4-1.8-1.6-.1-.1 0-.2.1-.3.1-.1.2-.2.3-.3.1-.1.1-.2.2-.3.1-.1.1-.2.2-.3.1-.1.1-.2 0-.3-.1-.1-.8-2.1-.9-2.3-.1-.2-.2-.2-.3-.2Z" />
        </svg>
        <span className="wpp__text">WhatsApp</span>
      </a>
      <style>
        {`
          .wpp {
            position: fixed;
            right: 18px;
            bottom: 18px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            border-radius: 999px;
            background: var(--whatsapp);
            color: #0f172a;
            font-weight: 700;
            box-shadow: 0 14px 28px rgba(37, 211, 102, 0.35);
            z-index: 900;
            transition: transform 120ms ease, background 120ms ease, box-shadow 120ms ease;
          }
          .wpp:hover {
            background: var(--whatsapp-hover);
            transform: translateY(-1px);
          }
          .wpp__icon {
            width: 18px;
            height: 18px;
            fill: #0f172a;
          }
          @media (max-width: 480px) {
            .wpp {
              right: 14px;
              bottom: 14px;
              padding: 12px 14px;
            }
            .wpp__text {
              font-size: 0.95rem;
            }
          }
        `}
      </style>
    </>
  );
}
