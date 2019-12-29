import { flatMap } from 'lodash';
import { Task, StageTask, Stage, Scope } from '../models';
import { stageQuery, taskQuery } from '../queries';

const filterTasks = (completeList) => {
  return flatMap( completeList, list => list.task )
};

module.exports = {
  async create(req, res) {
    try {
      const task = await Task.create( {
        name: req.body.name,
        status: 1,
        createdAt: new Date(),
      } );

      return res.status( 200 ).send( task );
    } catch (err) {
      return res.status( 500 ).send( err );
    }
  },

  async list(req, res) {
    const tasks = await Task.findAll(
      taskQuery.list( { req } )
    );

    if (!tasks) {
      return res.status( 404 ).send( {
        message: '404 on Task get List',
      } );
    }

    return res.status( 200 ).send( tasks );
  },

  async listByScopeStage(req, res) {
    const stageTaskScopeStage = await StageTask.findAll(
      taskQuery.listByScopeStage( { req, Task, Stage, Scope } )
    );

    if (!stageTaskScopeStage) {
      return res.status( 404 ).send( {
        message: '404 on Task get List by Scope Stage',
      } );
    }

    return res.status( 200 ).send( filterTasks( stageTaskScopeStage ) );
  },

  async get(req, res) {
    const task = await Task.findByPk(
      req.params.taskId
    );

    if (!task) {
      return res.status( 404 ).send( {
        message: '404 on Task get',
      } );
    }

    return res.status( 200 ).send( task );
  },

  async update(req, res) {
    const task = await Task.findOne( {
      where: {
        id: req.params.taskId,
      },
    } );

    if (!task) {
      return res.status( 404 ).send( {
        message: '404 on Task update',
      } );
    }

    const updatedTask = await task.update( {
      name: req.body.name || task.name,
      updatedAt: new Date(),
    } );

    return res.status( 200 ).send( updatedTask );
  },

  async delete(req, res) {
    const task = await Task.findOne( {
      where: {
        id: req.params.taskId,
      },
    } );

    if (!task) {
      return res.status( 404 ).send( {
        message: 'Task Not Found',
      } );
    }

    //await task.destroy();
    await task.update( {
      status: 0,
    } );

    return res.status( 200 ).send( {
      message: 'Task has been deleted',
    } );
  },
};
