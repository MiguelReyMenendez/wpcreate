import net from 'net';

export async function checkAvailablePort(startingPort) {
  const port = startingPort;

  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.unref(); // Permitir que el proceso principal salga si el servidor está activo
    server.on('error', () => {
      resolve(checkAvailablePort(port + 1));
    });

    server.listen(port, () => {
      server.close(() => resolve(port));
    });
  });
}
