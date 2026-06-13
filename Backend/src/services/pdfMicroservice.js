import axios from 'axios';

const PDF_MICROSERVICE_URL = process.env.PDF_MICROSERVICE_URL || 'http://localhost:8001';

class PDFMicroservice {
  /**
   * Genera un PDF de factura mediante el microservicio
   * @param {Object} facturaData 
   *    * @returns {Promise<Buffer>} 
   */
  async generarFacturaPDF(facturaData) {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        console.log(`Intento ${attempt + 1}/${maxRetries} de conectar al microservicio PDF...`);
        
        const response = await axios.post(
          `${PDF_MICROSERVICE_URL}/generar-pdf`,
          facturaData,
          {
            responseType: 'arraybuffer',
            timeout: 30000, 
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('PDF generado exitosamente por el microservicio');
        return Buffer.from(response.data);

      } catch (error) {
        attempt++;
        
        if (attempt >= maxRetries) {
          console.error('Error al conectar con el microservicio PDF después de todos los intentos:', error.message);
          throw new Error(`No se pudo conectar con el microservicio PDF: ${error.message}`);
        }

        console.warn(`Intento ${attempt} falló, reintentando en 2 segundos...`);
        await this.sleep(2000);
      }
    }
  }

  /**
   * Verifica el estado del microservicio
   * @returns {Promise<boolean>} True si el microservicio está disponible
   */
  async healthCheck() {
    try {
      const response = await axios.get(
        `${PDF_MICROSERVICE_URL}/health`,
        { timeout: 5000 }
      );
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('Microservicio PDF no disponible:', error.message);
      return false;
    }
  }

  /**
   * Utilidad para pausar ejecución
   * @param {number} ms - Milisegundos a esperar
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new PDFMicroservice();
