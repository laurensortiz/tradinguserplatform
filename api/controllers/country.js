import { Country } from '../models'

module.exports = {
  async create(req, res) {
    try {
      const country = await Country.create({
        name: req.body.name,
        code: req.body.code,
        status: 1,
        createdAt: new Date(),
      })

      return res.status(200).send(country)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async list(req, res) {
    const countries = await Country.findAll({
      where: {
        status: 1,
      },
      attributes: ['id', 'name', 'code'],
      order: [['id', 'DESC']],
    })

    if (!countries) {
      return res.status(404).send({
        message: '404 on Country get List',
      })
    }
    return res.status(200).send(countries)
  },

  async get(req, res) {
    try {
      const country = await Country.findByPk(req.params.id)

      if (!country) {
        return res.status(404).send({
          message: '404 on Country get',
        })
      }

      return res.status(200).send(country)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const country = await Country.findByPk(req.params.id)

      if (!country) {
        return res.status(404).send({
          message: '404 on Country update',
        })
      }

      const updatedCountry = await country.update({
        name: req.body.name || country.name,
        code: req.body.code || country.code,
        updatedAt: new Date(),
      })

      return res.status(200).send(updatedCountry)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const country = await Country.findByPk(req.params.id)

      if (!country) {
        return res.status(404).send({
          message: 'Country Not Found',
        })
      }

      await country.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'Country has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
