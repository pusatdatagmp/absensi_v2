import React from 'react';

const GarudaLogo: React.FC = () => {
    return (
        <div className="garuda-container">
            {/* Bagian Logo Utama */}
            <div className="garuda-logo">
                <div className="lingkaran-luar">
                    {/* Kepala Garuda */}
                    <div className="kepala-garuda">
                        <div className="paruh"></div>
                        <div className="mata"></div>
                        <div className="jambul"></div>
                    </div>
                    {/* Sayap Kiri (Bulatan Berlapis) */}
                    <div className="sayap-kontainer">
                        <div className="bulu bulu-1"></div>
                        <div className="bulu bulu-2"></div>
                        <div className="bulu bulu-3"></div>
                    </div>
                </div>
            </div>

            {/* Bagian Teks */}
            <div className="garuda-text">
                <h1 className="text-utama">GARUDA</h1>
                <p className="text-sub">Merah Putih</p>
            </div>
        </div>
    );
};

export default GarudaLogo;