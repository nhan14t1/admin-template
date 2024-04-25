import Head from "next/head";
import NoLayout from "../../components/Layout/NoLayout";
import AdminLogin from "../../components/admin/login/AdminLogin";
import { WEB_NAME } from "../../shared/constants/app-const";

const AdminLoginPage = () => {
  return <>
    <Head>
      <title>{`Đăng nhập - ${WEB_NAME}`}</title>
    </Head>

    <AdminLogin />
  </>
}

AdminLoginPage.getLayout = function (page) {
  return <NoLayout>{page}</NoLayout>
}

export default AdminLoginPage;