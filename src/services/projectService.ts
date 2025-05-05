
// This file is kept for backwards compatibility
// All project service functionality has been moved to the projects directory
import { saveProject } from './projects/projectService';
import type { ProjectSubmitData } from './projects/types';

export { saveProject };
export type { ProjectSubmitData };
