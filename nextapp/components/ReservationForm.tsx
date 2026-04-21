'use client';

import { useState, useEffect } from 'react';
import Toast from './Toast';

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Busca as configurações globais ao carregar
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        const timeToMins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
        const formatTime = (mins: number) => { const h = Math.floor(mins/60); const m = mins%60; return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`; };
        
        let openMins = timeToMins('10:00');
        let closeMins = timeToMins('22:00');
        let duration = 90;

        if (data && !data.error) {
          if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
          if (data.open_time) openMins = timeToMins(data.open_time);
          if (data.close_time) closeMins = timeToMins(data.close_time);
          if (data.reservation_duration_mins) duration = data.reservation_duration_mins;
        }
        
        const slots = [];
        // Oculta blocos que ultrapassem ou batam no limite do fechamento + duração
        for (let m = openMins; m <= closeMins - duration; m += 30) {
          slots.push(formatTime(m));
        }
        setAvailableTimes(slots);
      })
      .catch(err => {
        console.error('Erro ao buscar whatsapp/settings', err);
        // Fallback rígido em caso de erro absoluto no servidor
        setAvailableTimes(["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"]);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao enviar reserva.');
      }

      setToast({ message: 'Redirecionando...', type: 'success' });
      
      // Redirecionamento para o WhatsApp se o número estiver configurado
      if (whatsappNumber) {
        const justNumber = whatsappNumber.replace(/\D/g, ''); // Apenas os dígitos
        const mensagem = `Olá, Casa de Tradição! Gostaria de consultar sobre a minha nova solicitação de reserva.\n\n` +
          `👤 *Nome:* ${formData.name}\n` +
          `📧 *E-mail:* ${formData.email}\n` +
          `📞 *Telefone:* ${formData.phone}\n` +
          `📅 *Data:* ${formData.date.split('-').reverse().join('/')}\n` +
          `⏰ *Hora:* ${formData.time}\n` +
          `🍽️ *Pessoas:* ${formData.guests}` +
          (formData.notes ? `\n📝 *Observações:* ${formData.notes}` : '');
          
        window.open(`https://wa.me/${justNumber}?text=${encodeURIComponent(mensagem)}`, '_blank');
      } else {
        setToast({ message: 'Sua reserva foi gravada! (WhatsApp indisponível no momento).', type: 'success' });
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        notes: '',
      });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="res-group">
          <label htmlFor="name">Nome Completo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome"
            required
          />
        </div>

        <div className="res-grid-2">
          <div className="res-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemplo@email.com"
              required
            />
          </div>
          <div className="res-group">
            <label htmlFor="phone">Telefone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              required
            />
          </div>
        </div>

        <div className="res-grid-2">
          <div className="res-group">
            <label htmlFor="date">Data</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="res-grid-2">
            <div className="res-group">
              <label htmlFor="time">Hora</label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Selecione um horário</option>
                {availableTimes.length > 0 ? (
                  availableTimes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))
                ) : (
                  <option value="" disabled>Carregando horários...</option>
                )}
              </select>
            </div>
            <div className="res-group">
              <label htmlFor="guests">Pessoas</label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Pessoa' : 'Pessoas'}</option>
                ))}
                <option value="more">Mais de 10</option>
              </select>
            </div>
          </div>
        </div>

        <div className="res-group">
          <label htmlFor="notes">Observações Especiais (Opcional)</label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Ex: Aniversário, alergias, mesa perto da janela..."
          />
        </div>

        <button type="submit" className="btn-reservar-submit" disabled={loading}>
          {loading ? 'Processando...' : 'Confirmar Solicitação'}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type === 'success' ? 'success' : 'error'}
          onDone={() => setToast(null)}
        />
      )}
    </>
  );
}
