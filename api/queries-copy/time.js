import _ from 'lodash';
import moment from 'moment';
import Sequelize from 'sequelize';

moment.locale( 'es' ); // Set Lang to Spanish
const Op = Sequelize.Op;

const queries = {
  list: ({ req, Project, User, Stage, Assignment, Task, Scope, Category, Country }) => {

    return {
      attributes: {
        exclude: [ 'createdAt', 'updatedAt', 'userId', 'projectId', 'stageId', 'taskId', 'assignmentId' ],
      },
      include: [
        {
          model: Project,
          as: 'project',
          attributes: [ 'id', 'name', 'code', 'startDate', 'endDate', 'totalHoursQuoted', 'status' ],
          include: [
            {
              model: Scope,
              as: 'scope',
              attributes: [ 'id', 'name', 'code' ],
            },
            {
              model: Category,
              as: 'category',
              attributes: [ 'id', 'name', 'code' ],
            },
            {
              model: Country,
              as: 'country',
              attributes: [ 'id', 'name', 'code' ],
            }
          ]
        },
        {
          model: Stage,
          as: 'stage',
          attributes: [ 'id', 'name', 'code' ]
        },
        {
          model: User,
          as: 'user',
          attributes: [ 'id', 'username' ]
        },
        {
          model: Assignment,
          as: 'assignment',
          attributes: [ 'id', 'name' ]
        },
        {
          model: Task,
          as: 'task',
          attributes: [ 'id', 'name' ]
        },
      ],
      raw: false,
      //order: [ [ { model: Task, as: 'task' }, 'name' ] ]
    };
  },
  range: ({ req, Project, User, Stage, Assignment, Task, fromDate, toDate }) => {
    const userId = _.get( req, 'user.id' );

    return {
      where: {
        userId,
        date: {
          [ Op.between ]: [ fromDate.toJSON(), toDate.toJSON() ]
        },
      },
      group: ['Time.id', 'project.id',  'stage.id',  'task.id',  'assignment.id', 'user.id'],
      attributes: {
        exclude: [ 'createdAt', 'updatedAt' ],
      },
      include: [
        {
          model: Project,
          as: 'project',
          attributes: [ 'id', 'name', 'code' ]
        },
        {
          model: Stage,
          as: 'stage',
          attributes: [ 'id', 'name', 'code' ]
        },
        {
          model: User,
          as: 'user',
          attributes: [ 'id' ]
        },
        {
          model: Assignment,
          as: 'assignment',
          attributes: [ 'id', 'name' ]
        },
        {
          model: Task,
          as: 'task',
          attributes: [ 'id', 'name' ]
        },
      ],
      raw: true,
      //order: [ [ { model: Task, as: 'task' }, 'name' ] ]
    };
  },
  listAll: ({ req, Project, User, Stage, Assignment, Task }) => {
    return {
      attributes: {
        exclude: [ 'createdAt', 'updatedAt' ],
      },
      include: [
        {
          model: Project,
          as: 'project',
          exclude: [ 'createdAt', 'updatedAt' ],
        },
        {
          model: Stage,
          as: 'stage',
          exclude: [ 'createdAt', 'updatedAt' ],
        },
        {
          model: User,
          as: 'user',
          exclude: [ 'createdAt', 'updatedAt' ],
        },
        {
          model: Assignment,
          as: 'assignment',
          exclude: [ 'createdAt', 'updatedAt' ],
        },
        {
          model: Task,
          as: 'task',
          exclude: [ 'createdAt', 'updatedAt' ],
        },
      ],
      raw: true,
      //order: [ [ { model: Task, as: 'task' }, 'name' ] ]
    };
  },
  get: ({ req, Project, User, Stage, Assignment, Task }) => {
    return {
      attributes: {
        exclude: [ 'createdAt', 'updatedAt' ],
      },
      include: [
        {
          model: Project,
          as: 'project',
          exclude: [ 'createdAt', 'updatedAt' ],
        },
        {
          model: Stage,
          as: 'stage',
          exclude: [ 'createdAt', 'updatedAt' ],
        },
        {
          model: User,
          as: 'user',
          exclude: [ 'createdAt', 'updatedAt' ],
        },
        {
          model: Assignment,
          as: 'assignment',
          exclude: [ 'createdAt', 'updatedAt' ],
        },
        {
          model: Task,
          as: 'task',
          exclude: [ 'createdAt', 'updatedAt' ],
        },
      ],
      //order: [ [ { model: Task, as: 'task' }, 'name' ] ]
    };
  },
};

export default queries;