import { WHATSAPP_MESSAGE, WHATSAPP_NUMBER } from "../../lib/constants";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export default function StickyWhatsApp() {
  return (
    <>
      <a className="wpp" href={whatsappUrl} target="_blank" rel="noopener" aria-label="Contactar por WhatsApp">
        <span className="wpp__icon">💬</span>
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
            font-size: 1.2rem;
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
