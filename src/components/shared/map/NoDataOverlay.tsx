const NoDataOverlay = () => (
    <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(255,255,255,0.9)',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
        fontSize: '12px'
    }}>
        ❌ Nessun dispositivo con coordinate valide trovato.
    </div>
);

export default NoDataOverlay;