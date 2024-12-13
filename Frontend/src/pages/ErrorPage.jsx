import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  /**
   * Este mensaje de error, está pensado para los desarrolladores.
   * En un entorno de producción, no se debería mostrar este mensaje o almenos
   * no de esta forma.
   */
  console.error({
    status: error.status,
    statusText: error.statusText,
    message: error.message ? error.message : 'No message',
  });

  return (
    <div>
      <h1>Error 404</h1>
      <p>Página no encontrada</p>
    </div>
  );
};

export default ErrorPage;
