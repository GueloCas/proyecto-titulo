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

export const getClassAndContentTooltip = (dia, hora, percepcion) => {
    const { pertenencia_baja, pertenencia_media, pertenencia_alta } = percepcion;

    if (pertenencia_baja >= pertenencia_media && pertenencia_baja >= pertenencia_alta) {
        return {
            className: "baja-mayor fs-07",
            content: `
                <div>Día: ${dia} - Hora: ${hora}</div>
                <div><strong>BAJA: ${pertenencia_baja.toFixed(2)}</strong></div>
                <div>Media: ${pertenencia_media.toFixed(2)}</div>
                <div>Alta: ${pertenencia_alta.toFixed(2)}</div>
            `
        };
    } else if (pertenencia_media >= pertenencia_baja && pertenencia_media >= pertenencia_alta) {
        return {
            className: "media-mayor fs-07",
            content: `
                <div>Día: ${dia} - Hora: ${hora}</div>
                <div>Baja: ${pertenencia_baja.toFixed(2)}</div>
                <div><strong>MEDIA: ${pertenencia_media.toFixed(2)}</strong> </div>
                <div>Alta: ${pertenencia_alta.toFixed(2)}</div>
            `
        };
    } else {
        return {
            className: "alta-mayor fs-07",
            content: `
                <div>Día: ${dia} - Hora: ${hora}</div>
                <div>Baja: ${pertenencia_baja.toFixed(2)}</div>
                <div>Media: ${pertenencia_media.toFixed(2)}</div>
                <div><strong>ALTA: ${pertenencia_alta.toFixed(2)}</strong></div>
            `
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
                    Mala: {pertenencia_mala.toFixed(2)}<br />
                    Normal: {pertenencia_normal.toFixed(2)}<br />
                    Excelente: {pertenencia_excelente.toFixed(2)}<br />
                    <strong>Regular: {pertenencia_regular.toFixed(2)}</strong>
                </div>
            ),
        };
    } else if (pertenencia_mala >= pertenencia_normal && pertenencia_mala >= pertenencia_excelente) {
        return {
            className: "baja-mayor fs-07",
            content: (
                <div>
                    <strong>Mala: {pertenencia_mala.toFixed(2)}</strong><br />
                    Normal: {pertenencia_normal.toFixed(2)}<br />
                    Excelente: {pertenencia_excelente.toFixed(2)}<br />
                    Regular: {pertenencia_regular.toFixed(2)}
                </div>
            ),
        };
    } else if (pertenencia_normal >= pertenencia_excelente && pertenencia_normal >= pertenencia_mala) {
        return {
            className: "media-mayor fs-07",
            content: (
                <div>
                    Mala: {pertenencia_mala.toFixed(2)}<br />
                    <strong>Normal: {pertenencia_normal.toFixed(2)}</strong><br />
                    Excelente: {pertenencia_excelente.toFixed(2)}<br />
                    Regular: {pertenencia_regular.toFixed(2)}
                </div>
            ),
        };
    } else {
        return {
            className: "alta-mayor fs-07",
            content: (
                <div>
                    Mala: {pertenencia_mala.toFixed(2)}<br />
                    Normal: {pertenencia_normal.toFixed(2)}<br />
                    <strong>Excelente: {pertenencia_excelente.toFixed(2)}</strong><br />
                    Regular: {pertenencia_regular.toFixed(2)}
                </div>
            ),
        };
    }
};