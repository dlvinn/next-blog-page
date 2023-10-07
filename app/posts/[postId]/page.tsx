import getFormattedDate from "@/lib/getFormattedDate";
import { getPostData, getSortedPostsData } from "@/lib/posts"
import { notFound } from "next/navigation";
import Link from "next/link";
 function generateMetadata({
    params: {postId}
}: {
    params:{
        postId: string
    }
}) {
    const posts = getSortedPostsData(); //dedupe
    const post = posts.find((post)=>(post.id === postId));

    if(!post){
        return {
            title: 'Page not found'
        }
    }
    return {
        title: post.title
    }
}
export function generateStaticParams(){
    const posts = getSortedPostsData(); //dedupe
    return posts.map((post)=>({
        postId: post.id
    }))
}

export default async function Post({
    params: {postId}
}: {
    params:{
        postId: string
    }
}) {
    const posts = getSortedPostsData(); //dedupe
    if(!posts.find((post)=>(post.id === postId))){
        notFound()
    }

    const {title, date, contentHtml} = await getPostData(postId);
    const pubDate = getFormattedDate(date);

  return (
    <main className="px-6 prose prose-xl prose-slate dark:prose-invert mx-auto">
            <h1 className="text-3xl mt-4 mb-0">{title}</h1>
            <p className="mt-0">
                {pubDate}
            </p>
            <article>
                <section dangerouslySetInnerHTML={{ __html: contentHtml }} />
                <p>
                    <Link href="/">← Back to home</Link>
                </p>
            </article>
        </main>
  )
}