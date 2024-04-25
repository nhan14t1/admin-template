import AdminLayout from "../../../components/admin/AdminLayout";
import React from 'react';
import dynamic from 'next/dynamic';
import Head from "next/head";
import { WEB_NAME } from "../../../shared/constants/app-const";

const NewPost = dynamic(() => import('../../../components/admin/post-management/NewPost'), { ssr: false });

const NewPostPage = () => {
  return <>
    <Head>
      <title>{`Tạo bài viết - ${WEB_NAME}`}</title>
    </Head>
    <NewPost />
  </>
}

NewPostPage.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
}

export default NewPostPage;