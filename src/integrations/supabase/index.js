```javascript
import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### slider_votes

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| project_id | uuid        | string | true     |
| user_id    | uuid        | string | true     |
| slider_value | double precision | number | true |
| weight     | double precision | number | true |
| created_at | timestamptz | string | false    |
| updated_at | timestamptz | string | false    |

### groups

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| group_id   | uuid        | string | false    |
| group_name | varchar(100)| string | true     |
| description| text        | string | false    |
| created_at | timestamptz | string | false    |
| updated_at | timestamptz | string | false    |

### voting

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| project_id | uuid        | string | true     |
| user_id    | uuid        | string | true     |
| slider_value | double precision | number | true |
| user_score | int4        | number | true     |
| comment_id | uuid        | string | false    |
| created_at | timestamptz | string | false    |
| updated_at | timestamptz | string | false    |

### tasks

| name       | type        | format | required |
|------------|-------------|--------|----------|
| task_id    | uuid        | string | true     |
| user_id    | uuid        | string | true     |
| title      | varchar(255)| string | true     |
| description| text        | string | false    |
| category_id| uuid        | string | false    |
| priority   | varchar(50) | string | false    |
| status     | varchar(50) | string | false    |
| due_date   | timestamp   | string | false    |
| created_at | timestamp   | string | false    |
| updated_at | timestamp   | string | false    |

### profiles

| name       | type        | format | required |
|------------|-------------|--------|----------|
| profile_id | uuid        | string | true     |
| user_id    | uuid        | string | true     |
| bio        | text        | string | false    |
| avatar_url | varchar(255)| string | false    |
| created_at | timestamp   | string | false    |
| updated_at | timestamp   | string | false    |

### task_tags

| name       | type        | format | required |
|------------|-------------|--------|----------|
| task_id    | uuid        | string | true     |
| tag_id     | uuid        | string | true     |

### projects

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| project_id | uuid        | string | false    |
| project_name | varchar(100)| string | true     |
| description| text        | string | false    |
| start_date | timestamptz | string | false    |
| end_date   | timestamptz | string | false    |

### files

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| file_id    | uuid        | string | false    |
| uploader_id| uuid        | string | true     |
| file_name  | text        | string | true     |
| file_type  | text        | string | false    |
| file_size  | int8        | number | false    |
| upload_date| timestamptz | string | false    |
| version    | int4        | number | false    |
| is_active  | bool        | boolean| false    |
| group_id   | uuid        | string | false    |

### user_scores

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| user_id    | uuid        | string | true     |
| score      | int4        | number | true     |
| created_at | timestamptz | string | false    |
| updated_at | timestamptz | string | false    |

### comments

| name       | type        | format | required |
|------------|-------------|--------|----------|
| comment_id | uuid        | string | true     |
| task_id    | uuid        | string | true     |
| user_id    | uuid        | string | true     |
| content    | text        | string | true     |
| created_at | timestamp   | string | false    |

### tags

| name       | type        | format | required |
|------------|-------------|--------|----------|
| tag_id     | uuid        | string | true     |
| tag_name   | varchar(50) | string | true     |
| tag_description | text   | string | false    |

### users

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| user_id    | uuid        | string | false    |
| username   | varchar(100)| string | true     |
| group_id   | uuid        | string | false    |
| created_at | timestamptz | string | false    |
| updated_at | timestamptz | string | false    |
| email      | varchar(100)| string | true     |
| password_hash | varchar(255)| string | true   |
| first_name | varchar(50) | string | false    |
| last_name  | varchar(50) | string | false    |

### sessions

| name       | type        | format | required |
|------------|-------------|--------|----------|
| session_id | uuid        | string | true     |
| user_id    | uuid        | string | true     |
| token      | varchar(255)| string | true     |
| created_at | timestamp   | string | false    |
| expires_at | timestamp   | string | false    |

### categories

| name       | type        | format | required |
|------------|-------------|--------|----------|
| category_id| uuid        | string | true     |
| name       | varchar(50) | string | true     |
*/

// Hooks for slider_votes
export const useSliderVotes = () => useQuery({
    queryKey: ['slider_votes'],
    queryFn: () => fromSupabase(supabase.from('slider_votes').select('*')),
});

export const useSliderVote = (id) => useQuery({
    queryKey: ['slider_votes', id],
    queryFn: () => fromSupabase(supabase.from('slider_votes').select('*').eq('id', id).single()),
});

export const useAddSliderVote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newSliderVote) => fromSupabase(supabase.from('slider_votes').insert([newSliderVote])),
        onSuccess: () => {
            queryClient.invalidateQueries('slider_votes');
        },
    });
};

export const useUpdateSliderVote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedSliderVote) => fromSupabase(supabase.from('slider_votes').update(updatedSliderVote).eq('id', updatedSliderVote.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('slider_votes');
        },
    });
};

export const useDeleteSliderVote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('slider_votes').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('slider_votes');
        },
    });
};

// Hooks for groups
export const useGroups = () => useQuery({
    queryKey: ['groups'],
    queryFn: () => fromSupabase(supabase.from('groups').select('*')),
});

export const useGroup = (id) => useQuery({
    queryKey: ['groups', id],
    queryFn: () => fromSupabase(supabase.from('groups').select('*').eq('id', id).single()),
});

export const useAddGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newGroup) => fromSupabase(supabase.from('groups').insert([newGroup])),
        onSuccess: () => {
            queryClient.invalidateQueries('groups');
        },
    });
};

export const useUpdateGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedGroup) => fromSupabase(supabase.from('groups').update(updatedGroup).eq('id', updatedGroup.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('groups');
        },
    });
};

export const useDeleteGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('groups').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('groups');
        },
    });
};

// Hooks for voting
export const useVoting = () => useQuery({
    queryKey: ['voting'],
    queryFn: () => fromSupabase(supabase.from('voting').select('*')),
});

export const useVote = (id) => useQuery({
    queryKey: ['voting', id],
    queryFn: () => fromSupabase(supabase.from('voting').select('*').eq('id', id).single()),
});

export const useAddVote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newVote) => fromSupabase(supabase.from('voting').insert([newVote])),
        onSuccess: () => {
            queryClient.invalidateQueries('voting');
        },
    });
};

export const useUpdateVote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedVote) => fromSupabase(supabase.from('voting').update(updatedVote).eq('id', updatedVote.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('voting');
        },
    });
};

export const useDeleteVote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('voting').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('voting');
        },
    });
};

// Hooks for tasks
export const useTasks = () => useQuery({
    queryKey: ['tasks'],
    queryFn: () => fromSupabase(supabase.from('tasks').select('*')),
});

export const useTask = (id) => useQuery({
    queryKey: ['tasks', id],
    queryFn: () => fromSupabase(supabase.from('tasks').select('*').eq('task_id', id).single()),
});

export const useAddTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTask) => fromSupabase(supabase.from('tasks').insert([newTask])),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedTask) => fromSupabase(supabase.from('tasks').update(updatedTask).eq('task_id', updatedTask.task_id)),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('tasks').delete().eq('task_id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};

// Hooks for profiles
export const useProfiles = () => useQuery({
    queryKey: ['profiles'],
    queryFn: () => fromSupabase(supabase.from('profiles').select('*')),
});

export const useProfile = (id) => useQuery({
    queryKey: ['profiles', id],
    queryFn: () => fromSupabase(supabase.from('profiles').select('*').eq('profile_id', id).single()),
});

export const useAddProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProfile) => fromSupabase(supabase.from('profiles').insert([newProfile])),
        onSuccess: () => {
            queryClient.invalidateQueries('profiles');
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedProfile) => fromSupabase(supabase.from('profiles').update(updatedProfile).eq('profile_id', updatedProfile.profile_id)),
        onSuccess: () => {
            queryClient.invalidateQueries('profiles');
        },
    });
};

export const useDeleteProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('profiles').delete().eq('profile_id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('profiles');
        },
    });
};

// Hooks for task_tags
export const useTaskTags = () => useQuery({
    queryKey: ['task_tags'],
    queryFn: () => fromSupabase(supabase.from('task_tags').select('*')),
});

export const useTaskTag = (task_id, tag_id) => useQuery({
    queryKey: ['task_tags', task_id, tag_id],
    queryFn: () => fromSupabase(supabase.from('task_tags').select('*').eq('task_id', task_id).eq('tag_id', tag_id).single()),
});

export const useAddTaskTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTaskTag) => fromSupabase(supabase.from('task_tags').insert([newTaskTag])),
        onSuccess: () => {
            queryClient.invalidateQueries('task_tags');
        },
    });
};

export const useUpdateTaskTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedTaskTag) => fromSupabase(supabase.from('task_tags').update(updatedTaskTag).eq('task_id', updatedTaskTag.task_id).eq('tag_id', updatedTaskTag.tag_id)),
        onSuccess: () => {
            queryClient.invalidateQueries('task_tags');
        },
    });
};

export const useDeleteTaskTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (task_id, tag_id) => fromSupabase(supabase.from('task_tags').delete().eq('task_id', task_id).eq('tag_id', tag_id)),
        onSuccess: () => {
            queryClient.invalidateQueries('task_tags');
        },
    });
};

// Hooks for projects
export const useProjects = () => useQuery({
    queryKey: ['projects'],
    queryFn: () => fromSupabase(supabase.from('projects').select('*')),
});

export const useProject = (id) => useQuery({
    queryKey: ['projects', id],
    queryFn: () => fromSupabase(supabase.from('projects').select('*').eq('id', id).single()),
});

export const useAddProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProject) => fromSupabase(supabase.from('projects').insert([newProject])),
        onSuccess: () => {
            queryClient.invalidateQueries('projects');
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedProject) => fromSupabase(supabase.from('projects').update(updatedProject).eq('id', updatedProject.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('projects');
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('projects').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('projects');
        },
    });
};

// Hooks for files
export const useFiles = () => useQuery({
    queryKey: ['files'],
    queryFn: () => fromSupabase(supabase.from('files').select('*')),
});

export const useFile = (id) => useQuery({
    queryKey: ['files', id],
    queryFn: () => fromSupabase(supabase.from('files').select('*').eq('id', id).single()),
});

export const useAddFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newFile) => fromSupabase(supabase.from('files').insert([newFile])),
        onSuccess: () => {
            queryClient.invalidateQueries('files');
        },
    });
};

export const useUpdateFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedFile) => fromSupabase(supabase.from('files').update(updatedFile).eq('id', updatedFile.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('files');
        },
    });
};

export const useDeleteFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('files').delete().eq('id', id)),
        onSuccess: