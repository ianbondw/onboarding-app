// src/app/contact/page.tsx
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact — Marengo",
  description: "Get in touch about Marengo client onboarding.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <p className="mt-2 text-slate-600">
        Questions, feedback, or pilot interest? Drop a note and we’ll get back to you.
      </p>
      <div className="mt-4">
        <ContactForm />
      </div>
    </main>
  );
}