import type { Job } from "./interface"
import './style.css'

interface JobTableProps {
    posts: Job[],
    highlighted: Job | null,
    handleSelect: (job: Job) => void
}

export default function JobTable({posts, highlighted, handleSelect} : JobTableProps) {
    return (
        <>
            {posts.map(post => 
                <div key={post.id} onClick={() => handleSelect(post)} className={`post ${highlighted?.id === post.id ? "highlighted" : ""}`}>
                    <h3 style={{fontSize: "13px", margin: 0}}>{post.title}</h3>
                </div>
            )}
        </>
    )
}