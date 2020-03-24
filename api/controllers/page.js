import { Page } from '../models';
import { pageQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const page = await Page.create({
        name: req.body.name,
        content: req.body.content,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(page);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const pages = await Page.findAll(
      pageQuery.list({ req })
    );

    if (!pages) {
      return res.status(404).send({
        message: '404 on Page get List',
      });
    }
    return res.status(200).send(pages);
  },

  async get(req, res) {
    const page = await Page.findByPk(
      req.params.pageId
    );

    if (!page) {
      return res.status(404).send({
        message: '404 on Page get',
      });
    }

    return res.status(200).send(page);
  },

  async update(req, res) {
    const page = await Page.findOne({
      where: {
        id: req.params.pageId,
      },
    });

    if (!page) {
      return res.status(404).send({
        message: '404 on Page update',
      });
    }

    const updatedPage = await page.update({
      name: req.body.name || page.name,
      content: req.body.content || page.content,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedPage);
  },

  async delete(req, res) {
    const page = await Page.findOne({
      where: {
        id: req.params.pageId,
      },
    });

    if (!page) {
      return res.status(404).send({
        message: 'Page Not Found',
      });
    }

    //await page.destroy();
    await page.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Page has been deleted',
    });
  },
};
