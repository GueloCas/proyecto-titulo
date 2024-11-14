import React from 'react';

export const getClassAndContent = (percepcion) => {
    const { pertenencia_baja, pertenencia_media, pertenencia_alta } = percepcion;
    
    if (pertenencia_baja >= pertenencia_media && pertenencia_baja >= pertenencia_alta) {
        return {
            className: "baja-mayor fs-07",
            content: (
                <div>
                    <strong>Baja: {pertenencia_baja.toFixed(2)}</strong><br />
                    Media: {pertenencia_media.toFixed(2)}<br />
                    Alta: {pertenencia_alta.toFixed(2)}
                </div>
            ),
        };
    } else if (pertenencia_media >= pertenencia_baja && pertenencia_media >= pertenencia_alta) {
        return {
            className: "media-mayor fs-07",
            content: (
                <div>
                    Baja: {pertenencia_baja.toFixed(2)}<br />
                    <strong>Media: {pertenencia_media.toFixed(2)}</strong><br />
                    Alta: {pertenencia_alta.toFixed(2)}
                </div>
            ),
        };
    } else {
        return {
            className: "alta-mayor fs-07",
            content: (
                <div>
                    Baja: {pertenencia_baja.toFixed(2)}<br />
                    Media: {pertenencia_media.toFixed(2)}<br />
                    <strong>Alta: {pertenencia_alta.toFixed(2)}</strong>
                </div>
            ),
        };
    }
};

export const determinarClaseCPEstacion = (percepcion) => {
    const { pertenencia_mala, pertenencia_normal, pertenencia_excelente, pertenencia_regular } = percepcion;

    if (pertenencia_regular === 1 && pertenencia_normal !== 1) {
        return {
            className: "alta-mayor fs-07",
            content: (
                <div>
                    M: {pertenencia_mala.toFixed(2)}<br />
                    N: {pertenencia_normal.toFixed(2)}<br />
                    E: {pertenencia_excelente.toFixed(2)}<br />
                    <strong>R: {pertenencia_regular.toFixed(2)}</strong>
                </div>
            ),
        };
    } else if (pertenencia_mala >= pertenencia_normal && pertenencia_mala >= pertenencia_excelente) {
        return {
            className: "baja-mayor fs-07",
            content: (
                <div>
                    <strong>M: {pertenencia_mala}</strong><br />
                    N: {pertenencia_normal}<br />
                    E: {pertenencia_excelente}<br />
                    R: {pertenencia_regular}
                </div>
            ),
        };
    } else if (pertenencia_normal >= pertenencia_excelente && pertenencia_normal >= pertenencia_mala) {
        return {
            className: "media-mayor fs-07",
            content: (
                <div>
                    M: {pertenencia_mala}<br />
                    <strong>N: {pertenencia_normal}</strong><br />
                    E: {pertenencia_excelente}<br />
                    R: {pertenencia_regular}
                </div>
            ),
        };
    } else {
        return {
            className: "alta-mayor fs-07",
            content: (
                <div>
                    M: {pertenencia_mala}<br />
                    N: {pertenencia_normal}<br />
                    <strong>E: {pertenencia_excelente}</strong><br />
                    R: {pertenencia_regular}
                </div>
            ),
        };
    }
};