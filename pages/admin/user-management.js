import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";
import { WEB_NAME } from "../../shared/constants/app-const";
import UserManagement from "../../components/admin/user-management/UserManagement";

function UserManagementPage() {
  return <>
    <Head>
      <title>{`Quản lý người dùng - ${WEB_NAME}`}</title>
    </Head>

    <UserManagement />
  </>;
}

UserManagementPage.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
}

export default UserManagementPage;