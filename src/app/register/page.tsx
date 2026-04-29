"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Landmark,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const totalSteps = 4;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [serverError, setServerError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    rif: "",
    n_accionistas: "",
    address: "",
    municipality: "",
    home_number: "",
    phone_number: "",
    email: "",
    social_object: "",
    products: "",
    start_date: "",
    experience: "",
    comercial_name: "",
    workers: "",
    workers_to_date: "",
    facturation_last_year: "",
    mercantil: "",
    capital_suscribed: "",
    capital_paid: "",
    dni: "",
    company_position: "",
    n_actions: "",
    actions_type: "",
    amount: "",
    password: "",
    password_confirm: "",
  });

  const inputClass =
    "w-full bg-slate-100 border border-slate-300 text-slate-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm";
  const labelClass = "block text-sm text-slate-600 mb-2 font-medium";
  const errorClass = "text-red-500 text-xs mt-1";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "phone_number") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 11);

      const validPrefixes = ["0412", "0414", "0424", "0416", "0426", "0212"];

      if (onlyNumbers.length >= 4) {
        const prefix = onlyNumbers.slice(0, 4);

        if (!validPrefixes.includes(prefix)) {
          setErrors({
            ...errors,
            phone_number: "Código no válido en Venezuela",
          });
        } else {
          setErrors({
            ...errors,
            phone_number: "",
          });
        }

        const rest = onlyNumbers.slice(4);
        newValue = rest ? `${prefix}-${rest}` : `${prefix}-`;
      } else {
        newValue = onlyNumbers;
        setErrors({
          ...errors,
          phone_number: "",
        });
      }
    } else {
      setErrors({ ...errors, [name]: "" });
    }

    setForm({ ...form, [name]: newValue });
  };

  const normalizeErrors = (data: any) => {
    const errors: any = {};

    Object.keys(data || {}).forEach((key) => {
      if (!["detail", "message", "error", "msg"].includes(key)) {
        errors[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
      }
    });

    return errors;
  };

  const validateStep = () => {
    let newErrors: any = {};
    if (step === 1) {
      if (!form.full_name.trim()) newErrors.full_name = "Campo requerido";
      if (!form.rif.trim()) newErrors.rif = "Campo requerido";
      if (!form.n_accionistas.trim())
        newErrors.n_accionistas = "Campo requerido";
      if (!form.address.trim()) newErrors.address = "Campo requerido";
      if (!form.municipality.trim()) newErrors.municipality = "Campo requerido";
      if (!form.home_number.trim()) newErrors.home_number = "Campo requerido";
      if (!form.phone_number.trim()) newErrors.phone_number = "Campo requerido";
      if (!form.email.trim()) newErrors.email = "Campo requerido";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = "Email inválido";
    }
    if (step === 2) {
      if (!form.social_object.trim())
        newErrors.social_object = "Campo requerido";
      if (!form.products.trim()) newErrors.products = "Campo requerido";
      if (!form.start_date.trim()) newErrors.start_date = "Campo requerido";
      if (!form.experience.trim()) newErrors.experience = "Campo requerido";
      if (!form.comercial_name.trim())
        newErrors.comercial_name = "Campo requerido";
      if (!form.workers.trim()) newErrors.workers = "Campo requerido";
      if (!form.workers_to_date.trim())
        newErrors.workers_to_date = "Campo requerido";
      if (!form.facturation_last_year.trim())
        newErrors.facturation_last_year = "Campo requerido";
    }
    if (step === 3) {
      if (!form.mercantil.trim()) newErrors.mercantil = "Campo requerido";
      if (!form.capital_suscribed.trim())
        newErrors.capital_suscribed = "Campo requerido";
      if (!form.capital_paid.trim()) newErrors.capital_paid = "Campo requerido";
      if (!form.dni.trim()) newErrors.dni = "Campo requerido";
      if (!form.company_position.trim())
        newErrors.company_position = "Campo requerido";
    }
    if (step === 4) {
      if (!form.n_actions.trim()) newErrors.n_actions = "Campo requerido";
      if (!form.actions_type.trim()) newErrors.actions_type = "Campo requerido";
      if (!form.amount.trim()) newErrors.amount = "Campo requerido";
      if (!form.password.trim()) newErrors.password = "Campo requerido";
      if (!form.password_confirm.trim())
        newErrors.password_confirm = "Campo requerido";
      if (
        form.password &&
        form.password_confirm &&
        form.password !== form.password_confirm
      )
        newErrors.password_confirm = "Las contraseñas no coinciden";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep() && step < totalSteps) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const emptyForm = {
    full_name: "",
    rif: "",
    n_accionistas: "",
    address: "",
    municipality: "",
    home_number: "",
    phone_number: "",
    email: "",
    social_object: "",
    products: "",
    start_date: "",
    experience: "",
    comercial_name: "",
    workers: "",
    workers_to_date: "",
    facturation_last_year: "",
    mercantil: "",
    capital_suscribed: "",
    capital_paid: "",
    dni: "",
    company_position: "",
    n_actions: "",
    actions_type: "",
    amount: "",
    password: "",
    password_confirm: "",
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);
      setServerError("");
      setSuccessMessage("");

      const response = await axios.post(
        "https://fedeinversiones-mvp.onrender.com/api/auth/register/",
        form,
        { timeout: 30000 },
      );

      const data = response.data;

      setSuccessMessage(
        data?.message || data?.detail || "Registro completado correctamente",
      );

      setForm(emptyForm);
      setStep(1);

      setTimeout(() => {
        router.push("/login");
      }, 2200);
    } catch (error: any) {
      const data = error.response?.data;

      let fieldErrors: any = {};

      if (data && typeof data === "object") {
        Object.keys(data).forEach((key) => {
          if (
            key !== "detail" &&
            key !== "message" &&
            key !== "error" &&
            key !== "msg"
          ) {
            fieldErrors[key] = Array.isArray(data[key])
              ? data[key][0]
              : data[key];
          }
        });
      }

      setErrors(fieldErrors);

      setServerError(
        data?.detail || data?.message || data?.error || data?.msg || "",
      );

      setErrors(normalizeErrors(data));
    }
  };

  const ErrorText = ({ field }: { field: string }) =>
    errors[field] ? <p className={errorClass}>{errors[field]}</p> : null;

  const stepTitles = [
    "Datos de la Empresa",
    "Información Comercial",
    "Capital y Representante",
    "Acciones y Acceso",
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex flex-col">
      <header className="border-b border-white/10 px-4 sm:px-8 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
          <Landmark className="text-white" size={18} />
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-none">
            FEDEINVERSIONES
          </h1>
          <p className="text-slate-500 text-xs hidden sm:block">
            Sistema Nacional Financiero
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="ml-auto text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 transition font-medium"
        >
          ¿Ya tienes cuenta? Inicia sesión →
        </button>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8">
          <div className="mb-6 sm:mb-8">
            <p className="text-slate-500 text-sm mb-1">Registro empresarial</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">
              Crear Cuenta
            </h2>
            <p className="text-emerald-600 text-sm font-medium mt-1">
              {stepTitles[step - 1]}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`h-2 rounded-full transition-all ${step >= item ? "bg-emerald-500" : "bg-slate-200"}`}
              />
            ))}
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mb-5">
            Paso {step} de {totalSteps}
          </p>

          {successMessage && (
            <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm font-medium">
              {successMessage}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {[
                {
                  label: "Nombres y Apellidos / Razón Social",
                  name: "full_name",
                  type: "text",
                },
                { label: "RIF", name: "rif", type: "text" },
                {
                  label: "N° Accionistas",
                  name: "n_accionistas",
                  type: "number",
                },
                { label: "Dirección", name: "address", type: "text" },
                { label: "Municipio", name: "municipality", type: "text" },
                { label: "Número Casa", name: "home_number", type: "number" },
                { label: "Teléfono", name: "phone_number", type: "text" },
                { label: "Email", name: "email", type: "email" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={(form as any)[name]}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <ErrorText field={name} />
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {[
                { label: "Objeto Social", name: "social_object", type: "text" },
                { label: "Productos", name: "products", type: "text" },
                {
                  label: "Fecha Constitución",
                  name: "start_date",
                  type: "date",
                },
                {
                  label: "Experiencia Sector",
                  name: "experience",
                  type: "text",
                },
                {
                  label: "Nombre Comercial",
                  name: "comercial_name",
                  type: "text",
                },
                { label: "N° Trabajadores", name: "workers", type: "number" },
                { label: "A la Fecha", name: "workers_to_date", type: "date" },
                {
                  label: "Facturación Último Año (Bs.)",
                  name: "facturation_last_year",
                  type: "number",
                },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={(form as any)[name]}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <ErrorText field={name} />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="sm:col-span-2">
                {/* <div> */}
                <label className={labelClass}>Datos Registro Mercantil</label>
                <input
                  type="text"
                  name="mercantil"
                  value={form.mercantil}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="mercantil" />
                {/* </div> */}
              </div>
              {[
                {
                  label: "Capital Social Suscrito",
                  name: "capital_suscribed",
                  type: "number",
                },
                {
                  label: "Capital Social Pagado",
                  name: "capital_paid",
                  type: "number",
                },
                {
                  label: "Cédula Representante Legal",
                  name: "dni",
                  type: "number",
                },
                {
                  label: "Cargo en la Empresa",
                  name: "company_position",
                  type: "text",
                },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={(form as any)[name]}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <ErrorText field={name} />
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className={labelClass}>Nº Acciones</label>
                <input
                  type="number"
                  name="n_actions"
                  value={form.n_actions}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="n_actions" />
              </div>
              <div>
                <label className={labelClass}>Tipo Acciones</label>
                <input
                  name="actions_type"
                  value={form.actions_type}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="actions_type" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Monto</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="amount" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="password" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Confirmar Contraseña</label>
                <input
                  type="password"
                  name="password_confirm"
                  value={form.password_confirm}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="password_confirm" />
              </div>
              <div className="sm:col-span-2 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-emerald-700 flex gap-3 items-start text-sm">
                <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
                <p>
                  Al finalizar, los datos serán enviados para revisión
                  administrativa.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 sm:mt-10 gap-3">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-4 sm:px-5 py-3 rounded-xl border border-slate-300 text-slate-600 disabled:opacity-40 flex items-center gap-2 text-sm sm:text-base transition hover:bg-slate-50"
            >
              <ChevronLeft size={18} />
              <span className="hidden xs:inline">Anterior</span>
            </button>

            {step < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-4 sm:px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 text-sm sm:text-base transition"
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 sm:px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 text-sm sm:text-base transition disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Enviando...
                  </>
                ) : (
                  "Registrar Empresa"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
