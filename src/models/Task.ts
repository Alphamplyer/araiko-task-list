import { v4 as uuid } from 'uuid';

export class TaskNode {
  parent?: TaskNode;
  children: TaskNode[];

  constructor(parent?: TaskNode, children: TaskNode[] = []) {
    this.parent = parent;
    this.children = children;
  }

  addChild(newTask: TaskNode): TaskNode {
    newTask.parent = this;
    this.children.push(newTask);
    return this;
  }

  removeChild(child: TaskNode): TaskNode {
    this.children = this.children.filter(c => c !== child);
    return this;
  }

  getChildren(): TaskNode[] {
    return this.children;
  }
}

export class RootTaskNode extends TaskNode {
  constructor(children: Task[] = []) {
    super(undefined, children);
    children.forEach(c => c.parent = this);
  }
}

export class Task extends TaskNode {
  readonly id: string;
  name: string;
  finished: boolean;
  createdAt: Date;
  finishedAt?: Date;

  private constructor(id: string, name: string, finished: boolean, createdAt: Date, children: Task[] = [], parent?: Task, finishedAt?: Date) {
    super(parent, children);
    this.id = id;
    this.name = name;
    this.finished = finished;
    this.createdAt = createdAt;
    this.finishedAt = finishedAt;
  }

  public static create(name: string, parent?: Task): Task {
    return new Task(uuid(), name, false, new Date(), [], parent);
  }

  canBeFinished(): boolean {
    return this.children.every(child => (child as Task).finished);
  }

  markParentAsFinishedIfAllChildTasksAreFinished(parent?: TaskNode): void {
    if (!parent || !(parent instanceof Task)) {
      return;
    }

    if (parent.canBeFinished()) {
      parent.finished = true;
      parent.finishedAt = new Date();
      parent.markParentAsFinishedIfAllChildTasksAreFinished(parent.parent);
    }
  }

  markAsFinished(): void {
    if (this.canBeFinished()) {
      this.finished = true;
      this.finishedAt = new Date();
    }

    this.markParentAsFinishedIfAllChildTasksAreFinished(this.parent);
  }

  markAsUnfinished(): void {
    this.finished = false;
    this.finishedAt = undefined;

    if (this.children.length > 0) {
      this.children.forEach(child => (child as Task).markAsUnfinished());
    }
  }

  delete(): void {
    if (!this.parent) {
      return;
    }

    this.parent.removeChild(this);
  }
}