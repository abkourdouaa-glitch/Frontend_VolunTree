import { useState, useRef } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, User, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  
  const form = useRef();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_4ckw9gc', 
      'template_uc1kizt', 
      form.current, 
      { publicKey: 'zChAJUcsmhh-cdWT6' }
    )
    .then(() => {
        toast.success("Message envoyé avec succès !", {
          description: "Nous vous répondrons dans les plus brefs délais.",
        });
        setFormData({ name: "", email: "", message: "" });
    })
    .catch((error) => {
        console.log('FAILED...', error);
        toast.error("Une erreur est survenue lors de l'envoi.");
    });
  };

  return (
    <section id="contact" style={{ background: "#f8fafc", padding: "96px 24px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#E1F5EE", borderRadius: 99,
            padding: "6px 16px", marginBottom: 16,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0F6E56", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Contactez-nous
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "#0f172a", margin: "0 0 12px" }}>
            Une question ? Écrivez-nous
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Notre équipe est là pour vous répondre rapidement et vous accompagner.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, alignItems: "start" }}>

          {/* Infos */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              background: "#085041", borderRadius: 20,
              padding: "32px 28px", color: "white", marginBottom: 8,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "white" }}>Parlons ensemble</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 28px" }}>
                Que vous soyez bénévole ou association, nous sommes disponibles pour répondre à toutes vos questions.
              </p>
              {[
                { icon: <MapPin size={16} />, text: "123 Rue de la Solidarité, Rabat, Maroc" },
                { icon: <Phone  size={16} />, text: "+212 1 23 05 67 74" },
                { icon: <Mail   size={16} />, text: "contact@Volun-Tree.ma" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#9FE1CB", flexShrink: 0,
                  }}>
                    {c.icon}
                  </div>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginTop: 8 }}>{c.text}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: "white", borderRadius: 16,
              padding: "20px 24px", border: "0.5px solid #e2e8f0",
              display: "flex", alignItems: "flex-start", gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "#E1F5EE", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "#0F6E56", flexShrink: 0,
              }}>
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>Réponse garantie</p>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                  Nous répondons à toutes les demandes sous 24h ouvrables.
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div style={{
            background: "white", borderRadius: 20,
            padding: "36px 32px", border: "0.5px solid #e2e8f0",
          }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 28 }}>
              Envoyez-nous un message
            </h3>

            <form ref={form} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Nom */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  <User size={14} style={{ color: "#1D9E75" }} /> Nom complet
                </label>
                <input
                  type="text" name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  required
                  style={{
                    width: "100%", height: 44, padding: "0 14px",
                    border: "0.5px solid #e2e8f0", borderRadius: 10, fontSize: 14,
                    outline: "none", boxSizing: "border-box", transition: "border 0.2s",
                  }}
                  onFocus={(e) => e.target.style.border = "1.5px solid #1D9E75"}
                  onBlur={(e)  => e.target.style.border = "0.5px solid #e2e8f0"}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  <Mail size={14} style={{ color: "#1D9E75" }} /> Adresse e-mail
                </label>
                <input
                  type="email" name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  required
                  style={{
                    width: "100%", height: 44, padding: "0 14px",
                    border: "0.5px solid #e2e8f0", borderRadius: 10, fontSize: 14,
                    outline: "none", boxSizing: "border-box", transition: "border 0.2s",
                  }}
                  onFocus={(e) => e.target.style.border = "1.5px solid #1D9E75"}
                  onBlur={(e)  => e.target.style.border = "0.5px solid #e2e8f0"}
                />
              </div>

              {/* Message */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  <MessageCircle size={14} style={{ color: "#1D9E75" }} /> Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Décrivez votre demande en détail..."
                  rows={5}
                  required
                  style={{
                    width: "100%", padding: "12px 14px",
                    border: "0.5px solid #e2e8f0", borderRadius: 10, fontSize: 14,
                    outline: "none", resize: "none", boxSizing: "border-box",
                    fontFamily: "Inter, sans-serif", transition: "border 0.2s",
                  }}
                  onFocus={(e) => e.target.style.border = "1.5px solid #1D9E75"}
                  onBlur={(e)  => e.target.style.border = "0.5px solid #e2e8f0"}
                />
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "6px 0 0" }}>Minimum 10 caractères</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  background: "#085041", color: "white",
                  border: "none", borderRadius: 10,
                  height: 48, fontSize: 14, fontWeight: 600,
                  cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#0F6E56"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#085041"}
              >
                <Send size={15} /> Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;