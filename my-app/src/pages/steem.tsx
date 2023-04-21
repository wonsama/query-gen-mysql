import Link from 'next/link';
import moment from 'moment-timezone';

export default function Steem({ posts }: { posts: IPostResult[] }) {
  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.post_id}
          className="rounded-lg border-8 border-transparent"
        >
          <div className="pl-0">
            <span>
              [
              {moment(post.created + '.000Z')
                .tz('Asia/Seoul')
                .format('YYYY-MM-DD HH:mm:ss')}
              ]
            </span>
            <span className="pl-2 text-green-300">{post.author}</span>
          </div>
          <div>
            <Link
              href={'https://steemit.com' + post.url}
              target="_blank"
              className="pl-10"
            >
              <p className="w-1/2 text-xl underline decoration-sky-500 text-ellipsis overflow-hidden">
                {post.title}
              </p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function rpc20(method: string, params: IBlogParam[], id: number = 1) {
  return {
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
}

interface IBlogParam {
  tag: string;
  limit: number;
  filter_tags?: string[];
  select_authors?: string[];
  select_tags?: string[];
  truncate_body?: number;
}

interface IPostResult {
  post_id: number;
  author: string;
  permlink: string;
  category: string;
  parent_author: string;
  parent_permlink: string;
  title: string;
  body: string;
  json_metadata: string;
  last_update: string;
  created: string;
  url: string;
}

export async function getStaticProps() {
  const API_URL: string = 'https://api.steemit.com';
  const method: string = 'condenser_api.get_discussions_by_created';
  const params: IBlogParam[] = [
    {
      tag: 'kr-dev', // 태그
      limit: 100, // 보여 줄 글 수 (최대 100)
      // filter_tags: ['kr'],
      // select_authors: ['wonsama'],
      // select_tags: ['kr'],
      truncate_body: 100, // 본문 자르기 (0: 전체)
    },
  ];
  const OPTIONS = rpc20(method, params);
  const res = await fetch(API_URL, OPTIONS);
  const json = await res.json();
  const posts: IPostResult[] = json.result;

  return {
    props: {
      posts,
    },
  };
}
