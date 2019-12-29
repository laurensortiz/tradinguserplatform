import { projectQuery } from '../queries';
import { Category, Country, Scope, Stage, Project } from '../models';
import _ from 'lodash';

const isEmptyOrNull = string => {
  return !string || !string.trim();
};

module.exports = {
  async create(req, res) {
    const code = req.body.code;
    const name = req.body.name;
    const countryId = req.body.country.id;
    const categoryId = req.body.category.id;
    const stageId = _.get(req, 'body.stage.id', 1);
    const scopeId = req.body.scope.id;
    const totalHoursQuoted = req.body.totalHoursQuoted || 0;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const status = req.body.status || 1;
    const observations = req.body.observations;

    if (
      isEmptyOrNull( code ) ||
      isEmptyOrNull( name )
    ) {
      return res.status( 500 ).send( {
        message: 'Please fill out all fields.',
      } );
    }

    try {
      const newProject = await Project.create( {
        code,
        name,
        countryId,
        categoryId,
        stageId,
        scopeId,
        totalHoursQuoted,
        startDate,
        endDate,
        status,
        observations,
      } );

      return res.status( 200 ).send( newProject );
    } catch (err) {
      return res.status( 500 ).send( {
        message: 'Error on create Project'
      } );
    }
  },

  async list(req, res) {
    const projects = await Project.findAll(
      projectQuery.list( { req, Scope, Stage, Category, Country } )
    );

    if (!projects) {
      return res.status( 404 ).send( {
        message: '404 on get projects',
      } );
    }

    return res.status( 200 ).send( projects );
  },

  async get(req, res) {
    const project = await Project.findByPk(
      req.params.projectId,
      projectQuery.get( { req, Scope, Stage, Category, Country } )
    );

    if (!project) {
      return res.status( 404 ).send( {
        message: '404 on project get',
      } );
    }

    return res.status( 200 ).send( project );
  },

  async update(req, res) {

    const project = await Project.findOne({
      where: {
        id: req.params.projectId,
      },
    });

    if (!project) {
      return res.status( 404 ).send( {
        message: '404 no project on update',
      } );
    }

    const updatedProject = await project.update( {
      code: req.body.code || project.code,
      name: req.body.name || project.name,
      countryId: _.get(req.body, 'country.id') || project.countryId,
      categoryId: _.get(req.body, 'category.id') || project.categoryId,
      stageId: _.get(req.body, 'stage.id') || project.stageId,
      scopeId: _.get(req.body, 'scope.id') || project.scopeId,
      totalHoursQuoted: req.body.totalHoursQuoted || project.totalHoursQuoted,
      startDate: req.body.startDate || project.startDate,
      endDate: req.body.endDate || project.endDate,
      status: req.body.status || project.status,
      observations: req.body.observations || project.observations,
    } );

    return res.status( 200 ).send( updatedProject );
  },

  async delete(req, res) {
    const project = await Project.findOne({
      where: {
        id: req.params.projectId,
      },
    });

    if (!project) {
      return res.status(404).send({
        message: 'Project Not Found',
      });
    }

    await project.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Project has been deleted',
    });
  },
};
