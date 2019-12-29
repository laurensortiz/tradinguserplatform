import { Country } from '../models';
import { countryQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const country = await Country.create({
        name: req.body.name,
        code: req.body.code,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(country);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const countries = await Country.findAll(
      countryQuery.list({ req })
    );

    if (!countries) {
      return res.status(404).send({
        message: '404 on Country get List',
      });
    }
    return res.status(200).send(countries);
  },

  async get(req, res) {
    const country = await Country.findByPk(
      req.params.countryId
    );

    if (!country) {
      return res.status(404).send({
        message: '404 on Country get',
      });
    }

    return res.status(200).send(country);
  },

  async update(req, res) {
    const country = await Country.findOne({
      where: {
        id: req.params.countryId,
      },
    });

    if (!country) {
      return res.status(404).send({
        message: '404 on Country update',
      });
    }

    const updatedCountry = await country.update({
      name: req.body.name || country.name,
      code: req.body.code || country.code,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedCountry);
  },

  async delete(req, res) {
    const country = await Country.findOne({
      where: {
        id: req.params.countryId,
      },
    });

    if (!country) {
      return res.status(404).send({
        message: 'Country Not Found',
      });
    }

    //await country.destroy();
    await country.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Country has been deleted',
    });
  },
};
