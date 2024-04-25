import React from 'react';
import Article from "../../article";
import { appFetch } from '../../../shared/utils/apiUtils';

const PreviewPage = ({ news, query }) => {
  return <>
    <Article news={news} query={query}/>;
  </>
}

export async function getServerSideProps({query}) {
  const { id } = query;
  const data = await appFetch(`/post/preview/${id}`);
  if (!data || data.isError) {
    return {
      notFound: true,
    };
  }

  return { props: { news: data, query } };
}

export default PreviewPage;