import { Page } from '../models'

module.exports = {
  async create(req, res) {
    try {
      const page = await Page.create({
        name: req.body.name,
        content: req.body.content,
        status: 1,
        createdAt: new Date(),
      })

      return res.status(200).send(page)
    } catch (err) {
      return res.status(500).send(err)
    }
  },

  async list(req, res) {
    try {
      const pages = await Page.findAll({
        where: {
          status: 1,
        },
        order: [['id', 'DESC']],
      })

      if (!pages) {
        return res.status(404).send({
          message: '404 on Page get List',
        })
      }
      return res.status(200).send(pages)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async get(req, res) {
    try {
      const page = await Page.findByPk(req.params.id)

      if (!page) {
        return res.status(404).send({
          message: '404 on Page get',
        })
      }

      return res.status(200).send(page)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async update(req, res) {
    try {
      const page = await Page.findByPk(req.params.id)

      if (!page) {
        return res.status(404).send({
          message: '404 on Page update',
        })
      }

      const updatedPage = await page.update({
        name: req.body.name || page.name,
        content: req.body.content || page.content,
        updatedAt: new Date(),
      })

      return res.status(200).send(updatedPage)
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },

  async delete(req, res) {
    try {
      const page = await Page.findByPk(req.params.id)

      if (!page) {
        return res.status(404).send({
          message: 'Page Not Found',
        })
      }

      await page.update({
        status: 0,
      })

      return res.status(200).send({
        message: 'Page has been deleted',
      })
    } catch (err) {
      return res.status(500).send({
        message: err.message,
        name: err.name,
      })
    }
  },
}
