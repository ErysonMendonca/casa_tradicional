'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';
import type { Category, Product } from '@/lib/supabase/types';
import { logoutCustom } from '@/app/actions/auth';
import { uploadFile } from '@/lib/supabase/storage';

type ActiveTab = 'categories' | 'products' | 'reservations' | 'settings';

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

interface ToastState { message: string; type: 'success' | 'error' | 'info' }

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  type: 'danger' | 'warning' | 'info';
}

// Helper para validar URLs de imagem e evitar o erro "Failed to construct 'URL': Invalid URL" do Next.js
function validateImageSrc(src: string | undefined | null, fallback: string): string {
  if (!src || typeof src !== 'string' || src.trim() === '') return fallback;
  if (src.startsWith('/') || src.startsWith('data:')) return src;
  try {
    new URL(src);
    return src;
  } catch (e) {
    return fallback;
  }
}

// ─── helpers de fetch ──────────────────────────────────────────────────────
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

const SettingsImageField = ({ id, label, value, onChange, dimensions, uploading, onFileChange }: any) => {
  return (
    <div className="form-group">
      <label>{label} <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 400 }}>({dimensions})</span></label>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
           <input 
             type="file" 
             accept="image/*" 
             onChange={(e) => onFileChange(e.target.files?.[0] || null, onChange, id)} 
             style={{ fontSize: '0.8rem', padding: '8px', border: '1px solid #ddd', borderRadius: 4, width: '100%' }} 
           />
           {uploading && <p style={{ fontSize: '0.7rem', color: '#bd8c31', marginTop: 4 }}>Enviando imagem...</p>}
        </div>
        {value && (
          <div style={{ width: 60, height: 40, position: 'relative', borderRadius: 4, overflow: 'hidden', border: '1px solid #ddd' }}>
            <Image 
              src={validateImageSrc(value, '/hero_bg.png')} 
              alt={label} 
              fill 
              style={{ objectFit: 'cover' }} 
              unoptimized
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('Admin'); // Placeholder para o e-mail, pode ser buscado do DB futuramente
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Settings form
  const [setTotalTables, setFormTotalTables] = useState('10');
  const [setOpenTime, setFormOpenTime] = useState('10:00');
  const [setCloseTime, setFormCloseTime] = useState('22:00');
  const [setDuration, setFormDuration] = useState('90');
  const [setWhatsapp, setFormWhatsapp] = useState('');

  // Conteúdo e Rodapé
  const [aboutTitle, setAboutTitle] = useState('NOSSA HISTÓRIA');
  const [aboutText, setAboutText] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactPhone2, setContactPhone2] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [footerAboutText, setFooterAboutText] = useState('');
  const [footerRights, setFooterRights] = useState('');

  // Homepage Personalization
  const [heroTitle, setHeroTitle] = useState('TRADIÇÃO QUE ALIMENTA A ALMA.');
  const [heroImage, setHeroImage] = useState('/hero_bg.png');
  const [highlight1Title, setHighlight1Title] = useState('MOQUECA NA PANELA DE BARRO');
  const [highlight1Image, setHighlight1Image] = useState('/moqueca.png');
  const [highlight1Desc, setHighlight1Desc] = useState('');
  const [highlight2Title, setHighlight2Title] = useState('FEIJOADA COMPLETA');
  const [highlight2Image, setHighlight2Image] = useState('/feijoada.png');
  const [highlight2Desc, setHighlight2Desc] = useState('');
  const [highlight3Title, setHighlight3Title] = useState('PICANHA NA CHAPA');
  const [highlight3Image, setHighlight3Image] = useState('/picanha.png');
  const [highlight3Desc, setHighlight3Desc] = useState('');
  const [aboutImage, setAboutImage] = useState('/historia_bg.png');
  const [bookingTitle, setBookingTitle] = useState('VIVA A EXPERIÊNCIA');
  const [bookingDesc, setBookingDesc] = useState('');
  const [locationDesc, setLocationDesc] = useState('');
  const [locationMapIframe, setLocationMapIframe] = useState('');
  const [colorPrimary, setColorPrimary] = useState('#7E1C1C');
  const [colorSecondary, setColorSecondary] = useState('#371D10');
  const [colorTertiary, setColorTertiary] = useState('#F4EFE6');

  // Simulator State
  const [simDate, setSimDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('categories');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });

  const askConfirmation = (title: string, message: string, onConfirm: () => void, type: ConfirmState['type'] = 'danger') => {
    setConfirmState({ isOpen: true, title, message, onConfirm, type });
  };

  // Category form
  const [catId, setCatId] = useState('');
  const [catName, setCatName] = useState('');
  const [catThumb, setCatThumb] = useState('');
  const [catFile, setCatFile] = useState<File | null>(null);

  // Product form
  const [prodId, setProdId] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodFile, setProdFile] = useState<File | null>(null);
  const [prodDesc, setProdDesc] = useState('');
  const [prodIngredients, setProdIngredients] = useState('');
  const [saving, setSaving] = useState(false);
  const [settingsUploading, setSettingsUploading] = useState<{ [key: string]: boolean }>({});

  const handleSettingsFileChange = async (file: File | null, setter: (url: string) => void, id: string) => {
    if (!file) return;
    setSettingsUploading(prev => ({ ...prev, [id]: true }));
    try {
      const url = await uploadFile(file, 'settings');
      setter(url);
      showToast('Imagem enviada com sucesso!');
    } catch (err) {
      showToast('Erro ao enviar imagem.', 'error');
    } finally {
      setSettingsUploading(prev => ({ ...prev, [id]: false }));
    }
  };

  const showToast = useCallback((message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type });
  }, []);

  // ─── Carregar dados do Supabase ───────────────────────────────────────────
  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [cats, prods, resvs, sets] = await Promise.all([
        apiFetch<Category[]>('/api/categories'),
        apiFetch<Product[]>('/api/products'),
        apiFetch<Reservation[]>('/api/reservations'),
        apiFetch<any>('/api/settings').catch(() => null),
      ]);
      setCategories(cats);
      setProducts(prods);
      setReservations(resvs);
      if (sets) {
        setSettings(sets);
        setFormTotalTables(String(sets.total_tables));
        setFormOpenTime(sets.open_time.substring(0, 5));
        setFormCloseTime(sets.close_time.substring(0, 5));
        setFormDuration(String(sets.reservation_duration_mins));
        setFormWhatsapp(sets.whatsapp_number || '');
        setAboutTitle(sets.about_title || 'NOSSA HISTÓRIA');
        setAboutText(sets.about_text || '');
        setContactPhone(sets.contact_phone || '');
        setContactPhone2(sets.contact_phone_2 || '');
        setContactEmail(sets.contact_email || '');
        setContactAddress(sets.contact_address || '');
        setFooterAboutText(sets.footer_about_text || '');
        setFooterRights(sets.footer_rights || '');

        setHeroTitle(sets.hero_title || 'TRADIÇÃO QUE ALIMENTA A ALMA.');
        setHeroImage(sets.hero_image || '/hero_bg.png');
        setHighlight1Title(sets.highlight1_title || 'MOQUECA NA PANELA DE BARRO');
        setHighlight1Image(sets.highlight1_image || '/moqueca.png');
        setHighlight1Desc(sets.highlight1_desc || '');
        setHighlight2Title(sets.highlight2_title || 'FEIJOADA COMPLETA');
        setHighlight2Image(sets.highlight2_image || '/feijoada.png');
        setHighlight2Desc(sets.highlight2_desc || '');
        setHighlight3Title(sets.highlight3_title || 'PICANHA NA CHAPA');
        setHighlight3Image(sets.highlight3_image || '/picanha.png');
        setHighlight3Desc(sets.highlight3_desc || '');
        setAboutImage(sets.about_image || '/historia_bg.png');
        setBookingTitle(sets.booking_title || 'VIVA A EXPERIÊNCIA');
        setBookingDesc(sets.booking_desc || '');
        setLocationDesc(sets.location_desc || '');
        setLocationMapIframe(sets.location_map_iframe || '');
        setColorPrimary(sets.color_primary || '#7E1C1C');
        setColorSecondary(sets.color_secondary || '#371D10');
        setColorTertiary(sets.color_tertiary || '#F4EFE6');
      }
      if (!prodCategoryId && cats.length > 0) setProdCategoryId(cats[0].id);
    } catch {
      showToast('Erro ao carregar dados.', 'error');
    } finally {
      setDataLoading(false);
    }
  }, [prodCategoryId, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logoutCustom();
    router.replace('/admin/login');
  };

  // ─── CATEGORIAS ───────────────────────────────────────────────────────────
  const resetCatForm = () => { setCatId(''); setCatName(''); setCatThumb(''); setCatFile(null); };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let currentThumb = catThumb;
      if (catFile) {
        currentThumb = await uploadFile(catFile, 'categories');
      }

      if (catId) {
        await apiFetch(`/api/categories/${catId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: catName, thumbnail: currentThumb }),
        });
        showToast('Categoria atualizada com sucesso!');
      } else {
        await apiFetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: catName, thumbnail: currentThumb }),
        });
        showToast('Categoria criada com sucesso!');
      }
      resetCatForm();
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar categoria.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = (cat: Category) => {
    setCatId(cat.id);
    setCatName(cat.name);
    setCatThumb(cat.thumbnail);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCategory = async (id: string) => {
    askConfirmation(
      'Excluir Categoria',
      'Tem certeza que deseja excluir esta categoria? Isso pode afetar os produtos vinculados.',
      async () => {
        try {
          await apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
          showToast('Categoria excluída.', 'info');
          loadData();
        } catch {
          showToast('Erro ao excluir categoria.', 'error');
        }
      }
    );
  };

  // ─── PRODUTOS ─────────────────────────────────────────────────────────────
  const resetProdForm = () => {
    setProdId(''); setProdName(''); setProdPrice(''); setProdImage('');
    setProdDesc(''); setProdIngredients(''); setProdFile(null);
    if (categories.length > 0) setProdCategoryId(categories[0].id);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let currentImage = prodImage;
      if (prodFile) {
        currentImage = await uploadFile(prodFile, 'products');
      }

      const payload = {
        category_id: prodCategoryId,
        name: prodName,
        price: parseFloat(prodPrice),
        image: currentImage,
        description: prodDesc,
        ingredients: prodIngredients,
        active: true,
      };

      if (prodId) {
        await apiFetch(`/api/products/${prodId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        showToast('Produto atualizado com sucesso!');
      } else {
        await apiFetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        showToast('Produto criado com sucesso!');
      }
      resetProdForm();
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar produto.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduct = (prod: Product) => {
    setProdId(prod.id);
    setProdCategoryId(prod.category_id);
    setProdName(prod.name);
    setProdPrice(String(prod.price));
    setProdImage(prod.image);
    setProdDesc(prod.description);
    setProdIngredients(prod.ingredients);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id: string) => {
    askConfirmation(
      'Remover Prato',
      'Deseja realmente remover este prato do cardápio?',
      async () => {
        try {
          await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
          showToast('Produto removido.', 'info');
          loadData();
        } catch {
          showToast('Erro ao remover produto.', 'error');
        }
      }
    );
  };

  // ─── RESERVAS & SETTINGS ────────────────────────────────────────────────
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_tables: setTotalTables,
          open_time: setOpenTime.includes(':') ? setOpenTime : setOpenTime + ':00',
          close_time: setCloseTime.includes(':') ? setCloseTime : setCloseTime + ':00',
          reservation_duration_mins: setDuration,
          whatsapp_number: setWhatsapp,
          about_title: aboutTitle,
          about_text: aboutText,
          contact_phone: contactPhone,
          contact_phone_2: contactPhone2,
          contact_email: contactEmail,
          contact_address: contactAddress,
          footer_about_text: footerAboutText,
          footer_rights: footerRights,
          hero_title: heroTitle,
          hero_image: heroImage,
          highlight1_title: highlight1Title,
          highlight1_image: highlight1Image,
          highlight1_desc: highlight1Desc,
          highlight2_title: highlight2Title,
          highlight2_image: highlight2Image,
          highlight2_desc: highlight2Desc,
          highlight3_title: highlight3Title,
          highlight3_image: highlight3Image,
          highlight3_desc: highlight3Desc,
          about_image: aboutImage,
          booking_title: bookingTitle,
          booking_desc: bookingDesc,
          location_desc: locationDesc,
          location_map_iframe: locationMapIframe,
          color_primary: colorPrimary,
          color_secondary: colorSecondary,
          color_tertiary: colorTertiary,
        }),
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Erro desconhecido ao salvar');
      }

      showToast('Configurações salvas com sucesso!');
      loadData();
    } catch (err: any) {
      showToast(`Erro: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateReservationStatus = async (id: string, status: Reservation['status']) => {
    const performUpdate = async () => {
      try {
        await apiFetch(`/api/reservations/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        showToast(`Reserva ${status === 'confirmed' ? 'confirmada' : 'cancelada'} com sucesso!`);
        loadData();
      } catch {
        showToast('Erro ao atualizar status da reserva.', 'error');
      }
    };

    if (status === 'cancelled') {
      askConfirmation(
        'Cancelar Reserva',
        'Tem certeza que deseja cancelar esta reserva? O cliente poderá ser notificado.',
        performUpdate,
        'warning'
      );
    } else {
      performUpdate();
    }
  };

  const handleDeleteReservation = async (id: string) => {
    askConfirmation(
      'Excluir Reserva',
      'Tem certeza que deseja excluir este registro de reserva permanentemente?',
      async () => {
        try {
          await apiFetch(`/api/reservations/${id}`, { method: 'DELETE' });
          showToast('Reserva excluída do sistema.', 'info');
          loadData();
        } catch {
          showToast('Erro ao excluir reserva.', 'error');
        }
      }
    );
  };

  // Funções do Simulador
  const calculateOccupancy = (dateTarget: string) => {
    if (!settings) return [];

    // As reservas confirmadas ou pendentes do dia escolhido
    const daysRes = reservations.filter(r => r.date === dateTarget && r.status !== 'cancelled');

    // Converter '10:00' para valor numérico inteiro (ex: minutos do dia)
    const timeToMins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const formatTime = (mins: number) => { const h = Math.floor(mins / 60); const m = mins % 60; return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`; };

    const openMins = timeToMins(settings.open_time);
    const closeMins = timeToMins(settings.close_time);
    const totalTables = settings.total_tables;
    const durMins = settings.reservation_duration_mins;

    const slots = [];
    for (let m = openMins; m < closeMins; m += 30) {
      // Para cada slot, quantas mesas estão ativamente sob reserva neste exato minuto m?
      // Uma reserva "ocupa" a mesa do [res.time_mins] até [res.time_mins + durMins]
      let occupied = 0;
      daysRes.forEach(r => {
        const rStart = timeToMins(r.time);
        const rEnd = rStart + durMins;
        if (m >= rStart && m < rEnd) {
          occupied++;
        }
      });
      slots.push({ time: formatTime(m), occupied, total: totalTables, free: totalTables - occupied });
    }
    return slots;
  };

  const simSlots = calculateOccupancy(simDate);

  return (
    <div className="admin-wrapper">
      {/* HEADER */}
      <header className="admin-header">
        <div className="admin-container">
          <div className="admin-header-left">
            <Link href="/" className="back-link">← Voltar ao Site</Link>
            <h1 className="admin-title">Portal Administrativo</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: 'rgba(244,239,230,0.6)', fontSize: '0.8rem' }}>
              {userEmail}
            </span>
            <button
              className="btn-reset"
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {/* Stats bar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
          {[
            { label: 'Categorias', value: categories.length, icon: '🗂️' },
            { label: 'Pratos', value: products.length, icon: '🍽️' },
            { label: 'Reservas Hoje', value: reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length, icon: '📅' },
            { label: 'Reservas Pendentes', value: reservations.filter(r => r.status === 'pending').length, icon: '🔔' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'white',
              padding: '20px 24px',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ fontSize: '1.8rem' }}>{stat.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-headings)', fontSize: '1.6rem', fontWeight: 700, color: '#7E1C1C', lineHeight: 1 }}>
                  {dataLoading ? '—' : stat.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#888', marginTop: 4, fontFamily: 'var(--font-body)' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="admin-tabs">
          <button className={`tab-btn${activeTab === 'categories' ? ' active' : ''}`} onClick={() => setActiveTab('categories')}>
            Categorias
          </button>
          <button className={`tab-btn${activeTab === 'products' ? ' active' : ''}`} onClick={() => setActiveTab('products')}>
            Produtos
          </button>
          <button className={`tab-btn${activeTab === 'reservations' ? ' active' : ''}`} onClick={() => setActiveTab('reservations')}>
            Reservas {reservations.filter(r => r.status === 'pending').length > 0 && `(${reservations.filter(r => r.status === 'pending').length})`}
          </button>
          <button className={`tab-btn${activeTab === 'settings' ? ' active' : ''}`} onClick={() => setActiveTab('settings')}>
            Configurações
          </button>
        </div>

        {/* Loading overlay */}
        {dataLoading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', fontFamily: 'var(--font-body)' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #ddd', borderTopColor: '#7E1C1C', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
            Carregando dados do banco...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!dataLoading && (
          <>
            {/* ===== ABA CATEGORIAS ===== */}
            <section className={`admin-section${activeTab === 'categories' ? ' active' : ''}`}>
              <div className="admin-card">
                <h2>{catId ? 'Editar Categoria' : 'Adicionar Categoria'}</h2>
                <form className="admin-form" onSubmit={handleSaveCategory}>
                  <div className="form-group">
                    <label>Nome da Categoria</label>
                    <input type="text" value={catName} onChange={e => setCatName(e.target.value)} required placeholder="Ex: Grelhados" />
                  </div>
                   <div className="form-group">
                    <label>Imagem da Categoria (Upload)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => setCatFile(e.target.files?.[0] || null)} 
                      required={!catId} 
                      style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 4, width: '100%' }}
                    />
                    {catThumb && !catFile && <p style={{ fontSize: '0.75rem', color: '#666', marginTop: 4 }}>Imagem atual: {catThumb}</p>}
                    {catFile && <p style={{ fontSize: '0.75rem', color: '#2D5A27', marginTop: 4 }}>Nova imagem: {catFile.name}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" className="btn-save" disabled={saving} style={{ flex: 1 }}>
                      {saving ? 'Salvando...' : catId ? 'Atualizar Categoria' : 'Salvar Categoria'}
                    </button>
                    {catId && (
                      <button type="button" onClick={resetCatForm} style={{ padding: '15px 20px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', borderRadius: 4, fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="admin-card">
                <h2>Lista de Categorias ({categories.length})</h2>
                {categories.length === 0 ? (
                  <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '30px 0' }}>
                    Nenhuma categoria encontrada. Execute a seed no Supabase.
                  </p>
                ) : (
                  <table className="admin-table">
                    <thead><tr><th>Preview</th><th>Nome</th><th>Pratos</th><th>Ações</th></tr></thead>
                    <tbody>
                      {categories.map(cat => (
                        <tr key={cat.id}>
                          <td>
                            <Image src={validateImageSrc(cat.thumbnail, '/menu_steaks.png')} alt={cat.name} width={60} height={40} className="admin-preview"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/menu_steaks.png'; }}
                            />
                          </td>
                          <td style={{ fontWeight: 600 }}>{cat.name}</td>
                          <td style={{ color: '#7E1C1C', fontWeight: 700 }}>
                            {products.filter(p => p.category_id === cat.id).length}
                          </td>
                          <td>
                            <button className="btn-edit" onClick={() => handleEditCategory(cat)}>Editar</button>
                            <button className="btn-delete" onClick={() => handleDeleteCategory(cat.id)}>Excluir</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* ===== ABA PRODUTOS ===== */}
            <section className={`admin-section${activeTab === 'products' ? ' active' : ''}`}>
              <div className="admin-card">
                <h2>{prodId ? 'Editar Produto' : 'Adicionar Produto'}</h2>
                <form className="admin-form" onSubmit={handleSaveProduct}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nome do Prato</label>
                      <input type="text" value={prodName} onChange={e => setProdName(e.target.value)} required placeholder="Ex: Picanha Premium" />
                    </div>
                    <div className="form-group">
                      <label>Categoria</label>
                      <select value={prodCategoryId} onChange={e => setProdCategoryId(e.target.value)} required>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Preço (€)</label>
                      <input type="number" step="0.01" min="0" value={prodPrice} onChange={e => setProdPrice(e.target.value)} required placeholder="Ex: 15.50" />
                    </div>
                     <div className="form-group">
                      <label>Imagem do Prato (Upload)</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => setProdFile(e.target.files?.[0] || null)} 
                        required={!prodId} 
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 4, width: '100%' }}
                      />
                      {prodImage && !prodFile && <p style={{ fontSize: '0.75rem', color: '#666', marginTop: 4 }}>Imagem atual: {prodImage}</p>}
                      {prodFile && <p style={{ fontSize: '0.75rem', color: '#2D5A27', marginTop: 4 }}>Nova imagem: {prodFile.name}</p>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Descrição Curta</label>
                    <input type="text" value={prodDesc} onChange={e => setProdDesc(e.target.value)} required placeholder="Ex: Corte nobre grelhado na brasa com sal grosso." />
                  </div>
                  <div className="form-group">
                    <label>Ingredientes (exibidos no modal)</label>
                    <textarea value={prodIngredients} onChange={e => setProdIngredients(e.target.value)} rows={3} required placeholder="Ex: Picanha (300g), arroz biro-biro, farofa de ovos e vinagrete." />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" className="btn-save" disabled={saving} style={{ flex: 1 }}>
                      {saving ? 'Salvando...' : prodId ? 'Atualizar Produto' : 'Salvar Produto'}
                    </button>
                    {prodId && (
                      <button type="button" onClick={resetProdForm} style={{ padding: '15px 20px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', borderRadius: 4, fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="admin-card">
                <h2>Lista de Produtos ({products.length})</h2>
                {products.length === 0 ? (
                  <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '30px 0' }}>
                    Nenhum produto encontrado. Execute a seed no Supabase.
                  </p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr><th>Preview</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Status</th><th>Ações</th></tr>
                    </thead>
                    <tbody>
                      {products.map(prod => {
                        const catName = categories.find(c => c.id === prod.category_id)?.name ?? 'N/A';
                        return (
                          <tr key={prod.id}>
                            <td>
                              <Image src={validateImageSrc(prod.image, '/picanha.png')} alt={prod.name} width={60} height={40} className="admin-preview"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/picanha.png'; }}
                              />
                            </td>
                            <td style={{ fontWeight: 600 }}>{prod.name}</td>
                            <td style={{ color: '#555', fontSize: '0.85rem' }}>{catName}</td>
                            <td style={{ fontWeight: 700, color: '#7E1C1C' }}>€ {Number(prod.price).toFixed(2).replace('.', ',')}</td>
                            <td>
                              <span style={{
                                display: 'inline-block', padding: '3px 10px', borderRadius: 12,
                                fontSize: '0.72rem', fontWeight: 700,
                                background: prod.active ? '#e8f5e9' : '#fce4e4',
                                color: prod.active ? '#2D5A27' : '#7E1C1C',
                              }}>
                                {prod.active ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td>
                              <button className="btn-edit" onClick={() => handleEditProduct(prod)}>Editar</button>
                              <button className="btn-delete" onClick={() => handleDeleteProduct(prod.id)}>Excluir</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* ===== ABA RESERVAS ===== */}
            <section className={`admin-section${activeTab === 'reservations' ? ' active' : ''}`}>
              <div className="admin-card">
                <h2>Gerenciamento de Reservas ({reservations.length})</h2>
                {reservations.length === 0 ? (
                  <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '30px 0' }}>
                    Nenhuma reserva encontrada até o momento.
                  </p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Data/Hora</th>
                        <th>Cliente</th>
                        <th>Convidados</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations
                        .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime())
                        .map(res => (
                          <tr key={res.id}>
                            <td>
                              <div style={{ fontWeight: 700 }}>
                                {new Date(res.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#666' }}>{res.time}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{res.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#888' }}>{res.phone}</div>
                            </td>
                            <td>
                              <div style={{ textAlign: 'center', width: '30px', fontWeight: 700, color: '#7E1C1C' }}>
                                {res.guests}
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge status-${res.status}`}>
                                {res.status === 'pending' ? 'Pendente' : res.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                {res.status === 'pending' && (
                                  <button
                                    className="btn-edit"
                                    style={{ background: '#2D5A27' }}
                                    onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')}
                                  >
                                    Confirmar
                                  </button>
                                )}
                                {res.status !== 'cancelled' && (
                                  <button
                                    className="btn-delete"
                                    onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                                  >
                                    Cancelar
                                  </button>
                                )}
                                <button
                                  className="btn-reset"
                                  style={{ color: '#888', border: '1px solid #ccc', padding: '4px 8px' }}
                                  onClick={() => handleDeleteReservation(res.id)}
                                  title="Excluir Registro"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* ===== ABA CONFIGURAÇÕES ===== */}
            <section className={`admin-section${activeTab === 'settings' ? ' active' : ''}`}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 24, marginBottom: 24 }}>
                <div className="admin-card">
                  <h2>⚙️ Configurações Gerais</h2>
                  <form className="admin-form" onSubmit={handleSaveSettings}>
                    <div className="form-group">
                      <label>Total de Mesas Físicas</label>
                      <input type="number" min="1" value={setTotalTables} onChange={e => setFormTotalTables(e.target.value)} required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Abre às</label>
                        <input type="time" value={setOpenTime} onChange={e => setFormOpenTime(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Fecha às</label>
                        <input type="time" value={setCloseTime} onChange={e => setFormCloseTime(e.target.value)} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Duração da Reserva (Minutos)</label>
                      <input type="number" step="15" min="15" value={setDuration} onChange={e => setFormDuration(e.target.value)} required placeholder="Ex: 90" />
                      <span style={{ fontSize: '0.75rem', color: '#666', marginTop: 4, display: 'block' }}>Ex: 90 minutos (1h30). Cada reserva bloqueia 1 mesa durante este tempo exato.</span>
                    </div>
                    <div className="form-group">
                      <label>WhatsApp para Notificação (URL)</label>
                      <input type="text" value={setWhatsapp} onChange={e => setFormWhatsapp(e.target.value)} placeholder="Ex: 5511999999999" />
                      <span style={{ fontSize: '0.75rem', color: '#666', marginTop: 4, display: 'block' }}>Apenas números. O cliente será redirecionado para enviar mensagem a este WhatsApp no site.</span>
                    </div>
                    <button type="submit" className="btn-save" disabled={saving}>
                      {saving ? 'Aplicando...' : 'Salvar Regras'}
                    </button>
                  </form>
                </div>

                <div className="admin-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>📊 Simulador de Ocupação</h2>
                    <input type="date" value={simDate} onChange={e => setSimDate(e.target.value)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ccc' }} />
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 16 }}>Visão em Tempo Real do consumo e devolução de mesas pelo sistema com base na duração.</p>

                  {settings ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 10 }}>
                      {simSlots.map((slot, i) => {
                        const ratio = slot.free / slot.total;
                        let color = '#2D5A27'; // Livre (verde)
                        if (ratio < 0.3) color = '#7E1C1C'; // Quase cheio (vermelho)
                        else if (ratio < 0.7) color = '#bd8c31'; // Metade (amarelo)
                        if (slot.free === 0) color = '#000'; // Esgotado

                        return (
                          <div key={i} style={{ padding: '10px 8px', borderRadius: 8, background: '#fcfcfc', border: `1px solid ${color}`, textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333' }}>{slot.time}</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: color, margin: '4px 0' }}>{slot.free}</div>
                            <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' }}>Vagas</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ color: '#888' }}>Configuração não carregada.</p>
                  )}
                </div>
              </div>

              <div className="admin-card">
                <h2>🖼️ Personalização da Página Inicial</h2>
                <form className="admin-form" onSubmit={handleSaveSettings}>
                  <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 20, color: '#7E1C1C' }}>Seção Hero (Topo)</h3>
                  <div className="form-group">
                    <label>Título Principal (Hero)</label>
                    <textarea value={heroTitle} onChange={e => setHeroTitle(e.target.value)} rows={2} />
                  </div>
                  <SettingsImageField 
                    id="hero"
                    label="Imagem de Fundo Hero" 
                    value={heroImage} 
                    onChange={setHeroImage} 
                    dimensions="1920x1080px" 
                    onFileChange={handleSettingsFileChange}
                    uploading={settingsUploading['hero']}
                  />

                  <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 20, marginTop: 40, color: '#7E1C1C' }}>Cores do Sistema</h3>
                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    <div className="form-group">
                      <label>Cor Primária (Destaque/Botões)</label>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <input type="color" value={colorPrimary} onChange={e => setColorPrimary(e.target.value)} style={{ width: 40, height: 40, padding: 0, border: 'none' }} />
                        <input type="text" value={colorPrimary} onChange={e => setColorPrimary(e.target.value)} style={{ flex: 1 }} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Cor Secundária (Textos/Escuro)</label>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <input type="color" value={colorSecondary} onChange={e => setColorSecondary(e.target.value)} style={{ width: 40, height: 40, padding: 0, border: 'none' }} />
                        <input type="text" value={colorSecondary} onChange={e => setColorSecondary(e.target.value)} style={{ flex: 1 }} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Cor Terciária (Fundo/Claro)</label>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <input type="color" value={colorTertiary} onChange={e => setColorTertiary(e.target.value)} style={{ width: 40, height: 40, padding: 0, border: 'none' }} />
                        <input type="text" value={colorTertiary} onChange={e => setColorTertiary(e.target.value)} style={{ flex: 1 }} />
                      </div>
                    </div>
                  </div>

                  <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 20, marginTop: 40, color: '#7E1C1C' }}>Destaques (3 Cards)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                    <div style={{ padding: 15, background: '#f9f9f9', borderRadius: 8 }}>
                      <h4 style={{ marginBottom: 10 }}>Destaque 1</h4>
                      <div className="form-group">
                        <label>Título</label>
                        <input type="text" value={highlight1Title} onChange={e => setHighlight1Title(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Descrição</label>
                        <textarea value={highlight1Desc} onChange={e => setHighlight1Desc(e.target.value)} rows={3} />
                      </div>
                      <SettingsImageField id="h1" label="Imagem" value={highlight1Image} onChange={setHighlight1Image} dimensions="800x500px" onFileChange={handleSettingsFileChange} uploading={settingsUploading['h1']} />
                    </div>
                    <div style={{ padding: 15, background: '#f9f9f9', borderRadius: 8 }}>
                      <h4 style={{ marginBottom: 10 }}>Destaque 2</h4>
                      <div className="form-group">
                        <label>Título</label>
                        <input type="text" value={highlight2Title} onChange={e => setHighlight2Title(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Descrição</label>
                        <textarea value={highlight2Desc} onChange={e => setHighlight2Desc(e.target.value)} rows={3} />
                      </div>
                      <SettingsImageField id="h2" label="Imagem" value={highlight2Image} onChange={setHighlight2Image} dimensions="800x500px" onFileChange={handleSettingsFileChange} uploading={settingsUploading['h2']} />
                    </div>
                    <div style={{ padding: 15, background: '#f9f9f9', borderRadius: 8 }}>
                      <h4 style={{ marginBottom: 10 }}>Destaque 3</h4>
                      <div className="form-group">
                        <label>Título</label>
                        <input type="text" value={highlight3Title} onChange={e => setHighlight3Title(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Descrição</label>
                        <textarea value={highlight3Desc} onChange={e => setHighlight3Desc(e.target.value)} rows={3} />
                      </div>
                      <SettingsImageField id="h3" label="Imagem" value={highlight3Image} onChange={setHighlight3Image} dimensions="800x500px" onFileChange={handleSettingsFileChange} uploading={settingsUploading['h3']} />
                    </div>
                  </div>

                  <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 20, marginTop: 40, color: '#7E1C1C' }}>Seção Sobre Nós (História)</h3>
                  <div className="form-group">
                    <label>Título "Sobre Nós"</label>
                    <input type="text" value={aboutTitle} onChange={e => setAboutTitle(e.target.value)} placeholder="Ex: NOSSA HISTÓRIA" />
                  </div>
                  <div className="form-group">
                    <label>Texto "Sobre Nós" (Main Page)</label>
                    <textarea value={aboutText} onChange={e => setAboutText(e.target.value)} rows={6} placeholder="Conte a história do restaurante..." />
                  </div>
                  <SettingsImageField 
                    id="about"
                    label="Imagem da Seção Sobre Nós" 
                    value={aboutImage} 
                    onChange={setAboutImage} 
                    dimensions="1000x800px" 
                    onFileChange={handleSettingsFileChange}
                    uploading={settingsUploading['about']}
                  />

                  <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 20, marginTop: 40, color: '#7E1C1C' }}>Reservas</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Título Seção Reserva</label>
                      <input type="text" value={bookingTitle} onChange={e => setBookingTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Descrição Reserva</label>
                      <textarea value={bookingDesc} onChange={e => setBookingDesc(e.target.value)} rows={2} />
                    </div>
                  </div>

                  <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 20, marginTop: 40, color: '#7E1C1C' }}>Localização</h3>
                  <div className="form-group">
                    <label>Texto Localização</label>
                    <textarea value={locationDesc} onChange={e => setLocationDesc(e.target.value)} rows={2} />
                  </div>
                  <div className="form-group">
                    <label>URL Iframe Google Maps (Embed)</label>
                    <input type="text" value={locationMapIframe} onChange={e => setLocationMapIframe(e.target.value)} placeholder="https://maps.google.com/..." />
                  </div>

                  <button type="submit" className="btn-save" disabled={saving}>
                    {saving ? 'Aplicando...' : 'Salvar Personalização da Home'}
                  </button>
                </form>
              </div>

              <div className="admin-card">
                <h2>📝 Informações de Contato e Rodapé</h2>
                <form className="admin-form" onSubmit={handleSaveSettings}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Telefone 1</label>
                      <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="(21) 1234-5678" />
                    </div>
                    <div className="form-group">
                      <label>Telefone 2</label>
                      <input type="text" value={contactPhone2} onChange={e => setContactPhone2(e.target.value)} placeholder="(21) 98765-4321" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>E-mail de Contato</label>
                      <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="info@exemplo.com" />
                    </div>
                    <div className="form-group">
                      <label>Morada / Endereço</label>
                      <input type="text" value={contactAddress} onChange={e => setContactAddress(e.target.value)} placeholder="Braga, Portugal" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Texto Curto "Sobre Nós" (Rodapé)</label>
                    <textarea value={footerAboutText} onChange={e => setFooterAboutText(e.target.value)} rows={3} placeholder="Breve descrição para o rodapé..." />
                  </div>
                  <div className="form-group">
                    <label>Texto de Direitos Reservados (Rodapé)</label>
                    <input type="text" value={footerRights} onChange={e => setFooterRights(e.target.value)} placeholder="CASA DE TRADIÇÃO. TODOS OS DIREITOS RESERVADOS." />
                  </div>
                  <button type="submit" className="btn-save" disabled={saving}>
                    {saving ? 'Aplicando...' : 'Salvar Conteúdo'}
                  </button>
                </form>
              </div>
            </section>
          </>
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        type={confirmState.type}
      />
    </div>
  );
}
