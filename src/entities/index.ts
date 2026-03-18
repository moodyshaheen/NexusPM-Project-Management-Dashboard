export interface Projects {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  name?: string;
  description?: string;
  status?: string;
  team?: string;
  startDate?: Date | string;
  dueDate?: Date | string;
  priority?: string;
}

export interface Tasks {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  projectId?: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date | string;
  assignedTo?: string;
  labels?: string;
}
