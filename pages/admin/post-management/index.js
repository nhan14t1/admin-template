import Head from "next/head";
import AdminLayout from "../../../components/admin/AdminLayout";
import PostManagement from "../../../components/admin/post-management/PostManagement";
import { WEB_NAME } from "../../../shared/constants/app-const";

function PostManagementPage() {
  return <>
    <Head>
      <title>{`Quản lý bài đăng - ${WEB_NAME}`}</title>
    </Head>
    <PostManagement />;
  </>
}

PostManagementPage.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
}

export default PostManagementPage;