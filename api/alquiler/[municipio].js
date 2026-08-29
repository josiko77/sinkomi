// api/alquiler/[municipio].js
const { generateMunicipioPage } = require('../_municipios-helper');

module.exports = async (req, res) => {
  await generateMunicipioPage(req, res, 'alquiler');
};
