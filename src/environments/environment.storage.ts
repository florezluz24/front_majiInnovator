/**
 * Build para Azure Storage (sitio estático).
 * Cambia la IP por la EXTERNAL-IP de: kubectl get svc ms-maji-innovator -n maji-innovator
 */
export const environment = {
  production: true,
  apiUrl: 'clea119.229/api',
};
