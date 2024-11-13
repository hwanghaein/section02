import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import style from "./[id].module.css";
import fetchOneBook from "@/lib/fetch-one-book";
import { useRouter } from 'next/router';


export const getStaticPaths = () => {
  return {
    // 어떤 경로들(URL 파라미터들)이 존재할 수 있는지 배열로 반환
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }, { params: { id: "3" } }],
    fallback:
      true, // SSR 방식 + 데이터가 없는 fallback 상태의 페이지부터 보내주고, 데이터는 후속으로 보내줌
  }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params!.id; // 타입 단언을 써도 안전한 이유는 [id].tsx 페이지는 무조건 URL 파라미터가 하나 있어야만 접근할 수 있는 페이지이기 때문임
  const book = await fetchOneBook(Number(id))

  if (!book) {
    return {
      notFound: true,
    }
  }

  return {
    props: { book, },
  };
}

export default function Page({ book, }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  if (router.isFallback) return "로딩중입니다"

  if (!book) return "문제가 발생했습니다. 다시 시도하세요."
  const { title, subTitle, description, author, publisher, coverImgUrl } = book;

  return (
    <div className={style.container}>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <img src={coverImgUrl} alt={`${title} cover`} />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>{author} | {publisher}</div>

      <div className={style.description}>{description}</div>
    </div>
  );
}
