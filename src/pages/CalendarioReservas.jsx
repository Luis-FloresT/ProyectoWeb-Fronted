import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Container, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import PageContainer from '../components/layout/PageContainer';

const CalendarioReservas = () => {
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDisponibilidad();
    }, []);

    const fetchDisponibilidad = async () => {
        try {
            const apiRes = await api.get('/fiesta/disponibilidad-calendario/');
            setDisponibilidad(apiRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Error cargando disponibilidad:', err);
            setError('No se pudo cargar el calendario. Por favor intente más tarde.');
            setLoading(false);
        }
    };

    const handleDateClick = (info) => {
        const diaInfo = disponibilidad.find(d => d.start === info.dateStr);
        
        // Fecha de hoy al inicio del día
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        
        // La fecha de clic ya viene como string YYYY-MM-DD de FullCalendar
        const clickDate = new Date(info.dateStr + 'T00:00:00');

        if (clickDate >= hoy) {
            // Permitir si no hay info (verde por defecto) o si el status es habilitado
            if (!diaInfo || diaInfo.status === 'verde' || diaInfo.status === 'amarillo') {
                navigate(`/solicitar-servicio?fecha=${info.dateStr}`);
            }
        }
    };

    const handleDayCellDidMount = (arg) => {
        // Formatear fecha localmente (YYYY-MM-DD) para evitar desfases de zona horaria
        const y = arg.date.getFullYear();
        const m = String(arg.date.getMonth() + 1).padStart(2, '0');
        const d = String(arg.date.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;

        const diaInfo = disponibilidad.find(item => item.start === dateStr);
        
        // Calcular "Hoy" al inicio del día para comparaciones precisas
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // 1. DÍAS PASADOS: Siempre Grises y bloqueados
        if (arg.date < hoy) {
            arg.el.style.backgroundColor = '#f3f4f6'; // Gris más notable
            arg.el.style.opacity = '0.5';
            arg.el.style.pointerEvents = 'none';
            return;
        }

        // 2. DÍAS FUTUROS: Aplicar lógica de backend o Default Verde
        if (diaInfo) {
            switch (diaInfo.status) {
                case 'verde':
                    arg.el.style.backgroundColor = '#f0fdf4'; // Verde suave
                    break;
                case 'amarillo':
                    arg.el.style.backgroundColor = '#fffbeb'; // Amarillo suave
                    break;
                case 'rojo':
                case 'gris':
                    arg.el.style.backgroundColor = '#fef2f2'; // Rojo suave
                    arg.el.style.opacity = '0.5';
                    arg.el.style.pointerEvents = 'none';
                    break;
                default:
                    arg.el.style.backgroundColor = '#f0fdf4'; // Fallback a Verde
            }
        } else {
            // REGLA: Si no hay info en el backend, es Verde por defecto
            arg.el.style.backgroundColor = '#f0fdf4'; 
        }
    };

    if (loading) return (
        <PageContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress color="primary" size={60} />
            </Box>
        </PageContainer>
    );

    return (
        <PageContainer>
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Typography variant="h3" sx={{ 
                    fontWeight: 900, 
                    mb: 4, 
                    color: '#FF6B9D', 
                    textAlign: 'center',
                    fontFamily: "'Outfit', sans-serif"
                }}>
                    📅 Agenda tu Fiesta
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '15px' }}>{error}</Alert>}

                <Paper elevation={0} sx={{ 
                    p: { xs: 1, sm: 4 }, 
                    borderRadius: '24px', 
                    boxShadow: '0 10px 50px rgba(0,0,0,0.04)',
                    border: '1px solid #f1f1f1',
                    overflow: 'hidden',
                    bgcolor: '#fff'
                }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale={esLocale}
                        dateClick={handleDateClick}
                        dayCellDidMount={handleDayCellDidMount}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: ''
                        }}
                        height="auto"
                        contentHeight={650}
                        fixedWeekCount={false}
                    />
                    
                    {/* Leyenda Minimalista */}
                    <Box sx={{ 
                        mt: 4, 
                        pt: 4,
                        borderTop: '1px solid #f8f8f8',
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        justifyContent: 'center', 
                        gap: 3 
                    }}>
                        <LegendItem color="#f0fdf4" label="Disponible" />
                        <LegendItem color="#fffbeb" label="Últimos cupos" />
                        <LegendItem color="#fef2f2" label="Agotado" />
                        <LegendItem color="#f3f4f6" label="Pasado / Bloqueado" />
                    </Box>
                </Paper>

                <style>{`
                    .fc { font-family: 'Outfit', sans-serif !important; border: none !important; }
                    .fc-theme-standard td, .fc-theme-standard th { border: 1px solid #f8f8f8 !important; }
                    .fc-toolbar-title { font-weight: 800 !important; color: #333 !important; font-size: 1.4rem !important; }
                    .fc-button-primary { 
                        background: #fff !important; 
                        border: 1px solid #eee !important; 
                        color: #555 !important;
                        border-radius: 10px !important; 
                        font-weight: 700 !important;
                        transition: all 0.2s ease !important;
                    }
                    .fc-button-primary:hover { background: #fdfdfd !important; color: #FF6B9D !important; border-color: #FF6B9D !important; }
                    .fc-button-active { background: #FF6B9D !important; color: #fff !important; border-color: #FF6B9D !important; }
                    
                    .fc-daygrid-day-number { 
                        font-weight: 700; 
                        color: #666; 
                        padding: 12px !important; 
                        font-size: 0.95rem;
                        z-index: 2;
                    }
                    
                    .fc-day:not(.fc-day-disabled):hover { 
                        cursor: pointer;
                        filter: brightness(0.98);
                    }

                    .fc-day-today { background: transparent !important; }
                    .fc-day-today .fc-daygrid-day-number { 
                        color: #FF6B9D !important; 
                        background: rgba(255, 107, 157, 0.1);
                        border-radius: 50%;
                        width: 35px;
                        height: 35px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 5px;
                    }

                    @media (max-width: 600px) {
                        .fc-toolbar-title { font-size: 1.1rem !important; }
                        .fc-button { padding: 5px 10px !important; font-size: 0.8rem !important; }
                    }
                `}</style>
            </Container>
        </PageContainer>
    );
};

const LegendItem = ({ color, label }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ 
            width: 12, 
            height: 12, 
            borderRadius: '50%', 
            bgcolor: color, 
            border: `1px solid ${color === '#fef2f2' ? '#fee2e2' : (color === '#fffbeb' ? '#fef3c7' : '#dcfce7')}`
        }} />
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#888' }}>
            {label}
        </Typography>
    </Box>
);

export default CalendarioReservas;
