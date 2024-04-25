import AdminLayout from "../../components/admin/AdminLayout";
import PostManagementPage from "./post-management"

function AdminPage() {
  return <PostManagementPage />
}

AdminPage.getLayout = function (page) {
  return <AdminLayout>{page}</AdminLayout>;
}

export default AdminPage;