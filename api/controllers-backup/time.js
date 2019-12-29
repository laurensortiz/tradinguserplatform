import { Time, Project, User, Stage, Assignment, Task, Scope, Country, Category } from '../models';
import { timeQuery } from '../queries';
import _ from 'lodash';
import moment from "moment";
import { getWeekDays, getProjectsGroupedByWeek } from '../../common/utils';

module.exports = {
  async create(req, res) {
    try {
      const userId = _.get( req, 'user.id' );
      const time = await Time.create( {
        userId,
        date: moment.utc(req.body.date),
        projectId: req.body.project.id,
        stageId: req.body.stage.id,
        taskId: req.body.task.id,
        assignmentId: req.body.assignment.id,
        time: req.body.time,
        isOverTime: req.body.isOverTime,
        notes: req.body.notes,
        createdAt: new Date(),
      } );

      return res.status( 200 ).send( time );
    } catch (err) {
      return res.status( 500 ).send( err );
    }
  },

  async list(req, res) {
    const times = await Time.findAll(
      timeQuery.list( { req, Project, User, Stage, Assignment, Task, Scope, Category, Country } )
    );

    if (!times) {
      return res.status( 404 ).send( {
        message: '404 on Time get List',
      } );
    }

    return res.status( 200 ).send( times );
  },

  async range(req, res) {
    const day = _.get( req, 'body.day', moment().toJSON() );
    const unitOfTime = _.get( req, 'body.unitOfTime', 'week' );

    const fromDate = moment( day ).startOf( unitOfTime );
    const toDate = moment( day ).endOf( unitOfTime );

    const times = await Time.findAll(
      timeQuery.range( { req, Project, User, Stage, Assignment, Task, fromDate, toDate } )
    );

    if (!times) {
      return res.status( 404 ).send( {
        message: '404 on Time get List',
      } );
    }

    const weekDaysByRequestedDay = getWeekDays(fromDate, toDate);
    const projectTimes = getProjectsGroupedByWeek(times, weekDaysByRequestedDay);

    return res.status( 200 ).send( projectTimes );
  },

  async listAll(req, res) {
    const times = await Time.findAll(
      timeQuery.list( { req, Project, User, Stage, Assignment, Task } )
    );

    if (!times) {
      return res.status( 404 ).send( {
        message: '404 on Time get List All',
      } );
    }

    return res.status( 200 ).send( times );
  },

  async get(req, res) {
    const time = await Time.findByPk(
      req.params.timeId
    );

    if (!time) {
      return res.status( 404 ).send( {
        message: '404 on Time get',
      } );
    }

    return res.status( 200 ).send( time );
  },

  async update(req, res) {
    const time = await Time.findOne( {
      where: {
        id: req.params.timeId,
      },
    } );

    if (!time) {
      return res.status( 404 ).send( {
        message: '404 on Time update',
      } );
    }

    const updatedTime = await time.update( {
      userId: req.body.userId || time.userId,
      date: _.get(req, 'body.date', time.date),
      projectId: _.get(req, 'body.project.id', time.projectId),
      stageId: _.get(req, 'body.stage.id', time.stageId),
      taskId: _.get(req, 'body.task.id', time.taskId),
      assignmentId: _.get(req, 'body.assignment.id', time.assignmentId),
      time: req.body.time || time.time,
      isOverTime: req.body.isOverTime || time.isOverTime,
      notes: req.body.notes || time.notes,
      updatedAt: new Date(),
    } );


    return res.status( 200 ).send( updatedTime );
  },

  async delete(req, res) {
    const time = await Time.findOne( {
      where: {
        id: req.params.timeId,
      },
    } );

    if (!time) {
      return res.status( 404 ).send( {
        message: 'Time Entry Not Found',
      } );
    }

    await time.destroy();

    return res.status( 200 ).send( {
      message: 'Time Entry has been deleted',
    } );
  },

  async deleteMultiple(req, res) {
    const times = await Time.findAll( {
      where: {
        id: req.body.timeIds,
      },
    } );

    if (!times) {
      return res.status( 404 ).send( {
        message: 'Time Entry Not Found',
      } );
    }

    const deleteAllEntries = (times) => {
      return _.map(times, time => time.destroy())
    };

    await deleteAllEntries(times);

    return res.status( 200 ).send( {
      message: 'Time Entry has been deleted',
    } );
  },
};
