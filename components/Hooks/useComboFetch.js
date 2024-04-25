import { useEffect, useState } from 'react';
import { get } from '../../shared/utils/apiUtils';

function useComboFetch() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [topPosts, setTopPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const [nationalPosts, setNationalPosts] = useState([]);
  const [internationalPosts, setInternationalPosts] = useState([]);
  const [tipPosts, setTipPosts] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    get('/post/home-page').then(res => {
      if (res && res.data) {
        const { topPosts, newPosts, nationalPosts, internationalPosts, tipPosts } = res.data;
        setTopPosts(topPosts);
        setNewPosts(newPosts);
        setNationalPosts(nationalPosts || []);
        setInternationalPosts(internationalPosts || []);
        setTipPosts(tipPosts || []);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return { loading, error, topPosts, newPosts, nationalPosts, internationalPosts, tipPosts };
}

export default useComboFetch;
