import type { Job } from "./interface";

export default function JobDetail({job} : {job: Job | null}) {
    if (job) {
        return (
            <div>
                <h3> {job.title}</h3>
                <p>{job.body}</p>
                <small>{job.id}</small>
            </div>

        );
    } else {
       return <p>Select a Job Listing</p>
    }
}