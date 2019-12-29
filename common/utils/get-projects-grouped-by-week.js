import groupBy from "group-array";
import flatten from "obj-flatten";
import _ from "lodash";
import moment from "moment";
import uuidv1 from "uuid/v1";


const getProjectsGroupedByWeek = (dataTimes, weekDaysBase) => {
  const projectGrouped = groupBy(dataTimes, 'projectId', 'assignmentId', 'stageId', 'taskId', 'isOverTime');
  const projects = flatten(projectGrouped);

  return _.map(projects, project => {
    let projectBase = _.sample(project);

    const weekDays =  _.map(weekDaysBase, day => {
      const hasRecord = _.find(project, time => {
        return moment.utc(day).isSame(moment.utc(time.date), 'day')
      });
      if (hasRecord) {
        return hasRecord
      } else {
        return {
          date: moment.utc(day).format(),
          id: uuidv1(),
          time: null,
          notes: '',
        }
      }
    });
    return {
      project: {
        name: projectBase['project.name'],
        code: projectBase['project.code'],
        id: projectBase['project.id'],
      },
      stage: {
        name: projectBase['stage.name'],
        code: projectBase['stage.code'],
        id: projectBase['stage.id'],
      },
      assignment: {
        name: projectBase['assignment.name'],
        id: projectBase['assignment.id'],
      },
      task: {
        name: projectBase['task.name'],
        id: projectBase['task.id'],
      },
      ...projectBase,
      weekDays: weekDays
    }
  })
};

export default getProjectsGroupedByWeek;

