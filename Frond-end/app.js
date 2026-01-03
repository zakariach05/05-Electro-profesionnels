// Exemple minimal d'utilisation d'Axios pour appeler l'API Laravel
const axios = require('axios');

// Configurez la baseURL vers votre backend
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true, // si vous utilisez des cookies/CSRF
});

async function fetchProducts() {
  try {
    const res = await api.get('/products'); // adaptez le chemin selon votre API
    console.log('Produits:', res.data);
  } catch (err) {
    console.error('Erreur fetchProducts:', err.response ? err.response.data : err.message);
  }
}

// Exemple pour charger une image publique stockée via storage
function productImageUrl(filename) {
  return `http://127.0.0.1:8000/storage/${filename}`;
}

async function test() {
  await fetchProducts();
  console.log('Exemple URL image:', productImageUrl('products/eYDiBdLR03IYGssUwCRojtKpgUt7CYXS0J6b4HBU.jpg'));
}

// Exécute le test si lancé avec node
if (require.main === module) test();

module.exports = { api, fetchProducts, productImageUrl };
