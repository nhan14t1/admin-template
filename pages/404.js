import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function NotFound() {
  // const router = useRouter();

  // useEffect(() => {
  //   setTimeout(() => {
  //     router.back();
  //     // router.push('/');
  //   }, 3000);
  // }, []);

  return (
    <div className='not-found container'>
      <h2>Trang không tồn tại</h2>
      <h4>Chúng tôi không tìm thấy trang mà bạn muốn truy cập</h4>
      <p>
        Quay lại{' '}
        <Link href='/'>
          Trang chủ
        </Link>
      </p>
    </div>
  );
}

export default NotFound;
