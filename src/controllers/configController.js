
export const getUbicacionTaller = (req, res) => {
    
    const ubicacion = {
        nombre: "MotoTech Mocoa",
        direccion: "Barrio Centro, Mocoa, Putumayo",
        lat: 1.1478, 
        lng: -76.6476, 
        googleMapsUrl: "https://www.google.com/maps?q=1.1478,-76.6476"
    };
    
    res.json(ubicacion);
};