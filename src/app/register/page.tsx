"use client";

import { useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const totalSteps = 4;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<any>({});
  const [serverError, setServerError] = useState("");

  /* =========================
      ESTADO DEL FORMULARIO
  ========================= */
  const [form, setForm] = useState({
    // STEP 1
    full_name: "",
    rif: "",
    n_accionistas: "",
    address: "",
    municipality: "",
    home_number: "",
    phone_number: "",
    email: "",

    // STEP 2
    social_object: "",
    products: "",
    start_date: "",
    experience: "",
    comercial_name: "",
    workers: "",
    workers_to_date: "",
    facturation_last_year: "",

    // STEP 3
    mercantil: "",
    capital_suscribed: "",
    capital_paid: "",
    dni: "",
    company_position: "",

    // STEP 4
    n_actions: "",
    actions_type: "",
    amount: "",
    password: "",
    password_confirm: "",
  });

  /* =========================
      INPUT STYLE
  ========================= */
  const inputClass =
    "w-full bg-slate-200 border border-slate-300 text-slate-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition";

  const labelClass = "block text-sm text-slate-600 mb-2";

  const errorClass = "text-red-500 text-sm mt-1";

  /* =========================
      HANDLE CHANGE
  ========================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  /* =========================
      VALIDACIONES FRONT
  ========================= */
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

      if (!form.email.trim()) {
        newErrors.email = "Campo requerido";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Email inválido";
      }
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
      ) {
        newErrors.password_confirm = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================
      NEXT STEP
  ========================= */
  const nextStep = () => {
    const valid = validateStep();

    if (!valid) return;

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  /* =========================
      PREV STEP
  ========================= */
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  /* =========================
      SUBMIT FINAL
  ========================= */
  const handleSubmit = async () => {
    const valid = validateStep();

    if (!valid) return;

    try {
      setLoading(true);
      setServerError("");

      const response = await axios.post(
        "https://fedeinversiones-mvp.onrender.com/api/auth/register/",
        form,
      );

      alert("Empresa registrada correctamente");

      console.log(response.data);

      // reset opcional
      setForm({
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

      setStep(1);
    } catch (error: any) {
      console.log(error);

      /* ======================
          VALIDACIONES BACK
      ====================== */

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      setServerError(
        error.response?.data?.message || "Error al registrar empresa",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      COMPONENTE ERROR
  ========================= */
  const ErrorText = ({ field }: any) =>
    errors[field] ? <p className={errorClass}>{errors[field]}</p> : null;

  return (
    <main className="bg-slate-950">
      <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50">
        <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-8">
          {/* HEADER */}
          <div className="mb-8">
            <p className="text-slate-500 text-sm mb-2">Registro empresarial</p>

            <h2 className="text-3xl font-bold text-slate-700">Crear Cuenta</h2>
          </div>

          {/* STEP BAR */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`h-2 rounded-full ${
                  step >= item ? "bg-emerald-500" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-slate-500 mb-6">
            Paso {step} de {totalSteps}
          </p>

          {serverError && (
            <div className="mb-5 bg-red-100 text-red-700 p-3 rounded-xl">
              {serverError}
            </div>
          )}

          {/* =====================
                STEP 1
          ===================== */}
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Nombres y Apellidos/Razón Social</label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="full_name" />
              </div>

              <div>
                <label className={labelClass}>RIF</label>
                <input
                  name="rif"
                  value={form.rif}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="rif" />
              </div>

              <div>
                <label className={labelClass}>N° Accionistas</label>
                <input
                  type="number"
                  name="n_accionistas"
                  value={form.n_accionistas}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="n_accionistas" />
              </div>

              <div>
                <label className={labelClass}>Dirección</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="address" />
              </div>

              <div>
                <label className={labelClass}>Municipio</label>
                <input
                  name="municipality"
                  value={form.municipality}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="municipality" />
              </div>

              <div>
                <label className={labelClass}>Número Casa</label>
                <input
                  type="number"
                  name="home_number"
                  value={form.home_number}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="home_number" />
              </div>

              <div>
                <label className={labelClass}>Teléfono</label>
                <input
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="phone_number" />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="email" />
              </div>
            </div>
          )}

          {/* STEP 2 */}
{step === 2 && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Objeto Social</label>
                <input
                  name="social_object"
                  value={form.social_object}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="social_object" />
              </div>

              <div>
                <label className={labelClass}>Productos</label>
                <input
                  name="products"
                  value={form.products}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="products" />
              </div>

              <div>
                <label className={labelClass}>Fecha Constitución</label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="start_date" />
              </div>

              <div>
                <label className={labelClass}>Experiencia Sector</label>
                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="experience" />
              </div>

              <div>
                <label className={labelClass}>Nombre Comercial</label>
                <input
                  name="comercial_name"
                  value={form.comercial_name}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="comercial_name" />
              </div>

              <div>
                <label className={labelClass}>Número Trabajadores</label>
                <input
                  type="number"
                  name="workers"
                  value={form.workers}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="workers" />
              </div>


              <div>
                <label className={labelClass}>A la Fecha</label>
                <input
                  type="date"
                  name="workers_to_date"
                  value={form.workers_to_date}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="workers_to_date" />
              </div>

              <div>
                <label className={labelClass}>Volúmen Facturación Último Año (Bs.)</label>
                <input
                  name="facturation_last_year"
                  value={form.facturation_last_year}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="facturation_last_year" />
              </div>
            </div>
          )}

          {/* STEP 3 */}
{step === 3 && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Datos Registro Mercantil</label>
                <input
                  name="mercantil"
                  value={form.mercantil}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="mercantil" />
              </div>

              <div>
                <label className={labelClass}>Capital Social Suscrito</label>
                <input
                type="number"
                  name="capital_suscribed"
                  value={form.capital_suscribed}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="capital_suscribed" />
              </div>

              <div>
                <label className={labelClass}>Capital Social Pagado</label>
                <input
                type="number"
                  name="capital_paid"
                  value={form.capital_paid}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="capital_paid" />
              </div>

              <div>
                <label className={labelClass}>Cédula Representante Legal</label>
                <input
                type="number"
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="dni" />
              </div>

              <div>
                <label className={labelClass}>Cargo en la Empresa</label>
                <input
                  name="company_position"
                  value={form.company_position}
                  onChange={handleChange}
                  className={inputClass}
                />
                <ErrorText field="company_position" />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Nº Acciones</label>
                <input
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
                <ErrorText field="tipoAcciones" />
              </div>

              <div className="md:col-span-2">
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

              <div className="md:col-span-2">
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

              <div className="md:col-span-2">
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

              <div className="md:col-span-2 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-700 flex gap-3">
                <CheckCircle2 />
                <p>
                  Al finalizar, los datos serán enviados para revisión
                  administrativa.
                </p>
              </div>
            </div>
          )}

          {/* BOTONES */}
          <div className="flex justify-between mt-10">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-5 py-3 rounded-xl border border-slate-300 text-slate-600 disabled:opacity-40 flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Anterior
            </button>

            {step < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2"
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Registrar Empresa"
                )}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
