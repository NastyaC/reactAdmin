import { useState, useEffect } from "react";

export default function useFetch(url, options) {
  const [data, setData] = useState([]);
  const [totalCount, setCount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    fetch(url, options)
      .then(response => {
        setCount(response.headers.get("X-Total-Count"));
        return response.json();
      })
      .then(data => {
        // console.log(url);
        // console.log(data);
        setLoading(false);
        return setData(data);
      })
      .catch(error => {
        setLoading(false);
        setError(error);
      });
  }, [url]);

  return { data, totalCount, isLoading, error };
}
