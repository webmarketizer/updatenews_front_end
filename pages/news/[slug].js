import Link from "next/link";
import { useRouter } from "next/router";

const { BLOG_URL, CONTENT_API_KEY } = process.env;

async function getPost(slug) {
  const res = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}&fields=title,slug,html`
  ).then((res) => res.json());

  const post = res.posts;

  return post[0];
}

// Ghost CMS Request
export const getStaticProps = async ({ params }) => {
  const post = await getPost(params.slug);
  return {
    props: { post },
    revalidate: 10
  };
};

export const getStaticPaths = () => {
  // paths -> slugs which are allowed
  // fallback ->
  return {
    paths: [],
    fallback: true
  };
};

export default function News({ post }) {
  const router = useRouter();
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div>
        <Link href="/">
          <a>Go back</a>
        </Link>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
      </div>
    );
  }
}
