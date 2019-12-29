import { JobTitle } from '../models';
import { jobTitleQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const jobTitle = await JobTitle.create({
        name: req.body.name,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(jobTitle);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const jobTitles = await JobTitle.findAll(
      jobTitleQuery.list({ req, JobTitle })
    );

    if (!jobTitles) {
      return res.status(404).send({
        message: '404 on Job Titles get List',
      });
    }

    return res.status(200).send(jobTitles);
  },

  async get(req, res) {
    const jobTitle = await JobTitle.findByPk(
      req.params.jobTitleId,
      jobTitleQuery.get({ req, JobTitle })
    );

    if (!jobTitle) {
      return res.status(404).send({
        message: '404 on Job Title get',
      });
    }

    return res.status(200).send(jobTitle);
  },

  async update(req, res) {
    const jobTitle = await JobTitle.findOne({
      where: {
        id: req.params.jobTitleId,
      },
    });

    if (!jobTitle) {
      return res.status(404).send({
        message: '404 on Job Title update',
      });
    }

    const updatedJobTitle = await jobTitle.update({
      name: req.body.name || jobTitle.name,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedJobTitle);
  },

  async delete(req, res) {
    const jobTitle = await JobTitle.findOne({
      where: {
        id: req.params.jobTitleId,
      },
    });

    if (!jobTitle) {
      return res.status(404).send({
        message: 'Job Title Not Found',
      });
    }

    //await jobTitle.destroy();
    await jobTitle.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Job Title has been deleted',
    });
  },
};
