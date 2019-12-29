import { Assignment } from '../models';
import { assignmentQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const assignment = await Assignment.create({
        name: req.body.name,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(assignment);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const assignments = await Assignment.findAll(
      assignmentQuery.list({ req })
    );

    if (!assignments) {
      return res.status(404).send({
        message: '404 on Assignment get List',
      });
    }

    return res.status(200).send(assignments);
  },

  async get(req, res) {
    const assignment = await Assignment.findByPk(
      req.params.assignmentId
    );

    if (!assignment) {
      return res.status(404).send({
        message: '404 on Assignment get',
      });
    }

    return res.status(200).send(assignment);
  },

  async update(req, res) {
    const assignment = await Assignment.findOne({
      where: {
        id: req.params.assignmentId,
      },
    });

    if (!assignment) {
      return res.status(404).send({
        message: '404 on Assignment update',
      });
    }

    const updatedAssignment = await assignment.update({
      name: req.body.name || assignment.name,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedAssignment);
  },

  async delete(req, res) {
    const assignment = await Assignment.findOne({
      where: {
        id: req.params.assignmentId,
      },
    });

    if (!assignment) {
      return res.status(404).send({
        message: 'Assignment Not Found',
      });
    }

    //await assignment.destroy();
    await assignment.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Assignment has been deleted',
    });
  },
};
