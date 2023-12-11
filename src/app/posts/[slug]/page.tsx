import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import styles from '../../../styles/PostsSlug.module.css'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import "@/styles/highlight-js/github-dark.css"
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight';
import CopyButton from '@/components/postSlug/CopyButton'
import ProgressBar from '@/components/postSlug/ProgressBar'
import Comments from '@/components/postSlug/Comments'

const options: any = {
    mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
    }
}

export async function generateStaticParams() {
    const files = fs.readdirSync(path.join('blogs'))

    const paths = files.map(filename => ({
        slug: filename.replace('.mdx', '')
    }))
    return paths
}

function getPost({ slug }: { slug: string }) {
    const markdownFile = fs.readFileSync(path.join('blogs', slug + '.mdx'), 'utf-8')

    const { data: frontMatter, content } = matter(markdownFile)

    return {
        frontMatter,
        slug,
        content
    }
}

export default function Post({ params }: any) {
    const props = getPost(params);
    
    return (
        <div>
            <ProgressBar />
            <div>
                <title>{props.frontMatter.title}</title>
                <article className={styles.wrap}>
                    <p className={styles.tag}>{props.frontMatter.tag}</p>
                    <p className={styles.date}>{props.frontMatter.date}</p>
                    <h1 className={styles.title}>{props.frontMatter.title}</h1>
                    <p className={styles.description}>{props.frontMatter.description}</p>
                    <div className={styles.img_wrap}>
                        <Image src={props.frontMatter.image} className={styles.image} alt='preview' width={1920} height={1080} />
                    </div>
                    <div className={styles.content}>
                        <MDXRemote source={props.content} options={options} />
                    </div>
                </article>
                <CopyButton />
                <Comments />
            </div>
        </div>
    )
}