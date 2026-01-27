import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";

type FormValues = {
  name: string;
  city: string;
  age: string;
  whatsapp: string;
  experience: string;
};

const initialValues: FormValues = {
  name: "",
  city: "",
  age: "",
  whatsapp: "",
  experience: "",
};

export default function LeadModal() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isValidAge = useMemo(() => {
    const ageNum = Number(values.age);
    return Number.isFinite(ageNum) && ageNum >= 18;
  }, [values.age]);

  useEffect(() => {
    const openHandler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-open-lead-modal]")) {
        setOpen(true);
        setSuccess(null);
        setError(null);
      }
    };

    const escHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("click", openHandler);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("click", openHandler);
      document.removeEventListener("keydown", escHandler);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setValues(initialValues);
  };

  const handleChange =
    (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!values.name || !values.city || !values.age || !values.whatsapp) {
      setError("Completa los campos obligatorios.");
      return;
    }

    if (!isValidAge) {
      setError("Debes ser mayor de 18 años para aplicar.");
      return;
    }

    setSubmitting(true);
    // Simulación de envío
    console.log("Lead enviado (simulado):", values);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess("¡Aplicación enviada! Te contactaremos en menos de 24 horas.");
      setValues(initialValues);
    }, 600);
  };

  if (!open) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={handleClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-label="Formulario de aplicación">
        <header className="modal__header">
          <div>
            <p className="eyebrow">Aplicación segura</p>
            <h3>Completa tus datos</h3>
            <p className="muted">Confirmamos mayoría de edad (+18). No compartimos tu información con terceros.</p>
          </div>
          <button className="close" onClick={handleClose} aria-label="Cerrar modal">
            ×
          </button>
        </header>

        <form className="modal__form" onSubmit={handleSubmit}>
          <label>
            Nombre completo*
            <input type="text" value={values.name} onChange={handleChange("name")} placeholder="Tu nombre" required />
          </label>

          <label>
            Ciudad / País*
            <input
              type="text"
              value={values.city}
              onChange={handleChange("city")}
              placeholder="Ej. Medellín, Colombia"
              required
            />
          </label>

          <label>
            Edad*
            <input
              type="number"
              min={18}
              value={values.age}
              onChange={handleChange("age")}
              placeholder="18+"
              required
              className={!isValidAge && values.age ? "field-error" : undefined}
            />
          </label>

          <label>
            WhatsApp*
            <input
              type="tel"
              value={values.whatsapp}
              onChange={handleChange("whatsapp")}
              placeholder="+57..."
              required
            />
          </label>

          <label>
            Experiencia (opcional)
            <textarea
              value={values.experience}
              onChange={handleChange("experience")}
              placeholder="Cuéntanos brevemente tu experiencia"
              rows={3}
            />
          </label>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar aplicación"}
          </button>
        </form>
      </div>

      <style>
        {`
          .modal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(17, 24, 39, 0.35);
            backdrop-filter: blur(4px);
            z-index: 999;
          }
          .modal {
            position: fixed;
            inset: 50% auto auto 50%;
            transform: translate(-50%, -50%);
            width: min(520px, calc(100% - 32px));
            background: #ffffff;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 22px;
            box-shadow: var(--shadow-soft);
            z-index: 1000;
            color: var(--text);
          }
          .modal__header {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: start;
            margin-bottom: 12px;
          }
          .close {
            border: 1px solid var(--border);
            background: #f3f4f6;
            color: var(--text);
            width: 34px;
            height: 34px;
            border-radius: 10px;
            cursor: pointer;
          }
          .modal__form {
            display: grid;
            gap: 12px;
          }
          label {
            display: grid;
            gap: 6px;
            color: var(--text);
            font-weight: 600;
          }
          input, textarea {
            width: 100%;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: #f9fafb;
            color: var(--text);
            padding: 12px;
            font-size: 1rem;
            outline: none;
            transition: border 120ms ease, box-shadow 120ms ease, background 120ms ease;
          }
          input:focus, textarea:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.18);
            background: #fff;
          }
          .field-error {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.18);
          }
          .error {
            color: var(--primary);
            margin: 0;
          }
          .success {
            color: var(--whatsapp);
            margin: 0;
          }
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-weight: 700;
            border-radius: var(--radius);
            border: 1px solid transparent;
            cursor: pointer;
            padding: 12px 16px;
            background: var(--primary);
            color: #fff;
            box-shadow: 0 10px 24px rgba(255, 107, 107, 0.25);
            transition: transform 120ms ease, background 120ms ease, box-shadow 120ms ease;
          }
          .btn:hover:not(:disabled) {
            background: var(--primary-hover);
            transform: translateY(-1px);
          }
          .btn:disabled {
            opacity: 0.7;
            cursor: progress;
          }
          @media (max-width: 540px) {
            .modal {
              inset: auto 16px 16px 16px;
              transform: none;
            }
          }
        `}
      </style>
    </>
  );
}
